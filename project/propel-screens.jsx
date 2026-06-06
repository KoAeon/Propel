// propel-screens.jsx — interactive shell, screens & sheets (Aurora)
const { useState: uS, useEffect: uE, useRef: uR } = React;
const PT = window.THEMES.aurora;
const { Card: PC, Tile: PTile, Ring: PRing, Icon: PI, Logo: PLogo, Avatar: PAvatar, FONT: PFONT, DISPLAY: PDISP } = window;
const { SEED_HABITS, SEED_REMINDERS, SEED_TASKS, STATUS_ORDER, STATUS_COLOR, CATS, CAT_GLYPH, daysUntil } = window.PropelData;
const { Press, Checkbox, Toggle, SecLabel, Eyebrow } = window.PropelAtoms;

const STORE = 'propel-proto-v1';
function loadState() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } }

// ── status pill ─────────────────────────────────────────────
function StatusPill({ label, onClick, small }) {
  return (
    <Press onClick={onClick} scale={0.94} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: small ? 84 : 96, padding: small ? '5px 10px' : '7px 12px', borderRadius: 9, background: STATUS_COLOR[label],
      color: '#fff', fontSize: small ? 11.5 : 12.5, fontWeight: 700, boxShadow: '0 2px 8px ' + STATUS_COLOR[label] + '55' }}>
      {label}
    </Press>
  );
}
function ProgressBar({ pct, done }) {
  return <div style={{ flex: 1, height: 6, borderRadius: 4, background: PT.border, overflow: 'hidden' }}>
    <div style={{ width: pct + '%', height: '100%', background: done ? PT.good : PT.grad, borderRadius: 4, transition: 'width .3s ease' }} /></div>;
}

// ── Add Reminder sheet ──────────────────────────────────────
function AddReminderSheet({ onAdd, onClose }) {
  const [title, setTitle] = uS('');
  const [when, setWhen] = uS('');
  const [cat, setCat] = uS('Renewal');
  const [auto, setAuto] = uS(true);
  const d = daysUntil(when);
  const ok = title.trim().length > 0;
  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '13px 15px', borderRadius: 14, background: PT.surface2,
    border: `1px solid ${PT.border}`, color: PT.text, fontFamily: PFONT, fontSize: 15, outline: 'none' };
  return (
    <Sheet onClose={onClose} title="New Reminder">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <Eyebrow>What's the reminder?</Eyebrow>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Passport renewal"
            style={{ ...inputStyle, marginTop: 8 }} />
        </div>
        <div>
          <Eyebrow>When</Eyebrow>
          <input value={when} onChange={e => setWhen(e.target.value)} placeholder="e.g. Nov 20"
            style={{ ...inputStyle, marginTop: 8 }} />
          {when && <div style={{ fontSize: 12, color: d != null ? PT.good : PT.dim, marginTop: 6, fontWeight: 600 }}>
            {d != null ? `${d} days away` : 'Type a date like “Nov 20”'}</div>}
        </div>
        <div>
          <Eyebrow>Category</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {['Renewal', 'Birthday', 'Financial', 'Health'].map(c => (
              <Press key={c} onClick={() => setCat(c)} scale={0.95} style={{ padding: '9px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                background: cat === c ? PT.grad : PT.surface2, color: cat === c ? '#fff' : PT.dim,
                border: `1px solid ${cat === c ? 'transparent' : PT.border}`, boxShadow: cat === c ? PT.glow : 'none' }}>
                <span style={{ marginRight: 5 }}>{CAT_GLYPH[c]}</span>{c}</Press>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 14, background: PT.surface2, border: `1px solid ${PT.border}` }}>
          <PI name="bell" size={18} color={PT.a1} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: PT.text }}>Auto-remind me</div>
            <div style={{ fontSize: 11.5, color: PT.dim }}>Nudge 30 & 7 days before</div></div>
          <Toggle on={auto} onClick={() => setAuto(!auto)} />
        </div>
        <Press onClick={() => ok && onAdd({ title: title.trim(), sub: when ? when + (auto ? ' · auto' : '') : 'No date set', days: d == null ? 30 : d, cat, glyph: CAT_GLYPH[cat] })}
          scale={0.97} style={{ marginTop: 4, padding: '15px', borderRadius: 16, textAlign: 'center', fontWeight: 700, fontSize: 15,
            background: ok ? PT.grad : PT.surface2, color: ok ? '#fff' : PT.faint, boxShadow: ok ? PT.glow : 'none' }}>
          Add reminder
        </Press>
      </div>
    </Sheet>
  );
}

// ── Status dropdown (select, not cycle) ─────────────────────
function StatusDropdown({ value, onChange, small }) {
  const [open, setOpen] = uS(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Press onClick={() => setOpen(o => !o)} scale={0.96} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        minWidth: small ? 92 : 104, padding: small ? '6px 11px' : '7px 12px', borderRadius: 9, background: STATUS_COLOR[value], color: '#fff',
        fontSize: small ? 11.5 : 12.5, fontWeight: 700, boxShadow: '0 2px 8px ' + STATUS_COLOR[value] + '55' }}>
        {value}<svg width="9" height="9" viewBox="0 0 11 11" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" style={{ opacity: .85 }}><path d="M2 4l3.5 3.5L9 4" /></svg>
      </Press>
      {open && (<>
        <div onClick={(e) => { e.stopPropagation(); setOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 91, background: PT.dark ? '#1b1726' : '#fff',
          border: `1px solid ${PT.border}`, borderRadius: 12, padding: 5, minWidth: 156, boxShadow: '0 14px 40px rgba(0,0,0,.5)' }}>
          {STATUS_ORDER.map(s => (
            <Press key={s} onClick={() => { onChange(s); setOpen(false); }} scale={0.98} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px', borderRadius: 8, background: s === value ? PT.surface2 : 'transparent' }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: STATUS_COLOR[s], flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: s === value ? 700 : 600, color: PT.text }}>{s}</span>
              {s === value && <PI name="check" size={13} color={PT.a1} sw={2.6} style={{ marginLeft: 'auto' }} />}
            </Press>
          ))}
        </div>
      </>)}
    </div>
  );
}

