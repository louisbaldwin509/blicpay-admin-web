import React, { useState } from 'react';
import {
  Bell, ShieldCheck, Users, Clock, Check, X, Building2, Smartphone,
  DollarSign, Banknote, ArrowLeftRight, LogOut, LayoutGrid, Wallet,
  AlertCircle, ChevronRight, ChevronLeft, Search, RefreshCw, ArrowDownLeft,
  PiggyBank, HandCoins, FileText, User, Phone, Lock, KeyRound, BadgeCheck, Eye, TrendingUp, UserPlus, Mail,
  ShieldAlert, Scale, ScrollText, Gauge, Filter, Download, Landmark,
} from 'lucide-react';

import { ADMIN_DICT } from './i18n/adminDict.js';

const API_BASE_URL = 'https://api.blicpayht.com';

// Lang panèl la (ht | fr | en) — mete ajou nan chak rann BlicPayAdmin.
// tt("tèks kreyòl", ...valè) → tradiksyon fr/en (oswa kreyòl la si pa jwenn).
let CURRENT_LANG = (() => { try { const v = localStorage.getItem('blicpay_admin_lang'); return ['ht', 'fr', 'en'].includes(v) ? v : 'ht'; } catch { return 'ht'; } })();
const LANG_IDX = { fr: 0, en: 1 };
function tt(s, ...args) {
  let out = typeof s === 'string' && s.includes('@@') ? s.split('@@')[0] : s;
  if (CURRENT_LANG !== 'ht' && typeof s === 'string') {
    const row = ADMIN_DICT[s];
    if (row && row[LANG_IDX[CURRENT_LANG]]) out = row[LANG_IDX[CURRENT_LANG]];
  }
  if (args.length) out = String(out).replace(/\{(\d+)\}/g, (m, i) => (args[i] ?? m));
  return out;
}

// Ti seleksyon lang (HT / FR / EN).
function LangSwitch({ lang, setLang, dark }) {
  return (
    <div className="flex items-center rounded-full p-0.5" style={{ background: dark ? 'rgba(255,255,255,0.1)' : '#EEF1F6' }}>
      {['ht', 'fr', 'en'].map((l) => (
        <button key={l} onClick={() => setLang(l)} className="px-2 py-1 rounded-full text-[11px] font-bold uppercase"
          style={lang === l ? { background: dark ? '#fff' : '#0A2140', color: dark ? '#0A2140' : '#fff' } : { color: dark ? 'rgba(255,255,255,0.7)' : '#5B6B80' }}>
          {l}
        </button>
      ))}
    </div>
  );
}

async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-BLIC-Lang': CURRENT_LANG,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Yon bagay pa mache. Eseye ankò.');
  }
  return data;
}

const C = {
  bg: '#F3F5F9',
  paper: '#F3F5F9',
  card: '#FFFFFF',
  border: '#E2E7EF',
  ink: '#0F1B2D',
  muted: '#5F6B7A',
  navy: '#0F2D52',
  navyDeep: '#0A2140',
  sky: '#2C8FB0',
  gold: '#B9862F',
  mint: '#1E9E7C',
  amber: '#B9862F',
  danger: '#B5482E',
  purple: '#6D3FD1',
};

const fontDisplay = { fontFamily: "'Manrope', sans-serif" };
const fontMono = { fontFamily: "'IBM Plex Mono', monospace" };

const methodIcons = {
  moncash: { label: 'Mon Cash', icon: DollarSign, color: '#1E9E7C', logo: 'https://blicpayht.com/logos/moncash.jpg' },
  natcash: { label: 'NatCash', icon: Smartphone, color: '#1C6FBF', logo: 'https://blicpayht.com/logos/natcash.jpg' },
  usdt: { label: 'USDT', icon: Banknote, color: '#0E9E86', logo: 'https://blicpayht.com/logos/usdt.jpg' },
  zelle: { label: 'Zelle', icon: ArrowLeftRight, color: '#6D3FD1', logo: 'https://blicpayht.com/logos/zelle.png' },
  biwo: { label: 'Nan biwo', icon: Building2, color: '#8A6423', logo: null },
};

function addMonthsToDate(dateStr, n) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + n);
  return d.toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const DEMO_TOKEN = 'demo-token';

