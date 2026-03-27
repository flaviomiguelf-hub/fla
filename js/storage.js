/**
 * storage.js — Camada de armazenamento com fallback local
 * Tenta usar a API do servidor e, se falhar, usa localStorage
 */

const TABLE_NAME = 'ordens';
const LOCAL_KEY = 'pianetto_ordens_local';
const OC_KEY = 'pianetto_oc_counter';
const PEDIDO_KEY = 'pianetto_pedido_counter';

let modoOnline = false;

async function verificarConexao() {
  try {
    const r = await fetch(`tables/${TABLE_NAME}?limit=1`);
    modoOnline = r.ok;
  } catch {
    modoOnline = false;
  }
  atualizarIndicador();
  return modoOnline;
}

function atualizarIndicador() {
  const el = document.getElementById('status-conexao');
  if (!el) return;
  if (modoOnline) {
    el.innerHTML = '🟢 Modo Online — dados salvos no servidor';
    el.className = 'status-banner online';
  } else {
    el.innerHTML = '🟡 Modo Local — dados salvos neste navegador';
    el.className = 'status-banner offline';
  }
}

/* -------- OC / PEDIDO -------- */
function gerarOC() {
  const ano = new Date().getFullYear();
  let n = parseInt(localStorage.getItem(OC_KEY) || '0') + 1;
  localStorage.setItem(OC_KEY, n);
  return `OC-${ano}-${String(n).padStart(4, '0')}`;
}

function gerarPedidoSugerido() {
  const ano = new Date().getFullYear();
  let n = parseInt(localStorage.getItem(PEDIDO_KEY) || '0') + 1;
  localStorage.setItem(PEDIDO_KEY, n);
  return `PEDIDO-${ano}-${String(n).padStart(4, '0')}`;
}

/* -------- LOCAL -------- */
function getLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}
function setLocal(arr) { localStorage.setItem(LOCAL_KEY, JSON.stringify(arr)); }

/* -------- CRUD -------- */
async function salvarOrdem(dados) {
  if (modoOnline) {
    try {
      const r = await fetch(`tables/${TABLE_NAME}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (r.ok) return await r.json();
    } catch {}
  }
  const arr = getLocal();
  const novo = { ...dados, id: 'local_' + Date.now(), created_at: Date.now(), _local: true };
  arr.unshift(novo);
  setLocal(arr);
  return novo;
}

async function listarOrdens(pagina = 1, limite = 50, filtros = {}) {
  if (modoOnline) {
    try {
      let url = `tables/${TABLE_NAME}?page=${pagina}&limit=${limite}`;
      if (filtros.busca) url += `&search=${encodeURIComponent(filtros.busca)}`;
      const r = await fetch(url);
      if (r.ok) {
        const d = await r.json();
        return d.data || [];
      }
    } catch {}
  }
  let arr = getLocal();
  if (filtros.busca) {
    const b = filtros.busca.toLowerCase();
    arr = arr.filter(o =>
      (o.pedido || '').toLowerCase().includes(b) ||
      (o.oc || '').toLowerCase().includes(b) ||
      (o.motorista || '').toLowerCase().includes(b) ||
      (o.remetente || '').toLowerCase().includes(b) ||
      (o.placa_cav || '').toLowerCase().includes(b)
    );
  }
  if (filtros.status) arr = arr.filter(o => o.status === filtros.status);
  if (filtros.dataInicio) arr = arr.filter(o => {
    const d = new Date(o.data_emissao || o.created_at);
    return d >= new Date(filtros.dataInicio);
  });
  if (filtros.dataFim) arr = arr.filter(o => {
    const d = new Date(o.data_emissao || o.created_at);
    return d <= new Date(filtros.dataFim + 'T23:59:59');
  });
  const inicio = (pagina - 1) * limite;
  return arr.slice(inicio, inicio + limite);
}

async function buscarOrdem(id) {
  if (modoOnline && !String(id).startsWith('local_')) {
    try {
      const r = await fetch(`tables/${TABLE_NAME}/${id}`);
      if (r.ok) return await r.json();
    } catch {}
  }
  return getLocal().find(o => o.id === id) || null;
}

async function atualizarOrdem(id, dados) {
  if (modoOnline && !String(id).startsWith('local_')) {
    try {
      const r = await fetch(`tables/${TABLE_NAME}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (r.ok) return await r.json();
    } catch {}
  }
  const arr = getLocal();
  const i = arr.findIndex(o => o.id === id);
  if (i !== -1) { arr[i] = { ...arr[i], ...dados }; setLocal(arr); return arr[i]; }
}

async function deletarOrdem(id) {
  if (modoOnline && !String(id).startsWith('local_')) {
    try {
      await fetch(`tables/${TABLE_NAME}/${id}`, { method: 'DELETE' });
      return;
    } catch {}
  }
  const arr = getLocal().filter(o => o.id !== id);
  setLocal(arr);
}

async function sincronizar() {
  if (!modoOnline) return 0;
  const locais = getLocal().filter(o => o._local);
  let count = 0;
  for (const o of locais) {
    try {
      const { id, _local, ...dados } = o;
      const r = await fetch(`tables/${TABLE_NAME}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (r.ok) {
        const arr = getLocal().filter(x => x.id !== o.id);
        setLocal(arr);
        count++;
      }
    } catch {}
  }
  return count;
}
