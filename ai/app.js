// ===== AI Usage & Reset Tracker - Minimal Actual Time Prioritized =====

const DEFAULT_DATA = {
    claude: { hourResetTime: null, weekResetTime: null, expiryDate: null },
    gemini: { hourResetTime: null, weekResetTime: null, expiryDate: null },
    chatgpt: { hourResetTime: null, weekResetTime: null, expiryDate: null },
    v0: { hourResetTime: null, weekResetTime: null, expiryDate: null },
    settings: { timezone: 'Asia/Bangkok', theme: 'dark' }
};

let appData = {};

function loadData() {
    try {
        const saved = localStorage.getItem('aiUsageTracker');
        if (saved) {
            const parsed = JSON.parse(saved);
            appData = deepMerge(structuredClone(DEFAULT_DATA), parsed);
            if (appData.gemini && parsed.gemini && parsed.gemini.resetTime && !appData.gemini.hourResetTime) {
                appData.gemini.hourResetTime = parsed.gemini.resetTime;
            }
        } else {
            appData = structuredClone(DEFAULT_DATA);
        }
    } catch (e) {
        console.error('Failed to load data:', e);
        appData = structuredClone(DEFAULT_DATA);
    }
    applyTheme(appData.settings?.theme || 'dark');
}

function saveData() {
    try {
        localStorage.setItem('aiUsageTracker', JSON.stringify(appData));
    } catch (e) {
        console.error('Failed to save data:', e);
    }
}

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        const darkIcon = document.getElementById('iconDark');
        const lightIcon = document.getElementById('iconLight');
        if (darkIcon) darkIcon.style.display = 'none';
        if (lightIcon) lightIcon.style.display = 'inline-block';
    } else {
        document.body.classList.remove('light-theme');
        const darkIcon = document.getElementById('iconDark');
        const lightIcon = document.getElementById('iconLight');
        if (darkIcon) darkIcon.style.display = 'inline-block';
        if (lightIcon) lightIcon.style.display = 'none';
    }
    const themeSelect = document.getElementById('settingTheme');
    if (themeSelect) themeSelect.value = theme || 'dark';
}

function toggleTheme() {
    const current = appData.settings.theme === 'light' ? 'dark' : 'light';
    appData.settings.theme = current;
    applyTheme(current);
    saveData();
    showToast(`<i class="bi bi-check-circle-fill"></i> สลับเป็นโหมด${current === 'light' ? 'สว่าง' : 'มืด'}แล้ว!`, 'success');
}

