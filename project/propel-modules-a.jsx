// propel-modules-a.jsx — Habits · Reminder Centre · Goals & Vision · Health · Wealth
const { Phone, Card, Tile, Ring, Chip, SectionLabel, BottomNav, ModuleHeader, Icon, DISPLAY } = window;

// shared list row
function Row({ theme, glyph, from, to, title, sub, right, accent, dashed }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px',
      background: t.surface, border: `1px solid ${dashed ? 'transparent' : t.border}`,
      borderRadius: 16, position: 'relative' }}>
      {accent && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: t.grad, borderRadius: 3 }} />}
      {glyph != null && <Tile glyph={glyph} from={from || t.a1} to={to || t.a2} size={40} radius={12} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: t.text, letterSpacing: -.2 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: t.dim, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function CountBadge({ theme, days, color }) {
  const t = theme; const c = color || t.a1;
  return (
    <div style={{ textAlign: 'center', minWidth: 46, padding: '6px 9px', borderRadius: 12,
      background: t.surface2, border: `1px solid ${t.border}` }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: c, lineHeight: 1 }}>{days}</div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: .5, color: t.dim, marginTop: 2 }}>DAYS</div>
    </div>
  );
}

// ── 1 · Daily Habits ────────────────────────────────────────
function HabitsScreen({ theme }) {
  const t = theme;
  const habits = [
    ['🧘', '#7C6BFF', '#A98BFF', 'Morning Meditation', 'Daily · 10 min', '21', true],
    ['💧', '#3FA9F5', '#5BD0E8', 'Drink 2L Water', 'Daily · 6 of 8 glasses', '14', true],
    ['👟', t.a1, t.a2, '10,000 Steps', 'Daily · 7,420 today', '6', false],
    ['📖', '#4FB477', '#7FD89B', 'Read 5 Pages', 'Daily · Atomic Habits', '9', false],
    ['🗣️', '#E0716B', '#FF9D8A', 'Language · 10 min', 'Every 2 days · Spanish', '4', false],
    ['🚫', '#E0A93B', t.a1, 'No Sugar Day', 'Daily · diet goal', '3', false],
    ['✍️', '#6B8AFF', '#8FA9FF', 'Evening Journal', 'Evening · gratitude', '12', false],
  ];
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Build · Track · Streak" title="Daily Habits"
        right={<div style={{ width: 38, height: 38, borderRadius: 12, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.glow }}><Icon name="plus" size={20} color="#fff" sw={2.2} /></div>} />
      <Card theme={t} pad={16} radius={20} glow style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <Ring pct={71} size={66} stroke={7} theme={t}><div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: t.text }}>5/7</div></Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Strong day, keep going</div>
          <div style={{ fontSize: 12.5, color: t.dim, marginTop: 3 }}>2 habits left · best streak 21 days 🔥</div>
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 8, margin: '16px 0 12px' }}>
        <Chip theme={t} active>All</Chip><Chip theme={t}>Active</Chip><Chip theme={t}>Done</Chip>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {habits.map((h, i) => (
          <Row key={i} theme={t} glyph={h[0]} from={h[1]} to={h[2]} title={h[3]} sub={h[4]} accent={h[6]}
            right={<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: t.warn }}>🔥{h[5]}</span>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: h[6] ? t.grad : 'transparent', border: h[6] ? 'none' : `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h[6] && <Icon name="check" size={14} color="#fff" sw={2.6} />}</div>
            </div>} />
        ))}
      </div>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

// ── 2 · Reminder Centre ─────────────────────────────────────
function ReminderScreen({ theme }) {
  const t = theme;
  const Item = ({ glyph, from, to, title, sub, days, color, urgent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px',
      background: urgent ? t.surface2 : t.surface, border: `1px solid ${urgent ? t.a2 + '55' : t.border}`,
      borderRadius: 16 }}>
      <Tile glyph={glyph} from={from} to={to} size={40} radius={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: t.text }}>{title}</div>
        <div style={{ fontSize: 12, color: t.dim, marginTop: 2 }}>{sub}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: t.dim, padding: '2px 6px', borderRadius: 6, background: t.surface, border: `1px solid ${t.border}` }}>−30d</span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: t.dim, padding: '2px 6px', borderRadius: 6, background: t.surface, border: `1px solid ${t.border}` }}>−7d auto</span>
        </div>
      </div>
      <CountBadge theme={t} days={days} color={color} />
    </div>
  );
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Never miss what matters" title="Reminder Centre"
        right={<div style={{ width: 38, height: 38, borderRadius: 12, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.glow }}><Icon name="plus" size={20} color="#fff" sw={2.2} /></div>} />
      {/* auto banner */}
      <Card theme={t} pad={14} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.glow }}><Icon name="bell" size={19} color="#fff" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>Auto-reminders on</div>
          <div style={{ fontSize: 12, color: t.dim }}>We nudge you 30 & 7 days before each date</div>
        </div>
        <div style={{ width: 42, height: 24, borderRadius: 12, background: t.grad, position: 'relative', boxShadow: t.glow }}><div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff' }} /></div>
      </Card>
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
        <Chip theme={t} active>All</Chip><Chip theme={t} glyph="🔄">Renewals</Chip><Chip theme={t} glyph="🎂">Birthdays</Chip><Chip theme={t} glyph="💰">Financial</Chip>
      </div>
      <SectionLabel theme={t}>This Week</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Item glyph="🎂" from={t.a1} to={t.a2} title="Zara's Birthday" sub="Wed, Jun 11 · turning 12" days="5" color={t.a2} urgent />
        <Item glyph="🚗" from="#E0A93B" to={t.a1} title="Car Registration" sub="Renewal due Jun 14" days="8" color={t.a1} />
      </div>
      <SectionLabel theme={t}>This Month</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Item glyph="🏠" from="#5B8DEF" to="#7CA9FF" title="Home Insurance" sub="Renewal · Jun 28" days="22" color={t.text} />
        <Item glyph="🦷" from="#3FA9F5" to="#5BD0E8" title="Dental Check-up" sub="6-month · Jun 30" days="24" color={t.text} />
        <Item glyph="📑" from="#4FB477" to="#7FD89B" title="Tax Return Lodgement" sub="FY24–25 · review docs" days="—" color={t.good} />
      </div>
      <SectionLabel theme={t}>Financial · Quarterly</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Item glyph="🏦" from="#4FB477" to="#7FD89B" title="Investment Loan Review" sub="Compare rates · Sep" days="92" color={t.dim} />
        <Item glyph="📈" from="#E0A93B" to={t.a3} title="Super Contribution Check" sub="Before EOFY · Jun 30" days="24" color={t.warn} />
      </div>
      <BottomNav theme={t} active="bell" />
    </Phone>
  );
}

// ── 3 · Goals & Vision ──────────────────────────────────────
function GoalsScreen({ theme }) {
  const t = theme;
  const pillars = [
    ['💰', 'Financial Freedom', 62, t.a1, t.a2],
    ['❤️‍🔥', 'Health & Vitality', 74, '#E0716B', '#FF9D8A'],
    ['👨‍👩‍👧', 'Family & Connection', 88, '#7C6BFF', '#A98BFF'],
    ['🌱', 'Growth & Learning', 45, '#4FB477', '#7FD89B'],
  ];
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Vision → Pillars → Actions" title="Goals & Vision" />
      {/* featured goal */}
      <Card theme={t} pad={18} radius={24} glow style={{ position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ position: 'absolute', right: -24, top: -24, width: 120, height: 120, borderRadius: '50%', background: t.grad, opacity: .16, filter: 'blur(8px)' }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: t.a1 }}>★ North Star</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 23, fontWeight: 700, letterSpacing: -.5, color: t.text, marginTop: 6, lineHeight: 1.15 }}>Financially free<br/>before age 60</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
          <Ring pct={62} size={70} stroke={8} theme={t}><div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: t.text }}>62%</div></Ring>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}><span style={{ color: t.dim }}>On track for age</span><span style={{ color: t.good, fontWeight: 700 }}>57 🎉</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}><span style={{ color: t.dim }}>Current age</span><span style={{ color: t.text, fontWeight: 700 }}>48</span></div>
          </div>
        </div>
      </Card>
      <SectionLabel theme={t} action="4 pillars">Vision Pillars</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {pillars.map((p, i) => (
          <Card key={i} theme={t} pad={14} radius={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Tile glyph={p[0]} from={p[3]} to={p[4]} size={36} radius={11} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: t.text }}>{p[2]}%</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 10 }}>{p[1]}</div>
            <div style={{ height: 4, borderRadius: 4, background: t.border, marginTop: 8, overflow: 'hidden' }}><div style={{ width: p[2] + '%', height: '100%', background: `linear-gradient(90deg,${p[3]},${p[4]})`, borderRadius: 4 }} /></div>
          </Card>
        ))}
      </div>
      <SectionLabel theme={t} action={<>Add <Icon name="plus" size={13} color={t.a1} /></>}>Actions This Quarter</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[['Max out super contributions', true, 'Financial Freedom'], ['Reach goal weight 70kg', false, 'Health & Vitality'], ['Review investment loan rate', false, 'Financial Freedom'], ['Finish Spanish A2 course', false, 'Growth & Learning']].map((a, i) => (
          <Row key={i} theme={t} title={a[0]} sub={a[2]}
            right={<div style={{ width: 26, height: 26, borderRadius: '50%', background: a[1] ? t.grad : 'transparent', border: a[1] ? 'none' : `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a[1] && <Icon name="check" size={14} color="#fff" sw={2.6} />}</div>} />
        ))}
      </div>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

