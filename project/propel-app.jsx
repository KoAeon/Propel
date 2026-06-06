// propel-app.jsx — Propel My Life · interactive core-flow prototype (Aurora)
const { THEMES, Card, Tile, Ring, Icon, Logo, Avatar, FONT, DISPLAY } = window;
const T = THEMES.aurora;
const { useState, useEffect, useRef } = React;

// ── seed data ───────────────────────────────────────────────
const SEED_HABITS = [
  { id: 'med', glyph: '🧘', from: '#7C6BFF', to: '#A98BFF', name: 'Morning Meditation', meta: '10 min', streak: 21, done: true },
  { id: 'water', glyph: '💧', from: '#3FA9F5', to: '#5BD0E8', name: 'Drink 2L Water', meta: 'Daily', streak: 14, done: true },
  { id: 'steps', glyph: '👟', from: '#5B8DEF', to: '#9B6BFF', name: '10,000 Steps', meta: '7,420 today', streak: 6, done: false },
  { id: 'read', glyph: '📖', from: '#4FB477', to: '#7FD89B', name: 'Read 5 Pages', meta: 'Atomic Habits', streak: 9, done: false },
  { id: 'lang', glyph: '🗣️', from: '#E0716B', to: '#FF9D8A', name: 'Language · 10 min', meta: 'Spanish 🇪🇸', streak: 4, done: false },
  { id: 'sugar', glyph: '🚫', from: '#E0A93B', to: '#FF9D4D', name: 'No Sugar Day', meta: 'Diet goal', streak: 3, done: false },
  { id: 'journal', glyph: '✍️', from: '#6B8AFF', to: '#8FA9FF', name: 'Evening Journal', meta: 'Gratitude', streak: 12, done: false },
];
const SEED_REMINDERS = [
  { id: 'zara', glyph: '🎂', title: "Zara's Birthday", sub: 'Wed, Jun 11 · turning 12', days: 5, cat: 'Birthday' },
  { id: 'car', glyph: '🚗', title: 'Car Registration', sub: 'Renewal due Jun 14', days: 8, cat: 'Renewal' },
  { id: 'ins', glyph: '🏠', title: 'Home Insurance', sub: 'Renewal · Jun 28', days: 22, cat: 'Renewal' },
  { id: 'dental', glyph: '🦷', title: 'Dental Check-up', sub: '6-month · Jun 30', days: 24, cat: 'Health' },
  { id: 'super', glyph: '📈', title: 'Super Contribution', sub: 'Before EOFY · Jun 30', days: 24, cat: 'Financial' },
  { id: 'loan', glyph: '🏦', title: 'Investment Loan Review', sub: 'Compare rates · Sep', days: 92, cat: 'Financial' },
];
const SEED_TASKS = [
  { id: 't1', title: "Plan Zara's birthday party", desc: 'Turning 12 on Jun 11. Backyard theme, ~10 friends. Book the cake, sort decorations and a small gift. Keep it relaxed.', status: 'Started', due: 'Jun 11', priority: 'High', pillar: 'Family & Connection', subs: [{ t: 'Book the cake', done: true, due: 'Jun 8' }, { t: 'Send invites', done: false, due: 'Jun 7' }, { t: 'Buy decorations', done: false }, { t: 'Pick up gift', done: false, due: 'Jun 10' }] },
  { id: 't2', title: 'Lodge FY24–25 tax return', desc: 'Gather receipts, investment property statements and super contributions. Review with accountant before lodging.', status: 'Waiting', due: 'Jun 30', priority: 'High', pillar: 'Financial Freedom', subs: [{ t: 'Collect receipts', done: true }, { t: 'Property statements', done: false, due: 'Jun 20' }, { t: 'Send to accountant', done: false, due: 'Jun 25' }] },
  { id: 't3', title: 'Reach goal weight 70 kg', desc: 'Down from 74.2kg. Stay on the no-sugar days, 10k steps, and 4 exercise days a week.', status: 'Started', due: 'Dec 31', priority: 'Med', pillar: 'Health & Vitality', subs: [{ t: 'Hit 10k steps daily', done: false }, { t: '4 workouts / week', done: true }, { t: 'No-sugar weekdays', done: false }] },
  { id: 't4', title: 'Review investment loan rates', desc: 'Compare current rate against market. Call broker about refinancing the Marina Court loan.', status: 'On Hold', due: 'Sep 1', priority: 'Med', pillar: 'Financial Freedom', subs: [{ t: 'Compare 3 lenders', done: false }, { t: 'Call broker', done: false }] },
  { id: 't5', title: 'Finish Spanish A2 course', desc: '10 minutes every 2 days. Aim to finish the A2 module before the Gold Coast trip.', status: 'Started', due: 'Aug 30', priority: 'Low', pillar: 'Growth & Learning', subs: [{ t: 'Unit 4', done: true }, { t: 'Unit 5', done: false }, { t: 'A2 review test', done: false }] },
];

