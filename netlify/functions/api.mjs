import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "pansiyon-nobet-cloud";
const USERS_KEY = "users_v1";
const LEGACY_SHARED_DATA_KEY = "app_data_v1";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün

function getUserDataKey(userId) {
  return `user_data/${String(userId || "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function createEmptyUserData() {
  const now = new Date();
  const y = now.getFullYear();
  return {
    initializedEmpty: true,
    currentYear: y,
    currentMonth: now.getMonth(),
    teachers: [],
    scheduleDays: [],
    dutyColumns: [
      { id: "kiz1", title: "KIZ PANSİYONU", gender: "K" },
      { id: "erkek1", title: "ERKEK PANSİYONU (1)", gender: "E" },
      { id: "erkek2", title: "ERKEK PANSİYONU (2)", gender: "E" }
    ],
    monthlySchedules: {},
    monthlyClosedDates: {},
    monthlyDutyColumns: {},
    settings: {
      instTop: "T.C.",
      instMid: "MİLLİ EĞİTİM BAKANLIĞI",
      schoolName: "OKUL / KURUM ADI MÜDÜRLÜĞÜ",
      approvalDate: `... / ... / ${y}\nUYGUNDUR`,
      vicePrincipal: "Müdür Yardımcısı Adı Soyadı",
      viceTitle: "Pansiyondan Sorumlu Müdür Yardımcısı",
      principal: "Okul Müdürü Adı Soyadı",
      principalTitle: "Okul Müdürü"
    },
    lastSaved: "",
    savedBy: "",
    lastSavedTimestamp: 0
  };
}

const NO_CACHE_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: NO_CACHE_HEADERS
  });
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== "string") return false;
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, keyHex] = parts;
  const derived = crypto.scryptSync(String(password), salt, 64);
  const storedBuf = Buffer.from(keyHex, "hex");
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

function sha256(str) {
  return crypto.createHash("sha256").update(String(str)).digest("hex");
}

function normalizeRight(right, isAdmin = false) {
  if (isAdmin) return { mode: "unlimited", limit: 0, used: 0 };
  if (!right || typeof right !== "object") return { mode: "none", limit: 0, used: 0 };
  const mode = (right.mode === "unlimited" || right.mode === "limited" || right.mode === "none")
    ? right.mode
    : "none";
  const limit = Math.max(0, parseInt(right.limit, 10) || 0);
  const used = Math.max(0, parseInt(right.used, 10) || 0);
  return { mode, limit, used };
}

function normalizeExpiry(expiry, isAdmin = false) {
  if (isAdmin) return { mode: "unlimited", expiresAt: null };
  if (!expiry || typeof expiry !== "object" || expiry.mode === "unlimited" || !expiry.expiresAt) {
    return { mode: "unlimited", expiresAt: null };
  }
  const ts = Date.parse(expiry.expiresAt);
  if (Number.isNaN(ts)) return { mode: "unlimited", expiresAt: null };
  return { mode: "limited", expiresAt: new Date(ts).toISOString() };
}

function isUserExpired(user) {
  if (!user || user.role === "admin") return false;
  const exp = normalizeExpiry(user.accessExpiry, false);
  if (exp.mode !== "limited" || !exp.expiresAt) return false;
  return Date.parse(exp.expiresAt) <= Date.now();
}

function sanitizeUser(u) {
  if (!u) return null;
  const isAdmin = u.role === "admin" || String(u.username || "").toLowerCase() === "nebi";
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName || u.username,
    role: isAdmin ? "admin" : "user",
    active: isAdmin ? true : u.active !== false,
    scheduleRight: normalizeRight(u.scheduleRight, isAdmin),
    exportRight: normalizeRight(u.exportRight, isAdmin),
    accessExpiry: normalizeExpiry(u.accessExpiry, isAdmin),
    createdAt: u.createdAt || null
  };
}

function buildDefaultAdmin() {
  return {
    id: "admin_nebi",
    username: "nebi",
    displayName: "Nebi (Ana Yönetici)",
    passwordHash: hashPassword("Nebi123."),
    role: "admin",
    active: true,
    scheduleRight: { mode: "unlimited", limit: 0, used: 0 },
    exportRight: { mode: "unlimited", limit: 0, used: 0 },
    accessExpiry: { mode: "unlimited", expiresAt: null },
    createdAt: "2026-01-01T00:00:00.000Z"
  };
}

function ensureAdminInList(list) {
  const users = Array.isArray(list) ? [...list] : [];
  let changed = false;
  const nebiIdx = users.findIndex(u => u && String(u.username || "").toLowerCase() === "nebi");
  if (nebiIdx === -1) {
    users.unshift(buildDefaultAdmin());
    changed = true;
  } else {
    const existing = users[nebiIdx];
    const fixed = {
      ...existing,
      id: "admin_nebi",
      username: "nebi",
      role: "admin",
      active: true,
      scheduleRight: { mode: "unlimited", limit: 0, used: 0 },
      exportRight: { mode: "unlimited", limit: 0, used: 0 },
      accessExpiry: { mode: "unlimited", expiresAt: null },
      passwordHash: existing.passwordHash || hashPassword("Nebi123.")
    };
    users[nebiIdx] = fixed;
  }
  return { users, changed };
}

function getAppStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function readUsersWithEtag(store) {
  const entry = await store.getWithMetadata(USERS_KEY, { type: "json", consistency: "strong" });
  if (entry === null || !Array.isArray(entry.data)) {
    const seeded = [buildDefaultAdmin()];
    await store.setJSON(USERS_KEY, seeded);
    const fresh = await store.getWithMetadata(USERS_KEY, { type: "json", consistency: "strong" });
    return { users: seeded, etag: fresh ? fresh.etag : null };
  }
  const { users, changed } = ensureAdminInList(entry.data);
  if (changed) {
    await store.setJSON(USERS_KEY, users);
    const fresh = await store.getWithMetadata(USERS_KEY, { type: "json", consistency: "strong" });
    return { users, etag: fresh ? fresh.etag : null };
  }
  return { users, etag: entry.etag };
}

async function mutateUsersAtomic(store, mutator) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const { users, etag } = await readUsersWithEtag(store);
    const result = mutator(users);
    if (!result || result.error) {
      return result || { error: "İşlem tamamlanamadı.", status: 400 };
    }
    if (result.noWrite) {
      return result;
    }
    const writeOpts = etag ? { onlyIfMatch: etag } : undefined;
    const writeRes = await store.setJSON(USERS_KEY, result.users, writeOpts);
    if (writeRes && writeRes.modified === false) {
      continue; // Eşzamanlı yazma çakışması -> yeniden dene
    }
    return result;
  }
  return { error: "Sunucu yoğunluğu nedeniyle işlem tamamlanamadı, lütfen tekrar deneyin.", status: 409 };
}

async function getSessionAuth(req, store) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+([a-fA-F0-9]{32,128})$/);
  if (!match) return null;

  const rawToken = match[1];
  const sessionKey = `sessions/${sha256(rawToken)}`;
  const session = await store.get(sessionKey, { type: "json", consistency: "strong" });
  if (!session || !session.userId) return null;

  if (session.expiresAt && Date.parse(session.expiresAt) <= Date.now()) {
    await store.delete(sessionKey);
    return null;
  }

  const { users } = await readUsersWithEtag(store);
  const user = users.find(u => u.id === session.userId);
  if (!user || !user.active) {
    return null;
  }

  return { user, sessionKey, users };
}

async function parseJsonBody(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: NO_CACHE_HEADERS });
  }

  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");

  try {
    const store = getAppStore();

    // 1. Sağlık / Bulut bağlantısı kontrolü
    if (route === "health" && req.method === "GET") {
      await readUsersWithEtag(store);
      return jsonResponse({
        ok: true,
        mode: "cloud",
        serverTime: new Date().toISOString()
      });
    }

    // 2. Kullanıcı Girişi
    if (route === "auth/login" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const username = String(body.username || "").trim();
      const password = String(body.password || "");

      if (!username || !password) {
        return jsonResponse({ ok: false, error: "Lütfen kullanıcı adı ve şifre girin." }, 400);
      }

      const { users } = await readUsersWithEtag(store);
      const found = users.find(u => u.username.toLocaleLowerCase("tr") === username.toLocaleLowerCase("tr"));

      if (!found || !verifyPassword(password, found.passwordHash)) {
        return jsonResponse({ ok: false, error: "Kullanıcı adı veya şifre hatalı!" }, 401);
      }

      if (!found.active) {
        return jsonResponse({
          ok: false,
          error: "Bu kullanıcı hesabı pasif durumdadır. Yönetici (nebi) ile iletişime geçin."
        }, 403);
      }

      const token = crypto.randomBytes(32).toString("hex");
      const sessionKey = `sessions/${sha256(token)}`;
      await store.setJSON(sessionKey, {
        userId: found.id,
        username: found.username,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
      });

      return jsonResponse({
        ok: true,
        token,
        user: sanitizeUser(found),
        serverTime: new Date().toISOString()
      });
    }

    // 3. Oturum Kapatma
    if (route === "auth/logout" && req.method === "POST") {
      const authHeader = req.headers.get("authorization") || "";
      const match = authHeader.match(/^Bearer\s+([a-fA-F0-9]{32,128})$/);
      if (match) {
        await store.delete(`sessions/${sha256(match[1])}`);
      }
      return jsonResponse({ ok: true });
    }

    // Bundan sonraki tüm uç noktalar oturum gerektirir
    const auth = await getSessionAuth(req, store);
    if (!auth) {
      return jsonResponse({ ok: false, error: "Oturum geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın." }, 401);
    }

    const currentUser = auth.user;
    const isAdmin = currentUser.role === "admin";

    // 4. Mevcut Oturum Bilgisi
    if (route === "auth/me" && req.method === "GET") {
      return jsonResponse({
        ok: true,
        user: sanitizeUser(currentUser),
        serverTime: new Date().toISOString()
      });
    }

    // 5. Hak Kullanımı (Yeni Nöbet Hazırlama / Çıktı Alma)
    if (route === "rights/consume" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const type = body.type === "export" ? "export" : (body.type === "schedule" ? "schedule" : null);
      if (!type) {
        return jsonResponse({ ok: false, error: "Geçersiz hak türü." }, 400);
      }

      if (isAdmin) {
        return jsonResponse({
          ok: true,
          unlimited: true,
          user: sanitizeUser(currentUser),
          serverTime: new Date().toISOString()
        });
      }

      const res = await mutateUsersAtomic(store, (users) => {
        const idx = users.findIndex(u => u.id === currentUser.id);
        if (idx === -1) return { error: "Kullanıcı bulunamadı.", status: 404 };

        const target = users[idx];
        if (!target.active) {
          return { error: "Hesabınız pasif durumdadır.", status: 403 };
        }
        if (isUserExpired(target)) {
          return {
            error: "Yetki süreniz dolmuştur. Hiçbir değişiklik veya işlem yapamazsınız. Süre uzatmak için ana yönetici (nebi) ile iletişime geçin.",
            status: 403,
            expired: true
          };
        }

        const prop = type === "schedule" ? "scheduleRight" : "exportRight";
        const label = type === "schedule" ? "Yeni nöbet hazırlama" : "Çıktı alma (PDF / Excel / Yazdır)";
        const r = normalizeRight(target[prop], false);

        if (r.mode === "none") {
          return {
            error: `${label} yetkiniz bulunmamaktadır. Lütfen ana yönetici (nebi) ile iletişime geçin.`,
            status: 403
          };
        }

        if (r.mode === "unlimited") {
          r.used = (r.used || 0) + 1;
          users[idx] = { ...target, [prop]: r };
          return { users, payload: { ok: true, unlimited: true, used: r.used, user: sanitizeUser(users[idx]) } };
        }

        const remainingBefore = Math.max(0, r.limit - r.used);
        if (remainingBefore <= 0) {
          return {
            error: `${label} hakkınız dolmuştur (0 / ${r.limit}). Yeni hak tanımlanması için ana yönetici (nebi) ile iletişime geçin.`,
            status: 403
          };
        }

        r.used += 1;
        users[idx] = { ...target, [prop]: r };
        const remainingAfter = Math.max(0, r.limit - r.used);
        return {
          users,
          payload: {
            ok: true,
            unlimited: false,
            remaining: remainingAfter,
            limit: r.limit,
            used: r.used,
            user: sanitizeUser(users[idx])
          }
        };
      });

      if (res.error) {
        return jsonResponse({ ok: false, error: res.error, expired: !!res.expired }, res.status || 403);
      }
      return jsonResponse({ ...res.payload, serverTime: new Date().toISOString() });
    }

    // 6. Kullanıcıya Özel Nöbet Verisini Yükle (Her kullanıcının verisi tamamen ayrıdır)
    if (route === "data/load" && req.method === "GET") {
      const userDataKey = getUserDataKey(currentUser.id);
      let saved = await store.get(userDataKey, { type: "json", consistency: "strong" });

      // Ana yönetici nebi için eski ortak kayıttan tek seferlik taşıma
      if (!saved && isAdmin) {
        const legacyData = await store.get(LEGACY_SHARED_DATA_KEY, { type: "json", consistency: "strong" });
        if (legacyData) {
          saved = legacyData;
          await store.setJSON(userDataKey, legacyData);
        }
      }

      // Standart kullanıcı henüz veri kaydetmediyse boş nöbetçi listesi ve boş çizelge döner
      if (!saved && !isAdmin) {
        saved = createEmptyUserData();
      }

      return jsonResponse({
        ok: true,
        data: saved || null,
        serverTime: new Date().toISOString()
      });
    }

    // 7. Kullanıcıya Özel Nöbet Verisini Kaydet (Süresi dolmuş kullanıcı ASLA kaydedemez!)
    if (route === "data/save" && req.method === "POST") {
      if (!isAdmin && isUserExpired(currentUser)) {
        return jsonResponse({
          ok: false,
          expired: true,
          error: "Yetki süreniz dolmuştur. Hiçbir şekilde değişiklik kaydedemezsiniz."
        }, 403);
      }

      const body = await parseJsonBody(req);
      if (!body || !body.data || typeof body.data !== "object") {
        return jsonResponse({ ok: false, error: "Geçersiz veri paketi." }, 400);
      }

      const serverNow = new Date().toISOString();
      const enriched = {
        ...body.data,
        ownerUserId: currentUser.id,
        savedBy: currentUser.username,
        savedByDisplayName: currentUser.displayName || currentUser.username,
        serverSavedAt: serverNow
      };

      await store.setJSON(getUserDataKey(currentUser.id), enriched);
      return jsonResponse({
        ok: true,
        savedBy: currentUser.username,
        serverSavedAt: serverNow,
        serverTime: serverNow
      });
    }

    // 8. KULLANICI YÖNETİMİ UÇ NOKTALARI (SADECE ANA YÖNETİCİ: nebi)
    if (route === "users" && req.method === "GET") {
      if (!isAdmin) {
        return jsonResponse({ ok: false, error: "Bu işlem için ana yönetici (nebi) yetkisi gereklidir." }, 403);
      }
      return jsonResponse({
        ok: true,
        users: auth.users.map(sanitizeUser),
        serverTime: new Date().toISOString()
      });
    }

    if (route === "users/create" && req.method === "POST") {
      if (!isAdmin) {
        return jsonResponse({ ok: false, error: "Bu işlem için ana yönetici (nebi) yetkisi gereklidir." }, 403);
      }
      const body = await parseJsonBody(req);
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const displayName = String(body.displayName || username).trim();

      if (!username || username.length < 2) {
        return jsonResponse({ ok: false, error: "Kullanıcı adı en az 2 karakter olmalıdır." }, 400);
      }
      if (/\s/.test(username)) {
        return jsonResponse({ ok: false, error: "Kullanıcı adında boşluk bulunamaz." }, 400);
      }
      if (!password || password.length < 3) {
        return jsonResponse({ ok: false, error: "Şifre en az 3 karakter olmalıdır." }, 400);
      }

      const res = await mutateUsersAtomic(store, (users) => {
        if (users.some(u => u.username.toLocaleLowerCase("tr") === username.toLocaleLowerCase("tr"))) {
          return { error: `"${username}" kullanıcı adı zaten kayıtlı.`, status: 409 };
        }
        const newUser = {
          id: "usr_" + Date.now() + "_" + crypto.randomBytes(3).toString("hex"),
          username,
          displayName: displayName || username,
          passwordHash: hashPassword(password),
          role: "user",
          active: body.active !== false,
          scheduleRight: normalizeRight(body.scheduleRight, false),
          exportRight: normalizeRight(body.exportRight, false),
          accessExpiry: normalizeExpiry(body.accessExpiry, false),
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        return { users, user: sanitizeUser(newUser) };
      });

      if (res.error) {
        return jsonResponse({ ok: false, error: res.error }, res.status || 400);
      }

      // Yeni tanımlanan kullanıcı için tamamen boş ve izole veri kaydı oluştur (nöbetçi listesi boş)
      if (res.user && res.user.id) {
        await store.setJSON(getUserDataKey(res.user.id), createEmptyUserData());
      }

      return jsonResponse({
        ok: true,
        user: res.user,
        users: res.users.map(sanitizeUser),
        serverTime: new Date().toISOString()
      });
    }

    if (route === "users/update" && req.method === "POST") {
      if (!isAdmin) {
        return jsonResponse({ ok: false, error: "Bu işlem için ana yönetici (nebi) yetkisi gereklidir." }, 403);
      }
      const body = await parseJsonBody(req);
      const userId = String(body.id || "").trim();
      if (!userId) {
        return jsonResponse({ ok: false, error: "Kullanıcı kimliği eksik." }, 400);
      }

      const res = await mutateUsersAtomic(store, (users) => {
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1) return { error: "Kullanıcı bulunamadı.", status: 404 };

        const existing = users[idx];
        const isMainAdmin = existing.username.toLowerCase() === "nebi";

        let nextUsername = existing.username;
        if (!isMainAdmin && body.username !== undefined) {
          const candidate = String(body.username || "").trim();
          if (!candidate || candidate.length < 2) {
            return { error: "Kullanıcı adı en az 2 karakter olmalıdır.", status: 400 };
          }
          if (/\s/.test(candidate)) {
            return { error: "Kullanıcı adında boşluk bulunamaz.", status: 400 };
          }
          if (users.some((u, i) => i !== idx && u.username.toLocaleLowerCase("tr") === candidate.toLocaleLowerCase("tr"))) {
            return { error: `"${candidate}" kullanıcı adı başka bir hesapta kullanılıyor.`, status: 409 };
          }
          nextUsername = candidate;
        }

        let nextPasswordHash = existing.passwordHash;
        if (body.password !== undefined && String(body.password).length > 0) {
          const rawPass = String(body.password);
          if (rawPass.length < 3) {
            return { error: "Şifre en az 3 karakter olmalıdır.", status: 400 };
          }
          nextPasswordHash = hashPassword(rawPass);
        }

        const updated = {
          ...existing,
          username: nextUsername,
          displayName: body.displayName !== undefined ? (String(body.displayName).trim() || nextUsername) : existing.displayName,
          passwordHash: nextPasswordHash,
          role: isMainAdmin ? "admin" : "user",
          active: isMainAdmin ? true : (body.active !== undefined ? !!body.active : existing.active),
          scheduleRight: isMainAdmin
            ? { mode: "unlimited", limit: 0, used: 0 }
            : normalizeRight(body.scheduleRight !== undefined ? body.scheduleRight : existing.scheduleRight, false),
          exportRight: isMainAdmin
            ? { mode: "unlimited", limit: 0, used: 0 }
            : normalizeRight(body.exportRight !== undefined ? body.exportRight : existing.exportRight, false),
          accessExpiry: isMainAdmin
            ? { mode: "unlimited", expiresAt: null }
            : normalizeExpiry(body.accessExpiry !== undefined ? body.accessExpiry : existing.accessExpiry, false)
        };

        users[idx] = updated;
        return { users, user: sanitizeUser(updated) };
      });

      if (res.error) {
        return jsonResponse({ ok: false, error: res.error }, res.status || 400);
      }

      return jsonResponse({
        ok: true,
        user: res.user,
        users: res.users.map(sanitizeUser),
        serverTime: new Date().toISOString()
      });
    }

    if (route === "users/reset" && req.method === "POST") {
      if (!isAdmin) {
        return jsonResponse({ ok: false, error: "Bu işlem için ana yönetici (nebi) yetkisi gereklidir." }, 403);
      }
      const body = await parseJsonBody(req);
      const userId = String(body.id || "").trim();

      const res = await mutateUsersAtomic(store, (users) => {
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1) return { error: "Kullanıcı bulunamadı.", status: 404 };

        const target = users[idx];
        const sRight = normalizeRight(target.scheduleRight, target.role === "admin");
        const eRight = normalizeRight(target.exportRight, target.role === "admin");
        sRight.used = 0;
        eRight.used = 0;

        users[idx] = { ...target, scheduleRight: sRight, exportRight: eRight };
        return { users, user: sanitizeUser(users[idx]) };
      });

      if (res.error) {
        return jsonResponse({ ok: false, error: res.error }, res.status || 400);
      }

      return jsonResponse({
        ok: true,
        user: res.user,
        users: res.users.map(sanitizeUser),
        serverTime: new Date().toISOString()
      });
    }

    if (route === "users/delete" && req.method === "POST") {
      if (!isAdmin) {
        return jsonResponse({ ok: false, error: "Bu işlem için ana yönetici (nebi) yetkisi gereklidir." }, 403);
      }
      const body = await parseJsonBody(req);
      const userId = String(body.id || "").trim();

      const res = await mutateUsersAtomic(store, (users) => {
        const target = users.find(u => u.id === userId);
        if (!target) return { error: "Kullanıcı bulunamadı.", status: 404 };
        if (target.username.toLowerCase() === "nebi" || target.role === "admin") {
          return { error: "Ana yönetici (nebi) hesabı silinemez.", status: 400 };
        }
        const nextUsers = users.filter(u => u.id !== userId);
        return { users: nextUsers };
      });

      if (res.error) {
        return jsonResponse({ ok: false, error: res.error }, res.status || 400);
      }

      // Silinen kullanıcıya ait izole veri kaydını da temizle
      try {
        await store.delete(getUserDataKey(userId));
      } catch {
        // ignore cleanup error
      }

      return jsonResponse({
        ok: true,
        users: res.users.map(sanitizeUser),
        serverTime: new Date().toISOString()
      });
    }

    return jsonResponse({ ok: false, error: "Bilinmeyen API uç noktası." }, 404);
  } catch (err) {
    console.error("API hatası:", err);
    return jsonResponse({
      ok: false,
      error: "Sunucu hatası oluştu: " + (err && err.message ? err.message : "Bilinmeyen hata")
    }, 500);
  }
};

export const config = {
  path: "/api/*"
};
