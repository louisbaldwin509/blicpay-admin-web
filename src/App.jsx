import React, { useState } from 'react';
import {
  Bell, ShieldCheck, Users, Clock, Check, X, Building2, Smartphone,
  DollarSign, Banknote, ArrowLeftRight, LogOut, LayoutGrid, Wallet,
  AlertCircle, ChevronRight, Search, RefreshCw
} from 'lucide-react';

// Menm URL ak blicpay-app.jsx — mete vrè adrès backend deplwaye a la.
const API_BASE_URL = 'https://blicpay-backend-production.up.railway.app';

async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
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
  bg: '#F4F6FA',
  card: '#FFFFFF',
  border: '#E6E9F0',
  ink: '#0B1B33',
  muted: '#6B7684',
  navy: '#143A73',
  sky: '#29B6E8',
  mint: '#1E9E7C',
  amber: '#D98B1D',
  danger: '#D14343',
};

const fontDisplay = { fontFamily: "'Manrope', sans-serif" };
const fontMono = { fontFamily: "'IBM Plex Mono', monospace" };

const methodIcons = {
  moncash: { label: 'Mon Cash', icon: DollarSign, color: '#1E9E7C' },
  natcash: { label: 'NatCash', icon: Smartphone, color: '#1C6FBF' },
  usdt: { label: 'USDT', icon: Banknote, color: '#0E9E86' },
  zelle: { label: 'Zelle', icon: ArrowLeftRight, color: '#6D3FD1' },
  biwo: { label: 'Nan biwo', icon: Building2, color: '#946115' },
};

// BLIC Sòl pa gen backend ankò (pa gen tab pou sa nan baz done a) — sa a
// rete an demo jistan nou ajoute modèl ak woutin pou sòl yo.
const DEMO_TOKEN = 'demo-token';

const demoPending = [
  { id: 'd1', user: 'Ronald Michel', phone: '+509 3811 2244', method: 'biwo', amount: 15000, reference: 'SOL-4K9X2P', date: '3 out, 2:14pm' },
  { id: 'd2', user: 'Fabiola Registre', phone: '+509 4790 0021', method: 'natcash', amount: 2500, reference: 'SOL-7QW3MZ', date: '3 out, 11:02am' },
  { id: 'd3', user: 'Wisly Casséus', phone: '+509 3654 8890', method: 'biwo', amount: 15000, reference: 'SOL-2NF8RT', date: '2 out, 4:47pm' },
  { id: 'd4', user: 'Stéphanie Volcy', phone: '+509 3712 5567', method: 'usdt', amount: 100, reference: 'SOL-9XZP4L', date: '2 out, 9:30am' },
];

const demoConfirmed = [
  { id: 'c1', user: 'Marie Joseph', method: 'moncash', amount: 5000, time: '9:12am' },
  { id: 'c2', user: 'Nadège Charles', method: 'zelle', amount: 5000, time: '8:47am' },
];

const solGroups = [
  { id: 'basic', tier: 'Basic', name: 'Sòl Basic', amount: 1000, members: 5, max: 10, currentTurn: 'Jean Baptiste' },
  { id: 'standard', tier: 'Standard', name: 'Sòl Standard', amount: 5000, members: 6, max: 10, currentTurn: 'Samuel Augustin' },
  { id: 'premium', tier: 'Premium', name: 'Sòl Premium', amount: 15000, members: 10, max: 10, currentTurn: 'Jimmy Prophète' },
];

function money(n) {
  return n.toLocaleString('fr-FR') + ' HTG';
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
    muted: { bg: '#EEF1F6', fg: C.muted },
    mint: { bg: '#E4F5EF', fg: C.mint },
    amber: { bg: '#FBF0DE', fg: '#946115' },
    navy: { bg: '#E6F0FB', fg: C.navy },
    premium: { bg: '#F4EBFF', fg: '#6D3FD1' },
    danger: { bg: '#FBEAEA', fg: C.danger },
  };
  const s = map[tone];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.fg }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <p className="text-xs font-medium" style={{ color: C.muted }}>{label}</p>
      <p className="mt-1.5" style={{ ...fontDisplay, fontSize: 24, fontWeight: 800, color: accent || C.ink }}>{value}</p>
      {sub && <p className="mt-0.5 text-xs" style={{ color: C.muted }}>{sub}</p>}
    </div>
  );
}

