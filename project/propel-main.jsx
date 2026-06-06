// propel-main.jsx — PropelApp: state, routing, shell, screens
const { useState: mS, useEffect: mE, useRef: mR } = React;
const A = window.THEMES.aurora;
const { Card: AC, Tile: ATile, Ring: ARing, Icon: AI, Logo: ALogo, Avatar: AAvatar, FONT: AFONT, DISPLAY: ADISP } = window;
const D = window.PropelData;
const { Press: AP, Checkbox: ACheck, Toggle: AToggle, SecLabel: ASec, Eyebrow: AEye } = window.PropelAtoms;
const K = window.PropelKit;

const MODULES = [
  ['flame', 'Habits', 'habits', true], ['bell', 'Reminders', 'reminders', true], ['grid', 'Tasks', 'tasks', true],
  ['target', 'Goals & Vision', 'soon', false], ['heart', 'Health', 'soon', false], ['wallet', 'Wealth', 'soon', false],
  ['leaf', 'Peacefulness', 'soon', false], ['book', 'Study', 'soon', false], ['gift', 'Good News', 'soon', false],
  ['user', 'People', 'soon', false], ['doc', 'Diary', 'soon', false], ['bulb', 'Ideas', 'soon', false],
];

function PropelApp() {
  const saved = K.loadState();
  const [screen, setScreen] = mS(saved.screen || 'home');
  const [habits, setHabits] = mS(saved.habits || D.SEED_HABITS);
  const [reminders, setReminders] = mS(saved.reminders || D.SEED_REMINDERS);
  const [tasks, setTasks] = mS(saved.tasks || D.SEED_TASKS);
  const [auto, setAuto] = mS(saved.auto != null ? saved.auto : true);
  const [filter, setFilter] = mS('All');
  const [sheet, setSheet] = mS(null);          // {type, id?}
  const [toast, setToast] = mS(null);
  const bodyRef = mR(null);

  mE(() => { localStorage.setItem(K.STORE, JSON.stringify({ screen, habits, reminders, tasks, auto })); }, [screen, habits, reminders, tasks, auto]);
  mE(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [screen]);
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1900); };

  // ── actions ──
  const toggleHabit = (id) => setHabits(hs => hs.map(h => h.id === id ? { ...h, done: !h.done, streak: h.done ? Math.max(0, h.streak - 1) : h.streak + 1 } : h));
  const addReminder = (r) => { setReminders(rs => [{ ...r, id: 'r' + Date.now() }, ...rs].sort((a, b) => a.days - b.days)); setSheet(null); setScreen('reminders'); flash('Reminder added · auto-nudges set'); };
  const toggleSub = (tid, i) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, subs: t.subs.map((s, j) => j === i ? { ...s, done: !s.done } : s) } : t));
  const cycleStatus = (tid) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, status: D.STATUS_ORDER[(D.STATUS_ORDER.indexOf(t.status) + 1) % D.STATUS_ORDER.length] } : t));
  const setStatus = (tid, status) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, status } : t));
  const setSubText = (tid, i, text) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, subs: t.subs.map((s, j) => j === i ? { ...s, t: text } : s) } : t));
  const setSubDue = (tid, i, due) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, subs: t.subs.map((s, j) => j === i ? { ...s, due } : s) } : t));
  const addSub = (tid) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, subs: [...t.subs, { t: '', done: false, due: '' }] } : t));
  const delSub = (tid, i) => setTasks(ts => ts.map(t => t.id === tid ? { ...t, subs: t.subs.filter((_, j) => j !== i) } : t));

  const doneCount = habits.filter(h => h.done).length;
  const pct = Math.round((doneCount / habits.length) * 100);
  const openTask = tasks.find(t => sheet && sheet.type === 'task' && t.id === sheet.id);

  // ── screens ──
  const Header = ({ title, eyebrow, back, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
      {back && <AP onClick={() => setScreen('modules')} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: A.surface, border: `1px solid ${A.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AI name="chevR" size={18} color={A.text} style={{ transform: 'scaleX(-1)' }} /></AP>}
      <div style={{ flex: 1, minWidth: 0 }}>{eyebrow && <AEye>{eyebrow}</AEye>}<div style={{ fontFamily: ADISP, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: A.text, marginTop: eyebrow ? 3 : 0 }}>{title}</div></div>
      {right}
    </div>
  );
  const AddBtn = ({ onClick }) => <AP onClick={onClick} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: A.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: A.glow }}><AI name="plus" size={20} color="#fff" sw={2.2} /></AP>;

  function Home() {
    const days = [['M', 1], ['T', 1], ['W', 1], ['T', 0.5], ['F', doneCount >= 4 ? 1 : -2], ['S', -1], ['S', 0]];
    const next = reminders[0];
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0 16px' }}>
          <ALogo theme={A} variant="row" scale={0.82} />
          <AP onClick={() => setScreen('you')} scale={0.92} style={{ position: 'relative' }}><AAvatar theme={A} initial="R" size={42} /><div style={{ position: 'absolute', top: -1, right: -1, width: 13, height: 13, borderRadius: '50%', background: A.a3, border: `2px solid #0c0a16` }} /></AP>
        </div>
        <div style={{ marginBottom: 16 }}>
          <AEye>Saturday, June 6</AEye>
          <div style={{ fontFamily: ADISP, fontSize: 30, fontWeight: 700, letterSpacing: -.8, color: A.text, marginTop: 4 }}>Hey, <span style={{ background: A.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rich</span> <span>👋</span></div>
        </div>
        <AC theme={A} pad={20} radius={26} glow style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: A.grad, opacity: .16, filter: 'blur(10px)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <AEye>Today's Completion</AEye>
              <div style={{ fontFamily: ADISP, fontSize: 64, fontWeight: 700, letterSpacing: -3, lineHeight: 1, fontStyle: 'italic', color: A.text, marginTop: 6, transition: 'all .3s' }}>{pct}<span style={{ fontSize: 38 }}>%</span></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: A.good, marginTop: 6 }}>{doneCount} of {habits.length} habits done</div>
            </div>
            <ARing pct={pct} size={76} stroke={8} theme={A}><div style={{ fontFamily: ADISP, fontSize: 16, fontWeight: 700, color: A.text }}>{doneCount}/{habits.length}</div></ARing>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            {days.map(([d, v], i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: A.faint }}>{d}</span>
                <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: v === 1 ? A.grad : v === 0.5 ? A.surface2 : 'transparent', border: v <= 0 ? `1px dashed ${A.border}` : v === 0.5 ? `1px solid ${A.border}` : 'none', boxShadow: v === 1 ? A.glow : 'none' }}>
                  {v === 1 && <AI name="check" size={14} color="#fff" sw={2.6} />}{v === 0.5 && <span style={{ color: A.dim, fontSize: 13 }}>~</span>}{v === -1 && <span style={{ width: 4, height: 4, borderRadius: 2, background: A.faint }} />}</div>
              </div>
            ))}
          </div>
        </AC>
        {next && <AP onClick={() => setScreen('reminders')} style={{ marginTop: 16 }}><AC theme={A} pad={13} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ATile glyph={next.glyph} from={A.a1} to={A.a2} size={38} radius={11} />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 700, color: A.text }}>{next.title}</div><div style={{ fontSize: 12, color: A.dim }}>in {next.days} days · {next.sub}</div></div>
          <div style={{ fontSize: 11, fontWeight: 700, color: A.a1, padding: '5px 10px', borderRadius: 9, background: A.surface2, border: `1px solid ${A.border}` }}>View</div></AC></AP>}
        <ASec action="Edit →" onAction={() => setScreen('habits')}>Today's Habits</ASec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {habits.slice(0, 5).map(h => <HabitRow key={h.id} h={h} />)}
        </div>
        <ASec>This Week</ASec>
        <div style={{ display: 'flex', gap: 9 }}>
          {[['42', 'Habits Done', A.a1], [String(Math.max(...habits.map(h => h.streak))), 'Best Streak', A.a2], ['94%', 'Avg Score', A.a3]].map((s, i) => (
            <AC key={i} theme={A} pad={14} radius={18} style={{ flex: 1, textAlign: 'center' }}><div style={{ fontFamily: ADISP, fontSize: 26, fontWeight: 700, fontStyle: 'italic', color: s[2] }}>{s[0]}</div><div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: A.dim, marginTop: 3 }}>{s[1]}</div></AC>
          ))}
        </div>
      </div>
    );
  }

  function HabitRow({ h }) {
    return (
      <AP onClick={() => toggleHabit(h.id)} scale={0.99}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', background: h.done ? 'rgba(255,255,255,.05)' : A.surface, border: `1px solid ${A.border}`, borderRadius: 17, position: 'relative', overflow: 'hidden' }}>
          {h.done && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: A.grad }} />}
          <ATile glyph={h.glyph} from={h.from} to={h.to} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: A.text, letterSpacing: -.2 }}>{h.name}</div>
            <div style={{ fontSize: 12.5, color: A.dim, marginTop: 2 }}>{h.meta}{h.streak > 0 && <span style={{ color: A.warn, fontWeight: 600 }}> · 🔥 {h.streak} day</span>}</div>
          </div>
          <ACheck on={h.done} size={28} />
        </div>
      </AP>
    );
  }

  function Habits() {
    const done = habits.filter(h => h.done).length;
    return (
      <div>
        <Header back eyebrow="Build · Track · Streak" title="Daily Habits" right={<AddBtn onClick={() => setSheet({ type: 'addHabitNote' })} />} />
        <AC theme={A} pad={16} radius={20} glow style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
          <ARing pct={Math.round(done / habits.length * 100)} size={66} stroke={7} theme={A}><div style={{ fontFamily: ADISP, fontWeight: 700, fontSize: 17, color: A.text }}>{done}/{habits.length}</div></ARing>
          <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: A.text }}>{done >= habits.length ? 'All done — incredible!' : done >= habits.length / 2 ? 'Strong day, keep going' : 'Let’s get moving'}</div><div style={{ fontSize: 12.5, color: A.dim, marginTop: 3 }}>{habits.length - done} habits left · tap to check off</div></div>
        </AC>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>{habits.map(h => <HabitRow key={h.id} h={h} />)}</div>
      </div>
    );
  }

  function Reminders() {
    const list = reminders.filter(r => filter === 'All' || r.cat === filter);
    const groups = [['This Week', list.filter(r => r.days <= 9)], ['This Month', list.filter(r => r.days > 9 && r.days <= 31)], ['Later', list.filter(r => r.days > 31)]];
    return (
      <div>
        <Header back eyebrow="Never miss what matters" title="Reminder Centre" right={<AddBtn onClick={() => setSheet({ type: 'reminder' })} />} />
        <AC theme={A} pad={14} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: A.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: A.glow }}><AI name="bell" size={19} color="#fff" /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: A.text }}>Auto-reminders {auto ? 'on' : 'off'}</div><div style={{ fontSize: 12, color: A.dim }}>Nudge 30 & 7 days before each date</div></div>
          <AToggle on={auto} onClick={() => setAuto(!auto)} />
        </AC>
        <div style={{ display: 'flex', gap: 7, margin: '0 -18px 6px', padding: '2px 18px', overflowX: 'auto' }}>
          {D.CATS.map(c => <AP key={c} onClick={() => setFilter(c)} scale={0.95} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: filter === c ? A.grad : A.surface, color: filter === c ? '#fff' : A.dim, border: `1px solid ${filter === c ? 'transparent' : A.border}`, boxShadow: filter === c ? A.glow : 'none' }}>{c}</AP>)}
        </div>
        {groups.map(([label, items]) => items.length > 0 && (
          <div key={label}><ASec>{label}</ASec>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {items.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px', background: r.days <= 9 ? A.surface2 : A.surface, border: `1px solid ${r.days <= 9 ? A.a3 + '55' : A.border}`, borderRadius: 16 }}>
                  <ATile glyph={r.glyph} from={A.a1} to={A.a2} size={40} radius={12} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: A.text }}>{r.title}</div><div style={{ fontSize: 12, color: A.dim, marginTop: 2 }}>{r.sub}</div>
                    {auto && <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>{['−30d', '−7d'].map(x => <span key={x} style={{ fontSize: 9.5, fontWeight: 700, color: A.dim, padding: '2px 6px', borderRadius: 6, background: A.surface, border: `1px solid ${A.border}` }}>{x}</span>)}</div>}</div>
                  <div style={{ textAlign: 'center', minWidth: 46, padding: '6px 9px', borderRadius: 12, background: A.surface, border: `1px solid ${A.border}` }}><div style={{ fontFamily: ADISP, fontWeight: 700, fontSize: 17, color: r.days <= 9 ? A.a3 : A.text, lineHeight: 1 }}>{r.days}</div><div style={{ fontSize: 9, fontWeight: 700, color: A.dim, marginTop: 2 }}>DAYS</div></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function Tasks() {
    const PR = { High: A.a3, Med: A.a1, Low: A.dim };
    return (
      <div>
        <Header back eyebrow="Monday × Notion" title="Tasks" right={<AddBtn onClick={() => setSheet({ type: 'addTaskNote' })} />} />
        <div style={{ fontSize: 12.5, color: A.dim, margin: '-6px 2px 14px' }}>Tap a task to open · tap the status to cycle it</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map(t => {
            const dn = t.subs.filter(s => s.done).length; const p = t.status === 'Completed' ? 100 : Math.round(dn / t.subs.length * 100);
            return (
              <AC key={t.id} theme={A} pad={14} radius={18}>
                <AP onClick={() => setSheet({ type: 'task', id: t.id })} scale={0.99}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 700, color: A.text, letterSpacing: -.2, textDecoration: t.status === 'Completed' ? 'line-through' : 'none', opacity: t.status === 'Completed' ? .6 : 1 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: A.dim, marginTop: 3 }}>Due {t.due} · <span style={{ color: PR[t.priority], fontWeight: 700 }}>{t.priority}</span> · {dn}/{t.subs.length} subtasks</div></div>
                  </div>
                </AP>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <K.StatusDropdown value={t.status} small onChange={(s) => setStatus(t.id, s)} />
                  <K.ProgressBar pct={p} done={p === 100} /><span style={{ fontSize: 11.5, fontWeight: 700, color: A.dim, width: 32 }}>{p}%</span>
                </div>
              </AC>
            );
          })}
        </div>
      </div>
    );
  }

  function Modules() {
    return (
      <div>
        <Header title="Modules" eyebrow="Your whole life, organised" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {MODULES.map(([ic, label, dest, live]) => (
            <AP key={label} onClick={() => live ? setScreen(dest) : flash(label + ' is in the design map — built next')} scale={0.97}>
              <AC theme={A} pad={15} radius={18} style={{ position: 'relative', height: 104, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: live ? A.grad : A.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: live ? A.glow : 'none', border: live ? 'none' : `1px solid ${A.border}` }}><AI name={ic} size={20} color={live ? '#fff' : A.dim} /></div>
                <div><div style={{ fontSize: 14, fontWeight: 700, color: A.text }}>{label}</div><div style={{ fontSize: 11, color: live ? A.good : A.faint, fontWeight: 600, marginTop: 1 }}>{live ? 'Live' : 'In design'}</div></div>
              </AC>
            </AP>
          ))}
        </div>
      </div>
    );
  }

  function You() {
    return (
      <div>
        <Header title="You" eyebrow="Profile & settings" />
        <AC theme={A} pad={18} radius={22} glow style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <AAvatar theme={A} initial="R" size={56} />
          <div><div style={{ fontFamily: ADISP, fontSize: 20, fontWeight: 700, color: A.text }}>Rich</div><div style={{ fontSize: 12.5, color: A.dim }}>Propelling since 2026 · {Math.max(...habits.map(h => h.streak))}-day best streak 🔥</div></div>
        </AC>
        <ASec>Connected</ASec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[['📧', 'Gmail', 'rich@gmail.com'], ['📅', 'Google Calendar', 'Syncing reminders & tasks']].map(c => (
            <AC key={c[1]} theme={A} pad={14} radius={16} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c[0]}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: A.text }}>{c[1]}</div><div style={{ fontSize: 12, color: A.dim }}>{c[2]}</div></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: A.good }}>Connected</span>
            </AC>
          ))}
        </div>
        <ASec>Vision</ASec>
        <AC theme={A} pad={16} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ARing pct={62} size={54} stroke={6} theme={A}><span style={{ fontSize: 13, fontWeight: 700, color: A.text }}>62%</span></ARing>
          <div><div style={{ fontSize: 14.5, fontWeight: 700, color: A.text }}>Financially free before 60</div><div style={{ fontSize: 12, color: A.dim, marginTop: 2 }}>On track for age 57 🎉</div></div>
        </AC>
      </div>
    );
  }

  const screens = { home: Home, modules: Modules, reminders: Reminders, habits: Habits, tasks: Tasks, you: You };
  const Cur = screens[screen] || Home;

  // ── bottom nav ──
  const navItems = [['home', 'Home', 'home'], ['grid', 'Modules', 'modules'], ['plus', '', 'add'], ['bell', 'Reminders', 'reminders'], ['user', 'You', 'you']];

  return (
    <div style={{ width: '100%', height: '100%', background: A.appBg, color: A.text, fontFamily: AFONT, position: 'relative', overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      {/* status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontFamily: ADISP, fontSize: 14, fontWeight: 600, color: A.text, position: 'relative', zIndex: 2 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: .9 }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill={A.text}><rect x="0" y="6" width="3" height="5" rx="1" /><rect x="4.5" y="4" width="3" height="7" rx="1" /><rect x="9" y="2" width="3" height="9" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke={A.text} strokeOpacity=".5" /><rect x="3" y="3" width="15" height="6" rx="1.5" fill={A.text} /><rect x="23.5" y="4" width="1.6" height="4" rx="1" fill={A.text} fillOpacity=".6" /></svg>
        </div>
      </div>
      {/* scroll body */}
      <div ref={bodyRef} style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0 18px 110px', zIndex: 1 }}>
        <Cur />
      </div>
      {/* bottom nav */}
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, height: 64, background: 'rgba(16,13,29,.78)', border: `1px solid ${A.border}`, borderRadius: 24, backdropFilter: 'blur(22px)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
        {navItems.map(([ic, label, dest]) => ic === 'plus' ? (
          <AP key="add" onClick={() => setSheet({ type: 'quick' })} scale={0.88} style={{ width: 50, height: 50, borderRadius: 17, background: A.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: A.glow, marginTop: -2 }}><AI name="plus" size={24} color="#fff" sw={2.2} /></AP>
        ) : (
          <AP key={dest} onClick={() => setScreen(dest)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: screen === dest ? A.a1 : A.faint, minWidth: 52 }}>
            <AI name={ic} size={21} sw={screen === dest ? 2 : 1.7} /><span style={{ fontSize: 9.5, fontWeight: 600 }}>{label}</span>
          </AP>
        ))}
      </div>
      {/* sheets */}
      {sheet && sheet.type === 'quick' && <K.QuickAdd onClose={() => setSheet(null)} onPick={(k) => { if (k === 'reminder') setSheet({ type: 'reminder' }); else if (k === 'task') { setSheet(null); setScreen('tasks'); flash('Add tasks from the Tasks screen'); } else { setSheet(null); setScreen('habits'); flash('Track habits from the Habits screen'); } }} />}
      {sheet && sheet.type === 'reminder' && <K.AddReminderSheet onClose={() => setSheet(null)} onAdd={addReminder} />}
      {sheet && sheet.type === 'task' && openTask && <K.TaskDetailSheet task={openTask} onClose={() => setSheet(null)} onToggleSub={(i) => toggleSub(openTask.id, i)} onSetStatus={(s) => setStatus(openTask.id, s)} onSubText={(i, v) => setSubText(openTask.id, i, v)} onSubDue={(i, v) => setSubDue(openTask.id, i, v)} onAddSub={() => addSub(openTask.id)} onDelSub={(i) => delSub(openTask.id, i)} />}
      {sheet && (sheet.type === 'addHabitNote' || sheet.type === 'addTaskNote') && <K.Sheet title="Heads up" onClose={() => setSheet(null)}><div style={{ fontSize: 14, color: A.dim, lineHeight: 1.6, paddingBottom: 8 }}>Creating new {sheet.type === 'addHabitNote' ? 'habits' : 'tasks'} is mapped in the design and wired up in the real build. In this prototype, try checking habits, cycling task status, and adding a <b style={{ color: A.text }}>reminder</b> (the full add-flow is live).</div></K.Sheet>}
      {/* toast */}
      {toast && <div style={{ position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)', background: A.text, color: A.appBg.includes('#') ? '#15121f' : '#15121f', padding: '11px 18px', borderRadius: 14, fontSize: 13, fontWeight: 700, zIndex: 60, boxShadow: '0 8px 30px rgba(0,0,0,.4)', whiteSpace: 'nowrap', animation: 'pl-fade .2s ease' }}>{toast}</div>}
    </div>
  );
}

window.PropelApp = PropelApp;
