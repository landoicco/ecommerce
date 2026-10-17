## Summary

Restructure the documentation so the repository can be shown as a portfolio project while the rework continues, and make docs and internationalization explicit rules for every PR.

## Changes

- README: status and milestones, product flow, "Built for translation", engineering highlights, documentation index.
- Mermaid diagrams: local and planned AWS architecture, checkout sequence, product flow, order state machine.
- Product spec: new Internationalization section (`en`, `es-MX`, error codes, `MessageSource`, locale-aware formatting); order states as a state diagram.
- Infra plan: architecture diagram in Mermaid.
- `CLAUDE.md`: rules for docs in every PR and no hardcoded user-facing text.
- Pull request template with a docs and i18n checklist.

## Testing

- Diagrams render in the GitHub preview.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
