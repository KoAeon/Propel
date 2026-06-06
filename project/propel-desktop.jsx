// propel-desktop.jsx — Desktop shell + Dashboard + Tasks (Monday/Notion hybrid) + Reminders
const { Card, Tile, Ring, Icon, Logo, Avatar, DISPLAY, FONT } = window;

const NAV = [
  ['home', 'Home'], ['grid', 'Tasks'], ['target', 'Goals & Vision'], ['flame', 'Habits'],
  ['heart', 'Health'], ['wallet', 'Wealth'], ['bell', 'Reminders'], ['leaf', 'Peacefulness'],
  ['book', 'Study'], ['user', 'People'], ['doc', 'Diary'],
];

function DesktopShell({ theme, active, children }) {
  const t = theme;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: t.appBg, color: t.text,
      fontFamily: FONT, overflow: 'hidden' }}>
      {/* sidebar */}
      <div style={{ width: 232, flexShrink: 0, borderRight: `1px solid ${t.border}`,
        padding: '22px 16px', display: 'flex', flexDirection: 'column',
        background: t.dark ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.4)' }}>
        <div style={{ padding: '2px 8px 20px' }}><Logo theme={t} variant="stack" scale={0.92} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV.map(([ic, label]) => {
            const on = active === label;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px',
                borderRadius: 11, fontSize: 13.5, fontWeight: on ? 700 : 600,
                color: on ? '#fff' : t.dim, background: on ? t.grad : 'transparent',
                boxShadow: on ? t.glow : 'none' }}>
                <Icon name={ic} size={18} color={on ? '#fff' : t.dim} sw={on ? 2 : 1.7} />{label}
              </div>
            );
          })}
        </div>
        {/* integrations */}
        <div style={{ marginTop: 14, padding: '12px', borderRadius: 14, background: t.surface, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: .8, textTransform: 'uppercase', color: t.faint, marginBottom: 9 }}>Connected</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, fontWeight: 600, color: t.text, marginBottom: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📧</span>Gmail
            <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: 4, background: t.good }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, fontWeight: 600, color: t.text }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📅</span>Calendar
            <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: 4, background: t.good }} /></div>
        </div>
      </div>
      {/* main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

function TopBar({ theme, title, sub }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px',
      borderBottom: `1px solid ${t.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: t.text }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: t.dim, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', borderRadius: 11,
        background: t.surface, border: `1px solid ${t.border}`, color: t.faint, fontSize: 13, width: 210 }}>
        <Icon name="search" size={16} color={t.faint} /> Search everything…
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Icon name="bell" size={19} color={t.text} />
        <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4, background: t.a2 }} /></div>
      <Avatar theme={t} initial="R" size={40} />
    </div>
  );
}

// ── Desktop Dashboard ───────────────────────────────────────
function DesktopDashboard({ theme }) {
  const t = theme;
  const W = ({ children, style, pad = 18, glow }) => <Card theme={t} pad={pad} radius={20} glow={glow} style={style}>{children}</Card>;
  const Lbl = ({ children }) => <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.dim, marginBottom: 12 }}>{children}</div>;
  const cal = [['7:00', 'Morning meditation', t.a1], ['9:30', 'Investment loan call', '#4FB477'], ['1:00', 'Lunch — Tom (mentor)', '#7C6BFF'], ['6:30', 'Kids — soccer pickup', '#5B8DEF']];
  return (
    <DesktopShell theme={t} active="Home">
      <TopBar theme={t} title="Good morning, Rich" sub="Saturday, June 6 · 78% of today complete · 3 reminders need you" />
      <div style={{ flex: 1, padding: 24, display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gridAutoRows: 'min-content', gap: 16, overflow: 'hidden' }}>
        {/* completion hero */}
        <W glow style={{ gridColumn: 'span 1', gridRow: 'span 2', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: t.grad, opacity: .14, filter: 'blur(12px)' }} />
          <Lbl>Today's Completion</Lbl>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring pct={78} size={104} stroke={11} theme={t}><div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, fontStyle: 'italic', color: t.text }}>78%</div></Ring>
            <div>
              <div style={{ fontSize: 13, color: t.good, fontWeight: 700, whiteSpace: 'nowrap' }}>↑ 12% vs yesterday</div>
              <div style={{ fontSize: 12.5, color: t.dim, marginTop: 4, whiteSpace: 'nowrap' }}>7 of 9 habits done</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 18 }}>
            {[['42', 'Done'], ['21', 'Streak'], ['94%', 'Score']].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '11px 6px', borderRadius: 13, background: t.surface2, border: `1px solid ${t.border}` }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: [t.a1, t.a2, t.a3][i], fontStyle: 'italic' }}>{s[0]}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: .5, color: t.dim, marginTop: 2 }}>{s[1].toUpperCase()}</div>
              </div>
            ))}
          </div>
        </W>
        {/* north star */}
        <W style={{ position: 'relative', overflow: 'hidden' }}>
          <Lbl>★ North Star</Lbl>
          <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>Financially free before 60</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <Ring pct={62} size={52} stroke={6} theme={t}><span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>62%</span></Ring>
            <div style={{ fontSize: 12.5, color: t.dim }}>On track for age <span style={{ color: t.good, fontWeight: 700 }}>57</span></div>
          </div>
        </W>
        {/* net worth */}
        <W>
          <Lbl>Net Worth</Lbl>
          <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, fontStyle: 'italic', letterSpacing: -1, color: t.text }}>$2.09M</div>
          <div style={{ fontSize: 12.5, color: t.good, fontWeight: 600, marginTop: 2 }}>↑ $94k this year</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>{[42, 30, 19, 8, 1].map((w, i) => <div key={i} style={{ width: w + '%', height: 6, borderRadius: 3, background: ['#5B8DEF', '#4FB477', '#E0A93B', '#7C6BFF', t.a1][i] }} />)}</div>
        </W>
        {/* today's habits */}
        <W style={{ gridColumn: 'span 1' }}>
          <Lbl>Today's Habits</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[['🧘', 'Morning Meditation', true], ['💧', 'Drink 2L Water', true], ['👟', '10,000 Steps', false], ['📖', 'Read 5 Pages', false]].map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tile glyph={h[0]} from={t.a1} to={t.a2} size={28} radius={8} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: t.text }}>{h[1]}</span>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: h[2] ? t.grad : 'transparent', border: h[2] ? 'none' : `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h[2] && <Icon name="check" size={11} color="#fff" sw={2.8} />}</div>
              </div>
            ))}
          </div>
        </W>
        {/* google calendar */}
        <W style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.dim }}>Today · Calendar</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: t.faint, display: 'flex', alignItems: 'center', gap: 4 }}>📅 Google</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {cal.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: t.dim, width: 34, fontVariantNumeric: 'tabular-nums' }}>{c[0]}</span>
                <span style={{ width: 3, height: 26, borderRadius: 2, background: c[2] }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{c[1]}</span>
              </div>
            ))}
          </div>
        </W>
        {/* reminders */}
        <W style={{ gridColumn: 'span 1' }}>
          <Lbl>Needs You</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[['🎂', "Zara's birthday", '5d', t.a2], ['🚗', 'Car registration', '8d', t.a1], ['📈', 'Super contribution', '24d', t.warn]].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tile glyph={r[0]} from={t.a1} to={t.a2} size={28} radius={8} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: t.text }}>{r[1]}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r[3] }}>{r[2]}</span>
              </div>
            ))}
          </div>
        </W>
      </div>
    </DesktopShell>
  );
}

