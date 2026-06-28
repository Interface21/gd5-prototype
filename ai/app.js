// ===== AI Usage & Reset Tracker - Main Application =====

// Default data structure for 4 AI Providers
const DEFAULT_DATA = {
    claude: {
        hourResetTime: null, // ISO string of next short window reset
        weekResetTime: null, // ISO string of next weekly window reset
        expiryDate: null,    // ISO string YYYY-MM-DD
    },
    gemini: {
        hourResetTime: null,
        weekResetTime: null,
        expiryDate: null,
    },
    chatgpt: {
        hourResetTime: null,
        weekResetTime: null,
        expiryDate: null,
    },
    v0: {
        hourResetTime: null,
        weekResetTime: null,
        expiryDate: null,
    },
    settings: {
        timezone: 'Asia/Bangkok',
        theme: 'dark'
    }
};

// ===== State Management =====
let appData = {};

function loadData() {
    try {
        const saved = localStorage.getItem('aiUsageTracker');
        if (saved) {
            const parsed = JSON.parse(saved);
            appData = deepMerge(structuredClone(DEFAULT_DATA), parsed);
            
            // Migration for old structure if any
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

// ===== Theme Management =====
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        const darkIcon = document.getElementById('themeIconDark');
        const lightIcon = document.getElementById('themeIconLight');
        if (darkIcon) darkIcon.style.display = 'none';
        if (lightIcon) lightIcon.style.display = 'block';
    } else {
        document.body.classList.remove('light-theme');
        const darkIcon = document.getElementById('themeIconDark');
        const lightIcon = document.getElementById('themeIconLight');
        if (darkIcon) darkIcon.style.display = 'block';
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
    showToast(`สลับเป็น ${current === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'} แล้ว!`, 'success');
}

// ===== Date/Time Utilities =====
function formatDateTime(isoString) {
    if (!isoString) return 'ยังไม่ได้ตั้งค่า';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'ยังไม่ได้ตั้งค่า';
    return date.toLocaleString('th-TH', {
        timeZone: appData.settings?.timezone || 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

function formatDate(isoString) {
    if (!isoString) return 'ยังไม่ได้ระบุ';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'ยังไม่ได้ระบุ';
    return date.toLocaleDateString('th-TH', {
        timeZone: appData.settings?.timezone || 'Asia/Bangkok',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });
}

function getCountdown(targetIso) {
    if (!targetIso) return { text: '--:--:--', totalSeconds: 0, expired: false, notSet: true };
    const now = new Date();
    const target = new Date(targetIso);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
        // Find how long ago it expired
        const passedSeconds = Math.abs(diff) / 1000;
        return { text: '00:00:00', totalSeconds: 0, expired: true, notSet: false, passedSeconds };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let text = '';
    if (days > 0) {
        text = `${days}วัน ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return { text, totalSeconds: diff / 1000, expired: false, notSet: false };
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

    if (days < 0) return { text: 'หมดอายุแล้ว', days: days, expired: true };
    if (days === 0) return { text: 'หมดอายุวันนี้', days: 0, expired: true };
    if (days === 1) return { text: '1 วัน', days: 1 };
    return { text: `${days} วัน`, days: days };
}

// ===== Quick Add Time Function =====
function quickAdd(providerKey, windowType, hoursToAdd) {
    const currentIso = appData[providerKey][`${windowType}ResetTime`];
    let baseTime = new Date();
    
    // If future time exists, we can either add from now or add from existing. Let's add from NOW for short reset cycles.
    baseTime = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    
    appData[providerKey][`${windowType}ResetTime`] = baseTime.toISOString();
    saveData();
    updateAll();
    
    const label = hoursToAdd >= 24 ? `${hoursToAdd / 24} วัน` : `${hoursToAdd} ชั่วโมง`;
    showToast(`⏱️ ตั้งเวลา Reset ของ ${providerKey.toUpperCase()} อีก ${label} นับจากตอนนี้แล้ว!`, 'success');
}

// ===== UI Update Functions =====
function updateCurrentTime() {
    const now = new Date();
    const formatted = now.toLocaleString('th-TH', {
        timeZone: appData.settings?.timezone || 'Asia/Bangkok',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const el = document.getElementById('currentDateTime');
    if (el) el.textContent = formatted;
}

function updateAICard(key) {
    const data = appData[key];
    if (!data) return;

    // 1. Hour / Short Window
    const hourCd = getCountdown(data.hourResetTime);
    const hourCountdownEl = document.getElementById(`${key}HourCountdown`);
    const hourStatusEl = document.getElementById(`${key}HourStatus`);
    const hourResetEl = document.getElementById(`${key}HourResetTime`);

    if (hourCountdownEl) hourCountdownEl.textContent = hourCd.text;
    if (hourResetEl) hourResetEl.textContent = formatDateTime(data.hourResetTime);
    
    if (hourStatusEl) {
        hourStatusEl.className = 'status-badge';
        if (hourCd.notSet) {
            hourStatusEl.textContent = '⏸️ ยังไม่ตั้งเวลา';
            hourStatusEl.classList.add('status-neutral');
        } else if (hourCd.expired) {
            hourStatusEl.textContent = '🟢 พร้อมใช้งาน / รีเซ็ตแล้ว';
            hourStatusEl.classList.add('status-ready');
        } else {
            hourStatusEl.textContent = '⏳ กำลังนับถอยหลัง';
            hourStatusEl.classList.add('status-counting');
        }
    }

    // 2. Weekly / Long Window
    const weekCd = getCountdown(data.weekResetTime);
    const weekCountdownEl = document.getElementById(`${key}WeekCountdown`);
    const weekStatusEl = document.getElementById(`${key}WeekStatus`);
    const weekResetEl = document.getElementById(`${key}WeekResetTime`);

    if (weekCountdownEl) weekCountdownEl.textContent = weekCd.text;
    if (weekResetEl) weekResetEl.textContent = formatDateTime(data.weekResetTime);

    if (weekStatusEl) {
        weekStatusEl.className = 'status-badge';
        if (weekCd.notSet) {
            weekStatusEl.textContent = '⏸️ ยังไม่ตั้งเวลา';
            weekStatusEl.classList.add('status-neutral');
        } else if (weekCd.expired) {
            weekStatusEl.textContent = '🟢 โควต้ารอบใหม่พร้อมแล้ว';
            weekStatusEl.classList.add('status-ready');
        } else {
            weekStatusEl.textContent = '⏳ กำลังนับถอยหลัง';
            weekStatusEl.classList.add('status-counting');
        }
    }

    // 3. Expiry
    const expiry = getDaysRemaining(data.expiryDate);
    const expiryEl = document.getElementById(`${key}Expiry`);
    const expiryCountdownEl = document.getElementById(`${key}ExpiryCountdown`);
    
    if (expiryEl) expiryEl.textContent = formatDate(data.expiryDate);
    if (expiryCountdownEl) {
        expiryCountdownEl.textContent = expiry.text;
        updateExpiryColor(expiryCountdownEl, expiry.days);
    }
}

function updateExpiryColor(el, days) {
    el.classList.remove('expiry-warning', 'expiry-danger');
    if (days !== null) {
        if (days <= 3) {
            el.classList.add('expiry-danger');
        } else if (days <= 7) {
            el.classList.add('expiry-warning');
        }
    }
}

function updateAll() {
    updateCurrentTime();
    updateAICard('claude');
    updateAICard('gemini');
    updateAICard('chatgpt');
    updateAICard('v0');
}

// ===== Modal Functions =====
let currentEditKey = null;

function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

const PROVIDER_NAMES = {
    claude: 'Claude Pro',
    gemini: 'Gemini Pro',
    chatgpt: 'ChatGPT Pro',
    v0: 'v0 Pro'
};

function openEditModal(key) {
    currentEditKey = key;
    const title = document.getElementById('editModalTitle');
    const body = document.getElementById('editModalBody');

    title.textContent = `✏️ ตั้งค่าเวลา Reset ของ ${PROVIDER_NAMES[key]}`;
    body.innerHTML = buildEditForm(key);
    populateForm(key);

    openModal('editModal');
}

function buildEditForm(key) {
    return `
        <div class="form-section-title">⏱️ รอบเวลาสั้น (Hour / Daily Limit)</div>
        <div class="form-group">
            <label>เวลา Reset รอบถัดไป</label>
            <input type="datetime-local" id="editHourReset">
            <div class="quick-form-buttons">
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 3)">+3 ชม.</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 5)">+5 ชม.</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 12)">+12 ชม.</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editHourReset', 24)">+24 ชม. (1 วัน)</button>
            </div>
        </div>

        <div class="form-section-title" style="margin-top: 24px;">📊 รอบสัปดาห์ / ยาว (Weekly Limit)</div>
        <div class="form-group">
            <label>เวลา Reset รอบสัปดาห์ถัดไป</label>
            <input type="datetime-local" id="editWeekReset">
            <div class="quick-form-buttons">
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editWeekReset', 168)">+7 วัน (1 สัปดาห์)</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editWeekReset', 336)">+14 วัน (2 สัปดาห์)</button>
                <button type="button" class="btn-quick-form" onclick="setQuickFormDate('editWeekReset', 720)">+30 วัน (1 เดือน)</button>
            </div>
        </div>

        <div class="form-section-title" style="margin-top: 24px;">📆 วันหมดอายุ Subscription</div>
        <div class="form-group">
            <label>วันที่หมดอายุรอบบิล</label>
            <input type="date" id="editExpiry">
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

    if (data.hourResetTime) {
        document.getElementById('editHourReset').value = toLocalDatetimeString(data.hourResetTime);
    }
    if (data.weekResetTime) {
        document.getElementById('editWeekReset').value = toLocalDatetimeString(data.weekResetTime);
    }
    if (data.expiryDate) {
        document.getElementById('editExpiry').value = data.expiryDate;
    }
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
    showToast(`✅ บันทึกเวลา Reset ของ ${PROVIDER_NAMES[currentEditKey]} เรียบร้อยแล้ว!`, 'success');
}

function saveSettings() {
    appData.settings.timezone = document.getElementById('settingTimezone').value;
    const themeVal = document.getElementById('settingTheme').value;
    appData.settings.theme = themeVal;
    applyTheme(themeVal);
    saveData();
    updateAll();
    closeModal('settingsModal');
    showToast('⚙️ บันทึกการตั้งค่าแล้ว!', 'success');
}

// ===== Toast Notifications =====
function showToast(message, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== Event Listeners =====
function initEventListeners() {
    // Theme toggle button
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingTimezone').value = appData.settings?.timezone || 'Asia/Bangkok';
        document.getElementById('settingTheme').value = appData.settings?.theme || 'dark';
        openModal('settingsModal');
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        updateAll();
        showToast('🔄 อัพเดตเวลาล่าสุดแล้ว!', 'success');
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// ===== Initialize App =====
function init() {
    loadData();
    initEventListeners();
    updateAll();
    setInterval(updateAll, 1000);
}

document.addEventListener('DOMContentLoaded', init);
