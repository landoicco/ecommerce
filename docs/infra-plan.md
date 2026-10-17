# AWS Infrastructure Plan

## Goal

Deploy the project to AWS with Terraform, in two environments:

- **demo**: public portfolio demo at `fondas.licaza.dev` (tentative), capped at **~$1 USD/month**.
- **prod**: infrastructure for real, sustained use. Validated with `plan` and Infracost; only applied ephemerally.

The same application image runs in both environments; only infrastructure and configuration change. Product scope lives in [product-spec.md](product-spec.md).

Assumptions: the account has no credits or 12-month free tier (only *always-free*), the region is `us-east-1`, and the `licaza.dev` hosted zone already exists in Route 53.

## Demo architecture

```
fondas.licaza.dev (alias record in the existing hosted zone, ACM certificate)
        │
   CloudFront ── /*        → S3: landing page explaining the app + "Start demo" button
              ── /wake     → Lambda: Turnstile → access code or quota (DynamoDB) → EC2 spot
              ── /status   → Lambda: boot stages + remaining quota
              ── /api/*    → CloudFront Function + KeyValueStore → EC2 (dynamic origin)
```

- **Ephemeral `t4g.small` spot instance:** it is terminated, not stopped, so no EBS volume is left accruing charges. Falls back to on-demand when spot capacity is unavailable.
- **docker compose on the instance:** Spring Boot + PostgreSQL (PostGIS image). The database resets every session and is seeded with sample fondas and menus.
- **Images on GHCR** (public, multi-arch) and the public ECS-optimized AL2023 arm64 AMI.
- **Minimal VPC:** public subnets only, no NAT. The security group only allows the CloudFront prefix list. Instance access via SSM Session Manager, no SSH.
- **Configuration in SSM Parameter Store**, not Secrets Manager.

## Cost guardrails (demo)

| # | Guardrail | Value |
|---|---|---|
| 1 | Start only from the button, validated with Cloudflare Turnstile | No automatic start |
| 2 | Function URLs reachable only through CloudFront (OAC + IAM) | — |
| 3 | Concurrent instances | Max 1; the `/wake` Lambda has reserved concurrency of 1 |
| 4 | Pessimistic quota reservation with a conditional write in DynamoDB | 30 min per reservation |
| 5 | Session limit | 60 min |
| 6 | Idle shutdown | 15 min without requests |
| 7 | Daily quota | 3 h |
| 8 | Monthly quota | 60 h (~$0.66) |
| 9 | Instance TTL: `shutdown` with `terminate` behavior | 70 min |
| 10 | Nightly Lambda that terminates instances tagged `demo` | Daily |
| 11 | AWS Budgets → SNS → kill switch Lambda (`demo_enabled=false` + terminate instance) | Alerts at $0.50 and $1 |
| 12 | CloudFront: free flat-rate plan if compatible; otherwise rate limiting in Spring with Bucket4j | — |
| 13 | CloudWatch Logs with short retention | 7 days |
| 14 | No paid WhatsApp messages in demo (OTP shown on screen, Meta test number only) | $0 |

When the quota runs out, the frontend shows a video or GIF of the demo and a link to the portfolio.

## Prod (summary)

- **Frontend:** CloudFront + WAF + S3.
- **Backend:** ALB → ECS Fargate (ARM) across 2 AZs with autoscaling, and images on ECR.
- **Data and secrets:** RDS PostgreSQL (PostGIS) Multi-AZ, with the password in Secrets Manager.
- **Scheduled jobs:** daily menu notifications and order state updates (EventBridge Scheduler or Spring `@Scheduled` + ShedLock).
- **Notifications:** WhatsApp Cloud API with daily send caps; credentials in Secrets Manager.
- **Network:** NAT configurable through `nat_mode`.
- **Domain:** `domain_name` variable (e.g. `mifondita.com`).
- **Cost:** estimated at ~$110–150/month; published by Infracost on every PR.

## Terraform layout

```
infra/
├── bootstrap/            # state bucket, GitHub OIDC, CI roles, Budgets
├── modules/
│   ├── network/          # VPC; private_subnets and nat_mode are configurable
│   ├── frontend/         # S3 + CloudFront + OAC + ACM; takes the API behaviors as input
│   ├── backend-ondemand/ # launch template, Lambdas, DynamoDB, KVS, CF Function, guardrails
│   ├── backend-ecs/      # ECR, ECS, ALB, autoscaling
│   ├── database/         # RDS
│   └── observability/    # alarms, dashboard
├── envs/
│   ├── demo/
│   └── prod/
└── lambdas/              # Python: wake, status, sweeper, killswitch
```

- One directory per environment, each with its own state.
- State in S3 with `use_lockfile`.
- `default_tags` on the provider: `Project`, `Env`, `ManagedBy`.

