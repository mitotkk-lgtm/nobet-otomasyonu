/**
 * Pansiyon Belletmen Nöbet Dağıtım Uygulaması (Main Application Controller)
 */

(() => {
  // DOM Seçiciler
  const selectMonth = document.getElementById('select-month');
  const selectYear = document.getElementById('select-year');
  const btnQuickDistribute = document.getElementById('btn-quick-distribute');
  const btnClearSchedule = document.getElementById('btn-clear-schedule');
  const activeDaysCountEl = document.getElementById('active-days-count');
  const closedDaysCountEl = document.getElementById('closed-days-count');

  // Çizelge ve Tablo DOM
  const rosterTable = document.getElementById('roster-table');
  const rosterThead = document.getElementById('roster-thead');
  const rosterTbody = document.getElementById('roster-tbody');
  const femaleStatsTbody = document.getElementById('female-stats-tbody');
  const maleStatsTbody = document.getElementById('male-stats-tbody');
  const btnConfigColumns = document.getElementById('btn-config-columns');
  const activeColumnsCountEl = document.getElementById('active-columns-count');

  // Sütun Yapılandırma Modal DOM
  const modalColumnsConfig = document.getElementById('modal-columns-config');
  const mFemaleCountPicker = document.getElementById('m-female-count-picker');
  const mMaleCountPicker = document.getElementById('m-male-count-picker');
  const mColumnsTotalBadge = document.getElementById('m-columns-total-badge');
  const mColumnsConfigList = document.getElementById('m-columns-config-list');
  const btnColumnsModalClose = document.getElementById('btn-columns-modal-close');
  const btnColumnsModalCancel = document.getElementById('btn-columns-modal-cancel');
  const btnColumnsModalApply = document.getElementById('btn-columns-modal-apply');
  const btnColumnsModalApplyRedistribute = document.getElementById('btn-columns-modal-apply-redistribute');

  // Başlık ve İmzalar DOM
  const dispInstTop = document.getElementById('disp-inst-top');
  const dispInstMid = document.getElementById('disp-inst-mid');
  const dispSchoolName = document.getElementById('disp-school-name');
  const dispRosterTitle = document.getElementById('disp-roster-title');
  const dispApprovalDate = document.getElementById('disp-approval-date');
  const dispVicePrincipal = document.getElementById('disp-vice-principal');
  const dispViceTitle = document.getElementById('disp-vice-title');
  const dispPrincipal = document.getElementById('disp-principal');
  const dispPrincipalTitle = document.getElementById('disp-principal-title');

  // Navigasyon ve Sekmeler
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Üst Bar & Dışa Aktarma Butonları
  const btnSaveSchedule = document.getElementById('btn-save-schedule');
  const btnExportPdf = document.getElementById('btn-export-pdf');
  const btnExportExcel = document.getElementById('btn-export-excel');
  const btnPrint = document.getElementById('btn-print');

  // Sihirbaz (Wizard) DOM
  const btnOpenWizard = document.getElementById('btn-open-wizard');
  const modalWizard = document.getElementById('modal-wizard');
  const btnWizardClose = document.getElementById('btn-wizard-close');
  const wBtnPrev = document.getElementById('w-btn-prev');
  const wBtnNext = document.getElementById('w-btn-next');
  const wBtnFinish = document.getElementById('w-btn-finish');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const stepBubbles = document.querySelectorAll('.step-bubble');

  const wSelectMonth = document.getElementById('w-select-month');
  const wInputYear = document.getElementById('w-input-year');
  const wDispMonthDays = document.getElementById('w-disp-month-days');
  const wFemaleCountPicker = document.getElementById('w-female-count-picker');
  const wMaleCountPicker = document.getElementById('w-male-count-picker');
  const wColumnsTotalBadge = document.getElementById('w-columns-total-badge');
  const wColumnsConfigList = document.getElementById('w-columns-config-list');
  const wCalendarContainer = document.getElementById('w-calendar-container');
  const wBtnAratatil = document.getElementById('w-btn-aratatil');
  const wBtnOpenAll = document.getElementById('w-btn-open-all');

  const wSelectTeacher = document.getElementById('w-select-teacher');
  const wTeacherExempt = document.getElementById('w-teacher-exempt');
  const wTeacherDatesGrid = document.getElementById('w-teacher-dates-grid');
  const wDayBlocks = document.querySelectorAll('.w-day-block');
  const wBtnSaveConstraint = document.getElementById('w-btn-save-teacher-constraint');
  const wActiveConstraintsList = document.getElementById('w-active-constraints-list');

  // Manuel Slot Edit Modal DOM
  const modalSlotEdit = document.getElementById('modal-slot-edit');
  const btnSlotModalClose = document.getElementById('btn-slot-modal-close');
  const btnSlotCancel = document.getElementById('btn-slot-cancel');
  const btnSlotClear = document.getElementById('btn-slot-clear');
  const slotInfoDate = document.getElementById('slot-info-date');
  const slotInfoRole = document.getElementById('slot-info-role');
  const slotCurrentTeacher = document.getElementById('slot-current-teacher');
  const slotCandidateSearch = document.getElementById('slot-candidate-search');
  const candidateTeachersList = document.getElementById('candidate-teachers-list');

  // Öğretmen Yönetimi DOM
  const femaleTeachersListEl = document.getElementById('female-teachers-list');
  const maleTeachersListEl = document.getElementById('male-teachers-list');
  const femaleCountEl = document.getElementById('female-count');
  const maleCountEl = document.getElementById('male-count');
  const btnAddTeacher = document.getElementById('btn-add-teacher');
  const modalTeacherEdit = document.getElementById('modal-teacher-edit');
  const btnTeacherModalClose = document.getElementById('btn-teacher-modal-close');
  const teacherForm = document.getElementById('teacher-form');
  const teacherInputName = document.getElementById('teacher-input-name');
  const teacherInputGender = document.getElementById('teacher-input-gender');
  const teacherInputEtut = document.getElementById('teacher-input-etut');
  const teacherInputActive = document.getElementById('teacher-input-active');
  const fileExcelUpload = document.getElementById('file-excel-upload');

  // Tatil Yönetimi Tab 3 DOM
  const calendarGrid = document.getElementById('calendar-grid');
  const btnPresetAratatil = document.getElementById('btn-preset-aratatil');
  const btnPresetAllOpen = document.getElementById('btn-preset-all-open');

  // Ayarlar Formu DOM
  const settingsForm = document.getElementById('settings-form');
  const settingInstTop = document.getElementById('setting-inst-top');
  const settingInstMid = document.getElementById('setting-inst-mid');
  const settingSchoolName = document.getElementById('setting-school-name');
  const settingApprovalDate = document.getElementById('setting-approval-date');
  const settingVicePrincipal = document.getElementById('setting-vice-principal');
  const settingViceTitle = document.getElementById('setting-vice-title');
  const settingPrincipal = document.getElementById('setting-principal');
  const settingPrincipalTitle = document.getElementById('setting-principal-title');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

  // Uygulama Durumu (State)
  let currentYear = 2026;
  let currentMonth = 10; // Kasım (0-indexli)
  let teachers = [];
  let closedDates = {}; // { '2026-11-14': 'ARA TATİL' }
  let scheduleDays = [];
  let dutyColumns = window.dutyScheduler.getDefaultDutyColumns(); // Kız 0..3 + Erkek 0..3 = Toplam 1..6 dinamik belletici sütunu
  let monthlySchedules = {}; // { '2026_10': [...], '2026_11': [...] }
  let monthlyClosedDates = {}; // { '2026_10': { ... } }
  let monthlyDutyColumns = {}; // { '2026_10': [...] }
  let wizardDutyColumns = window.dutyScheduler.getDefaultDutyColumns();
  let modalDutyColumns = window.dutyScheduler.getDefaultDutyColumns();
  let currentWizardStep = 1;
  let editingSlot = null; // { dayIndex, role: 'kiz1'|'kiz2'|'kiz3'|'erkek1'|'erkek2'|'erkek3'|'etut' }

  // Dinamik Sütun Yardımcıları (Kız maks. 3 + Erkek maks. 3 = Toplam maks. 6 belletici sütunu)
  const MAX_PER_GENDER = 3;
  const MAX_DUTY_COLUMNS = 6;
  const AUTO_TITLES_PATTERN = /^(KIZ PANSİYONU|ERKEK PANSİYONU|NÖBETÇİ BELLETMEN)(\s*\(\d+\))?$/;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getActiveColumnIds() {
    return dutyColumns.map(c => c.id);
  }

  function getColumnStyleMeta(gender) {
    if (gender === 'K') {
      return { thClass: 'col-female', slotClass: 'slot-female', badgeClass: 'badge-female' };
    }
    return { thClass: 'col-male', slotClass: 'slot-male', badgeClass: 'badge-male' };
  }

  function refreshAutoTitles(cols) {
    const fCount = cols.filter(c => c.gender === 'K').length;
    const mCount = cols.filter(c => c.gender === 'E').length;
    let fIdx = 0;
    let mIdx = 0;

    cols.forEach(c => {
      const isAuto = !c.title || AUTO_TITLES_PATTERN.test(c.title.trim());
      if (c.gender === 'K') {
        fIdx++;
        if (isAuto) c.title = fCount === 1 ? 'KIZ PANSİYONU' : `KIZ PANSİYONU (${fIdx})`;
      } else {
        mIdx++;
        if (isAuto) c.title = mCount === 1 ? 'ERKEK PANSİYONU' : `ERKEK PANSİYONU (${mIdx})`;
      }
    });
  }

  function rebuildDraftColumns(draftCols, newFemaleCount, newMaleCount) {
    const fCount = Math.min(MAX_PER_GENDER, Math.max(0, parseInt(newFemaleCount, 10) || 0));
    const mCount = Math.min(MAX_PER_GENDER, Math.max(0, parseInt(newMaleCount, 10) || 0));

    // Otomatik başlıklara sahip sütunların yeni sayıya göre yeniden adlandırılması için sıfırla
    const cleanedExisting = (draftCols || []).map(c => ({
      ...c,
      title: AUTO_TITLES_PATTERN.test((c.title || '').trim()) ? '' : c.title
    }));

    const next = window.dutyScheduler.buildDutyColumns(fCount, mCount, cleanedExisting);
    refreshAutoTitles(next);
    return next;
  }

  function renderColumnsConfigEditor(cfg) {
    const { femalePicker, malePicker, totalBadge, listEl, getCols, setCols } = cfg;
    if (!femalePicker || !malePicker || !listEl) return;

    const cols = window.dutyScheduler.normalizeDutyColumns(getCols());
    setCols(cols);

    const femaleCount = cols.filter(c => c.gender === 'K').length;
    const maleCount = cols.filter(c => c.gender === 'E').length;

    if (totalBadge) {
      totalBadge.textContent = `Toplam: ${femaleCount + maleCount} / ${MAX_DUTY_COLUMNS} Sütun (Kız: ${femaleCount}, Erkek: ${maleCount})`;
    }

    femalePicker.querySelectorAll('.col-count-btn').forEach(btn => {
      const val = parseInt(btn.dataset.count, 10);
      btn.classList.toggle('active', val === femaleCount);
      btn.onclick = () => {
        if (val === 0 && maleCount === 0) {
          showToast('Uyarı', 'En az 1 nöbetçi belletici sütunu seçili olmalıdır.', 'error');
          return;
        }
        const updated = rebuildDraftColumns(getCols(), val, maleCount);
        setCols(updated);
        renderColumnsConfigEditor(cfg);
      };
    });

    malePicker.querySelectorAll('.col-count-btn').forEach(btn => {
      const val = parseInt(btn.dataset.count, 10);
      btn.classList.toggle('active', val === maleCount);
      btn.onclick = () => {
        if (val === 0 && femaleCount === 0) {
          showToast('Uyarı', 'En az 1 nöbetçi belletici sütunu seçili olmalıdır.', 'error');
          return;
        }
        const updated = rebuildDraftColumns(getCols(), femaleCount, val);
        setCols(updated);
        renderColumnsConfigEditor(cfg);
      };
    });

    listEl.innerHTML = '';
    let fSeq = 0;
    let mSeq = 0;
    cols.forEach((col, idx) => {
      const meta = getColumnStyleMeta(col.gender);
      const badgeLabel = col.gender === 'K' ? `👩 Kız ${++fSeq}` : `👨 Erkek ${++mSeq}`;
      const row = document.createElement('div');
      row.className = 'col-config-row';
      row.innerHTML = `
        <span class="col-config-badge ${meta.badgeClass}">${badgeLabel}</span>
        <input type="text" class="form-control col-title-input" value="${escapeHtml(col.title)}" placeholder="Sütun başlığı" style="font-size: 0.82rem; padding: 5px 9px;">
      `;

      const titleInput = row.querySelector('.col-title-input');
      titleInput.addEventListener('input', () => {
        const current = getCols();
        current[idx].title = titleInput.value;
        setCols(current);
      });

      listEl.appendChild(row);
    });
  }

  function updateColumnsCountBadge() {
    if (activeColumnsCountEl) {
      activeColumnsCountEl.textContent = String(dutyColumns.length);
    }
  }

  function migrateScheduleDaysList(daysList, legacyCols = null) {
    if (!Array.isArray(daysList)) return [];
    return daysList.map(d => window.dutyScheduler.migrateDayObject(d, legacyCols));
  }

  let settings = {
    instTop: 'T.C.',
    instMid: 'MİLLİ EĞİTİM BAKANLIĞI',
    schoolName: 'ANADOLU LİSESİ MÜDÜRLÜĞÜ',
    approvalDate: '... / ... / 2026\nUYGUNDUR',
    vicePrincipal: 'Nebi DEMİR',
    viceTitle: 'Pansiyondan Sorumlu Müdür Yardımcısı',
    principal: 'Hayrullah YILDIRIM',
    principalTitle: 'Okul Müdürü'
  };

  // LOCAL STORAGE & VERİ TABANI İŞLEMLERİ
  const STORAGE_KEY = 'pansiyon_nobet_data_v1';

  let toastContainer = null;
  function showToast(title, desc = '', type = 'success') {
    if (!toastContainer) {
      toastContainer = document.querySelector('.app-toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'app-toast-container';
        document.body.appendChild(toastContainer);
      }
    }

    const toast = document.createElement('div');
    toast.className = `app-toast toast-${type}`;
    
    let icon = '💾';
    if (type === 'error') icon = '❌';
    else if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `
      <div class="app-toast-icon">${icon}</div>
      <div class="app-toast-content">
        <div class="app-toast-title">${title}</div>
        ${desc ? `<div class="app-toast-desc">${desc}</div>` : ''}
      </div>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 4000);
  }

  let hasUnsavedChanges = false;

  function markAsUnsaved() {
    hasUnsavedChanges = true;
    const badge = document.getElementById('header-last-saved');
    const textEl = document.getElementById('last-saved-text');
    if (badge && textEl) {
      badge.style.display = 'inline-flex';
      badge.className = 'last-saved-badge unsaved';
      textEl.textContent = '⚠️ Kaydedilmemiş Değişiklikler Var (Kaydet Butonuna Basın)';
    }
  }

  function updateLastSavedUI(timeStr) {
    const badge = document.getElementById('header-last-saved');
    const textEl = document.getElementById('last-saved-text');
    if (badge && textEl && timeStr) {
      badge.style.display = 'inline-flex';
      badge.className = 'last-saved-badge saved';
      textEl.textContent = `Son Kayıt: ${timeStr} (Kayıtlı)`;
    }
  }

  function buildAppDataPayload() {
    const monthKey = `${currentYear}_${currentMonth}`;
    if (scheduleDays && scheduleDays.length > 0) {
      monthlySchedules[monthKey] = JSON.parse(JSON.stringify(scheduleDays));
    }
    monthlyClosedDates[monthKey] = JSON.parse(JSON.stringify(closedDates));
    monthlyDutyColumns[monthKey] = JSON.parse(JSON.stringify(dutyColumns));

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
    const lastSavedFormatted = `${dateStr} ${timeStr}`;
    const curUser = window.authManager ? window.authManager.getCurrentUser() : null;

    return {
      currentYear,
      currentMonth,
      teachers,
      scheduleDays,
      dutyColumns,
      monthlySchedules,
      monthlyClosedDates,
      monthlyDutyColumns,
      settings,
      lastSaved: lastSavedFormatted,
      savedBy: curUser ? curUser.username : '',
      lastSavedTimestamp: now.getTime()
    };
  }

  function applyParsedAppData(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.teachers && Array.isArray(parsed.teachers) && parsed.teachers.length > 0) {
      teachers = parsed.teachers;
    }
    if (parsed.settings) settings = { ...settings, ...parsed.settings };
    if (parsed.currentYear !== undefined) currentYear = parseInt(parsed.currentYear, 10);
    if (parsed.currentMonth !== undefined) currentMonth = parseInt(parsed.currentMonth, 10);

    const rawMonthlyCols = parsed.monthlyDutyColumns || {};
    if (parsed.monthlySchedules) {
      monthlySchedules = {};
      Object.keys(parsed.monthlySchedules).forEach(k => {
        const legacyCols = rawMonthlyCols[k] || parsed.dutyColumns || null;
        monthlySchedules[k] = migrateScheduleDaysList(parsed.monthlySchedules[k], legacyCols);
      });
    }
    if (parsed.monthlyClosedDates) monthlyClosedDates = parsed.monthlyClosedDates;
    if (parsed.monthlyDutyColumns) {
      monthlyDutyColumns = {};
      Object.keys(parsed.monthlyDutyColumns).forEach(k => {
        monthlyDutyColumns[k] = window.dutyScheduler.normalizeDutyColumns(parsed.monthlyDutyColumns[k]);
      });
    }

    const mKey = `${currentYear}_${currentMonth}`;
    const rawCurrentCols = rawMonthlyCols[mKey] || parsed.dutyColumns || null;
    dutyColumns = window.dutyScheduler.normalizeDutyColumns(
      (monthlyDutyColumns && monthlyDutyColumns[mKey]) || parsed.dutyColumns
    );
    monthlyDutyColumns[mKey] = JSON.parse(JSON.stringify(dutyColumns));

    if (monthlySchedules[mKey] && Array.isArray(monthlySchedules[mKey]) && monthlySchedules[mKey].length > 0) {
      scheduleDays = migrateScheduleDaysList(JSON.parse(JSON.stringify(monthlySchedules[mKey])), rawCurrentCols);
    } else if (parsed.scheduleDays && Array.isArray(parsed.scheduleDays) && parsed.scheduleDays.length > 0) {
      scheduleDays = migrateScheduleDaysList(JSON.parse(JSON.stringify(parsed.scheduleDays)), rawCurrentCols);
      monthlySchedules[mKey] = scheduleDays;
    } else {
      scheduleDays = [];
    }

    closedDates = (monthlyClosedDates && monthlyClosedDates[mKey]) || parsed.closedDates || {};

    if (parsed.lastSaved) {
      const bySuffix = parsed.savedBy ? ` — ${parsed.savedBy}` : '';
      updateLastSavedUI(`${parsed.lastSaved}${bySuffix}`);
    }

    hasUnsavedChanges = false;
    return true;
  }

  function saveToLocalStorage(options = {}) {
    if (window.authManager && window.authManager.isLoggedIn() && window.authManager.isExpired()) {
      return false;
    }
    try {
      const data = buildAppDataPayload();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY + '_backup', JSON.stringify(data));
      hasUnsavedChanges = false;
      const bySuffix = data.savedBy ? ` — ${data.savedBy}` : '';
      updateLastSavedUI(`${data.lastSaved}${bySuffix}`);

      if (!options.skipCloud && window.authManager && window.authManager.isCloudMode() && window.authManager.isLoggedIn()) {
        window.authManager.saveCloudDataAsync(data).then(res => {
          if (res && !res.ok && !res.skipped) {
            console.warn('Bulut kayıt hatası:', res.error);
            if (res.expired) syncAuthUI();
          }
        });
      }
      return true;
    } catch (e) {
      console.warn('LocalStorage kayıt hatası:', e);
      return false;
    }
  }

  function loadFromLocalStorage() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = localStorage.getItem(STORAGE_KEY + '_backup');
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        return applyParsedAppData(parsed);
      }
    } catch (e) {
      console.warn('LocalStorage yükleme hatası:', e);
    }
    return false;
  }

  async function syncFromCloudAsync(silent = false) {
    if (!window.authManager || !window.authManager.isCloudMode() || !window.authManager.isLoggedIn()) {
      return false;
    }
    const res = await window.authManager.loadCloudDataAsync();
    if (!res.ok) {
      if (!silent) {
        showToast('Bulut Senkronizasyon Hatası', res.error || 'Veriler sunucudan alınamadı.', 'error');
      }
      return false;
    }

    if (res.data) {
      applyParsedAppData(res.data);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        localStorage.setItem(STORAGE_KEY + '_backup', JSON.stringify(res.data));
      } catch {
        // ignore local quota errors
      }
      selectMonth.value = currentMonth;
      selectYear.value = currentYear;
      applySettingsToUI();
      renderScheduleTable();
      renderStatsTables();
      renderTeachersList();
      renderHolidaysCalendar();
      if (!silent) {
        showToast('Buluttan Güncellendi ☁️', 'Tüm cihazlardaki en son nöbet ve kadro verileri yüklendi.', 'success');
      }
      return true;
    }

    if (!silent) {
      showToast('Bulut Hazır ☁️', 'Henüz buluta kaydedilmiş bir çizelge yok. Kaydettiğinizde tüm cihazlarla paylaşılır.', 'info');
    }
    return false;
  }

  async function handleManualSave() {
    if (!ensureNotExpiredOrAlert()) return;
    const isCloud = !!(window.authManager && window.authManager.isCloudMode() && window.authManager.isLoggedIn());
    const data = buildAppDataPayload();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY + '_backup', JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage kayıt hatası:', e);
    }

    if (isCloud) {
      const origHtml = btnSaveSchedule ? btnSaveSchedule.innerHTML : '';
      if (btnSaveSchedule) {
        btnSaveSchedule.disabled = true;
        btnSaveSchedule.innerHTML = '⏳ Buluta Kaydediliyor...';
      }
      try {
        const cloudRes = await window.authManager.saveCloudDataAsync(data);
        if (!cloudRes.ok) {
          if (cloudRes.expired) syncAuthUI();
          showToast('Bulut Kaydı Başarısız!', cloudRes.error || 'Sunucuya yazılamadı.', 'error');
          alert(cloudRes.error || 'Bulut veritabanına kaydedilemedi.');
          return;
        }
        hasUnsavedChanges = false;
        const bySuffix = data.savedBy ? ` — ${data.savedBy}` : '';
        updateLastSavedUI(`${data.lastSaved}${bySuffix} (Bulut)`);
        showToast('Bulut Veritabanına Kaydedildi! ☁️💾', 'Nöbet çizelgesi, öğretmen kadrosu ve ayarlar tüm cihazlarda ortak olarak güncellendi.', 'success');
      } finally {
        if (btnSaveSchedule) {
          btnSaveSchedule.disabled = false;
          btnSaveSchedule.innerHTML = origHtml || '<span>💾</span> Nöbetleri Kaydet';
        }
      }
      return;
    }

    hasUnsavedChanges = false;
    updateLastSavedUI(data.lastSaved);
    showToast('Nöbetler Başarıyla Kaydedildi! 💾', 'Sayfayı kapatıp açtığınızda kaydettiğiniz en son çizelge otomatik olarak açılacaktır.', 'success');
  }

  function revertToLastSaved() {
    if (!ensureNotExpiredOrAlert()) return;
    if (!hasUnsavedChanges) {
      showToast('Bilgi', 'Zaten en son kaydedilen durumdasınız, kaydedilmemiş değişiklik yok.', 'info');
      return;
    }
    if (confirm('Kaydedilmemiş değişiklikleri iptal etmek ve en son kaydettiğiniz nöbet çizelgesine dönmek istiyor musunuz?')) {
      const hasLoaded = loadFromLocalStorage();
      if (!hasLoaded) {
        showToast('Kayıt Bulunamadı', 'Geri yüklenecek kayıtlı veri bulunamadı.', 'error');
        return;
      }
      hasUnsavedChanges = false;
      renderScheduleTable();
      renderStatsTables();
      renderHolidaysCalendar();
      showToast('Son Kaydedilen Hal Geri Yüklendi! ↩️', 'Yapılan değişiklikler iptal edildi, son kayda dönüldü.', 'info');
    }
  }

  // ================= ÇAKIŞMA TESPİT FONKSİYONLARI =================
  // 1. Aynı satırda (aynı günde) iki veya daha fazla nöbetçi aynı kişi mi? -> YAZI KIRMIZI
  function checkSameRowDuplicate(day, teacherName) {
    if (!teacherName || !day || day.isClosed) return false;
    let count = 0;
    const activeIds = getActiveColumnIds();
    for (let i = 0; i < activeIds.length; i++) {
      if (day[activeIds[i]] === teacherName) count++;
    }
    if (day.hasEtut && day.etut === teacherName) count++;
    return count > 1;
  }

  // 2. Arka arkaya (dün veya yarın) aynı isim nöbetçi mi? -> SARI RENK
  function checkConsecutiveDuty(dayIndex, teacherName) {
    if (!teacherName || !scheduleDays || scheduleDays.length === 0) return false;
    const activeIds = getActiveColumnIds();

    const hasTeacherInDay = (targetDay) => {
      if (!targetDay || targetDay.isClosed) return false;
      for (let i = 0; i < activeIds.length; i++) {
        if (targetDay[activeIds[i]] === teacherName) return true;
      }
      if (targetDay.hasEtut && targetDay.etut === teacherName) return true;
      return false;
    };

    // Önceki gün kontrolü (dün)
    if (dayIndex > 0 && hasTeacherInDay(scheduleDays[dayIndex - 1])) {
      return true;
    }

    // Sonraki gün kontrolü (yarın)
    if (dayIndex < scheduleDays.length - 1 && hasTeacherInDay(scheduleDays[dayIndex + 1])) {
      return true;
    }

    return false;
  }

  function getSlotConflictDetails(dayIndex, role, teacherName) {
    if (!teacherName) return { className: '', tooltip: 'Nöbetçi Seç' };
    const day = scheduleDays[dayIndex];
    if (!day || day.isClosed) return { className: '', tooltip: teacherName };

    // 1. Aynı satırda iki veya daha fazla nöbetçi aynıysa -> YAZI KIRMIZI
    if (checkSameRowDuplicate(day, teacherName)) {
      return {
        className: 'slot-duplicate-row',
        tooltip: `⚠️ UYARI (YAZI KIRMIZI): ${teacherName} aynı satırda birden fazla nöbete yazıldı!`
      };
    }

    // 2. Arka arkaya günlerde aynı isim varsa -> SARI RENK
    if (checkConsecutiveDuty(dayIndex, teacherName)) {
      return {
        className: 'slot-consecutive',
        tooltip: `ℹ️ BİLGİ (SARI RENK): ${teacherName} arka arkaya (üst üste) günlerde nöbetçi!`
      };
    }

    return {
      className: '',
      tooltip: `${teacherName} (Değiştirmek için tıklayın)`
    };
  }

  // AY DEĞİŞTİRME - VERİTABANINDAN YÜKLE YA DA YENİ OLUŞTUR
  function switchMonth(newYear, newMonth) {
    const expiredReadOnly = !!(window.authManager && window.authManager.isLoggedIn() && window.authManager.isExpired());

    // 1. Önceki ayın çizelgesini ve sütun tercihini veritabanına mühürle (süresi dolmuşsa değişiklik yazma)
    const oldKey = `${currentYear}_${currentMonth}`;
    if (!expiredReadOnly) {
      if (scheduleDays && scheduleDays.length > 0) {
        monthlySchedules[oldKey] = scheduleDays;
      }
      monthlyClosedDates[oldKey] = closedDates;
      monthlyDutyColumns[oldKey] = JSON.parse(JSON.stringify(dutyColumns));
    }

    // 2. Yeni ayı ayarla
    currentYear = newYear;
    currentMonth = newMonth;
    selectYear.value = currentYear;
    selectMonth.value = currentMonth;

    applySettingsToUI();

    const newKey = `${currentYear}_${currentMonth}`;
    if (monthlyDutyColumns[newKey]) {
      dutyColumns = window.dutyScheduler.normalizeDutyColumns(monthlyDutyColumns[newKey]);
    } else if (!expiredReadOnly) {
      monthlyDutyColumns[newKey] = JSON.parse(JSON.stringify(dutyColumns));
    }
    updateColumnsCountBadge();

    // 3. Veritabanında kayıtlı çizelge var mı?
    if (monthlySchedules[newKey] && monthlySchedules[newKey].length > 0) {
      // KAYITLI LİSTE VAR -> ASLA YENİDEN DAĞITMA, KAYITLI LİSTEYİ YÜKLE
      scheduleDays = migrateScheduleDaysList(monthlySchedules[newKey]);
      closedDates = monthlyClosedDates[newKey] || {};
      renderScheduleTable();
      renderStatsTables();
      renderHolidaysCalendar();
    } else if (expiredReadOnly) {
      // Süresi dolmuş kullanıcı yeni ay dağıtamaz -> boş salt okunur görünüm göster
      closedDates = monthlyClosedDates[newKey] || window.dutyScheduler.getDefaultClosedDates(currentYear, currentMonth);
      scheduleDays = window.dutyScheduler.generateMonthDays(currentYear, currentMonth, closedDates);
      renderScheduleTable();
      renderStatsTables();
      renderHolidaysCalendar();
    } else {
      // YENİ AY -> İlk kez açılıyorsa varsayılan kapalı günleri yükle ve oluştur
      closedDates = monthlyClosedDates[newKey] || window.dutyScheduler.getDefaultClosedDates(currentYear, currentMonth);
      monthlyClosedDates[newKey] = closedDates;
      runDistribution();
      renderHolidaysCalendar();
    }
  }

  // UYGULAMA İLK BAŞLATMA
  function initApp() {
    const hasLoaded = loadFromLocalStorage();

    if (!hasLoaded || teachers.length === 0) {
      teachers = window.dutyScheduler.getDefaultTeachers();
    }

    selectMonth.value = currentMonth;
    selectYear.value = currentYear;

    applySettingsToUI();

    const mKey = `${currentYear}_${currentMonth}`;
    // Eğer veritabanında bu ay için çizelge varsa, kesinlikle yeniden dağıtma, var olanı getir!
    if (scheduleDays && scheduleDays.length > 0) {
      renderScheduleTable();
      renderStatsTables();
    } else if (monthlySchedules[mKey] && monthlySchedules[mKey].length > 0) {
      scheduleDays = monthlySchedules[mKey];
      closedDates = monthlyClosedDates[mKey] || {};
      renderScheduleTable();
      renderStatsTables();
    } else {
      closedDates = window.dutyScheduler.getDefaultClosedDates(currentYear, currentMonth);
      runDistribution();
      if (!hasLoaded) {
        saveToLocalStorage();
      }
    }

    renderTeachersList();
    renderHolidaysCalendar();
    setupEventHandlers();
  }

  // AYARLARI ARAYÜZE UYGULA
  function applySettingsToUI() {
    dispInstTop.textContent = settings.instTop;
    dispInstMid.textContent = settings.instMid;
    dispSchoolName.textContent = settings.schoolName;
    dispApprovalDate.innerHTML = settings.approvalDate.replace(/\n/g, '<br>');
    dispVicePrincipal.textContent = settings.vicePrincipal;
    dispViceTitle.textContent = settings.viceTitle;
    dispPrincipal.textContent = settings.principal;
    dispPrincipalTitle.textContent = settings.principalTitle;

    // Başlık metni
    const mName = window.dutyScheduler.monthNames[currentMonth].toUpperCase();
    dispRosterTitle.textContent = `${currentYear} YILI ${mName} AYI BELLETMEN ÖĞRETMEN NÖBET ÇİZELGESİ`;

    // Form inputs
    settingInstTop.value = settings.instTop;
    settingInstMid.value = settings.instMid;
    settingSchoolName.value = settings.schoolName;
    settingApprovalDate.value = settings.approvalDate;
    settingVicePrincipal.value = settings.vicePrincipal;
    settingViceTitle.value = settings.viceTitle;
    settingPrincipal.value = settings.principal;
    settingPrincipalTitle.value = settings.principalTitle;
  }

  // OTOMATİK DAĞITIM MOTORUNU ÇALIŞTIR
  function runDistribution(options = {}) {
    const activeCols = window.dutyScheduler.normalizeDutyColumns(options.dutyColumns || dutyColumns);
    dutyColumns = activeCols;
    const mKey = `${currentYear}_${currentMonth}`;
    monthlyDutyColumns[mKey] = JSON.parse(JSON.stringify(dutyColumns));

    let monthDays = window.dutyScheduler.generateMonthDays(currentYear, currentMonth, closedDates);

    // Eğer mevcut scheduleDays varsa, kilitli olan nöbetçileri yeni takvime aktar
    if (scheduleDays && scheduleDays.length === monthDays.length) {
      monthDays = monthDays.map((d, i) => {
        const cur = window.dutyScheduler.migrateDayObject(scheduleDays[i]);
        if (cur && cur.locked) {
          const next = {
            ...d,
            locked: {
              kiz1: !!cur.locked.kiz1,
              kiz2: !!cur.locked.kiz2,
              kiz3: !!cur.locked.kiz3,
              erkek1: !!cur.locked.erkek1,
              erkek2: !!cur.locked.erkek2,
              erkek3: !!cur.locked.erkek3,
              etut: !!cur.locked.etut
            },
            kiz1: cur.locked.kiz1 ? cur.kiz1 : null,
            kiz2: cur.locked.kiz2 ? cur.kiz2 : null,
            kiz3: cur.locked.kiz3 ? cur.kiz3 : null,
            erkek1: cur.locked.erkek1 ? cur.erkek1 : null,
            erkek2: cur.locked.erkek2 ? cur.erkek2 : null,
            erkek3: cur.locked.erkek3 ? cur.erkek3 : null,
            etut: cur.locked.etut ? cur.etut : (cur.etut || null)
          };
          return next;
        }
        return d;
      });
    }

    const result = window.dutyScheduler.distributeDuties(monthDays, teachers, {
      balanceWeekends: true,
      avoidConsecutive: true,
      enableEtut: false, // Kullanıcı isteği: Etüt nöbetinin otomatik dağıtımı kapalıdır
      ...options,
      dutyColumns: activeCols
    });

    scheduleDays = result.days;
    renderScheduleTable();
    renderStatsTables();
    markAsUnsaved();
  }

  // NÖBET ÇİZELGESİ TABLOSUNU ÇİZ (Dinamik Kız 0..3 + Erkek 0..3 = Toplam 1..6 Belletici Sütunu)
  function renderScheduleTable() {
    dutyColumns = window.dutyScheduler.normalizeDutyColumns(dutyColumns);
    updateColumnsCountBadge();

    if (rosterTable) {
      rosterTable.classList.toggle('cols-dense', dutyColumns.length >= 4);
    }

    // Dinamik Başlık Satırı (thead)
    if (rosterThead) {
      const colWidths = { 1: '420px', 2: '280px', 3: '215px', 4: '165px', 5: '138px', 6: '122px' };
      const colWidth = colWidths[dutyColumns.length] || '150px';
      const dateWidth = dutyColumns.length >= 4 ? '76px' : '90px';
      const dayWidth = dutyColumns.length >= 4 ? '88px' : '110px';
      const etutWidth = dutyColumns.length >= 4 ? '130px' : '200px';
      const sigWidth = dutyColumns.length >= 4 ? '72px' : '100px';

      const dynamicHeaders = dutyColumns.map(col => {
        const meta = getColumnStyleMeta(col.gender);
        return `<th style="width: ${colWidth};" class="${meta.thClass}">${escapeHtml(col.title)}</th>`;
      }).join('');

      rosterThead.innerHTML = `
        <tr>
          <th style="width: ${dateWidth};">TARİH</th>
          <th style="width: ${dayWidth};">GÜN</th>
          ${dynamicHeaders}
          <th style="width: ${etutWidth};" class="col-etut">ETÜT NÖBETİ</th>
          <th style="width: ${sigWidth};" class="col-signature">İMZA</th>
        </tr>
      `;
    }

    rosterTbody.innerHTML = '';
    let activeDays = 0;
    let closedDays = 0;

    scheduleDays.forEach((rawDay, index) => {
      const day = window.dutyScheduler.migrateDayObject(rawDay);
      scheduleDays[index] = day;

      const tr = document.createElement('tr');
      if (day.isWeekend) tr.classList.add('tr-weekend');
      if (day.isClosed) tr.classList.add('tr-closed');

      // Tarih gösterimi (DD.MM.YYYY)
      const dateParts = day.dateKey.split('-');
      const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

      if (day.isClosed) {
        closedDays++;
        const closedColspan = dutyColumns.length + 1;
        tr.innerHTML = `
          <td><strong>${formattedDate}</strong></td>
          <td><strong>${day.dayName}</strong></td>
          <td colspan="${closedColspan}" class="closed-cell-banner" data-closed-banner="true">
            🏖️ ${day.closedReason || 'YURT KAPALI / TATİL'}
          </td>
          <td style="color: #94a3b8; font-size: 0.75rem;">-</td>
        `;
      } else {
        activeDays++;
        const locked = day.locked || {};
        const dynamicCells = dutyColumns.map(col => {
          const meta = getColumnStyleMeta(col.gender);
          return `<td>${renderSlotButton(day[col.id], index, col.id, meta.slotClass, !!locked[col.id])}</td>`;
        }).join('');

        tr.innerHTML = `
          <td>${formattedDate}</td>
          <td>${day.dayName}</td>
          ${dynamicCells}
          <td class="col-etut">${day.hasEtut ? renderSlotButton(day.etut, index, 'etut', 'slot-etut', !!locked.etut) : '<span style="color:#94a3b8; font-size: 0.75rem;">Etüt Yok</span>'}</td>
          <td style="border-bottom: 1px dotted #94a3b8;"></td>
        `;
      }

      rosterTbody.appendChild(tr);
    });

    activeDaysCountEl.textContent = `${activeDays} Gün`;
    closedDaysCountEl.textContent = `${closedDays} Gün`;

    // Slot öğretmen ismi butonuna tıklama dinleyicileri
    rosterTbody.querySelectorAll('.teacher-slot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dayIdx = parseInt(e.currentTarget.dataset.dayIndex, 10);
        const role = e.currentTarget.dataset.role;
        openSlotEditModal(dayIdx, role);
      });
    });

    // Kilit Aç/Kapa butonlarına tıklama dinleyicileri
    rosterTbody.querySelectorAll('.btn-lock-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dayIdx = parseInt(e.currentTarget.dataset.dayIndex, 10);
        const role = e.currentTarget.dataset.role;
        toggleSlotLock(dayIdx, role);
      });
    });

    syncViewToggles();
  }

  function renderSlotButton(teacherName, dayIndex, role, typeClass, isLocked = false) {
    if (!teacherName) {
      return `
        <div class="slot-container">
          <button class="teacher-slot-btn slot-empty" data-day-index="${dayIndex}" data-role="${role}" title="Nöbetçi Ata">+ Nöbetçi Seç</button>
        </div>`;
    }
    const lockIcon = isLocked ? '🔒' : '🔓';
    const lockTitle = isLocked ? 'Kilitli (Otomatik dağıtımda yerinde sabit kalır). Kilidi açmak için tıklayın.' : 'Kilitle (Otomatik dağıtımda yerinde sabit kalsın).';
    const lockedClass = isLocked ? 'is-locked' : '';

    const conflict = getSlotConflictDetails(dayIndex, role, teacherName);
    const finalClass = conflict.className ? `${typeClass} ${conflict.className}` : typeClass;

    return `
      <div class="slot-container ${lockedClass}">
        <button class="teacher-slot-btn ${finalClass}" data-day-index="${dayIndex}" data-role="${role}" title="${conflict.tooltip}">
          ${isLocked ? '<span class="lock-indicator">🔒</span>' : ''}${teacherName}
        </button>
        <button type="button" class="btn-lock-toggle ${isLocked ? 'active' : ''}" data-day-index="${dayIndex}" data-role="${role}" title="${lockTitle}">
          ${lockIcon}
        </button>
      </div>`;
  }

  function toggleSlotLock(dayIndex, role) {
    if (!ensureNotExpiredOrAlert()) return;
    const day = scheduleDays[dayIndex];
    if (!day || !day[role]) return;
    if (!day.locked) day.locked = {};
    day.locked[role] = !day.locked[role];
    renderScheduleTable();
    markAsUnsaved();
  }

  // İSTATİSTİK TABLOLARINI ÇİZ (Kız ve Erkek)
  function renderStatsTables() {
    const stats = window.dutyScheduler.calculateRosterStats(scheduleDays, teachers, dutyColumns);

    // KIZ PANSİYONU İSTATİSTİKLERİ
    femaleStatsTbody.innerHTML = '';
    const femaleTeachers = teachers.filter(t => t.gender === 'K');
    let fTotalWeekday = 0, fTotalWeekend = 0, fGrandTotal = 0;

    femaleTeachers.forEach((t, idx) => {
      const s = stats[t.name] || { weekday: 0, weekend: 0, totalDuties: 0 };
      fTotalWeekday += s.weekday;
      fTotalWeekend += s.weekend;
      fGrandTotal += s.totalDuties;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${t.name} ${!t.active || t.exempt ? '<span style="color:#dc2626; font-size:0.7rem;">(Muaf)</span>' : ''}</td>
        <td>${s.weekday}</td>
        <td>${s.weekend}</td>
        <td><strong>${s.totalDuties}</strong></td>
      `;
      femaleStatsTbody.appendChild(tr);
    });

    // Kız Toplam Satırı
    const fFoot = document.createElement('tr');
    fFoot.style.fontWeight = 'bold';
    fFoot.style.background = '#fdf2f8';
    fFoot.innerHTML = `
      <td colspan="2" style="text-align: right;">TOPLAM:</td>
      <td>${fTotalWeekday}</td>
      <td>${fTotalWeekend}</td>
      <td>${fGrandTotal}</td>
    `;
    femaleStatsTbody.appendChild(fFoot);

    // ERKEK PANSİYONU İSTATİSTİKLERİ
    maleStatsTbody.innerHTML = '';
    const maleTeachers = teachers.filter(t => t.gender === 'E');
    let mTotalWeekday = 0, mTotalWeekend = 0, mTotalEtut = 0, mGrandTotal = 0, mGrandPoints = 0;

    maleTeachers.forEach((t, idx) => {
      const s = stats[t.name] || { weekday: 0, weekend: 0, etut: 0, totalDuties: 0, totalPoints: 0 };
      mTotalWeekday += s.weekday;
      mTotalWeekend += s.weekend;
      mTotalEtut += s.etut;
      mGrandTotal += s.totalDuties;
      mGrandPoints += s.totalPoints;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${t.name} ${!t.active || t.exempt ? '<span style="color:#dc2626; font-size:0.7rem;">(Muaf)</span>' : ''}</td>
        <td>${s.weekday}</td>
        <td>${s.weekend}</td>
        <td>${s.etut}</td>
        <td><strong>${s.totalDuties}</strong></td>
        <td style="color: #1e40af; font-weight: 700;">${s.totalPoints}</td>
      `;
      maleStatsTbody.appendChild(tr);
    });

    // Erkek Toplam Satırı
    const mFoot = document.createElement('tr');
    mFoot.style.fontWeight = 'bold';
    mFoot.style.background = '#f0f9ff';
    mFoot.innerHTML = `
      <td colspan="2" style="text-align: right;">TOPLAM:</td>
      <td>${mTotalWeekday}</td>
      <td>${mTotalWeekend}</td>
      <td>${mTotalEtut}</td>
      <td>${mGrandTotal}</td>
      <td style="color: #1e40af; font-weight: 700;">${mGrandPoints}</td>
    `;
    maleStatsTbody.appendChild(mFoot);
  }

  // ================= MANUEL SLOT EDİT (ÖĞRETMEN DEĞİŞTİRME) =================
  function openSlotEditModal(dayIndex, role) {
    if (!ensureNotExpiredOrAlert()) return;
    editingSlot = { dayIndex, role };
    const day = scheduleDays[dayIndex];
    const currentName = day[role] || 'Atanmamış (Boş)';
    const colDef = dutyColumns.find(c => c.id === role);

    const roleTitle = role === 'etut'
      ? 'Etüt Nöbetçisi'
      : (colDef ? colDef.title : 'Nöbetçi Belletmen');

    const dateParts = day.dateKey.split('-');
    slotInfoDate.textContent = `Tarih: ${dateParts[2]}.${dateParts[1]}.${dateParts[0]} ${day.dayName}`;
    slotInfoRole.textContent = `Görev: ${roleTitle}`;
    slotCurrentTeacher.textContent = currentName;

    // İlgili sütunun cinsiyet/grup tercihine uygun adayları hazırla
    candidateTeachersList.innerHTML = '';
    let candidates = [];
    if (role === 'etut') {
      candidates = teachers.filter(t => t.gender === 'E');
    } else if (colDef && colDef.gender === 'K') {
      candidates = teachers.filter(t => t.gender === 'K');
    } else if (colDef && colDef.gender === 'E') {
      candidates = teachers.filter(t => t.gender === 'E');
    } else {
      candidates = [...teachers];
    }

    if (slotCandidateSearch) {
      slotCandidateSearch.value = '';
      slotCandidateSearch.oninput = (e) => {
        const query = (e.target.value || '').toLocaleLowerCase('tr').trim();
        const items = candidateTeachersList.querySelectorAll('.candidate-item-btn');
        items.forEach(it => {
          const nameEl = it.querySelector('strong');
          const nameText = nameEl ? nameEl.textContent.toLocaleLowerCase('tr') : '';
          it.style.display = nameText.includes(query) ? 'flex' : 'none';
        });
      };
    }

    const stats = window.dutyScheduler.calculateRosterStats(scheduleDays, teachers, dutyColumns);
    const activeIds = getActiveColumnIds();

    candidates.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'candidate-item-btn';
      if (t.name === day[role]) btn.classList.add('selected');

      const tStat = stats[t.name] || { totalDuties: 0, weekend: 0, etut: 0 };
      
      // Uygunluk kontrolleri
      let conflictWarning = '';
      let isAlreadyInSameDay = false;
      for (let i = 0; i < activeIds.length; i++) {
        const cid = activeIds[i];
        if (cid !== role && day[cid] === t.name) {
          isAlreadyInSameDay = true;
          break;
        }
      }
      if (!isAlreadyInSameDay && role !== 'etut' && day.hasEtut && day.etut === t.name) {
        isAlreadyInSameDay = true;
      }

      const isConsecutive = checkConsecutiveDuty(dayIndex, t.name);

      if (!t.active || t.exempt) {
        conflictWarning = '❌ (Muaf/Pasif)';
      } else if (t.blockedDates && t.blockedDates.includes(day.dateKey)) {
        conflictWarning = '⚠️ (İzinli Gün)';
      } else if (t.blockedDays && t.blockedDays.includes(day.dayOfWeek)) {
        conflictWarning = '⚠️ (Kapalı Gün)';
      } else if (isAlreadyInSameDay) {
        conflictWarning = '🔴 (Aynı Satırda Nöbetçi - Yazı Kırmızı Olur)';
        btn.classList.add('warning-duplicate-row');
      } else if (isConsecutive) {
        conflictWarning = '🟡 (Arka Arkaya Gün Nöbeti - Sarı Renk Olur)';
        btn.classList.add('warning-consecutive');
      }

      const warningColor = isAlreadyInSameDay ? '#dc2626' : (isConsecutive ? '#854d0e' : '#dc2626');
      const genderTag = (colDef && colDef.gender === 'A')
        ? `<span style="color:#64748b; font-size:0.72rem; margin-left:4px;">(${t.gender === 'K' ? 'Kız' : 'Erkek'})</span>`
        : '';

      btn.innerHTML = `
        <div>
          <strong>${t.name}</strong>${genderTag}
          <span style="color:${warningColor}; font-size:0.75rem; font-weight:600; margin-left:6px;">${conflictWarning}</span>
        </div>
        <div class="candidate-stats-badge">
          Toplam: <strong>${tStat.totalDuties}</strong> | H.Sonu: <strong>${tStat.weekend}</strong> ${t.gender === 'E' ? `| Etüt: <strong>${tStat.etut}</strong>` : ''}
        </div>
      `;

      btn.addEventListener('click', () => {
        applyTeacherToSlot(dayIndex, role, t.name);
        closeSlotEditModal();
      });

      candidateTeachersList.appendChild(btn);
    });

    const slotEditLock = document.getElementById('slot-edit-lock');
    if (slotEditLock) {
      slotEditLock.checked = !!(day.locked && day.locked[role]);
    }

    modalSlotEdit.classList.add('active');
  }

  function applyTeacherToSlot(dayIndex, role, newTeacherName, forceLock) {
    if (!ensureNotExpiredOrAlert()) return;
    const day = scheduleDays[dayIndex];
    if (!day.locked) day.locked = {};
    day[role] = newTeacherName;

    if (forceLock !== undefined) {
      day.locked[role] = forceLock;
    } else if (newTeacherName) {
      const slotEditLock = document.getElementById('slot-edit-lock');
      // Kullanıcı kilit kutucuğunu işaretlediyse kilitli kalsın
      day.locked[role] = slotEditLock ? slotEditLock.checked : true;
    } else {
      day.locked[role] = false;
    }

    renderScheduleTable();
    renderStatsTables();
    markAsUnsaved();
  }

  function closeSlotEditModal() {
    modalSlotEdit.classList.remove('active');
    editingSlot = null;
  }

  btnSlotClear.addEventListener('click', () => {
    if (editingSlot) {
      applyTeacherToSlot(editingSlot.dayIndex, editingSlot.role, null, false);
      closeSlotEditModal();
    }
  });

  btnSlotModalClose.addEventListener('click', closeSlotEditModal);
  btnSlotCancel.addEventListener('click', closeSlotEditModal);

  // ================= DAĞITIM SİHİRBAZI (WIZARD) =================
  function loadWizardColumnsForSelectedMonth() {
    const y = parseInt(wInputYear.value, 10) || currentYear;
    const m = parseInt(wSelectMonth.value, 10);
    const mKey = `${y}_${m}`;
    const sourceCols = (monthlyDutyColumns && monthlyDutyColumns[mKey]) || dutyColumns;
    wizardDutyColumns = window.dutyScheduler.normalizeDutyColumns(JSON.parse(JSON.stringify(sourceCols)));
    renderColumnsConfigEditor({
      femalePicker: wFemaleCountPicker,
      malePicker: wMaleCountPicker,
      totalBadge: wColumnsTotalBadge,
      listEl: wColumnsConfigList,
      getCols: () => wizardDutyColumns,
      setCols: (next) => { wizardDutyColumns = next; }
    });
  }

  function openWizard() {
    if (!ensureScheduleRightCheck()) return;
    currentWizardStep = 1;
    wSelectMonth.value = currentMonth;
    wInputYear.value = currentYear;
    loadWizardColumnsForSelectedMonth();
    updateWizardStepUI();
    renderWizardMonthDaysCount();
    renderWizardCalendar();
    renderWizardTeacherConstraints();
    modalWizard.classList.add('active');
  }

  function closeWizard() {
    modalWizard.classList.remove('active');
  }

  function updateWizardStepUI() {
    wizardSteps.forEach((s, idx) => {
      s.classList.toggle('active', idx + 1 === currentWizardStep);
    });

    stepBubbles.forEach((b, idx) => {
      const stepNum = idx + 1;
      b.classList.toggle('active', stepNum === currentWizardStep);
      b.classList.toggle('completed', stepNum < currentWizardStep);
    });

    wBtnPrev.disabled = currentWizardStep === 1;
    if (currentWizardStep === 4) {
      wBtnNext.style.display = 'none';
      wBtnFinish.style.display = 'inline-flex';
    } else {
      wBtnNext.style.display = 'inline-flex';
      wBtnFinish.style.display = 'none';
    }

    // Adım içeriğini yenile
    if (currentWizardStep === 2) {
      renderWizardCalendar();
    } else if (currentWizardStep === 3) {
      loadTeacherConstraintForm();
      renderConstraintsList();
    }

    // Modal pencere içeriğini en yukarı kaydır
    const modalBody = modalWizard.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  function renderWizardMonthDaysCount() {
    const y = parseInt(wInputYear.value, 10) || currentYear;
    const m = parseInt(wSelectMonth.value, 10);
    const count = window.dutyScheduler.getDaysInMonth(y, m);
    wDispMonthDays.textContent = count;
  }

  // Wizard Takvimi
  function renderWizardCalendar() {
    wCalendarContainer.innerHTML = '';
    const y = parseInt(wInputYear.value, 10) || currentYear;
    const m = parseInt(wSelectMonth.value, 10);
    const count = window.dutyScheduler.getDaysInMonth(y, m);

    for (let d = 1; d <= count; d++) {
      const dKey = window.dutyScheduler.formatDateKey(y, m, d);
      const dateObj = new Date(y, m, d);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isClosed = !!closedDates[dKey];

      const div = document.createElement('div');
      div.className = 'w-cal-day';
      if (isWeekend) div.classList.add('weekend');
      if (isClosed) div.classList.add('closed');

      div.innerHTML = `
        <div style="font-weight:700; font-size:1rem;">${d}</div>
        <div style="font-size:0.7rem;">${window.dutyScheduler.turkishDays[dayOfWeek].substring(0, 3)}</div>
        <div style="font-size:0.65rem; margin-top:2px;">${isClosed ? 'KAPALI' : 'AÇIK'}</div>
      `;

      div.addEventListener('click', () => {
        if (closedDates[dKey]) {
          delete closedDates[dKey];
        } else {
          closedDates[dKey] = 'YURT KAPALI';
        }
        renderWizardCalendar();
        renderHolidaysCalendar();
        saveToLocalStorage();
      });

      wCalendarContainer.appendChild(div);
    }
  }

  // Wizard Öğretmen Kısıtlamaları
  function renderWizardTeacherConstraints() {
    wSelectTeacher.innerHTML = '';
    teachers.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.gender === 'K' ? 'Kız' : 'Erkek'})`;
      wSelectTeacher.appendChild(opt);
    });

    loadTeacherConstraintForm();
    renderConstraintsList();
  }

  function loadTeacherConstraintForm() {
    const tId = wSelectTeacher.value;
    const teacher = teachers.find(t => t.id === tId);
    if (!teacher) return;

    wTeacherExempt.checked = teacher.exempt || false;

    // Günler
    wDayBlocks.forEach(cb => {
      const val = parseInt(cb.value, 10);
      cb.checked = teacher.blockedDays && teacher.blockedDays.includes(val);
    });

    // Ayın günleri butonları
    wTeacherDatesGrid.innerHTML = '';
    const y = parseInt(wInputYear.value, 10) || currentYear;
    const m = parseInt(wSelectMonth.value, 10);
    const count = window.dutyScheduler.getDaysInMonth(y, m);

    for (let d = 1; d <= count; d++) {
      const dKey = window.dutyScheduler.formatDateKey(y, m, d);
      const isBlocked = teacher.blockedDates && teacher.blockedDates.includes(dKey);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-pill-btn';
      if (isBlocked) btn.classList.add('blocked');
      btn.textContent = `${d}`;

      btn.addEventListener('click', () => {
        if (!teacher.blockedDates) teacher.blockedDates = [];
        if (teacher.blockedDates.includes(dKey)) {
          teacher.blockedDates = teacher.blockedDates.filter(k => k !== dKey);
          btn.classList.remove('blocked');
        } else {
          teacher.blockedDates.push(dKey);
          btn.classList.add('blocked');
        }
      });

      wTeacherDatesGrid.appendChild(btn);
    }
  }

  wSelectTeacher.addEventListener('change', loadTeacherConstraintForm);

  wBtnSaveConstraint.addEventListener('click', () => {
    const tId = wSelectTeacher.value;
    const teacher = teachers.find(t => t.id === tId);
    if (!teacher) return;

    teacher.exempt = wTeacherExempt.checked;
    teacher.blockedDays = [];
    wDayBlocks.forEach(cb => {
      if (cb.checked) teacher.blockedDays.push(parseInt(cb.value, 10));
    });

    saveToLocalStorage();
    renderConstraintsList();
    renderTeachersList();
    alert(`${teacher.name} için kısıtlamalar kaydedildi!`);
  });

  function renderConstraintsList() {
    wActiveConstraintsList.innerHTML = '';
    const constrainedTeachers = teachers.filter(t => t.exempt || (t.blockedDates && t.blockedDates.length > 0) || (t.blockedDays && t.blockedDays.length > 0));

    if (constrainedTeachers.length === 0) {
      wActiveConstraintsList.innerHTML = '<div style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Henüz kısıtlama eklenmiş öğretmen yok.</div>';
      return;
    }

    constrainedTeachers.forEach(t => {
      const card = document.createElement('div');
      card.className = 'constraint-tag-card';

      let details = [];
      if (t.exempt) details.push('Muaf');
      if (t.blockedDays && t.blockedDays.length > 0) {
        const dayNames = t.blockedDays.map(d => window.dutyScheduler.turkishDays[d].substring(0, 3)).join(', ');
        details.push(`Gün: ${dayNames}`);
      }
      if (t.blockedDates && t.blockedDates.length > 0) {
        details.push(`${t.blockedDates.length} Tarih`);
      }

      card.innerHTML = `
        <div><strong>${t.name}</strong> <span style="color:#64748b;">(${details.join(' | ')})</span></div>
        <button type="button" class="btn btn-outline-danger btn-sm" style="padding:2px 6px; font-size:0.7rem;">Kaldır</button>
      `;

      card.querySelector('button').addEventListener('click', () => {
        t.exempt = false;
        t.blockedDays = [];
        t.blockedDates = [];
        saveToLocalStorage();
        loadTeacherConstraintForm();
        renderConstraintsList();
        renderTeachersList();
      });

      wActiveConstraintsList.appendChild(card);
    });
  }

  // Wizard Hızlı Ara Tatil Kapatma
  wBtnAratatil.addEventListener('click', () => {
    const y = parseInt(wInputYear.value, 10) || currentYear;
    const m = parseInt(wSelectMonth.value, 10);
    for (let d = 14; d <= 22; d++) {
      const dKey = window.dutyScheduler.formatDateKey(y, m, d);
      closedDates[dKey] = 'ARA TATİL';
    }
    renderWizardCalendar();
    renderHolidaysCalendar();
    saveToLocalStorage();
  });

  const wBtnWeekendsClose = document.getElementById('w-btn-weekends-close');
  if (wBtnWeekendsClose) {
    wBtnWeekendsClose.addEventListener('click', () => {
      const y = parseInt(wInputYear.value, 10) || currentYear;
      const m = parseInt(wSelectMonth.value, 10);
      const count = window.dutyScheduler.getDaysInMonth(y, m);
      for (let d = 1; d <= count; d++) {
        const dateObj = new Date(y, m, d);
        const dayOfWeek = dateObj.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Cmt & Paz
          const dKey = window.dutyScheduler.formatDateKey(y, m, d);
          closedDates[dKey] = 'HAFTA SONU KAPALI';
        }
      }
      renderWizardCalendar();
      renderHolidaysCalendar();
      saveToLocalStorage();
    });
  }

  const wBtnMonthClose = document.getElementById('w-btn-month-close');
  if (wBtnMonthClose) {
    wBtnMonthClose.addEventListener('click', () => {
      const y = parseInt(wInputYear.value, 10) || currentYear;
      const m = parseInt(wSelectMonth.value, 10);
      const count = window.dutyScheduler.getDaysInMonth(y, m);
      for (let d = 1; d <= count; d++) {
        const dKey = window.dutyScheduler.formatDateKey(y, m, d);
        closedDates[dKey] = 'YURT KAPALI';
      }
      renderWizardCalendar();
      renderHolidaysCalendar();
      saveToLocalStorage();
    });
  }

  wBtnOpenAll.addEventListener('click', () => {
    closedDates = {};
    renderWizardCalendar();
    renderHolidaysCalendar();
    saveToLocalStorage();
  });

  // Adım Göstergelerine Tıklayarak Doğrudan Geçiş
  stepBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      const stepNum = parseInt(bubble.dataset.step, 10);
      if (stepNum && stepNum >= 1 && stepNum <= 4) {
        currentWizardStep = stepNum;
        updateWizardStepUI();
      }
    });
  });

  // Adım İçi Hızlı İlerle Butonları
  const wStep1NextInline = document.getElementById('w-step1-next-inline');
  if (wStep1NextInline) {
    wStep1NextInline.addEventListener('click', () => {
      currentWizardStep = 2;
      updateWizardStepUI();
    });
  }

  const wStep2NextInline = document.getElementById('w-step2-next-inline');
  if (wStep2NextInline) {
    wStep2NextInline.addEventListener('click', () => {
      currentWizardStep = 3;
      updateWizardStepUI();
    });
  }

  // Wizard İleri / Geri / Bitir
  wBtnNext.addEventListener('click', () => {
    if (currentWizardStep < 4) {
      currentWizardStep++;
      updateWizardStepUI();
    }
  });

  wBtnPrev.addEventListener('click', () => {
    if (currentWizardStep > 1) {
      currentWizardStep--;
      updateWizardStepUI();
    }
  });

  wBtnFinish.addEventListener('click', async () => {
    const rightRes = await consumeScheduleRightOrAlert();
    if (!rightRes) return;

    const prevKey = `${currentYear}_${currentMonth}`;
    if (scheduleDays && scheduleDays.length > 0) {
      monthlySchedules[prevKey] = JSON.parse(JSON.stringify(scheduleDays));
    }
    monthlyClosedDates[prevKey] = JSON.parse(JSON.stringify(closedDates));
    monthlyDutyColumns[prevKey] = JSON.parse(JSON.stringify(dutyColumns));

    currentYear = parseInt(wInputYear.value, 10);
    currentMonth = parseInt(wSelectMonth.value, 10);
    selectYear.value = currentYear;
    selectMonth.value = currentMonth;

    const mKey = `${currentYear}_${currentMonth}`;
    if (mKey !== prevKey) {
      scheduleDays = (monthlySchedules[mKey] && monthlySchedules[mKey].length > 0)
        ? migrateScheduleDaysList(JSON.parse(JSON.stringify(monthlySchedules[mKey])))
        : [];
    }

    // Kullanıcının tercih ettiği Kız (0..3) + Erkek (0..3) = toplam 1..6 belletici sütununu uygula
    dutyColumns = window.dutyScheduler.normalizeDutyColumns(wizardDutyColumns);
    monthlyDutyColumns[mKey] = JSON.parse(JSON.stringify(dutyColumns));

    applySettingsToUI();
    runDistribution({
      balanceWeekends: document.getElementById('w-rule-weekend').checked,
      avoidConsecutive: document.getElementById('w-rule-consecutive').checked,
      enableEtut: document.getElementById('w-rule-etut').checked,
      dutyColumns: dutyColumns
    });

    closeWizard();
    // 1. Sekmeye geç
    switchTab('tab-schedule');
    const remNote = (!rightRes.unlimited && typeof rightRes.remaining === 'number')
      ? `\n(Kalan Yeni Nöbet Hazırlama Hakkınız: ${rightRes.remaining} / ${rightRes.limit})`
      : '';
    alert(`🎉 ${window.dutyScheduler.monthNames[currentMonth]} ${currentYear} (${dutyColumns.length} Belletici Sütunu) Nöbet Dağıtımı Başarıyla Tamamlandı!${remNote}`);
  });

  btnOpenWizard.addEventListener('click', openWizard);
  btnWizardClose.addEventListener('click', closeWizard);
  wSelectMonth.addEventListener('change', () => {
    loadWizardColumnsForSelectedMonth();
    renderWizardMonthDaysCount();
    renderWizardCalendar();
    loadTeacherConstraintForm();
  });
  wInputYear.addEventListener('input', () => {
    loadWizardColumnsForSelectedMonth();
    renderWizardMonthDaysCount();
    renderWizardCalendar();
    loadTeacherConstraintForm();
  });

  // ================= SÜTUN YAPILANDIRMA MODALI (TOOLBAR) =================
  function openColumnsModal() {
    if (!ensureNotExpiredOrAlert()) return;
    modalDutyColumns = window.dutyScheduler.normalizeDutyColumns(JSON.parse(JSON.stringify(dutyColumns)));
    renderColumnsConfigEditor({
      femalePicker: mFemaleCountPicker,
      malePicker: mMaleCountPicker,
      totalBadge: mColumnsTotalBadge,
      listEl: mColumnsConfigList,
      getCols: () => modalDutyColumns,
      setCols: (next) => { modalDutyColumns = next; }
    });
    if (modalColumnsConfig) modalColumnsConfig.classList.add('active');
  }

  function closeColumnsModal() {
    if (modalColumnsConfig) modalColumnsConfig.classList.remove('active');
  }

  async function applyModalColumns(redistribute) {
    if (!ensureNotExpiredOrAlert()) return;
    let rightRes = null;
    if (redistribute) {
      rightRes = await consumeScheduleRightOrAlert();
      if (!rightRes) return;
    }

    dutyColumns = window.dutyScheduler.normalizeDutyColumns(modalDutyColumns);
    const mKey = `${currentYear}_${currentMonth}`;
    monthlyDutyColumns[mKey] = JSON.parse(JSON.stringify(dutyColumns));

    // Kullanılmayan sütunlardaki eski atamaları temizle
    const activeSet = new Set(getActiveColumnIds());
    scheduleDays.forEach(day => {
      window.dutyScheduler.ALL_SLOT_IDS.forEach(slotId => {
        if (!activeSet.has(slotId)) {
          day[slotId] = null;
          if (day.locked) day.locked[slotId] = false;
        }
      });
    });

    closeColumnsModal();

    if (redistribute) {
      runDistribution({ dutyColumns });
      showToast('Sütunlar Güncellendi ve Dağıtıldı', `Çizelge ${dutyColumns.length} belletici sütunu ile yeniden dağıtıldı.`, 'success');
    } else {
      renderScheduleTable();
      renderStatsTables();
      markAsUnsaved();
      showToast('Sütun Tercihleri Uygulandı', `Çizelge ${dutyColumns.length} belletici sütunu olarak güncellendi.`, 'info');
    }
  }

  if (btnConfigColumns) btnConfigColumns.addEventListener('click', openColumnsModal);
  if (btnColumnsModalClose) btnColumnsModalClose.addEventListener('click', closeColumnsModal);
  if (btnColumnsModalCancel) btnColumnsModalCancel.addEventListener('click', closeColumnsModal);
  if (btnColumnsModalApply) btnColumnsModalApply.addEventListener('click', () => applyModalColumns(false));
  if (btnColumnsModalApplyRedistribute) btnColumnsModalApplyRedistribute.addEventListener('click', () => applyModalColumns(true));

  // ================= TAB 2: ÖĞRETMEN YÖNETİMİ =================
  function renderTeachersList() {
    femaleTeachersListEl.innerHTML = '';
    maleTeachersListEl.innerHTML = '';

    const female = teachers.filter(t => t.gender === 'K');
    const male = teachers.filter(t => t.gender === 'E');

    femaleCountEl.textContent = female.length;
    maleCountEl.textContent = male.length;

    female.forEach(t => femaleTeachersListEl.appendChild(createTeacherCard(t)));
    male.forEach(t => maleTeachersListEl.appendChild(createTeacherCard(t)));
  }

  function createTeacherCard(t) {
    const card = document.createElement('div');
    card.className = 'teacher-card';
    if (!t.active || t.exempt) card.classList.add('inactive');

    const badges = [];
    if (!t.active) badges.push('<span class="mini-badge inactive">Pasif</span>');
    if (t.exempt) badges.push('<span class="mini-badge inactive">Muaf</span>');
    if (t.etutEligible) badges.push('<span class="mini-badge etut">Etüt</span>');
    if ((t.blockedDays && t.blockedDays.length > 0) || (t.blockedDates && t.blockedDates.length > 0)) {
      badges.push('<span class="mini-badge constraint">Mazeretli</span>');
    }

    card.innerHTML = `
      <div class="teacher-card-info">
        <div class="teacher-card-name">${t.name}</div>
        <div class="teacher-card-badges">${badges.join('')}</div>
      </div>
      <div class="teacher-card-actions">
        <button class="btn btn-secondary btn-sm btn-toggle-active" title="Aktif/Pasif">${t.active ? 'Aktif' : 'Pasif'}</button>
        <button class="btn btn-outline-danger btn-sm btn-delete-teacher" title="Sil">🗑️</button>
      </div>
    `;

    card.querySelector('.btn-toggle-active').addEventListener('click', () => {
      if (!ensureNotExpiredOrAlert()) return;
      t.active = !t.active;
      saveToLocalStorage();
      renderTeachersList();
      renderStatsTables();
    });

    card.querySelector('.btn-delete-teacher').addEventListener('click', () => {
      if (!ensureNotExpiredOrAlert()) return;
      if (confirm(`"${t.name}" isimli öğretmeni silmek istediğinize emin misiniz?`)) {
        teachers = teachers.filter(item => item.id !== t.id);
        saveToLocalStorage();
        renderTeachersList();
        renderStatsTables();
      }
    });

    return card;
  }

  // Yeni Öğretmen Ekle Modal
  btnAddTeacher.addEventListener('click', () => {
    if (!ensureNotExpiredOrAlert()) return;
    teacherInputName.value = '';
    teacherInputGender.value = 'E';
    teacherInputEtut.checked = false;
    teacherInputActive.checked = true;
    modalTeacherEdit.classList.add('active');
  });

  btnTeacherModalClose.addEventListener('click', () => {
    modalTeacherEdit.classList.remove('active');
  });

  teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!ensureNotExpiredOrAlert()) return;
    const name = teacherInputName.value.trim().toUpperCase();
    if (!name) return;

    const newTeacher = {
      id: 't_' + Date.now(),
      name: name,
      gender: teacherInputGender.value,
      etutEligible: teacherInputEtut.checked,
      active: teacherInputActive.checked,
      exempt: !teacherInputActive.checked,
      blockedDates: [],
      blockedDays: []
    };

    teachers.push(newTeacher);
    saveToLocalStorage();
    renderTeachersList();
    renderStatsTables();
    modalTeacherEdit.classList.remove('active');
    alert(`"${name}" başarıyla öğretmen kadrosuna eklendi.`);
  });

  // Excel'den Kadro Yükle
  fileExcelUpload.addEventListener('click', (e) => {
    if (!ensureNotExpiredOrAlert()) {
      e.preventDefault();
    }
  });
  fileExcelUpload.addEventListener('change', (e) => {
    if (!ensureNotExpiredOrAlert()) {
      e.target.value = '';
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];

        // Excel'den öğretmenleri tara
        const importedTeachers = [];
        // H sütunu (Kız) ve M sütunu (Erkek) arayalım
        for (let r = 1; r <= 50; r++) {
          const fName = sheet[`H${r}`] ? String(sheet[`H${r}`].v).trim() : null;
          if (fName && fName !== 'ÖĞRETMEN' && fName.length > 3 && !importedTeachers.some(t => t.name === fName)) {
            importedTeachers.push({
              id: 'imp_f_' + r,
              name: fName.toUpperCase(),
              gender: 'K',
              etutEligible: false,
              active: true,
              exempt: false,
              blockedDates: [],
              blockedDays: []
            });
          }

          const mName = sheet[`M${r}`] ? String(sheet[`M${r}`].v).trim() : null;
          if (mName && mName !== 'ÖĞRETMEN' && mName.length > 3 && !importedTeachers.some(t => t.name === mName)) {
            importedTeachers.push({
              id: 'imp_m_' + r,
              name: mName.toUpperCase(),
              gender: 'E',
              etutEligible: mName.includes('HAYRULLAH') || mName.includes('NEBİ') || mName.includes('MUTLU'),
              active: true,
              exempt: false,
              blockedDates: [],
              blockedDays: []
            });
          }
        }

        if (importedTeachers.length > 0) {
          teachers = importedTeachers;
          saveToLocalStorage();
          renderTeachersList();
          renderStatsTables();
          alert(`Excel dosyasından ${importedTeachers.length} öğretmen başarıyla yüklendi!`);
        } else {
          alert('Excel dosyasında H ve M sütunlarında öğretmen isimleri bulunamadı.');
        }
      } catch (err) {
        alert('Excel dosyası okunurken hata oluştu: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  });

  // ================= TAB 3: TATİL VE KAPALI GÜNLER TAKVİMİ =================
  function renderHolidaysCalendar() {
    calendarGrid.innerHTML = '';
    const daysInM = window.dutyScheduler.getDaysInMonth(currentYear, currentMonth);

    // Gün Başlıkları
    const dayHeaders = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    dayHeaders.forEach(dh => {
      const hDiv = document.createElement('div');
      hDiv.className = 'cal-header-cell';
      hDiv.textContent = dh;
      calendarGrid.appendChild(hDiv);
    });

    // İlk günün haftanın hangi günü başladığı
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0: Paz, 1: Pzt
    const shift = (firstDayIndex + 6) % 7; // Pzt: 0, Paz: 6
    for (let s = 0; s < shift; s++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.opacity = '0';
      calendarGrid.appendChild(emptyDiv);
    }

    for (let d = 1; d <= daysInM; d++) {
      const dKey = window.dutyScheduler.formatDateKey(currentYear, currentMonth, d);
      const dateObj = new Date(currentYear, currentMonth, d);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isClosed = !!closedDates[dKey];

      const cell = document.createElement('div');
      cell.className = `cal-day-cell ${isClosed ? 'status-closed' : 'status-open'}`;
      if (isWeekend) cell.classList.add('is-weekend');

      cell.innerHTML = `
        <div class="cal-day-num">${d}</div>
        <div style="font-size:0.75rem; color:#64748b;">${window.dutyScheduler.turkishDays[dayOfWeek]}</div>
        <div class="cal-day-status">${isClosed ? 'KAPALI' : 'AÇIK'}</div>
      `;

      cell.addEventListener('click', () => {
        if (!ensureNotExpiredOrAlert()) return;
        if (closedDates[dKey]) {
          delete closedDates[dKey];
        } else {
          closedDates[dKey] = 'YURT KAPALI';
        }
        renderHolidaysCalendar();
        runDistribution();
        saveToLocalStorage();
      });

      calendarGrid.appendChild(cell);
    }
  }

  btnPresetAratatil.addEventListener('click', () => {
    if (!ensureNotExpiredOrAlert()) return;
    for (let d = 14; d <= 22; d++) {
      const dKey = window.dutyScheduler.formatDateKey(currentYear, currentMonth, d);
      closedDates[dKey] = 'ARA TATİL';
    }
    renderHolidaysCalendar();
    runDistribution();
    saveToLocalStorage();
    alert('14 - 22 Kasım Ara Tatil günleri yurt kapalı olarak ayarlandı!');
  });

  btnPresetAllOpen.addEventListener('click', () => {
    if (!ensureNotExpiredOrAlert()) return;
    closedDates = {};
    renderHolidaysCalendar();
    runDistribution();
    saveToLocalStorage();
    alert('Tüm günler yurt açık olarak ayarlandı!');
  });

  // ================= TAB 4: AYARLAR FORMU =================
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!ensureNotExpiredOrAlert()) return;
    settings.instTop = settingInstTop.value.trim();
    settings.instMid = settingInstMid.value.trim();
    settings.schoolName = settingSchoolName.value.trim();
    settings.approvalDate = settingApprovalDate.value.trim();
    settings.vicePrincipal = settingVicePrincipal.value.trim();
    settings.viceTitle = settingViceTitle.value.trim();
    settings.principal = settingPrincipal.value.trim();
    settings.principalTitle = settingPrincipalTitle.value.trim();

    applySettingsToUI();
    saveToLocalStorage();
    alert('Kurum ve imza ayarları başarıyla kaydedildi!');
  });

  btnResetDefaults.addEventListener('click', () => {
    if (!ensureNotExpiredOrAlert()) return;
    if (confirm('Tüm ayarları ve öğretmen listesini orijinal haline sıfırlamak istediğinize emin misiniz?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  // ================= DIŞA AKTARMA (PDF, EXCEL, YAZDIR) =================
  const modalPdfExport = document.getElementById('modal-pdf-export');
  const btnPdfModalClose = document.getElementById('btn-pdf-modal-close');
  const btnPdfModalCancel = document.getElementById('btn-pdf-modal-cancel');
  const btnPdfModalConfirm = document.getElementById('btn-pdf-modal-confirm');
  const btnPdfModalPrint = document.getElementById('btn-pdf-modal-print');
  const pdfOptEtut = document.getElementById('pdf-opt-etut');
  const pdfOptStats = document.getElementById('pdf-opt-stats');
  const pdfOptSignatures = document.getElementById('pdf-opt-signatures');

  const chkViewEtut = document.getElementById('chk-view-etut');
  const chkViewStats = document.getElementById('chk-view-stats');

  function syncClosedBannerColspans(hideEtut) {
    const targetSpan = hideEtut ? dutyColumns.length : (dutyColumns.length + 1);
    document.querySelectorAll('#roster-tbody td[data-closed-banner="true"]').forEach(td => {
      td.setAttribute('colspan', String(targetSpan));
    });
  }

  function syncViewToggles() {
    const printableRoster = document.getElementById('printable-roster');
    if (!printableRoster) return;

    const hideEtut = !!(chkViewEtut && !chkViewEtut.checked);
    if (hideEtut) {
      printableRoster.classList.add('hide-etut-col');
    } else {
      printableRoster.classList.remove('hide-etut-col');
    }
    syncClosedBannerColspans(hideEtut);

    if (chkViewStats && !chkViewStats.checked) {
      printableRoster.classList.add('hide-stats-section');
    } else {
      printableRoster.classList.remove('hide-stats-section');
    }
  }

  // PDF Seçenekleri Modalını Aç
  btnExportPdf.addEventListener('click', () => {
    if (!ensureExportRightCheck()) return;
    if (pdfOptEtut && chkViewEtut) pdfOptEtut.checked = chkViewEtut.checked;
    if (pdfOptStats && chkViewStats) pdfOptStats.checked = chkViewStats.checked;
    modalPdfExport.classList.add('active');
  });

  if (btnPdfModalClose) btnPdfModalClose.addEventListener('click', () => modalPdfExport.classList.remove('active'));
  if (btnPdfModalCancel) btnPdfModalCancel.addEventListener('click', () => modalPdfExport.classList.remove('active'));

  if (btnPdfModalConfirm) {
    btnPdfModalConfirm.addEventListener('click', async () => {
      const rightRes = await consumeExportRightOrAlert();
      if (!rightRes) return;
      modalPdfExport.classList.remove('active');
      generatePdfWithOptions({
        includeEtut: pdfOptEtut ? pdfOptEtut.checked : true,
        includeStats: pdfOptStats ? pdfOptStats.checked : true,
        includeSignatures: pdfOptSignatures ? pdfOptSignatures.checked : true
      });
    });
  }

  if (btnPdfModalPrint) {
    btnPdfModalPrint.addEventListener('click', async () => {
      const rightRes = await consumeExportRightOrAlert();
      if (!rightRes) return;
      modalPdfExport.classList.remove('active');
      printWithOptions({
        includeEtut: pdfOptEtut ? pdfOptEtut.checked : true,
        includeStats: pdfOptStats ? pdfOptStats.checked : true,
        includeSignatures: pdfOptSignatures ? pdfOptSignatures.checked : true
      });
    });
  }

  function generatePdfWithOptions(opts) {
    const printableRoster = document.getElementById('printable-roster');
    
    // Geçici tek sayfa ve görünüm sınıflarını uygula
    printableRoster.classList.add('pdf-single-page');
    printableRoster.classList.toggle('hide-etut-col', !opts.includeEtut);
    printableRoster.classList.toggle('hide-stats-section', !opts.includeStats);
    printableRoster.classList.toggle('hide-signatures', !opts.includeSignatures);
    syncClosedBannerColspans(!opts.includeEtut);

    // Kilit butonlarını ve simgelerini PDF'te kesinlikle kaldır/gizle
    const lockEls = printableRoster.querySelectorAll('.btn-lock-toggle, .lock-indicator');
    lockEls.forEach(el => el.style.setProperty('display', 'none', 'important'));

    const mName = window.dutyScheduler.monthNames[currentMonth];
    const filename = `${currentYear}_${mName}_Pansiyon_Nobet_Cizelgesi.pdf`;

    const opt = {
      margin: [3, 3, 3, 3],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    btnExportPdf.disabled = true;
    btnExportPdf.textContent = '⏳ PDF Oluşturuluyor...';

    const cleanup = () => {
      btnExportPdf.disabled = false;
      btnExportPdf.innerHTML = '<span>📄</span> PDF Olarak Kaydet';
      printableRoster.classList.remove('pdf-single-page');
      lockEls.forEach(el => el.style.removeProperty('display'));
      syncViewToggles();
    };

    html2pdf().set(opt).from(printableRoster).save().then(() => {
      cleanup();
    }).catch(err => {
      console.error(err);
      cleanup();
      window.print();
    });
  }

  function printWithOptions(opts) {
    const printableRoster = document.getElementById('printable-roster');
    printableRoster.classList.toggle('hide-etut-col', !opts.includeEtut);
    printableRoster.classList.toggle('hide-stats-section', !opts.includeStats);
    printableRoster.classList.toggle('hide-signatures', !opts.includeSignatures);
    syncClosedBannerColspans(!opts.includeEtut);

    const lockEls = printableRoster.querySelectorAll('.btn-lock-toggle, .lock-indicator');
    lockEls.forEach(el => el.style.setProperty('display', 'none', 'important'));

    window.print();
    setTimeout(() => {
      lockEls.forEach(el => el.style.removeProperty('display'));
      syncViewToggles();
    }, 1000);
  }

  // Excel Olarak İndir (.xlsx) - Dinamik Kız (0..3) + Erkek (0..3) = Toplam 1..6 Sütun Destekli Şablon Formatında
  btnExportExcel.addEventListener('click', async () => {
    const rightRes = await consumeExportRightOrAlert();
    if (!rightRes) return;

    try {
      const wb = XLSX.utils.book_new();
      const ws = {};

      const activeCols = window.dutyScheduler.normalizeDutyColumns(dutyColumns);
      const dutyCount = activeCols.length; // 1, 2 veya 3
      const colLet = (idx) => XLSX.utils.encode_col(idx);

      const firstDutyIdx = 2; // C
      const lastDutyIdx = firstDutyIdx + dutyCount - 1;
      const etutColIdx = lastDutyIdx + 1;
      const spacerColIdx = etutColIdx + 1;
      const fStartIdx = spacerColIdx + 1; // Kadın özet başlangıcı (4 sütun)
      const mStartIdx = fStartIdx + 4;    // Erkek özet başlangıcı (7 sütun)
      const lastColIdx = mStartIdx + 6;

      const mName = window.dutyScheduler.monthNames[currentMonth] || 'Kasım';
      const sheetName = `NÖBET ${mName.toUpperCase()}`.slice(0, 31);

      // Dinamik sütun genişlikleri (!cols)
      const colsSpec = [
        { wch: 12.33 }, // A: TARİH
        { wch: 13.33 }  // B: GÜN
      ];
      activeCols.forEach(() => colsSpec.push({ wch: 22.50 }));
      colsSpec.push(
        { wch: 21.11 }, // ETÜT
        { wch: 3.00 },  // Ayırıcı Boşluk
        { wch: 19.78 }, // Kadın Öğretmen
        { wch: 10.00 }, // TOPLAM
        { wch: 11.33 }, // ETÜT
        { wch: 9.11 },  // HAFTA SONU
        { wch: 9.11 },  // SIRA
        { wch: 25.11 }, // Erkek Öğretmen
        { wch: 20.33 }, // TOPLAM
        { wch: 11.00 }, // HAFTA SONU
        { wch: 10.78 }, // ETÜT
        { wch: 12.00 }, // ETÜT+TOPLAMI
        { wch: 11.89 }  // PUAN
      );
      ws['!cols'] = colsSpec;

      const merges = [];

      // İnce Kenarlık Stili (Orijinal ile birebir)
      const thinBorder = {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      };

      // Başlık Stili (#FFC000 Amber Gold dolgulu, kalın Calibri 11pt, ortalı)
      const headerStyle = {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '000000' } },
        fill: { fgColor: { rgb: 'FFC000' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: thinBorder
      };

      // Normal Çizelge Hücreleri (Beyaz zemin)
      const scheduleCenterStyle = {
        font: { name: 'Calibri', sz: 10, bold: false, color: { rgb: '000000' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: thinBorder
      };

      const scheduleLeftStyle = {
        font: { name: 'Calibri', sz: 10, bold: false, color: { rgb: '000000' } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder
      };

      // Hafta Sonu ve Kapalı Günler (#FFC000 Amber Gold dolgulu)
      const scheduleHighlightLeftStyle = {
        font: { name: 'Calibri', sz: 10, bold: false, color: { rgb: '000000' } },
        fill: { fgColor: { rgb: 'FFC000' } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder
      };

      // Özet Tablo Başlık Stili
      const summaryHeaderStyle = {
        font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '000000' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: thinBorder
      };

      // Özet Tablo Veri Stilleri
      const summaryDataCenterStyle = {
        font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '000000' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: thinBorder
      };

      const summaryDataLeftStyle = {
        font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '000000' } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder
      };

      // 1. Başlık Satırı (Satır 1)
      ws['A1'] = { t: 's', v: 'TARİH', s: headerStyle };
      ws['B1'] = { t: 's', v: 'GÜN', s: headerStyle };
      activeCols.forEach((col, i) => {
        ws[`${colLet(firstDutyIdx + i)}1`] = { t: 's', v: col.title.toUpperCase(), s: headerStyle };
      });
      ws[`${colLet(etutColIdx)}1`] = { t: 's', v: 'ETÜT', s: headerStyle };

      // 2. Çizelge Günleri (Satır 4'ten başlar)
      const startRow = 4;
      const endScheduleRow = startRow + scheduleDays.length - 1;

      scheduleDays.forEach((rawDay, idx) => {
        const d = window.dutyScheduler.migrateDayObject(rawDay);
        const r = startRow + idx;
        const isWknd = d.isWeekend;
        const isClosed = d.isClosed;
        const shouldHighlight = isWknd || isClosed;

        const dateParts = d.dateKey.split('-');
        const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        // A ve B: Tarih ve Gün (Ortalı)
        ws[`A${r}`] = { t: 's', v: formattedDate, s: scheduleCenterStyle };
        ws[`B${r}`] = { t: 's', v: (d.dayName || '').toUpperCase(), s: scheduleCenterStyle };

        // Dinamik Belletici Sütunları + Etüt
        const dutyStyle = shouldHighlight ? scheduleHighlightLeftStyle : scheduleLeftStyle;

        if (isClosed) {
          const closedText = d.closedReason ? `KAPALI (${d.closedReason})` : 'KAPALI';
          activeCols.forEach((col, i) => {
            ws[`${colLet(firstDutyIdx + i)}${r}`] = { t: 's', v: i === 0 ? closedText : '', s: dutyStyle };
          });
          ws[`${colLet(etutColIdx)}${r}`] = { t: 's', v: '', s: dutyStyle };
        } else {
          activeCols.forEach((col, i) => {
            ws[`${colLet(firstDutyIdx + i)}${r}`] = { t: 's', v: d[col.id] || '', s: dutyStyle };
          });
          ws[`${colLet(etutColIdx)}${r}`] = { t: 's', v: d.etut || '', s: dutyStyle };
        }
      });

      // 3. Sağ Taraf Özet Tabloları (Satır 8'den başlar)
      const fNameCol = colLet(fStartIdx);
      const fTotalCol = colLet(fStartIdx + 1);
      const fEtutCol = colLet(fStartIdx + 2);
      const fWkndCol = colLet(fStartIdx + 3);

      const mSiraCol = colLet(mStartIdx);
      const mNameCol = colLet(mStartIdx + 1);
      const mTotalCol = colLet(mStartIdx + 2);
      const mWkndCol = colLet(mStartIdx + 3);
      const mEtutCol = colLet(mStartIdx + 4);
      const mEtutPlusCol = colLet(mStartIdx + 5);
      const mScoreCol = colLet(mStartIdx + 6);

      const dutyRangeRef = `${colLet(firstDutyIdx)}$${startRow}:${colLet(lastDutyIdx)}$${endScheduleRow}`;
      const etutRangeRef = `${colLet(etutColIdx)}$${startRow}:${colLet(etutColIdx)}$${endScheduleRow}`;

      ws[`${fNameCol}8`] = { t: 's', v: 'ÖĞRETMEN', s: summaryHeaderStyle };
      ws[`${fTotalCol}8`] = { t: 's', v: 'TOPLAM', s: summaryHeaderStyle };
      ws[`${fEtutCol}8`] = { t: 's', v: 'ETÜT', s: summaryHeaderStyle };
      ws[`${fWkndCol}8`] = { t: 's', v: 'HAFTA SONU', s: summaryHeaderStyle };

      ws[`${mSiraCol}8`] = { t: 's', v: 'SIRA', s: summaryHeaderStyle };
      ws[`${mNameCol}8`] = { t: 's', v: 'ÖĞRETMEN', s: summaryHeaderStyle };
      ws[`${mTotalCol}8`] = { t: 's', v: 'TOPLAM', s: summaryHeaderStyle };
      ws[`${mWkndCol}8`] = { t: 's', v: 'HAFTA SONU', s: summaryHeaderStyle };
      ws[`${mEtutCol}8`] = { t: 's', v: 'ETÜT', s: summaryHeaderStyle };
      ws[`${mEtutPlusCol}8`] = { t: 's', v: 'ETÜT+TOPLAMI', s: summaryHeaderStyle };
      ws[`${mScoreCol}8`] = { t: 's', v: 'PUAN', s: summaryHeaderStyle };

      const femaleTeachers = teachers.filter(t => t.gender === 'K' && t.active !== false);
      const maleTeachers = teachers.filter(t => t.gender === 'E' && t.active !== false);

      // Kadın Öğretmenler Verileri (Satır 9'dan başlar)
      femaleTeachers.forEach((t, i) => {
        const r = 9 + i;
        let totalHostel = 0;
        let totalEtut = 0;
        let weekendCount = 0;

        scheduleDays.forEach(d => {
          if (d.isClosed) return;
          activeCols.forEach(col => {
            if (d[col.id] === t.name) {
              totalHostel++;
              if (d.isWeekend) weekendCount++;
            }
          });
          if (d.etut === t.name) totalEtut++;
        });

        ws[`${fNameCol}${r}`] = { t: 's', v: t.name, s: summaryDataLeftStyle };
        ws[`${fTotalCol}${r}`] = {
          t: 'n',
          v: totalHostel,
          f: `COUNTIF(${dutyRangeRef},"${t.name}")`,
          s: summaryDataCenterStyle
        };
        ws[`${fEtutCol}${r}`] = {
          t: 'n',
          v: totalEtut,
          f: `COUNTIF(${etutRangeRef},"${t.name}")`,
          s: summaryDataCenterStyle
        };
        ws[`${fWkndCol}${r}`] = {
          t: 'n',
          v: weekendCount,
          s: summaryDataCenterStyle
        };
      });

      // Erkek Öğretmenler Verileri (Satır 9'dan başlar)
      maleTeachers.forEach((t, i) => {
        const r = 9 + i;
        let totalHostel = 0;
        let totalEtut = 0;
        let weekendCount = 0;

        scheduleDays.forEach(d => {
          if (d.isClosed) return;
          activeCols.forEach(col => {
            if (d[col.id] === t.name) {
              totalHostel++;
              if (d.isWeekend) weekendCount++;
            }
          });
          if (d.etut === t.name) totalEtut++;
        });

        const etutPlusTotal = totalHostel + (totalEtut / 2);
        const score = weekendCount + (etutPlusTotal / 2);

        ws[`${mSiraCol}${r}`] = { t: 'n', v: i + 1, s: summaryDataCenterStyle };
        ws[`${mNameCol}${r}`] = { t: 's', v: t.name, s: summaryDataLeftStyle };
        ws[`${mTotalCol}${r}`] = {
          t: 'n',
          v: totalHostel,
          f: `COUNTIF(${dutyRangeRef},"${t.name}")`,
          s: summaryDataCenterStyle
        };
        ws[`${mWkndCol}${r}`] = {
          t: 'n',
          v: weekendCount,
          s: summaryDataCenterStyle
        };
        ws[`${mEtutCol}${r}`] = {
          t: 'n',
          v: totalEtut,
          f: `COUNTIF(${etutRangeRef},"${t.name}")`,
          s: summaryDataCenterStyle
        };
        ws[`${mEtutPlusCol}${r}`] = {
          t: 'n',
          v: etutPlusTotal,
          f: `${mTotalCol}${r}+(${mEtutCol}${r}/2)`,
          s: summaryDataCenterStyle
        };
        ws[`${mScoreCol}${r}`] = {
          t: 'n',
          v: score,
          f: `${mWkndCol}${r}+(${mEtutPlusCol}${r}/2)`,
          s: summaryDataCenterStyle
        };
      });

      // Erkek Öğretmenler Toplam Satırı
      if (maleTeachers.length > 0) {
        const totalRow = 9 + maleTeachers.length;
        ws[`${mNameCol}${totalRow}`] = { t: 's', v: 'TOPLAM', s: summaryHeaderStyle };
        ws[`${mTotalCol}${totalRow}`] = {
          t: 'n',
          f: `SUM(${mTotalCol}9:${mTotalCol}${totalRow - 1})`,
          s: summaryDataCenterStyle
        };
      }

      // 4. İmzalar
      const maxContentRow = Math.max(endScheduleRow, 9 + Math.max(femaleTeachers.length, maleTeachers.length));
      const sigRow1 = Math.max(39, maxContentRow + 3);
      const sigRow2 = sigRow1 + 1;

      const leftSigEnd = Math.min(2, etutColIdx - 1);
      const rightSigStart = leftSigEnd + 1;
      const rightSigEnd = Math.max(rightSigStart, etutColIdx);

      merges.push({ s: { c: 0, r: sigRow1 - 1 }, e: { c: leftSigEnd, r: sigRow1 - 1 } });
      merges.push({ s: { c: rightSigStart, r: sigRow1 - 1 }, e: { c: rightSigEnd, r: sigRow1 - 1 } });
      merges.push({ s: { c: 0, r: sigRow2 - 1 }, e: { c: leftSigEnd, r: sigRow2 - 1 } });
      merges.push({ s: { c: rightSigStart, r: sigRow2 - 1 }, e: { c: rightSigEnd, r: sigRow2 - 1 } });

      const signatureNameStyle = {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '000000' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
      const signatureTitleStyle = {
        font: { name: 'Calibri', sz: 10, bold: false, color: { rgb: '000000' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };

      const rightSigCol = colLet(rightSigStart);
      ws[`A${sigRow1}`] = { t: 's', v: (settings && settings.vicePrincipal) || 'Nebi DEMİR', s: signatureNameStyle };
      ws[`${rightSigCol}${sigRow1}`] = { t: 's', v: (settings && settings.principal) || 'Hayrullah YILDIRIM', s: signatureNameStyle };
      ws[`A${sigRow2}`] = { t: 's', v: (settings && settings.viceTitle) || 'Pansiyondan Sorumlu Müdür Yardımcısı', s: signatureTitleStyle };
      ws[`${rightSigCol}${sigRow2}`] = { t: 's', v: (settings && settings.principalTitle) || 'Okul Müdürü', s: signatureTitleStyle };

      ws['!merges'] = merges;
      ws['!ref'] = `A1:${colLet(lastColIdx)}${sigRow2}`;

      // Orijinal satır yükseklikleri (!rows)
      ws['!rows'] = [];
      ws['!rows'][0] = { hpt: 18, hpx: 18 };
      ws['!rows'][7] = { hpt: 18.75, hpx: 18.75 };
      for (let r = startRow - 1; r < endScheduleRow; r++) {
        ws['!rows'][r] = { hpt: 17, hpx: 17 };
      }

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, `${currentYear}_${mName.toUpperCase()}_NOBET_LISTESI.xlsx`);
    } catch (err) {
      console.error('Excel dışa aktarma hatası:', err);
      alert('Excel dosyası oluşturulurken bir hata oluştu: ' + err.message);
    }
  });

  btnPrint.addEventListener('click', () => {
    if (!ensureExportRightCheck()) return;
    modalPdfExport.classList.add('active');
  });

  // ================= DİĞER EVENT HANDLERLAR =================
  function setupEventHandlers() {
    // Toolbar Kilit Butonları
    const btnLockAll = document.getElementById('btn-lock-all');
    if (btnLockAll) {
      btnLockAll.addEventListener('click', () => {
        if (!ensureNotExpiredOrAlert()) return;
        const activeRoles = [...getActiveColumnIds(), 'etut'];
        scheduleDays.forEach(day => {
          if (!day.locked) day.locked = {};
          activeRoles.forEach(role => {
            if (day[role]) day.locked[role] = true;
          });
        });
        renderScheduleTable();
        markAsUnsaved();
        alert('Tüm dolu nöbetler kilitlendi 🔒. Otomatik dağıtım yapıldığında bu öğretmenler yerinde sabit kalacaktır.');
      });
    }

    const btnUnlockAll = document.getElementById('btn-unlock-all');
    if (btnUnlockAll) {
      btnUnlockAll.addEventListener('click', () => {
        if (!ensureNotExpiredOrAlert()) return;
        if (confirm('Tüm kilitleri kaldırmak istediğinize emin misiniz?')) {
          scheduleDays.forEach(day => {
            day.locked = {
              kiz1: false, kiz2: false, kiz3: false,
              erkek1: false, erkek2: false, erkek3: false,
              etut: false
            };
          });
          renderScheduleTable();
          markAsUnsaved();
        }
      });
    }

    // Toolbar Görünüm Checkbox'ları
    if (chkViewEtut) {
      chkViewEtut.addEventListener('change', syncViewToggles);
    }
    if (chkViewStats) {
      chkViewStats.addEventListener('change', syncViewToggles);
    }
    // Ay & Yıl Değişimi - Veritabanından Yükle
    selectMonth.addEventListener('change', () => {
      const newMonth = parseInt(selectMonth.value, 10);
      switchMonth(currentYear, newMonth);
    });

    selectYear.addEventListener('change', () => {
      const newYear = parseInt(selectYear.value, 10);
      switchMonth(newYear, currentMonth);
    });

    btnQuickDistribute.addEventListener('click', async () => {
      const rightRes = await consumeScheduleRightOrAlert();
      if (!rightRes) return;
      runDistribution();
      const remNote = (!rightRes.unlimited && typeof rightRes.remaining === 'number')
        ? `\n(Kalan Yeni Nöbet Hazırlama Hakkınız: ${rightRes.remaining} / ${rightRes.limit})`
        : '';
      alert(`Nöbetler adil şekilde yeniden dağıtıldı!${remNote}`);
    });

    btnClearSchedule.addEventListener('click', () => {
      if (!ensureNotExpiredOrAlert()) return;
      if (confirm('Kilitli olmayan nöbet atamalarını temizlemek istediğinize emin misiniz?\n(Kilitli 🔒 nöbetler korunacaktır)')) {
        let clearedCount = 0;
        let preservedLockedCount = 0;
        const activeRoles = [...getActiveColumnIds(), 'etut'];
        scheduleDays.forEach(d => {
          const locked = d.locked || {};
          activeRoles.forEach(role => {
            if (locked[role]) {
              if (d[role]) preservedLockedCount++;
            } else {
              if (d[role]) {
                d[role] = null;
                clearedCount++;
              }
            }
          });
        });
        renderScheduleTable();
        renderStatsTables();
        markAsUnsaved();
        if (preservedLockedCount > 0) {
          showToast('Nöbetler Temizlendi', `Kilitli olmayan nöbetler silindi. ${preservedLockedCount} adet kilitli (🔒) nöbet korundu.`, 'info');
        } else {
          showToast('Çizelge Temizlendi', 'Tüm nöbetler temizlendi.', 'info');
        }
      }
    });

    // Üst Bar Kaydet Butonu
    if (btnSaveSchedule) {
      btnSaveSchedule.addEventListener('click', handleManualSave);
    }

    // Son Kaydedilen Duruma Geri Dön Butonu
    const btnRevertSchedule = document.getElementById('btn-revert-schedule');
    if (btnRevertSchedule) {
      btnRevertSchedule.addEventListener('click', revertToLastSaved);
    }

    // Ctrl+S / Cmd+S ve Ctrl+P yetki kontrolü
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (window.authManager && window.authManager.isLoggedIn()) {
          handleManualSave();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
          e.preventDefault();
          return;
        }
        if (!window.authManager.canExport()) {
          e.preventDefault();
          ensureExportRightCheck();
        } else if (!window.authManager.isAdmin()) {
          e.preventDefault();
          modalPdfExport.classList.add('active');
        }
      }
    });

    // Kaydedilmemiş değişiklik varken sayfadan çıkmaya çalışırsa kullanıcıyı uyar
    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Kaydedilmemiş değişiklikleriniz var. Sayfayı kaydetmeden kapatırsanız son kaydettiğiniz hal geri yüklenecektir.';
        return e.returnValue;
      }
    });

    // Sekme Değişimi
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        switchTab(targetId);
      });
    });
  }

  function switchTab(targetId) {
    if (targetId === 'tab-users' && (!window.authManager || !window.authManager.isAdmin())) {
      showToast('Yetkisiz Erişim', 'Kullanıcı yönetimi yalnızca ana yönetici (nebi) tarafından kullanılabilir.', 'error');
      return;
    }
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === targetId));
    tabPanes.forEach(p => p.classList.toggle('active', p.id === targetId));
    if (targetId === 'tab-users') {
      renderUsersManagementTab();
      if (window.authManager && window.authManager.isCloudMode()) {
        window.authManager.refreshUsersAsync().then(() => renderUsersManagementTab());
      }
    }
  }

  // ================= KULLANICI GİRİŞİ, YETKİ KONTROLÜ VE KULLANICI YÖNETİMİ =================
  const loginOverlay = document.getElementById('login-overlay');
  const appRootEl = document.getElementById('app');
  const loginForm = document.getElementById('login-form');
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const btnToggleLoginPass = document.getElementById('btn-toggle-login-pass');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const loginErrorBox = document.getElementById('login-error-box');
  const loginCloudStatusEl = document.getElementById('login-cloud-status');

  const cloudModeBadge = document.getElementById('cloud-mode-badge');
  const btnSyncCloud = document.getElementById('btn-sync-cloud');
  const sessionRoleBadge = document.getElementById('session-role-badge');
  const sessionUserNameEl = document.getElementById('session-user-name');
  const sessionRightsBadgesEl = document.getElementById('session-rights-badges');
  const btnLogout = document.getElementById('btn-logout');
  const navTabUsers = document.getElementById('nav-tab-users');
  const expiredLockBanner = document.getElementById('expired-lock-banner');
  const expiredLockText = document.getElementById('expired-lock-text');

  function updateCloudStatusBadges() {
    const isCloud = !!(window.authManager && window.authManager.isCloudMode());
    if (loginCloudStatusEl) {
      loginCloudStatusEl.className = `cloud-status-pill ${isCloud ? 'cloud-online' : 'cloud-local'}`;
      loginCloudStatusEl.textContent = isCloud
        ? '☁️ Merkezi Bulut Veritabanı Aktif (Tüm Cihazlar Ortak)'
        : '💻 Yerel Mod (Çevrimdışı / Tek Cihaz)';
    }
    if (cloudModeBadge) {
      cloudModeBadge.className = `cloud-mode-badge ${isCloud ? 'cloud-online' : 'cloud-local'}`;
      cloudModeBadge.textContent = isCloud ? '☁️ Bulut Ortak DB' : '💻 Yerel Mod';
    }
    if (btnSyncCloud) {
      btnSyncCloud.style.display = isCloud ? 'inline-flex' : 'none';
    }
  }

  const usersSummaryBar = document.getElementById('users-summary-bar');
  const usersTableTbody = document.getElementById('users-table-tbody');
  const btnAddUser = document.getElementById('btn-add-user');

  const modalUserEdit = document.getElementById('modal-user-edit');
  const userModalTitle = document.getElementById('user-modal-title');
  const userEditForm = document.getElementById('user-edit-form');
  const userInputId = document.getElementById('user-input-id');
  const userInputUsername = document.getElementById('user-input-username');
  const userInputDisplayName = document.getElementById('user-input-displayname');
  const userInputPassword = document.getElementById('user-input-password');
  const btnToggleUserPass = document.getElementById('btn-toggle-user-pass');
  const userPasswordLabel = document.getElementById('user-password-label');
  const userPasswordHint = document.getElementById('user-password-hint');
  const userRightsEditorBox = document.getElementById('user-rights-editor-box');
  const userScheduleMode = document.getElementById('user-schedule-mode');
  const userScheduleLimitWrap = document.getElementById('user-schedule-limit-wrap');
  const userScheduleLimit = document.getElementById('user-schedule-limit');
  const userExportMode = document.getElementById('user-export-mode');
  const userExportLimitWrap = document.getElementById('user-export-limit-wrap');
  const userExportLimit = document.getElementById('user-export-limit');
  const userExpiryMode = document.getElementById('user-expiry-mode');
  const userExpiryDurationWrap = document.getElementById('user-expiry-duration-wrap');
  const userExpiryAmount = document.getElementById('user-expiry-amount');
  const userExpiryUnit = document.getElementById('user-expiry-unit');
  const userExpiryDateWrap = document.getElementById('user-expiry-date-wrap');
  const userExpiryDatetime = document.getElementById('user-expiry-datetime');
  const userExpiryCurrentInfo = document.getElementById('user-expiry-current-info');
  const userInputActive = document.getElementById('user-input-active');
  const userAdminUnlimitedNote = document.getElementById('user-admin-unlimited-note');
  const userFormError = document.getElementById('user-form-error');
  const btnUserModalClose = document.getElementById('btn-user-modal-close');
  const btnUserModalCancel = document.getElementById('btn-user-modal-cancel');

  let wasSessionExpired = false;

  function toDateTimeLocalValue(isoStr) {
    const d = isoStr ? new Date(isoStr) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function ensureNotExpiredOrAlert() {
    if (!window.authManager) return true;
    if (!window.authManager.isLoggedIn()) return false;
    const expStatus = window.authManager.getExpiryStatus();
    if (!expStatus.expired) return true;
    syncAuthUI();
    const msg = `Yetki süreniz (${expStatus.formattedDate}) dolmuştur. Hiçbir şekilde değişiklik yapamazsınız. Süre uzatmak için ana yönetici (nebi) ile iletişime geçiniz.`;
    showToast('Yetki Süresi Doldu ⛔', msg, 'error');
    alert(msg);
    return false;
  }

  function ensureScheduleRightCheck() {
    if (!window.authManager) return true;
    if (!ensureNotExpiredOrAlert()) return false;
    const status = window.authManager.getRightStatus('schedule');
    if (status.allowed) return true;
    const msg = status.mode === 'limited'
      ? `Yeni nöbet hazırlama hakkınız dolmuştur (${status.remaining} / ${status.limit}). Yeni hak için ana yönetici (nebi) ile iletişime geçin.`
      : 'Yeni nöbet hazırlama yetkiniz bulunmamaktadır. Lütfen ana yönetici (nebi) ile iletişime geçin.';
    showToast('Yetki / Hak Yetersiz', msg, 'error');
    alert(msg);
    return false;
  }

  async function consumeScheduleRightOrAlert() {
    if (!window.authManager) return { ok: true, unlimited: true };
    if (!ensureNotExpiredOrAlert()) return false;
    const res = await window.authManager.consumeRightAsync('schedule');
    if (!res.ok) {
      syncAuthUI();
      showToast('Yetki / Hak Yetersiz', res.error, 'error');
      alert(res.error);
      return false;
    }
    syncAuthUI();
    return res;
  }

  function ensureExportRightCheck() {
    if (!window.authManager) return true;
    if (!ensureNotExpiredOrAlert()) return false;
    const status = window.authManager.getRightStatus('export');
    if (status.allowed) return true;
    const msg = status.mode === 'limited'
      ? `Çıktı alma (PDF / Excel / Yazdır) hakkınız dolmuştur (${status.remaining} / ${status.limit}). Yeni hak için ana yönetici (nebi) ile iletişime geçin.`
      : 'Çıktı alma (PDF / Excel / Yazdır) yetkiniz bulunmamaktadır. Lütfen ana yönetici (nebi) ile iletişime geçin.';
    showToast('Yetki / Hak Yetersiz', msg, 'error');
    alert(msg);
    return false;
  }

  async function consumeExportRightOrAlert() {
    if (!window.authManager) return { ok: true, unlimited: true };
    if (!ensureNotExpiredOrAlert()) return false;
    const res = await window.authManager.consumeRightAsync('export');
    if (!res.ok) {
      syncAuthUI();
      showToast('Yetki / Hak Yetersiz', res.error, 'error');
      alert(res.error);
      return false;
    }
    syncAuthUI();
    return res;
  }

  function renderRightPillHtml(prefix, status) {
    if (status.expired) {
      return `<span class="right-pill pill-depleted">${prefix}: ⛔ Süresi Doldu</span>`;
    }
    if (status.mode === 'unlimited') {
      return `<span class="right-pill pill-unlimited">${prefix}: ♾️ Sınırsız</span>`;
    }
    if (status.mode === 'limited') {
      const cls = status.remaining > 0 ? 'pill-limited' : 'pill-depleted';
      return `<span class="right-pill ${cls}">${prefix}: ${status.remaining}/${status.limit} Hak</span>`;
    }
    return `<span class="right-pill pill-none">${prefix}: 🚫 Kapalı</span>`;
  }

  function renderExpiryPillHtml(expStatus) {
    if (expStatus.mode === 'unlimited') {
      return '<span class="right-pill pill-unlimited">⏳ Süre: ♾️ Süresiz</span>';
    }
    if (expStatus.expired) {
      return `<span class="right-pill pill-depleted" title="Bitiş: ${escapeHtml(expStatus.formattedDate)}">⛔ Süresi Doldu</span>`;
    }
    return `<span class="right-pill pill-limited" title="Bitiş: ${escapeHtml(expStatus.formattedDate)}">⏳ Kalan: ${escapeHtml(expStatus.remainingLabel)}</span>`;
  }

  function syncAuthUI() {
    if (!window.authManager) return;
    const user = window.authManager.getCurrentUser();

    if (!user) {
      wasSessionExpired = false;
      if (loginOverlay) loginOverlay.classList.remove('hidden');
      if (appRootEl) {
        appRootEl.classList.add('app-locked');
        appRootEl.classList.remove('app-readonly-expired');
      }
      if (expiredLockBanner) expiredLockBanner.style.display = 'none';
      if (loginPasswordInput) loginPasswordInput.value = '';
      if (loginUsernameInput) {
        setTimeout(() => loginUsernameInput.focus(), 50);
      }
      return;
    }

    if (loginOverlay) loginOverlay.classList.add('hidden');
    if (appRootEl) appRootEl.classList.remove('app-locked');

    const isAdmin = window.authManager.isAdmin(user);
    const expStatus = window.authManager.getExpiryStatus(user);
    const isExpired = !isAdmin && expStatus.expired;
    const schedStatus = window.authManager.getRightStatus('schedule', user);
    const exportStatus = window.authManager.getRightStatus('export', user);

    if (appRootEl) {
      appRootEl.classList.toggle('app-readonly-expired', isExpired);
    }

    if (expiredLockBanner && expiredLockText) {
      if (isExpired) {
        expiredLockText.textContent = `Yetki süreniz ${expStatus.formattedDate} tarihinde dolmuştur. Hiçbir şekilde değişiklik yapamazsınız (salt okunur mod). Süre uzatmak için ana yönetici (nebi) ile iletişime geçiniz.`;
        expiredLockBanner.style.display = 'flex';
      } else {
        expiredLockBanner.style.display = 'none';
      }
    }

    // Süre oturum açıkken yeni dolduysa açık düzenleme modallarını anında kapat ve uyar
    if (isExpired) {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
      if (!wasSessionExpired) {
        showToast('Yetki Süreniz Doldu ⛔', 'Artık hiçbir değişiklik yapamazsınız (salt okunur mod).', 'error');
      }
    }
    wasSessionExpired = isExpired;

    // Ayarlar formundaki inputları süresi dolan kullanıcı için kilitle
    if (settingsForm) {
      settingsForm.querySelectorAll('input, textarea, select').forEach(el => {
        el.disabled = isExpired;
      });
    }

    if (sessionRoleBadge) {
      sessionRoleBadge.textContent = isAdmin ? '👑 Ana Yönetici' : (isExpired ? '⛔ Süresi Doldu' : '👤 Kullanıcı');
      sessionRoleBadge.classList.toggle('role-user', !isAdmin);
    }

    if (sessionUserNameEl) {
      sessionUserNameEl.textContent = user.displayName && user.displayName !== user.username
        ? `${user.displayName} (${user.username})`
        : user.username;
    }

    if (sessionRightsBadgesEl) {
      if (isAdmin) {
        sessionRightsBadgesEl.innerHTML = '<span class="right-pill pill-unlimited">♾️ Sınırsız &amp; Süresiz Yetki</span>';
      } else {
        sessionRightsBadgesEl.innerHTML =
          renderExpiryPillHtml(expStatus) +
          renderRightPillHtml('✨ Yeni Nöbet', schedStatus) +
          renderRightPillHtml('📄 Çıktı', exportStatus);
      }
    }

    // Kullanıcı Yönetimi sekmesi sadece ana yönetici (nebi) için görünür
    if (navTabUsers) {
      navTabUsers.style.display = isAdmin ? 'inline-flex' : 'none';
    }
    const usersTabPane = document.getElementById('tab-users');
    if (!isAdmin && usersTabPane && usersTabPane.classList.contains('active')) {
      switchTab('tab-schedule');
    }

    // Yetkisiz veya süresi dolmuş butonlarda görsel belirtme
    const schedButtons = [btnOpenWizard, btnQuickDistribute, btnColumnsModalApplyRedistribute];
    schedButtons.forEach(btn => {
      if (!btn) return;
      btn.classList.toggle('btn-no-right', isExpired || !schedStatus.allowed);
    });

    const exportButtons = [btnExportPdf, btnExportExcel, btnPrint];
    exportButtons.forEach(btn => {
      if (!btn) return;
      btn.classList.toggle('btn-no-right', isExpired || !exportStatus.allowed);
    });

    if (isAdmin && usersTabPane && usersTabPane.classList.contains('active')) {
      renderUsersManagementTab();
    }
  }

  function renderUsersManagementTab() {
    if (!window.authManager || !window.authManager.isAdmin() || !usersTableTbody) return;
    const users = window.authManager.getUsers();

    if (usersSummaryBar) {
      const total = users.length;
      const activeCount = users.filter(u => u.active).length;
      const expiredCount = users.filter(u => u.role !== 'admin' && window.authManager.isExpired(u)).length;
      usersSummaryBar.innerHTML = `
        <div class="user-summary-chip">👥 Toplam Kullanıcı: <strong>${total}</strong></div>
        <div class="user-summary-chip">✅ Aktif Hesap: <strong>${activeCount}</strong></div>
        <div class="user-summary-chip">⛔ Süresi Dolan: <strong>${expiredCount}</strong></div>
        <div class="user-summary-chip">👑 Ana Yönetici: <strong>nebi (Sınırsız &amp; Süresiz)</strong></div>
      `;
    }

    usersTableTbody.innerHTML = '';
    users.forEach(u => {
      const isMainAdmin = u.role === 'admin' || u.username.toLowerCase() === 'nebi';
      const schedStatus = window.authManager.getRightStatus('schedule', u);
      const exportStatus = window.authManager.getRightStatus('export', u);
      const expStatus = window.authManager.getExpiryStatus(u);

      const tr = document.createElement('tr');
      if (!u.active || expStatus.expired) tr.classList.add('user-row-inactive');

      const schedExtra = (!isMainAdmin && schedStatus.mode === 'limited')
        ? `<div style="font-size:0.72rem; color:#64748b; margin-top:3px;">Kullanılan: ${schedStatus.used} / Toplam: ${schedStatus.limit}</div>`
        : '';
      const exportExtra = (!isMainAdmin && exportStatus.mode === 'limited')
        ? `<div style="font-size:0.72rem; color:#64748b; margin-top:3px;">Kullanılan: ${exportStatus.used} / Toplam: ${exportStatus.limit}</div>`
        : '';
      const expiryExtra = (!isMainAdmin && expStatus.mode === 'limited' && expStatus.formattedDate)
        ? `<div style="font-size:0.72rem; color:#64748b; margin-top:3px;">Bitiş: ${escapeHtml(expStatus.formattedDate)}</div>`
        : '';

      const actionsHtml = isMainAdmin
        ? `<div class="user-actions-group">
             <button type="button" class="btn btn-secondary btn-sm btn-edit-user">✏️ Düzenle</button>
           </div>`
        : `<div class="user-actions-group">
             <button type="button" class="btn btn-secondary btn-sm btn-edit-user">✏️ Yetki / Süre</button>
             <button type="button" class="btn btn-accent btn-sm btn-reset-usage" title="Kullanılmış hak sayaçlarını sıfırla">🔄 Yenile</button>
             <button type="button" class="btn btn-outline-danger btn-sm btn-delete-user" title="Kullanıcıyı sil">🗑️</button>
           </div>`;

      tr.innerHTML = `
        <td>
          <div class="user-cell-name">${escapeHtml(u.displayName || u.username)}</div>
          <div class="user-cell-username">@${escapeHtml(u.username)}</div>
        </td>
        <td>
          ${isMainAdmin
            ? '<span class="session-role-badge">👑 Ana Yönetici</span>'
            : '<span class="session-role-badge role-user">👤 Kullanıcı</span>'}
          <div style="margin-top:4px;">
            ${u.active
              ? '<span style="color:#16a34a; font-size:0.76rem; font-weight:700;">● Aktif</span>'
              : '<span style="color:#dc2626; font-size:0.76rem; font-weight:700;">● Pasif</span>'}
          </div>
        </td>
        <td>
          ${renderRightPillHtml('Nöbet', schedStatus)}
          ${schedExtra}
        </td>
        <td>
          ${renderRightPillHtml('Çıktı', exportStatus)}
          ${exportExtra}
        </td>
        <td>
          ${renderExpiryPillHtml(expStatus)}
          ${expiryExtra}
        </td>
        <td>${actionsHtml}</td>
      `;

      const editBtn = tr.querySelector('.btn-edit-user');
      if (editBtn) {
        editBtn.addEventListener('click', () => openUserModal(u));
      }

      const resetBtn = tr.querySelector('.btn-reset-usage');
      if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
          if (confirm(`"${u.username}" kullanıcısının harcanmış nöbet ve çıktı hak sayaçlarını sıfırlamak istiyor musunuz?`)) {
            resetBtn.disabled = true;
            try {
              const res = await window.authManager.resetUserUsageAsync(u.id);
              if (res.ok) {
                renderUsersManagementTab();
                showToast('Haklar Yenilendi', `"${u.username}" kullanıcısının kullanım sayaçları sıfırlandı.`, 'success');
              } else {
                alert(res.error || 'Haklar yenilenemedi.');
              }
            } finally {
              resetBtn.disabled = false;
            }
          }
        });
      }

      const deleteBtn = tr.querySelector('.btn-delete-user');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          if (confirm(`"${u.username}" kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?`)) {
            deleteBtn.disabled = true;
            try {
              const res = await window.authManager.deleteUserAsync(u.id);
              if (res.ok) {
                renderUsersManagementTab();
                showToast('Kullanıcı Silindi', `"${u.username}" hesabı kaldırıldı.`, 'info');
              } else {
                alert(res.error);
              }
            } finally {
              deleteBtn.disabled = false;
            }
          }
        });
      }

      usersTableTbody.appendChild(tr);
    });
  }

  function syncUserModalLimitVisibility() {
    if (userScheduleLimitWrap && userScheduleMode) {
      userScheduleLimitWrap.style.display = userScheduleMode.value === 'limited' ? 'inline-flex' : 'none';
    }
    if (userExportLimitWrap && userExportMode) {
      userExportLimitWrap.style.display = userExportMode.value === 'limited' ? 'inline-flex' : 'none';
    }
    if (userExpiryMode) {
      if (userExpiryDurationWrap) {
        userExpiryDurationWrap.style.display = userExpiryMode.value === 'duration' ? 'flex' : 'none';
      }
      if (userExpiryDateWrap) {
        userExpiryDateWrap.style.display = userExpiryMode.value === 'until_date' ? 'flex' : 'none';
      }
    }
  }

  function openUserModal(userToEdit = null) {
    if (!window.authManager || !window.authManager.isAdmin() || !modalUserEdit) return;
    if (userFormError) {
      userFormError.style.display = 'none';
      userFormError.textContent = '';
    }

    const isEdit = !!userToEdit;
    const isMainAdmin = isEdit && (userToEdit.role === 'admin' || userToEdit.username.toLowerCase() === 'nebi');

    if (userModalTitle) {
      userModalTitle.textContent = isEdit ? `✏️ Kullanıcı Düzenle (${userToEdit.username})` : '➕ Yeni Kullanıcı Tanımla';
    }

    userInputId.value = isEdit ? userToEdit.id : '';
    userInputUsername.value = isEdit ? userToEdit.username : '';
    userInputUsername.readOnly = isMainAdmin;
    userInputDisplayName.value = isEdit ? (userToEdit.displayName || '') : '';
    userInputPassword.value = '';
    userInputPassword.type = 'password';
    userInputPassword.required = !isEdit;

    if (userPasswordLabel) {
      userPasswordLabel.textContent = isEdit ? 'Yeni Şifre (İsteğe Bağlı):' : 'Şifre:';
    }
    if (userPasswordHint) {
      userPasswordHint.style.display = isEdit ? 'block' : 'none';
    }

    if (userRightsEditorBox) {
      userRightsEditorBox.style.display = isMainAdmin ? 'none' : 'block';
    }
    if (userAdminUnlimitedNote) {
      userAdminUnlimitedNote.style.display = isMainAdmin ? 'block' : 'none';
    }

    if (!isMainAdmin) {
      const sRight = (isEdit && userToEdit.scheduleRight) || { mode: 'limited', limit: 5, used: 0 };
      const eRight = (isEdit && userToEdit.exportRight) || { mode: 'limited', limit: 5, used: 0 };
      const expStatus = isEdit ? window.authManager.getExpiryStatus(userToEdit) : { mode: 'unlimited', expired: false, expiresAt: null };

      userScheduleMode.value = sRight.mode || 'limited';
      userScheduleLimit.value = sRight.limit > 0 ? sRight.limit : 5;
      userExportMode.value = eRight.mode || 'limited';
      userExportLimit.value = eRight.limit > 0 ? eRight.limit : 5;
      userInputActive.checked = isEdit ? userToEdit.active !== false : true;

      if (userExpiryMode) {
        if (expStatus.mode === 'limited' && expStatus.expiresAt) {
          userExpiryMode.value = 'until_date';
          if (userExpiryDatetime) userExpiryDatetime.value = toDateTimeLocalValue(expStatus.expiresAt);
          if (userExpiryCurrentInfo) {
            userExpiryCurrentInfo.style.display = 'block';
            userExpiryCurrentInfo.textContent = expStatus.expired
              ? `⛔ Mevcut süre doldu (Bitiş: ${expStatus.formattedDate}). Uzatmak için yeni süre veya tarih seçin.`
              : `⏳ Mevcut Bitiş: ${expStatus.formattedDate} (Kalan: ${expStatus.remainingLabel})`;
          }
        } else {
          userExpiryMode.value = 'unlimited';
          if (userExpiryDatetime) userExpiryDatetime.value = toDateTimeLocalValue(null);
          if (userExpiryAmount) userExpiryAmount.value = 7;
          if (userExpiryUnit) userExpiryUnit.value = 'days';
          if (userExpiryCurrentInfo) userExpiryCurrentInfo.style.display = 'none';
        }
      }

      syncUserModalLimitVisibility();
    }

    modalUserEdit.classList.add('active');
  }

  function closeUserModal() {
    if (modalUserEdit) modalUserEdit.classList.remove('active');
  }

  async function setupAuthAndUserManagement() {
    if (btnToggleLoginPass && loginPasswordInput) {
      btnToggleLoginPass.addEventListener('click', () => {
        loginPasswordInput.type = loginPasswordInput.type === 'password' ? 'text' : 'password';
      });
    }

    if (btnToggleUserPass && userInputPassword) {
      btnToggleUserPass.addEventListener('click', () => {
        userInputPassword.type = userInputPassword.type === 'password' ? 'text' : 'password';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loginErrorBox) loginErrorBox.style.display = 'none';

        if (btnLoginSubmit) {
          btnLoginSubmit.disabled = true;
          btnLoginSubmit.textContent = '⏳ Giriş yapılıyor...';
        }

        try {
          const res = await window.authManager.loginAsync(loginUsernameInput.value, loginPasswordInput.value);
          if (!res.ok) {
            if (loginErrorBox) {
              loginErrorBox.textContent = '⚠️ ' + res.error;
              loginErrorBox.style.display = 'block';
            }
            loginPasswordInput.select();
            return;
          }

          loginPasswordInput.value = '';
          wasSessionExpired = !!(res.expiryStatus && res.expiryStatus.expired);
          updateCloudStatusBadges();
          syncAuthUI();
          switchTab('tab-schedule');

          if (window.authManager.isCloudMode()) {
            await syncFromCloudAsync(true);
          }

          if (res.expiryStatus && res.expiryStatus.expired) {
            showToast('Yetki Süreniz Dolmuş ⛔', `Giriş yapıldı ancak yetki süreniz (${res.expiryStatus.formattedDate}) dolduğu için salt okunur moddasınız.`, 'error');
          } else {
            showToast('Hoş Geldiniz! 👋', `${res.user.displayName || res.user.username} olarak giriş yapıldı.`, 'success');
          }
        } finally {
          if (btnLoginSubmit) {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.textContent = '🔐 Giriş Yap';
          }
        }
      });
    }

    if (btnSyncCloud) {
      btnSyncCloud.addEventListener('click', async () => {
        if (!window.authManager || !window.authManager.isCloudMode()) return;
        btnSyncCloud.disabled = true;
        btnSyncCloud.textContent = '⏳ ...';
        try {
          await window.authManager.refreshSessionAsync();
          if (window.authManager.isAdmin()) {
            await window.authManager.refreshUsersAsync();
          }
          syncAuthUI();
          if (window.authManager.isLoggedIn()) {
            await syncFromCloudAsync(false);
          }
        } finally {
          btnSyncCloud.disabled = false;
          btnSyncCloud.textContent = '☁️ Yenile';
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', async () => {
        if (hasUnsavedChanges && !(window.authManager && window.authManager.isExpired())) {
          if (!confirm('Kaydedilmemiş değişiklikleriniz var. Çıkış yapmak istediğinize emin misiniz?')) {
            return;
          }
        }
        await window.authManager.logoutAsync();
        document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
        syncAuthUI();
      });
    }

    if (btnAddUser) btnAddUser.addEventListener('click', () => openUserModal(null));
    if (btnUserModalClose) btnUserModalClose.addEventListener('click', closeUserModal);
    if (btnUserModalCancel) btnUserModalCancel.addEventListener('click', closeUserModal);
    if (userScheduleMode) userScheduleMode.addEventListener('change', syncUserModalLimitVisibility);
    if (userExportMode) userExportMode.addEventListener('change', syncUserModalLimitVisibility);
    if (userExpiryMode) userExpiryMode.addEventListener('change', syncUserModalLimitVisibility);

    if (userEditForm) {
      userEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (userFormError) userFormError.style.display = 'none';

        const editId = userInputId.value.trim();
        const existingUser = editId ? window.authManager.getUsers().find(u => u.id === editId) : null;

        // Yetki süresi hesaplama
        let accessExpiry = { mode: 'unlimited', expiresAt: null };
        if (userExpiryMode && userExpiryMode.value === 'duration') {
          const amount = parseInt(userExpiryAmount ? userExpiryAmount.value : '1', 10);
          const unit = userExpiryUnit ? userExpiryUnit.value : 'days';
          if (!amount || amount < 1) {
            if (userFormError) {
              userFormError.textContent = '⚠️ Geçerli bir süre değeri girin (en az 1).';
              userFormError.style.display = 'block';
            }
            return;
          }
          const unitMs = unit === 'minutes' ? 60 * 1000 : (unit === 'hours' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
          accessExpiry = {
            mode: 'limited',
            expiresAt: new Date(window.authManager.getNowMs() + amount * unitMs).toISOString()
          };
        } else if (userExpiryMode && userExpiryMode.value === 'until_date') {
          const rawDt = userExpiryDatetime ? userExpiryDatetime.value : '';
          const parsedDt = rawDt ? new Date(rawDt) : null;
          if (!parsedDt || isNaN(parsedDt.getTime())) {
            if (userFormError) {
              userFormError.textContent = '⚠️ Lütfen geçerli bir bitiş tarih ve saati seçin.';
              userFormError.style.display = 'block';
            }
            return;
          }
          accessExpiry = {
            mode: 'limited',
            expiresAt: parsedDt.toISOString()
          };
        }

        const payload = {
          username: userInputUsername.value.trim(),
          displayName: userInputDisplayName.value.trim(),
          password: userInputPassword.value,
          active: userInputActive.checked,
          scheduleRight: {
            mode: userScheduleMode.value,
            limit: userScheduleMode.value === 'limited' ? Math.max(1, parseInt(userScheduleLimit.value, 10) || 1) : 0,
            used: (existingUser && existingUser.scheduleRight) ? (existingUser.scheduleRight.used || 0) : 0
          },
          exportRight: {
            mode: userExportMode.value,
            limit: userExportMode.value === 'limited' ? Math.max(1, parseInt(userExportLimit.value, 10) || 1) : 0,
            used: (existingUser && existingUser.exportRight) ? (existingUser.exportRight.used || 0) : 0
          },
          accessExpiry
        };

        const submitBtn = userEditForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ Kaydediliyor...';
        }

        try {
          const res = editId
            ? await window.authManager.updateUserAsync(editId, payload)
            : await window.authManager.createUserAsync(payload);

          if (!res.ok) {
            if (userFormError) {
              userFormError.textContent = '⚠️ ' + res.error;
              userFormError.style.display = 'block';
            }
            return;
          }

          closeUserModal();
          renderUsersManagementTab();
          syncAuthUI();
          showToast(
            editId ? 'Kullanıcı Güncellendi' : 'Yeni Kullanıcı Tanımlandı',
            window.authManager.isCloudMode()
              ? `"${res.user.username}" bulut veritabanına kaydedildi — artık tüm cihazlardan giriş yapabilir.`
              : `"${res.user.username}" hesabının yetki ve süre ayarları kaydedildi.`,
            'success'
          );
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Kullanıcıyı Kaydet';
          }
        }
      });
    }

    // Başlangıçta bulut sunucusunu (/api/health) algıla ve oturumu kontrol et
    await window.authManager.init();
    updateCloudStatusBadges();
    syncAuthUI();
    if (window.authManager.isCloudMode() && window.authManager.isLoggedIn()) {
      await syncFromCloudAsync(true);
    }

    // Canlı süre ve bulut yetki takip zamanlayıcısı (her 20 saniyede bir sunucu/süre durumunu günceller)
    setInterval(async () => {
      if (window.authManager && window.authManager.isLoggedIn()) {
        if (window.authManager.isCloudMode()) {
          await window.authManager.refreshSessionAsync();
        }
        syncAuthUI();
      }
    }, 20000);
  }

  // Başlat
  initApp();
  setupAuthAndUserManagement();
})();
