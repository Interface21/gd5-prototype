# Handoff — GD5 Prototype: ฟังก์ชัน Snapshot

## บริบท
โปรเจกต์ **GD5** เป็น prototype (React + Babel standalone แบบ HTML ต่อไฟล์ ไม่ใช่ DC).
ทุกไฟล์ยึด `CLAUDE.md` ที่ root เป็นกติกาบังคับ (แบรนด์ "GiveD5", Bootstrap Icons, teal `#15a08f`,
พื้นอ่อน `#e3f3f0`, ฟอนต์ IBM Plex Sans Thai, light mode เท่านั้น, กฎปุ่ม/badge/switch — ดูรายละเอียดใน CLAUDE.md).
บันทึกการเปลี่ยนแปลงลง `changelog.md` ทุกครั้ง.

## งานที่ทำเสร็จในเซสชันนี้
เพิ่มฟังก์ชัน **Snapshot** (Automatic + Manual + รายเดือน) ในหน้าเดียว: `business-plan-org-report.html`
ตาม requirement ที่ผู้ใช้แปะมา (spec เต็มอยู่ในประวัติแชท — สรุปสาระ: fiscal-quarter, delay, Manual>Auto,
versioning, states, audit). โค้ด snapshot ทั้งหมดอยู่ในบล็อกคอมเมนต์ `SNAPSHOT — Business Logic`
ภายใน `<script id="jsx-src">` เหนือ `function ReportContent()`.

### สิ่งที่มีแล้ว
- **แถบ "Snapshot รายไตรมาส"** (`SnapshotBar`) แสดงที่หน้ารวม (atRoot, ไม่มี query) — การ์ด Q1–Q4
  สถานะ UPCOMING/PENDING/AUTO_SNAPSHOT/MANUAL_SNAPSHOT + ตัวเลือกปีงบ + pill Auto (เปิด/ปิด+วันหน่วง) + ปุ่ม "ตั้งค่า".
  (ปุ่ม "บันทึก Snapshot" ระดับบนถูกผู้ใช้ลบออกแล้ว — บันทึกจากปุ่มรายไตรมาส/รายเดือนแทน)
- **บันทึก Manual สิ้นไตรมาส** (`SnapshotCreateModal`) — เลือกไตรมาส (กันไตรมาสที่ยังไม่เริ่ม), แสดงช่วง/สิ้นไตรมาส/
  กำหนด Auto (=สิ้นไตรมาส+delay), เตือนเขียนทับ, remark, สร้าง version ใหม่ + supersede เวอร์ชันเดิม (ทำงานจริงใน state).
- **ตั้งค่า** (`SnapshotConfigModal`) — on/off Auto (สวิตช์ 8px เขียว/แดง), เดือนเริ่มปีงบ (คำนวณ Q1–Q4 ไม่ผูกปีปฏิทิน),
  Snapshot Delay (7/10/กำหนดเอง), Period Type (MONTHLY/QUARTERLY/YEARLY/AD_HOC).
- **รายละเอียดไตรมาส + Audit** (`SnapshotHistoryModal`) — คลิกการ์ดเปิดได้เสมอ. มี:
  - **Snapshot รายเดือน** 3 เดือน/ไตรมาส บันทึก Manual แบบ inline (remark + เตือนเขียนทับ).
    เงื่อนไขหน้าต่าง: บันทึกเดือนได้ถึง **ก่อน Auto ของเดือนถัดไป** (deadline = สิ้นเดือนถัดไป + delay);
    พ้นกำหนด = CLOSED (ล็อก), ยังไม่ถึง = UPCOMING. Logic อยู่ใน `resolveMonth()` / `monthDef()`.
  - Snapshot สิ้นไตรมาส: timeline เวอร์ชัน (ACTIVE/SUPERSEDED) + Audit Log + Business Key.

### Business logic สำคัญ (helpers ในไฟล์)
`quarterDef`, `resolveQuarter`, `monthDef`, `resolveMonth`, `NOW=5 ส.ค. 2026`, store `SNAP_SEED`
(key ไตรมาส `'FY-Q'`, เดือน `'FY-M<absIdx>'`, absIdx 0..11). Priority Manual>Auto, Dashboard เลือก Manual→Auto→ยังไม่มี.
State ทั้งหมดถือใน `ReportContent` (`snapCfg, snapFY, snapStore, snapCfgOpen, snapCreate, snapHist`).

## ข้อควรรู้ / ยังไม่ได้ทำ
- ทุกอย่างเป็น **mock ใน state** — ยังไม่มี backend. มี DEV note ในโมดัลย้ำว่า สิทธิ์/idempotency/transaction
  ต้องบังคับจาก backend จริง (spec ข้อ 3.4, 4.4, 10).
- ยังไม่มี: จอ config ปีงบระดับองค์กรจริง, FAILED/retry flow แบบโต้ตอบ, การผูก snapshot กับข้อมูลแผนจริง
  (ปัจจุบัน snapshot ไม่ได้ freeze ค่าจาก MISSIONS — เป็นเมทาดาทา/สถานะเท่านั้น).
- โทนสีสถานะแผน (r/y/g) **ห้ามแตะ** จนกว่าผู้ใช้เลือกจาก `color-palette-options.html`.

## ไฟล์ที่แก้
- `business-plan-org-report.html` (โค้ดหลักทั้งหมด)
- `changelog.md` (3 entry ใหม่ ลงวันที่ 05/08/2569)

## Suggested skills สำหรับเซสชันถัดไป
- **Interactive prototype** — หากต่อยอด flow/สถานะ snapshot เพิ่ม
- อ่าน `CLAUDE.md` + `changelog.md` ก่อนเริ่มเสมอ (กติกา UI + ประวัติหน้าจอ)
