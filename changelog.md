# GiveDeeFive Prototype — Changelog & Conventions

> เอกสารนี้อธิบายโครงสร้าง, รูปแบบโค้ด, สไตล์, และประวัติการแก้ไขของไฟล์หน้าจอ (frontend prototype)
> เพื่อให้ผู้ร่วมพัฒนา (รวมถึง Gemini) อ่านแล้วเข้าใจและทำงานต่อในรูปแบบเดียวกันได้
> Repo: `Interface21/gd5-prototype` (branch `main`)

---

## ล่าสุด: Note List = Activity log + สิทธิ์เพิ่มบันทึก
- ไอคอน/ปุ่ม Note จัดชิดขวา (คอลัมน์ บันทึก)
- Note ลบไม่ได้ ถือเป็น Activity log (ตัดปุ่มลบออก + badge "Activity log")
- เพิ่ม Note ได้เฉพาะผู้เกี่ยวข้อง = ผู้รับผิดชอบโปรเจค / ผู้สั่งการ / ผู้รับคำสั่งการ — แสดงรายชื่อผู้เกี่ยวข้องในแต่ละรายการ; ผู้ไม่เกี่ยวข้องเห็นข้อความล็อก เพิ่มไม่ได้ (demo: current user ปิยะวัฒน์ ต. เป็นผู้รับคำสั่งการเฉพาะบางรายการ)

## ล่าสุด: เพิ่มรายการเฝ้าระวังเอง (กลุ่ม VM)
- `user-virtual-meeting-group.html` — ปุ่ม **+ เพิ่มเอง** ในหัวแท็บรายการเฝ้าระวัง → modal ฟอร์ม: ชื่อรายการ*, ผู้รับผิดชอบ, วันครบกำหนด, **โปรเจค/วิทยาลัย* (บังคับเลือกจากโปรเจคที่มีอยู่)**, Tag (เลือก/พิมพ์ใหม่)
- รายการที่เพิ่มเองติด **ป้าย "เพิ่มเอง"** (สีอำพัน) + แสดง **"ไม่มีคำสั่งการ"** แทนปุ่มย้อนกลับไปคำสั่งการ; แสดงผู้รับผิดชอบ + วันครบกำหนดในการ์ด
- สิทธิ์: เฉพาะผู้รับผิดชอบโปรเจค Easy PM (`canAdd`); เก็บใน store เดิม `gd5_vm_watch`, ใช้ tag catalog ร่วม `gd5_watch_tags`
- ข้อมูลโปรเจค: `WPROJECTS` (4 โปรเจค/วิทยาลัย)

## ล่าสุด: Note List + badge ครบกำหนด ในสรุปรายการเฝ้าระวัง
- คอลัมน์ ครบกำหนด: เปลี่ยน "เกินกำหนด" เป็น badge **"เกินมา X วัน"** (สีแดง) / **"อีก X วัน"** (สีเขียว) แสดงเป็น badge ทั้งคู่
- เพิ่มคอลัมน์ **บันทึก** + ปุ่ม Note List ต่อรายการ → คลิกขยายแถวแสดง Note List (อ่าน/เพิ่ม/ลบ) seed ข้อมูล 0–2 บันทึกต่อรายการ

## ล่าสุด: หน้าจอ "สรุปรายการเฝ้าระวัง" (user-virtual-meeting)
- `user-virtual-meeting.html` — ปุ่ม **สรุปรายการเฝ้าระวัง (N)** ในแถบ Easy PM (สีอำพันเด่น ข้าง "ครุภัณฑ์ 69") เปิด overlay เต็มจอ
- ตาราง List ข้ามทุกโปรเจค **เรียงตามวันครบกำหนดใกล้สุดก่อน** — คอลัมน์: ชื่อรายการ / ผู้รับผิดชอบ(คำสั่งการ) / ครบกำหนด(+เกินกำหนด/อีก N วัน) / โปรเจค / วิทยาลัย / สถานะ Tag
- **Filter**: ผู้รับผิดชอบ, โปรเจค, วิทยาลัย, สถานะ Tag, ครบกำหนด (ภายใน 7/15/30 วัน, เกินกำหนด) + ปุ่มล้างตัวกรอง
- **Export PDF** (เปิดหน้าต่างพิมพ์ตารางจัดรูป) + **Export Excel** (.xls Blob, UTF-8 BOM)
- data: `buildWatchItems()` สร้างจาก PM (โปรเจคที่ watch>0), tag = LongLead-PO/PR/Material