// ── 4 · Health ──────────────────────────────────────────────
function HealthScreen({ theme }) {
  const t = theme;
  const Spark = ({ data, color }) => {
    const w = 150, h = 36, max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min || 1)) * (h - 6) - 3}`).join(' ');
    return <svg width={w} height={h} style={{ display: 'block' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  };
  const Metric = ({ glyph, from, to, label, value, unit, target, pct, color }) => (
    <Card theme={t} pad={14} radius={18}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tile glyph={glyph} from={from} to={to} size={34} radius={10} />
        <Ring pct={pct} size={38} stroke={4.5} theme={t} grad={false}><span style={{ fontSize: 10, fontWeight: 700, color: color || t.a1 }}>{pct}%</span></Ring>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .6, textTransform: 'uppercase', color: t.dim, marginTop: 12 }}>{label}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: t.text, marginTop: 2 }}>{value}<span style={{ fontSize: 13, color: t.dim, fontWeight: 600 }}> {unit}</span></div>
      <div style={{ fontSize: 11.5, color: t.dim, marginTop: 2 }}>{target}</div>
    </Card>
  );
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Body · Movement · Diet" title="Health" />
      {/* weight hero */}
      <Card theme={t} pad={18} radius={22} glow style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.dim }}>Weight · target 70kg</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, letterSpacing: -1.5, color: t.text, marginTop: 4, fontStyle: 'italic' }}>74.2<span style={{ fontSize: 20 }}>kg</span></div>
            <div style={{ fontSize: 12.5, color: t.good, fontWeight: 600, marginTop: 2 }}>↓ 2.1kg this month · 4.2kg to go</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Spark data={[78.5, 78, 77.2, 76.8, 76, 75.1, 74.2]} color={t.a2} />
            <div style={{ fontSize: 10.5, color: t.faint, marginTop: 4 }}>last 7 weigh-ins</div>
          </div>
        </div>
        <div style={{ height: 5, borderRadius: 5, background: t.border, marginTop: 14, overflow: 'hidden' }}><div style={{ width: '64%', height: '100%', background: t.grad, borderRadius: 5 }} /></div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        <Metric glyph="👟" from={t.a1} to={t.a2} label="Daily Steps" value="7,420" unit="/ 10k" target="2,580 to go today" pct={74} />
        <Metric glyph="📏" from="#5B8DEF" to="#7CA9FF" label="Waist" value="89" unit="cm" target="target 86 cm" pct={70} color={t.a1} />
        <Metric glyph="🚴" from="#4FB477" to="#7FD89B" label="Bike · week" value="42" unit="km" target="goal 50 km / wk" pct={84} color={t.good} />
        <Metric glyph="🏋️" from="#7C6BFF" to="#A98BFF" label="Exercise" value="4" unit="/ 5 days" target="1 day left this wk" pct={80} color={t.a1} />
      </div>
      <SectionLabel theme={t}>Today · Diet</SectionLabel>
      <Row theme={t} glyph="🚫" from="#E0A93B" to={t.a1} title="No Sugar Day" sub="3-day streak · stay strong"
        right={<div style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${t.border}` }} />} />
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

