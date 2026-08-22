# Handoff — GD5 Prototype (Budget Planning)

> No OS temp dir available in this environment; saved at project root. Delete when done.

## Where things stand
Working in **`backend-business-plan-framework.html`** (admin "กำหนดกรอบแผนธุรกิจ" screen). This is a standalone React+Babel HTML file (not a DC), same pattern as all GD5 prototype pages: `<script type="text/plain" id="jsx-src">` transpiled at load, shell fetched from `gd5-app-shell.jsx`.

Recently added a new left-menu item **"การตั้งแผนงบประมาณ" (Budget Planning)**, under "กำหนดรอบการวัดเป้าตามกรอบแผนธุรกิจ". Full detail of every change is in **`changelog.md`** (entries dated 17/08/2569) — read it rather than re-deriving.

## Key components in that file (search by name)
- `BudgetView` — the budget screen. State: `budget` (values keyed by node id), `tab` (both/capex/opex column filter), `mode` (edit/preview), `expanded`, `saved`. Seed data: `BUDGET_SEED`.
- Edit mode: hierarchy tree grid (พันธกิจ→เป้าหมาย→กลยุทธ์→แผนงาน via `nodeKids`/`childrenOf`). One compact cell per budget type = editable amount (`BudgetInput`) + `AllocBar` (green in-budget / red over). Real-time validation: children sum > parent → red row + error banner + Save disabled. `g3` in seed is intentionally over-allocated to demo the warning.
- Preview mode (`BudgetPreview`, read-only): horizontal proportion bars per mission (length ∝ total, CAPEX blue / OPEX teal split) + click-to-drill breakdown with breadcrumb. Shows both types together.
- CAPEX/OPEX colors: `CAPEX_C` (blue #3b6fd4), `OPEX_C` (teal #0e9488).

## Last unverified change
Just replaced the preview **treemap** (boxes rendered with weird proportions — one mission dominated, goals stacked too tall) with **horizontal bars** (`BudgetPreview`, the `maxM` IIFE block). NOT yet visually verified after the swap. First step for next session: open the file, go to Budget Planning → พรีวิวภาพรวม tab, screenshot, confirm bars render cleanly. Note: the old `Cell` helper inside `BudgetPreview` is now unused (harmless; can remove).

## Project rules that bit us here (all in CLAUDE.md — read it)
- Brand is **GiveD5** (the shell logo currently shows "GiveDeeFive" — that's in `gd5-app-shell.jsx`, out of scope but worth flagging to user).
- Bootstrap Icons only (`bi-*`), light theme only, teal `#15a08f`, font IBM Plex Sans Thai.
- **View-switch tabs must be underline style** (never segmented/pill). Don't stack two underline rows adjacently — separate them with content (mode tabs and CAPEX/OPEX filter are separated by the summary strip on purpose).
- Action buttons: height 40px (primary) / 32px (secondary) fixed, border-radius 11px, order ยกเลิก→ลบ→บันทึก, every button has an icon. Badges radius 8px fixed.
- Log every screen change to `changelog.md`.

## Suggested skills for next session
- **frontend-design** — if refining the preview visuals further.
- (No deck/doc/PDF export involved.)

## Open threads / possible next asks
- Verify the horizontal-bar preview render.
- User was at usage-limit; they may want polish on the preview (e.g. goal-level segmentation in the mission bars, or per-level totals in breadcrumb).
- Budget values in edit vs preview share the same `budget` state — good; keep it that way if refactoring.