## ล่าสุด: Badge เฝ้าระวังบนการ์ดโปรเจค (Easy PM)
- `user-virtual-meeting.html` — เพิ่มฟิลด์ `watch` ใน PM data; การ์ดโปรเจคที่มีรายการเฝ้าระวัง (`watch>0`) แสดง **badge "เฝ้าระวัง N"** มุมขวาบน (สีส้ม `#f59e0b` เด่นชัด) + ขอบการ์ดเป็นสีเหลืองอำพัน + เงา ring เน้นให้สะดุดตา; ลิงก์การ์ดชี้ไป `?tab=watch`

## ล่าสุด: แท็บ "รายการเฝ้าระวัง" (กลุ่ม VM)
- `user-virtual-meeting-group.html` — เพิ่มแท็บ **รายการเฝ้าระวัง** ถัดจาก TODO (ย้ายการ์ดเฝ้าติดตามออกจาก TodoPanel มาเป็นหน้าเต็ม `WatchPanel`)
- แต่ละรายการแสดง: ชื่อ + กลุ่ม + คำสั่งการต้นทาง, **เพิ่มโดยใคร/เมื่อไหร่** (relative time), **Note List** (กาง/พับ, เพิ่ม-ลบโน้ตได้), ปุ่ม **ไปยังคำสั่งการ** (ย้อนกลับไป checklist ต้นทาง), ปุ่ม **นำออก**
- **Tag Label**: เพิ่ม/ลบได้ต่อรายการ, catalog เก็บที่ `localStorage['gd5_watch_tags']` (ค่าเริ่มต้น LongLead-PO, LongLead-PR) **ใช้ร่วมทุกกลุ่ม Virtual Meeting**; สร้าง tag ใหม่ผ่านช่องค้นหา, สีต่อ tag อัตโนมัติ
- checklist (`assignee-action-inprogress-checklist.html`) บันทึก `addedBy`/`addedByRole`/`tags`/`notes` ติดไปกับรายการ

## ล่าสุด: Checklist scope toggle (เฉพาะฉัน/ทั้งหมด)
- `assignee-action-inprogress-checklist.html` — ตัดปุ่ม "แก้ไขสถานะ" รายกลุ่มออก, เพิ่มหัว checklist **ครั้งเดียว** (เหนือ 2 กลุ่ม) พร้อม segmented toggle **เฉพาะฉัน / ทั้งหมด** (pill teal); items มี flag `mine`, กรองรายการตาม scope (เฉพาะฉัน = 3 ใบเสนอราคา + 2 PO); badge นับยังเป็นยอดรวมทั้งกลุ่ม

## ล่าสุด: Todo-plus ระดับรายการ + badge รวม
- **`assignee-action-inprogress-checklist.html`** — ย้ายปุ่ม Todo-plus จากระดับคำสั่งการ → **ระดับรายการใน checklist** (ปุ่ม `bi-clipboard-plus`/`bi-clipboard-check` ท้ายแต่ละแถว, id = `ITEM.id:group:index`, เก็บ title/group/parent/href); header เปลี่ยนปุ่มเดิมเป็นข้อความบอกใบ้ "กดไอคอนท้ายรายการเพื่อเฝ้าติดตาม"
- รวม **ไอคอนบันทึกย่อ + ตัวเลขจำนวน** ให้อยู่ใน badge pill เดียวกัน (`bi-card-text` + เลข)
- **`user-virtual-meeting-group.html`** — การ์ด "รายการที่เฝ้าติดตาม" แสดง field ระดับรายการ: title + `group · parent` + badge กลุ่ม (teal) แทน college/ratio/days