// ── Task detail sheet ───────────────────────────────────────
function TaskDetailSheet({ task, onClose, onToggleSub, onSetStatus, onSubText, onSubDue, onAddSub, onDelSub }) {
  const doneN = task.subs.filter(s => s.done).length;
  const pct = task.status === 'Completed' ? 100 : (task.subs.length ? Math.round((doneN / task.subs.length) * 100) : 0);
  const PR = { High: PT.a3, Med: PT.a1, Low: PT.dim };
  const txt = { background: 'transparent', border: 'none', outline: 'none', fontFamily: PFONT, padding: 0, minWidth: 0 };
  return (
    <Sheet onClose={onClose} title="Task">
      <StatusDropdown value={task.status} onChange={onSetStatus} />
      <div style={{ fontFamily: PDISP, fontSize: 21, fontWeight: 700, letterSpacing: -.4, color: PT.text, marginTop: 14, lineHeight: 1.2 }}>{task.title}</div>
      <div style={{ fontSize: 13.5, color: PT.dim, lineHeight: 1.55, marginTop: 10 }}>{task.desc}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <ProgressBar pct={pct} done={pct === 100} /><span style={{ fontSize: 12, fontWeight: 700, color: PT.dim, width: 34 }}>{pct}%</span>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {[['Due', task.due, PT.text], ['Priority', task.priority, PR[task.priority]], ['Pillar', task.pillar, PT.text]].map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: PT.dim, fontWeight: 600 }}>{p[0]}</span><span style={{ color: p[2], fontWeight: 700 }}>{p[1]}</span></div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .8, textTransform: 'uppercase', color: PT.faint, margin: '20px 0 11px' }}>Subtasks · {doneN}/{task.subs.length}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {task.subs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 11, background: PT.surface }}>
            <Press onClick={() => onToggleSub(i)} scale={0.9}><Checkbox on={s.done} size={21} /></Press>
            <input value={s.t} onChange={e => onSubText(i, e.target.value)} placeholder="Subtask…"
              style={{ ...txt, flex: 1, color: s.done ? PT.dim : PT.text, fontSize: 14, fontWeight: 500, textDecoration: s.done ? 'line-through' : 'none' }} />
            <input value={s.due || ''} onChange={e => onSubDue(i, e.target.value)} placeholder="+ due"
              style={{ ...txt, width: 58, textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: s.due ? PT.a1 : PT.faint,
                background: s.due ? PT.surface2 : 'transparent', border: `1px solid ${s.due ? PT.border : 'transparent'}`, borderRadius: 8, padding: '5px 4px' }} />
            <Press onClick={() => onDelSub(i)} scale={0.85} style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PT.faint, fontSize: 14 }}>✕</Press>
          </div>
        ))}
        <Press onClick={onAddSub} scale={0.99} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px' }}>
          <div style={{ width: 21, height: 21, borderRadius: '50%', border: `1.5px dashed ${PT.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PI name="plus" size={12} color={PT.a1} sw={2.4} /></div>
          <span style={{ fontSize: 14, fontWeight: 600, color: PT.a1 }}>Add subtask</span>
        </Press>
      </div>
    </Sheet>
  );
}

// ── Quick add menu ──────────────────────────────────────────
function QuickAdd({ onPick, onClose }) {
  const items = [['🔔', 'Reminder', 'reminder'], ['✅', 'Task', 'task'], ['🔥', 'Habit', 'habit']];
  return (
    <Sheet onClose={onClose} title="Quick add">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <Press key={it[2]} onClick={() => onPick(it[2])} scale={0.98} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px', borderRadius: 16, background: PT.surface2, border: `1px solid ${PT.border}` }}>
            <PTile glyph={it[0]} from={PT.a1} to={PT.a2} size={42} radius={13} />
            <span style={{ fontSize: 15.5, fontWeight: 700, color: PT.text }}>New {it[1]}</span>
            <PI name="chevR" size={18} color={PT.dim} style={{ marginLeft: 'auto' }} />
          </Press>
        ))}
      </div>
    </Sheet>
  );
}

// ── generic bottom sheet ────────────────────────────────────
function Sheet({ title, children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(6,5,14,.6)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', animation: 'pl-fade .2s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: PT.dark ? '#15121f' : '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        borderTop: `1px solid ${PT.border}`, padding: '12px 20px 26px', maxHeight: '88%', overflowY: 'auto', animation: 'pl-up .26s cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,.5)' }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: PT.border, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: PDISP, fontSize: 16, fontWeight: 700, color: PT.text }}>{title}</span>
          <Press onClick={onClose} scale={0.9} style={{ width: 30, height: 30, borderRadius: 15, background: PT.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PT.dim, fontSize: 17 }}>✕</Press>
        </div>
        {children}
      </div>
    </div>
  );
}

window.PropelKit = { StatusPill, StatusDropdown, ProgressBar, AddReminderSheet, TaskDetailSheet, QuickAdd, Sheet, STORE, loadState };
