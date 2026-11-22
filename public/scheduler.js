/**
 * Pansiyon Belletmen Nöbet Dağıtım Motoru (Fair Scheduler Engine)
 * MEB Standartlarına ve Kullanıcı Kriterlerine Uygun Adil Dağıtım Algoritması
 * Kız Pansiyonu (0-3 sütun) + Erkek Pansiyonu (0-3 sütun) = En fazla 6 nöbetçi belletici sütunu
 */

class DutyScheduler {
  constructor() {
    this.turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    this.monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    this.MAX_PER_GENDER = 3; // Kız için en fazla 3, Erkek için en fazla 3
    this.MAX_DUTY_COLUMNS = 6; // Toplam en fazla 6 belletici sütunu
    this.MIN_DUTY_COLUMNS = 1;
    this.FEMALE_SLOT_IDS = ['kiz1', 'kiz2', 'kiz3'];
    this.MALE_SLOT_IDS = ['erkek1', 'erkek2', 'erkek3'];
    this.ALL_SLOT_IDS = ['kiz1', 'kiz2', 'kiz3', 'erkek1', 'erkek2', 'erkek3'];
  }

  // Varsayılan Nöbetçi Belletici Sütunları (1 Kız + 2 Erkek = 3 sütun; Kız maks. 3, Erkek maks. 3 -> Toplam maks. 6)
  getDefaultDutyColumns() {
    return [
      { id: 'kiz1', title: 'KIZ PANSİYONU', gender: 'K' },
      { id: 'erkek1', title: 'ERKEK PANSİYONU (1)', gender: 'E' },
      { id: 'erkek2', title: 'ERKEK PANSİYONU (2)', gender: 'E' }
    ];
  }

  // Kız (0..3) ve Erkek (0..3) sayılarına göre sütun listesi oluştur
  buildDutyColumns(femaleCount, maleCount, existingCols = []) {
    let fCount = Math.min(this.MAX_PER_GENDER, Math.max(0, parseInt(femaleCount, 10) || 0));
    let mCount = Math.min(this.MAX_PER_GENDER, Math.max(0, parseInt(maleCount, 10) || 0));

    if (fCount === 0 && mCount === 0) {
      fCount = 1;
    }

    const existingMap = {};
    if (Array.isArray(existingCols)) {
      existingCols.forEach(c => {
        if (c && c.id) existingMap[c.id] = c;
      });
    }

    const result = [];
    for (let i = 0; i < fCount; i++) {
      const id = this.FEMALE_SLOT_IDS[i];
      const prev = existingMap[id];
      const defaultTitle = fCount === 1 ? 'KIZ PANSİYONU' : `KIZ PANSİYONU (${i + 1})`;
      result.push({
        id,
        gender: 'K',
        title: (prev && typeof prev.title === 'string' && prev.title.trim()) ? prev.title.trim() : defaultTitle
      });
    }

    for (let i = 0; i < mCount; i++) {
      const id = this.MALE_SLOT_IDS[i];
      const prev = existingMap[id];
      const defaultTitle = mCount === 1 ? 'ERKEK PANSİYONU' : `ERKEK PANSİYONU (${i + 1})`;
      result.push({
        id,
        gender: 'E',
        title: (prev && typeof prev.title === 'string' && prev.title.trim()) ? prev.title.trim() : defaultTitle
      });
    }

    return result;
  }

  // Sütun listesini Kız (0..3) + Erkek (0..3) = toplam 1..6 sütun olarak normalize et
  normalizeDutyColumns(columns) {
    if (!Array.isArray(columns) || columns.length === 0) {
      return this.getDefaultDutyColumns();
    }

    const femaleCols = [];
    const maleCols = [];

    columns.forEach(col => {
      if (!col || typeof col !== 'object') return;
      if (col.gender === 'K' && femaleCols.length < this.MAX_PER_GENDER) {
        femaleCols.push(col);
      } else if (col.gender === 'E' && maleCols.length < this.MAX_PER_GENDER) {
        maleCols.push(col);
      } else if (col.gender !== 'K' && col.gender !== 'E') {
        // Eski 'A' veya tanımsız cinsiyetleri uygun tarafa al
        if (maleCols.length < this.MAX_PER_GENDER) {
          maleCols.push({ ...col, gender: 'E' });
        } else if (femaleCols.length < this.MAX_PER_GENDER) {
          femaleCols.push({ ...col, gender: 'K' });
        }
      }
    });

    if (femaleCols.length === 0 && maleCols.length === 0) {
      return this.getDefaultDutyColumns();
    }

    const normalized = [];
    femaleCols.forEach((col, idx) => {
      const defaultTitle = femaleCols.length === 1 ? 'KIZ PANSİYONU' : `KIZ PANSİYONU (${idx + 1})`;
      normalized.push({
        id: this.FEMALE_SLOT_IDS[idx],
        gender: 'K',
        title: (typeof col.title === 'string' && col.title.trim()) ? col.title.trim() : defaultTitle
      });
    });

    maleCols.forEach((col, idx) => {
      const defaultTitle = maleCols.length === 1 ? 'ERKEK PANSİYONU' : `ERKEK PANSİYONU (${idx + 1})`;
      normalized.push({
        id: this.MALE_SLOT_IDS[idx],
        gender: 'E',
        title: (typeof col.title === 'string' && col.title.trim()) ? col.title.trim() : defaultTitle
      });
    });

    return normalized;
  }