const STATUS_ORDER = ['Not Started', 'Started', 'On Hold', 'Waiting', 'Completed'];
const STATUS_COLOR = { 'Not Started': '#6B7280', Started: '#3B82F6', 'On Hold': '#E0A93B', Waiting: '#A855F7', Completed: '#1F9D6B' };
const CATS = ['All', 'Renewal', 'Birthday', 'Financial', 'Health'];
const CAT_GLYPH = { Renewal: '🔄', Birthday: '🎂', Financial: '💰', Health: '🩺' };

// date helper for the add-reminder flow (today = Jun 6, 2026)
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function daysUntil(str) {
  const m = String(str || '').toLowerCase().match(/([a-z]{3})[a-z]*\s+(\d{1,2})/);
  if (!m) return null;
  const mi = MONTHS.indexOf(m[1]); if (mi < 0) return null;
  const today = new Date(2026, 5, 6);
  let d = new Date(2026, mi, parseInt(m[2], 10));
  if (d < today) d = new Date(2027, mi, parseInt(m[2], 10));
  return Math.round((d - today) / 86400000);
}

// ── small UI atoms ──────────────────────────────────────────
function Press({ onClick, children, style, scale = 0.97 }) {
  const [d, setD] = useState(false);
  return (
    <div onClick={onClick} onPointerDown={() => setD(true)} onPointerUp={() => setD(false)} onPointerLeave={() => setD(false)}
      style={{ cursor: 'pointer', transition: 'transform .12s ease', transform: d ? `scale(${scale})` : 'none', ...style }}>
      {children}
    </div>
  );
}
function Checkbox({ on, size = 28, theme = T }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: on ? theme.grad : 'transparent', border: on ? 'none' : `2px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: on ? theme.glow : 'none', transition: 'all .2s ease' }}>
      {on && <Icon name="check" size={size * 0.52} color="#fff" sw={2.6} />}
    </div>
  );
}
function Toggle({ on, onClick }) {
  return (
    <Press onClick={onClick} scale={0.92} style={{ width: 46, height: 27, borderRadius: 14, position: 'relative',
      background: on ? T.grad : T.surface2, border: `1px solid ${T.border}`, boxShadow: on ? T.glow : 'none', transition: 'background .2s' }}>
      <div style={{ position: 'absolute', top: 2.5, left: on ? 22 : 2.5, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .2s ease', boxShadow: '0 2px 5px rgba(0,0,0,.3)' }} />
    </Press>
  );
}
function SecLabel({ children, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 2px 12px' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3 }}>{children}</div>
      {action && <Press onClick={onAction} style={{ fontSize: 13, fontWeight: 700, color: T.a1 }}>{action}</Press>}
    </div>
  );
}
function Eyebrow({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>{children}</div>;
}

window.PropelData = { SEED_HABITS, SEED_REMINDERS, SEED_TASKS, STATUS_ORDER, STATUS_COLOR, CATS, CAT_GLYPH, daysUntil };
window.PropelAtoms = { Press, Checkbox, Toggle, SecLabel, Eyebrow };
