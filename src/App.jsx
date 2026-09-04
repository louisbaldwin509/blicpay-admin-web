import React, { useState } from 'react';
import {
  Bell, ShieldCheck, Users, Clock, Check, X, Building2, Smartphone,
  DollarSign, Banknote, ArrowLeftRight, LogOut, LayoutGrid, Wallet,
  AlertCircle, ChevronRight, ChevronLeft, Search, RefreshCw, ArrowDownLeft,
  PiggyBank, HandCoins, FileText, User, Phone, Lock, BadgeCheck,
} from 'lucide-react';

const API_BASE_URL = 'https://api.blicpayht.com';

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
  purple: '#6D3FD1',
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

const DEMO_TOKEN = 'demo-token';

function money(n) {
  return (n || 0).toLocaleString('fr-FR') + ' HTG';
}
function initials(name) {
  return (name || '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
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

function Th({ children, align }) {
  return <th style={{ textAlign: align || 'left', fontSize: 11, fontWeight: 700, color: C.muted, padding: '10px 14px', letterSpacing: 0.3, textTransform: 'uppercase' }}>{children}</th>;
}
function Td({ children, align }) {
  return <td style={{ textAlign: align || 'left', fontSize: 13, padding: '12px 14px', borderTop: `1px solid ${C.border}` }}>{children}</td>;
}
function Table({ children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.card }}>
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

export default function BlicPayAdmin() {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [nav, setNav] = useState('overview');
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');

  // Depo
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
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
  const [userDetail, setUserDetail] = useState(null);
  const [solDocTitle, setSolDocTitle] = useState('');
  const [solDocFile, setSolDocFile] = useState(null);
  const [solDocUploadingFor, setSolDocUploadingFor] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

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
      })));
    } catch (err) { flash(err.message); } finally { setLoadingPending(false); }
  }

  async function loadWithdrawals(authToken = token) {
    setLoadingWithdrawals(true);
    try {
      const { withdrawals: ws } = await apiFetch('/admin/withdrawals/pending', { token: authToken });
      setWithdrawals(ws.map((w) => ({
        id: w.id, user: w.user.fullName, phone: w.user.phone, method: w.method,
        amount: w.amount, reference: w.reference, date: new Date(w.createdAt).toLocaleString('fr-FR'),
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
      const [{ requests }, { groups }] = await Promise.all([
        apiFetch('/admin/sol/requests/pending', { token: authToken }),
        apiFetch('/admin/sol/groups', { token: authToken }),
      ]);
      setSolRequests(requests);
      setSolGroups(groups);
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
      flash('Rapò a mete ajou dirèkteman soti nan Didit.');
    } catch (err) { flash(err.message); } finally { setKycRefreshing(false); }
  }

  async function decideKyc(decision) {
    if (!selectedKyc) return;
    if (decision === 'reject' && !kycRejectReason.trim()) {
      flash('Yon rezon obligatwa pou refize.');
      return;
    }
    try {
      if (decision === 'approve') {
        await apiFetch(`/admin/kyc/didit/${selectedKyc.id}/approve`, { method: 'POST', token, body: {} });
        flash('Kliyan an verifye.');
      } else {
        await apiFetch(`/admin/kyc/didit/${selectedKyc.id}/reject`, { method: 'POST', token, body: { reason: kycRejectReason.trim() } });
        flash('Demand lan refize.');
      }
      setSelectedKyc(null);
      setKycDetail(null);
      loadKyc();
    } catch (err) { flash(err.message); }
  }

  async function loadUsers(authToken = token, search = '') {
    setLoadingUsers(true);
    try {
      const { users: us } = await apiFetch(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token: authToken });
      setUsers(us);
    } catch (err) { flash(err.message); } finally { setLoadingUsers(false); }
  }

  async function openUser(u) {
    setSelectedUser(u);
    setUserDetail(null);
    setAdjustAmount('');
    setAdjustReason('');
    setSolDocTitle('');
    setSolDocFile(null);
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
      reader.onerror = () => reject(new Error('Nou pa t ka li fichye a.'));
      reader.readAsDataURL(file);
    });
  }

  async function uploadSolDocument(membershipId) {
    if (!solDocTitle.trim()) { flash('Bay dokiman an yon tit.'); return; }
    if (!solDocFile) { flash('Chwazi yon fichye anvan.'); return; }
    setSolDocUploadingFor(membershipId);
    try {
      const fileData = await readFileAsBase64(solDocFile);
      await apiFetch(`/admin/sol/memberships/${membershipId}/documents`, {
        method: 'POST', token,
        body: { title: solDocTitle.trim(), fileData, fileMimeType: solDocFile.type, fileName: solDocFile.name },
      });
      flash('Dokiman an telechaje.');
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
      flash(approved ? 'Dokiman Sòl konfime.' : 'Estati dokiman an remèt an atant.');
      if (selectedUser) openUser(selectedUser);
    } catch (err) { flash(err.message); }
  }

  async function toggleBlock(u) {
    try {
      await apiFetch(`/admin/users/${u.id}/block`, { method: 'PATCH', token, body: { blocked: !u.blocked } });
      setUsers((us) => us.map((x) => x.id === u.id ? { ...x, blocked: !u.blocked } : x));
      if (selectedUser?.id === u.id) setSelectedUser((s) => ({ ...s, blocked: !u.blocked }));
      flash(!u.blocked ? 'Kont bloke.' : 'Kont debloke.');
    } catch (err) { flash(err.message); }
  }

  async function toggleVerify(u) {
    try {
      await apiFetch(`/admin/users/${u.id}/verify`, { method: 'PATCH', token, body: { verified: !u.verified } });
      setUsers((us) => us.map((x) => x.id === u.id ? { ...x, verified: !u.verified } : x));
      if (selectedUser?.id === u.id) setSelectedUser((s) => ({ ...s, verified: !u.verified }));
      flash(!u.verified ? 'Kont verifye.' : 'Verifikasyon retire.');
    } catch (err) { flash(err.message); }
  }

  async function submitBalanceAdjust() {
    if (!selectedUser) return;
    const amt = Number(adjustAmount);
    if (!amt) { flash('Antre yon montan valab.'); return; }
    if (!adjustReason.trim()) { flash('Yon rezon obligatwa.'); return; }
    try {
      const { newBalance } = await apiFetch(`/admin/users/${selectedUser.id}/adjust-balance`, {
        method: 'POST', token, body: { amount: amt, reason: adjustReason.trim() },
      });
      setUsers((us) => us.map((x) => x.id === selectedUser.id ? { ...x, balance: newBalance } : x));
      setSelectedUser((s) => ({ ...s, balance: newBalance }));
      setAdjustAmount('');
      setAdjustReason('');
      flash('Balans ajiste.');
    } catch (err) { flash(err.message); }
  }

  function enterDemoMode() {
    setToken(DEMO_TOKEN);
    setAdmin({ fullName: 'Admin Demo' });
    flash('Mòd demo — pa gen vre done.');
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
      if (token !== DEMO_TOKEN) await apiFetch(`/admin/deposits/${id}/confirm`, { method: 'POST', token });
      setPending((p) => p.filter((d) => d.id !== id));
      setConfirmed((c) => [{ id: 'c-' + Date.now(), user: dep.user, method: dep.method, amount: dep.amount, time: 'kounye a' }, ...c]);
      flash(`Depo ${dep.user} la konfime.`);
    } catch (err) { flash(err.message); }
  }

  async function rejectDeposit(id) {
    const dep = pending.find((d) => d.id === id);
    if (!dep) return;
    try {
      if (token !== DEMO_TOKEN) await apiFetch(`/admin/deposits/${id}/reject`, { method: 'POST', token });
      setPending((p) => p.filter((d) => d.id !== id));
      flash(`Depo ${dep.user} la rejte.`);
    } catch (err) { flash(err.message); }
  }

  async function confirmWithdrawal(id) {
    try {
      await apiFetch(`/admin/withdrawals/${id}/confirm`, { method: 'POST', token });
      setWithdrawals((w) => w.filter((x) => x.id !== id));
      flash('Retrè konfime.');
    } catch (err) { flash(err.message); }
  }
  async function rejectWithdrawal(id) {
    try {
      await apiFetch(`/admin/withdrawals/${id}/reject`, { method: 'POST', token });
      setWithdrawals((w) => w.filter((x) => x.id !== id));
      flash('Retrè refize — lajan an remèt.');
    } catch (err) { flash(err.message); }
  }

  async function approveLoan(id) {
    try {
      await apiFetch(`/admin/loans/${id}/approve`, { method: 'POST', token });
      loadLoans();
      flash('Prè apwouve.');
    } catch (err) { flash(err.message); }
  }
  async function rejectLoan(id) {
    try {
      await apiFetch(`/admin/loans/${id}/reject`, { method: 'POST', token });
      loadLoans();
      flash('Prè refize.');
    } catch (err) { flash(err.message); }
  }

  async function approveSol(id, turnIndex) {
    try {
      await apiFetch(`/admin/sol/requests/${id}/approve`, { method: 'POST', token, body: turnIndex ? { turnIndex } : {} });
      setSolRequests((r) => r.filter((x) => x.id !== id));
      setApprovingSolId(null);
      flash('Demand adezyon apwouve.');
    } catch (err) { flash(err.message); }
  }
  async function rejectSol(id) {
    try {
      await apiFetch(`/admin/sol/requests/${id}/reject`, { method: 'POST', token });
      setSolRequests((r) => r.filter((x) => x.id !== id));
      flash('Demand adezyon refize.');
    } catch (err) { flash(err.message); }
  }
  async function reassignSolPosition(groupId, membershipId, turnIndex) {
    try {
      await apiFetch(`/admin/sol/groups/${groupId}/members/${membershipId}/position`, { method: 'PATCH', token, body: { turnIndex } });
      flash('Pozisyon chanje.');
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

  const NAV_ITEMS = [
    { id: 'overview', label: 'Apèsi', icon: LayoutGrid },
    { id: 'pending', label: 'Depo', icon: Wallet, count: pending.length },
    { id: 'withdrawals', label: 'Retrait', icon: ArrowDownLeft, count: withdrawals.length, onOpen: () => loadWithdrawals() },
    { id: 'goals', label: 'Depo Objektif', icon: PiggyBank, onOpen: () => loadGoals() },
    { id: 'loans', label: 'Prè', icon: HandCoins, count: pendingLoansCount, onOpen: () => loadLoans() },
    { id: 'transfers', label: 'Transfè', icon: ArrowLeftRight, onOpen: () => loadTransfers() },
    { id: 'sol', label: 'BLIC Sòl', icon: Users, count: solRequests.length, onOpen: () => loadSol() },
    { id: 'kyc', label: 'Verifikasyon KYC', icon: ShieldCheck, count: kycSubmissions.length, onOpen: () => loadKyc() },
    { id: 'users', label: 'Itilizatè', icon: User, onOpen: () => loadUsers() },
  ];

  function goTo(item) {
    setNav(item.id);
    if (item.onOpen) item.onOpen();
  }

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
        input:focus, textarea:focus { outline: none; border-color: ${C.sky} !important; }
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
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => goTo(item)}
              className="nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-1"
              style={{ background: nav === item.id ? '#E6F0FB' : 'transparent', color: nav === item.id ? C.navy : C.muted }}>
              <item.icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && <Badge tone="danger">{item.count}</Badge>}
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
        <div className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
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

              <div className="mt-6 p-6 rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.sky})` }}>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>TOTAL TOUT ANTRE YO</p>
                <p style={{ ...fontDisplay, fontSize: 34, fontWeight: 800, color: '#fff', marginTop: 6 }}>
                  {money(totalPendingAmount + totalGoalsSaved + totalTransferVolume)}
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Depo + lajan nan Objektif + volim Transfè</p>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Depo annatant" value={pending.length} sub={money(totalPendingAmount)} accent={C.amber} />
                <StatCard label="Retrait annatant" value={withdrawals.length} sub={money(totalWithdrawAmount)} accent={C.danger} />
                <StatCard label="Demand Sòl" value={solRequests.length} sub="ap tann apwobasyon" accent={C.navy} />
                <StatCard label="Verifikasyon KYC" value={kycSubmissions.length} sub="ap tann egzamen" accent={C.purple} />
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
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Depo</h1>
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

          {nav === 'withdrawals' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Retrait</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Konfime oswa rejte demand retrè yo. Yon retrè refize remèt lajan an bay kliyan an.</p>

              <div className="mt-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {loadingWithdrawals ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted }}>Ap chaje...</p>
                ) : withdrawals.length === 0 ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted, background: C.card }}>Pa gen retrè k'ap tann.</p>
                ) : withdrawals.map((w, i) => {
                  const M = methodIcons[w.method] || { icon: DollarSign, color: C.muted, label: w.method };
                  return (
                    <div key={w.id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
                      style={{ background: C.card, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: M.color }}>
                          <M.icon size={16} color="#fff" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{w.user}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{w.phone} · {w.date}</p>
                          <p className="text-xs mt-0.5" style={{ ...fontMono, color: C.muted }}>{w.reference}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p style={{ ...fontMono, fontSize: 15, fontWeight: 600, color: C.danger }}>−{money(w.amount)}</p>
                          <Badge tone="amber">{M.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => rejectWithdrawal(w.id)}
                            className="bp-btn w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ border: `1px solid ${C.border}` }} aria-label="Rejte">
                            <X size={15} color={C.danger} />
                          </button>
                          <button onClick={() => confirmWithdrawal(w.id)}
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
            </div>
          )}

          {nav === 'goals' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Depo Objektif</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Apèsi objektif epay kliyan yo — pa bezwen apwobasyon.</p>

              <div className="mt-6">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>Kliyan</Th><Th>Objektif</Th><Th>Pwogrè</Th><Th align="right">Ekonomize</Th><Th align="right">Sib</Th></tr>
                  </thead>
                  <tbody>
                    {loadingGoals ? <EmptyRow colSpan={5}>Ap chaje...</EmptyRow>
                      : goals.length === 0 ? <EmptyRow colSpan={5}>Pa gen objektif.</EmptyRow>
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
                            <Td><span className="font-medium">{g.title}</span> {g.status === 'completed' && <Badge tone="mint">Atenn</Badge>}{g.status === 'withdrawn' && <Badge tone="muted">Retire</Badge>}</Td>
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
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Prè</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Apwouve oswa refize demand prè, swiv vèsman yo.</p>

              <div className="mt-6">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>Kliyan</Th><Th align="right">Montan</Th><Th>Plan</Th><Th>Vèsman</Th><Th align="center">Estati</Th><Th align="right">Aksyon</Th></tr>
                  </thead>
                  <tbody>
                    {loadingLoans ? <EmptyRow colSpan={6}>Ap chaje...</EmptyRow>
                      : loans.length === 0 ? <EmptyRow colSpan={6}>Pa gen prè.</EmptyRow>
                      : loans.map((l) => {
                        const paidCount = (l.installments || []).filter((i) => i.status === 'paid').length;
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
                            <Td>{l.months} mwa · {(l.rate * 100).toFixed(0)}%</Td>
                            <Td>{l.status === 'pending' ? '—' : `${paidCount}/${l.installments.length} peye`}</Td>
                            <Td align="center">
                              <Badge tone={l.status === 'pending' ? 'amber' : l.status === 'active' ? 'navy' : l.status === 'rejected' ? 'danger' : 'mint'}>
                                {l.status === 'pending' ? 'Ap tann' : l.status === 'active' ? 'Aktif' : l.status === 'rejected' ? 'Refize' : 'Peye'}
                              </Badge>
                            </Td>
                            <Td align="right">
                              {l.status === 'pending' && (
                                <div className="flex items-center gap-2 justify-end">
                                  <button onClick={() => rejectLoan(l.id)} className="bp-btn px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ border: `1px solid ${C.border}`, color: C.danger }}>Refize</button>
                                  <button onClick={() => approveLoan(l.id)} className="bp-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: C.mint }}>Apwouve</button>
                                </div>
                              )}
                            </Td>
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
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Transfè</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Istorik transfè ant kliyan yo — fèt otomatikman, pa bezwen apwobasyon.</p>

              <div className="mt-6">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>Soti</Th><Th>Rive</Th><Th align="right">Montan</Th><Th align="right">Dat</Th></tr>
                  </thead>
                  <tbody>
                    {loadingTransfers ? <EmptyRow colSpan={4}>Ap chaje...</EmptyRow>
                      : transfers.length === 0 ? <EmptyRow colSpan={4}>Pa gen transfè.</EmptyRow>
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
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>BLIC Sòl</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Apwouve demand adezyon, swiv kapasite chak gwoup.</p>

              <div className="mt-6 flex items-center justify-between">
                <h3 className="font-semibold text-sm" style={{ color: C.muted }}>DEMAND K'AP TANN APWOBASYON</h3>
              </div>
              <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                {loadingSol ? (
                  <p className="text-sm p-6 text-center" style={{ color: C.muted }}>Ap chaje...</p>
                ) : solRequests.length === 0 ? (
                  <p className="text-sm p-5" style={{ color: C.muted, background: C.card }}>Pa gen demand k'ap tann.</p>
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
                            <Check size={13} /> Apwouve
                          </button>
                        </div>
                      </div>
                    </div>
                    {approvingSolId === r.id && (
                      <div className="mt-3 p-3 rounded-xl flex items-center gap-2 flex-wrap" style={{ background: C.bg }}>
                        <span className="text-xs font-semibold" style={{ color: C.muted }}>Chwazi pozisyon (6 a 10):</span>
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

              <div className="mt-8 flex items-center justify-between">
                <h3 className="font-semibold text-sm" style={{ color: C.muted }}>TOUT GWOUP YO (90)</h3>
              </div>
              <div className="mt-3 grid md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {solGroups.map((g) => {
                  const isFull = g.approvedCount >= g.maxMembers;
                  return (
                    <button key={g.id} onClick={() => openSolGroup(g)} className="bp-btn text-left p-4 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-xs">{g.name}</h3>
                        <Badge tone={g.tier === 'Premium' ? 'premium' : g.tier === 'Standard' ? 'navy' : 'muted'}>{g.tier}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs" style={{ color: C.muted }}>{g.frequency} · {money(g.amount)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs" style={{ color: C.muted }}>Manm</span>
                        <Badge tone={isFull ? 'mint' : 'muted'}>{g.approvedCount}/{g.maxMembers}</Badge>
                      </div>
                      {g.pendingCount > 0 && <p className="mt-1 text-xs" style={{ color: C.amber }}>{g.pendingCount} demand ap tann</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {nav === 'kyc' && (
            <div className="fadein">
              {!selectedKyc ? (
                <>
                  <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Verifikasyon KYC</h1>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>{kycSubmissions.length} demand ap tann egzamen — analize pa Didit.</p>

                  <div className="mt-6 flex flex-col gap-3">
                    {loadingKyc ? (
                      <p className="text-sm p-6 text-center" style={{ color: C.muted }}>Ap chaje...</p>
                    ) : kycSubmissions.length === 0 ? (
                      <p className="text-sm p-5 rounded-xl" style={{ color: C.muted, background: C.card, border: `1px solid ${C.border}` }}>Pa gen demand k'ap tann.</p>
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
                          <Badge tone="amber">Ap tann</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => { setSelectedKyc(null); setKycDetail(null); }} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: C.muted }}>
                    <ChevronLeft size={15} /> Retounen nan lis la
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
                            Didit: {kycDetail.diditStatus}
                          </Badge>
                        )}
                        <button onClick={refreshKycFromDidit} disabled={kycRefreshing}
                          className="bp-btn px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1"
                          style={{ background: C.bg, color: C.navy, border: `1px solid ${C.border}`, opacity: kycRefreshing ? 0.6 : 1 }}>
                          <RefreshCw size={12} className={kycRefreshing ? 'animate-spin' : ''} />
                          {kycRefreshing ? 'Ap chèche...' : 'Rafrechi'}
                        </button>
                      </div>
                    </div>

                    {!kycDetail ? (
                      <p className="text-sm mt-4" style={{ color: C.muted }}>Ap chaje rapò a...</p>
                    ) : (
                      <>
                        <div className="mt-4 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: '#E6F0FB', color: C.navy }}>
                          <ShieldCheck size={15} className="shrink-0 mt-0.5" />
                          Didit deja analize dokiman an, selfi a (liveness + face match), ak yon egzamen AML. Egzamine rapò a anba a anvan ou deside.
                        </div>

                        <p className="mt-4 text-xs font-bold uppercase" style={{ color: C.muted }}>Rezime chif ak eskò</p>
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
                            return <p className="mt-1.5 text-xs" style={{ color: C.muted }}>Pa gen eskò disponib toujou.</p>;
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

                        <p className="mt-4 text-xs font-bold uppercase" style={{ color: C.muted }}>Foto Didit jwenn</p>
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
                            return <p className="mt-1.5 text-xs" style={{ color: C.muted }}>Pa gen foto disponib toujou nan rapò a.</p>;
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

                        <p className="mt-4 text-xs font-bold uppercase" style={{ color: C.muted }}>Rapò konplè Didit</p>
                        <pre className="mt-1.5 p-3 rounded-lg text-xs overflow-auto"
                          style={{ background: C.bg, border: `1px solid ${C.border}`, maxHeight: 360, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(kycDetail.diditReport || '{}'), null, 2);
                            } catch {
                              return kycDetail.diditReport || 'Pa gen rapò disponib toujou — tann webhook Didit la rive.';
                            }
                          })()}
                        </pre>
                      </>
                    )}

                    <textarea value={kycRejectReason} onChange={(e) => setKycRejectReason(e.target.value)}
                      placeholder="Rezon refi (obligatwa si ou refize)..."
                      className="mt-4 w-full rounded-lg text-sm p-3" style={{ border: `1px solid ${C.border}`, minHeight: 60 }} />

                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => decideKyc('reject')} className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ border: `1px solid ${C.border}`, color: C.danger }}>
                        <X size={14} className="inline mr-1.5" style={{ verticalAlign: -2 }} /> Refize
                      </button>
                      <button onClick={() => decideKyc('approve')} className="bp-btn flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: C.mint }}>
                        <Check size={14} className="inline mr-1.5" style={{ verticalAlign: -2 }} /> Apwouve
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {nav === 'users' && (
            <div className="fadein">
              <h1 style={{ ...fontDisplay, fontWeight: 800, fontSize: 24 }}>Itilizatè</h1>
              <p className="text-sm mt-1" style={{ color: C.muted }}>Klike sou yon kliyan pou wè detay ak istorik li.</p>

              <div className="mt-4 relative" style={{ maxWidth: 320 }}>
                <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={query} onChange={(e) => { setQuery(e.target.value); loadUsers(token, e.target.value); }} placeholder="Chèche non oswa telefòn"
                  className="pl-8 pr-3 py-2 rounded-lg text-sm w-full" style={{ background: C.card, border: `1px solid ${C.border}` }} />
              </div>

              <div className="mt-4">
                <Table>
                  <thead style={{ background: C.bg }}>
                    <tr><Th>Non</Th><Th>Telefòn</Th><Th>ID</Th><Th align="right">Balans</Th><Th align="center">Verifye</Th><Th align="center">Estati</Th></tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? <EmptyRow colSpan={6}>Ap chaje...</EmptyRow>
                      : users.length === 0 ? <EmptyRow colSpan={6}>Pa gen rezilta.</EmptyRow>
                      : users.map((u) => (
                        <tr key={u.id} onClick={() => openUser(u)} style={{ cursor: 'pointer' }}>
                          <Td>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: u.role === 'admin' ? '#F4EBFF' : C.bg, color: u.role === 'admin' ? C.purple : C.navy }}>{initials(u.fullName)}</div>
                              <span className="font-medium">{u.fullName}</span>
                              {u.role === 'admin' && <Badge tone="premium">Admin</Badge>}
                            </div>
                          </Td>
                          <Td>{u.phone}</Td>
                          <Td><span style={fontMono} className="text-xs">{u.clientId || '—'}</span></Td>
                          <Td align="right"><span className="font-semibold">{money(u.balance)}</span></Td>
                          <Td align="center"><Badge tone={u.verified ? 'mint' : 'amber'}>{u.verified ? 'Wi' : 'Non'}</Badge></Td>
                          <Td align="center"><Badge tone={u.blocked ? 'danger' : 'mint'}>{u.blocked ? 'Bloke' : 'Aktif'}</Badge></Td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sol group members + payout dates drawer */}
      {selectedSolGroup && (
        <>
          <div onClick={() => setSelectedSolGroup(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.35)', zIndex: 20 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: C.card, zIndex: 21, boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: 24 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{selectedSolGroup.name}</p>
                <p className="text-xs" style={{ color: C.muted }}>{selectedSolGroup.frequency} · {money(selectedSolGroup.amount)} pa moun</p>
              </div>
              <button onClick={() => setSelectedSolGroup(null)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
                <X size={14} color={C.muted} />
              </button>
            </div>

            <p className="mt-6 text-xs font-bold uppercase" style={{ color: C.muted }}>Wotasyon ak dat peman</p>
            <div className="mt-2 flex flex-col gap-2">
              {!solGroupMembers ? (
                <p className="text-xs" style={{ color: C.muted }}>Ap chaje...</p>
              ) : solGroupMembers.length === 0 ? (
                <p className="text-xs" style={{ color: C.muted }}>Pa gen manm apwouve poko.</p>
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
                    <select value={m.turnIndex + 1}
                      onChange={(e) => reassignSolPosition(selectedSolGroup.id, m.id, Number(e.target.value))}
                      className="mt-1 text-xs rounded-md px-1.5 py-0.5" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
                      {Array.from({ length: selectedSolGroup.maxMembers }, (_, idx) => idx + 1).map((pos) => (
                        <option key={pos} value={pos}>pozisyon #{pos}</option>
                      ))}
                    </select>
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
          <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,27,51,0.35)', zIndex: 20 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: C.card, zIndex: 21, boxShadow: '-8px 0 24px rgba(11,27,51,0.15)', overflowY: 'auto', padding: 24 }}>
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

            <div className="mt-4 p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.sky})` }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>BALANS AKTYÈL</p>
              <p style={{ ...fontDisplay, fontSize: 22, fontWeight: 800, color: '#fff' }}>{money(selectedUser.balance)}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => toggleBlock(selectedUser)} className="bp-btn flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ border: `1px solid ${C.border}`, color: selectedUser.blocked ? C.mint : C.danger }}>
                <Lock size={12} /> {selectedUser.blocked ? 'Debloke kont' : 'Bloke kont'}
              </button>
              <button onClick={() => toggleVerify(selectedUser)} className="bp-btn flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ border: `1px solid ${C.border}`, color: selectedUser.verified ? C.amber : C.mint }}>
                <BadgeCheck size={12} /> {selectedUser.verified ? 'Retire verifikasyon' : 'Verifye'}
              </button>
            </div>

            <p className="mt-5 text-xs font-bold uppercase" style={{ color: C.muted }}>Ajisteman manyèl balans</p>
            <div className="mt-2 flex items-center gap-2">
              <input value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder="+/- montan" type="number"
                className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }} />
              <button onClick={submitBalanceAdjust} className="bp-btn px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: C.navy }}>Ajiste</button>
            </div>
            <input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="Rezon (obligatwa)"
              className="mt-2 w-full px-3 py-2 rounded-lg text-sm" style={{ background: C.bg, border: `1px solid ${C.border}` }} />

            <p className="mt-6 text-xs font-bold uppercase" style={{ color: C.muted }}>Istorik Depo</p>
            <div className="mt-2 flex flex-col gap-2">
              {!userDetail ? (
                <p className="text-xs" style={{ color: C.muted }}>Ap chaje...</p>
              ) : userDetail.deposits.length === 0 ? (
                <p className="text-xs" style={{ color: C.muted }}>Pa gen depo.</p>
              ) : userDetail.deposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                  <div>
                    <p className="text-xs font-semibold">{methodIcons[d.method]?.label || d.method}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
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
                <p className="mt-6 text-xs font-bold uppercase" style={{ color: C.muted }}>BLIC Sòl</p>
                <div className="mt-2 flex flex-col gap-3">
                  {userDetail.solMemberships.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold">{m.group.name}</p>
                        <Badge tone={m.status === 'approved' ? 'mint' : m.status === 'rejected' ? 'danger' : 'amber'}>{m.status}</Badge>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs" style={{ color: C.muted }}>Dokiman Sòl la</span>
                        <button onClick={() => toggleSolFormApproved(m.id, !m.formApproved)}
                          className="bp-btn px-2.5 py-1 rounded-md text-xs font-semibold"
                          style={{ background: m.formApproved ? '#E4F5EF' : '#FBF0DE', color: m.formApproved ? C.mint : '#946115' }}>
                          {m.formApproved ? 'Konfime ✓' : 'Make konfime'}
                        </button>
                      </div>

                      {(m.documents || []).length > 0 && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          {m.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-xs px-2 py-1.5 rounded" style={{ background: C.bg }}>
                              <span>{doc.title}</span>
                              <span style={{ color: C.muted }}>{new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2.5 flex flex-col gap-1.5">
                        <input value={solDocTitle} onChange={(e) => setSolDocTitle(e.target.value)}
                          placeholder="Tit dokiman an (egzanp: Fiche d'informations)"
                          className="px-2.5 py-1.5 rounded-md text-xs" style={{ background: C.bg, border: `1px solid ${C.border}` }} />
                        <input type="file" accept="image/*,application/pdf"
                          onChange={(e) => setSolDocFile(e.target.files?.[0] || null)}
                          className="text-xs" />
                        <button onClick={() => uploadSolDocument(m.id)} disabled={solDocUploadingFor === m.id}
                          className="bp-btn py-1.5 rounded-md text-xs font-semibold text-white"
                          style={{ background: C.navy, opacity: solDocUploadingFor === m.id ? 0.7 : 1 }}>
                          {solDocUploadingFor === m.id ? 'Ap telechaje...' : 'Telechaje dokiman'}
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
    </div>
  );
}