  // Eski kayıt formatlarından (kiz/erkek1/erkek2 veya col1/col2/col3) yeni 6 sütunlu formata (kiz1..3, erkek1..3) geçiş
  migrateDayObject(day, legacyColumns = null) {
    if (!day || typeof day !== 'object') return day;
    const migrated = { ...day };
    const oldLocked = (day.locked && typeof day.locked === 'object') ? day.locked : {};

    // 1. Orijinal şablon formatı: kiz, erkek1, erkek2
    if (migrated.kiz1 === undefined && day.kiz !== undefined) migrated.kiz1 = day.kiz;
    if (migrated.erkek1 === undefined && day.erkek1 !== undefined) migrated.erkek1 = day.erkek1;
    if (migrated.erkek2 === undefined && day.erkek2 !== undefined) migrated.erkek2 = day.erkek2;

    // 2. Ara format: col1, col2, col3
    const hasLegacyColKeys = day.col1 !== undefined || day.col2 !== undefined || day.col3 !== undefined;
    const hasNewKeys = day.kiz1 !== undefined || day.kiz2 !== undefined || day.kiz3 !== undefined ||
                       day.erkek1 !== undefined || day.erkek2 !== undefined || day.erkek3 !== undefined;

    if (hasLegacyColKeys && !hasNewKeys) {
      const refCols = Array.isArray(legacyColumns) && legacyColumns.length > 0
        ? legacyColumns
        : [
            { id: 'col1', gender: 'K' },
            { id: 'col2', gender: 'E' },
            { id: 'col3', gender: 'E' }
          ];
      let fIdx = 0;
      let mIdx = 0;
      refCols.forEach(c => {
        if (!c || !c.id) return;
        const val = day[c.id];
        const lck = !!oldLocked[c.id];
        if (c.gender === 'K' && fIdx < this.MAX_PER_GENDER) {
          const targetId = this.FEMALE_SLOT_IDS[fIdx++];
          migrated[targetId] = val !== undefined ? val : null;
          oldLocked[targetId] = lck;
        } else if (mIdx < this.MAX_PER_GENDER) {
          const targetId = this.MALE_SLOT_IDS[mIdx++];
          migrated[targetId] = val !== undefined ? val : null;
          oldLocked[targetId] = lck;
        }
      });
    }

    // Tüm 6 slot + etüt alanlarını garanti altına al
    this.ALL_SLOT_IDS.forEach(slotId => {
      if (migrated[slotId] === undefined) migrated[slotId] = null;
    });
    if (migrated.etut === undefined) migrated.etut = null;

    migrated.locked = {
      kiz1: oldLocked.kiz1 !== undefined ? !!oldLocked.kiz1 : !!oldLocked.kiz,
      kiz2: !!oldLocked.kiz2,
      kiz3: !!oldLocked.kiz3,
      erkek1: !!oldLocked.erkek1,
      erkek2: !!oldLocked.erkek2,
      erkek3: !!oldLocked.erkek3,
      etut: !!oldLocked.etut
    };

    return migrated;
  }

  // Ayın gün sayısını hesapla
  getDaysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  // Tarih formatla (YYYY-MM-DD)
  formatDateKey(year, monthIndex, day) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  // Ay takvimi oluştur
  generateMonthDays(year, monthIndex, closedDatesMap = {}) {
    const totalDays = this.getDaysInMonth(year, monthIndex);
    const days = [];

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, monthIndex, d);
      const dayOfWeek = dateObj.getDay(); // 0: Paz, 1: Pzt, ..., 6: Cmt
      const dateKey = this.formatDateKey(year, monthIndex, d);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sadece Cumartesi (6) ve Pazar (0)