// ── Tasks (Monday status + Notion detail) ───────────────────
const STATUS = {
  Started: '#3B82F6', 'On Hold': '#E0A93B', Waiting: '#A855F7', Completed: '#1F9D6B', 'Not Started': '#6B7280',
};
function StatusCell({ label }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 92, padding: '6px 10px', borderRadius: 8, background: STATUS[label], color: '#fff', fontSize: 11.5, fontWeight: 700 }}>{label}</span>;
}
function TasksScreen({ theme }) {
  const t = theme;
  const groups = [
    ['This Week', t.a1, [
      ['Plan Zara’s birthday party', 'Started', 30, 'Jun 1', 'Jun 11', 'High'],
      ['Lodge FY24–25 tax return', 'Waiting', 10, 'Jun 3', 'Jun 30', 'High'],
      ['Reach goal weight 70 kg', 'Started', 64, 'Jan 2', 'Dec 31', 'Med'],
    ]],
    ['Projects · Quarter', '#7C6BFF', [
      ['Review investment loan rates', 'On Hold', 0, '—', 'Sep 1', 'Med'],
      ['Finish Spanish A2 course', 'Started', 45, 'Mar 1', 'Aug 30', 'Low'],
      ['Refinance Rosewood loan', 'Completed', 100, 'Apr 2', 'Jun 5', 'High'],
      ['Declutter & sell garage items', 'Started', 20, 'May 1', 'Jul 1', 'Low'],
    ]],
  ];
  const PR = { High: t.a2, Med: t.a1, Low: t.dim };
  const Head = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px 70px 70px 64px', gap: 12, padding: '0 14px 8px', fontSize: 10.5, fontWeight: 700, letterSpacing: .6, textTransform: 'uppercase', color: t.faint }}>
      <span>Task</span><span>Status</span><span>Progress</span><span>Start</span><span>Due</span><span>Priority</span>
    </div>
  );
  return (
    <DesktopShell theme={t} active="Tasks">
      <TopBar theme={t} title="Tasks" sub="7 active · 1 completed this week · synced to Google Calendar" />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* table */}
        <div style={{ flex: 1, minWidth: 0, padding: '18px 22px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['Table', 'Board', 'Timeline'].map((v, i) => (
              <span key={v} style={{ padding: '7px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, color: i === 0 ? '#fff' : t.dim, background: i === 0 ? t.grad : t.surface, border: `1px solid ${i === 0 ? 'transparent' : t.border}`, boxShadow: i === 0 ? t.glow : 'none' }}>{v}</span>
            ))}
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, color: '#fff', background: t.grad, boxShadow: t.glow }}><Icon name="plus" size={15} color="#fff" sw={2.4} />New task</span>
          </div>
          {groups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name="chevD" size={14} color={t.dim} />
                <span style={{ width: 9, height: 9, borderRadius: 3, background: g[1] }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{g[0]}</span>
                <span style={{ fontSize: 11, color: t.faint }}>{g[2].length}</span>
              </div>
              <Head />
              <Card theme={t} pad={0} radius={14} style={{ overflow: 'hidden' }}>
                {g[2].map((r, ri) => (
                  <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 130px 70px 70px 64px', gap: 12, alignItems: 'center', padding: '12px 14px', borderTop: ri ? `1px solid ${t.border}` : 'none', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: g[1] }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${r[1] === 'Completed' ? t.good : t.border}`, background: r[1] === 'Completed' ? t.good : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r[1] === 'Completed' && <Icon name="check" size={11} color="#fff" sw={3} />}</div>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: t.text, textDecoration: r[1] === 'Completed' ? 'line-through' : 'none', opacity: r[1] === 'Completed' ? .55 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r[0]}</span>
                    </div>
                    <StatusCell label={r[1]} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ flex: 1, height: 6, borderRadius: 4, background: t.border, overflow: 'hidden' }}><div style={{ width: r[2] + '%', height: '100%', background: r[2] === 100 ? t.good : t.grad }} /></div><span style={{ fontSize: 11, fontWeight: 700, color: t.dim, width: 30 }}>{r[2]}%</span></div>
                    <span style={{ fontSize: 12, color: t.dim }}>{r[3]}</span>
                    <span style={{ fontSize: 12, color: t.dim }}>{r[4]}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: PR[r[5]] }}>{r[5]}</span>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
        {/* Notion-style detail rail */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: `1px solid ${t.border}`, padding: '20px 20px', background: t.dark ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.4)', overflow: 'hidden' }}>
          <StatusCell label="Started" />
          <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, letterSpacing: -.4, color: t.text, marginTop: 14, lineHeight: 1.2 }}>Plan Zara’s birthday party</div>
          <div style={{ fontSize: 13, color: t.dim, lineHeight: 1.55, marginTop: 10 }}>Turning 12 on Jun 11. Backyard theme, ~10 friends. Book the cake, sort decorations and a small gift. Keep it relaxed.</div>
          {/* properties */}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Due', 'Jun 11', t.text], ['Priority', 'High', t.a2], ['Pillar', 'Family', t.text], ['Progress', '30%', t.a1]].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}><span style={{ color: t.dim, fontWeight: 600 }}>{p[0]}</span><span style={{ color: p[2], fontWeight: 700, whiteSpace: 'nowrap' }}>{p[1]}</span></div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .8, textTransform: 'uppercase', color: t.faint, margin: '20px 0 10px' }}>Subtasks · 1 / 4</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[['Book the cake', true], ['Send invites', false], ['Buy decorations', false], ['Pick up gift', false]].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: `2px solid ${s[1] ? t.good : t.border}`, background: s[1] ? t.good : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s[1] && <Icon name="check" size={11} color="#fff" sw={3} />}</div>
                <span style={{ fontSize: 13, color: s[1] ? t.dim : t.text, textDecoration: s[1] ? 'line-through' : 'none', whiteSpace: 'nowrap' }}>{s[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}

// ── Reminder Centre (desktop) ───────────────────────────────
function ReminderDesktop({ theme }) {
  const t = theme;
  const cols = [
    ['This Week', t.a2, [['🎂', "Zara's Birthday", 'Wed, Jun 11 · turning 12', '5 days', true], ['🚗', 'Car Registration', 'Due Jun 14', '8 days', false]]],
    ['This Month', t.a1, [['🏠', 'Home Insurance', 'Renewal · Jun 28', '22 days', false], ['🦷', 'Dental Check-up', '6-month · Jun 30', '24 days', false], ['📈', 'Super Contribution', 'Before EOFY', '24 days', false]]],
    ['Financial · Quarter', t.good, [['🏦', 'Investment Loan Review', 'Compare rates · Sep', '92 days', false], ['📑', 'Tax Return', 'FY24–25 lodgement', '—', false], ['🛂', 'Passport Renewal', 'Expires Nov', '160 days', false]]],
  ];
  return (
    <DesktopShell theme={t} active="Reminders">
      <TopBar theme={t} title="Reminder Centre" sub="Auto-nudges 30 & 7 days before · synced to Google Calendar" />
      <div style={{ flex: 1, padding: 24, overflow: 'hidden' }}>
        <Card theme={t} pad={16} radius={16} glow style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.glow }}><Icon name="bell" size={21} color="#fff" /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: t.text }}>Auto-reminders are on</div><div style={{ fontSize: 12.5, color: t.dim }}>Every renewal, birthday & financial date nudges you 30 and 7 days ahead — and lands in your Google Calendar.</div></div>
          <div style={{ width: 46, height: 26, borderRadius: 13, background: t.grad, position: 'relative', boxShadow: t.glow }}><div style={{ position: 'absolute', top: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: '#fff' }} /></div>
        </Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {cols.map((c, ci) => (
            <div key={ci}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: c[1] }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{c[0]}</span>
                <span style={{ fontSize: 11, color: t.faint }}>{c[2].length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c[2].map((r, ri) => (
                  <Card key={ri} theme={t} pad={14} radius={16} glow={r[4]} style={{ border: `1px solid ${r[4] ? t.a2 + '55' : t.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <Tile glyph={r[0]} from={t.a1} to={t.a2} size={36} radius={11} />
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{r[1]}</div><div style={{ fontSize: 11.5, color: t.dim, marginTop: 1 }}>{r[2]}</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 }}>
                      <div style={{ display: 'flex', gap: 5 }}><span style={{ fontSize: 9.5, fontWeight: 700, color: t.dim, padding: '3px 7px', borderRadius: 6, background: t.surface2, border: `1px solid ${t.border}` }}>−30d</span><span style={{ fontSize: 9.5, fontWeight: 700, color: t.dim, padding: '3px 7px', borderRadius: 6, background: t.surface2, border: `1px solid ${t.border}` }}>−7d</span></div>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: r[4] ? t.a2 : t.dim }}>{r[3]}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DesktopShell>
  );
}

Object.assign(window, { DesktopShell, DesktopDashboard, TasksScreen, ReminderDesktop });
