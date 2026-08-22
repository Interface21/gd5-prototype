# Handoff — GD5 prototype: ระบบบันทึกค่าใช้จ่าย (Expense) ใน Virtual Meeting

## บริบท
GD5 (GiveD5) เป็น HTML prototype หลายหน้า (React + Babel inline, `<script type="text/plain" id="jsx-src">`). กติกาโปรเจกต์อยู่ใน `CLAUDE.md` — อ่านก่อนแก้เสมอ (แบรนด์ "GiveD5", Bootstrap Icons ผ่าน `<i class="bi bi-...">`, ธีมสว่างเท่านั้น, teal `#15a08f`, กฎปุ่ม/badge/tab เคร่งครัด). ทุกการแก้หน้าจอ **ต้องบันทึกลง `changelog.md`** (รายการล่าสุดอยู่บนสุด — ดูรายละเอียดงานที่ผ่านมาที่นั่น ไม่ต้องเล่าซ้ำ).

## งานที่ทำเสร็จรอบนี้ (ระบบ Expense)
เพิ่ม/ยกเครื่อง `ExpenseModal` ให้ทำงานเหมือนกันทั้ง **4 ไฟล์ VM**:
`vm-example-roadmap-gived5.html`, `vm-example-college-data.html`, `vm-example-term-data.html`, `user-virtual-meeting-group.html`

พฤติกรรมปัจจุบัน:
- เปิดได้ 2 ทาง: ปุ่ม wallet บนแถว **หัวข้อ (topic)** และ **รายการย่อย (sub)** ในแท็บ TODO (โหมด `do`), + ปุ่ม "บันทึกค่าใช้จ่าย" อิสระในทูลบาร์ (เฉพาะ term-data/college/group — **ถูกลบออกจาก roadmap แล้ว** ตามคำสั่ง user ผ่าน direct edit).
- state เป็น flat `expenses` (`{id,date,amount,note,files:[],link}`); `link` = `{level:'topic'|'sub', topicId, subId?, title}` หรือ `null` (อิสระ). seed มาจาก `TD_SEED[].expenses` map เป็น link=topic. roadmap มีตัวอย่าง sub-level 1 รายการ ("ส่งสรุปให้ทีมพัฒนา" 4,500 + PDF).
- กดจาก TODO → ฟอร์มเปิดรอทันที (`initLink` set), ตัด dropdown เลือก TODO ด้านบนออก, แสดงกรอบเขียว (curLink) เหนือช่องรายการ. กดอิสระ → มี dropdown เลือก topic/sub/ไม่อ้างอิง.
- ฟอร์มอยู่ **ด้านบน** ใต้แถบ "รวมทั้งหมด"; รายการที่บันทึกทั้งหมดแสดงด้านล่าง (ไม่กรอง). badge ผูก TODO แสดง **เฉพาะ sub** เท่านั้น.
- **ยอดรวมที่หัวข้อ** นับทุกรายการ `topicId` เดียวกัน (topic + sub).
- **validate note**: `noteReq=!(curLink&&curLink.level==='sub')` — บังคับกรอกรายการเมื่อมาจาก topic/อิสระ, ไม่บังคับเมื่อมาจาก sub.
- แนบไฟล์หลายไฟล์ (image/*,.pdf), ยังบังคับกำหนดแผนธุรกิจก่อน (`bp` null → เปิด plan picker). roadmap ตั้ง `bp` default = strategy `s3`.

TODO ที่ done: ตัด line-through ออกแล้วทุกไฟล์ VM (รวม sso-1/sso-2).

## ข้อควรระวัง
- ไฟล์ 4 ไฟล์ VM มีโครง `ExpenseModal`/`TodoPanel` เกือบเหมือนกันแต่ **ชื่อตัวแปรต่างกันบางจุด** (group ใช้ `tot`/`et` สลับที่ topic badge). แก้แบบ batch ให้เช็คทีละไฟล์ (`run_script` + throw ถ้า match ≠ 1) — เคยพลาดมาแล้ว.
- `run_script` buffered: ถ้า throw กลางคัน **ไม่มีไฟล์ไหนถูกเขียน** — แก้ pattern แล้วรันใหม่ทั้งชุด.
- ไฟล์สำเนาใน `handoff/`, `uploads/`, `edited-files/` = backup/ของ user — **อย่าแก้** เว้นแต่สั่ง.
- user แก้ preview เอง (direct edit) เป็นระยะ — re-read ก่อน write เสมอ.

## สถานะ
งานล่าสุด (validate note) verify แล้ว ไม่มี console error. รอคำสั่งถัดไปจาก user.

## Suggested skills
- ไม่มี skill พิเศษที่จำเป็น — งานเป็นการแก้ HTML prototype ตรง ๆ. หาก user ขอ export ให้ดู "Save as PDF" / "Export as PPTX". หากขยายเป็นหน้าจอใหม่ใหญ่ ให้ดู "Interactive prototype".