      // Etüt kuralı: Cuma (5) ve Cumartesi (6) etüt olmaz, diğer günlerde (Paz, Pzt, Sal, Çar, Per) etüt olur
      const hasEtut = dayOfWeek !== 5 && dayOfWeek !== 6;

      const isClosed = !!closedDatesMap[dateKey];
      const closedReason = closedDatesMap[dateKey] || '';

      days.push({
        dayNumber: d,
        dateKey: dateKey,
        dayOfWeek: dayOfWeek,
        dayName: this.turkishDays[dayOfWeek],
        isWeekend: isWeekend,
        hasEtut: hasEtut,
        isClosed: isClosed,
        closedReason: closedReason,
        kiz1: null,
        kiz2: null,
        kiz3: null,
        erkek1: null,
        erkek2: null,
        erkek3: null,
        etut: null,
        locked: {
          kiz1: false,
          kiz2: false,
          kiz3: false,
          erkek1: false,
          erkek2: false,
          erkek3: false,
          etut: false
        }
      });
    }

    return days;
  }

  // Öğretmenin belirli bir günde nöbet tutabilme uygunluğunu kontrol et
  canTeacherWork(teacher, day, currentAssignments = {}, activeColIds = null) {
    if (!teacher || !teacher.active) return false;
    if (teacher.exempt) return false;

    // 1. Öğretmenin kapalı/mazeretli günleri
    if (teacher.blockedDates && teacher.blockedDates.includes(day.dateKey)) {
      return false;
    }

    // 2. Haftanın kapalı günleri
    if (teacher.blockedDays && teacher.blockedDays.includes(day.dayOfWeek)) {
      return false;
    }

    // 3. Aynı gün başka bir aktif göreve atanmış mı?
    const colsToCheck = Array.isArray(activeColIds) ? activeColIds : this.ALL_SLOT_IDS;
    for (let i = 0; i < colsToCheck.length; i++) {
      if (currentAssignments[colsToCheck[i]] === teacher.name) return false;
    }
    if (currentAssignments.etut === teacher.name) return false;

    return true;
  }

  /**
   * ADİL DAĞITIM ALGORİTMASI (Kız 0..3 + Erkek 0..3 = Toplam 1..6 Sütun, Kilitli Nöbetleri Koruma ve Etüt Kuralı)
   * @param {Array} days - Günler listesi
   * @param {Array} teachers - Öğretmen listesi
   * @param {Object} options - Tercihler (balanceWeekends, avoidConsecutive, enableEtut, dutyColumns)
   */
  distributeDuties(days, teachers, options = {}) {
    const {
      balanceWeekends = true,
      avoidConsecutive = true,
      enableEtut = false,
      dutyColumns = null
    } = options;

    const activeColumns = this.normalizeDutyColumns(dutyColumns);
    const activeColIds = activeColumns.map(c => c.id);

    const femaleTeachers = teachers.filter(t => t.gender === 'K' && t.active && !t.exempt);
    const maleTeachers = teachers.filter(t => t.gender === 'E' && t.active && !t.exempt);
    const etutTeachers = maleTeachers.filter(t => t.etutEligible);

    const getPoolForColumn = (col) => (col.gender === 'K' ? femaleTeachers : maleTeachers);

    // Takip sayaçları
    const stats = {};
    teachers.forEach(t => {
      stats[t.name] = {
        total: 0,
        weekend: 0,
        weekday: 0,
        etut: 0,
        lastAssignedDay: -99
      };
    });

    // Sonuç gün kopyaları - Kilitli (sabitlenmiş) nöbetleri koru, pasif sütunları temizle
    const resultDays = days.map(rawDay => {
      const d = this.migrateDayObject(rawDay);
      const locked = d.locked || {};
      const nextDay = {
        ...d,
        locked: {
          kiz1: false, kiz2: false, kiz3: false,
          erkek1: false, erkek2: false, erkek3: false,
          etut: !!locked.etut
        },
        kiz1: null, kiz2: null, kiz3: null,
        erkek1: null, erkek2: null, erkek3: null,
        etut: locked.etut ? d.etut : (enableEtut ? null : d.etut)
      };

      activeColIds.forEach(colId => {
        nextDay.locked[colId] = !!locked[colId];
        nextDay[colId] = locked[colId] ? d[colId] : null;
      });

      return nextDay;
    });

    // 0. ADIM: Kilitli olan önceden yerleştirilmiş nöbetleri sayaçlara işle
    for (let i = 0; i < resultDays.length; i++) {
      const day = resultDays[i];
      if (day.isClosed) continue;
      const locked = day.locked || {};

      [...activeColIds, 'etut'].forEach(role => {
        if (locked[role] && day[role]) {
          const tName = day[role];
          if (stats[tName]) {
            if (role === 'etut') {
              stats[tName].etut++;
            } else {
              stats[tName].total++;
              if (day.isWeekend) stats[tName].weekend++;
              else stats[tName].weekday++;
            }
            stats[tName].lastAssignedDay = day.dayNumber;
          }
        }
      });
    }

    // Yardımcı: Adaylar arasından en uygun ve en adil öğretmeni seç
    const pickBestCandidate = (candidates, day, currentDaily, isWeekendDuty = false) => {
      const eligible = candidates.filter(t => this.canTeacherWork(t, day, currentDaily, activeColIds));
      if (eligible.length === 0) return null;

      eligible.sort((a, b) => {
        const sA = stats[a.name];
        const sB = stats[b.name];

        let scoreA = sA.total * 10;
        let scoreB = sB.total * 10;

        if (balanceWeekends && isWeekendDuty) {
          scoreA += sA.weekend * 15;
          scoreB += sB.weekend * 15;
        }

        if (avoidConsecutive) {
          if (sA.lastAssignedDay === day.dayNumber - 1) scoreA += 100;
          if (sB.lastAssignedDay === day.dayNumber - 1) scoreB += 100;

          if (sA.lastAssignedDay === day.dayNumber - 2) scoreA += 20;
          if (sB.lastAssignedDay === day.dayNumber - 2) scoreB += 20;
        }

        scoreA += Math.random() * 0.5;
        scoreB += Math.random() * 0.5;

        return scoreA - scoreB;
      });

      return eligible[0];
    };

    // 1. ADIM: Açık günleri gez ve KİLİTLİ OLMAYAN aktif sütun nöbetlerini doldur
    for (let i = 0; i < resultDays.length; i++) {
      const day = resultDays[i];
      if (day.isClosed) continue;
      const locked = day.locked || {};

      const daily = {
        kiz1: day.kiz1, kiz2: day.kiz2, kiz3: day.kiz3,
        erkek1: day.erkek1, erkek2: day.erkek2, erkek3: day.erkek3,
        etut: day.etut
      };

      // Kız (0..3) ve Erkek (0..3) aktif sütunlarını sırayla doldur
      for (let cIdx = 0; cIdx < activeColumns.length; cIdx++) {
        const col = activeColumns[cIdx];
        const colId = col.id;
        if (!locked[colId] || !daily[colId]) {
          const pool = getPoolForColumn(col);
          const bestTeacher = pickBestCandidate(pool, day, daily, day.isWeekend);
          if (bestTeacher) {
            daily[colId] = bestTeacher.name;
            stats[bestTeacher.name].total++;
            if (day.isWeekend) stats[bestTeacher.name].weekend++;
            else stats[bestTeacher.name].weekday++;
            stats[bestTeacher.name].lastAssignedDay = day.dayNumber;
          }
        }
      }

      // ETÜT NÖBETİ
      if (enableEtut && day.hasEtut) {
        if (!locked.etut || !daily.etut) {
          const etutPool = etutTeachers.length > 0 ? etutTeachers : maleTeachers;
          const bestEtut = pickBestCandidate(etutPool, day, daily, false);
          if (bestEtut) {
            daily.etut = bestEtut.name;
            stats[bestEtut.name].etut++;
            stats[bestEtut.name].lastAssignedDay = day.dayNumber;
          }
        }
      }

      this.ALL_SLOT_IDS.forEach(slotId => {
        day[slotId] = daily[slotId];
      });
      day.etut = daily.etut;
    }

    return {
      days: resultDays,
      stats: this.calculateRosterStats(resultDays, teachers, activeColumns)
    };
  }

  // Çizelgeden istatistikleri hesapla (Sadece aktif sütunlar + etüt)
  calculateRosterStats(days, teachers, dutyColumns = null) {
    const activeColumns = this.normalizeDutyColumns(dutyColumns);
    const activeColIds = activeColumns.map(c => c.id);
    const stats = {};

    teachers.forEach(t => {
      stats[t.name] = {
        name: t.name,
        gender: t.gender,
        active: t.active,
        exempt: t.exempt,
        weekday: 0,
        weekend: 0,
        etut: 0,
        totalDuties: 0,
        totalPoints: 0
      };
    });

    days.forEach(rawDay => {
      const d = this.migrateDayObject(rawDay);
      if (d.isClosed) return;

      const assignees = activeColIds.map(colId => ({ name: d[colId], isEtut: false }));
      assignees.push({ name: d.etut, isEtut: true });

      assignees.forEach(a => {
        if (!a.name) return;
        if (!stats[a.name]) {
          stats[a.name] = {
            name: a.name,
            gender: 'E',
            active: true,
            exempt: false,
            weekday: 0,
            weekend: 0,
            etut: 0,
            totalDuties: 0,
            totalPoints: 0
          };
        }

        const tStat = stats[a.name];
        if (a.isEtut) {
          tStat.etut++;
        } else {
          tStat.totalDuties++;
          if (d.isWeekend) {
            tStat.weekend++;
          } else {
            tStat.weekday++;
          }
        }
      });
    });

    // Puan hesapla (MEB formülü: Nöbet + Etüt/2)
    Object.values(stats).forEach(s => {
      s.totalPoints = s.totalDuties + (s.etut / 2);
    });

    return stats;
  }

  // Varsayılan Öğretmen Kadrosu (2026 KASIM AYI.xlsx dosyasından alınmış orijinal kadro)
  getDefaultTeachers() {
    return [
      // KIZ PANSİYONU (8 Öğretmen)
      { id: 'f1', name: 'SERPİL KARABULUT', gender: 'K', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'f2', name: 'DUYSAL ÇELİK', gender: 'K', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'f3', name: 'FADİME NUR GÜÇLÜ', gender: 'K', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'f4', name: 'ŞÜKRİYE KANTAROĞLU', gender: 'K', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'f5', name: 'SEMA BAŞ', gender: 'K', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'f6', name: 'GÜLSÜM KAMBEROĞLU', gender: 'K', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'f7', name: 'GÖZDE DEMİR', gender: 'K', etutEligible: false, active: false, exempt: true, blockedDates: [], blockedDays: [] },
      { id: 'f8', name: 'Sena SEZGİN KÜÇÜK', gender: 'K', etutEligible: false, active: false, exempt: true, blockedDates: [], blockedDays: [] },

      // ERKEK PANSİYONU (16 Öğretmen)
      { id: 'm1', name: 'M. BURAK KARABULUT', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm2', name: 'H. HÜSEYİN İŞLER', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm3', name: 'ALİ ENES ÖZSOY', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm4', name: 'HAYRULLAH YILDIRIM', gender: 'E', etutEligible: true, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm5', name: 'HÜSEYİN SOYER', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm6', name: 'ONUR KILIÇ', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm7', name: 'BURAK AŞCI', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm8', name: 'NEBİ DEMİR', gender: 'E', etutEligible: true, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm9', name: 'SAMET CAN DOĞAN', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm10', name: 'MEHMET DEMİREL', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm11', name: 'GAFFAR KESKİN', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm12', name: 'AŞKIN MUTLU', gender: 'E', etutEligible: true, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm13', name: 'BAYRAM TEMUR', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm14', name: 'AHMET KÜLCÜ', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm15', name: 'YÜCEL DOĞUKAN GÖKALP', gender: 'E', etutEligible: false, active: true, exempt: false, blockedDates: [], blockedDays: [] },
      { id: 'm16', name: 'YUNUS DİKİLİTAŞ', gender: 'E', etutEligible: false, active: false, exempt: true, blockedDates: [], blockedDays: [] }
    ];
  }

  // Varsayılan Tatil Günleri (Kasım 2026 Ara Tatili: 14 - 21 Kasım)
  getDefaultClosedDates(year = 2026, monthIndex = 10) {
    const closed = {};
    if (year === 2026 && monthIndex === 10) {
      for (let d = 14; d <= 21; d++) {
        closed[this.formatDateKey(2026, 10, d)] = 'ARA TATİL';
      }
    }
    return closed;
  }
}

if (typeof window !== 'undefined') window.dutyScheduler = new DutyScheduler();
if (typeof module !== 'undefined' && module.exports) module.exports = DutyScheduler;
