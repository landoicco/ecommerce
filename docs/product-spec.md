# Product Spec

> Working name: **MiFondita**. Final name and production domain are not decided yet.

## Vision

A multi-tenant marketplace for *fondas* and *cocinas económicas*: small, often informal Mexican eateries whose menu changes every day. Each fonda publishes its daily menu; diners browse today's menus across fondas, pick the one they like, and reserve their food for pickup.

The project has three goals:

1. **Infrastructure:** clean, robust and very cheap (demo capped at ~$1/month), with an optional production-grade setup. See [infra-plan.md](infra-plan.md).
2. **Engineering showcase:** production-quality Java, Spring Boot and React.
3. **A real use case:** built around how fondas actually operate in Mexico (daily menus, limited portions, cash or bank transfer, WhatsApp).

## Roles

| Role | Description |
|---|---|
| Platform admin | Manages the platform and the fondas registered on it |
| Fonda owner | Registers a fonda, manages its profile, menu, staff and settings |
| Fonda staff | Updates availability and handles orders (confirm payments, mark ready or delivered) |
| Diner | Browses menus, reserves orders, subscribes to fondas. No account: name + WhatsApp-verified phone |

## Multi-tenancy

- One deployment hosts many fondas; each fonda is a tenant with its own menu, data and users.
- Shared database and schema with a `tenant_id` discriminator (Hibernate `@TenantId`).
- PostgreSQL Row-Level Security as a second layer of tenant isolation.

## Daily menu

- **Structure:** a *comida corrida* combo made of courses (soup, rice or pasta, main dish, dessert, drink of the day) at a fixed price, plus à la carte dishes.
- **Portions:** each dish on today's menu has a limited number of portions.
- **Fast, mobile-first editing for owners:**
  - Duplicate yesterday's menu.
  - Pick from a catalog of recurring dishes.
  - Mark a dish as sold out in one tap.
- **Real-time availability for diners** (SSE or WebSockets), e.g. "3 portions of mole left".
- **Sharing:** shareable link and image for WhatsApp.

## Discovery (diner)

- Browse today's menus across fondas.
- Full-text search over today's dishes in Spanish ("who has chiles rellenos today?").
- Filter by distance (PostGIS), price, and opening hours.

## Orders

### Payment methods, configurable per fonda

1. **Cash on pickup:** the order holds portions for a pickup window (e.g. 1 h). If it is not picked up, it expires and the portions return to the menu.
2. **Bank transfer (SPEI):**
   - The app shows the fonda's CLABE and a unique order reference to use as the transfer concept.
   - The diner marks the order as paid and can optionally upload the receipt.
   - Staff confirm the payment.
3. **Payment gateway (future):** Mercado Pago or CoDi, as another adapter behind a payment port.

### Order states

```
Cash:      RESERVED ──────────────────────────────────────► READY ─► DELIVERED
Transfer:  PENDING_PAYMENT ─► PAYMENT_SUBMITTED ─► CONFIRMED ─► READY ─► DELIVERED
Any active state ─► EXPIRED / CANCELLED   (portions return to the menu)
```

### Rules

- **Computed availability:** available = total − sold − active holds (`expires_at > now`). Expiry is correct even if no background job runs on time. A scheduled job only updates states and sends notifications.
- **Concurrency:** optimistic locking prevents holding portions that no longer exist.
- **Per-fonda time windows:** how long the diner has to submit a transfer and how long to pick up.
- **Abuse protection:** a limit on active orders per phone number and a no-show history per diner.

## Diner identity

- No account: name + phone number verified through a WhatsApp one-time code.
- **OTP rules:**
  - The code is stored hashed, expires after 5 minutes and allows only a few attempts.
  - Sends are rate limited per phone and per IP, with a global daily cap.
- Phone numbers are normalized to E.164 (`+52…`).
- After verification, a session token is issued for about 30 days.

## Notifications

- **Notification port** with interchangeable adapters: WhatsApp (Meta Cloud API), Telegram, email (SES), web push.
- **Use cases:**
  - OTP codes.
  - A daily menu message from favorite fondas (opt-in subscription).
  - Order status updates.
- **Cost:** WhatsApp charges per message. Daily menus are likely billed as marketing templates (the most expensive category), so the channel is a business decision and is capped by guardrails.
- **Demo:**
  - OTP codes are shown on screen, because Meta's free test number only reaches pre-verified numbers.
  - A "send today's menu now" button replaces the scheduled send, since the demo backend is asleep most of the time.

## Mexico-specific defaults

- Currency: MXN.
- Time zone: `America/Mexico_City`.
- Per-fonda daily cutoff and opening hours.
- Spanish UI.

## Demo constraints

- Data is ephemeral and resets on every session. The demo is seeded with sample fondas and menus.
- Registrations made during a session are lost when the instance shuts down.
- Scheduled features (daily menu send) are triggered manually in the demo; they run on schedule only in prod.

## Open questions

- Product name and production domain (e.g. `mifondita.com`).
- Access codes for recruiters (see infra plan).