function money(n) {
  return (n || 0).toLocaleString('fr-FR') + ' HTG';
}
function initials(name) {
  return (name || '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}
// Konpare non yon kont kliyan (w.user) ak non li antre kòm destinasyon retrè
// a (w.destinationName) — jis pou avèti ajan an si yo diferan, PA yon
// verifikasyon otomatik reyèl (ni MonCash ni NatCash pa bay API pou sa).
function namesMatch(a, b) {
  const norm = (s) => (s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return norm(a) === norm(b);
}

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="agShield" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor={C.navy} />
          <stop offset="100%" stopColor={C.sky} />
        </linearGradient>
      </defs>
      <path d="M24 3 L42 10 V22 C42 33 34.5 41.5 24 45 C13.5 41.5 6 33 6 22 V10 Z" fill="url(#agShield)" />
      <rect x="17" y="18" width="9" height="9" rx="2" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M13 30 L33 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 15 H33 V21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Badge({ children, tone = 'muted' }) {
  const map = {
    muted: { bg: 'rgba(111,106,94,0.10)', fg: C.muted, border: 'rgba(111,106,94,0.22)' },
    mint: { bg: 'rgba(61,122,92,0.10)', fg: '#2B5842', border: 'rgba(61,122,92,0.25)' },
    amber: { bg: 'rgba(185,134,47,0.12)', fg: '#8A6423', border: 'rgba(185,134,47,0.28)' },
    navy: { bg: 'rgba(15,45,82,0.08)', fg: C.navy, border: 'rgba(15,45,82,0.20)' },
    premium: { bg: 'rgba(109,63,209,0.10)', fg: '#532DA8', border: 'rgba(109,63,209,0.25)' },
    danger: { bg: 'rgba(181,72,46,0.10)', fg: '#8E341F', border: 'rgba(181,72,46,0.25)' },
  };
  const s = map[tone];
  return (
    <span className="px-2 py-0.5 text-xs font-semibold" style={{ background: s.bg, color: s.fg, border: `1px solid ${s.border}`, borderRadius: 4, letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-lg relative overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}`, padding: '18px 18px 16px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent || C.navy }} />
      <p className="text-xs font-semibold uppercase" style={{ color: C.muted, letterSpacing: 0.5 }}>{label}</p>
      <p className="mt-1.5" style={{ ...fontDisplay, fontSize: 24, fontWeight: 800, color: C.ink }}>{value}</p>
      {sub && <p className="mt-0.5 text-xs" style={{ color: C.muted }}>{sub}</p>}
    </div>
  );
}

function Th({ children, align }) {
  return <th style={{ textAlign: align || 'left', fontSize: 10.5, fontWeight: 700, color: C.muted, padding: '10px 14px', letterSpacing: 0.6, textTransform: 'uppercase' }}>{children}</th>;
}
function Td({ children, align }) {
  return <td style={{ textAlign: align || 'left', fontSize: 12.5, padding: '11px 14px', borderTop: `1px solid ${C.border}` }}>{children}</td>;
}
function Table({ children }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.card }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
    </div>
  );
}
function EmptyRow({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-sm text-center py-6" style={{ color: C.muted }}>{children}</td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// KONT ANTREPRIZ — egzamine dosye legal yo (lis, detay, dokiman, desizyon).
// ---------------------------------------------------------------------------
const BIZ_STATUS = {
  draft: { label: 'Pou ranpli', tone: 'muted' },
  submitted: { label: 'Ap tann egzamen', tone: 'amber' },
  needs_info: { label: 'Enfòmasyon mande', tone: 'premium' },
  approved: { label: 'Apwouve@@biz', tone: 'mint' },
  rejected: { label: 'Refize', tone: 'danger' },
};
const BIZ_FILTERS = [
  { id: 'submitted', label: 'Ap tann' },
  { id: 'needs_info', label: 'Enfòmasyon mande' },
  { id: 'approved', label: 'Apwouve' },
  { id: 'rejected', label: 'Refize' },
  { id: 'draft', label: 'Pou ranpli' },
  { id: '', label: 'Tout' },
];
const BIZ_FIELDS = [
  ['legalName', 'Rezon sosyal'], ['tradeName', 'Non komèsyal'], ['nif', 'NIF'], ['patenteNumber', 'Patant'],
  ['sector', 'Sektè'], ['address', 'Adrès'], ['city', 'Vil'], ['businessPhone', 'Telefòn'],
  ['businessEmail', 'Imèl'], ['website', 'Sit entènèt'], ['repTitle', 'Pozisyon reprezantan'],
];

function BusinessReview({ token }) {
  const [types, setTypes] = useState(null);
  const [filter, setFilter] = useState('submitted');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const T = (l) => (l ? l[CURRENT_LANG] || l.ht || l.fr : '');
  const docLabel = (k) => T(types?.documents?.[k]) || k;
  const formLabel = (k) => T(types?.legalForms?.[k]?.label) || k;

  React.useEffect(() => {
    apiFetch('/business/types').then(setTypes).catch(() => {});
  }, []);

  async function loadList(f = filter) {
    setLoading(true);
    try {
      const { businesses } = await apiFetch(`/admin/businesses${f ? `?status=${f}` : ''}`, { token });
      setList(businesses);
    } catch (e) {
      setMsg({ error: true, text: e.message });
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => { loadList(filter); }, [filter]);

  async function open(b) {
    setSelected(b);
    setDetail(null);
    setNote('');
    setMsg(null);
    try {
      setDetail(await apiFetch(`/admin/businesses/${b.id}`, { token }));
    } catch (e) {
      setMsg({ error: true, text: e.message });
    }
  }

  async function viewDoc(d) {
    setViewer({ loading: true, doc: d });
    try {
      const { document } = await apiFetch(`/admin/businesses/${selected.id}/documents/${d.id}`, { token });
      setViewer({ doc: document });
    } catch (e) {
      setViewer(null);
      setMsg({ error: true, text: e.message });
    }
  }

  async function setDocStatus(d, status) {
    let docNote = null;
    if (status === 'rejected') {
      docNote = window.prompt(tt("Poukisa dokiman sa a refize? (kliyan an ap wè mesaj sa a)"));
      if (!docNote) return;
    }
    try {
      await apiFetch(`/admin/businesses/${selected.id}/documents/${d.id}`, { method: 'PATCH', token, body: { status, note: docNote } });
      await open(selected);
    } catch (e) {
      setMsg({ error: true, text: e.message });
    }
  }

  async function decide(action) {
    if ((action === 'reject' || action === 'request-info') && !note.trim()) {
      setMsg({ error: true, text: action === 'reject' ? tt("Ekri rezon refi a anvan.") : tt("Ekri sa kliyan an dwe voye anvan.") });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const body = action === 'reject' ? { reason: note } : action === 'request-info' ? { note } : {};
      await apiFetch(`/admin/businesses/${selected.id}/${action}`, { method: 'POST', token, body });
      setMsg({ text: action === 'approve' ? tt("Kont antrepriz la apwouve. Kliyan an resevwa yon notifikasyon.") : action === 'reject' ? tt("Dosye a refize. Kliyan an resevwa rezon an.") : tt("Demand enfòmasyon an voye bay kliyan an.") });
      await open(selected);
      loadList();
    } catch (e) {
      setMsg({ error: true, text: e.message });
    } finally {
      setBusy(false);
    }
  }

  const Msg = () => msg ? (
    <div className="mt-4 flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg" style={{ background: msg.error ? 'rgba(181,72,46,0.10)' : 'rgba(61,122,92,0.10)', color: msg.error ? C.danger : '#2B5842' }}>
      {msg.error ? <AlertCircle size={15} /> : <Check size={15} />} {msg.text}
    </div>
  ) : null;

  if (!selected) {
    return (
      <div className="fadein">
        <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Kont Antrepriz")}</h1>
        <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Egzamine dosye legal antrepriz yo anvan ou aktive kont lan (plafon antrepriz, resepsyon peman, non komèsyal).")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {BIZ_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className="bp-btn px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: filter === f.id ? C.navy : C.card, color: filter === f.id ? '#fff' : C.ink, border: `1px solid ${filter === f.id ? C.navy : C.border}` }}>
              {tt(f.label === 'Apwouve' ? 'Apwouve@@biz' : f.label)}
            </button>
          ))}
        </div>
        <Msg />
        <div className="mt-5 flex flex-col gap-3">
          {loading ? (
            <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
          ) : list.length === 0 ? (
            <p className="text-sm p-5 rounded-xl" style={{ color: C.muted, background: C.card, border: `1px solid ${C.border}` }}>{tt("Pa gen dosye nan kategori sa a.")}</p>
          ) : list.map((b) => (
            <button key={b.id} onClick={() => open(b)} className="bp-btn text-left p-4 rounded-xl flex items-center justify-between gap-3"
              style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: C.bg }}>
                  <Building2 size={16} color={C.navy} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{b.tradeName ? `${b.tradeName} — ` : ''}{b.legalName}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                    {formLabel(b.legalForm)} · {b.user.fullName} · {b.user.clientId} · {b._count.documents} {tt("dokiman")}
                    {b.submittedAt ? tt(" · soumèt {0}", new Date(b.submittedAt).toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR')) : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!b.user.verified && <Badge tone="danger">{tt("KYC pa fèt")}</Badge>}
                <Badge tone={BIZ_STATUS[b.status]?.tone}>{tt(BIZ_STATUS[b.status]?.label)}</Badge>
                <ChevronRight size={16} color={C.muted} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const b = detail?.business;
  const reqs = detail?.requirements || { required: [], optional: [] };
  const docs = b?.documents || [];
  const docFor = (k) => docs.find((d) => d.docType === k);

  return (
    <div className="fadein">
      <button onClick={() => { setSelected(null); setDetail(null); setMsg(null); }} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: C.muted }}>
        <ChevronLeft size={15} /> {tt("Retounen nan lis la")}
      </button>
      {!b ? (
        <p className="text-sm" style={{ color: C.muted }}>{tt("Ap chaje dosye a...")}</p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p style={{ ...fontDisplay, fontWeight: 800, fontSize: 20 }}>{b.legalName}</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{formLabel(b.legalForm)}</p>
              </div>
              <Badge tone={BIZ_STATUS[b.status]?.tone}>{tt(BIZ_STATUS[b.status]?.label)}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {BIZ_FIELDS.map(([k, label]) => (
                <div key={k}>
                  <p className="text-[11px] font-semibold uppercase" style={{ color: C.muted, letterSpacing: 0.6 }}>{tt(label)}</p>
                  <p className="text-sm" style={{ color: b[k] ? C.ink : C.muted }}>{b[k] || '—'}</p>
                </div>
              ))}
              <div>
                <p className="text-[11px] font-semibold uppercase" style={{ color: C.muted, letterSpacing: 0.6 }}>{tt("Chif dafè")}</p>
                <p className="text-sm">{T(types?.turnoverRanges?.[b.turnoverRange]) || '—'}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: C.bg }}>
              <p className="text-[11px] font-semibold uppercase" style={{ color: C.muted, letterSpacing: 0.6 }}>{tt("Reprezantan legal")}</p>
              <div className="flex items-center justify-between mt-1 gap-2">
                <div>
                  <p className="text-sm font-semibold">{b.user.fullName}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{b.user.phone} · {b.user.clientId}</p>
                </div>
                {b.user.verified ? <Badge tone="mint">{tt("KYC verifye")}</Badge> : <Badge tone="danger">{tt("KYC pa verifye")}</Badge>}
              </div>
            </div>
            {b.adminNote && <p className="text-xs p-3 rounded-lg" style={{ background: '#EFE7D8', color: C.navy }}>{tt("Dènye nòt:")} {b.adminNote}</p>}
          </div>

          <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="font-bold">{tt("Dokiman legal")}</p>
            {[...reqs.required.map((k) => [k, true]), ...reqs.optional.map((k) => [k, false])].map(([k, req]) => {
              const d = docFor(k);
              return (
                <div key={k} className="p-3 rounded-lg flex items-center justify-between gap-3" style={{ border: `1px solid ${C.border}` }}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{docLabel(k)}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {!d ? <Badge tone={req ? 'danger' : 'muted'}>{req ? tt("Manke") : tt("Opsyonèl")}</Badge>
                        : d.status === 'accepted' ? <Badge tone="mint">{tt("Aksepte")}</Badge>
                        : d.status === 'rejected' ? <Badge tone="danger">{tt("Refize")}</Badge>
                        : <Badge tone="amber">{tt("Pou egzamine")}</Badge>}
                      {d && <span className="text-xs" style={{ color: C.muted }}>{d.mimeType === 'application/pdf' ? tt("PDF") : tt("Foto")} · {new Date(d.uploadedAt).toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR')}</span>}
                    </div>
                    {d?.note && <p className="text-xs mt-1" style={{ color: C.danger }}>{d.note}</p>}
                  </div>
                  {d && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => viewDoc(d)} className="bp-btn px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1" style={{ background: C.bg, color: C.navy, border: `1px solid ${C.border}` }}>
                        <Eye size={12} /> {tt("Wè")}
                      </button>
                      {d.status !== 'accepted' && (
                        <button onClick={() => setDocStatus(d, 'accepted')} title={tt("Aksepte@@btn")} className="bp-btn w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'rgba(61,122,92,0.12)' }}>
                          <Check size={14} color={C.mint} />
                        </button>
                      )}
                      {d.status !== 'rejected' && (
                        <button onClick={() => setDocStatus(d, 'rejected')} title={tt("Refize@@btn")} className="bp-btn w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'rgba(181,72,46,0.10)' }}>
                          <X size={14} color={C.danger} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-2 pt-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
              <p className="font-bold">{tt("Desizyon")}</p>
              {detail.missing?.length > 0 && (
                <p className="text-xs p-2.5 rounded-lg" style={{ background: 'rgba(181,72,46,0.08)', color: C.danger }}>
                  {tt("Dosye a pa konplè:")} {detail.missing.map((m) => (m.startsWith('doc:') ? docLabel(m.slice(4)) : m.slice(6))).join(', ')}
                </p>
              )}
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={tt("Rezon refi a oswa sa kliyan an dwe voye (obligatwa pou refize / mande enfòmasyon)")}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: `1px solid ${C.border}`, background: C.bg, resize: 'vertical' }} />
              <div className="flex flex-wrap gap-2">
                <button disabled={busy} onClick={() => decide('approve')} className="bp-btn px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5" style={{ background: C.mint, opacity: busy ? 0.6 : 1 }}>
                  <BadgeCheck size={15} /> {tt("Apwouve kont antrepriz la")}
                </button>
                <button disabled={busy} onClick={() => decide('request-info')} className="bp-btn px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5" style={{ background: C.bg, color: C.navy, border: `1px solid ${C.border}`, opacity: busy ? 0.6 : 1 }}>
                  <FileText size={15} /> {tt("Mande plis enfòmasyon")}
                </button>
                <button disabled={busy} onClick={() => decide('reject')} className="bp-btn px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5" style={{ background: 'rgba(181,72,46,0.10)', color: C.danger, opacity: busy ? 0.6 : 1 }}>
                  <X size={15} /> {tt("Refize@@btn")}
                </button>
              </div>
              {!b.user.verified && <p className="text-xs" style={{ color: C.danger }}>{tt("Atansyon: reprezantan legal la poko verifye idantite l (KYC).")}</p>}
              <Msg />
            </div>
          </div>
        </div>
      )}

      {viewer && (
        <>
          <div onClick={() => setViewer(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.5)', zIndex: 50 }} />
          <div className="fadein" style={{ position: 'fixed', top: '5%', left: '5%', right: '5%', bottom: '5%', background: C.card, borderRadius: 16, zIndex: 51, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <p className="text-sm font-semibold">{docLabel(viewer.doc.docType)}{viewer.doc.fileName ? ` — ${viewer.doc.fileName}` : ''}</p>
              <button onClick={() => setViewer(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }}><X size={14} color={C.muted} /></button>
            </div>
            <div className="flex-1 overflow-auto p-3 flex items-center justify-center" style={{ background: C.bg }}>
              {viewer.loading ? <p className="text-sm" style={{ color: C.muted }}>{tt("Ap chaje dokiman an...")}</p>
                : viewer.doc.mimeType === 'application/pdf'
                  ? <iframe title="dokiman" src={`data:application/pdf;base64,${viewer.doc.fileData}`} style={{ width: '100%', height: '100%', border: 0, background: '#fff' }} />
                  : <img src={`data:${viewer.doc.mimeType};base64,${viewer.doc.fileData}`} alt={tt("Dokiman")} className="max-w-full max-h-full rounded-lg object-contain" />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// KONFÒMITE — Siveyans, Rekonsilyasyon, Jounal odit (sipè admin sèlman).
// ---------------------------------------------------------------------------
const RULE_LABELS = {
  large_tx: 'Gwo montan',
  velocity: 'Anpil operasyon an 24è',
  rapid_cashout: 'Depo epi retrè rapid',
  structuring: 'Montan jis anba papòt la',
  unverified_inflow: 'Kont pa verifye k ap resevwa anpil',
};
const RULE_HELP = {
  large_tx: 'Yon sèl operasyon ≥ {0}',
  velocity: '≥ {0} retrè/transfè nan 24 è',
  rapid_cashout: 'Retrè ≥ {0}% yon depo, nan 24 è apre l',
  structuring: '≥ {0} operasyon ant {1} ak {2} nan 7 jou',
  unverified_inflow: 'Kont pa verifye ki resevwa ≥ {0} an 7 jou',
};
const SEV_STYLE = { high: ['#FBEBE6', '#B5482E', 'Wo'], medium: ['#FBF0DE', '#8A6423', 'Mwayen'], low: ['#E6F0FB', '#143A73', 'Ba'] };
const KIND_LABEL = { deposit: 'Depo@@one', withdrawal: 'Retrè@@one', transfer: 'Transfè@@one' };
const STATUS_STYLE = { confirmed: ['#E4F5EF', '#1E7A5F', 'Konfime'], pending: ['#FBF0DE', '#8A6423', 'Ap tann'], rejected: ['#FBEBE6', '#B5482E', 'Rejte@@status'] };

function fmtDateTime(d) {
  return new Date(d).toLocaleString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function downloadCsv(filename, header, rows) {
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function PageHead({ icon: Icon, title, sub, right }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ marginBottom: 20 }}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.navyDeep }}><Icon size={20} color={C.gold} /></div>
        <div>
          <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24, color: C.ink }}>{title}</h1>
          <p className="text-sm" style={{ color: C.muted, marginTop: 2 }}>{sub}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

function Pill({ bg, fg, children }) {
  return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: bg, color: fg }}>{children}</span>;
}

function ClientCell({ u }) {
  if (!u) return <span style={{ color: C.muted }}>—</span>;
  return (
    <div>
      <p className="font-semibold flex items-center gap-1" style={{ color: C.ink }}>{u.fullName}{u.verified ? <BadgeCheck size={13} color={C.sky} /> : null}</p>
      <p className="text-[11px]" style={{ ...fontMono, color: C.muted }}>{u.clientId || u.phone || ''}</p>
    </div>
  );
}

// ------------------------------ SIVEYANS ------------------------------
function MonitoringPage({ token, flash }) {
  const [tab, setTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [counts, setCounts] = useState({});
  const [rules, setRules] = useState(null);
  const [alertFilter, setAlertFilter] = useState('open');
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(null); // { id, status }
  const [note, setNote] = useState('');
  const [tx, setTx] = useState([]);
  const [totals, setTotals] = useState(null);
  const [f, setF] = useState({ kind: 'all', status: 'all', days: 30, q: '', min: '' });

  async function loadAlerts() {
    setLoading(true);
    try {
      const r = await apiFetch(`/admin/monitoring/alerts?status=${alertFilter}`, { token });
      setAlerts(r.alerts); setCounts(r.counts || {}); setRules(r.rules);
    } catch (e) { flash(e.message); } finally { setLoading(false); }
  }
  async function loadTx() {
    setLoading(true);
    try {
      const from = new Date(Date.now() - f.days * 86400000).toISOString();
      const qs = new URLSearchParams({ from, kind: f.kind, status: f.status, q: f.q, min: f.min || '0' });
      const r = await apiFetch(`/admin/monitoring/transactions?${qs}`, { token });
      setTx(r.transactions); setTotals(r.totals);
    } catch (e) { flash(e.message); } finally { setLoading(false); }
  }
  React.useEffect(() => { if (tab === 'alerts') loadAlerts(); }, [tab, alertFilter]);
  React.useEffect(() => { if (tab === 'tx') loadTx(); }, [tab, f.kind, f.status, f.days]);

  async function decide() {
    try {
      await apiFetch(`/admin/monitoring/alerts/${reviewing.id}`, { method: 'PATCH', token, body: { status: reviewing.status, note } });
      flash(tt('Alèt la mete ajou.'));
      setReviewing(null); setNote('');
      loadAlerts();
    } catch (e) { flash(e.message); }
  }

  function exportTx() {
    downloadCsv(`blicpay-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Date', 'Type', 'Reference', 'Client', 'Client ID', 'Counterparty', 'Method', 'Amount HTG', 'Fee HTG', 'Status'],
      tx.map((r) => [new Date(r.createdAt).toISOString(), r.kind, r.reference, r.user?.fullName, r.user?.clientId, r.counterparty?.fullName || '', r.method, r.amount, r.fee || 0, r.status]));
  }

  const ruleHelp = (k) => {
    if (!rules) return '';
    if (k === 'large_tx') return tt(RULE_HELP.large_tx, money(rules.LARGE_TX));
    if (k === 'velocity') return tt(RULE_HELP.velocity, rules.VELOCITY_COUNT);
    if (k === 'rapid_cashout') return tt(RULE_HELP.rapid_cashout, Math.round(rules.RAPID_CASHOUT_RATIO * 100));
    if (k === 'structuring') return tt(RULE_HELP.structuring, rules.STRUCTURING_COUNT, money(rules.LARGE_TX * rules.STRUCTURING_MIN_RATIO), money(rules.LARGE_TX));
    return tt(RULE_HELP.unverified_inflow, money(rules.UNVERIFIED_INFLOW));
  };

  return (
    <div className="fadein">
      <PageHead icon={ShieldAlert} title={tt('Siveyans tranzaksyon')} sub={tt('Alèt otomatik (AML) ak tout operasyon yo nan yon sèl kote — chak alèt dwe egzamine epi fèmen ak yon nòt.')}
        right={<div className="flex p-1 rounded-full" style={{ background: '#EEF1F6' }}>
          {[['alerts', tt('Alèt')], ['tx', tt('Tranzaksyon')]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className="px-4 py-1.5 rounded-full text-sm font-semibold" style={tab === id ? { background: '#fff', color: C.ink, boxShadow: '0 1px 3px rgba(0,0,0,.08)' } : { color: C.muted }}>
              {label}{id === 'alerts' && counts.open ? <span className="ml-1.5 text-[10px] px-1.5 rounded-full text-white" style={{ background: C.danger }}>{counts.open}</span> : null}
            </button>
          ))}
        </div>} />

      {tab === 'alerts' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[['open', tt('Ouvè'), C.danger, AlertCircle], ['escalated', tt('Eskalade'), C.purple, ShieldAlert], ['reviewed', tt('Fèmen@@closed'), C.mint, Check]].map(([s, label, color, Icon]) => (
              <button key={s} onClick={() => setAlertFilter(s)} className="bp-btn text-left bg-white rounded-xl p-4 flex items-center gap-3" style={{ border: `1px solid ${alertFilter === s ? color : C.border}` }}>
                <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}><Icon size={17} color={color} /></span>
                <div><p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{label}</p><p style={{ ...fontMono, fontSize: 20, fontWeight: 800 }}>{counts[s] || 0}</p></div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl mt-4 overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            {loading ? <p className="p-6 text-sm" style={{ color: C.muted }}>{tt('Ap chaje...')}</p> : alerts.length === 0 ? (
              <div className="p-10 text-center"><Check size={28} color={C.mint} className="mx-auto" /><p className="text-sm mt-2" style={{ color: C.muted }}>{tt('Pa gen alèt nan kategori sa a.')}</p></div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><Th>{tt('Gravite')}</Th><Th>{tt('Règ')}</Th><Th>{tt('Kliyan')}</Th><Th align="right">{tt('Montan')}</Th><Th>{tt('Detay')}</Th><Th>{tt('Dat')}</Th><Th align="right">{tt('Aksyon')}</Th></tr></thead>
                <tbody>
                  {alerts.map((a) => {
                    const [bg, fg, sev] = SEV_STYLE[a.severity] || SEV_STYLE.low;
                    return (
                      <React.Fragment key={a.id}>
                        <tr>
                          <Td><Pill bg={bg} fg={fg}>{tt(sev)}</Pill></Td>
                          <Td><span className="font-semibold">{tt(RULE_LABELS[a.rule] || a.rule)}</span></Td>
                          <Td><ClientCell u={a.user} /></Td>
                          <Td align="right"><span className="whitespace-nowrap" style={{ ...fontMono, fontWeight: 700 }}>{a.amount != null ? money(a.amount) : '—'}</span></Td>
                          <Td><span className="text-[11px]" style={{ ...fontMono, color: C.muted }}>{a.details?.reference || a.details?.references?.slice(0, 3).join(', ') || (a.details?.deposit ? `${a.details.deposit} → ${a.details.withdrawal}` : '')}</span></Td>
                          <Td><span className="text-xs" style={{ color: C.muted }}>{fmtDateTime(a.createdAt)}</span></Td>
                          <Td align="right">
                            {a.status === 'open' ? (
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => { setReviewing({ id: a.id, status: 'reviewed' }); setNote(''); }} className="bp-btn px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: C.mint }}>{tt('Fèmen alèt')}</button>
                                <button onClick={() => { setReviewing({ id: a.id, status: 'escalated' }); setNote(''); }} className="bp-btn px-2.5 py-1 rounded-md text-xs font-semibold" style={{ border: `1px solid ${C.border}`, color: C.purple }}>{tt('Eskalade@@btn')}</button>
                              </div>
                            ) : (
                              <span className="text-[11px]" style={{ color: C.muted }} title={a.note || ''}>{a.status === 'reviewed' ? tt('Fèmen@@closed') : tt('Eskalade')} · {a.reviewedAt ? fmtDateTime(a.reviewedAt) : ''}</span>
                            )}
                          </Td>
                        </tr>
                        {reviewing?.id === a.id && (
                          <tr><td colSpan={7} style={{ padding: '10px 14px', background: '#F7F9FC', borderTop: `1px solid ${C.border}` }}>
                            <div className="flex flex-col md:flex-row gap-2">
                              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={tt('Nòt obligatwa: kisa ou verifye, ki desizyon…')} className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ border: `1px solid ${C.border}` }} />
                              <button onClick={decide} disabled={!note.trim()} className="bp-btn px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: C.navy }}>{reviewing.status === 'reviewed' ? tt('Konfime fèmti') : tt('Konfime eskalasyon')}</button>
                              <button onClick={() => setReviewing(null)} className="px-3 py-2 rounded-lg text-sm" style={{ color: C.muted }}>{tt('Anile')}</button>
                            </div>
                          </td></tr>
                        )}
                        {a.note && reviewing?.id !== a.id && a.status !== 'open' && (
                          <tr><td colSpan={7} style={{ padding: '0 14px 10px', fontSize: 12, color: C.muted }}>📝 {a.note}</td></tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-xl mt-4 p-5" style={{ border: `1px solid ${C.border}` }}>
            <p className="text-sm font-bold flex items-center gap-2"><Gauge size={16} color={C.navy} />{tt('Règ siveyans aktif')}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {Object.keys(RULE_LABELS).map((k) => (
                <div key={k} className="rounded-lg p-3" style={{ background: '#F7F9FC', border: `1px solid ${C.border}` }}>
                  <p className="text-sm font-semibold">{tt(RULE_LABELS[k])}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{ruleHelp(k)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'tx' && (
        <>
          <div className="bg-white rounded-xl p-4 flex flex-wrap gap-2 items-center" style={{ border: `1px solid ${C.border}` }}>
            <select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })} className="px-3 py-2 rounded-lg text-sm bg-white" style={{ border: `1px solid ${C.border}` }}>
              <option value="all">{tt('Tout tip')}</option><option value="deposit">{tt('Depo')}</option><option value="withdrawal">{tt('Retrè')}</option><option value="transfer">{tt('Transfè')}</option>
            </select>
            <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="px-3 py-2 rounded-lg text-sm bg-white" style={{ border: `1px solid ${C.border}` }}>
              <option value="all">{tt('Tout estati')}</option><option value="confirmed">{tt('Konfime')}</option><option value="pending">{tt('Ap tann')}</option><option value="rejected">{tt('Rejte@@status')}</option>
            </select>
            <select value={f.days} onChange={(e) => setF({ ...f, days: Number(e.target.value) })} className="px-3 py-2 rounded-lg text-sm bg-white" style={{ border: `1px solid ${C.border}` }}>
              {[7, 30, 90, 365].map((d) => <option key={d} value={d}>{tt('{0} dènye jou', d)}</option>)}
            </select>
            <input value={f.min} onChange={(e) => setF({ ...f, min: e.target.value.replace(/\D/g, '') })} placeholder={tt('Montan min.')} className="w-32 px-3 py-2 rounded-lg text-sm" style={{ border: `1px solid ${C.border}` }} />
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.muted} />
              <input value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && loadTx()} placeholder={tt('Non, telefòn, ID oswa referans')} className="w-full pl-9 pr-3 py-2 rounded-lg text-sm" style={{ border: `1px solid ${C.border}` }} />
            </div>
            <button onClick={loadTx} className="bp-btn px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5" style={{ border: `1px solid ${C.border}` }}><Filter size={14} />{tt('Filtre')}</button>
            <button onClick={exportTx} disabled={!tx.length} className="bp-btn px-3 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-50" style={{ background: C.navy }}><Download size={14} />CSV</button>
          </div>
          {totals && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {[[tt('Operasyon'), String(totals.count)], [tt('Depo konfime'), money(totals.deposits)], [tt('Retrè konfime'), money(totals.withdrawals)], [tt('Transfè'), money(totals.transfers)]].map(([l, v]) => (
                <div key={l} className="bg-white rounded-xl p-4" style={{ border: `1px solid ${C.border}` }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{l}</p>
                  <p style={{ ...fontMono, fontSize: 18, fontWeight: 800, marginTop: 4 }}>{v}</p>
                </div>
              ))}
            </div>
          )}
          <div className="bg-white rounded-xl mt-3 overflow-x-auto" style={{ border: `1px solid ${C.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead><tr><Th>{tt('Dat')}</Th><Th>{tt('Tip')}</Th><Th>{tt('Referans')}</Th><Th>{tt('Kliyan')}</Th><Th>{tt('Kontrepati')}</Th><Th>{tt('Metòd')}</Th><Th align="right">{tt('Montan')}</Th><Th>{tt('Estati')}</Th></tr></thead>
              <tbody>
                {loading ? <EmptyRow colSpan={8}>{tt('Ap chaje...')}</EmptyRow> : tx.length === 0 ? <EmptyRow colSpan={8}>{tt('Pa gen okenn rezilta.')}</EmptyRow> : tx.map((r) => {
                  const [bg, fg, st] = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
                  return (
                    <tr key={r.kind + r.id}>
                      <Td><span className="text-xs whitespace-nowrap">{fmtDateTime(r.createdAt)}</span></Td>
                      <Td><span className="font-semibold">{tt(KIND_LABEL[r.kind])}</span></Td>
                      <Td><span className="text-[11px]" style={fontMono}>{r.reference}</span></Td>
                      <Td><ClientCell u={r.user} /></Td>
                      <Td>{r.counterparty ? <ClientCell u={r.counterparty} /> : <span style={{ color: C.muted }}>—</span>}</Td>
                      <Td><span className="text-xs">{r.method === 'biwo' ? tt('Nan biwo') : r.method === 'blicpay' ? 'BLICPay' : r.method}{r.branch ? ` · ${r.branch}` : ''}</span></Td>
                      <Td align="right"><span className="whitespace-nowrap" style={{ ...fontMono, fontWeight: 700 }}>{money(r.amount)}</span>{r.fee ? <p className="text-[10px]" style={{ color: C.muted }}>+{money(r.fee)}</p> : null}</Td>
                      <Td><Pill bg={bg} fg={fg}>{tt(st)}</Pill></Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------------------ REKONSILYASYON ------------------------------
function ReconciliationPage({ token, flash }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState('');

  async function load() {
    setLoading(true);
    try { setData(await apiFetch('/admin/reconciliation', { token })); } catch (e) { flash(e.message); } finally { setLoading(false); }
  }
  React.useEffect(() => { load(); }, []);

  async function saveReserve(method) {
    try {
      await apiFetch(`/admin/reserves/${method}`, { method: 'PATCH', token, body: { balance: Number(value) } });
      flash(tt('Rezèv la mete ajou.'));
      setEditing(null);
      load();
    } catch (e) { flash(e.message); }
  }

  const ASSETS = [['moncash', tt('Kont operasyonèl MonCash')], ['natcash', tt('Kont operasyonèl NatCash')], ['bank', tt('Kont bank (fon kliyan)')], ['cash', tt('Kach nan biwo yo')]];
  const LIABS = [['clientBalances', tt('Balans kliyan yo')], ['pockets', tt('Pòch (BLIC Depo)')], ['savingsGoals', tt('Objektif epay')], ['pendingWithdrawals', tt('Retrè annatant (poko voye)')]];
  const ok = data && data.difference >= 0;
  const coverage = data?.coverage != null ? Math.round(data.coverage * 1000) / 10 : null;

  return (
    <div className="fadein">
      <PageHead icon={Scale} title={tt('Rekonsilyasyon fon')} sub={tt('Lajan kliyan yo dwe (pasif) konpare ak lajan BLICPay kenbe reyèlman (aktif).')}
        right={<button onClick={load} className="bp-btn px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 bg-white" style={{ border: `1px solid ${C.border}` }}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{tt('Rafrechi')}</button>} />
      {!data ? <p className="text-sm" style={{ color: C.muted }}>{tt('Ap chaje...')}</p> : (
        <>
          <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: ok ? 'linear-gradient(120deg, #0F5C47, #1E9E7C)' : 'linear-gradient(120deg, #7A2A18, #B5482E)' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {ok ? <ShieldCheck size={30} /> : <AlertCircle size={30} />}
                <div>
                  <p className="text-lg font-bold">{ok ? tt('Fon kliyan yo kouvri') : tt('Ekar — fon yo pa kouvri nèt')}</p>
                  <p className="text-xs opacity-80">{tt('Kalkile {0}', fmtDateTime(data.asOf))} · {tt('{0} kliyan', data.clients)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest opacity-80">{tt('Kouvèti')}</p>
                <p style={{ ...fontMono, fontSize: 30, fontWeight: 800 }}>{coverage != null ? `${coverage}%` : '—'}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
              <div className="px-5 py-3 flex justify-between items-center" style={{ borderBottom: `1px solid ${C.border}` }}>
                <p className="text-sm font-bold">{tt('Pasif — lajan kliyan yo')}</p><Users size={16} color={C.muted} />
              </div>
              {LIABS.map(([k, label]) => (
                <div key={k} className="px-5 py-3 flex justify-between text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <span>{label}</span><span style={{ ...fontMono, fontWeight: 700 }}>{money(data.liabilities[k])}</span>
                </div>
              ))}
              <div className="px-5 py-3.5 flex justify-between text-sm font-bold" style={{ background: '#F7F9FC' }}>
                <span>{tt('Total pasif')}</span><span style={fontMono}>{money(data.totalLiabilities)}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
              <div className="px-5 py-3 flex justify-between items-center" style={{ borderBottom: `1px solid ${C.border}` }}>
                <p className="text-sm font-bold">{tt('Aktif — lajan BLICPay kenbe')}</p><Landmark size={16} color={C.muted} />
              </div>
              {ASSETS.map(([m, label]) => {
                const r = data.reserves.find((x) => x.method === m);
                return (
                  <div key={m} className="px-5 py-3 flex justify-between items-center text-sm gap-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <p>{label}</p>
                      <p className="text-[10px]" style={{ color: C.muted }}>{r?.updatedAt ? tt('Mete ajou {0}', fmtDateTime(r.updatedAt)) : tt('Poko antre')}</p>
                    </div>
                    {editing === m ? (
                      <div className="flex gap-1.5">
                        <input autoFocus value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))} className="w-32 px-2 py-1 rounded-md text-sm text-right" style={{ ...fontMono, border: `1px solid ${C.border}` }} />
                        <button onClick={() => saveReserve(m)} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: C.navy }}>{tt('Anrejistre')}</button>
                        <button onClick={() => setEditing(null)} className="px-1.5 text-xs" style={{ color: C.muted }}><X size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditing(m); setValue(String(data.assets[m] || '')); }} className="flex items-center gap-2 group" title={tt('Modifye')}>
                        <span style={{ ...fontMono, fontWeight: 700 }}>{money(data.assets[m])}</span>
                        <KeyRound size={12} color={C.muted} />
                      </button>
                    )}
                  </div>
                );
              })}
              <div className="px-5 py-3.5 flex justify-between text-sm font-bold" style={{ background: '#F7F9FC' }}>
                <span>{tt('Total aktif')}</span><span style={fontMono}>{money(data.totalAssets)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl mt-4 px-5 py-4 flex flex-col md:flex-row justify-between gap-3" style={{ border: `1px solid ${ok ? C.border : C.danger}` }}>
            <div>
              <p className="text-sm font-bold">{tt('Ekar (aktif − pasif)')}</p>
              <p className="text-xs" style={{ color: C.muted }}>{tt('Pozitif = BLICPay kenbe plis pase sa li dwe. Negatif = mank pou eksplike.')}</p>
            </div>
            <p style={{ ...fontMono, fontSize: 22, fontWeight: 800, color: ok ? C.mint : C.danger }}>{data.difference >= 0 ? '+' : '−'}{money(Math.abs(data.difference))}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${C.border}` }}>
              <p className="font-semibold">{tt('Depo annatant')}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{tt('{0} depo · {1} — poko konte nan pasif la jiskaske yo konfime.', data.pending.depositsCount, money(data.pending.depositsAmount))}</p>
            </div>
            <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${C.border}` }}>
              <p className="font-semibold">{tt('Retrè annatant')}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{tt('{0} retrè — deja retire nan balans kliyan yo, men lajan an poko soti.', data.pending.withdrawalsCount)}</p>
            </div>
          </div>
          <p className="text-xs mt-4" style={{ color: C.muted }}>{tt('Metòd: rezèv yo antre alamen apre chak verifikasyon kont MonCash, NatCash, bank ak kès biwo yo. Rekonsilyasyon an dwe fèt omwen chak jou.')}</p>
        </>
      )}
    </div>
  );
}

// ------------------------------ JOUNAL ODIT ------------------------------
const AUDIT_ACTIONS = [
  [/^LOGIN/, 'Koneksyon'],
  [/^POST \/deposits\/:id\/confirm/, 'Konfime depo@@audit'],
  [/^POST \/deposits\/:id\/reject/, 'Rejte depo'],
  [/^POST \/withdrawals\/:id\/confirm/, 'Konfime retrè@@audit'],
  [/^POST \/withdrawals\/:id\/reject/, 'Rejte retrè'],
  [/\/users\/:id\/block/, 'Bloke / debloke kont'],
  [/\/users\/:id\/verify/, 'Chanje verifikasyon kont'],
  [/\/users\/:id\/adjust-balance/, 'Ajiste balans'],
  [/\/kyc\/(didit\/)?:id\/approve/, 'Apwouve KYC'],
  [/\/kyc\/(didit\/)?:id\/reject/, 'Rejte KYC'],
  [/\/kyc\/didit\/:id\/refresh/, 'Rafrechi rapò KYC'],
  [/\/businesses\/:id\/approve/, 'Apwouve antrepriz'],
  [/\/businesses\/:id\/reject/, 'Refize antrepriz'],
  [/\/businesses\/:id\/request-info/, 'Mande enfòmasyon antrepriz'],
  [/\/businesses\/:id\/documents/, 'Desizyon sou dokiman antrepriz'],
  [/\/verification-requests/, 'Demand dokiman siplemantè'],
  [/^POST \/agents$/, 'Kreye ajan'],
  [/^(PATCH|PUT) \/agents/, 'Modifye ajan@@audit'],
  [/^DELETE \/agents/, 'Efase ajan'],
  [/^POST \/branches$/, 'Kreye siikisal'],
  [/^(PATCH|PUT) \/branches/, 'Modifye siikisal@@audit'],
  [/^DELETE \/branches/, 'Efase siikisal'],
  [/\/reserves\/:method/, 'Mete rezèv ajou'],
  [/\/monitoring\/alerts/, 'Desizyon sou alèt'],
  [/\/support/, 'Mesaj sipò'],
];
function auditAction(l) {
  const key = `${l.method} ${l.route || l.path.replace(/^\/admin/, '')}`;
  const hit = AUDIT_ACTIONS.find(([re]) => re.test(key));
  return hit ? tt(hit[1]) : `${l.method} ${l.path}`;
}

function AuditPage({ token, flash }) {
  const [logs, setLogs] = useState([]);
  const [q, setQ] = useState('');
  const [days, setDays] = useState(30);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    try {
      const from = new Date(Date.now() - days * 86400000).toISOString();
      const r = await apiFetch(`/admin/audit?from=${from}&q=${encodeURIComponent(q)}`, { token });
      setLogs(r.logs);
    } catch (e) { flash(e.message); } finally { setLoading(false); }
  }
  React.useEffect(() => { load(); }, [days]);
  function exportCsv() {
    downloadCsv(`blicpay-audit-${new Date().toISOString().slice(0, 10)}.csv`, ['Date', 'Actor', 'Role', 'Action', 'Method', 'Path', 'Target', 'IP', 'Details'],
      logs.map((l) => [new Date(l.createdAt).toISOString(), l.actorName, l.actorRole, auditAction(l), l.method, l.path, l.targetId, l.ip, l.details ? JSON.stringify(l.details) : '']));
  }
  return (
    <div className="fadein">
      <PageHead icon={ScrollText} title={tt('Jounal odit')} sub={tt('Chak aksyon admin ak ajan anrejistre otomatikman — kiyès, kisa, kilè, ki kote. Jounal la pa ka modifye ni efase.')}
        right={<div className="flex gap-2">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="px-3 py-2 rounded-lg text-sm bg-white" style={{ border: `1px solid ${C.border}` }}>
            {[7, 30, 90].map((d) => <option key={d} value={d}>{tt('{0} dènye jou', d)}</option>)}
          </select>
          <button onClick={exportCsv} disabled={!logs.length} className="bp-btn px-3 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-50" style={{ background: C.navy }}><Download size={14} />CSV</button>
        </div>} />
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.muted} />
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} placeholder={tt('Chèche yon moun oswa yon aksyon')} className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-white" style={{ border: `1px solid ${C.border}` }} />
      </div>
      <div className="bg-white rounded-xl overflow-x-auto" style={{ border: `1px solid ${C.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
          <thead><tr><Th>{tt('Dat ak lè')}</Th><Th>{tt('Kiyès')}</Th><Th>{tt('Aksyon')}</Th><Th>{tt('Sib')}</Th><Th>IP</Th><Th align="right">{tt('Detay')}</Th></tr></thead>
          <tbody>
            {loading ? <EmptyRow colSpan={6}>{tt('Ap chaje...')}</EmptyRow> : logs.length === 0 ? <EmptyRow colSpan={6}>{tt('Pa gen aksyon anrejistre pou peryòd sa a.')}</EmptyRow> : logs.map((l) => (
              <React.Fragment key={l.id}>
                <tr>
                  <Td><span className="text-xs whitespace-nowrap" style={fontMono}>{fmtDateTime(l.createdAt)}</span></Td>
                  <Td><p className="font-semibold">{l.actorName || '—'}</p><p className="text-[11px]" style={{ color: C.muted }}>{l.actorRole === 'agent' ? tt('Ajan@@one') : tt('Admin')}</p></Td>
                  <Td><span className="font-semibold" style={{ color: l.method === 'DELETE' ? C.danger : C.ink }}>{auditAction(l)}</span></Td>
                  <Td><span className="text-[11px]" style={{ ...fontMono, color: C.muted }}>{l.targetId ? `…${l.targetId.slice(-8)}` : '—'}</span></Td>
                  <Td><span className="text-[11px]" style={{ ...fontMono, color: C.muted }}>{l.ip || '—'}</span></Td>
                  <Td align="right">{l.details ? <button onClick={() => setOpen(open === l.id ? null : l.id)} className="text-xs font-semibold" style={{ color: C.navy }}>{open === l.id ? tt('Kache') : tt('Wè')}</button> : <span style={{ color: C.muted }}>—</span>}</Td>
                </tr>
                {open === l.id && (
                  <tr><td colSpan={6} style={{ padding: '8px 14px 12px', background: '#F7F9FC' }}><pre className="text-[11px] whitespace-pre-wrap" style={fontMono}>{JSON.stringify(l.details, null, 2)}</pre></td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BlicPayAdmin() {
  const [lang, setLangState] = useState(CURRENT_LANG);
  const setLang = (l) => { setLangState(l); try { localStorage.setItem('blicpay_admin_lang', l); } catch { /* pa enpòtan */ } };
  CURRENT_LANG = lang;
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [nav, setNav] = useState('overview');

  // Retounen anlè paj la chak fwa n chanje onglè — meni an rete vizib
  // (li fikse anlè), se sèlman kontni anba a ki bezwen remonte.
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [nav]);

  // Lè reyèl pou tèt anlè a — mete ajou chak segonn, se yon vrè lè aparèy la,
  // pa yon done ki soti nan backend lan.
  const [clock, setClock] = useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Rafrechi notifikasyon yo chak minit pandan sesyon an aktif — pa gen
  // rezon rele API a pi souvan pase sa pou yon bagay ki pa vrèman "tan reyèl".
  React.useEffect(() => {
    if (!token) return;
    const id = setInterval(() => loadNotifications(), 60000);
    return () => clearInterval(id);
  }, [token]);

  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');

  // Depo
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loadingDepositHistory, setLoadingDepositHistory] = useState(false);
  const [depositView, setDepositView] = useState('pending'); // 'pending' | 'history'
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loadingWithdrawalHistory, setLoadingWithdrawalHistory] = useState(false);
  const [withdrawalView, setWithdrawalView] = useState('pending'); // 'pending' | 'history'
  const [solPayouts, setSolPayouts] = useState([]);
  const [loadingSolPayouts, setLoadingSolPayouts] = useState(false);
  const [reserves, setReserves] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [editingReserveMethod, setEditingReserveMethod] = useState(null);
  const [reserveInput, setReserveInput] = useState('');
  const [savingReserve, setSavingReserve] = useState(false);
  const [confirmed, setConfirmed] = useState([]);

  // Retrait
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

  // Objektif
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(false);

  // Prè
  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  // Transfè
  const [transfers, setTransfers] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(false);

  // Sòl
  const [solRequests, setSolRequests] = useState([]);
  const [loadingSol, setLoadingSol] = useState(false);
  const [solGroups, setSolGroups] = useState([]);
  const [solFreqFilter, setSolFreqFilter] = useState('all');
  const [solTierFilter, setSolTierFilter] = useState('all');
  const [selectedSolGroup, setSelectedSolGroup] = useState(null);
  const [solGroupMembers, setSolGroupMembers] = useState(null);
  const [approvingSolId, setApprovingSolId] = useState(null);

  // KYC
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [kycDetail, setKycDetail] = useState(null);
  const [kycRejectReason, setKycRejectReason] = useState('');
  const [kycRefreshing, setKycRefreshing] = useState(false);

  // Itilizatè
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  // Chanje modpas pwòp kont admin/ajan an
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const [confirmingDeposit, setConfirmingDeposit] = useState(null);
  const [confirmingWithdrawal, setConfirmingWithdrawal] = useState(null);
  const [withdrawalProofFile, setWithdrawalProofFile] = useState(null);
  const [confirmingWithdrawalBusy, setConfirmingWithdrawalBusy] = useState(false);
  const [financeData, setFinanceData] = useState(null);
  const [financePeriod, setFinancePeriod] = useState('month');
  const [loadingFinance, setLoadingFinance] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [agentForm, setAgentForm] = useState({ fullName: '', phone: '', password: '', branch: '', email: '', idNumber: '', hireDate: '' });
  const [agentPhotoFile, setAgentPhotoFile] = useState(null);
  const [editingAgentId, setEditingAgentId] = useState(null); // null = kreye nouvo, id = modifye youn ki egziste
  const [existingAgentPhoto, setExistingAgentPhoto] = useState(null); // { photoImage, photoMimeType } lè n ap modifye
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchForm, setBranchForm] = useState({ name: '', address: '', phone: '', managerName: '', openingHours: '' });
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null); // null = kreye nouvo, id = modifye youn ki egziste
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [solDocTitle, setSolDocTitle] = useState('');
  const [solDocFile, setSolDocFile] = useState(null);
  const [solDocUploadingFor, setSolDocUploadingFor] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  // Demand verifikasyon siplemantè (prèv adrès, elt.) — apa de KYC/Didit
  const [vrPending, setVrPending] = useState([]);
  const [loadingVr, setLoadingVr] = useState(false);
  const [selectedVr, setSelectedVr] = useState(null);
  const [selectedFinanceBranch, setSelectedFinanceBranch] = useState(null); // [non, stats] siikisal ki louvri a dwat
  const [vrRejectReason, setVrRejectReason] = useState('');
  const [userVrRequests, setUserVrRequests] = useState(null);
  const [newVrType, setNewVrType] = useState('address_proof');
  const [newVrNote, setNewVrNote] = useState('');
  const [creatingVr, setCreatingVr] = useState(false);

  // Mesaj sipò kliyan yo voye (soti nan "Kontakte sipò" nan Paramèt kliyan an)
  const [supportMessages, setSupportMessages] = useState([]);
  const [loadingSupport, setLoadingSupport] = useState(false);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  async function loadPending(authToken) {
    if (authToken === DEMO_TOKEN) return;
    setLoadingPending(true);
    try {
      const { deposits } = await apiFetch('/admin/deposits/pending', { token: authToken });
      setPending(deposits.map((d) => ({
        id: d.id, user: d.user.fullName, phone: d.user.phone, method: d.method,
        amount: d.amount, reference: d.reference, date: new Date(d.createdAt).toLocaleString('fr-FR'),
        branch: d.branch,
      })));
    } catch (err) { flash(err.message); } finally { setLoadingPending(false); }
  }

  async function loadDepositHistory(authToken = token) {
    setLoadingDepositHistory(true);
    try {
      const { deposits } = await apiFetch('/admin/deposits/history', { token: authToken });
      setDepositHistory(deposits.map((d) => ({
        id: d.id, user: d.user.fullName, phone: d.user.phone, method: d.method,
        amount: d.amount, reference: d.reference, status: d.status, branch: d.branch,
        date: new Date(d.createdAt).toLocaleString('fr-FR'),
      })));
    } catch (err) { flash(err.message); } finally { setLoadingDepositHistory(false); }
  }

  async function loadWithdrawalHistory(authToken = token) {
    setLoadingWithdrawalHistory(true);
    try {
      const { withdrawals: ws } = await apiFetch('/admin/withdrawals/history', { token: authToken });
      setWithdrawalHistory(ws.map((w) => ({
        id: w.id, user: w.user.fullName, phone: w.user.phone, method: w.method,
        amount: w.amount, reference: w.reference, status: w.status, branch: w.branch,
        destinationNumber: w.destinationNumber, destinationName: w.destinationName,
        date: new Date(w.createdAt).toLocaleString('fr-FR'),
      })));
    } catch (err) { flash(err.message); } finally { setLoadingWithdrawalHistory(false); }
  }

  async function loadSolPayouts(authToken = token) {
    setLoadingSolPayouts(true);
    try {
      const { payouts } = await apiFetch('/admin/sol/payouts', { token: authToken });
      setSolPayouts(payouts);
    } catch (err) { flash(err.message); } finally { setLoadingSolPayouts(false); }
  }

  async function loadReserves(authToken = token) {
    try {
      const { reserves: r } = await apiFetch('/admin/reserves', { token: authToken });
      setReserves(r);
    } catch (err) { flash(err.message); }
  }

  async function loadExchangeRate(authToken = token) {
    try {
      const { rate, rateDate } = await apiFetch('/admin/exchange-rate', { token: authToken });
      setExchangeRate({ rate, rateDate });
    } catch (err) {
      // Silans — se yon akseswa afichay, pa yon fonksyonalite kritik.
    }
  }

  async function loadNotifications(authToken = token) {
    try {
      const { notifications: n, unreadCount: c } = await apiFetch('/admin/notifications', { token: authToken });
      setNotifications(n);
      setUnreadCount(c);
    } catch (err) {
      // Silans — pa deranje admin an ak yon erè pou sa.
    }
  }

  async function markNotificationRead(id) {
    setNotifications((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await apiFetch(`/admin/notifications/${id}/read`, { method: 'PATCH', token });
    } catch (err) { /* silans */ }
  }

  async function markAllNotificationsRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await apiFetch('/admin/notifications/read-all', { method: 'POST', token });
    } catch (err) { /* silans */ }
  }

  async function saveReserve(method) {
    const numeric = Number(reserveInput);
    if (!Number.isFinite(numeric) || numeric < 0) { flash(tt("Balans lan pa valab.")); return; }
    setSavingReserve(true);
    try {
      const { reserve } = await apiFetch(`/admin/reserves/${method}`, { method: 'PATCH', token, body: { balance: numeric } });
      setReserves((rs) => {
        const others = rs.filter((r) => r.method !== method);
        return [...others, reserve].sort((a, b) => a.method.localeCompare(b.method));
      });
      setEditingReserveMethod(null);
      flash(tt("Rezèv la mete ajou."));
    } catch (err) { flash(err.message); } finally { setSavingReserve(false); }
  }

  async function loadWithdrawals(authToken = token) {
    setLoadingWithdrawals(true);
    try {
      const { withdrawals: ws } = await apiFetch('/admin/withdrawals/pending', { token: authToken });
      setWithdrawals(ws.map((w) => ({
        id: w.id, user: w.user.fullName, phone: w.user.phone, method: w.method,
        amount: w.amount, fee: w.fee || 0, reference: w.reference, date: new Date(w.createdAt).toLocaleString('fr-FR'),
        destinationNumber: w.destinationNumber, destinationName: w.destinationName, branch: w.branch,
        clientId: w.user.clientId, balance: w.user.balance,
      })));
    } catch (err) { flash(err.message); } finally { setLoadingWithdrawals(false); }
  }

  async function loadGoals(authToken = token) {
    setLoadingGoals(true);
    try {
      const { goals: gs } = await apiFetch('/admin/goals', { token: authToken });
      setGoals(gs);
    } catch (err) { flash(err.message); } finally { setLoadingGoals(false); }
  }

  async function loadLoans(authToken = token) {
    setLoadingLoans(true);
    try {
      const { loans: ls } = await apiFetch('/admin/loans', { token: authToken });
      setLoans(ls);
    } catch (err) { flash(err.message); } finally { setLoadingLoans(false); }
  }

  async function loadTransfers(authToken = token) {
    setLoadingTransfers(true);
    try {
      const { transfers: ts } = await apiFetch('/admin/transfers', { token: authToken });
      setTransfers(ts);
    } catch (err) { flash(err.message); } finally { setLoadingTransfers(false); }
  }

  async function loadSol(authToken = token) {
    setLoadingSol(true);
    try {
      if (admin?.role === 'agent') {
        // Yon ajan gen dwa wè gwoup yo sèlman (pou l ka enfòme kliyan lokal
        // yo) — li pa gen aksè a demand k'ap tann apwobasyon yo.
        const { groups } = await apiFetch('/admin/sol/groups', { token: authToken });
        setSolRequests([]);
        setSolGroups(groups);
      } else {
        const [{ requests }, { groups }] = await Promise.all([
          apiFetch('/admin/sol/requests/pending', { token: authToken }),
          apiFetch('/admin/sol/groups', { token: authToken }),
        ]);
        setSolRequests(requests);
        setSolGroups(groups);
      }
    } catch (err) { flash(err.message); } finally { setLoadingSol(false); }
  }

  async function openSolGroup(g) {
    setSelectedSolGroup(g);
    setSolGroupMembers(null);
    try {
      const { members } = await apiFetch(`/admin/sol/groups/${g.id}/members`, { token });
      setSolGroupMembers(members);
    } catch (err) { flash(err.message); }
  }

  async function loadKyc(authToken = token) {
    setLoadingKyc(true);
    try {
      const { verifications } = await apiFetch('/admin/kyc/didit/pending', { token: authToken });
      setKycSubmissions(verifications);
    } catch (err) { flash(err.message); } finally { setLoadingKyc(false); }
  }

  async function openKyc(sub) {
    setSelectedKyc(sub);
    setKycDetail(null);
    setKycRejectReason('');
    try {
      const { verification } = await apiFetch(`/admin/kyc/didit/${sub.id}`, { token });
      setKycDetail(verification);
    } catch (err) { flash(err.message); }
  }

  async function refreshKycFromDidit() {
    if (!selectedKyc) return;
    setKycRefreshing(true);
    try {
      const { verification } = await apiFetch(`/admin/kyc/didit/${selectedKyc.id}/refresh`, { method: 'POST', token });
      setKycDetail(verification);
      flash(tt("Rapò a mete ajou dirèkteman soti nan Didit."));
    } catch (err) { flash(err.message); } finally { setKycRefreshing(false); }
  }

  async function decideKyc(decision) {
    if (!selectedKyc) return;
    if (decision === 'reject' && !kycRejectReason.trim()) {
      flash(tt("Yon rezon obligatwa pou refize."));
      return;
    }
    try {
      if (decision === 'approve') {
        await apiFetch(`/admin/kyc/didit/${selectedKyc.id}/approve`, { method: 'POST', token, body: {} });
        flash(tt("Kliyan an verifye."));
      } else {
        await apiFetch(`/admin/kyc/didit/${selectedKyc.id}/reject`, { method: 'POST', token, body: { reason: kycRejectReason.trim() } });
        flash(tt("Demand lan refize."));
      }
      setSelectedKyc(null);
      setKycDetail(null);
      loadKyc();
    } catch (err) { flash(err.message); }
  }

  const VR_TYPE_LABELS = {
    address_proof: tt("Prèv adrès"),
    income_proof: tt("Prèv revni"),
    identity_reverify: tt("Refè verifikasyon idantite"),
    other: tt("Lòt dokiman"),
  };

  async function loadVerificationRequests(authToken = token) {
    setLoadingVr(true);
    try {
      const { requests } = await apiFetch('/admin/verification-requests?status=submitted', { token: authToken });
      setVrPending(requests);
    } catch (err) { flash(err.message); } finally { setLoadingVr(false); }
  }

  async function decideVerificationRequest(decision) {
    if (!selectedVr) return;
    if (decision === 'reject' && !vrRejectReason.trim()) {
      flash(tt("Yon rezon obligatwa pou refize."));
      return;
    }
    try {
      if (decision === 'approve') {
        await apiFetch(`/admin/verification-requests/${selectedVr.id}/approve`, { method: 'POST', token, body: {} });
        flash(tt("Dokiman an apwouve."));
      } else {
        await apiFetch(`/admin/verification-requests/${selectedVr.id}/reject`, { method: 'POST', token, body: { reason: vrRejectReason.trim() } });
        flash(tt("Demand lan refize."));
      }
      setSelectedVr(null);
      setVrRejectReason('');
      loadVerificationRequests();
      if (selectedUser) loadUserVerificationRequests(selectedUser.id);
    } catch (err) { flash(err.message); }
  }

  async function loadUserVerificationRequests(userId) {
    setUserVrRequests(null);
    try {
      const { requests } = await apiFetch(`/admin/users/${userId}/verification-requests`, { token });
      setUserVrRequests(requests);
    } catch (err) { flash(err.message); }
  }

  async function createVerificationRequest() {
    if (!selectedUser) return;
    setCreatingVr(true);
    try {
      await apiFetch(`/admin/users/${selectedUser.id}/verification-requests`, {
        method: 'POST', token, body: { type: newVrType, note: newVrNote.trim() || undefined },
      });
      flash(tt("Demand voye bay kliyan an."));
      setNewVrNote('');
      loadUserVerificationRequests(selectedUser.id);
    } catch (err) { flash(err.message); } finally { setCreatingVr(false); }
  }

  const SUPPORT_SUBJECT_LABELS = {
    kont: tt("Kont"), depo: tt("Depo"), sol: tt("BLIC Sòl"), pre: tt("Prè"), lot: tt("Lòt"),
  };

  async function loadSupportMessages(authToken = token) {
    setLoadingSupport(true);
    try {
      const { messages } = await apiFetch('/admin/support?status=open', { token: authToken });
      setSupportMessages(messages);
    } catch (err) { flash(err.message); } finally { setLoadingSupport(false); }
  }

  async function closeSupportMessage(id) {
    try {
      await apiFetch(`/admin/support/${id}/close`, { method: 'POST', token, body: {} });
      setSupportMessages((ms) => ms.filter((m) => m.id !== id));
      flash(tt("Mesaj la make rezoud."));
    } catch (err) { flash(err.message); }
  }

  async function loadUsers(authToken = token, search = '') {
    setLoadingUsers(true);
    try {
      const { users: us } = await apiFetch(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token: authToken });
      setUsers(us);
    } catch (err) { flash(err.message); } finally { setLoadingUsers(false); }
  }

  async function loadFinance(p = financePeriod, authToken = token) {
    setLoadingFinance(true);
    try {
      const data = await apiFetch(`/admin/finance/summary?period=${p}`, { token: authToken });
      setFinanceData(data);
    } catch (err) { flash(err.message); } finally { setLoadingFinance(false); }
  }

  async function loadAgents() {
    setLoadingAgents(true);
    try {
      const { agents: ag } = await apiFetch('/admin/agents', { token });
      setAgents(ag);
      await loadBranches();
    } catch (err) { flash(err.message); } finally { setLoadingAgents(false); }
  }

  async function loadBranches() {
    setLoadingBranches(true);
    try {
      const { branches: br } = await apiFetch('/admin/branches', { token });
      setBranches(br);
    } catch (err) { flash(err.message); } finally { setLoadingBranches(false); }
  }

  async function toggleAgentBlock(a) {
    try {
      await apiFetch(`/admin/users/${a.id}/block`, { method: 'PATCH', token, body: { blocked: !a.blocked } });
      setAgents((ags) => ags.map((x) => x.id === a.id ? { ...x, blocked: !a.blocked } : x));
      flash(!a.blocked ? tt("Ajan bloke.") : tt("Ajan debloke."));
    } catch (err) { flash(err.message); }
  }

  async function deleteAgent(a) {
    if (!window.confirm(tt("Efase kont ajan {0} nèt? Aksyon sa a pa ka anile.", a.fullName))) return;
    try {
      await apiFetch(`/admin/agents/${a.id}`, { method: 'DELETE', token });
      setAgents((ags) => ags.filter((x) => x.id !== a.id));
      flash(tt("Ajan efase."));
    } catch (err) { flash(err.message); }
  }

  async function deleteBranch(b) {
    if (!window.confirm(tt("Efase siikisal \"{0}\" nèt? Aksyon sa a pa ka anile.", b.name))) return;
    try {
      await apiFetch(`/admin/branches/${b.id}`, { method: 'DELETE', token });
      setBranches((brs) => brs.filter((x) => x.id !== b.id));
      flash(tt("Siikisal la efase."));
    } catch (err) { flash(err.message); }
  }

  function openBranchEdit(b) {
    setEditingBranchId(b.id);
    setBranchForm({
      name: b.name || '', address: b.address || '', phone: b.phone || '',
      managerName: b.managerName || '', openingHours: b.openingHours || '',
    });
    setShowBranchForm(true);
  }

  async function createBranch() {
    if (!branchForm.name.trim()) {
      flash(tt("Antre non siikisal la."));
      return;
    }
    setCreatingBranch(true);
    try {
      if (editingBranchId) {
        await apiFetch(`/admin/branches/${editingBranchId}`, { method: 'PATCH', token, body: branchForm });
        flash(tt("Siikisal la mete ajou."));
      } else {
        await apiFetch('/admin/branches', { method: 'POST', token, body: branchForm });
        flash(tt("Siikisal la kreye."));
      }
      setBranchForm({ name: '', address: '', phone: '', managerName: '', openingHours: '' });
      setEditingBranchId(null);
      setShowBranchForm(false);
      await loadBranches();
      await loadAgents();
    } catch (err) { flash(err.message); } finally { setCreatingBranch(false); }
  }

  function openAgentEdit(a) {
    setEditingAgentId(a.id);
    setAgentForm({
      fullName: a.fullName || '', phone: a.phone || '', password: '', branch: a.branch || '',
      email: a.email || '', idNumber: a.idNumber || '',
      hireDate: a.hireDate ? a.hireDate.slice(0, 10) : '',
    });
    setExistingAgentPhoto(a.photoImage ? { photoImage: a.photoImage, photoMimeType: a.photoMimeType } : null);
    setAgentPhotoFile(null);
    setShowAgentForm(true);
  }

  async function createAgent() {
    if (!agentForm.fullName.trim() || !agentForm.phone.trim() || (!editingAgentId && !agentForm.password) || !agentForm.branch.trim()) {
      flash(tt("Ranpli tout chan obligatwa yo."));
      return;
    }
    setCreatingAgent(true);
    try {
      let photoImage = existingAgentPhoto?.photoImage || null;
      let photoMimeType = existingAgentPhoto?.photoMimeType || null;
      if (agentPhotoFile) {
        photoImage = await readFileAsBase64(agentPhotoFile);
        photoMimeType = agentPhotoFile.type;
      }
      if (editingAgentId) {
        await apiFetch(`/admin/agents/${editingAgentId}`, { method: 'PATCH', token, body: { ...agentForm, photoImage, photoMimeType } });
        flash(tt("Ajan an mete ajou."));
        setAgents((ags) => ags.map((x) => x.id !== editingAgentId ? x : {
          ...x, fullName: agentForm.fullName.trim(), phone: agentForm.phone.trim(), branch: agentForm.branch.trim(),
          email: agentForm.email?.trim() || null, idNumber: agentForm.idNumber?.trim() || null,
          hireDate: agentForm.hireDate || null, photoImage, photoMimeType,
        }));
      } else {
        await apiFetch('/admin/agents', { method: 'POST', token, body: { ...agentForm, photoImage, photoMimeType } });
        flash(tt("Kont ajan an kreye."));
      }
      setAgentForm({ fullName: '', phone: '', password: '', branch: '', email: '', idNumber: '', hireDate: '' });
      setAgentPhotoFile(null);
      setExistingAgentPhoto(null);
      setEditingAgentId(null);
      setShowAgentForm(false);
      await loadAgents();
    } catch (err) { flash(err.message); } finally { setCreatingAgent(false); }
  }

  async function openUser(u) {
    setSelectedUser(u);
    setUserDetail(null);
    setAdjustAmount('');
    setAdjustReason('');
    setSolDocTitle('');
    setSolDocFile(null);
    setNewVrNote('');
    setNewVrType('address_proof');
    loadUserVerificationRequests(u.id);
    try {
      const detail = await apiFetch(`/admin/users/${u.id}`, { token });
      setUserDetail(detail);
    } catch (err) { flash(err.message); }
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const [, base64] = reader.result.split(',');
        resolve(base64);
      };
      reader.onerror = () => reject(new Error(tt("Nou pa t ka li fichye a.")));
      reader.readAsDataURL(file);
    });
  }

  async function uploadSolDocument(membershipId) {
    if (!solDocTitle.trim()) { flash(tt("Bay dokiman an yon tit.")); return; }
    if (!solDocFile) { flash(tt("Chwazi yon fichye anvan.")); return; }
    setSolDocUploadingFor(membershipId);
    try {
      const fileData = await readFileAsBase64(solDocFile);
      await apiFetch(`/admin/sol/memberships/${membershipId}/documents`, {
        method: 'POST', token,
        body: { title: solDocTitle.trim(), fileData, fileMimeType: solDocFile.type, fileName: solDocFile.name },
      });
      flash(tt("Dokiman an telechaje."));
      setSolDocTitle('');
      setSolDocFile(null);
      if (selectedUser) openUser(selectedUser);
    } catch (err) { flash(err.message); } finally { setSolDocUploadingFor(null); }
  }

  async function toggleSolFormApproved(membershipId, approved) {
    try {
      await apiFetch(`/admin/sol/memberships/${membershipId}/form-approve`, {
        method: 'PATCH', token, body: { approved },
      });
      flash(approved ? tt("Dokiman Sòl konfime.") : tt("Estati dokiman an remèt an atant."));
      if (selectedUser) openUser(selectedUser);
    } catch (err) { flash(err.message); }
  }

  async function toggleBlock(u) {
    try {
      await apiFetch(`/admin/users/${u.id}/block`, { method: 'PATCH', token, body: { blocked: !u.blocked } });
      setUsers((us) => us.map((x) => x.id === u.id ? { ...x, blocked: !u.blocked } : x));
      if (selectedUser?.id === u.id) setSelectedUser((s) => ({ ...s, blocked: !u.blocked }));
      flash(!u.blocked ? tt("Kont bloke.") : tt("Kont debloke."));
    } catch (err) { flash(err.message); }
  }

  async function toggleBeta(u) {
    try {
      await apiFetch(`/admin/users/${u.id}/beta`, { method: 'PATCH', token, body: { betaAccess: !u.betaAccess } });
      setUsers((us) => us.map((x) => x.id === u.id ? { ...x, betaAccess: !u.betaAccess } : x));
      if (selectedUser?.id === u.id) setSelectedUser((s) => ({ ...s, betaAccess: !u.betaAccess }));
      flash(!u.betaAccess ? tt("Aksè tès bay.") : tt("Aksè tès retire."));
    } catch (err) { flash(err.message); }
  }

  async function toggleVerify(u) {
    try {
      await apiFetch(`/admin/users/${u.id}/verify`, { method: 'PATCH', token, body: { verified: !u.verified } });
      setUsers((us) => us.map((x) => x.id === u.id ? { ...x, verified: !u.verified } : x));
      if (selectedUser?.id === u.id) setSelectedUser((s) => ({ ...s, verified: !u.verified }));
      flash(!u.verified ? tt("Kont verifye.") : tt("Verifikasyon retire."));
    } catch (err) { flash(err.message); }
  }

  async function submitBalanceAdjust() {
    if (!selectedUser) return;
    const amt = Number(adjustAmount);
    if (!amt) { flash(tt("Antre yon montan valab.")); return; }
    if (!adjustReason.trim()) { flash(tt("Yon rezon obligatwa.")); return; }
    try {
      const { newBalance } = await apiFetch(`/admin/users/${selectedUser.id}/adjust-balance`, {
        method: 'POST', token, body: { amount: amt, reason: adjustReason.trim() },
      });
      setUsers((us) => us.map((x) => x.id === selectedUser.id ? { ...x, balance: newBalance } : x));
      setSelectedUser((s) => ({ ...s, balance: newBalance }));
      setAdjustAmount('');
      setAdjustReason('');
      flash(tt("Balans ajiste."));
    } catch (err) { flash(err.message); }
  }

  function enterDemoMode() {
    setToken(DEMO_TOKEN);
    setAdmin({ fullName: 'Admin Demo' });
    flash(tt("Mòd demo — pa gen vre done."));
  }

  async function handleLogin() {
    setLoginError('');
    if (!loginForm.phone.trim() || !loginForm.password) {
      setLoginError(tt("Nimewo telefòn ak modpas obligatwa."));
      return;
    }
    setLoginLoading(true);
    try {
      const { token: newToken, user } = await apiFetch('/auth/login', { method: 'POST', body: loginForm });
      if (user.role !== 'admin' && user.role !== 'agent') {
        setLoginError(tt("Kont sa a pa gen aksè admin."));
        return;
      }
      setToken(newToken);
      setAdmin(user);
      setNav(user.role === 'agent' ? 'pending' : 'overview');
      await loadPending(newToken);
      if (user.role !== 'agent') { loadExchangeRate(newToken); loadFinance('all', newToken); loadReserves(newToken); loadRecon(newToken); loadAlertCount(newToken); loadAccessMode(newToken); }
      loadNotifications(newToken);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  }

  function openPasswordModal() {
    setPwForm({ current: '', next: '', confirm: '' });
    setPwError('');
    setPwSuccess(false);
    setPwModalOpen(true);
  }

  async function changePassword() {
    setPwError('');
    if (!pwForm.current || !pwForm.next) {
      setPwError(tt("Ranpli tout chan yo."));
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError(tt("Nouvo modpas la dwe gen omwen 6 karaktè."));
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError(tt("De nouvo modpas yo pa menm."));
      return;
    }
    setPwBusy(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        token,
        body: { currentPassword: pwForm.current, newPassword: pwForm.next },
      });
      setPwSuccess(true);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwBusy(false);
    }
  }

  function logout() {
    setToken(null);
    setAdmin(null);
    setPending([]);
    setConfirmed([]);
    setLoginForm({ phone: '', password: '' });
  }

  async function confirmDeposit(id) {
    const dep = pending.find((d) => d.id === id);
    if (!dep) return;
    try {
      if (token !== DEMO_TOKEN) await apiFetch(`/admin/deposits/${id}/confirm`, { method: 'POST', token });
      setPending((p) => p.filter((d) => d.id !== id));
      setConfirmed((c) => [{ id: 'c-' + Date.now(), user: dep.user, method: dep.method, amount: dep.amount, time: tt("kounye a") }, ...c]);
      flash(tt("Depo {0} la konfime.", dep.user));
    } catch (err) { flash(err.message); }
  }

  async function rejectDeposit(id) {
    const dep = pending.find((d) => d.id === id);
    if (!dep) return;
    try {
      if (token !== DEMO_TOKEN) await apiFetch(`/admin/deposits/${id}/reject`, { method: 'POST', token });
      setPending((p) => p.filter((d) => d.id !== id));
      flash(tt("Depo {0} la rejte.", dep.user));
    } catch (err) { flash(err.message); }
  }

  async function confirmWithdrawal(id, proofFile) {
    try {
      let body = {};
      if (proofFile) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = () => reject(new Error(tt("Nou pa t ka li foto a.")));
          reader.readAsDataURL(proofFile);
        });
        body = { proofImage: base64, proofMimeType: proofFile.type };
      }
      await apiFetch(`/admin/withdrawals/${id}/confirm`, { method: 'POST', token, body });
      setWithdrawals((w) => w.filter((x) => x.id !== id));
      flash(tt("Retrè konfime."));
    } catch (err) { flash(err.message); }
  }
  async function rejectWithdrawal(id) {
    try {
      await apiFetch(`/admin/withdrawals/${id}/reject`, { method: 'POST', token });
      setWithdrawals((w) => w.filter((x) => x.id !== id));
      flash(tt("Retrè refize — lajan an remèt."));
    } catch (err) { flash(err.message); }
  }

  async function approveLoan(id) {
    try {
      await apiFetch(`/admin/loans/${id}/approve`, { method: 'POST', token });
      loadLoans();
      flash(tt("Prè apwouve."));
    } catch (err) { flash(err.message); }
  }
  async function rejectLoan(id) {
    try {
      await apiFetch(`/admin/loans/${id}/reject`, { method: 'POST', token });
      loadLoans();
      flash(tt("Prè refize."));
    } catch (err) { flash(err.message); }
  }

  async function approveSol(id, turnIndex) {
    try {
      await apiFetch(`/admin/sol/requests/${id}/approve`, { method: 'POST', token, body: turnIndex ? { turnIndex } : {} });
      setSolRequests((r) => r.filter((x) => x.id !== id));
      setApprovingSolId(null);
      flash(tt("Demand adezyon apwouve."));
    } catch (err) { flash(err.message); }
  }
  async function rejectSol(id) {
    try {
      await apiFetch(`/admin/sol/requests/${id}/reject`, { method: 'POST', token });
      setSolRequests((r) => r.filter((x) => x.id !== id));
      flash(tt("Demand adezyon refize."));
    } catch (err) { flash(err.message); }
  }
  async function reassignSolPosition(groupId, membershipId, turnIndex) {
    try {
      await apiFetch(`/admin/sol/groups/${groupId}/members/${membershipId}/position`, { method: 'PATCH', token, body: { turnIndex } });
      flash(tt("Pozisyon chanje."));
      openSolGroup(selectedSolGroup);
    } catch (err) { flash(err.message); }
  }

  const filteredPending = pending.filter((d) =>
    d.user.toLowerCase().includes(query.toLowerCase()) || d.reference.toLowerCase().includes(query.toLowerCase())
  );
  const totalPendingAmount = pending.reduce((s, d) => s + d.amount, 0);
  const totalConfirmedToday = confirmed.reduce((s, d) => s + d.amount, 0);
  const totalWithdrawAmount = withdrawals.reduce((s, w) => s + w.amount, 0);
  const totalGoalsSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTransferVolume = transfers.reduce((s, t) => s + t.amount, 0);
  const totalLoansActive = loans.filter((l) => l.status === 'active').reduce((s, l) => s + l.amount, 0);
  const pendingLoansCount = loans.filter((l) => l.status === 'pending').length;

  // Rezime konfòmite pou Apèsi a (rekonsilyasyon + alèt ouvè).
  const [recon, setRecon] = useState(null);
  const [openAlerts, setOpenAlerts] = useState(0);
  const [privateBeta, setPrivateBeta] = useState(false);
  async function loadAccessMode(authToken = token) {
    try { const r = await apiFetch('/admin/access-mode', { token: authToken }); setPrivateBeta(!!r.privateBeta); } catch { /* ansyen sèvè */ }
  }
  async function loadRecon(authToken = token) {
    try { setRecon(await apiFetch('/admin/reconciliation', { token: authToken })); } catch { /* pa bloke apèsi a */ }
  }
  async function loadAlertCount(authToken = token) {
    try { const r = await apiFetch('/admin/monitoring/alerts?status=open', { token: authToken }); setOpenAlerts(r.counts?.open || 0); } catch { /* pa bloke apèsi a */ }
  }

  // Meni an òganize pa seksyon (Jeneral, Operasyon, Konfòmite, Administrasyon).
  const NAV_ITEMS_ALL = [
    { id: 'overview', section: 'general', label: tt("Apèsi"), icon: LayoutGrid, onOpen: () => { loadExchangeRate(); loadFinance('all'); loadReserves(); loadRecon(); loadAlertCount(); }, adminOnly: true },
    { id: 'finance', section: 'general', label: tt("Finans"), icon: TrendingUp, onOpen: () => { loadFinance(); loadReserves(); }, adminOnly: false },
    { id: 'pending', section: 'ops', label: tt("Depo"), icon: Wallet, count: pending.length },
    { id: 'withdrawals', section: 'ops', label: tt("Retrait"), icon: ArrowDownLeft, count: withdrawals.length, onOpen: () => { loadWithdrawals(); loadReserves(); } },
    { id: 'transfers', section: 'ops', label: tt("Transfè"), icon: ArrowLeftRight, onOpen: () => loadTransfers(), adminOnly: true },
    { id: 'support', section: 'ops', label: tt("Mesaj Sipò"), icon: Mail, count: supportMessages.length, onOpen: () => loadSupportMessages(), adminOnly: true },
    { id: 'monitoring', section: 'compliance', label: tt("Siveyans & alèt"), icon: ShieldAlert, count: openAlerts, adminOnly: true },
    { id: 'kyc', section: 'compliance', label: tt("Verifikasyon KYC"), icon: ShieldCheck, count: kycSubmissions.length, onOpen: () => loadKyc(), adminOnly: true },
    { id: 'business', section: 'compliance', label: tt("Antrepriz (KYB)"), icon: Building2, adminOnly: true },
    { id: 'verificationRequests', section: 'compliance', label: tt("Dokiman Siplemantè"), icon: FileText, count: vrPending.length, onOpen: () => loadVerificationRequests(), adminOnly: true },
    { id: 'reconciliation', section: 'compliance', label: tt("Rekonsilyasyon"), icon: Scale, adminOnly: true },
    { id: 'audit', section: 'compliance', label: tt("Jounal odit"), icon: ScrollText, adminOnly: true },
    { id: 'users', section: 'admin', label: tt("Itilizatè"), icon: User, onOpen: () => loadUsers(), adminOnly: true },
    { id: 'agents', section: 'admin', label: tt("Ajan"), icon: UserPlus, onOpen: () => loadAgents(), adminOnly: true },
  ];
  const NAV_SECTIONS = [['general', tt("Jeneral")], ['ops', tt("Operasyon")], ['compliance', tt("Konfòmite")], ['admin', tt("Administrasyon")]];
  const NAV_ITEMS = NAV_ITEMS_ALL.filter((item) => !item.adminOnly || admin?.role === 'admin');

  function goTo(item) {
    setNav(item.id);
    if (item.onOpen) item.onOpen();
  }

  if (!token) {
    return (
      <div style={{ background: C.navyDeep, minHeight: '100%' }} className="w-full flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
          * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
          .bp-btn { transition: all .15s ease; }
          .bp-btn:hover { filter: brightness(1.06); }
          input:focus { outline: none; border-color: ${C.gold} !important; }
        `}</style>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(185,134,47,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -140, left: -100, width: 320, height: 320, borderRadius: '50%', background: 'rgba(44,143,176,0.08)' }} />

        <div className="w-full max-w-sm rounded-lg relative" style={{ background: C.card, padding: '32px 28px', border: `1px solid ${C.navy}`, boxShadow: '0px 12px 32px -4px rgba(10,33,64,0.28)' }}>
          <div className="absolute top-4 right-4"><LangSwitch lang={lang} setLang={setLang} /></div>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span style={{ ...fontDisplay, fontWeight: 800, fontSize: 18, color: C.ink }}>
              {tt("BLIC")}<span style={{ color: C.gold }}>{tt("Pay")}</span>
            </span>
          </div>
          <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 21, color: C.ink, marginTop: 18 }}>{tt("Byenveni")}</h1>
          <p className="text-sm" style={{ color: C.muted, marginTop: 2 }}>{tt("Konekte pou jere kont BLICPay yo.")}</p>

          <div style={{ marginTop: 24 }} className="space-y-3">
            <input placeholder={tt("Nimewo telefòn")} value={loginForm.phone}
              onChange={(e) => setLoginForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.ink }} />
            <input placeholder={tt("Modpas")} type="password" value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.ink }} />
          </div>
          {loginError && (
            <p className="text-xs flex items-center gap-1.5" style={{ color: C.danger, marginTop: 12 }}>
              <AlertCircle size={13} /> {loginError}
            </p>
          )}
          <button onClick={handleLogin} disabled={loginLoading}
            className="bp-btn w-full py-3 rounded-lg font-semibold text-white" style={{ marginTop: 20, background: C.navy, opacity: loginLoading ? 0.7 : 1 }}>
            {loginLoading ? tt("Tann...") : tt("Konekte")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: '100%', color: C.ink }} className="w-full adm-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .bp-btn { transition: all .15s ease; }
        .bp-btn:hover { filter: brightness(1.04); }
        .bp-btn:active { transform: scale(0.98); }
        .nav-item { transition: background .15s ease; }
        input:focus, textarea:focus { outline: none; border-color: ${C.sky} !important; }
        @keyframes fadein { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:translateY(0);} }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fadein { animation: fadein .3s ease; }
        .adm-side { display: none; }
        @media (min-width: 1024px) {
          .adm-shell { padding-left: 248px; }
          .adm-side { display: flex; }
          .adm-topnav { display: none !important; }
          .adm-hide-lg { display: none !important; }
        }
        .adm-link { transition: background .15s ease, color .15s ease; }
        .adm-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
      `}</style>

      {/* Meni lateral (gwo ekran) — seksyon: Jeneral, Operasyon, Konfòmite, Administrasyon */}
      <aside className="adm-side flex-col" style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 248, zIndex: 35, background: C.navyDeep, borderRight: '1px solid #0F2D52' }}>
        <div className="flex items-center gap-2.5" style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="rounded-lg flex items-center justify-center font-extrabold text-white" style={{ width: 32, height: 32, background: C.navy, border: `1px solid ${C.gold}` }}>B</div>
          <div>
            <p style={{ ...fontDisplay, fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.1 }}>BLIC<span style={{ color: C.gold }}>Pay</span></p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#7a8aa3' }}>{tt("Konsòl operasyon")}</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto" style={{ padding: '10px 12px 16px' }}>
          {NAV_SECTIONS.map(([sec, label]) => {
            const items = NAV_ITEMS.filter((it) => it.section === sec);
            if (!items.length) return null;
            return (
              <div key={sec} style={{ marginTop: 14 }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6E7F99', padding: '0 10px 6px' }}>{label}</p>
                {items.map((item) => {
                  const on = nav === item.id;
                  return (
                    <button key={item.id} onClick={() => goTo(item)} className="adm-link w-full flex items-center gap-2.5 rounded-lg text-sm"
                      style={{ padding: '8px 10px', marginBottom: 2, fontWeight: on ? 700 : 500, color: on ? '#fff' : 'rgba(255,255,255,0.68)', background: on ? 'rgba(185,134,47,0.18)' : 'transparent', boxShadow: on ? `inset 3px 0 0 ${C.gold}` : 'none' }}>
                      <item.icon size={16} color={on ? C.gold : 'currentColor'} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count > 0 && <span className="text-[10px] font-bold rounded-full" style={{ padding: '1px 7px', background: sec === 'compliance' ? C.danger : 'rgba(255,255,255,0.16)', color: '#fff' }}>{item.count}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px]" style={{ color: '#6E7F99' }}>{tt("Aksè anrejistre nan jounal odit la")}</p>
        </div>
      </aside>

      {toast && (
        <div className="fixed top-4 right-4 z-50 fadein px-4 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg"
          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.ink }}>
          <Check size={16} color={C.mint} /> {toast}
        </div>
      )}

      {/* barre navigasyon anlè — fikse, li rete vizib pandan kontni an defile */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: C.navyDeep, borderBottom: '1px solid #0F2D52', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center justify-between" style={{ padding: '9px 24px', borderBottom: '1px solid rgba(19,44,80,0.6)' }}>
          <div className="flex items-center gap-3">
            <div className="adm-hide-lg flex items-center gap-2.5">
              <div className="rounded-lg flex items-center justify-center font-extrabold text-white" style={{ width: 30, height: 30, background: C.navy, border: `1px solid ${C.gold}` }}>B</div>
              <span style={{ ...fontDisplay, fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: -0.2 }}>
                {tt("BLIC")}<span style={{ color: C.gold }}>{tt("Pay")}</span>
              </span>
              <span className="hidden lg:inline-block text-[10px] uppercase font-semibold rounded" style={{ ...fontMono, padding: '2px 7px', background: C.navy, color: '#9fb0c7', border: '1px solid #334', letterSpacing: 0.6 }}>
                {tt("Panèl Admin")}
              </span>
            </div>

            <div className="hidden md:block" style={{ width: 1, height: 16, background: '#334', margin: '0 4px' }} />

            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold rounded-full" style={{
              padding: '3px 10px', background: 'rgba(185,134,47,0.16)', color: '#e9c583',
              border: '1px solid rgba(185,134,47,0.35)', letterSpacing: 0.2,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, display: 'inline-block' }} />
              {admin?.role === 'agent' ? tt("Ajan · {0}", admin?.branch || '') : tt("Sipè Admin — Aksè Konplè")}
            </div>
          </div>
          <div className="flex items-center" style={{ gap: 18 }}>
            <div className="hidden sm:block text-right">
              <p style={{ ...fontMono, fontSize: 11, color: '#c7d0dd' }}>
                {clock.toLocaleTimeString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR')} <span style={{ color: '#7a8aa3' }}>{tt("HTG (UTC-5)")}</span>
              </p>
              <p className="text-[10px]" style={{ color: '#7a8aa3' }}>{clock.toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>

            <button onClick={() => setNotifPanelOpen((o) => !o)} className="w-8 h-8 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Bell size={15} color="#fff" />
              {unreadCount > 0 && (
                <span className="absolute flex items-center justify-center text-white font-bold" style={{
                  top: -1, right: -1, width: 15, height: 15, borderRadius: '50%', background: C.gold, fontSize: 9,
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2.5" style={{ paddingLeft: 14, borderLeft: '1px solid #334' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: `0 0 0 1.5px ${C.gold}` }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{initials(admin?.fullName || '')}</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#fff', lineHeight: 1.2 }}>{admin?.fullName}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.2 }}>
                  {admin?.role === 'agent' ? tt("Ajan · {0}", admin?.branch) : tt("Sipè admin")}
                </p>
              </div>
            </div>
            <LangSwitch lang={lang} setLang={setLang} dark />
            <button onClick={openPasswordModal} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} aria-label={tt("Chanje modpas")} title={tt("Chanje modpas")}>
              <KeyRound size={15} color="#fff" />
            </button>
            <button onClick={logout} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} aria-label={tt("Dekonekte")}>
              <LogOut size={15} color="#fff" />
            </button>
          </div>
        </div>
        <div className="adm-topnav flex items-center overflow-x-auto" style={{ padding: '0 12px', gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => goTo(item)}
              className="nav-item flex items-center gap-1.5 text-sm rounded-t"
              style={{
                padding: '9px 12px',
                fontWeight: nav === item.id ? 700 : 500,
                color: nav === item.id ? '#fff' : 'rgba(255,255,255,0.55)',
                background: nav === item.id ? 'rgba(15,45,82,0.5)' : 'transparent',
                borderBottom: nav === item.id ? `2px solid ${C.gold}` : '2px solid transparent',
              }}>

              <item.icon size={15} />
              <span>{item.label}</span>
              {item.count > 0 && (
                <span className="text-[10px] font-bold rounded-full" style={{
                  padding: '1px 6px',
                  background: item.id === 'kyc' ? 'rgba(181,72,46,0.35)' : item.id === 'pending' ? 'rgba(28,111,191,0.35)' : nav === item.id ? C.gold : 'rgba(255,255,255,0.18)',
                  color: item.id === 'kyc' ? '#f3c9bd' : item.id === 'pending' ? '#bcdcff' : nav === item.id ? '#fff' : '#fff',
                }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {notifPanelOpen && (
        <>
          <div onClick={() => setNotifPanelOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 39 }} />
          <div className="fadein rounded-lg overflow-hidden" style={{
            position: 'fixed', top: 66, right: 24, width: 360, maxHeight: 420, zIndex: 40,
            background: C.card, border: `1px solid ${C.border}`, boxShadow: '0px 12px 32px -4px rgba(10,33,64,0.22)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
              <p className="text-sm font-bold" style={{ color: C.ink }}>{tt("Notifikasyon")}</p>
              {unreadCount > 0 && (
                <button onClick={markAllNotificationsRead} className="text-xs font-semibold" style={{ color: C.navy }}>
                  {tt("Make tout li")}
                </button>
              )}
            </div>
            <div style={{ overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <p className="text-sm text-center" style={{ color: C.muted, padding: '32px 16px' }}>{tt("Pa gen notifikasyon toujou.")}</p>
              ) : notifications.map((n, i) => (
                <button key={n.id} onClick={() => !n.read && markNotificationRead(n.id)}
                  className="bp-btn w-full text-left" style={{
                    padding: '11px 16px', borderTop: i ? `1px solid ${C.border}` : 'none',
                    background: n.read ? C.card : '#FFFDF9',
                  }}>
                  <div className="flex items-start gap-2">
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, marginTop: 5, flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <p className="text-xs font-bold" style={{ color: C.ink }}>{n.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{n.body}</p>
                      <p className="text-[10px] mt-1" style={{ color: C.muted }}>{new Date(n.createdAt).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* kontni — pran tout lajè a kounye a */}
      <div style={{ padding: '32px 40px', maxWidth: 1440, width: '100%', margin: '0 auto' }}>
          {nav === 'overview' && (() => {
            const totalDeposit = financeData?.totalDepositVolume ?? 0;
            const totalWithdrawal = financeData?.totalWithdrawalVolume ?? 0;
            const moncashReserve = reserves.find((r) => r.method === 'moncash')?.balance || 0;
            const natcashReserve = reserves.find((r) => r.method === 'natcash')?.balance || 0;
            const totalReserve = moncashReserve + natcashReserve;
            // Fon kliyan yo = sa BLICPay dwe kliyan li yo (rekonsilyasyon), pa yon sòm volim.
            const totalBalance = recon?.totalLiabilities ?? 0;
            const coveragePct = recon?.coverage != null ? Math.round(recon.coverage * 1000) / 10 : null;
            return (
            <div className="fadein">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: C.ink }}>
                    {tt("Bonjou,")} {admin?.fullName}
                  </h1>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    📅 {new Date().toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Kat balans prensipal — done reyèl sèlman */}
              <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ marginTop: 18, background: `linear-gradient(120deg, ${C.navyDeep}, ${C.navy} 60%, #133863)`, border: `1px solid ${C.navy}` }}>
                <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(185,134,47,0.10)', filter: 'blur(50px)', pointerEvents: 'none' }} />
                <div className="relative">
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>{tt("Fon kliyan yo (total balans)")}</p>
                  <div className="flex items-baseline gap-3 flex-wrap" style={{ marginTop: 6 }}>
                    <span style={{ ...fontMono, fontSize: 34, fontWeight: 800, color: '#fff' }}>{money(totalBalance)}</span>
                    {exchangeRate && (
                      <span style={{ ...fontMono, fontSize: 16, color: C.gold, fontWeight: 700 }}>
                        ≈ ${(totalBalance / exchangeRate.rate).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} USD
                      </span>
                    )}
                  </div>
                  {exchangeRate && (
                    <p className="text-[10px] mt-1" style={{ ...fontMono, color: 'rgba(255,255,255,0.5)' }}>{tt("Tal BRH: 1 USD =")} {exchangeRate.rate} {tt("HTG (")}{exchangeRate.rateDate})</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs" style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.55)' }}>{tt("Volim Depo (tout tan)")}</p>
                      <p style={{ ...fontMono, fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 3 }}>{money(totalDeposit)}</p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.55)' }}>{tt("Kliyan aktif")}</p>
                      <p style={{ ...fontMono, fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 3 }}>{recon?.clients ?? '—'}</p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.55)' }}>{tt("Fon BLICPay kenbe")}</p>
                      <p style={{ ...fontMono, fontSize: 16, fontWeight: 700, color: C.gold, marginTop: 3 }}>{money(recon?.totalAssets ?? totalReserve)}</p>
                    </div>
                    <button onClick={() => setNav('reconciliation')} className="text-left">
                      <p style={{ color: 'rgba(255,255,255,0.55)' }}>{tt("Kouvèti fon kliyan")}</p>
                      <p style={{ ...fontMono, fontSize: 16, fontWeight: 700, color: coveragePct == null ? '#fff' : coveragePct >= 100 ? '#7EE2BF' : '#FFB4A2', marginTop: 3 }}>{coveragePct != null ? `${coveragePct}%` : '—'}</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 kat KPI operasyonèl, style Stitch */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginTop: 18 }}>
                {[
                  { label: tt("Depo Ap Tann Validasyon"), value: tt("{0} demann", pending.length), sub: money(totalPendingAmount), tone: '#8A6423', bg: '#FBF0DE', tab: 'pending' },
                  { label: tt("Demann Retrè Ap Tann"), value: tt("{0} demann", withdrawals.length), sub: money(totalWithdrawAmount), tone: C.danger, bg: '#FBEBE6', tab: 'withdrawals' },
                  { label: tt("Alèt siveyans ouvè"), value: String(openAlerts), sub: tt("pou egzamine"), tone: C.purple, bg: '#F4EBFF', tab: 'monitoring' },
                  { label: tt("Dosye KYC Pou Tcheke"), value: tt("{0} dosye", kycSubmissions.length), sub: tt("ap tann egzamen"), tone: C.navy, bg: '#E6F0FB', tab: 'kyc' },
                ].map((c) => (
                  <button key={c.label} onClick={() => setNav(c.tab)} className="bp-btn text-left bg-white rounded-xl" style={{ padding: 16, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{c.label}</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.tone, display: 'inline-block' }} />
                      </div>
                    </div>
                    <p style={{ ...fontMono, fontSize: 19, fontWeight: 800, color: C.ink, marginTop: 8 }}>{c.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{c.sub}</p>
                  </button>
                ))}
              </div>

              {/* Depo resan — done reyèl */}
              <div className="bg-white rounded-2xl overflow-hidden" style={{ marginTop: 20, border: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between" style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.ink }}>{tt("Dènye Depo Ap Tann")}</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{tt("Tout metòd — MonCash, NatCash, biwo")}</p>
                  </div>
                  <button onClick={() => setNav('pending')} className="text-xs font-semibold flex items-center gap-1" style={{ color: C.navy }}>
                    {tt("Wè tout")} <ChevronRight size={13} />
                  </button>
                </div>
                {pending.length === 0 ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Pa gen depo k'ap tann.")}</p>
                ) : (
                  <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: C.bg }}>
                        <Th>{tt("Kliyan")}</Th><Th>{tt("Referans")}</Th><Th align="right">{tt("Montan")}</Th><Th align="center">{tt("Estati")}</Th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {pending.slice(0, 5).map((d) => {
                        const M = methodIcons[d.method] || { icon: DollarSign, color: C.muted, label: d.method };
                        return (
                          <tr key={d.id} style={{ borderTop: `1px solid ${C.border}` }}>
                            <Td>
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: M.logo ? '#fff' : M.color, border: M.logo ? `1px solid ${C.border}` : 'none' }}>
                                  {M.logo ? <img src={M.logo} alt={M.label} className="w-full h-full object-cover" /> : <M.icon size={13} color="#fff" />}
                                </div>
                                <div>
                                  <p className="font-bold" style={{ color: C.ink }}>{d.user}</p>
                                  <p style={{ ...fontMono, fontSize: 10.5, color: C.muted }}>{d.phone}</p>
                                </div>
                              </div>
                            </Td>
                            <Td><span style={{ ...fontMono, fontSize: 11 }}>{d.reference}</span></Td>
                            <Td align="right"><span style={{ ...fontMono, fontWeight: 700 }}>+{money(d.amount)}</span></Td>
                            <Td align="center"><Badge tone="amber">{tt("Ap tann")}</Badge></Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            );
          })()}

          {nav === 'pending' && (
            <div className="fadein">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Depo")}</h1>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Konfime oswa rejte demand depo yo.")}</p>
                </div>
                <div className="flex items-center gap-2">
                  {depositView === 'pending' && (
                    <div className="relative">
                      <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tt("Chèche non oswa referans")}
                        className="pl-8 pr-3 py-2 rounded-lg text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, width: 220 }} />
                    </div>
                  )}
                  <button onClick={() => depositView === 'pending' ? loadPending(token) : loadDepositHistory()} aria-label={tt("Rafrechi")}
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <RefreshCw size={14} color={C.muted} style={(loadingPending || loadingDepositHistory) ? { animation: 'spin 0.8s linear infinite' } : undefined} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5" style={{ marginTop: 16 }}>
                <button onClick={() => setDepositView('pending')}
                  className="bp-btn rounded-lg text-xs font-semibold" style={{ padding: '7px 13px',
                    background: depositView === 'pending' ? C.navy : C.card, color: depositView === 'pending' ? '#fff' : C.muted,
                    border: `1px solid ${depositView === 'pending' ? C.navy : C.border}` }}>
                  {tt("Ap tann")}
                </button>
                <button onClick={() => { setDepositView('history'); if (depositHistory.length === 0) loadDepositHistory(); }}
                  className="bp-btn rounded-lg text-xs font-semibold" style={{ padding: '7px 13px',
                    background: depositView === 'history' ? C.navy : C.card, color: depositView === 'history' ? '#fff' : C.muted,
                    border: `1px solid ${depositView === 'history' ? C.navy : C.border}` }}>
                  {tt("Istorik")}
                </button>
              </div>

              {depositView === 'pending' && (
              <>
              <div className="mt-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {filteredPending.length === 0 ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Pa gen okenn rezilta.")}</p>
                ) : filteredPending.map((d, i) => {
                  const M = methodIcons[d.method] || { icon: DollarSign, color: C.muted, label: d.method };
                  return (
                    <div key={d.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
                      style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: M.logo ? '#fff' : M.color, border: M.logo ? `1px solid ${C.border}` : 'none' }}>
                          {M.logo ? <img src={M.logo} alt={M.label} className="w-full h-full object-cover" /> : <M.icon size={16} color="#fff" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{d.user}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{d.phone} · {d.date}</p>
                          {d.branch && (
                            <p className="text-xs mt-0.5 font-semibold" style={{ color: C.navy }}>📍 {d.branch}</p>
                          )}
                          <p className="text-xs mt-0.5" style={{ ...fontMono, color: C.muted }}>{d.reference}</p>
                          {d.transactionId && (
                            <p className="text-xs mt-0.5" style={{ ...fontMono, color: C.navy }}>{tt("TID:")} {d.transactionId}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p style={{ ...fontMono, fontSize: 15, fontWeight: 600 }}>{money(d.amount)}</p>
                          <Badge tone="amber">{tt(M.label)}</Badge>
                        </div>
                        {d.proofImage && (
                          <button onClick={() => setViewingReceipt(d)}
                            className="bp-btn w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ border: `1px solid ${C.border}` }} aria-label={tt("Wè resi a")}>
                            <Eye size={15} color={C.navy} />
                          </button>
                        )}
                        <div className="flex items-center gap-2">
                          <button onClick={() => rejectDeposit(d.id)}
                            className="bp-btn w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ border: `1px solid ${C.border}` }} aria-label={tt("Rejte")}>
                            <X size={15} color={C.danger} />
                          </button>
                          <button onClick={() => setConfirmingDeposit(d)}
                            className="bp-btn px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            style={{ background: C.mint, color: '#fff' }}>
                            <Check size={13} /> {tt("Konfime@@btn")}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
              )}

              {depositView === 'history' && (
                <div className="mt-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  {loadingDepositHistory ? (
                    <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Ap chaje...")}</p>
                  ) : depositHistory.length === 0 ? (
                    <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Pa gen istorik toujou.")}</p>
                  ) : depositHistory.map((d, i) => {
                    const M = methodIcons[d.method] || { icon: DollarSign, color: C.muted, label: d.method };
                    return (
                      <div key={d.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
                        style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none', opacity: d.status === 'rejected' ? 0.55 : 1 }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: M.logo ? '#fff' : M.color, border: M.logo ? `1px solid ${C.border}` : 'none' }}>
                            {M.logo ? <img src={M.logo} alt={M.label} className="w-full h-full object-cover" /> : <M.icon size={14} color="#fff" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{d.user}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{tt(M.label)} · {d.date}{d.branch ? ` · 📍 ${d.branch}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={fontMono} className="text-sm font-semibold">{money(d.amount)}</span>
                          <Badge tone={d.status === 'confirmed' ? 'mint' : d.status === 'rejected' ? 'danger' : 'amber'}>
                            {d.status === 'confirmed' ? tt("Konfime") : d.status === 'rejected' ? tt("Refize") : tt("Ap tann")}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {depositView === 'pending' && (
              <div className="mt-6 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: '#EFE7D8', color: C.navy }}>
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {tt("Verifye referans lan ak resi kach la anvan ou konfime yon depo biwo.")}
              </div>
              )}
            </div>
          )}

          {nav === 'withdrawals' && (
            <div className="fadein">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Retrait")}</h1>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Konfime oswa rejte demand retrè yo. Yon retrè refize remèt lajan an bay kliyan an.")}</p>
                </div>
                <button onClick={() => withdrawalView === 'pending' ? loadWithdrawals(token) : loadWithdrawalHistory()} aria-label={tt("Rafrechi")}
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <RefreshCw size={14} color={C.muted} style={(loadingWithdrawals || loadingWithdrawalHistory) ? { animation: 'spin 0.8s linear infinite' } : undefined} />
                </button>
              </div>

              <div className="flex items-center gap-1.5" style={{ marginTop: 16 }}>
                <button onClick={() => setWithdrawalView('pending')}
                  className="bp-btn rounded-lg text-xs font-semibold" style={{ padding: '7px 13px',
                    background: withdrawalView === 'pending' ? C.navy : C.card, color: withdrawalView === 'pending' ? '#fff' : C.muted,
                    border: `1px solid ${withdrawalView === 'pending' ? C.navy : C.border}` }}>
                  {tt("Ap tann")}
                </button>
                <button onClick={() => { setWithdrawalView('history'); if (withdrawalHistory.length === 0) loadWithdrawalHistory(); }}
                  className="bp-btn rounded-lg text-xs font-semibold" style={{ padding: '7px 13px',
                    background: withdrawalView === 'history' ? C.navy : C.card, color: withdrawalView === 'history' ? '#fff' : C.muted,
                    border: `1px solid ${withdrawalView === 'history' ? C.navy : C.border}` }}>
                  {tt("Istorik")}
                </button>
              </div>

              {withdrawalView === 'pending' && (() => {
                const totalPending = withdrawals.reduce((s, w) => s + w.amount, 0);
                const biggestPending = withdrawals.length ? Math.max(...withdrawals.map((w) => w.amount)) : 0;
                const moncashReserve = reserves.find((r) => r.method === 'moncash')?.balance || 0;
                const natcashReserve = reserves.find((r) => r.method === 'natcash')?.balance || 0;
                const proofOk = !!withdrawalProofFile;
                return (
                <>
                {/* Metrik reyèl — pa gen chif envante */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginTop: 20 }}>
                  <div className="bg-white border rounded-lg p-3.5" style={{ borderColor: C.border }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{tt("Total Ap Tann")}</p>
                    <p style={{ ...fontMono, fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 4 }}>{money(totalPending)}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{withdrawals.length} {tt("tranzaksyon")}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3.5" style={{ borderColor: C.border }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{tt("Rezèv MonCash")}</p>
                    <p style={{ ...fontMono, fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 4 }}>{money(moncashReserve)}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{tt("Mete ajou alamen")}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3.5" style={{ borderColor: C.border }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{tt("Rezèv NatCash")}</p>
                    <p style={{ ...fontMono, fontSize: 15, fontWeight: 800, color: '#1C6FBF', marginTop: 4 }}>{money(natcashReserve)}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{tt("Mete ajou alamen")}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3.5" style={{ borderColor: C.border }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{tt("Pi Gwo Demand")}</p>
                    <p style={{ ...fontMono, fontSize: 15, fontWeight: 800, color: C.navy, marginTop: 4 }}>{money(biggestPending)}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{tt("Nan fil datant lan")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5" style={{ marginTop: 20 }}>
                  {/* Kolòn gòch — Lis */}
                  <div className="xl:col-span-7">
                    <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: C.border }}>
                      {loadingWithdrawals ? (
                        <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
                      ) : withdrawals.length === 0 ? (
                        <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Pa gen retrè k'ap tann.")}</p>
                      ) : (
                        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                              <Th>{tt("Kliyan")}</Th>
                              <Th>{tt("Metòd & Kont")}</Th>
                              <Th align="right">{tt("Montan")}</Th>
                              <Th align="right"></Th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            {withdrawals.map((w) => {
                              const M = methodIcons[w.method] || { icon: DollarSign, color: C.muted, label: w.method };
                              const selected = confirmingWithdrawal?.id === w.id;
                              return (
                                <tr key={w.id} onClick={() => { setConfirmingWithdrawal(w); setWithdrawalProofFile(null); }}
                                  style={{ cursor: 'pointer', background: selected ? '#FFFDF9' : C.card, borderLeft: selected ? `3px solid ${C.gold}` : '3px solid transparent', borderTop: `1px solid ${C.border}` }}>
                                  <Td>
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: M.logo ? '#fff' : M.color, border: M.logo ? `1px solid ${C.border}` : 'none' }}>
                                        {M.logo ? <img src={M.logo} alt={M.label} className="w-full h-full object-cover" /> : <M.icon size={13} color="#fff" />}
                                      </div>
                                      <div>
                                        <p className="font-bold" style={{ color: C.ink }}>{w.user}</p>
                                        <p style={{ ...fontMono, fontSize: 11, color: C.muted }}>{w.phone}</p>
                                      </div>
                                    </div>
                                  </Td>
                                  <Td>
                                    <Badge tone="amber">{tt(M.label)}</Badge>
                                    {w.destinationNumber && <p style={{ ...fontMono, fontSize: 11, fontWeight: 700, color: C.ink, marginTop: 4 }}>{w.destinationNumber}</p>}
                                    {w.destinationNumber && (
                                      namesMatch(w.user, w.destinationName)
                                        ? <p className="text-[10px]" style={{ color: '#2B5842' }}>{tt("✓ Non korespondan")}</p>
                                        : <p className="text-[10px]" style={{ color: '#8E341F' }}>{tt("⚠ Non diferan")}</p>
                                    )}
                                  </Td>
                                  <Td align="right">
                                    <p style={{ ...fontMono, fontWeight: 700, fontSize: 13, color: C.danger }}>−{money(w.amount)}</p>
                                    <p className="text-[10px]" style={{ color: C.muted }}>{w.date}</p>
                                  </Td>
                                  <Td align="right">
                                    <button onClick={(e) => { e.stopPropagation(); rejectWithdrawal(w.id); }}
                                      className="bp-btn w-7 h-7 rounded-md flex items-center justify-center" style={{ border: `1px solid ${C.border}` }} aria-label={tt("Rejte")}>
                                      <X size={13} color={C.danger} />
                                    </button>
                                  </Td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Kolòn dwat — Detay & Aksyon */}
                  <div className="xl:col-span-5">
                    {!confirmingWithdrawal ? (
                      <div className="bg-white border rounded-lg flex flex-col items-center justify-center text-center" style={{ borderColor: C.border, padding: '48px 24px' }}>
                        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: C.bg, marginBottom: 12 }}>
                          <Search size={18} color={C.muted} />
                        </div>
                        <p className="text-sm" style={{ color: C.muted }}>{tt("Chwazi yon retrè nan lis la pou enspekte epi konfime li.")}</p>
                      </div>
                    ) : (
                      <div className="rounded-lg" style={{ background: '#fff', border: `2px solid ${C.navy}`, padding: 20 }}>
                        <div className="flex items-center justify-between" style={{ paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                          <div>
                            <p style={{ ...fontMono, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{tt("Enspeksyon retrè")}</p>
                            <p className="text-base font-extrabold" style={{ color: C.navy }}>{confirmingWithdrawal.reference}</p>
                          </div>
                          <Badge tone="amber">{tt("Mande Validasyon")}</Badge>
                        </div>

                        <div className="rounded-lg" style={{ background: C.bg, border: `1px solid ${C.border}`, padding: 14, marginTop: 14 }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                                <span className="text-xs font-bold" style={{ color: C.navy }}>{initials(confirmingWithdrawal.user)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-extrabold" style={{ color: C.ink }}>{confirmingWithdrawal.user}</p>
                                <p style={{ ...fontMono, fontSize: 11, color: C.muted }}>{confirmingWithdrawal.phone}</p>
                                {confirmingWithdrawal.balance != null && (
                                  <p style={{ ...fontMono, fontSize: 10, color: C.muted }}>{tt("Balans:")} <span style={{ fontWeight: 700, color: C.ink }}>{money(confirmingWithdrawal.balance)}</span></p>
                                )}
                              </div>
                            </div>
                          </div>
                          {confirmingWithdrawal.destinationNumber && (
                            <div className="flex items-center justify-between text-xs" style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                              <span style={{ color: C.muted }}>{tt("Non destinasyon:")}</span>
                              {namesMatch(confirmingWithdrawal.user, confirmingWithdrawal.destinationName) ? (
                                <span className="font-bold flex items-center gap-1" style={{ color: '#2B5842' }}>
                                  <Check size={13} /> {confirmingWithdrawal.destinationName} {tt("— Korespondan")}
                                </span>
                              ) : (
                                <span className="font-bold flex items-center gap-1" style={{ color: '#8E341F' }}>
                                  ⚠ {confirmingWithdrawal.destinationName} {tt("— Diferan")}
                                </span>
                              )}
                            </div>
                          )}
                          {confirmingWithdrawal.method === 'biwo' && (
                            <div className="text-xs" style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, color: C.navy }}>
                              {confirmingWithdrawal.branch} {tt("· Kòd kliyan:")} <span style={{ ...fontMono, fontWeight: 700 }}>{confirmingWithdrawal.clientId}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs" style={{ marginTop: 14 }}>
                          <div className="flex justify-between" style={{ padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.muted }}>{tt("Montan mande:")}</span>
                            <span style={{ ...fontMono, fontWeight: 700, color: C.ink }}>{money(confirmingWithdrawal.amount)}</span>
                          </div>
                          <div className="flex justify-between" style={{ padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ color: C.muted }}>{tt("Frè:")}</span>
                            <span style={{ ...fontMono, color: C.danger }}>−{money(confirmingWithdrawal.fee || 0)}</span>
                          </div>
                          <div className="flex justify-between items-baseline rounded-md" style={{ padding: '8px 10px', background: C.bg, marginTop: 4 }}>
                            <span className="text-xs font-bold uppercase" style={{ color: C.navy }}>{tt("Nèt pou debouse:")}</span>
                            <span style={{ ...fontMono, fontWeight: 800, fontSize: 16, color: '#2B5842' }}>{money(confirmingWithdrawal.amount)}</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 14 }}>
                          <label className="text-xs font-bold uppercase" style={{ color: C.danger }}>{tt("Prèv ou voye lajan an (OBLIGATWA)")}</label>
                          <input type="file" accept="image/*" onChange={(e) => setWithdrawalProofFile(e.target.files?.[0] || null)}
                            className="w-full mt-1.5 text-xs" />
                          {withdrawalProofFile && (
                            <p className="text-[11px] mt-1" style={{ color: '#2B5842' }}>✓ {withdrawalProofFile.name}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2" style={{ marginTop: 16 }}>
                          <button
                            onClick={async () => {
                              setConfirmingWithdrawalBusy(true);
                              await confirmWithdrawal(confirmingWithdrawal.id, withdrawalProofFile);
                              setConfirmingWithdrawalBusy(false);
                              setConfirmingWithdrawal(null);
                            }}
                            disabled={confirmingWithdrawalBusy || !proofOk}
                            className="bp-btn w-full py-3 rounded-lg text-sm font-bold text-white"
                            style={{ background: C.navy, opacity: (confirmingWithdrawalBusy || !proofOk) ? 0.5 : 1 }}>
                            {confirmingWithdrawalBusy ? tt("Ap konfime...") : tt("Apwouve & Debouse ({0})", money(confirmingWithdrawal.amount))}
                          </button>
                          <button
                            onClick={() => { rejectWithdrawal(confirmingWithdrawal.id); setConfirmingWithdrawal(null); }}
                            className="bp-btn w-full py-2 rounded-lg text-xs font-bold" style={{ background: '#FBEBE6', color: C.danger, border: '1px solid rgba(181,72,46,0.25)' }}>
                            {tt("Rejte demand lan")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </>
                );
              })()}

              {withdrawalView === 'history' && (
                <div className="mt-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  {loadingWithdrawalHistory ? (
                    <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Ap chaje...")}</p>
                  ) : withdrawalHistory.length === 0 ? (
                    <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Pa gen istorik toujou.")}</p>
                  ) : withdrawalHistory.map((w, i) => {
                    const M = methodIcons[w.method] || { icon: DollarSign, color: C.muted, label: w.method };
                    return (
                      <div key={w.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
                        style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none', opacity: w.status === 'rejected' ? 0.55 : 1 }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: M.logo ? '#fff' : M.color, border: M.logo ? `1px solid ${C.border}` : 'none' }}>
                            {M.logo ? <img src={M.logo} alt={M.label} className="w-full h-full object-cover" /> : <M.icon size={14} color="#fff" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{w.user}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{tt(M.label)} · {w.date}{w.branch ? ` · 📍 ${w.branch}` : ''}</p>
                            {w.destinationNumber && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-xs" style={{ ...fontMono, color: C.muted }}>→ {w.destinationNumber} ({w.destinationName})</p>
                                {!namesMatch(w.user, w.destinationName) && <Badge tone="amber">⚠</Badge>}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ ...fontMono, color: C.danger }} className="text-sm font-semibold">−{money(w.amount)}</span>
                          <Badge tone={w.status === 'confirmed' ? 'mint' : w.status === 'rejected' ? 'danger' : 'amber'}>
                            {w.status === 'confirmed' ? tt("Konfime") : w.status === 'rejected' ? tt("Refize") : tt("Ap tann")}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {nav === 'goals' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Depo Objektif")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Apèsi objektif epay kliyan yo — pa bezwen apwobasyon.")}</p>

              <div className="mt-6">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>{tt("Kliyan")}</Th><Th>{tt("Objektif")}</Th><Th>{tt("Pwogrè")}</Th><Th align="right">{tt("Ekonomize")}</Th><Th align="right">{tt("Sib")}</Th></tr>
                  </thead>
                  <tbody>
                    {loadingGoals ? <EmptyRow colSpan={5}>{tt("Ap chaje...")}</EmptyRow>
                      : goals.length === 0 ? <EmptyRow colSpan={5}>{tt("Pa gen objektif.")}</EmptyRow>
                      : goals.map((g) => {
                        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                        return (
                          <tr key={g.id}>
                            <Td>
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: C.bg, color: C.navy }}>{initials(g.user.fullName)}</div>
                                <div>
                                  <p className="font-medium">{g.user.fullName}</p>
                                  <p className="text-xs" style={{ color: C.muted }}>{g.user.phone}</p>
                                </div>
                              </div>
                            </Td>
                            <Td><span className="font-medium">{g.title}</span> {g.status === 'completed' && <Badge tone="mint">{tt("Atenn")}</Badge>}{g.status === 'withdrawn' && <Badge tone="muted">{tt("Retire")}</Badge>}</Td>
                            <Td>
                              <div className="flex items-center gap-2" style={{ minWidth: 130 }}>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.bg }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? C.mint : C.sky }} />
                                </div>
                                <span className="text-xs font-semibold" style={{ color: C.muted }}>{pct}%</span>
                              </div>
                            </Td>
                            <Td align="right"><span className="font-semibold">{money(g.saved)}</span></Td>
                            <Td align="right"><span style={{ color: C.muted }}>{money(g.target)}</span></Td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {nav === 'loans' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Prè")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>
                {admin?.role === 'agent' ? tt("Gade estati ak dat echeans prè kliyan yo.") : tt("Apwouve oswa refize demand prè, swiv vèsman yo.")}
              </p>

              <div className="mt-6">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr>
                      <Th>{tt("Kliyan")}</Th><Th align="right">{tt("Montan")}</Th><Th>{tt("Plan")}</Th><Th>{tt("Vèsman")}</Th><Th>{tt("Pwochen echeans")}</Th><Th align="center">{tt("Estati")}</Th>
                      {admin?.role !== 'agent' && <Th align="right">{tt("Aksyon")}</Th>}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingLoans ? <EmptyRow colSpan={7}>{tt("Ap chaje...")}</EmptyRow>
                      : loans.length === 0 ? <EmptyRow colSpan={7}>{tt("Pa gen prè.")}</EmptyRow>
                      : loans.map((l) => {
                        const paidCount = (l.installments || []).filter((i) => i.status === 'paid').length;
                        const nextInstallment = (l.installments || []).find((i) => i.status !== 'paid');
                        const nextDue = nextInstallment ? addMonthsToDate(l.decidedAt || l.createdAt, nextInstallment.n) : null;
                        return (
                          <tr key={l.id} style={{ opacity: l.status === 'rejected' ? 0.5 : 1 }}>
                            <Td>
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: C.bg, color: C.navy }}>{initials(l.user.fullName)}</div>
                                <div>
                                  <p className="font-medium">{l.user.fullName}</p>
                                  <p className="text-xs" style={{ color: C.muted }}>{l.user.phone}</p>
                                </div>
                              </div>
                            </Td>
                            <Td align="right"><span className="font-semibold">{money(l.amount)}</span></Td>
                            <Td>{l.months} {tt("mwa ·")} {(l.rate * 100).toFixed(0)}%</Td>
                            <Td>{l.status === 'pending' ? '—' : tt("{0}/{1} peye", paidCount, l.installments.length)}</Td>
                            <Td>{nextDue || '—'}</Td>
                            <Td align="center">
                              <Badge tone={l.status === 'pending' ? 'amber' : l.status === 'active' ? 'navy' : l.status === 'rejected' ? 'danger' : 'mint'}>
                                {l.status === 'pending' ? tt("Ap tann") : l.status === 'active' ? tt("Aktif") : l.status === 'rejected' ? tt("Refize") : tt("Peye")}
                              </Badge>
                            </Td>
                            {admin?.role !== 'agent' && (
                              <Td align="right">
                                {l.status === 'pending' && (
                                  <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => rejectLoan(l.id)} className="bp-btn px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ border: `1px solid ${C.border}`, color: C.danger }}>{tt("Refize@@btn")}</button>
                                    <button onClick={() => approveLoan(l.id)} className="bp-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: C.mint }}>{tt("Apwouve")}</button>
                                  </div>
                                )}
                              </Td>
                            )}
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {nav === 'transfers' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Transfè")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Istorik transfè ant kliyan yo — fèt otomatikman, pa bezwen apwobasyon.")}</p>

              <div className="mt-6">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>{tt("Soti")}</Th><Th>{tt("Rive")}</Th><Th align="right">{tt("Montan")}</Th><Th align="right">{tt("Dat")}</Th></tr>
                  </thead>
                  <tbody>
                    {loadingTransfers ? <EmptyRow colSpan={4}>{tt("Ap chaje...")}</EmptyRow>
                      : transfers.length === 0 ? <EmptyRow colSpan={4}>{tt("Pa gen transfè.")}</EmptyRow>
                      : transfers.map((t) => (
                        <tr key={t.id}>
                          <Td><span className="font-medium">{t.fromUser.fullName}</span></Td>
                          <Td><span className="font-medium">{t.toUser.fullName}</span></Td>
                          <Td align="right"><span className="font-semibold">{money(t.amount)}</span></Td>
                          <Td align="right"><span className="text-xs" style={{ color: C.muted }}>{new Date(t.createdAt).toLocaleString('fr-FR')}</span></Td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {nav === 'sol' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("BLIC Sòl")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>
                {admin?.role === 'agent' ? tt("Gade enfòmasyon gwoup yo pou reponn kesyon kliyan lokal ou yo.") : tt("Apwouve demand adezyon, swiv kapasite chak gwoup.")}
              </p>

              {admin?.role !== 'agent' && (
              <>
              <div className="mt-6 flex items-center justify-between">
                <h3 className="font-semibold text-sm" style={{ color: C.muted }}>{tt("DEMAND K'AP TANN APWOBASYON")}</h3>
              </div>
              <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {loadingSol ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
                ) : solRequests.length === 0 ? (
                  <p className="text-sm p-5" style={{ color: C.muted, background: C.card }}>{tt("Pa gen demand k'ap tann.")}</p>
                ) : solRequests.map((r, i) => (
                  <div key={r.id} className="px-5 py-4"
                    style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: C.bg }}>
                          <Users size={16} color={C.navy} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.user.fullName}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{r.user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{r.group.name}</p>
                          <p className="text-xs" style={{ color: C.muted }}>{r.group.frequency} · {money(r.group.amount)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => rejectSol(r.id)} className="bp-btn w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${C.border}` }}>
                            <X size={15} color={C.danger} />
                          </button>
                          <button onClick={() => setApprovingSolId(approvingSolId === r.id ? null : r.id)} className="bp-btn px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5" style={{ background: C.mint, color: '#fff' }}>
                            <Check size={13} /> {tt("Apwouve")}
                          </button>
                        </div>
                      </div>
                    </div>
                    {approvingSolId === r.id && (
                      <div className="mt-3 p-3 rounded-xl flex items-center gap-2 flex-wrap" style={{ background: C.bg }}>
                        <span className="text-xs font-semibold" style={{ color: C.muted }}>{tt("Chwazi pozisyon (6 a 10):")}</span>
                        {Array.from({ length: 5 }, (_, idx) => idx + 6).map((pos) => {
                          const count = r.positionCounts?.[pos] || 0;
                          const taken = count >= 2;
                          return (
                            <button key={pos} disabled={taken} onClick={() => approveSol(r.id, pos)}
                              className="bp-btn w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
                              style={{
                                background: taken ? C.border : C.card, color: taken ? C.muted : C.navy,
                                border: `1px solid ${taken ? C.border : C.navy}`, cursor: taken ? 'not-allowed' : 'pointer',
                              }}>
                              {pos}{count > 0 ? `(${count}/2)` : ''}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </>
              )}

              <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
                <h3 className="font-semibold text-sm" style={{ color: C.muted }}>{tt("TOUT GWOUP YO (")}{solGroups.length})</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'all', label: tt("Tout") },
                      { id: 'semenn', label: tt("Chak semenn") },
                      { id: 'kenzenn', label: tt("Chak 15 jou") },
                      { id: 'mwa', label: tt("Chak mwa") },
                    ].map((f) => (
                      <button key={f.id} onClick={() => setSolFreqFilter(f.id)}
                        className="bp-btn rounded-lg text-xs font-medium"
                        style={{ padding: '6px 11px',
                          background: solFreqFilter === f.id ? C.navy : C.card,
                          color: solFreqFilter === f.id ? '#fff' : C.muted,
                          border: `1px solid ${solFreqFilter === f.id ? C.navy : C.border}`,
                        }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'all', label: tt("Tout nivo") },
                      { id: 'basic', label: 'Basic' },
                      { id: 'standard', label: 'Standard' },
                      { id: 'premium', label: 'Premium' },
                    ].map((t) => (
                      <button key={t.id} onClick={() => setSolTierFilter(t.id)}
                        className="bp-btn rounded-lg text-xs font-medium"
                        style={{ padding: '6px 11px',
                          background: solTierFilter === t.id ? C.navy : C.card,
                          color: solTierFilter === t.id ? '#fff' : C.muted,
                          border: `1px solid ${solTierFilter === t.id ? C.navy : C.border}`,
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                {solGroups
                  .filter((g) => solFreqFilter === 'all' || g.frequencyId === solFreqFilter)
                  .filter((g) => solTierFilter === 'all' || g.tierId === solTierFilter)
                  .map((g) => {
                  const isFull = g.approvedCount >= g.maxMembers;
                  return (
                    <button key={g.id} onClick={() => openSolGroup(g)} className="bp-btn text-left p-4 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-xs">{g.name}</h3>
                        <Badge tone={g.tier === 'Premium' ? 'premium' : g.tier === 'Standard' ? 'navy' : 'muted'}>{g.tier}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs" style={{ color: C.muted }}>{g.frequency} · {money(g.amount)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs" style={{ color: C.muted }}>{tt("Manm")}</span>
                        <Badge tone={isFull ? 'mint' : 'muted'}>{g.approvedCount}/{g.maxMembers}</Badge>
                      </div>
                      {g.pendingCount > 0 && <p className="mt-1 text-xs" style={{ color: C.amber }}>{g.pendingCount} {tt("demand ap tann")}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {nav === 'solPayouts' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Pòch Sòl resevwa")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Istorik tout pòch Sòl ki reyèlman peye — chak fwa yon manm resevwa nan wotasyon an.")}</p>
              <div className="mt-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {loadingSolPayouts ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Ap chaje...")}</p>
                ) : solPayouts.length === 0 ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>{tt("Pa gen okenn pòch peye toujou.")}</p>
                ) : solPayouts.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
                    style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: C.bg }}>
                        <HandCoins size={15} color={C.gold} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{p.user.fullName}</p>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{p.user.phone} · {new Date(p.paidAt).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span style={fontMono} className="text-sm font-semibold" >{money(p.amount)}</span>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{p.group.name} {tt("· pozisyon #")}{p.period + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nav === 'business' && <BusinessReview token={token} />}
          {nav === 'monitoring' && <MonitoringPage token={token} flash={flash} />}
          {nav === 'reconciliation' && <ReconciliationPage token={token} flash={flash} />}
          {nav === 'audit' && <AuditPage token={token} flash={flash} />}

          {nav === 'kyc' && (
            <div className="fadein">
              {!selectedKyc ? (
                <>
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Verifikasyon KYC")}</h1>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>{kycSubmissions.length} {tt("demand ap tann egzamen — analize pa Didit.")}</p>

                  <div className="mt-6 flex flex-col gap-3">
                    {loadingKyc ? (
                      <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
                    ) : kycSubmissions.length === 0 ? (
                      <p className="text-sm p-5 rounded-xl" style={{ color: C.muted, background: C.card, border: `1px solid ${C.border}` }}>{tt("Pa gen demand k'ap tann.")}</p>
                    ) : kycSubmissions.map((s) => (
                      <button key={s.id} onClick={() => openKyc(s)} className="bp-btn text-left p-4 rounded-xl flex items-center justify-between"
                        style={{ background: C.card, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
                            <User size={16} color={C.navy} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{s.user.fullName}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{s.user.phone} · {new Date(s.startedAt).toLocaleString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.diditStatus && <Badge tone={s.diditStatus === 'Approved' ? 'mint' : s.diditStatus === 'Declined' ? 'danger' : 'navy'}>{s.diditStatus}</Badge>}
                          <Badge tone="amber">{tt("Ap tann")}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => { setSelectedKyc(null); setKycDetail(null); }} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: C.muted }}>
                    <ChevronLeft size={15} /> {tt("Retounen nan lis la")}
                  </button>

                  <div className="p-5 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
                          <User size={18} color={C.navy} />
                        </div>
                        <div>
                          <p className="font-bold">{selectedKyc.user.fullName}</p>
                          <p className="text-xs" style={{ color: C.muted }}>{selectedKyc.user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {kycDetail?.diditStatus && (
                          <Badge tone={kycDetail.diditStatus === 'Approved' ? 'mint' : kycDetail.diditStatus === 'Declined' ? 'danger' : 'navy'}>
                            {tt("Didit:")} {kycDetail.diditStatus}
                          </Badge>
                        )}
                        <button onClick={refreshKycFromDidit} disabled={kycRefreshing}
                          className="bp-btn px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1"
                          style={{ background: C.bg, color: C.navy, border: `1px solid ${C.border}`, opacity: kycRefreshing ? 0.6 : 1 }}>
                          <RefreshCw size={12} className={kycRefreshing ? 'animate-spin' : ''} />
                          {kycRefreshing ? tt("Ap chèche...") : tt("Rafrechi")}
                        </button>
                      </div>
                    </div>

                    {!kycDetail ? (
                      <p className="text-sm mt-4" style={{ color: C.muted }}>{tt("Ap chaje rapò a...")}</p>
                    ) : (
                      <>
                        <div className="mt-4 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: '#EFE7D8', color: C.navy }}>
                          <ShieldCheck size={15} className="shrink-0 mt-0.5" />
                          {tt("Didit deja analize dokiman an, selfi a (liveness + face match), ak yon egzamen AML. Egzamine rapò a anba a anvan ou deside.")}
                        </div>

                        <p className="mt-4 text-sm font-semibold" style={{ color: C.muted }}>{tt("Rezime chif ak eskò")}</p>
                        {(() => {
                          let sections = [];
                          try {
                            const parsed = JSON.parse(kycDetail.diditReport || '{}');
                            const SCORE_KEYS = /^(score|similarity|confidence|face_match_similarity|liveness_confidence)$/i;
                            const SKIP_KEYS = new Set(['session_id', 'workflow_id', 'application_id', 'event_id', 'source_image_session_id']);

                            const collectFromItem = (item, label) => {
                              if (!item || typeof item !== 'object') return;
                              const status = typeof item.status === 'string' ? item.status : null;
                              let score = null;
                              for (const [k, v] of Object.entries(item)) {
                                if (typeof v === 'number' && SCORE_KEYS.test(k) && !SKIP_KEYS.has(k)) { score = v; break; }
                              }
                              if (status || score != null) sections.push({ label, status, score });
                            };

                            for (const [key, value] of Object.entries(parsed)) {
                              if (SKIP_KEYS.has(key)) continue;
                              const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                              if (Array.isArray(value)) {
                                value.forEach((item, i) => collectFromItem(item, value.length > 1 ? `${label} ${i + 1}` : label));
                              } else if (value && typeof value === 'object' && key !== 'features') {
                                collectFromItem(value, label);
                              }
                            }
                          } catch {}

                          if (sections.length === 0) {
                            return <p className="mt-1.5 text-xs" style={{ color: C.muted }}>{tt("Pa gen eskò disponib toujou.")}</p>;
                          }

                          return (
                            <div className="mt-1.5 flex flex-col gap-2">
                              {sections.map((s, i) => (
                                <div key={i} className="p-2.5 rounded-lg" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold">{s.label}</span>
                                    {s.status && (
                                      <Badge tone={s.status === 'Approved' ? 'mint' : s.status === 'Declined' ? 'danger' : 'amber'}>{s.status}</Badge>
                                    )}
                                  </div>
                                  {s.score != null && (
                                    <div className="mt-1.5 flex items-center gap-2">
                                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: C.border }}>
                                        <div style={{ width: `${Math.min(100, s.score)}%`, height: '100%', background: s.score >= 80 ? C.mint : s.score >= 50 ? '#D98B1D' : C.danger }} />
                                      </div>
                                      <span className="text-xs font-semibold" style={{ color: C.ink }}>{Math.round(s.score * 10) / 10}%</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        <p className="mt-4 text-sm font-semibold" style={{ color: C.muted }}>{tt("Foto Didit jwenn")}</p>
                        {(() => {
                          let images = [];
                          try {
                            const parsed = JSON.parse(kycDetail.diditReport || '{}');
                            const seen = new Set();
                            const walk = (node) => {
                              if (!node || typeof node !== 'object') return;
                              for (const [key, value] of Object.entries(node)) {
                                if (typeof value === 'string' && /_image$/.test(key) && /^https?:\/\//.test(value) && !seen.has(value)) {
                                  seen.add(value);
                                  images.push({ label: key.replace(/_/g, ' '), url: value });
                                } else if (value && typeof value === 'object') {
                                  walk(value);
                                }
                              }
                            };
                            walk(parsed);
                          } catch {}
                          if (images.length === 0) {
                            return <p className="mt-1.5 text-xs" style={{ color: C.muted }}>{tt("Pa gen foto disponib toujou nan rapò a.")}</p>;
                          }
                          return (
                            <div className="mt-1.5 grid grid-cols-2 gap-2.5">
                              {images.map((img) => (
                                <a key={img.url} href={img.url} target="_blank" rel="noreferrer" className="block">
                                  <img src={img.url} alt={img.label} className="w-full rounded-lg object-cover"
                                    style={{ border: `1px solid ${C.border}`, aspectRatio: '4/3', background: C.bg }} />
                                  <p className="mt-1 text-xs capitalize" style={{ color: C.muted }}>{img.label}</p>
                                </a>
                              ))}
                            </div>
                          );
                        })()}

                        <p className="mt-4 text-sm font-semibold" style={{ color: C.muted }}>{tt("Rapò konplè Didit")}</p>
                        <pre className="mt-1.5 p-3 rounded-lg text-xs overflow-auto"
                          style={{ background: C.bg, border: `1px solid ${C.border}`, maxHeight: 360, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(kycDetail.diditReport || '{}'), null, 2);
                            } catch {
                              return kycDetail.diditReport || tt("Pa gen rapò disponib toujou — tann webhook Didit la rive.");
                            }
                          })()}
                        </pre>
                      </>
                    )}

                    <textarea value={kycRejectReason} onChange={(e) => setKycRejectReason(e.target.value)}
                      placeholder={tt("Rezon refi (obligatwa si ou refize)...")}
                      className="mt-4 w-full rounded-lg text-sm p-3" style={{ border: `1px solid ${C.border}`, minHeight: 60 }} />

                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => decideKyc('reject')} className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ border: `1px solid ${C.border}`, color: C.danger }}>
                        <X size={14} className="inline mr-1.5" style={{ verticalAlign: -2 }} /> {tt("Refize@@btn")}
                      </button>
                      <button onClick={() => decideKyc('approve')} className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.mint }}>
                        <Check size={14} className="inline mr-1.5" style={{ verticalAlign: -2 }} /> {tt("Apwouve")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {nav === 'verificationRequests' && (
            <div className="fadein">
              {!selectedVr ? (
                <>
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Dokiman Siplemantè")}</h1>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>{vrPending.length} {tt("demand ap tann egzamen.")}</p>

                  <div className="mt-6 flex flex-col gap-3">
                    {loadingVr ? (
                      <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
                    ) : vrPending.length === 0 ? (
                      <p className="text-sm p-5 rounded-xl" style={{ color: C.muted, background: C.card, border: `1px solid ${C.border}` }}>{tt("Pa gen demand k'ap tann.")}</p>
                    ) : vrPending.map((r) => (
                      <button key={r.id} onClick={() => { setSelectedVr(r); setVrRejectReason(''); }} className="bp-btn text-left p-4 rounded-xl flex items-center justify-between"
                        style={{ background: C.card, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
                            <FileText size={16} color={C.navy} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{r.user.fullName}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{r.user.phone} · {new Date(r.submittedAt).toLocaleString('fr-FR')}</p>
                          </div>
                        </div>
                        <Badge tone="navy">{VR_TYPE_LABELS[r.type] || r.type}</Badge>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setSelectedVr(null)} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: C.muted }}>
                    <ChevronLeft size={15} /> {tt("Retounen nan lis la")}
                  </button>

                  <div className="p-5 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
                          <User size={18} color={C.navy} />
                        </div>
                        <div>
                          <p className="font-bold">{selectedVr.user.fullName}</p>
                          <p className="text-xs" style={{ color: C.muted }}>{selectedVr.user.phone}</p>
                        </div>
                      </div>
                      <Badge tone="navy">{VR_TYPE_LABELS[selectedVr.type] || selectedVr.type}</Badge>
                    </div>

                    {selectedVr.note && (
                      <p className="mt-4 text-xs p-3 rounded-lg" style={{ background: C.bg, color: C.muted }}>
                        {tt("Nòt admin:")} {selectedVr.note}
                      </p>
                    )}

                    <p className="mt-4 text-sm font-semibold" style={{ color: C.muted }}>{tt("Dokiman kliyan an voye")}</p>
                    {selectedVr.fileData ? (
                      selectedVr.fileMimeType?.startsWith('image/') ? (
                        <img src={`data:${selectedVr.fileMimeType};base64,${selectedVr.fileData}`} alt={tt("Dokiman")}
                          className="mt-1.5 w-full rounded-lg" style={{ border: `1px solid ${C.border}`, maxHeight: 420, objectFit: 'contain', background: C.bg }} />
                      ) : (
                        <a className="mt-1.5 inline-block text-sm font-semibold" style={{ color: C.navy }}
                          href={`data:${selectedVr.fileMimeType};base64,${selectedVr.fileData}`} download={`document-${selectedVr.id}`}>
                          {tt("Telechaje dokiman an")}
                        </a>
                      )
                    ) : (
                      <p className="mt-1.5 text-xs" style={{ color: C.muted }}>{tt("Pa gen fichye — kliyan an refè verifikasyon idantite li via Didit (gade nan seksyon KYC).")}</p>
                    )}

                    <textarea value={vrRejectReason} onChange={(e) => setVrRejectReason(e.target.value)}
                      placeholder={tt("Rezon refi (obligatwa si ou refize)...")}
                      className="mt-4 w-full rounded-lg text-sm p-3" style={{ border: `1px solid ${C.border}`, minHeight: 60 }} />

                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => decideVerificationRequest('reject')} className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ border: `1px solid ${C.border}`, color: C.danger }}>
                        <X size={14} className="inline mr-1.5" style={{ verticalAlign: -2 }} /> {tt("Refize@@btn")}
                      </button>
                      <button onClick={() => decideVerificationRequest('approve')} className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.mint }}>
                        <Check size={14} className="inline mr-1.5" style={{ verticalAlign: -2 }} /> {tt("Apwouve")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {nav === 'support' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Mesaj Sipò")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>{supportMessages.length} {tt("mesaj kliyan ki poko rezoud.")}</p>

              <div className="mt-6 flex flex-col gap-3">
                {loadingSupport ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
                ) : supportMessages.length === 0 ? (
                  <p className="text-sm p-5 rounded-xl" style={{ color: C.muted, background: C.card, border: `1px solid ${C.border}` }}>{tt("Pa gen mesaj k'ap tann.")}</p>
                ) : supportMessages.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bg }}>
                          <User size={16} color={C.navy} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{m.user.fullName}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{m.user.phone} · {new Date(m.createdAt).toLocaleString('fr-FR')}</p>
                        </div>
                      </div>
                      <Badge tone="navy">{SUPPORT_SUBJECT_LABELS[m.subject] || m.subject}</Badge>
                    </div>
                    <p className="mt-3 text-sm" style={{ color: C.ink }}>{m.message}</p>
                    <button onClick={() => closeSupportMessage(m.id)}
                      className="bp-btn mt-3 text-xs font-semibold px-3 py-1.5 rounded-md" style={{ background: C.bg, color: C.mint, border: `1px solid ${C.border}` }}>
                      <Check size={12} className="inline mr-1" style={{ verticalAlign: -1 }} /> {tt("Make rezoud")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nav === 'users' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>{tt("Itilizatè")}</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>{tt("Klike sou yon kliyan pou wè detay ak istorik li.")}</p>
              {privateBeta && (
                <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: '#FFF8E6', border: '1px solid #F2D58A' }}>
                  <Lock size={16} color="#8A6100" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#5C4100' }}>{tt("Mòd tès prive aktif")}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#7A5A10' }}>{tt("Sèlman admin, ajan ak kont ki gen « Aksè tès » ka konekte nan app la ak sit la. Lòt moun ka kreye kont men yo pa ka antre.")}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 relative" style={{ maxWidth: 320 }}>
                <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={query} onChange={(e) => { setQuery(e.target.value); loadUsers(token, e.target.value); }} placeholder={tt("Chèche non oswa telefòn")}
                  className="pl-8 pr-3 py-2 rounded-lg text-sm w-full" style={{ background: C.card, border: `1px solid ${C.border}` }} />
              </div>

              <div className="mt-4">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>{tt("Non")}</Th><Th>{tt("Telefòn")}</Th><Th>ID</Th><Th align="right">{tt("Balans")}</Th><Th align="center">{tt("Verifye")}</Th><Th align="center">{tt("Estati")}</Th></tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? <EmptyRow colSpan={6}>{tt("Ap chaje...")}</EmptyRow>
                      : users.length === 0 ? <EmptyRow colSpan={6}>{tt("Pa gen rezilta.")}</EmptyRow>
                      : users.map((u) => (
                        <tr key={u.id} onClick={() => openUser(u)} style={{ cursor: 'pointer' }}>
                          <Td>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: u.role === 'admin' ? '#F4EBFF' : C.bg, color: u.role === 'admin' ? C.purple : C.navy }}>{initials(u.fullName)}</div>
                              <span className="font-medium">{u.fullName}</span>
                              {u.role === 'admin' && <Badge tone="premium">{tt("Admin")}</Badge>}
                            </div>
                          </Td>
                          <Td>{u.phone}</Td>
                          <Td><span style={fontMono} className="text-xs">{u.clientId || '—'}</span></Td>
                          <Td align="right"><span className="font-semibold">{money(u.balance)}</span></Td>
                          <Td align="center"><Badge tone={u.verified ? 'mint' : 'amber'}>{u.verified ? tt("Wi") : tt("Non")}</Badge></Td>
                          <Td align="center"><div className="flex items-center justify-center gap-1.5 flex-wrap"><Badge tone={u.blocked ? 'danger' : 'mint'}>{u.blocked ? tt("Bloke") : tt("Aktif")}</Badge>{privateBeta && u.role === 'member' && (u.betaAccess ? <Badge tone="navy">{tt("Aksè tès")}</Badge> : <Badge tone="muted">{tt("San aksè")}</Badge>)}</div></Td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </div>

      {/* Sol group members + payout dates drawer */}
      {selectedSolGroup && (
        <>
          <div onClick={() => setSelectedSolGroup(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.35)', zIndex: 50 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: C.card, zIndex: 51, boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: 24 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{selectedSolGroup.name}</p>
                <p className="text-xs" style={{ color: C.muted }}>{selectedSolGroup.frequency} · {money(selectedSolGroup.amount)} {tt("pa moun")}</p>
              </div>
              <button onClick={() => setSelectedSolGroup(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
                <X size={14} color={C.muted} />
              </button>
            </div>

            <p className="mt-6 text-sm font-semibold" style={{ color: C.muted }}>{tt("Wotasyon ak dat peman")}</p>
            <div className="mt-2 flex flex-col gap-2">
              {!solGroupMembers ? (
                <p className="text-xs" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
              ) : solGroupMembers.length === 0 ? (
                <p className="text-xs" style={{ color: C.muted }}>{tt("Pa gen manm apwouve poko.")}</p>
              ) : solGroupMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: C.bg, color: C.navy }}>{initials(m.name)}</div>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{m.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: C.navy }}>{m.payoutDate}</p>
                    {admin?.role === 'agent' ? (
                      <p className="mt-1 text-xs" style={{ color: C.muted }}>{tt("pozisyon #")}{m.turnIndex + 1}</p>
                    ) : (
                      <select value={m.turnIndex + 1}
                        onChange={(e) => reassignSolPosition(selectedSolGroup.id, m.id, Number(e.target.value))}
                        className="mt-1 text-xs rounded-md px-1.5 py-0.5" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
                        {Array.from({ length: selectedSolGroup.maxMembers }, (_, idx) => idx + 1).map((pos) => (
                          <option key={pos} value={pos}>{tt("pozisyon #")}{pos}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Per-user detail drawer */}
      {selectedUser && (
        <>
          <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.35)', zIndex: 50 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: C.card, zIndex: 51, boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: 24 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: selectedUser.role === 'admin' ? '#F4EBFF' : C.bg, color: selectedUser.role === 'admin' ? C.purple : C.navy }}>
                  {initials(selectedUser.fullName)}
                </div>
                <div>
                  <p className="font-bold">{selectedUser.fullName}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{selectedUser.phone} · {selectedUser.clientId || '—'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
                <X size={14} color={C.muted} />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl" style={{ background: C.navy }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{tt("BALANS AKTYÈL")}</p>
              <p style={{ ...fontDisplay, fontSize: 22, fontWeight: 800, color: '#fff' }}>{money(selectedUser.balance)}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => toggleBlock(selectedUser)} className="bp-btn flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ border: `1px solid ${C.border}`, color: selectedUser.blocked ? C.mint : C.danger }}>
                <Lock size={12} /> {selectedUser.blocked ? tt("Debloke kont") : tt("Bloke kont")}
              </button>
              <button onClick={() => toggleVerify(selectedUser)} className="bp-btn flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ border: `1px solid ${C.border}`, color: selectedUser.verified ? C.amber : C.mint }}>
                <BadgeCheck size={12} /> {selectedUser.verified ? tt("Retire verifikasyon") : tt("Verifye@@verb")}
              </button>
            </div>
            {selectedUser.role === 'member' && (
              <button onClick={() => toggleBeta(selectedUser)} className="bp-btn mt-2 w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: selectedUser.betaAccess ? C.card : C.navy, border: `1px solid ${selectedUser.betaAccess ? C.border : C.navy}`, color: selectedUser.betaAccess ? C.danger : '#fff' }}>
                <KeyRound size={12} /> {selectedUser.betaAccess ? tt("Retire aksè tès") : tt("Bay aksè tès (tèstè)")}
              </button>
            )}

            <p className="mt-5 text-sm font-semibold" style={{ color: C.muted }}>{tt("Ajisteman manyèl balans")}</p>
            <div className="mt-2 flex items-center gap-2">
              <input value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder={tt("+/- montan")} type="number"
                className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }} />
              <button onClick={submitBalanceAdjust} className="bp-btn px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: C.navy }}>{tt("Ajiste")}</button>
            </div>
            <input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder={tt("Rezon (obligatwa)")}
              className="mt-2 w-full px-3 py-2 rounded-lg text-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }} />

            <p className="mt-6 text-sm font-semibold" style={{ color: C.muted }}>{tt("Dokiman siplemantè")}</p>
            <div className="mt-2 flex items-center gap-2">
              <select value={newVrType} onChange={(e) => setNewVrType(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <option value="address_proof">{tt("Prèv adrès")}</option>
                <option value="income_proof">{tt("Prèv revni")}</option>
                <option value="identity_reverify">{tt("Refè verifikasyon idantite")}</option>
                <option value="other">{tt("Lòt dokiman")}</option>
              </select>
              <button onClick={createVerificationRequest} disabled={creatingVr}
                className="bp-btn px-3 py-2 rounded-lg text-xs font-semibold text-white shrink-0" style={{ background: C.navy, opacity: creatingVr ? 0.6 : 1 }}>
                {tt("Mande")}
              </button>
            </div>
            <input value={newVrNote} onChange={(e) => setNewVrNote(e.target.value)} placeholder={tt("Nòt pou kliyan an (opsyonèl)")}
              className="mt-2 w-full px-3 py-2 rounded-lg text-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }} />

            <div className="mt-3 flex flex-col gap-2">
              {userVrRequests === null ? (
                <p className="text-xs" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
              ) : userVrRequests.length === 0 ? (
                <p className="text-xs" style={{ color: C.muted }}>{tt("Pa gen demand dokiman siplemantè pou kliyan sa a.")}</p>
              ) : userVrRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                  <div>
                    <p className="text-xs font-semibold">{VR_TYPE_LABELS[r.type] || r.type}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{new Date(r.requestedAt).toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR')}</p>
                  </div>
                  {r.status === 'submitted' ? (
                    <button onClick={() => { setSelectedVr(r); setVrRejectReason(''); setNav('verificationRequests'); }}
                      className="bp-btn text-xs font-semibold px-2.5 py-1.5 rounded-md" style={{ background: C.bg, color: C.navy, border: `1px solid ${C.border}` }}>
                      {tt("Egzamine")}
                    </button>
                  ) : (
                    <Badge tone={r.status === 'approved' ? 'mint' : r.status === 'rejected' ? 'danger' : 'amber'}>
                      {r.status === 'approved' ? tt("Apwouve@@status") : r.status === 'rejected' ? tt("Refize") : tt("Ap tann kliyan")}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold" style={{ color: C.muted }}>{tt("Istorik Depo")}</p>
            <div className="mt-2 flex flex-col gap-2">
              {!userDetail ? (
                <p className="text-xs" style={{ color: C.muted }}>{tt("Ap chaje...")}</p>
              ) : userDetail.deposits.length === 0 ? (
                <p className="text-xs" style={{ color: C.muted }}>{tt("Pa gen depo.")}</p>
              ) : userDetail.deposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                  <div>
                    <p className="text-xs font-semibold">{methodIcons[d.method]?.label || d.method}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{new Date(d.createdAt).toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{money(d.amount)}</p>
                    <Badge tone={d.status === 'confirmed' ? 'mint' : d.status === 'rejected' ? 'danger' : 'amber'}>{d.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {userDetail && userDetail.solMemberships.length > 0 && (
              <>
                <p className="mt-6 text-sm font-semibold" style={{ color: C.muted }}>{tt("BLIC Sòl")}</p>
                <div className="mt-2 flex flex-col gap-3">
                  {userDetail.solMemberships.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold">{m.group.name}</p>
                        <Badge tone={m.status === 'approved' ? 'mint' : m.status === 'rejected' ? 'danger' : 'amber'}>{m.status}</Badge>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs" style={{ color: C.muted }}>{tt("Dokiman Sòl la")}</span>
                        <button onClick={() => toggleSolFormApproved(m.id, !m.formApproved)}
                          className="bp-btn px-2.5 py-1 rounded-md text-xs font-semibold"
                          style={{ background: m.formApproved ? '#E9F0EA' : '#F3E8D2', color: m.formApproved ? C.mint : '#8A6423' }}>
                          {m.formApproved ? tt("Konfime ✓") : tt("Make konfime")}
                        </button>
                      </div>

                      {(m.documents || []).length > 0 && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          {m.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-xs px-2 py-1.5 rounded" style={{ background: C.bg }}>
                              <span>{doc.title}</span>
                              <span style={{ color: C.muted }}>{new Date(doc.uploadedAt).toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR')}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2.5 flex flex-col gap-1.5">
                        <input value={solDocTitle} onChange={(e) => setSolDocTitle(e.target.value)}
                          placeholder={tt("Tit dokiman an (egzanp: Fiche d'informations)")}
                          className="px-2.5 py-1.5 rounded-md text-xs" style={{ background: C.bg, border: `1px solid ${C.border}` }} />
                        <input type="file" accept="image/*,application/pdf"
                          onChange={(e) => setSolDocFile(e.target.files?.[0] || null)}
                          className="text-xs" />
                        <button onClick={() => uploadSolDocument(m.id)} disabled={solDocUploadingFor === m.id}
                          className="bp-btn py-1.5 rounded-md text-xs font-semibold text-white"
                          style={{ background: C.navy, opacity: solDocUploadingFor === m.id ? 0.7 : 1 }}>
                          {solDocUploadingFor === m.id ? tt("Ap telechaje...") : tt("Telechaje dokiman")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {nav === 'finance' && (
        <div className="fadein">
          <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 26 }}>{tt("Finans")}</h1>
          <p className="text-sm" style={{ color: C.muted, marginTop: 4 }}>
            {admin?.role === 'agent' ? tt("Volim ou jenere nan siikisal {0}.", admin?.branch || '') : tt("Vi jeneral sou volim ak revni BLICPay — detaye pa sous ak pa siikisal.")}
          </p>

          {loadingFinance || !financeData ? (
            <p className="text-sm text-center" style={{ color: C.muted, marginTop: 48 }}>{tt("Ap chaje...")}</p>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 20 }}>
                {[
                  { id: 'day', label: tt("Jodi a") },
                  { id: 'week', label: tt("Semèn nan") },
                  { id: 'month', label: tt("Mwa sa a") },
                  { id: 'year', label: tt("Ane sa a") },
                  { id: 'all', label: tt("Tout tan") },
                ].map((p) => (
                  <button key={p.id} onClick={() => { setFinancePeriod(p.id); loadFinance(p.id); }}
                    className="bp-btn rounded-lg text-sm font-medium"
                    style={{ padding: '8px 14px',
                      background: financePeriod === p.id ? C.navy : C.card,
                      color: financePeriod === p.id ? '#fff' : C.muted,
                      border: `1px solid ${financePeriod === p.id ? C.navy : C.border}`,
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Rezèv manyèl pa metòd — MonCash/NatCash pa gen API balans, sipè admin mete l ajou alamen */}
              <div className="rounded-2xl" style={{ marginTop: 18, padding: '16px 18px', background: C.card, border: `1px solid ${C.border}` }}>
                <p className="text-xs font-semibold" style={{ color: C.muted, marginBottom: 10 }}>{tt("REZÈV OPERASYONÈL (mete ajou alamen)")}</p>
                <div className="grid grid-cols-2" style={{ gap: 12 }}>
                  {['moncash', 'natcash'].map((methodId) => {
                    const reserve = reserves.find((r) => r.method === methodId);
                    const M = methodIcons[methodId];
                    const isEditing = editingReserveMethod === methodId;
                    return (
                      <div key={methodId} className="rounded-xl flex items-center justify-between" style={{ padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ background: '#fff', border: `1px solid ${C.border}` }}>
                            {M.logo ? <img src={M.logo} alt={M.label} className="w-full h-full object-cover" /> : <M.icon size={14} color={M.color} />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: C.muted }}>{tt(M.label)}</p>
                            {isEditing ? (
                              <input autoFocus value={reserveInput} onChange={(e) => setReserveInput(e.target.value)} type="number"
                                className="mt-0.5 text-sm rounded-md" style={{ ...fontMono, width: 130, padding: '3px 6px', border: `1px solid ${C.border}` }} />
                            ) : (
                              <p style={fontMono} className="text-sm font-bold">{money(reserve?.balance || 0)}</p>
                            )}
                          </div>
                        </div>
                        {admin?.role !== 'agent' && (
                          isEditing ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditingReserveMethod(null)} className="bp-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.card }}>
                                <X size={12} color={C.muted} />
                              </button>
                              <button onClick={() => saveReserve(methodId)} disabled={savingReserve} className="bp-btn w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: C.mint, opacity: savingReserve ? 0.6 : 1 }}>
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingReserveMethod(methodId); setReserveInput(String(reserve?.balance || 0)); }}
                              className="bp-btn text-xs font-semibold px-2.5 py-1.5 rounded-md" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.navy }}>
                              {tt("Modifye")}
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KPI yo — vi jeneral an yon kout je */}
              <div className={`grid grid-cols-2 ${admin?.role === 'agent' ? 'lg:grid-cols-3' : 'lg:grid-cols-5'}`} style={{ gap: 12, marginTop: 18 }}>
                {admin?.role !== 'agent' && (
                <div className="rounded-2xl relative overflow-hidden flex flex-col items-center text-center" style={{ padding: '20px 16px', background: `linear-gradient(160deg, ${C.navy}, ${C.navyDeep})` }}>
                  <div style={{ position: 'absolute', bottom: -50, left: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(185,134,47,0.14)' }} />
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ position: 'relative', background: 'rgba(255,255,255,0.12)', marginBottom: 10 }}>
                    <TrendingUp size={16} color="#fff" />
                  </div>
                  <p className="text-xs" style={{ position: 'relative', color: 'rgba(255,255,255,0.7)' }}>{tt("Revni nèt total")}</p>
                  <p style={{ position: 'relative', ...fontDisplay, fontWeight: 800, fontSize: 20, color: '#fff', marginTop: 4 }}>{money(financeData.total)}</p>
                </div>
                )}
                <div className="rounded-2xl flex flex-col items-center text-center" style={{ padding: '20px 16px', background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#E6F0FB', marginBottom: 10 }}>
                    <Wallet size={16} color={C.navy} />
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>{tt("Volim depo")}</p>
                  <p style={{ ...fontDisplay, fontWeight: 800, fontSize: 20, color: C.ink, marginTop: 4 }}>{money(financeData.totalDepositVolume)}</p>
                </div>
                <div className="rounded-2xl flex flex-col items-center text-center" style={{ padding: '20px 16px', background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#FBEEDF', marginBottom: 10 }}>
                    <ArrowDownLeft size={16} color={C.gold} />
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>{tt("Volim retrè")}</p>
                  <p style={{ ...fontDisplay, fontWeight: 800, fontSize: 20, color: C.ink, marginTop: 4 }}>{money(financeData.totalWithdrawalVolume)}</p>
                </div>
                {admin?.role !== 'agent' && (
                <div className="rounded-2xl flex flex-col items-center text-center" style={{ padding: '20px 16px', background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F4EBFF', marginBottom: 10 }}>
                    <ArrowLeftRight size={16} color={C.purple} />
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>{tt("Volim transfè")}</p>
                  <p style={{ ...fontDisplay, fontWeight: 800, fontSize: 20, color: C.gold, marginTop: 4 }}>
                    {money(totalTransferVolume)}
                  </p>
                </div>
                )}
                <div className="rounded-2xl flex flex-col items-center text-center" style={{ padding: '20px 16px', background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#E4F5EF', marginBottom: 10 }}>
                    <User size={16} color={C.mint} />
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>{tt("Kliyan sèvi")}</p>
                  <p style={{ ...fontDisplay, fontWeight: 800, fontSize: 20, color: C.mint, marginTop: 4 }}>{financeData.totalUniqueClients || 0}</p>
                </div>
              </div>

              {/* Grafik volim jou pa jou */}
              {admin?.role !== 'agent' && financeData.dailyVolume && financeData.dailyVolume.length > 0 && (
                <div className="rounded-2xl" style={{ marginTop: 20, padding: '18px 20px', background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: 14 }}>
                    <p className="text-sm font-semibold" style={{ color: C.ink }}>{tt("Volim jou pa jou")}</p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: C.muted }}>
                      <span><span style={{ display: 'inline-block', width: 9, height: 9, background: C.navy, borderRadius: 2, marginRight: 5 }} />{tt("Depo")}</span>
                      <span><span style={{ display: 'inline-block', width: 9, height: 9, background: C.gold, borderRadius: 2, marginRight: 5 }} />{tt("Retrè")}</span>
                    </div>
                  </div>
                  {(() => {
                    const maxVal = Math.max(1, ...financeData.dailyVolume.map((d) => Math.max(d.deposits, d.withdrawals)));
                    return (
                      <div className="flex items-end" style={{ gap: 10, height: 130, overflowX: 'auto' }}>
                        {financeData.dailyVolume.map((d) => (
                          <div key={d.date} className="flex flex-col items-center justify-end" style={{ gap: 5, minWidth: 22, height: '100%' }}>
                            <div className="flex items-end" style={{ gap: 3, height: 100 }}>
                              <div style={{ width: 9, height: Math.round((d.deposits / maxVal) * 100), background: C.navy, borderRadius: '2px 2px 0 0' }} />
                              <div style={{ width: 9, height: Math.round((d.withdrawals / maxVal) * 100), background: C.gold, borderRadius: '2px 2px 0 0' }} />
                            </div>
                            <span style={{ fontSize: 9, color: C.muted }}>{new Date(d.date).toLocaleDateString(CURRENT_LANG === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {admin?.role !== 'agent' && (
              <>
              {/* Revni pa sous (egzistan deja) */}
              <p className="text-sm font-semibold" style={{ color: C.ink, marginTop: 24, marginBottom: 10 }}>{tt("Revni pa sous")}</p>
              <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                {[
                  { label: tt("Frè retrè"), sub: tt("1,25% sou lajan elektwonik"), value: financeData.breakdown.withdrawalFees, accent: C.mint },
                ].map((row, i) => (
                  <div key={row.label} className="flex items-center justify-between" style={{ padding: '15px 18px', borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 3, height: 30, borderRadius: 2, background: row.accent }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: C.ink }}>{row.label}</p>
                        <p className="text-xs" style={{ color: C.muted }}>{row.sub}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold" style={{ ...fontMono, color: C.ink }}>{money(row.value)}</p>
                  </div>
                ))}
              </div>
              </>
              )}

              {/* Detay pa siikisal — kounye a ak kliyan sèvi */}
              <p className="text-sm font-semibold" style={{ color: C.ink, marginTop: 24, marginBottom: 10 }}>
                {admin?.role === 'agent' ? tt("Detay siikisal {0}", admin?.branch || '') : tt("Detay pa siikisal")}
              </p>
              {Object.keys(financeData.byBranch || {}).length === 0 ? (
                <div className="flex flex-col items-center text-center rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}`, padding: '32px 24px' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: C.bg, marginBottom: 12 }}>
                    <Building2 size={18} color={C.muted} />
                  </div>
                  <p className="text-sm" style={{ color: C.muted }}>{tt("Pa gen okenn siikisal kreye toujou.")}</p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  {Object.entries(financeData.byBranch).map(([branch, stats], i) => (
                    <button key={branch} onClick={() => setSelectedFinanceBranch([branch, stats])}
                      className="bp-btn w-full flex items-center justify-between px-5 py-3.5 text-left"
                      style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                      <div className="flex items-center gap-2.5">
                        {i === 0 && stats.fees > 0 && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EFE7D8' }}>
                            <span style={{ fontSize: 12 }}>🏆</span>
                          </div>
                        )}
                        <p className="text-sm font-semibold" style={{ color: C.ink }}>{branch}</p>
                        <Badge tone="muted">{stats.agentCount} {tt("ajan")}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold" style={{ ...fontMono, color: C.mint }}>{money(stats.fees)}</p>
                        <ChevronRight size={15} color={C.muted} />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {admin?.role !== 'agent' && (
              <div className="flex items-start gap-2 text-xs rounded-lg" style={{ marginTop: 20, padding: 12, background: '#EFE7D8', color: C.navy }}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {tt("Kat \"Kliyan sèvi\" anlè a konte TOUT kliyan (menm depo MonCash otomatik yo). Nan detay chak siikisal (klike sou li), \"Kliyan sèvi\" konte sèlman sa yon AJAN konfime pandan peryòd la.")}
              </div>
              )}
            </>
          )}
        </div>
      )}

      {nav === 'agents' && (
        <div className="fadein">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 26 }}>{tt("Ajan")}</h1>
              <p className="text-sm" style={{ color: C.muted, marginTop: 4 }}>{tt("Kont ajan pou chak siikisal.")}</p>
            </div>
            <button onClick={() => {
                setEditingAgentId(null);
                setAgentForm({ fullName: '', phone: '', password: '', branch: '', email: '', idNumber: '', hireDate: '' });
                setAgentPhotoFile(null);
                setExistingAgentPhoto(null);
                setShowAgentForm(true);
              }}
              className="bp-btn rounded-lg text-sm font-semibold text-white flex items-center gap-2"
              style={{ padding: '10px 16px', background: C.navy }}>
              <UserPlus size={15} /> {tt("Nouvo ajan")}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 22 }}>
            <span className="text-xs font-medium" style={{ color: C.muted }}>{tt("Siikisal:")}</span>
            {branches.map((b) => (
              <span key={b.id} title={tt("Klike pou modifye")} className="bp-btn flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-semibold cursor-pointer"
                onClick={() => openBranchEdit(b)} style={{ background: '#EFE7D8', color: C.navy }}>
                {b.name} <span style={{ ...fontMono, opacity: 0.65, fontSize: 10.5 }}>{b.code}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteBranch(b); }} title={tt("Efase siikisal la")} aria-label={tt("Efase siikisal la")}
                  className="bp-btn w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(11,27,51,0.12)' }}>
                  <X size={9} color={C.navy} />
                </button>
              </span>
            ))}
            <button onClick={() => { setEditingBranchId(null); setBranchForm({ name: '', address: '', phone: '', managerName: '', openingHours: '' }); setShowBranchForm(true); }}
              className="bp-btn text-xs font-semibold flex items-center gap-1 rounded-full"
              style={{ padding: '6px 12px', background: C.bg, border: `1px solid ${C.border}`, color: C.navy }}>
              <Building2 size={12} /> {tt("Nouvo siikisal")}
            </button>
          </div>

          {loadingAgents ? (
            <p className="text-sm text-center" style={{ color: C.muted, marginTop: 48 }}>{tt("Ap chaje...")}</p>
          ) : agents.length === 0 ? (
            <div className="flex flex-col items-center text-center rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}`, padding: '40px 24px', marginTop: 24 }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: C.bg, marginBottom: 14 }}>
                <UserPlus size={20} color={C.muted} />
              </div>
              <p className="text-sm" style={{ color: C.muted }}>{tt("Pa gen okenn ajan kreye toujou.")}</p>
            </div>
          ) : (
            <div style={{ marginTop: 28 }}>
              {branches
                .map((b) => b.name)
                .concat(agents.some((a) => !branches.find((b) => b.name === a.branch)) ? [tt("Lòt")] : [])
                .map((branchName) => {
                  const branchAgents = agents.filter((a) => (a.branch === branchName) || (branchName === tt("Lòt") && !branches.find((b) => b.name === a.branch)));
                  if (branchAgents.length === 0) return null;
                  return (
                    <div key={branchName} style={{ marginBottom: 22 }}>
                      <p className="text-xs font-semibold" style={{ color: C.muted, marginBottom: 8 }}>{branchName}</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 10 }}>
                        {branchAgents.map((a) => (
                          <div key={a.id} onClick={() => openAgentEdit(a)} className="bp-btn flex items-center justify-between gap-3 rounded-xl cursor-pointer"
                            style={{ padding: '14px 16px', background: C.card, border: `1px solid ${C.border}` }}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: C.bg, color: C.navy, fontSize: 12, fontWeight: 700 }}>
                                {a.photoImage ? (
                                  <img src={`data:${a.photoMimeType};base64,${a.photoImage}`} alt="" className="w-full h-full object-cover" />
                                ) : initials(a.fullName)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{a.fullName}</p>
                                <p className="text-xs" style={{ color: C.muted }}>{a.phone}{a.employeeCode ? ` · ${a.employeeCode}` : ''}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge tone={a.blocked ? 'danger' : 'mint'}>{a.blocked ? tt("Bloke") : tt("Aktif")}</Badge>
                              <button onClick={(e) => { e.stopPropagation(); toggleAgentBlock(a); }} title={a.blocked ? tt("Debloke") : tt("Bloke@@btn")}
                                className="bp-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
                                <Lock size={12} color={C.muted} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); deleteAgent(a); }} title={tt("Efase")}
                                className="bp-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FBEBE6' }}>
                                <X size={12} color={C.danger} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {showAgentForm && (
        <>
          <div onClick={() => { setShowAgentForm(false); setEditingAgentId(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(10,33,64,0.5)', zIndex: 52 }} />
          <div className="fadein" style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: C.card, zIndex: 53,
            boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: '30px 28px',
          }}>
            <p className="text-base font-semibold" style={{ color: C.ink }}>{editingAgentId ? tt("Modifye ajan") : tt("Nouvo kont ajan")}</p>
            <p className="text-xs" style={{ color: C.muted, marginTop: 4, marginBottom: 22 }}>
              {editingAgentId ? tt("Kite modpas la vid si w pa vle chanje l.") : tt("Kont sa a ka konfime depo/retrè pou siikisal li.")}
            </p>
            <div className="flex flex-col" style={{ gap: 13 }}>
              <input value={agentForm.fullName} onChange={(e) => setAgentForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder={tt("Non konplè")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input value={agentForm.phone} onChange={(e) => setAgentForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder={tt("Nimewo telefòn")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input type="password" value={agentForm.password} onChange={(e) => setAgentForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={editingAgentId ? tt("Modpas (kite vid pou kenbe ansyen an)") : tt("Modpas (6+ karaktè)")}
                className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <select value={agentForm.branch} onChange={(e) => setAgentForm((f) => ({ ...f, branch: e.target.value }))}
                className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }}>
                <option value="">{tt("Chwazi siikisal...")}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>

              <p className="text-xs font-semibold" style={{ color: C.muted, marginTop: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>{tt("Enfòmasyon anplis (opsyonèl)")}</p>
              <input type="email" value={agentForm.email} onChange={(e) => setAgentForm((f) => ({ ...f, email: e.target.value }))}
                placeholder={tt("Imèl")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input value={agentForm.idNumber} onChange={(e) => setAgentForm((f) => ({ ...f, idNumber: e.target.value }))}
                placeholder={tt("Nimewo pyès idantite (CIN)")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <div>
                <label className="text-xs" style={{ color: C.muted }}>{tt("Dat anbochaj")}</label>
                <input type="date" value={agentForm.hireDate} onChange={(e) => setAgentForm((f) => ({ ...f, hireDate: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              </div>
              <label className="flex items-center gap-3 rounded-lg cursor-pointer" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  {agentPhotoFile ? (
                    <img src={URL.createObjectURL(agentPhotoFile)} alt="" className="w-full h-full object-cover" />
                  ) : existingAgentPhoto ? (
                    <img src={`data:${existingAgentPhoto.photoMimeType};base64,${existingAgentPhoto.photoImage}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={15} color={C.muted} />
                  )}
                </div>
                <span className="text-xs font-medium" style={{ color: C.muted }}>
                  {agentPhotoFile ? agentPhotoFile.name : existingAgentPhoto ? tt("Chanje foto pwofil la") : tt("Foto pwofil (opsyonèl)")}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setAgentPhotoFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div className="flex gap-2.5" style={{ marginTop: 24 }}>
              <button onClick={() => { setShowAgentForm(false); setEditingAgentId(null); }}
                className="bp-btn flex-1 rounded-lg text-sm font-semibold" style={{ padding: '12px', background: C.bg, color: C.muted }}>
                {tt("Anile")}
              </button>
              <button onClick={createAgent} disabled={creatingAgent}
                className="bp-btn flex-1 rounded-lg text-sm font-semibold text-white" style={{ padding: '12px', background: C.navy, opacity: creatingAgent ? 0.7 : 1 }}>
                {creatingAgent ? tt("Ap anrejistre...") : editingAgentId ? tt("Anrejistre chanjman yo") : tt("Kreye kont lan")}
              </button>
            </div>
          </div>
        </>
      )}

      {showBranchForm && (
        <>
          <div onClick={() => { setShowBranchForm(false); setEditingBranchId(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(10,33,64,0.5)', zIndex: 52 }} />
          <div className="fadein" style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: C.card, zIndex: 53,
            boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: '30px 28px',
          }}>
            <p className="text-base font-semibold" style={{ color: C.ink }}>{editingBranchId ? tt("Modifye siikisal") : tt("Nouvo siikisal")}</p>
            <p className="text-xs" style={{ color: C.muted, marginTop: 4, marginBottom: 22 }}>
              {editingBranchId ? tt("Chanje non an mete tout ajan ki nan siikisal sa a ajou otomatikman.") : tt("Yon kòd entèn ap jenere otomatikman pou li.")}
            </p>
            <div className="flex flex-col" style={{ gap: 13 }}>
              <input value={branchForm.name} onChange={(e) => setBranchForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={tt("Non siikisal la")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input value={branchForm.address} onChange={(e) => setBranchForm((f) => ({ ...f, address: e.target.value }))}
                placeholder={tt("Adrès / katye")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input value={branchForm.phone} onChange={(e) => setBranchForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder={tt("Telefòn biwo a")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input value={branchForm.managerName} onChange={(e) => setBranchForm((f) => ({ ...f, managerName: e.target.value }))}
                placeholder={tt("Non responsab la")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
              <input value={branchForm.openingHours} onChange={(e) => setBranchForm((f) => ({ ...f, openingHours: e.target.value }))}
                placeholder={tt("Orè (egzanp: Lendi-Vandredi 8h-16h)")} className="rounded-lg text-sm" style={{ padding: '11px 14px', background: C.bg, border: `1px solid ${C.border}` }} />
            </div>
            <div className="flex gap-2.5" style={{ marginTop: 24 }}>
              <button onClick={() => { setShowBranchForm(false); setEditingBranchId(null); }}
                className="bp-btn flex-1 rounded-lg text-sm font-semibold" style={{ padding: '12px', background: C.bg, color: C.muted }}>
                {tt("Anile")}
              </button>
              <button onClick={createBranch} disabled={creatingBranch}
                className="bp-btn flex-1 rounded-lg text-sm font-semibold text-white" style={{ padding: '12px', background: C.navy, opacity: creatingBranch ? 0.7 : 1 }}>
                {creatingBranch ? tt("Ap anrejistre...") : editingBranchId ? tt("Anrejistre chanjman yo") : tt("Kreye siikisal la")}
              </button>
            </div>
          </div>
        </>
      )}

      {selectedFinanceBranch && (() => {
        const [branch, stats] = selectedFinanceBranch;
        const avgTx = stats.count > 0 ? Math.round(stats.volume / stats.count) : 0;
        return (
          <>
            <div onClick={() => setSelectedFinanceBranch(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(10,33,64,0.5)', zIndex: 52 }} />
            <div className="fadein" style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: C.card, zIndex: 53,
              boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: 24,
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <p className="text-base font-bold" style={{ color: C.ink }}>{branch}</p>
                <button onClick={() => setSelectedFinanceBranch(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
                  <X size={14} color={C.muted} />
                </button>
              </div>
              <Badge tone="muted">{stats.agentCount} {tt("ajan")}</Badge>

              <div className="rounded-xl" style={{ marginTop: 18, padding: 16, background: C.bg }}>
                <p className="text-xs" style={{ color: C.muted }}>{tt("Revni jenere")}</p>
                <p className="text-xl font-bold" style={{ ...fontMono, color: C.mint, marginTop: 4 }}>{money(stats.fees)}</p>
              </div>

              <div className="flex flex-col" style={{ gap: 14, marginTop: 18 }}>
                <div className="flex items-center justify-between" style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <p className="text-sm" style={{ color: C.ink }}>{tt("Depo")}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{stats.depositCount} {tt("tranzaksyon")}</p>
                  </div>
                  <p className="text-sm font-semibold" style={fontMono}>{money(stats.depositVolume)}</p>
                </div>
                <div className="flex items-center justify-between" style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <p className="text-sm" style={{ color: C.ink }}>{tt("Retrè")}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{stats.withdrawalCount} {tt("tranzaksyon")}</p>
                  </div>
                  <p className="text-sm font-semibold" style={fontMono}>{money(stats.withdrawalVolume)}</p>
                </div>
                <div className="flex items-center justify-between" style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <p className="text-sm" style={{ color: C.ink }}>{tt("Volim total")}</p>
                  <p className="text-sm font-semibold" style={fontMono}>{money(stats.volume)}</p>
                </div>
                <div className="flex items-center justify-between" style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <p className="text-sm" style={{ color: C.ink }}>{tt("Mwayèn pa tranzaksyon")}</p>
                  <p className="text-sm font-semibold" style={fontMono}>{money(avgTx)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: C.ink }}>{tt("Kliyan sèvi (pa ajan)")}</p>
                  <p className="text-sm font-semibold" style={fontMono}>{stats.uniqueClients || 0}</p>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {confirmingDeposit && (
        <>
          <div onClick={() => setConfirmingDeposit(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.5)', zIndex: 52 }} />
          <div className="fadein" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 380,
            background: C.card, borderRadius: 16, zIndex: 53, padding: 24,
          }}>
            <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ background: '#F3E8D2' }}>
              <AlertCircle size={16} color="#8A6423" className="shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: '#8A6423' }}>
                {tt("Verifye peman an FINI e reyèlman rive nan kont ou anvan ou konfime — aksyon sa a p ap ka anile.")}
              </p>
            </div>
            <p className="text-sm font-semibold">{tt("Konfime depo")} {confirmingDeposit.user}?</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>
              {money(confirmingDeposit.amount)} · {methodIcons[confirmingDeposit.method]?.label || confirmingDeposit.method}
              {confirmingDeposit.transactionId ? tt(" · TID: {0}", confirmingDeposit.transactionId) : ''}
            </p>
            <div className="flex gap-2.5 mt-5">
              <button onClick={() => setConfirmingDeposit(null)}
                className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: C.bg, color: C.muted }}>
                {tt("Anile")}
              </button>
              <button onClick={() => { confirmDeposit(confirmingDeposit.id); setConfirmingDeposit(null); }}
                className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.mint }}>
                {tt("Wi, konfime li")}
              </button>
            </div>
          </div>
        </>
      )}

      {viewingReceipt && (
        <>
          <div onClick={() => setViewingReceipt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.5)', zIndex: 50 }} />
          <div className="fadein" style={{
            position: 'fixed', top: '6%', left: '5%', right: '5%', bottom: '6%', background: C.card,
            borderRadius: 16, zIndex: 51, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p className="text-sm font-semibold">{tt("Resi —")} {viewingReceipt.user}</p>
                <p className="text-xs" style={{ ...fontMono, color: C.muted }}>{tt("TID:")} {viewingReceipt.transactionId} · {money(viewingReceipt.amount)}</p>
              </div>
              <button onClick={() => setViewingReceipt(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
                <X size={14} color={C.muted} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-3 flex items-center justify-center" style={{ background: C.bg }}>
              <img src={`data:${viewingReceipt.proofMimeType};base64,${viewingReceipt.proofImage}`} alt={tt("Resi")}
                className="max-w-full max-h-full rounded-lg object-contain" />
            </div>
          </div>
        </>
      )}

      {pwModalOpen && (
        <>
          <div onClick={() => !pwBusy && setPwModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.5)', zIndex: 50 }} />
          <div className="fadein" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(420px, 92vw)',
            background: C.card, borderRadius: 16, zIndex: 51, overflow: 'hidden',
          }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <KeyRound size={16} color={C.navy} />
                <p className="text-sm font-semibold">{tt("Chanje modpas")}</p>
              </div>
              <button onClick={() => setPwModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }} aria-label={tt("Fèmen")}>
                <X size={14} color={C.muted} />
              </button>
            </div>
            {pwSuccess ? (
              <div className="p-5 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(61,122,92,0.12)' }}>
                  <Check size={22} color={C.mint} />
                </div>
                <p className="text-sm font-semibold">{tt("Modpas ou chanje.")}</p>
                <p className="text-xs" style={{ color: C.muted }}>{tt("Itilize nouvo modpas la pwochen fwa ou konekte.")}</p>
                <button onClick={() => setPwModalOpen(false)} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.navy }}>
                  {tt("Fèmen")}
                </button>
              </div>
            ) : (
              <form className="p-5 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); changePassword(); }}>
                {[
                  { key: 'current', label: tt("Modpas aktyèl"), auto: 'current-password' },
                  { key: 'next', label: tt("Nouvo modpas (6+ karaktè)"), auto: 'new-password' },
                  { key: 'confirm', label: tt("Konfime nouvo modpas la"), auto: 'new-password' },
                ].map((f) => (
                  <label key={f.key} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold" style={{ color: C.muted }}>{f.label}</span>
                    <input
                      type="password"
                      autoComplete={f.auto}
                      value={pwForm[f.key]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: `1px solid ${C.border}`, background: C.bg }}
                    />
                  </label>
                ))}
                {pwError && (
                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(181,72,46,0.1)', color: C.danger }}>
                    <AlertCircle size={14} /> {pwError}
                  </div>
                )}
                <button type="submit" disabled={pwBusy} className="py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.navy, opacity: pwBusy ? 0.6 : 1 }}>
                  {pwBusy ? tt("Ap chanje…") : tt("Chanje modpas la")}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
