/**
 * Kullanıcı Giriş, Yetki, Hak, Süre ve Bulut Veritabanı Yönetim Modülü (Cloud-First Auth Manager)
 * - Netlify Functions + Netlify Blobs (/api/*) tespit edildiğinde otomatik Merkezi Bulut Modu'nda çalışır
 *   (Tüm cihazlarda ortak kullanıcılar, ortak nöbet veritabanı, sunucu saati ile süre kilidi).
 * - Çevrimdışı / yerel masaüstü (.exe) ortamında otomatik Yerel Mod'a düşer.
 * Ana Yönetici: nebi (Şifre: Nebi123. — Sınırsız ve Süresiz Yetki)
 */

(() => {
  const USERS_STORAGE_KEY = 'pansiyon_nobet_users_v1';
  const SESSION_STORAGE_KEY = 'pansiyon_nobet_session_v1';
  const CLOUD_TOKEN_KEY = 'pansiyon_nobet_cloud_token_v1';

  const DEFAULT_ADMIN = {
    id: 'admin_nebi',
    username: 'nebi',
    displayName: 'Nebi (Ana Yönetici)',
    password: 'Nebi123.',
    role: 'admin',
    active: true,
    scheduleRight: { mode: 'unlimited', limit: 0, used: 0 },
    exportRight: { mode: 'unlimited', limit: 0, used: 0 },
    accessExpiry: { mode: 'unlimited', expiresAt: null },
    createdAt: '2026-01-01T00:00:00.000Z'
  };

  function normalizeRight(right, isAdminUser = false) {
    if (isAdminUser) {
      return { mode: 'unlimited', limit: 0, used: 0 };
    }
    if (!right || typeof right !== 'object') {
      return { mode: 'none', limit: 0, used: 0 };
    }
    const mode = (right.mode === 'unlimited' || right.mode === 'limited' || right.mode === 'none')
      ? right.mode
      : 'none';
    const limit = Math.max(0, parseInt(right.limit, 10) || 0);
    const used = Math.max(0, parseInt(right.used, 10) || 0);
    return { mode, limit, used };
  }

  function normalizeExpiry(expiry, isAdminUser = false) {
    if (isAdminUser) {
      return { mode: 'unlimited', expiresAt: null };
    }
    if (!expiry || typeof expiry !== 'object' || expiry.mode === 'unlimited' || !expiry.expiresAt) {
      return { mode: 'unlimited', expiresAt: null };
    }
    const ts = Date.parse(expiry.expiresAt);
    if (isNaN(ts)) {
      return { mode: 'unlimited', expiresAt: null };
    }
    return {
      mode: 'limited',
      expiresAt: new Date(ts).toISOString()
    };
  }

  function formatDateTimeTR(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  }

  function formatRemainingTR(ms) {
    if (ms <= 0) return 'Süresi Doldu';
    const totalMinutes = Math.ceil(ms / 60000);
    if (totalMinutes < 60) {
      return `${totalMinutes} dk`;
    }
    const totalHours = Math.floor(totalMinutes / 60);
    const remMins = totalMinutes % 60;
    if (totalHours < 24) {
      return remMins > 0 ? `${totalHours} sa ${remMins} dk` : `${totalHours} saat`;
    }
    const days = Math.floor(totalHours / 24);
    const remHours = totalHours % 24;
    return remHours > 0 ? `${days} gün ${remHours} sa` : `${days} gün`;
  }

  function normalizeUser(u) {
    const isMainAdmin = u && typeof u.username === 'string' && u.username.trim().toLowerCase() === 'nebi';
    const isAdminUser = isMainAdmin || (u && u.role === 'admin');
    return {
      id: (u && u.id) || (isMainAdmin ? DEFAULT_ADMIN.id : 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
      username: isMainAdmin ? 'nebi' : String((u && u.username) || '').trim(),
      displayName: String((u && u.displayName) || (isMainAdmin ? DEFAULT_ADMIN.displayName : (u && u.username) || '')).trim(),
      password: String((u && u.password) !== undefined ? u.password : (isMainAdmin ? DEFAULT_ADMIN.password : '')),
      role: isAdminUser ? 'admin' : 'user',
      active: isMainAdmin ? true : (u ? u.active !== false : true),
      scheduleRight: normalizeRight(u && u.scheduleRight, isAdminUser),
      exportRight: normalizeRight(u && u.exportRight, isAdminUser),
      accessExpiry: normalizeExpiry(u && u.accessExpiry, isAdminUser),
      createdAt: (u && u.createdAt) || new Date().toISOString()
    };
  }

  class AuthManager {
    constructor() {
      this.cloudMode = false;
      this.initialized = false;
      this.apiBase = (typeof window !== 'undefined' && typeof window.CLOUD_API_BASE === 'string')
        ? window.CLOUD_API_BASE.replace(/\/+$/, '')
        : '';
      this.cloudUser = null;
      this.cloudUsers = [];
      this.serverClockOffsetMs = 0;
      this.ensureDefaultAdminLocal();
    }

    isCloudMode() {
      return this.cloudMode;
    }

    getNowMs() {
      return Date.now() + (this.cloudMode ? this.serverClockOffsetMs : 0);
    }

    syncServerClock(serverTimeIso) {
      if (!serverTimeIso) return;
      const serverMs = Date.parse(serverTimeIso);
      if (!isNaN(serverMs)) {
        this.serverClockOffsetMs = serverMs - Date.now();
      }
    }

    getCloudToken() {
      try {
        return sessionStorage.getItem(CLOUD_TOKEN_KEY) || '';
      } catch {
        return '';
      }
    }

    setCloudToken(token) {
      try {
        if (token) sessionStorage.setItem(CLOUD_TOKEN_KEY, token);
        else sessionStorage.removeItem(CLOUD_TOKEN_KEY);
      } catch {
        // ignore
      }
    }

    async apiFetch(path, options = {}) {
      const url = `${this.apiBase}/api/${path.replace(/^\/+/, '')}`;
      const headers = {
        'Accept': 'application/json',
        ...(options.headers || {})
      };

      if (options.body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }

      const token = this.getCloudToken();
      if (token && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutMs = options.timeoutMs || 12000;
      const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

      try {
        const res = await fetch(url, {
          method: options.method || 'GET',
          headers,
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
          cache: 'no-store',
          signal: controller ? controller.signal : undefined
        });

        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (data && data.serverTime) {
          this.syncServerClock(data.serverTime);
        }

        return { ok: res.ok && !!(data && data.ok !== false), status: res.status, data };
      } catch (err) {
        return { ok: false, status: 0, networkError: true, error: err && err.message ? err.message : 'Bağlantı hatası' };
      } finally {
        if (timer) clearTimeout(timer);
      }
    }

    // Uygulama başlangıcında Merkezi Bulut Sunucusu (/api/health) olup olmadığını algıla
    async init() {
      const canProbeCloud =
        Boolean(this.apiBase) ||
        (typeof window !== 'undefined' &&
          (window.location.protocol === 'https:' || window.location.protocol === 'http:') &&
          window.location.hostname !== 'pansiyon.app');

      if (canProbeCloud) {
        const health = await this.apiFetch('health', { skipAuth: true, timeoutMs: 6000 });
        if (health.ok && health.data && health.data.mode === 'cloud') {
          this.cloudMode = true;
          if (this.getCloudToken()) {
            await this.refreshSessionAsync();
            if (this.isAdmin()) {
              await this.refreshUsersAsync();
            }
          }
          this.initialized = true;
          return { mode: 'cloud', user: this.cloudUser };
        }
      }

      this.cloudMode = false;
      this.initialized = true;
      return { mode: 'local', user: this.getCurrentUser() };
    }

    // ================= YEREL MOD DEPOLAMA =================
    loadUsersLocal() {
      let users = [];
      try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            users = parsed.map(normalizeUser).filter(u => u.username);
          }
        }
      } catch (e) {
        console.warn('Kullanıcı listesi okunamadı:', e);
      }

      const hasNebi = users.some(u => u.username.toLowerCase() === 'nebi');
      if (!hasNebi) {
        users.unshift(normalizeUser({ ...DEFAULT_ADMIN }));
        this.saveUsersLocal(users);
      } else {
        users = users.map(u => {
          if (u.username.toLowerCase() === 'nebi') {
            return normalizeUser({
              ...u,
              id: DEFAULT_ADMIN.id,
              username: 'nebi',
              role: 'admin',
              active: true,
              scheduleRight: { mode: 'unlimited', limit: 0, used: 0 },
              exportRight: { mode: 'unlimited', limit: 0, used: 0 },
              accessExpiry: { mode: 'unlimited', expiresAt: null }
            });
          }
          return u;
        });
      }

      return users;
    }

    saveUsersLocal(users) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
      } catch (e) {
        console.warn('Kullanıcı listesi kaydedilemedi:', e);
        return false;
      }
    }

    ensureDefaultAdminLocal() {
      const users = this.loadUsersLocal();
      this.saveUsersLocal(users);
    }

    // ================= ORTAK SENKRON OKUYUCULAR =================
    getUsers() {
      if (this.cloudMode) {
        return this.cloudUsers.map(normalizeUser);
      }
      return this.loadUsersLocal();
    }

    getCurrentUser() {
      if (this.cloudMode) {
        return this.cloudUser ? normalizeUser(this.cloudUser) : null;
      }
      try {
        const sessionUserId = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!sessionUserId) return null;
        const users = this.loadUsersLocal();
        const found = users.find(u => u.id === sessionUserId);
        if (!found || !found.active) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          return null;
        }
        return found;
      } catch {
        return null;
      }
    }

    isLoggedIn() {
      return !!this.getCurrentUser();
    }

    isAdmin(user = null) {
      const target = user || this.getCurrentUser();
      return !!(target && target.role === 'admin');
    }

    getExpiryStatus(user = null) {
      const target = user || this.getCurrentUser();
      if (!target) {
        return { mode: 'none', expired: true, expiresAt: null, formattedDate: '', remainingMs: 0, remainingLabel: 'Giriş Yok' };
      }

      if (this.isAdmin(target)) {
        return { mode: 'unlimited', expired: false, expiresAt: null, formattedDate: '', remainingMs: Infinity, remainingLabel: 'Süresiz' };
      }

      const exp = normalizeExpiry(target.accessExpiry, false);
      if (exp.mode !== 'limited' || !exp.expiresAt) {
        return { mode: 'unlimited', expired: false, expiresAt: null, formattedDate: '', remainingMs: Infinity, remainingLabel: 'Süresiz' };
      }

      const endMs = Date.parse(exp.expiresAt);
      const remainingMs = endMs - this.getNowMs();
      const expired = remainingMs <= 0;

      return {
        mode: 'limited',
        expired,
        expiresAt: exp.expiresAt,
        formattedDate: formatDateTimeTR(exp.expiresAt),
        remainingMs: Math.max(0, remainingMs),
        remainingLabel: expired ? 'Süresi Doldu' : formatRemainingTR(remainingMs)
      };
    }

    isExpired(user = null) {
      const target = user || this.getCurrentUser();
      if (!target) return false;
      return this.getExpiryStatus(target).expired;
    }

    canModify(user = null) {
      const target = user || this.getCurrentUser();
      if (!target) return false;
      if (this.isAdmin(target)) return true;
      return !this.isExpired(target);
    }

    getRightStatus(type, user = null) {
      const target = user || this.getCurrentUser();
      if (!target) {
        return { allowed: false, mode: 'none', remaining: 0, limit: 0, used: 0, expired: false, label: 'Giriş Yok' };
      }

      if (this.isAdmin(target)) {
        return { allowed: true, mode: 'unlimited', remaining: Infinity, limit: Infinity, used: 0, expired: false, label: 'Sınırsız' };
      }

      const expStatus = this.getExpiryStatus(target);
      const right = type === 'schedule' ? target.scheduleRight : target.exportRight;
      const norm = normalizeRight(right, false);

      if (expStatus.expired) {
        return {
          allowed: false,
          mode: norm.mode,
          remaining: norm.mode === 'limited' ? Math.max(0, norm.limit - norm.used) : 0,
          limit: norm.limit,
          used: norm.used,
          expired: true,
          expiresAt: expStatus.formattedDate,
          label: 'Süresi Doldu'
        };
      }

      if (norm.mode === 'unlimited') {
        return { allowed: true, mode: 'unlimited', remaining: Infinity, limit: Infinity, used: norm.used, expired: false, label: 'Sınırsız' };
      }

      if (norm.mode === 'limited') {
        const remaining = Math.max(0, norm.limit - norm.used);
        return {
          allowed: remaining > 0,
          mode: 'limited',
          remaining,
          limit: norm.limit,
          used: norm.used,
          expired: false,
          label: `${remaining} / ${norm.limit} Hak`
        };
      }

      return { allowed: false, mode: 'none', remaining: 0, limit: 0, used: norm.used, expired: false, label: 'Kapalı' };
    }

    canSchedule(user = null) {
      return this.getRightStatus('schedule', user).allowed;
    }

    canExport(user = null) {
      return this.getRightStatus('export', user).allowed;
    }

    // ================= ASENKRON İŞLEMLER (BULUT + YEREL DESTEKLİ) =================
    async loginAsync(username, password) {
      if (this.cloudMode) {
        const res = await this.apiFetch('auth/login', {
          method: 'POST',
          skipAuth: true,
          body: { username, password }
        });
        if (!res.ok) {
          return {
            ok: false,
            error: (res.data && res.data.error) || 'Bulut sunucusuna bağlanılamadı. İnternet bağlantınızı kontrol edin.'
          };
        }
        this.setCloudToken(res.data.token);
        this.cloudUser = normalizeUser(res.data.user);
        if (this.isAdmin(this.cloudUser)) {
          await this.refreshUsersAsync();
        }
        return {
          ok: true,
          user: this.cloudUser,
          expiryStatus: this.getExpiryStatus(this.cloudUser)
        };
      }

      // Yerel mod girişi
      const cleanUser = String(username || '').trim();
      const rawPass = String(password || '');
      if (!cleanUser || !rawPass) {
        return { ok: false, error: 'Lütfen kullanıcı adı ve şifre girin.' };
      }
      const users = this.loadUsersLocal();
      const found = users.find(u => u.username.toLocaleLowerCase('tr') === cleanUser.toLocaleLowerCase('tr'));
      if (!found || found.password !== rawPass) {
        return { ok: false, error: 'Kullanıcı adı veya şifre hatalı!' };
      }
      if (!found.active) {
        return { ok: false, error: 'Bu kullanıcı hesabı pasif durumdadır. Yönetici (nebi) ile iletişime geçin.' };
      }
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, found.id);
      } catch {
        // ignore
      }
      return { ok: true, user: found, expiryStatus: this.getExpiryStatus(found) };
    }

    async logoutAsync() {
      if (this.cloudMode) {
        try {
          await this.apiFetch('auth/logout', { method: 'POST' });
        } catch {
          // ignore
        }
        this.setCloudToken('');
        this.cloudUser = null;
        this.cloudUsers = [];
      }
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // ignore
      }
    }

    async refreshSessionAsync() {
      if (!this.cloudMode) return this.getCurrentUser();
      if (!this.getCloudToken()) {
        this.cloudUser = null;
        return null;
      }
      const res = await this.apiFetch('auth/me', { method: 'GET' });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          this.setCloudToken('');
          this.cloudUser = null;
          this.cloudUsers = [];
        }
        return this.cloudUser;
      }
      this.cloudUser = normalizeUser(res.data.user);
      return this.cloudUser;
    }

    async refreshUsersAsync() {
      if (!this.cloudMode) return this.loadUsersLocal();
      if (!this.isAdmin()) return [];
      const res = await this.apiFetch('users', { method: 'GET' });
      if (res.ok && Array.isArray(res.data.users)) {
        this.cloudUsers = res.data.users.map(normalizeUser);
      }
      return this.cloudUsers;
    }

    async consumeRightAsync(type) {
      if (this.cloudMode) {
        const res = await this.apiFetch('rights/consume', {
          method: 'POST',
          body: { type }
        });
        if (!res.ok) {
          if (res.status === 401) {
            this.setCloudToken('');
            this.cloudUser = null;
          }
          return {
            ok: false,
            expired: !!(res.data && res.data.expired),
            error: (res.data && res.data.error) || 'İşlem yetkisi doğrulanamadı.'
          };
        }
        if (res.data && res.data.user) {
          this.cloudUser = normalizeUser(res.data.user);
        }
        return res.data;
      }

      // Yerel mod hak tüketimi
      const current = this.getCurrentUser();
      if (!current) return { ok: false, error: 'İşlem yapabilmek için oturum açmalısınız.' };
      if (this.isAdmin(current)) return { ok: true, unlimited: true };

      const expStatus = this.getExpiryStatus(current);
      if (expStatus.expired) {
        return {
          ok: false,
          expired: true,
          error: `Yetki süreniz (${expStatus.formattedDate}) dolmuştur. Hiçbir değişiklik veya işlem yapamazsınız. Süre uzatmak için ana yönetici (nebi) ile iletişime geçin.`
        };
      }

      const users = this.loadUsersLocal();
      const idx = users.findIndex(u => u.id === current.id);
      if (idx === -1) return { ok: false, error: 'Kullanıcı kaydı bulunamadı.' };

      const rightProp = type === 'schedule' ? 'scheduleRight' : 'exportRight';
      const rightLabel = type === 'schedule' ? 'Yeni nöbet hazırlama' : 'Çıktı alma (PDF / Excel / Yazdır)';
      const r = normalizeRight(users[idx][rightProp], false);

      if (r.mode === 'none') {
        return { ok: false, error: `${rightLabel} yetkiniz bulunmamaktadır. Lütfen ana yönetici (nebi) ile iletişime geçin.` };
      }
      if (r.mode === 'unlimited') {
        r.used = (r.used || 0) + 1;
        users[idx][rightProp] = r;
        this.saveUsersLocal(users);
        return { ok: true, unlimited: true, used: r.used };
      }
      const remainingBefore = Math.max(0, r.limit - r.used);
      if (remainingBefore <= 0) {
        return { ok: false, error: `${rightLabel} hakkınız dolmuştur (0 / ${r.limit}). Yeni hak tanımlanması için ana yönetici (nebi) ile iletişime geçin.` };
      }
      r.used += 1;
      users[idx][rightProp] = r;
      this.saveUsersLocal(users);
      return { ok: true, unlimited: false, remaining: Math.max(0, r.limit - r.used), limit: r.limit, used: r.used };
    }

    async createUserAsync(payload) {
      if (this.cloudMode) {
        const res = await this.apiFetch('users/create', { method: 'POST', body: payload });
        if (!res.ok) {
          return { ok: false, error: (res.data && res.data.error) || 'Kullanıcı oluşturulamadı.' };
        }
        if (Array.isArray(res.data.users)) {
          this.cloudUsers = res.data.users.map(normalizeUser);
        }
        return { ok: true, user: normalizeUser(res.data.user) };
      }

      if (!this.isAdmin()) return { ok: false, error: 'Bu işlem için ana yönetici (nebi) yetkisi gereklidir.' };
      const username = String((payload && payload.username) || '').trim();
      const password = String((payload && payload.password) || '');
      const displayName = String((payload && payload.displayName) || username).trim();
      if (!username || username.length < 2) return { ok: false, error: 'Kullanıcı adı en az 2 karakter olmalıdır.' };
      if (/\s/.test(username)) return { ok: false, error: 'Kullanıcı adında boşluk bulunamaz.' };
      if (!password || password.length < 3) return { ok: false, error: 'Şifre en az 3 karakter olmalıdır.' };

      const users = this.loadUsersLocal();
      if (users.some(u => u.username.toLocaleLowerCase('tr') === username.toLocaleLowerCase('tr'))) {
        return { ok: false, error: `"${username}" kullanıcı adı zaten kayıtlı.` };
      }
      const newUser = normalizeUser({
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        username,
        displayName,
        password,
        role: 'user',
        active: payload.active !== false,
        scheduleRight: normalizeRight(payload.scheduleRight, false),
        exportRight: normalizeRight(payload.exportRight, false),
        accessExpiry: normalizeExpiry(payload.accessExpiry, false),
        createdAt: new Date().toISOString()
      });
      users.push(newUser);
      this.saveUsersLocal(users);
      return { ok: true, user: newUser };
    }

    async updateUserAsync(userId, payload) {
      if (this.cloudMode) {
        const res = await this.apiFetch('users/update', { method: 'POST', body: { ...payload, id: userId } });
        if (!res.ok) {
          return { ok: false, error: (res.data && res.data.error) || 'Kullanıcı güncellenemedi.' };
        }
        if (Array.isArray(res.data.users)) {
          this.cloudUsers = res.data.users.map(normalizeUser);
        }
        if (this.cloudUser && this.cloudUser.id === userId && res.data.user) {
          this.cloudUser = normalizeUser(res.data.user);
        }
        return { ok: true, user: normalizeUser(res.data.user) };
      }

      if (!this.isAdmin()) return { ok: false, error: 'Bu işlem için ana yönetici (nebi) yetkisi gereklidir.' };
      const users = this.loadUsersLocal();
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' };
      const existing = users[idx];
      const isMainAdmin = existing.username.toLowerCase() === 'nebi';

      let nextUsername = existing.username;
      if (!isMainAdmin && payload.username !== undefined) {
        const candidate = String(payload.username || '').trim();
        if (!candidate || candidate.length < 2) return { ok: false, error: 'Kullanıcı adı en az 2 karakter olmalıdır.' };
        if (/\s/.test(candidate)) return { ok: false, error: 'Kullanıcı adında boşluk bulunamaz.' };
        if (users.some((u, i) => i !== idx && u.username.toLocaleLowerCase('tr') === candidate.toLocaleLowerCase('tr'))) {
          return { ok: false, error: `"${candidate}" kullanıcı adı başka bir hesapta kullanılıyor.` };
        }
        nextUsername = candidate;
      }

      const nextPassword = (payload.password !== undefined && String(payload.password).length > 0)
        ? String(payload.password)
        : existing.password;
      if (nextPassword.length < 3) return { ok: false, error: 'Şifre en az 3 karakter olmalıdır.' };

      const updated = normalizeUser({
        ...existing,
        username: nextUsername,
        displayName: payload.displayName !== undefined ? String(payload.displayName).trim() || nextUsername : existing.displayName,
        password: nextPassword,
        role: isMainAdmin ? 'admin' : 'user',
        active: isMainAdmin ? true : (payload.active !== undefined ? !!payload.active : existing.active),
        scheduleRight: isMainAdmin
          ? { mode: 'unlimited', limit: 0, used: 0 }
          : normalizeRight(payload.scheduleRight !== undefined ? payload.scheduleRight : existing.scheduleRight, false),
        exportRight: isMainAdmin
          ? { mode: 'unlimited', limit: 0, used: 0 }
          : normalizeRight(payload.exportRight !== undefined ? payload.exportRight : existing.exportRight, false),
        accessExpiry: isMainAdmin
          ? { mode: 'unlimited', expiresAt: null }
          : normalizeExpiry(payload.accessExpiry !== undefined ? payload.accessExpiry : existing.accessExpiry, false)
      });
      users[idx] = updated;
      this.saveUsersLocal(users);
      return { ok: true, user: updated };
    }

    async resetUserUsageAsync(userId) {
      if (this.cloudMode) {
        const res = await this.apiFetch('users/reset', { method: 'POST', body: { id: userId } });
        if (!res.ok) return { ok: false, error: (res.data && res.data.error) || 'Haklar sıfırlanamadı.' };
        if (Array.isArray(res.data.users)) {
          this.cloudUsers = res.data.users.map(normalizeUser);
        }
        return { ok: true, user: normalizeUser(res.data.user) };
      }

      if (!this.isAdmin()) return { ok: false, error: 'Bu işlem için ana yönetici yetkisi gereklidir.' };
      const users = this.loadUsersLocal();
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' };
      if (users[idx].scheduleRight) users[idx].scheduleRight.used = 0;
      if (users[idx].exportRight) users[idx].exportRight.used = 0;
      this.saveUsersLocal(users);
      return { ok: true, user: users[idx] };
    }

    async deleteUserAsync(userId) {
      if (this.cloudMode) {
        const res = await this.apiFetch('users/delete', { method: 'POST', body: { id: userId } });
        if (!res.ok) return { ok: false, error: (res.data && res.data.error) || 'Kullanıcı silinemedi.' };
        if (Array.isArray(res.data.users)) {
          this.cloudUsers = res.data.users.map(normalizeUser);
        }
        return { ok: true };
      }

      if (!this.isAdmin()) return { ok: false, error: 'Bu işlem için ana yönetici yetkisi gereklidir.' };
      const users = this.loadUsersLocal();
      const target = users.find(u => u.id === userId);
      if (!target) return { ok: false, error: 'Kullanıcı bulunamadı.' };
      if (target.username.toLowerCase() === 'nebi' || target.role === 'admin') {
        return { ok: false, error: 'Ana yönetici (nebi) hesabı silinemez.' };
      }
      this.saveUsersLocal(users.filter(u => u.id !== userId));
      return { ok: true };
    }

    // ================= ORTAK BULUT NÖBET VERİTABANI =================
    async loadCloudDataAsync() {
      if (!this.cloudMode || !this.isLoggedIn()) {
        return { ok: false, data: null };
      }
      const res = await this.apiFetch('data/load', { method: 'GET' });
      if (!res.ok) {
        return { ok: false, data: null, error: (res.data && res.data.error) || 'Bulut verisi yüklenemedi.' };
      }
      return { ok: true, data: res.data ? res.data.data : null };
    }

    async saveCloudDataAsync(data) {
      if (!this.cloudMode || !this.isLoggedIn()) {
        return { ok: false, skipped: true };
      }
      const res = await this.apiFetch('data/save', {
        method: 'POST',
        body: { data }
      });
      if (!res.ok) {
        return {
          ok: false,
          expired: !!(res.data && res.data.expired),
          error: (res.data && res.data.error) || 'Bulut veritabanına kaydedilemedi.'
        };
      }
      return {
        ok: true,
        savedBy: res.data && res.data.savedBy,
        serverSavedAt: res.data && res.data.serverSavedAt
      };
    }
  }

  window.authManager = new AuthManager();
})();