## Repository safeguards

Every change reaches `main` through a PR that passed CI. This is in place before the infrastructure work, because Phase 4 will apply Terraform on merges to `main`.

**CI** (`.github/workflows/ci.yml`), on PRs to `main` and on pushes to `main`:

| Job | Checks |
|---|---|
| `Backend` | `mvn verify`: Spotless, compilation, tests (Flyway migrations on PostgreSQL via Testcontainers) |
| `Frontend` | `npm ci`, Prettier, ESLint, Vitest, build |
| `Docker images` | Both Dockerfiles build |

The workflow has read-only permissions, actions are pinned to a commit SHA, and Dependabot (`.github/dependabot.yml`) keeps those pins updated.

**Ruleset on `main`** (configured in GitHub under *Settings → Rules → Rulesets*):

- Restrict deletions and block force pushes.
- Require a pull request before merging, with conversation resolution. Required approvals stay at 0: with a single maintainer, 1 would block every merge.
- Require the status checks `Backend`, `Frontend` and `Docker images`, and require branches to be up to date before merging.
- No bypass list, so the rules apply to the maintainer too.

**Repository security settings** (free for public repositories): secret scanning with push protection, and Dependabot alerts.

## Work phases

### Phase 0: Prepare the app
Infra-related app changes only; the product rework is tracked in [product-spec.md](product-spec.md).

- [x] Migrate from MariaDB to PostgreSQL (driver, Flyway migrations, compose)
- [ ] App CI on every PR and a ruleset on `main` (see [Repository safeguards](#repository-safeguards))
- [ ] Add `.env.example` and remove `.env` from the repo
- [ ] Replace `System.out.println` with SLF4J and align on Java 21
- [ ] Non-root user in the Dockerfiles; memory limits (JVM and PostgreSQL)
- [ ] Frontend: relative API path `/api`, read `config.json` (`mode: demo|prod`)
- [ ] Landing page with backend state: asleep, waking up, ready, or out of quota
- [ ] Rename the project to `itacatl` in a rename-only PR (Java package, Maven, compose, docs), then rename the GitHub repository. It must land before Phase 1, because the GitHub OIDC trust policy and the GHCR image paths contain the repository name.

**Done when:** `docker compose up` works as before, the frontend no longer depends on `VITE_API_BASE_URL`, and the project is named `itacatl`.

### Phase 1: Bootstrap
- [ ] Add to `flake.nix`: `terraform`, `awscli2`, `tflint`, `trivy`, `terraform-docs`, `infracost`
- [ ] `bootstrap/`: state bucket, OIDC, plan/apply roles, Budgets and SNS
- [ ] Migrate the bootstrap state to S3

**Done when:** remote state exists and Budgets alerts arrive.

### Phase 2: Network and frontend
- [ ] `network` module (demo mode)
- [ ] `frontend` module with ACM and an alias record in `licaza.dev`
- [ ] Publish the build to S3

**Done when:** `https://fondas.licaza.dev` serves the landing page.

### Phase 3: On-demand backend
- [ ] CI publishing multi-arch images to GHCR
- [ ] Launch template, user-data, IAM role and security group
- [ ] Spike: validate `cf.updateRequestOrigin` + KeyValueStore (fallback: dynamic hostname)
- [ ] `wake` and `status` Lambdas, DynamoDB quota table, Turnstile
- [ ] Idle shutdown, TTL, nightly Lambda and kill switch
- [ ] Test every guardrail: force the quota, TTL, idle shutdown and kill switch

**Done when:** the demo starts from the button, shuts itself down, and every guardrail has been verified.

### Phase 4: CI/CD
- [ ] `fmt`, `validate`, `tflint`, `trivy` and `terraform test` on PRs
- [ ] `plan` on PRs, `apply` on `main`, manual approval for prod
- [ ] Infracost on PRs

### Phase 5: Prod
- [ ] `backend-ecs`, `database` and `observability` modules, and `envs/prod`
- [ ] Ephemeral apply, capture evidence, then `destroy`

### Phase 6: Documentation
- [ ] README with diagram, cost table and guardrails
- [ ] ADRs in `docs/adr/`

## ADRs to write

Written: [0001 Rewrite the existing Flyway migrations for PostgreSQL](adr/0001-rewrite-migrations-for-postgresql.md).

1. Ephemeral EC2 spot for demo instead of Fargate or Lambda + Aurora
2. One directory per environment instead of workspaces
3. Dynamic CloudFront origin for a backend with a changing IP
4. Pessimistic quota with DynamoDB conditional writes
5. GHCR for demo, ECR for prod
6. Terraform vs CDK

## Open decisions

- Access codes for recruiters (proposed for after Phase 3).
- Compatibility of the CloudFront flat-rate plan with Functions, KVS and Lambda origins.
