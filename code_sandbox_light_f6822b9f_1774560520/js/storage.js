/**
 * storage.js — Pianetto Transportes e Logística
 * Camada de armazenamento com fallback para localStorage
 * Funciona em GitHub Pages (modo local) e na plataforma Genspark (modo online)
 */

const Storage = (() => {
  const TABLE = 'ordens';
  const LOCAL_KEY = 'pianetto_ordens';
  const OC_KEY = 'pianetto_oc_counter';
  const PEDIDO_KEY = 'pianetto_pedido_counter';
  let isOnline = false;

  // ─────────────────────────────────────────────
  // Detecção de modo (online vs local)
  // ─────────────────────────────────────────────
  async function detectMode() {
    try {
      const resp = await fetch(`tables/${TABLE}?limit=1`, { method: 'GET' });
      if (resp.ok || resp.status === 200) {
        isOnline = true;
      } else {
        isOnline = false;
      }
    } catch (e) {
      isOnline = false;
    }
    updateStatusBanner();
    return isOnline;
  }

  function updateStatusBanner() {
    const banner = document.getElementById('status-banner');
    if (!banner) return;
    if (isOnline) {
      banner.innerHTML = '🟢 <strong>Modo Online</strong> — dados salvos no servidor e compartilhados com a equipe.';
      banner.className = 'status-banner online';
    } else {
      banner.innerHTML = '🟡 <strong>Modo Local</strong> — dados salvos neste navegador. <button onclick="Storage.sync()" class="btn-sync">🔄 Tentar Sincronizar</button>';
      banner.className = 'status-banner offline';
    }
  }

  // ─────────────────────────────────────────────
  // Numeração automática
  // ─────────────────────────────────────────────
  function getNextOC() {
    let counter = parseInt(localStorage.getItem(OC_KEY) || '0') + 1;
    localStorage.setItem(OC_KEY, counter);
    const year = new Date().getFullYear();
    return `OC-${year}-${String(counter).padStart(4, '0')}`;
  }

  function getNextPedido() {
    let counter = parseInt(localStorage.getItem(PEDIDO_KEY) || '0') + 1;
    localStorage.setItem(PEDIDO_KEY, counter);
    const year = new Date().getFullYear();
    return `PEDIDO-${year}-${String(counter).padStart(4, '0')}`;
  }

  function peekNextPedido() {
    let counter = parseInt(localStorage.getItem(PEDIDO_KEY) || '0') + 1;
    const year = new Date().getFullYear();
    return `PEDIDO-${year}-${String(counter).padStart(4, '0')}`;
  }

  // ─────────────────────────────────────────────
  // LocalStorage helpers
  // ─────────────────────────────────────────────
  function localGetAll() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    } catch (e) { return []; }
  }

  function localSave(items) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }

  function localCreate(data) {
    const items = localGetAll();
    const record = {
      ...data,
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      created_at: Date.now(),
      updated_at: Date.now(),
      _local: true
    };
    items.push(record);
    localSave(items);
    return record;
  }

  function localUpdate(id, data) {
    const items = localGetAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updated_at: Date.now() };
    localSave(items);
    return items[idx];
  }

  function localDelete(id) {
    const items = localGetAll().filter(i => i.id !== id);
    localSave(items);
  }

  function localGetById(id) {
    return localGetAll().find(i => i.id === id) || null;
  }

  // ─────────────────────────────────────────────
  // API Online helpers
  // ─────────────────────────────────────────────
  async function apiGetAll(search = '', dateFrom = '', dateTo = '', status = '') {
    let url = `tables/${TABLE}?limit=500`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('API indisponível');
    const json = await resp.json();
    let data = json.data || [];
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      data = data.filter(r => r.created_at >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000;
      data = data.filter(r => r.created_at <= to);
    }
    if (status) {
      data = data.filter(r => r.status === status);
    }
    return data;
  }

  async function apiCreate(data) {
    const resp = await fetch(`tables/${TABLE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error('Falha ao criar registro');
    return await resp.json();
  }

  async function apiUpdate(id, data) {
    const resp = await fetch(`tables/${TABLE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error('Falha ao atualizar registro');
    return await resp.json();
  }

  async function apiDelete(id) {
    await fetch(`tables/${TABLE}/${id}`, { method: 'DELETE' });
  }

  async function apiGetById(id) {
    const resp = await fetch(`tables/${TABLE}/${id}`);
    if (!resp.ok) return null;
    return await resp.json();
  }

  // ─────────────────────────────────────────────
  // API Pública (usada pelas páginas)
  // ─────────────────────────────────────────────
  async function init() {
    await detectMode();
  }

  async function getAll(search = '', dateFrom = '', dateTo = '', status = '') {
    if (isOnline) {
      try {
        return await apiGetAll(search, dateFrom, dateTo, status);
      } catch (e) {
        isOnline = false;
        updateStatusBanner();
      }
    }
    // Fallback local
    let data = localGetAll();
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(s))
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      data = data.filter(r => r.created_at >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000;
      data = data.filter(r => r.created_at <= to);
    }
    if (status) {
      data = data.filter(r => r.status === status);
    }
    return data;
  }

  async function getById(id) {
    if (isOnline) {
      try {
        const r = await apiGetById(id);
        if (r) return r;
      } catch (e) {}
    }
    return localGetById(id);
  }

  async function create(data) {
    if (isOnline) {
      try {
        return await apiCreate(data);
      } catch (e) {
        isOnline = false;
        updateStatusBanner();
      }
    }
    return localCreate(data);
  }

  async function update(id, data) {
    if (isOnline) {
      try {
        return await apiUpdate(id, data);
      } catch (e) {
        isOnline = false;
        updateStatusBanner();
      }
    }
    return localUpdate(id, data);
  }

  async function remove(id) {
    if (isOnline) {
      try {
        await apiDelete(id);
        return;
      } catch (e) {
        isOnline = false;
        updateStatusBanner();
      }
    }
    localDelete(id);
  }

  async function sync() {
    const localItems = localGetAll().filter(i => i._local);
    if (localItems.length === 0) {
      alert('Nenhum dado local para sincronizar.');
      return;
    }
    const online = await detectMode();
    if (!online) {
      alert('Servidor indisponível. Tente novamente mais tarde.');
      return;
    }
    let synced = 0;
    for (const item of localItems) {
      try {
        const { id, _local, ...data } = item;
        await apiCreate(data);
        localDelete(id);
        synced++;
      } catch (e) {}
    }
    alert(`${synced} ordem(s) sincronizada(s) com sucesso!`);
    if (typeof loadOrdens === 'function') loadOrdens();
  }

  return {
    init,
    getAll,
    getById,
    create,
    update,
    remove,
    sync,
    getNextOC,
    getNextPedido,
    peekNextPedido,
    get isOnline() { return isOnline; }
  };
})();