## ล่าสุด: หน้า Checklist + รายการที่เฝ้าติดตาม (Todo-plus)
- **`assignee-action-inprogress-checklist.html`** (ใหม่) — หน้า "คำสั่งการของคุณ" แบบ checklist ตาม mockup: 2 กลุ่ม **ใบเสนอราคา 3/6** + **ใบสั่งซื้อ (PO) 0/4** (checkbox กดติ๊กได้ นับสด), รายละเอียด, แผนธุรกิจ, เอกสารแนบ, ผู้รับคำสั่งการ, sidebar งานกลุ่ม(แดง)/Strategic/ผู้รับ-สำเนา/30%/3-10/กำลังดำเนินการ — dummy จากรายการกรอบแดง "การดำเนินงานออกใบสั่งซื้อ (PO) - วท.จุฬาภรณ์" (0/4, เกิน 5 วัน)
- **ปุ่ม Todo-plus** (`bi-clipboard-plus`) บน header → toggle เพิ่ม/เอาออก จาก `localStorage['gd5_vm_watch']` (สถานะ `bi-clipboard-check` เมื่อเพิ่มแล้ว)
- **`user-virtual-meeting-group.html`** — `TodoPanel` แสดงการ์ด **"รายการที่เฝ้าติดตาม"** เหนือ "สิ่งที่ต้องทำ" อ่านจาก `gd5_vm_watch` (title/college/ratio/เกิน N วัน + ปุ่มเปิดดู + ลบ)
- **`assignee-action-list.html`** — แถว PO 0/4 เพิ่ม `href` → ลิงก์ไปหน้า checklist (`rowHref` รองรับ `r.href`)
- ไอคอนใช้ Bootstrap Icons ตรง ๆ (`<i class="bi bi-...">`), ธีมสว่าง, avatar = วงกลมอักษรแรก

---

## 0. ล่าสุด: ปรับโมดัล "สถานะของแผนธุรกิจทั้งหมด" (`org-dashboard.html`)

