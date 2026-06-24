# GiveDeeFive Prototype — Changelog & Conventions

> เอกสารนี้อธิบายโครงสร้าง, รูปแบบโค้ด, สไตล์, และประวัติการแก้ไขของไฟล์หน้าจอ (frontend prototype)
> เพื่อให้ผู้ร่วมพัฒนา (รวมถึง Gemini) อ่านแล้วเข้าใจและทำงานต่อในรูปแบบเดียวกันได้
> Repo: `Interface21/gd5-prototype` (branch `main`)

---

## 1. ภาพรวมสถาปัตยกรรม (Architecture)

โปรเจกต์เป็น **HTML prototype หลายหน้า** ที่ลิงก์ถึงกันด้วย `<a href>` แบบ relative path
มี 2 รูปแบบการเขียนอยู่ใน repo:

| รูปแบบ | ไฟล์ | หมายเหตุ |
|--------|------|----------|
| **Vue 3 + Quasar (CDN UMD)** | `template_frontend.html`, `dashboard.html`, `user-today-job-inner.html` | ตาม `scope.md` — เทมเพลตหลักฝั่ง frontend |
| **React 18 + Babel standalone (CDN)** | `user-today-job.html`, `assignee-action-*.html`, `commander-action-*.html` | หน้า prototype ที่สร้างเพิ่ม ใช้ React inline (อ่าน/แก้ไวกว่า) |

> หมายเหตุ: `scope.md` ระบุ framework เป้าหมายเป็น **Vue/Quasar** และให้ใช้ `template_frontend.html` เป็นต้นแบบ
> หน้า prototype ที่สร้างใหม่ใช้ React เพื่อความเร็วในการทำต้นแบบ — หากต้องการ production ควร port เป็น Vue/Quasar ตามเทมเพลต

