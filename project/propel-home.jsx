// propel-home.jsx — Home / Dashboard (theme-driven; rendered ×3)
const { Phone, Card, Tile, Ring, Chip, SectionLabel, BottomNav, Avatar, Logo, Icon, DISPLAY, DENSITY } = window;

function HabitRow({ theme, glyph, from, to, name, meta, streak, done, progress }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px',
      background: done ? (t.dark ? 'rgba(255,255,255,.05)' : '#fff') : 'transparent',
      border: `1px solid ${done ? t.border : 'transparent'}`,
      borderRadius: 17, position: 'relative', overflow: 'hidden' }}>
      {done && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: t.grad }} />}
      <Tile glyph={glyph} from={from} to={to} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -.2 }}>{name}</div>
        <div style={{ fontSize: 12.5, color: t.dim, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
          {meta}{streak && <span style={{ color: t.warn, fontWeight: 600 }}>· 🔥 {streak}</span>}
        </div>
        {progress != null && (
          <div style={{ height: 4, borderRadius: 4, background: t.border, marginTop: 7, overflow: 'hidden' }}>
            <div style={{ width: progress + '%', height: '100%', background: t.grad, borderRadius: 4 }} />
          </div>
        )}
      </div>
      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: done ? t.grad : 'transparent',
        border: done ? 'none' : `2px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: done ? t.glow : 'none' }}>
        {done && <Icon name="check" size={15} color="#fff" sw={2.6} />}
      </div>
    </div>
  );
}

function MiniStat({ theme, value, label, accent }) {
  const t = theme;
  return (
    <Card theme={t} pad={14} radius={18} style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: -.5,
        color: accent || t.text, fontStyle: 'italic' }}>{value}</div>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
        color: t.dim, marginTop: 3 }}>{label}</div>
    </Card>
  );
}

function HomeScreen({ theme, density = 'cozy', name = 'Rich' }) {
  const t = theme;
  const days = [['M', 1], ['T', 1], ['W', 0.5], ['T', 1], ['F', 1], ['S', -1], ['S', 0]];
  return (
    <Phone theme={t} density={density}>
      {/* brand + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 16px' }}>
        <Logo theme={t} variant="row" scale={0.82} />
        <div style={{ position: 'relative' }}>
          <Avatar theme={t} initial={name[0]} size={42} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: 13, height: 13, borderRadius: '50%',
            background: t.a2, border: `2px solid ${t.dark ? '#140e0a' : '#f6f1ea'}` }} />
        </div>
      </div>

      {/* greeting */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.dim }}>Saturday, June 6</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: -.8, color: t.text, marginTop: 4 }}>
          Hey, <span style={{ background: t.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{name}</span> <span style={{ WebkitTextFillColor: 'initial' }}>👋</span>
        </div>
      </div>

      {/* hero completion card */}
      <Card theme={t} pad={20} radius={26} glow style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%',
          background: t.grad, opacity: .14, filter: 'blur(10px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: t.dim }}>Today's Completion</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, letterSpacing: -3, lineHeight: 1,
              fontStyle: 'italic', color: t.text, marginTop: 6 }}>78<span style={{ fontSize: 38 }}>%</span></div>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.good, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <Icon name="arrowUp" size={14} color={t.good} sw={2.2} />12% vs yesterday</div>
          </div>
          <Ring pct={78} size={76} stroke={8} theme={t}>
            <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: t.text }}>7/9</div>
          </Ring>
        </div>
        {/* week dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          {days.map(([d, v], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: t.faint }}>{d}</span>
              <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: v === 1 ? t.grad : v === 0.5 ? t.surface2 : 'transparent',
                border: v <= 0 ? `1px dashed ${t.border}` : v === 0.5 ? `1px solid ${t.border}` : 'none',
                boxShadow: v === 1 ? t.glow : 'none' }}>
                {v === 1 && <Icon name="check" size={14} color="#fff" sw={2.6} />}
                {v === 0.5 && <span style={{ color: t.dim, fontSize: 13 }}>~</span>}
                {v === -1 && <span style={{ width: 4, height: 4, borderRadius: 2, background: t.faint }} />}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* category chips */}
      <div style={{ display: 'flex', gap: 8, overflow: 'hidden', margin: '18px -18px 0', padding: '0 18px' }}>
        <Chip theme={t} active>All</Chip>
        <Chip theme={t} glyph="💪">Health</Chip>
        <Chip theme={t} glyph="🧠">Mind</Chip>
        <Chip theme={t} glyph="💰">Wealth</Chip>
        <Chip theme={t} glyph="📚">Study</Chip>
      </div>

      {/* up next reminder peek */}
      <div style={{ marginTop: 16 }}>
        <Card theme={t} pad={13} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tile glyph="🎂" from={t.a1} to={t.a2} size={38} radius={11} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Zara's Birthday</div>
            <div style={{ fontSize: 12, color: t.dim }}>in 5 days · Wed, Jun 11</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.a1, padding: '5px 10px', borderRadius: 9,
            background: t.surface2, border: `1px solid ${t.border}` }}>Plan</div>
        </Card>
      </div>

      {/* today's habits */}
      <SectionLabel theme={t} action={<>Edit <Icon name="arrowR" size={13} color={t.a1} /></>}>Today's Habits</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <HabitRow theme={t} glyph="🧘" from="#7C6BFF" to="#A98BFF" name="Morning Meditation" meta="10 min" streak="21 day" done />
        <HabitRow theme={t} glyph="👟" from={t.a1} to={t.a2} name="10,000 Steps" meta="7,420 today" progress={74} />
        <HabitRow theme={t} glyph="💧" from="#3FA9F5" to="#5BD0E8" name="Drink 2L Water" meta="Daily" streak="14 day" done />
        <HabitRow theme={t} glyph="📖" from="#4FB477" to="#7FD89B" name="Read 5 Pages" meta="Atomic Habits" streak="9 day" />
        <HabitRow theme={t} glyph="🚫" from="#E0A93B" to={t.a1} name="No Sugar Day" meta="Diet goal" streak="3 day" />
      </div>

      {/* this week */}
      <SectionLabel theme={t}>This Week</SectionLabel>
      <div style={{ display: 'flex', gap: 9 }}>
        <MiniStat theme={t} value="42" label="Habits Done" accent={t.a1} />
        <MiniStat theme={t} value="21" label="Best Streak" accent={t.a2} />
        <MiniStat theme={t} value="94%" label="Avg Score" accent={t.a3} />
      </div>

      <BottomNav theme={t} active="home" />
    </Phone>
  );
}

window.HomeScreen = HomeScreen;