- redesign โมดัลให้ minimal/clean ขึ้น ข้อมูลครบเหมือนเดิม (4 พันธกิจ × 3 ระดับ + คลิกจุดดูรายละเอียด + toggle Q1–Q4)
- header เรียบลง: ตัด traffic-light dots, ใส่ชื่อ+ช่วงไตรมาสเป็นบล็อกเดียว
- sub-bar: hint + **ภาพรวมองค์กร %บรรลุเกณฑ์** (จาก `Q.orgPct`) + legend
- การ์ดพันธกิจ: label เลขพันธกิจ (uppercase) เหนือชื่อ, status pill + จำนวนรายการ, **แถบสุขภาพรวม** (`<Seg>` สัดส่วน g/y/r ทั้งพันธกิจ via `aggFor()`)
- แต่ละระดับ: หัวข้อ + `<CountRow>` (จำนวน g/y/r), จุดสถานะเล็กลง 38→22px, ไฮไลต์ที่เลือกใช้ box-shadow ring
- helper ใหม่: `Seg`, `CountRow`, `aggFor`, `SOFTBG`; ตัด `ColorChip` ออกจากโมดัล

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
- **icon**: **Bootstrap Icons (https://icons.getbootstrap.com/) เป็นหลักทุกหน้า** — เลิกใช้ Material Symbols แล้ว ทุกหน้าเรนเดอร์ผ่าน `<i className="bi bi-...">`
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
- **ชื่อผู้ใช้อ้างอิงจาก `dashboard.html`: `Piyawat Takaew` / `SA Staff`** + avatar `https://api.dicebear.com/9.x/avataaars/svg?seed=Piyawat&backgroundColor=b6e3f4`
- Icon rail ซ้าย 60px (ไอคอน Bootstrap, ไฮไลต์ด้วย `primarySoft`)
- การ์ดเนื้อหา: `background:#fff; border:1px solid #eceef2; border-radius:14px; box-shadow:0 1px 2px rgba(16,24,40,.04)`

**รูปแบบโค้ด React prototype:**
- เขียน JSX ใน `<script type="text/plain" id="jsx-src">` แล้ว transpile ด้วย Babel ตอน runtime
- ใช้ **inline style ทั้งหมด** (ไม่มี CSS class ยกเว้น hover/keyframes เล็กน้อยใน `<style>`)
- helper ไอคอน: `ms(name,size,color,fill)` — รับชื่อเดิม (สไตล์ Material) แล้ว map เป็นคลาส Bootstrap Icons ผ่านตาราง `ICON`/`ICONF` ที่ประกาศต้นไฟล์ คืน `<i className="bi bi-...">` (ไม่มี Material Symbols font แล้ว). หน้า mobile ใช้ helper `ic(...)` รูปแบบเดียวกัน
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

### Dashboard องค์กร (Org Dashboard)
- **`org-dashboard.html`** (React) — แดชบอร์ดภาพรวมองค์กร (rail `bi-graph-up` active; เข้าจากเมนูซ้าย + การ์ด "แดชบอร์ด" ใน feed)
  - ซ้าย: การ์ด **องค์กร** (POST/PRIZE_GIVE/D_ENGAGE/D_LEARN/D_ACT/D_KEEP/D_USE + delta ขึ้น/ลง) + **กราฟสถานะพันธกิจ** (donut)
  - กลาง: **สุขภาพธีม** (ตาราง teams × 7 metrics) + **สุขภาพแผนธุรกิจ** + **ข้อมูลสรุปจากคำสั่งการ** (tabs + 2 donut)
  - ขวา: **โดดเด่น** (รายชื่อเด่น) + **การตรวจสอบระดับผู้ใช้** (% สีตามเกณฑ์)
  - **เน้นสถานะแผนธุรกิจ + ดูรายไตรมาส**: ปุ่ม **Q1–Q4** มุมขวาบนของการ์ดสุขภาพแผนธุรกิจ → สลับข้อมูล 4 พันธกิจ (สีวงกลมสถานะ/dots/donut/period เปลี่ยนตามไตรมาส); ปุ่ม **"สถานะของแผนธุรกิจทั้งหมด"** เปิด modal เต็มจอ แสดง เป้าหมาย/กลยุทธ์/แผนงาน เป็น dot grid ต่อพันธกิจ (ตามไตรมาสที่เลือก)
  - data ทั้งหมดเป็น mock; `QUARTERS` = ข้อมูลราย Q, `gridFor()` gen dot grid แบบ deterministic
  - ⚠️ component root **ห้ามใส่ `animation:fadeIn`** (modal ใช้ได้เพราะเป็น overlay ชั้นเดียว)

### Virtual Meeting / กลุ่ม (Groups)
- **`user-virtual-meeting.html`** (React) — หน้า "กลุ่มของคุณ" / Virtual Meeting (ไอคอน rail `bi-easel` active)
  - แท็บ: กลุ่มของคุณ / คำเชิญเข้ากลุ่ม / คำขอเข้ากลุ่ม / กลุ่มปิดถาวร (แท็บอื่นเป็น empty state)
  - แถวบน: tabs + ช่องค้นหากลุ่ม (filter ตามชื่อ) + ปุ่ม + สร้างกลุ่ม
  - เนื้อหา: การ์ดเด่น 4 ใบ (banner + title + desc + สมาชิก/โพสต์ + avatar stack + ดูกลุ่ม/pin/chat), รายการกลุ่มแบบแถว (thumbnail + meta + avatar), sidebar "กลุ่มที่คุณอาจสนใจ" (ปุ่มเข้าร่วม)
  - banner/thumbnail เป็น placeholder วาดด้วย CSS (teal brand / restricted) — ยังไม่มีรูป banner จริง; grid responsive (auto-fill)
  - **minimal**: banner/thumbnail พื้นโทนอ่อนแบน (ไม่มี gradient เข้ม/ลายจุด); 4 การ์ดบน = กลุ่มปักหมุด (badge ⴑมุด + ปุ่ม active); กลุ่มอื่นๆ แสดงแถวละ 2 กลุ่ม
- **`user-virtual-meeting-group.html`** (React) — หน้ารายละเอียดกลุ่ม (ลิงก์จากปุ่ม "ดูกลุ่ม" 䏭ใน user-virtual-meeting)
  - **3 คอลัมน์**: ซ้าย = เกี่ยวกับ/สิทธิ์ + จำนวนโพสต์ + VM list; กลาง = hero banner (RESTRICTED) + ชื่อกลุ่ม + ปุ่ม (เชิญ/เข้าร่วมแล้ว/ค้นหา) + tabs (พูดคุย/สมาชิก/รอตอบรับ/ภาพรวม) + composer + ฟีดโพสต์ (สลับ list/grid); ขวา = เจ้าของกลุ่ม/ผู้ดูแล + โพสต์ยอดวิว
  - minimal, ธีมสว่าง; rail `bi-easel` active
  - **`<ContractCard/>` (ข้อมูลสัญญา)** + **`<AttachmentsCard/>` (ไฟล์แนบตามสัญญา)** ในคอลัมน์ขวา — แก้ไขได้ในหน้า (toggle edit ด้วยปุ่ม pencil): ContractCard มีรายละเอียด/สถานศึกษา/มูลค่า/ช่วงเวลา/วันส่งมอบ/ค่าปรับ/Kick-off/ผู้รับผิดชอบหลัก-รอง + แถวเตือนสีแดง (วันเกิน/ค่าปรับรวม); AttachmentsCard = list PDF เปลี่ยนชื่อ/ลบ/เพิ่มได้; state ภายในแต่ละ component (mock)
  - **TODO (สิ่งที่ต้องทำ)** — แท็บใหม่ในหน้ากลุ่ม (`tab==='todo'` → `<TodoPanel/>`):
    - 2 โหมด: **ดำเนินการ** (`do`) = ติ๊ก checkbox sub-todo, ดูแถบ %, pill วันครบกำหนด/เหลือ-เกินวัน/ใน-นอกสัญญา/สถานะดำเนินการ; **แก้ไข** (`edit`) = เพิ่ม/ลบ/จัดลำดับ (↑↓) หัวข้อ, เพิ่ม/ลบ/แก้ไข sub-todo — สลับด้วยปุ่ม pencil ↔ check_circle
    - โครงสร้าง 2 ระดับ: **หัวข้อ (topic)** → **รายการย่อย (sub-todo)**; แต่ละหัวข้อมีแถบ progress = done/total
    - **`<TodoModal/>`** ฟอร์มสร้าง/แก้ไข (kind `topic`|`sub`): ชื่อ, รายละเอียด, ใน/นอกสัญญา (radio), วันครบกำหนด/ช่วงวันที่, แจ้งเตือน 2 ครั้ง; ปุ่ม บันทึก + (topic) เริ่มดำเนินการ / (sub) บันทึก+สั่งการ; โหมดแก้ไข topic โชว์การ์ดอ้างอิงคำสั่งการ
    - state ภายใน `TodoPanel` (topics/open/mode/modal) — seed `TD_SEED` 16 หัวข้อตัวอย่าง (เฟสงานโครงการ)
  - **layout note**: grid 3 คอลัมน์ใส่ `minWidth:1180`; sub-todo row ใช้ `flexWrap` ให้ pill ตัดบรรทัดเมื่อแคบ; ⚠️ TodoPanel/GanttView root **ห้ามใส่ `animation:fadeIn`** (เคยทำให้ทั้ง panel ค้างที่ opacity:0 มองไม่เห็น)
  - **`<GanttView/>`** — กดปุ่มปฏิทิน (`calView=true`) สลับ list ↔ Gantt chart: แถวหัวข้อ (ตัวหนา ไม่มีแถบ) + งานย่อยเป็นแถบตามช่วงวันที่, สีตามสถานะ (เขียว=เสร็จ/ฟ้า=กำลังทำ/แดง=เกินกำหนด/เทา=ยังไม่เริ่ม), เส้น "วันนี้" แนวตั้ง, แกนวันที่รายสัปดาห์, legend; ช่วงวันที่ derive แบบ deterministic (seed ยังไม่มี start/end จริง — ถ้ามีข้อมูลจริงให้ map ลงแกน); **filter หัวข้อหลัก** ผ่าน select เหนือกราฟ (ทุกหัวข้อ/เจาะหัวข้อเดียว + ปุ่มล้าง) — range คงที่เพราะใช้ original topic index

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
- **Icon rail ซ้าย — mapping มาตรฐาน (ทุกหน้าใช้เหมือนกัน, ต่างแค่ flag active):**
  - `bi-layout-sidebar` → `dashboard.html`
  - `bi-graph-up` → `org-dashboard.html` (Dashboard องค์กร)
  - `bi-arrow-down-left` → `assignee-action-list.html` (คำสั่งที่ได้รับ)
  - `bi-arrow-up-right` → `commander-action-dashboard.html` (คำสั่งที่สั่งไป)
  - `bi-easel` → `user-virtual-meeting.html` (Virtual Meeting / กลุ่ม)
  - `bi-file-earmark-arrow-down`, `bi-book`, `bi-clipboard-data` → (ยังไม่มีหน้า)
  - **feed entry**: การ์ด "แดชบอร์ด" (bi-speedometer2) ใน dashboard.html feed → `org-dashboard.html`
  - React: array `[icon, activeBool, url]` + `.map` (มี url → `<a>`, ไม่มี → `<div>`); Vue: `<a href>` ครอบ `.drawer-item`
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
- `mobile/user-today-job-mobile.html` — **แปลงกลับเป็นธีมสว่าง (light) ทั้งหมด**
- `user-virtual-meeting.html` — หน้ากลุ่ม/Virtual Meeting จากภาพตัวอย่าง (ธีมสว่าง): tabs + การ์ดเด่น + รายการกลุ่ม + sidebar กลุ่มแนะนำ — บน shell เดียวกับหน้า list — ธีมมืดเป็นแค่ตัวอย่างจากผู้ใช้ ไม่ใช้จริง (พื้นขาว #f3f5f8 / การ์ดขาว / teal #15a08f / indigo #4f46e5). โครงสร้าง navigation: bottom bar 4 แท็บคงที่ — หน้าหลัก / แชท / วิเคราะห์ข้อมูล / อื่นๆ. "คำสั่งที่ได้รับ" (Today's Job) เข้าผ่านเมนู "อื่นๆ" → push หน้า (มีปุ่ม back); ภายในมี sub-tab งานของฉัน/ของลูกทีม/จัดการ

> ⚠️ **ข้อตกลงถาวร: ห้ามทำ dark mode ทุกหน้าจอ** — ใช้ธีมสว่างเสมอ

- `create-post.html` — หน้าสร้างโพสต์ใหม่ (modal 2 คอลัมน์, rich text, แท็ก/แฮชแท็ก/WI เป็นชิป, ไฟล์แนบ, ปุ่มโพสต์ + โพสต์&สั่งการ) ลิงก์จากกล่อง compose ใน dashboard.html
- `create-command.html` — หน้าสั่งการใหม่ (wizard เลือกประเภท → สร้างคำสั่ง → ตั้งเป้าหมาย → ผู้รับผิดชอบ → ยืนยัน, มี stepper) ลิงก์จากเมนู "เพิ่มการสั่งการใหม่" ทุกหน้า + ปุ่ม "โพสต์ + สั่งการ"
- `team-action-received.html` — หน้า "คำสั่งที่ลูกทีมได้รับ" 3 มุมมองสลับด้วยปุ่มมุมขวาบน: **การ์ด** (กราฟแท่งแนวนอนสถานะรายคน + จำนวนคำสั่ง · คลิก → `assignee-action-list.html?member=<ชื่อ>` ดูรายการคำสั่งที่ได้รับทั้งหมดของคนนั้น), **รายการ** (progress bar · คลิก → `user-today-job.html?member=<ชื่อ>` Today Job), **แดชบอร์ด รายบุคคล** (dropdown เลือกลูกทีม → สถิติ + กราฟ + donut ของคนนั้น) — ลิงก์จากเมนูในหน้า commander
- `assignee-action-list.html` — รองรับ deep-link `?member=<ชื่อ>` แสดง header บริบทลูกทีม (avatar + ปุ่มย้อนกลับไป team-action-received + "คำสั่งที่ได้รับ — <ชื่อ>"); แก้ไอคอน schedule/error ใน DaysPill ที่ตกหล่นจากการ map (เคยขึ้น fallback)
- `user-today-job.html` — รวม roster ลูกทีมให้ตรงกับ team-action-received (8 คน) + รองรับ deep-link `?member=<ชื่อ>` เปิดมุมมอง Today Job ของคนนั้นทันทีเมื่อโหลด
- `user-virtual-meeting.html` — เปลี่ยนฟิลเตอร์ Easy PM "ที่อยู่ระหว่างดำเนินการ" → "กำลังดำเนินการ" + เพิ่ม badge จำนวนให้ "กำลังดำเนินการ"/"เกินสัญญา"
- **avatar ทุกหน้า** — เปลี่ยนจากรูป (การ์ตูน/ภาพถ่าย) เป็นวงกลมตัวอักษรตัวแรกของชื่อ พร้อมสีประจำตัว (CSS ล้วน ไม่พึ่งรูปจากเน็ต)
- **ไอคอนทุกหน้า → Bootstrap Icons** — แปลง Material Symbols ทั้งหมด (~120 ชื่อ) มาเป็นคลาส `bi-*` ผ่านตาราง map ใน helper `ms()`/`ic()`; ลบ Material Symbols font ออกทุกไฟล์
