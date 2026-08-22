# Handoff — GD5 prototype, `user-today-job.html`

## Context
GD5 (GiveD5) internal-tool prototype. Single React+Babel HTML files per screen, shared shell in `gd5-app-shell.jsx`. Project rules live in `CLAUDE.md` (root) — read it first; key points: brand is always **GiveD5**, icons via **Bootstrap Icons** through the `ICON`/`ICONF` maps + `ms()` helper, light theme only, teal `#15a08f` / soft `#e3f3f0`, font IBM Plex Sans Thai, and **every screen change must be logged in `changelog.md`**. Strict rules for tabs, action-button height/order/radius, and badges are in `CLAUDE.md` — follow them.

## What was built this session (all in `user-today-job.html`)
New view **Team Priority Work List / รายการงานสำคัญของทีม** (`view==='priority'`), reached from a button in the "Today's Job ของลูกทีม" card header on the dashboard.

- Grid of boards (`repeat(auto-fill,minmax(540px,1fr))`), one per person: self (`me`), each team member, plus added "others".
- Each board = header (avatar, name, role, badge, progress, action icons) + a table (rank / title+progress bar / commander / due+days / progress%+status dot). Shows top 3 jobs; if >3, a "ดูทั้งหมด (N งาน)" toggle at bottom-right expands/collapses.
- Boards have equal height: card is `minHeight:340`, flex column, table area `flex:1`.
- Header action icons (top-right, 32px): message (chat) on non-`me` boards, history (schedule) on editable boards, then edit-order (swap_vert, editable) or remove (close, others).
  - **แก้ไขลำดับงาน** jumps to the existing `manage` view (drag reorder): self→`me`, team→select member+`team`.
  - **ฝากข้อความขอปรับลำดับงาน** modal (`msgModal`): quick presets + textarea + sent state.
  - **ประวัติ/log** modal (`logModal`): timeline of add/remove/reorder per person, from `LOGS0`.
- "เพิ่มกระดานของคนอื่น" button → `addBoardOpen` modal picks from `OTHERS0`; one (`o3` Peerapat Chaiyo) is preloaded via `useState(['o3'])`. Others' boards show no badge, no log, and a remove icon.

Data constants near the top of the jsx-src: `OTHERS0`, `LOGS0` (keyed by person name). State: `addedBoards`, `expandedBoards`, `addBoardOpen`, `msgModal`, `logModal`, `msgText`, `msgSent`. Board list assembled in `rawBoards`/`priorityBoards`.

Full change list is in `changelog.md` (top entries dated 17/08/2569) — do not duplicate it.

## Open / possible next steps
- Message send and log entries are mock (no persistence/backend). Reordering in `manage` view does not yet write to `LOGS0`.
- Verifier was forked on the last delivery and had not reported back — if it flags anything, fix from its notes.

## Suggested skills
- **frontend-design** — if extending visual patterns.
- None strictly required for incremental edits; keep matching existing inline-style conventions in the file.

_Note: OS temp dir is not writable from this environment; saved under project `tmp/` instead._