// ── 5 · Wealth ──────────────────────────────────────────────
function WealthScreen({ theme }) {
  const t = theme;
  const assets = [
    ['🏠', '#5B8DEF', '#7CA9FF', '12 Marina Court', 'Investment property', '$845k', '+$31k yr'],
    ['🏘️', '#4FB477', '#7FD89B', '8 Rosewood Ave', 'Investment property', '$612k', '+$22k yr'],
    ['📈', '#E0A93B', t.a3, 'Superannuation', 'Balanced fund', '$398k', '+9.2%'],
    ['💹', '#7C6BFF', '#A98BFF', 'Share Portfolio', 'ETFs · index', '$156k', '+12.1%'],
    ['💵', t.a1, t.a2, 'Cash & Offset', 'Liquid', '$84k', ''],
  ];
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Assets · Growth · Freedom" title="Wealth" />
      <Card theme={t} pad={20} radius={24} glow style={{ position: 'relative', overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: t.grad, opacity: .14, filter: 'blur(10px)' }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: t.dim }}>Net Worth</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 700, letterSpacing: -2, color: t.text, marginTop: 4, fontStyle: 'italic' }}>$2.09<span style={{ fontSize: 24 }}>M</span></div>
        <div style={{ fontSize: 13, color: t.good, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="arrowUp" size={14} color={t.good} sw={2.2} />$94k this year · +4.7%</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 16 }}>
          {[42, 30, 19, 8, 1].map((w, i) => <div key={i} style={{ width: w + '%', height: 8, borderRadius: 4, background: ['#5B8DEF', '#4FB477', '#E0A93B', '#7C6BFF', t.a1][i] }} />)}
        </div>
        <div style={{ fontSize: 11, color: t.faint, marginTop: 8 }}>Property · Super · Shares · Cash</div>
      </Card>
      <SectionLabel theme={t} action="$1.46M">Investment Properties</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {assets.map((a, i) => (
          <Row key={i} theme={t} glyph={a[0]} from={a[1]} to={a[2]} title={a[3]} sub={a[4]}
            right={<div style={{ textAlign: 'right' }}><div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: t.text }}>{a[5]}</div>{a[6] && <div style={{ fontSize: 11.5, color: t.good, fontWeight: 600 }}>{a[6]}</div>}</div>} />
        ))}
      </div>
      <Card theme={t} pad={14} radius={16} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <Tile glyph="🎯" from={t.a1} to={t.a2} size={36} radius={11} />
        <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>Financial freedom by 60</div><div style={{ fontSize: 12, color: t.dim }}>62% — on track for age 57</div></div>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: t.a1 }}>62%</span>
      </Card>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

Object.assign(window, { Row, CountBadge, HabitsScreen, ReminderScreen, GoalsScreen, HealthScreen, WealthScreen });