### กติกาจาก `scope.md`
- **framework**: Vue/Quasar
- **font**: `"Google Sans", "Noto Sans Thai Looped", system-ui, sans-serif` (หน้า React prototype ใช้ `IBM Plex Sans Thai` แทนชั่วคราว)
- **icon**: Bootstrap Icons (https://icons.getbootstrap.com/) — หน้า React ยังใช้ Material Symbols Rounded ร่วมด้วยในเนื้อหา
- ใช้ `template_frontend.html` เป็น template ฝั่ง frontend
- อัปเดตขึ้น GitHub ทันทีหลังแก้โค้ดเสร็จ
- **คลิกโลโก้ → กลับหน้าแรก `dashboard.html`**

---

## 2. Design System / Style Tokens (หน้า React prototype)

ค่าคงที่ที่ใช้ซ้ำทุกหน้า (ประกาศไว้ต้นไฟล์):

```js
const primary='#15a08f';        // เขียวเทอร์ควอยซ์ (สีหลักแบรนด์)
const primarySoft='#e3f3f0';    // พื้นอ่อนของ primary
```

**สีสถานะ (status):**
| สถานะ | ความหมาย | สี (เข้ม/พื้นอ่อน) |
|-------|----------|-------------------|
| `unack` | ยังไม่รับทราบ | `#e8920c` / `#fef3e6` (ส้ม) |
| `inprogress` | กำลังดำเนินการ | `#3b82f6` / `#eaf1fe` (น้ำเงิน) |
| `closing` | ขอปิดงาน | `#0e8c7d` / `#e4f3ef` (เขียวเข้ม) |
| `closed` | ปิดงาน | `#22b573` / `#e7f6ee` (เขียว) |

**จุดสุขภาพงาน (health dot):** เขียว `#22b573` / เหลือง `#f5b301` / แดง `#ef4444`

**ตัวอักษร:** หัวข้อ `#1f2733`/`#2b3440`, รอง `#5a6473`, มิวต์ `#8a93a3`/`#9aa3af`/`#aab2bd`

**Layout shell (ทุกหน้า prototype):**
- Top bar สูง 58px (โลโก้→dashboard.html, ช่องค้นหา, แจ้งเตือน, แชท, ภาษา, โหมดมืด, โปรไฟล์)
- **ชื่อผู้ใช้อ้างอิงจาก `dashboard.html`: `Piyawat Takaew` / `SA Staff`** + avatar `https://cdn.quasar.dev/img/avatar.png`
- Icon rail ซ้าย 60px (ไอคอน Bootstrap, ไฮไลต์ด้วย `primarySoft`)
- การ์ดเนื้อหา: `background:#fff; border:1px solid #eceef2; border-radius:14px; box-shadow:0 1px 2px rgba(16,24,40,.04)`

**รูปแบบโค้ด React prototype:**
- เขียน JSX ใน `<script type="text/plain" id="jsx-src">` แล้ว transpile ด้วย Babel ตอน runtime
- ใช้ **inline style ทั้งหมด** (ไม่มี CSS class ยกเว้น hover/keyframes เล็กน้อยใน `<style>`)
- helper ไอคอน Material: `ms(name,size,color,fill)`
- รักษา shell (top bar + icon rail) ให้เหมือนกันทุกหน้าเพื่อความต่อเนื่อง

---

## 3. รายการไฟล์และหน้าที่ (Files)

### Shell / ฐาน
- **`index.html`** — หน้า entry redirect
- **`dashboard.html`** — หน้าแรก (Vue/Quasar) แหล่งอ้างอิงชื่อผู้ใช้และ shell
- **`template_frontend.html`** — เทมเพลต Vue/Quasar ต้นแบบฝั่ง frontend
- **`scope.md`** — แนวทาง/ข้อกำหนดโปรเจกต์

### Today's Job
- **`user-today-job.html`** (React) — แดชบอร์ด Daily Job ของฉัน + ของลูกทีม + โหมดจัดการ
  - คอลัมน์ขวา "ภาพรวมงานแต่ละฟังก์ชัน": แต่ละฟังก์ชันแสดงชิปจำนวนแยกตามสถานะ **ใต้แถบกราฟ** (คลิกได้ ลิงก์ `…list.html?fn=…&status=…` ให้ dev นำไป filter) — ฟังก์ชัน "คำสั่งที่สั่งไป" มี 5 สถานะ พร้อมปุ่มเลื่อนแนวนอน ◀▶ เมื่อชิปล้น; "แผนธุรกิจที่รับผิดชอบ" ไม่มีสถานะย่อย
  - การ์ดลูกทีม: 2 บรรทัด (บรรทัด 1 ชื่อ, บรรทัด 2 จำนวนแต่ละสถานะแบบจุดสี) + progress bar เล็กพร้อม % ด้านขวา
- **`user-today-job-inner.html`** (Vue) — หน้าเนื้อหาภายใน (ขนาดใหญ่)
- **`mobile/user-today-job-mobile.html`** (React standalone) — เวอร์ชันมือถือของ Today's Job ในกรอบ iPhone
  - **React 18 + Babel inline + กรอบโทรศัพท์วาดด้วย CSS** (self-contained — ไม่พึ่ง support.js/ios-frame.jsx) จึงรันได้บน GitHub Pages / ไฟล์ static ทั่วไป
  - ⚠️ เดิมเคยเป็น Design Component (`<x-dc>`+`support.js`) ซึ่งทำงานเฉพาะในเครื่องมือออกแบบ — บน hosting ธรรมดาจะโชว์ `{{ }}` ดิบ จึง port เป็น React standalone
  - 4 หน้าจอใน 1 ไฟล์ (state `screen`): home / team / member / manage + bottom nav (หน้าหลัก/ลูกทีม/จัดการ/คะแนน)

### ฝั่งผู้รับคำสั่ง (Assignee — "คำสั่งที่ได้รับ")
- **`assignee-action-list.html`** (React) — รายการคำสั่งที่ได้รับ (มี secondary nav ซ้าย)
  - แต่ละแถว: avatar, ชื่อ, เป้าหมาย/ความก้าวหน้า (แถบ % + ชิป ratio + ชิปจำนวนความก้าวหน้าแบบ badge), งานประจำวัน, **วันที่แบบสัมพัทธ์** ("เหลือ X วัน"/"เกิน X วัน"/"ครบกำหนดวันนี้"), badge สถานะ (soft pill + จุดสี), จุดสุขภาพ เขียว/เหลือง/แดง
  - ดีไซน์ **minimal**: avatar วงกลมสีอ่อน, ชิป soft, แถบบาง
  - **ปุ่มเพิ่มลง Today's Job**: ปุ่มไอคอนเล็ก **ท้ายแถวสถานะ** — ยังไม่เพิ่ม = `playlist_add` สีเทา / เพิ่มแล้ว = `playlist_add_check` สีเขียว (พื้น `#e4f3ef`) + แถวพื้นจาง; **ไม่แสดงปุ่มนี้ในงานสถานะ `closed`** (และเผื่อ `cancelled`)
  - แชร์สถานะ "เพิ่มแล้ว" ผ่าน `localStorage` key **`gd5_today_jobs`** (เก็บ array ของ id) — id แถว = `'r'+index`; แถวลิงก์ส่ง `?id=` ไปหน้า detail; seed ตัวอย่าง `['r1','r5']` เมื่อยังว่าง
  - ปุ่มสลับมุมขวาบน: list (active) ↔ chart → `assignee-action-dashboard.html`
- **`assignee-action-dashboard.html`** (React) — แดชบอร์ดสรุปฝั่งคำสั่งที่ได้รับ
  - การ์ดสถิติ 6 ใบแบบ gradient + ไอคอน + watermark (คำสั่งทั้งหมด/กำลังดำเนินการ/เกินกำหนด/ปิดงาน/อัตราความสำเร็จ/อัตราการปฏิเสธ)
  - กราฟ (SVG จำลองข้อมูล): "ด้านสุขภาพของงาน" = กราฟแท่งเทอร์ควอยซ์ตามสถานะ; "ด้านแนวโน้มฯ 6 เดือน" = แท่ง 2 ชั้นเขียว(ตรงเวลา)+แดง(ล่าช้า) ในแท่งเดียว; กราฟเต็มกว้าง "แยกตามประเภทคำสั่งและสถานะ" = stacked bar 4 สถานะ
  - secondary nav มีเพิ่ม "ตรวจสอบการจัดทำเอกสาร WI" + "สรุปข้อมูลการสั่งการ"
- **`assignee-action-inprogress.html`** (React) — รายละเอียดคำสั่งที่ได้รับ สถานะ "กำลังดำเนินการ" (หน้า form)
  - แถบหัวมีปุ่มดำเนินการ (สั่งการต่อ/เพิ่มความก้าวหน้า/ส่งคำขอปิดงาน/สถานะปัจจุบัน) + **ปุ่มเพิ่มลง Today's Job** (อ่าน `?id=` จาก URL, default `order-ai`; ปุ่มทึบ primary = ยังไม่เพิ่ม, เขียวอ่อน+เช็ก = เพิ่มแล้ว) แชร์ key `gd5_today_jobs`
  - แท็บ: รายงานความก้าวหน้า / การแจ้งเตือน / ปฏิเสธคำขอปิดงาน / แชท; แถบขวาแสดงข้อมูลคำสั่ง
- **`assignee-action-close.html`** (React) — รายละเอียดคำสั่งที่ได้รับ สถานะ "ปิดงาน" (มีแบนเนอร์เหลืองงานปิดแล้ว)
- **`assignee-action-icon-options.html`** (util) — หน้าตัวอย่างไอคอน "อยู่ใน Today's Job" (ไว้เลือก ไม่ใช่หน้าใช้งานจริง)

### ฝั่งผู้สั่ง (Commander — "คำสั่งที่สั่งไป")
- **`commander-action-dashboard.html`** (React) — แดชบอร์ดสรุปฝั่งคำสั่งที่สั่งไป
  - การ์ดสถิติ 6 ใบ gradient (…/อัตราการยกเลิก), กราฟ: Donut สถานะ real-time, Stacked bar เสร็จตรงเวลา/ล่าช้า, Scatter รายบุคคล, Bar ตามสถานะคำสั่ง
- **`commander-action-list.html`** (React) — รายการคำสั่งที่สั่งไป

---

## 4. การลิงก์ระหว่างหน้า (Navigation)
- โลโก้ (ทุกหน้า) → `dashboard.html`
- Icon rail + secondary nav ลิงก์ข้ามหน้า (received ↔ sent ↔ dashboard)
- ปุ่ม list/chart มุมขวาบน = สลับ "รายการ" ↔ "แดชบอร์ด" ของฟังก์ชันเดียวกัน
- แถวในหน้า list → หน้า detail (`assignee-action-inprogress.html` / `assignee-action-close.html`) พร้อม `?id=`

---

## 5. State ที่ persist
| key | ใช้ที่ | ความหมาย |
|-----|--------|----------|
| `gd5_today_jobs` | assignee-action-list, assignee-action-inprogress | array ของ id งานที่ถูกเพิ่มลง Today's Job |

> ห้ามล้าง/เขียนทับ key อื่นใน localStorage ที่ไม่ได้เป็นของฟีเจอร์นี้

---

## 6. Changelog (ประวัติการแก้ไขหน้าจอ)

> รูปแบบ: `YYYY-MM-DD — ไฟล์ — สรุปการเปลี่ยนแปลง`
> (จะบันทึกรายละเอียดทุกครั้งที่ได้รับอนุญาตให้แก้หน้าจอ)

- **init** — สร้างชุดหน้า prototype ฝั่ง assignee/commander บน shell เดียวกัน (React inline + inline style)
- `assignee-action-inprogress.html` / `assignee-action-close.html` — หน้า detail คำสั่งที่ได้รับ 2 สถานะ (กำลังดำเนินการ / ปิดงาน)
- `user-today-job.html` — เพิ่มชิปจำนวนแยกตามสถานะใต้แต่ละฟังก์ชัน (คลิกได้ลิงก์ filter), ชิปเลื่อนแนวนอนเมื่อล้น, ตัด "แผนธุรกิจ" ออกจากการแสดงสถานะย่อย; ปรับการ์ดลูกทีมเป็น 2 บรรทัด + progress bar เล็ก
- `assignee-action-list.html` — รายการคำสั่งที่ได้รับ (secondary nav, แถวรายงานสถานะ/ความก้าวหน้า), ปรับ minimal, วันที่เป็นแบบสัมพัทธ์, จุดสุขภาพ, ชิปความก้าวหน้าเป็น badge; เพิ่มปุ่ม "เพิ่มลง Today's Job" (ไอคอนเล็กท้ายสถานะ, ไอคอนต่างกันตามสถานะเพิ่มแล้ว, ซ่อนในงานปิด), seed ตัวอย่าง 2 งาน
- `commander-action-dashboard.html` — แดชบอร์ดคำสั่งที่สั่งไป: การ์ดสถิติ gradient + กราฟ SVG (donut/stacked/scatter/bar)
- `assignee-action-dashboard.html` — แดชบอร์ดคำสั่งที่ได้รับ: การ์ดสถิติ gradient + กราฟแท่งสุขภาพงาน + แท่ง 2 ชั้นแนวโน้ม + stacked ตามประเภท/สถานะ; ปุ่มสลับ list↔dashboard
- `mobile/user-today-job-mobile.html` — (1) คัดลอก support.js/ios-frame.jsx เข้า mobile/ ให้ DC รัน; (2) **พบว่า DC ไม่รันบน GitHub Pages (โชว์ `{{ }}` ดิบ) จึง rewrite ใหม่เป็น React standalone + กรอบ iPhone วาดด้วย CSS** (self-contained ลบไฟล์ support.js/ios-frame.jsx ใน mobile/ ออก)