export default function BlicPayAdmin() {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [nav, setNav] = useState('overview');
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [confirmed, setConfirmed] = useState([]);
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  async function loadPending(authToken) {
    if (authToken === DEMO_TOKEN) return; // done via enterDemoMode instead
    setLoadingPending(true);
    try {
      const { deposits } = await apiFetch('/admin/deposits/pending', { token: authToken });
      setPending(deposits.map((d) => ({
        id: d.id,
        user: d.user.fullName,
        phone: d.user.phone,
        method: d.method,
        amount: d.amount,
        reference: d.reference,
        date: new Date(d.createdAt).toLocaleString('fr-FR'),
      })));
    } catch (err) {
      flash(err.message);
    } finally {
      setLoadingPending(false);
    }
  }

  function enterDemoMode() {
    setToken(DEMO_TOKEN);
    setAdmin({ fullName: 'Admin Demo' });
    setPending(demoPending);
    setConfirmed(demoConfirmed);
  }

  async function handleLogin() {
    setLoginError('');
    if (!loginForm.phone.trim() || !loginForm.password) {
      setLoginError('Nimewo telefòn ak modpas obligatwa.');
      return;
    }
    setLoginLoading(true);
    try {
      const { token: newToken, user } = await apiFetch('/auth/login', { method: 'POST', body: loginForm });
      if (user.role !== 'admin') {
        setLoginError('Kont sa a pa gen aksè admin.');
        return;
      }
      setToken(newToken);
      setAdmin(user);
      await loadPending(newToken);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
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
      if (token !== DEMO_TOKEN) {
        await apiFetch(`/admin/deposits/${id}/confirm`, { method: 'POST', token });
      }
      setPending((p) => p.filter((d) => d.id !== id));
      setConfirmed((c) => [{ id: 'c-' + Date.now(), user: dep.user, method: dep.method, amount: dep.amount, time: 'kounye a' }, ...c]);
      flash(`Depo ${dep.user} la konfime.`);
    } catch (err) {
      flash(err.message);
    }
  }

  async function rejectDeposit(id) {
    const dep = pending.find((d) => d.id === id);
    if (!dep) return;
    try {
      if (token !== DEMO_TOKEN) {
        await apiFetch(`/admin/deposits/${id}/reject`, { method: 'POST', token });
      }
      setPending((p) => p.filter((d) => d.id !== id));
      flash(`Depo ${dep.user} la rejte.`);
    } catch (err) {
      flash(err.message);
    }
  }

  const filteredPending = pending.filter((d) =>
    d.user.toLowerCase().includes(query.toLowerCase()) || d.reference.toLowerCase().includes(query.toLowerCase())
  );

  const totalPendingAmount = pending.reduce((s, d) => s + d.amount, 0);
  const totalConfirmedToday = confirmed.reduce((s, d) => s + d.amount, 0);

  if (!token) {
    return (
      <div style={{ background: C.bg, minHeight: '100%' }} className="w-full flex items-center justify-center px-6 py-16">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
          * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
          .bp-btn { transition: all .15s ease; }
          .bp-btn:hover { filter: brightness(1.04); }
          input:focus { outline: none; border-color: ${C.sky} !important; }
        `}</style>
        <div className="w-full max-w-sm p-7 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-1">
            <Logo size={26} />
            <span style={{ ...fontDisplay, fontWeight: 800, fontSize: 17, color: C.ink }}>
              BLIC<span style={{ color: C.sky }}>Pay</span>
            </span>
          </div>
          <p className="text-xs font-semibold tracking-wide mt-1" style={{ color: C.muted }}>ESPAS ADMIN</p>
          <div className="mt-5 space-y-3">
            <input placeholder="Nimewo telefòn" value={loginForm.phone}
              onChange={(e) => setLoginForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.ink }} />
            <input placeholder="Modpas" type="password" value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.ink }} />
          </div>
          {loginError && (
            <p className="mt-3 text-xs flex items-center gap-1.5" style={{ color: C.danger }}>
              <AlertCircle size={13} /> {loginError}
            </p>
          )}
          <button onClick={handleLogin} disabled={loginLoading}
            className="bp-btn mt-5 w-full py-3 rounded-lg font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.sky})`, opacity: loginLoading ? 0.7 : 1 }}>
            {loginLoading ? 'Tann...' : 'Konekte'}
          </button>
          <button onClick={enterDemoMode}
            className="bp-btn mt-2.5 w-full py-3 rounded-lg font-semibold text-sm"
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.navy }}>
            Wè demo a (san backend)
          </button>
          <p className="mt-4 text-xs text-center" style={{ color: C.muted }}>Konekte ak: {API_BASE_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: '100%', color: C.ink }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .bp-btn { transition: all .15s ease; }
        .bp-btn:hover { filter: brightness(1.04); }
        .bp-btn:active { transform: scale(0.98); }
        .nav-item { transition: background .15s ease; }
        input:focus { outline: none; border-color: ${C.sky} !important; }
        @keyframes fadein { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:translateY(0);} }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fadein { animation: fadein .3s ease; }
      `}</style>

      {toast && (
        <div className="fixed top-4 right-4 z-50 fadein px-4 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg"
          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.ink }}>
          <Check size={16} color={C.mint} /> {toast}
        </div>
      )}

      <div className="flex" style={{ minHeight: '100%' }}>
        {/* sidebar */}
        <div className="w-56 shrink-0 hidden md:flex flex-col px-4 py-6" style={{ background: C.card, borderRight: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 px-2 mb-8">
            <Logo size={26} />
            <span style={{ ...fontDisplay, fontWeight: 800, fontSize: 15 }}>
              BLIC<span style={{ color: C.sky }}>Pay</span>
            </span>
          </div>
          {[
            { id: 'overview', label: 'Apèsi', icon: LayoutGrid },
            { id: 'pending', label: 'Depo annatant', icon: Clock, count: pending.length },
            { id: 'sol', label: 'Gwoup Sòl', icon: Users, demo: true },
          ].map((item) => (
            <button key={item.id} onClick={() => setNav(item.id)}
              className="nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-1"
              style={{
                background: nav === item.id ? '#E6F0FB' : 'transparent',
                color: nav === item.id ? C.navy : C.muted,
              }}>
              <item.icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && <Badge tone="danger">{item.count}</Badge>}
              {item.demo && <Badge>Demo</Badge>}
            </button>
          ))}
          <div className="mt-auto">
            <button onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: C.muted }}>
              <LogOut size={16} /> Dekonekte
            </button>
          </div>
        </div>

        {/* main */}
        <div className="flex-1 px-6 md:px-10 py-8 max-w-5xl">
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-2 md:hidden">
              <Logo size={24} />
              <span style={{ ...fontDisplay, fontWeight: 800, fontSize: 15 }}>BLICPay Admin</span>
            </div>
            <div className="hidden md:block" />
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <Bell size={16} color={C.muted} />
            </button>
          </div>

          {nav === 'overview' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Apèsi</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Rezime aktivite BLICPay jodi a.</p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Depo annatant" value={pending.length} sub={money(totalPendingAmount)} accent={C.amber} />
                <StatCard label="Konfime jodi a" value={confirmed.length} sub={money(totalConfirmedToday)} accent={C.mint} />
                <StatCard label="Gwoup sòl aktif" value={solGroups.length} sub={`${solGroups.filter(g => g.members >= g.max).length} konplè`} />
                <StatCard label="Manm sòl total" value={solGroups.reduce((s, g) => s + g.members, 0)} sub={`sou ${solGroups.reduce((s, g) => s + g.max, 0)} plas`} />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <h3 className="font-semibold text-sm" style={{ color: C.muted }}>DEPO K'AP TANN</h3>
                <button onClick={() => setNav('pending')} className="text-xs font-semibold flex items-center gap-1" style={{ color: C.navy }}>
                  Wè tout <ChevronRight size={13} />
                </button>
              </div>
              <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {pending.slice(0, 3).map((d, i) => {
                  const M = methodIcons[d.method] || { icon: DollarSign, color: C.muted, label: d.method };
                  return (
                    <div key={d.id} className="flex items-center justify-between px-4 py-3.5"
                      style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: M.color }}>
                          <M.icon size={15} color="#fff" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{d.user}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{M.label} · {d.date}</p>
                        </div>
                      </div>
                      <span style={fontMono} className="text-sm">{money(d.amount)}</span>
                    </div>
                  );
                })}
                {pending.length === 0 && (
                  <p className="text-sm p-5" style={{ color: C.muted, background: C.card }}>Pa gen depo k'ap tann.</p>
                )}
              </div>
            </div>
          )}

          {nav === 'pending' && (
            <div className="fadein">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Depo annatant</h1>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>Konfime oswa rejte demand depo yo.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chèche non oswa referans"
                      className="pl-8 pr-3 py-2 rounded-lg text-sm" style={{ background: C.card, border: `1px solid ${C.border}`, width: 220 }} />
                  </div>
                  <button onClick={() => loadPending(token)} aria-label="Rafrechi"
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <RefreshCw size={14} color={C.muted} style={loadingPending ? { animation: 'spin 0.8s linear infinite' } : undefined} />
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {filteredPending.length === 0 ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>Pa gen okenn rezilta.</p>
                ) : filteredPending.map((d, i) => {
                  const M = methodIcons[d.method] || { icon: DollarSign, color: C.muted, label: d.method };
                  return (
                    <div key={d.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
                      style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: M.color }}>
                          <M.icon size={16} color="#fff" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{d.user}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{d.phone} · {d.date}</p>
                          <p className="text-xs mt-0.5" style={{ ...fontMono, color: C.muted }}>{d.reference}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p style={{ ...fontMono, fontSize: 15, fontWeight: 600 }}>{money(d.amount)}</p>
                          <Badge tone="amber">{M.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => rejectDeposit(d.id)}
                            className="bp-btn w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ border: `1px solid ${C.border}` }} aria-label="Rejte">
                            <X size={15} color={C.danger} />
                          </button>
                          <button onClick={() => confirmDeposit(d.id)}
                            className="bp-btn px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            style={{ background: C.mint, color: '#fff' }}>
                            <Check size={13} /> Konfime
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: '#E6F0FB', color: C.navy }}>
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                Verifye referans lan ak resi kach la anvan ou konfime yon depo biwo.
              </div>
            </div>
          )}

          {nav === 'sol' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Gwoup Sòl</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Swiv kapasite ak rotasyon chak palye.</p>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {solGroups.map((g) => {
                  const isFull = g.members >= g.max;
                  return (
                    <div key={g.id} className="p-4 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{g.name}</h3>
                        <Badge tone={g.tier === 'Premium' ? 'premium' : g.tier === 'Standard' ? 'navy' : 'muted'}>{g.tier}</Badge>
                      </div>
                      <p className="mt-2 text-xs" style={{ color: C.muted }}>Kotizasyon: {money(g.amount)}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs" style={{ color: C.muted }}>Manm</span>
                        <Badge tone={isFull ? 'mint' : 'muted'}>{g.members}/{g.max}</Badge>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: C.bg }}>
                        <div style={{ width: `${(g.members / g.max) * 100}%`, height: '100%', background: isFull ? C.mint : C.sky }} />
                      </div>
                      <p className="mt-3 text-xs" style={{ color: C.muted }}>
                        Ap resevwa: <span style={{ color: C.ink, fontWeight: 600 }}>{g.currentTurn}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
