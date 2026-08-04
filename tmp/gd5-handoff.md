# GD5 Prototype — Handoff

## Project
GD5 — HTML prototype suite for a Thai performance/business-plan management app. Brand **GiveD5**, teal `#15a08f`, soft `#e3f3f0`, font IBM Plex Sans Thai, Bootstrap Icons (`bi-*`), light theme only. ~48 files at project root. Full rules live in `CLAUDE.md` (read it first — it governs button heights, badge radii, action-button order, PA rules, business-plan hierarchy, status colors not-yet-decided, etc.).

## Source of truth
- **`CLAUDE.md`** — binding conventions and per-screen contracts. Do not violate.
- **`changelog.md`** — every screen change is logged here (newest at top). Read the top entries for recent context instead of re-deriving.

## Recent work (this session)
All on `user-virtual-meeting-group-sso-1.html`, TODO tab (`TodoPanel`), logged in `changelog.md` (20/07/2569 entries):
1. Hid the single topic header "บริหารงานโปรเจคครุภัณฑ์" in view mode — sub-items (real todos) render directly. Topic row still shows in **edit mode** so topics remain manageable. Change is in `topics.map(...)`: the `td-row` div is gated on `mode==='edit'`, subs gated on `(mode==='do'||isOpen)`.
2. Summary "เสร็จ" count + progress % at top of TODO tab now sum sub-items across topics (was counting topics): `overallN`/`overallDone` reducers near line ~599.

## Architecture notes for these VM files
- Single HTML file, React via inline `<script type="text/plain" id="jsx-src">` transpiled at runtime. No build step.
- `ms(name,size,color,filled)` / icon maps `ICON`/`ICONF` translate legacy Material names → Bootstrap Icon classes. Always use `bi-*`.
- TODO data seed: `TD_SEED` (topics → subs). `TODO_TEMPLATES` feeds the import modal.
- Related files: `user-virtual-meeting-group-sso.html`, `user-virtual-meeting.html`, `user-virtual-meeting-group-1.html`, `vm-example-sso-2.html` (user currently viewing this one — not yet touched this session).

## Open / watch items
- Status color palette (red/yellow/green) NOT finalized — options in `color-palette-options.html`. Do NOT apply new status colors to real screens until user picks.
- `vm-example-sso-2.html` is open in the user's tab; may be the next target — confirm intent before editing.

## Suggested skills
- **Interactive prototype** — when extending flows/interactions.
- **frontend-design** — only if a genuinely new UI area needs aesthetic direction (otherwise mirror existing vocabulary).