function formatShortDate(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('th-TH', {
        timeZone: appData.settings?.timezone || 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// ===== Primary Display: Actual Target Clock Time ("วันนี้ 19.17 น.") =====
function formatTargetClockTime(isoString) {
    if (!isoString) return '--';
    const target = new Date(isoString);
    if (isNaN(target.getTime())) return '--';
    const now = new Date();
    if (target <= now) return 'พร้อมใช้งาน';

    const hours = String(target.getHours()).padStart(2, '0');
    const minutes = String(target.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}.${minutes} น.`;

    const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMid = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diffDays = Math.round((targetMid - nowMid) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `วันนี้ ${timeStr}`;
    } else if (diffDays === 1) {
        return `พรุ่งนี้ ${timeStr}`;
    } else if (diffDays === 2) {
        return `มะรืนนี้ ${timeStr}`;
    } else {
        const shortDate = target.toLocaleDateString('th-TH', {
            timeZone: appData.settings?.timezone || 'Asia/Bangkok',
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        return `${shortDate} • ${timeStr}`;
    }
}

// ===== Secondary Display: Countdown ("(อีก 04:20:22)") =====
function getCountdown(targetIso) {
    if (!targetIso) return { text: 'ยังไม่ได้ตั้งค่า', totalSeconds: 0, expired: false, notSet: true };
    const now = new Date();
    const target = new Date(targetIso);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
        return { text: 'รีเซ็ตเรียบร้อยแล้ว', totalSeconds: 0, expired: true, notSet: false };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let cdStr = '';
    if (days > 0) {
        cdStr = `${days} วัน ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        cdStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return { text: `(อีก ${cdStr})`, totalSeconds: diff / 1000, expired: false, notSet: false };
}

function getDaysRemaining(dateString) {
    if (!dateString) return { text: '-- วัน', days: null };
    const now = new Date();
    const target = new Date(dateString);
    if (isNaN(target.getTime())) return { text: '-- วัน', days: null };

    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diff = targetMidnight.getTime() - nowMidnight.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'หมดอายุ', days: days, expired: true };
    if (days === 0) return { text: 'วันนี้', days: 0, expired: true };
    return { text: `${days} วัน`, days: days };
}

function quickAdd(providerKey, windowType, hoursToAdd) {
    const baseTime = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    appData[providerKey][`${windowType}ResetTime`] = baseTime.toISOString();
    saveData();
    updateAll();
    const label = hoursToAdd >= 24 ? `${hoursToAdd / 24} วัน` : `${hoursToAdd} ชม.`;
    showToast(`<i class="bi bi-clock-history"></i> ต่อเวลา ${providerKey.toUpperCase()} อีก ${label} แล้ว!`, 'success');
}

function updateCurrentTime() {
    const now = new Date();
    const formatted = now.toLocaleTimeString('th-TH', {
        timeZone: appData.settings?.timezone || 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const el = document.getElementById('currentDateTime');
    if (el) el.textContent = `${formatted} น.`;
}

function updateAICard(key) {
    const data = appData[key];
    if (!data) return;

    // 1. Hour Limit
    const hourCd = getCountdown(data.hourResetTime);
    const hourTargetEl = document.getElementById(`${key}HourTarget`);
    const hourCountdownEl = document.getElementById(`${key}HourCountdown`);
    
    if (hourTargetEl) {
        hourTargetEl.textContent = formatTargetClockTime(data.hourResetTime);
        hourTargetEl.classList.toggle('ready-text', hourCd.expired);
    }
    if (hourCountdownEl) {
        hourCountdownEl.textContent = hourCd.text;
    }

    // 2. Weekly Limit
    const weekCd = getCountdown(data.weekResetTime);
    const weekTargetEl = document.getElementById(`${key}WeekTarget`);
    const weekCountdownEl = document.getElementById(`${key}WeekCountdown`);
    
    if (weekTargetEl) {
        weekTargetEl.textContent = formatTargetClockTime(data.weekResetTime);
        weekTargetEl.classList.toggle('ready-text', weekCd.expired);
    }
    if (weekCountdownEl) {
        weekCountdownEl.textContent = weekCd.text;
    }

    // 3. Expiry
    const expiry = getDaysRemaining(data.expiryDate);
    const expiryEl = document.getElementById(`${key}Expiry`);
    const expiryCountdownEl = document.getElementById(`${key}ExpiryCountdown`);
    
    if (expiryEl) expiryEl.textContent = formatShortDate(data.expiryDate);
    if (expiryCountdownEl) {
        expiryCountdownEl.textContent = expiry.text;
        updateExpiryColor(expiryCountdownEl, expiry.days);
    }
}

function updateExpiryColor(el, days) {
    el.classList.remove('tag-warn', 'tag-danger');
    if (days !== null) {
        if (days <= 3) el.classList.add('tag-danger');
        else if (days <= 7) el.classList.add('tag-warn');
    }
}

function updateAll() {
    updateCurrentTime();
    updateAICard('claude');
    updateAICard('gemini');
    updateAICard('chatgpt');
    updateAICard('v0');
}

let currentEditKey = null;

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const PROVIDER_NAMES = { claude: 'Claude Pro', gemini: 'Gemini Pro', chatgpt: 'ChatGPT Pro', v0: 'v0 Pro' };

function openEditModal(key) {
    currentEditKey = key;
    document.getElementById('editModalTitle').innerHTML = `<i class="bi bi-pencil-square"></i> ตั้งค่าเวลาของ ${PROVIDER_NAMES[key]}`;
    document.getElementById('editModalBody').innerHTML = buildEditForm(key);
    populateForm(key);
    openModal('editModal');
}

function buildEditForm(key) {
    return `
        <div class="form-section-title"><i class="bi bi-clock-history"></i> รอบเวลาสั้น (Hour/Daily Limit)</div>
        <div class="form-group">
            <label>เวลา Reset รอบถัดไป</label>
            <input type="datetime-local" id="editHourReset" onclick="try { this.showPicker(); } catch(e){}" style="cursor: pointer;" title="คลิกเพื่อเลือกวันและเวลา">
            <div class="quick-form-buttons">
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 3)">+3 ชม.</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 5)">+5 ชม.</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 12)">+12 ชม.</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 24)">+24 ชม.</button>
            </div>
        </div>

        <div class="form-section-title" style="margin-top: 20px;"><i class="bi bi-calendar-week"></i> รอบสัปดาห์ (Weekly Limit)</div>
        <div class="form-group">
            <label>เวลา Reset รอบสัปดาห์ถัดไป</label>
            <input type="datetime-local" id="editWeekReset" onclick="try { this.showPicker(); } catch(e){}" style="cursor: pointer;" title="คลิกเพื่อเลือกวันและเวลา">
            <div class="quick-form-buttons">
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editWeekReset', 168)">+7 วัน</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editWeekReset', 336)">+14 วัน</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editWeekReset', 720)">+30 วัน</button>
            </div>
        </div>

        <div class="form-section-title" style="margin-top: 20px;"><i class="bi bi-calendar-check"></i> วันหมดอายุ Subscription</div>
        <div class="form-group">
            <label>วันที่หมดอายุรอบบิล</label>
            <input type="date" id="editExpiry" onclick="try { this.showPicker(); } catch(e){}" style="cursor: pointer;" title="คลิกเพื่อเลือกวันที่">
        </div>
    `;
}

function setQuickFormDate(inputId, hoursToAdd) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const targetDate = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    input.value = toLocalDatetimeString(targetDate.toISOString());
}

function populateForm(key) {
    const data = appData[key];
    if (!data) return;
    if (data.hourResetTime) document.getElementById('editHourReset').value = toLocalDatetimeString(data.hourResetTime);
    if (data.weekResetTime) document.getElementById('editWeekReset').value = toLocalDatetimeString(data.weekResetTime);
    if (data.expiryDate) document.getElementById('editExpiry').value = data.expiryDate;
}

function toLocalDatetimeString(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function saveEdit() {
    if (!currentEditKey) return;
    const hourReset = document.getElementById('editHourReset').value;
    appData[currentEditKey].hourResetTime = hourReset ? new Date(hourReset).toISOString() : null;

    const weekReset = document.getElementById('editWeekReset').value;
    appData[currentEditKey].weekResetTime = weekReset ? new Date(weekReset).toISOString() : null;

    const expiry = document.getElementById('editExpiry').value;
    appData[currentEditKey].expiryDate = expiry || null;

    saveData();
    updateAll();
    closeModal('editModal');
    showToast(`<i class="bi bi-check-circle-fill"></i> บันทึกเวลาของ ${PROVIDER_NAMES[currentEditKey]} เรียบร้อย!`, 'success');
}

function saveSettings() {
    appData.settings.timezone = document.getElementById('settingTimezone').value;
    const themeVal = document.getElementById('settingTheme').value;
    appData.settings.theme = themeVal;
    applyTheme(themeVal);
    saveData();
    updateAll();
    closeModal('settingsModal');
    showToast('<i class="bi bi-check-circle-fill"></i> บันทึกการตั้งค่าแล้ว!', 'success');
}

function showToast(message, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function initEventListeners() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const faqBtn = document.getElementById('faqBtn');
    if (faqBtn) faqBtn.addEventListener('click', () => openModal('faqModal'));

    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingTimezone').value = appData.settings?.timezone || 'Asia/Bangkok';
        document.getElementById('settingTheme').value = appData.settings?.theme || 'dark';
        openModal('settingsModal');
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
        updateAll();
        showToast('<i class="bi bi-arrow-clockwise"></i> อัพเดตข้อมูลล่าสุดแล้ว!', 'success');
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal.id));
        }
    });
}

function init() {
    loadData();
    initEventListeners();
    updateAll();
    setInterval(updateAll, 1000);
}

document.addEventListener('DOMContentLoaded', init);
