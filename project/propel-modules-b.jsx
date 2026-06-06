// propel-modules-b.jsx — Peacefulness · Study · Good News & Gratitude · People
const { Phone, Card, Tile, Ring, Chip, SectionLabel, BottomNav, ModuleHeader, Icon, DISPLAY } = window;
const { Row } = window;

// ── 6 · Peacefulness ────────────────────────────────────────
function PeaceScreen({ theme }) {
  const t = theme;
  const quick = [
    ['🧘', '#7C6BFF', '#A98BFF', 'Meditate', '10 min'],
    ['🙏', '#5B8DEF', '#7CA9FF', 'Prayer', 'Daily'],
    ['📓', '#4FB477', '#7FD89B', 'Diary', 'Write'],
  ];
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Stillness · Prayer · Reflection" title="Peacefulness" />
      <Card theme={t} pad={20} radius={24} glow style={{ position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: 0, background: t.grad, opacity: .1 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: t.dim }}>Today's calm</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: -.6, color: t.text, marginTop: 6 }}>Breathe & arrive</div>
          <div style={{ fontSize: 13, color: t.dim, marginTop: 4 }}>21-day meditation streak 🔥 · 4h 20m total</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '11px 20px', borderRadius: 14, background: t.grad, color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: t.glow }}>
            <Icon name="leaf" size={17} color="#fff" /> Start 10-min session
          </div>
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
        {quick.map((q, i) => (
          <Card key={i} theme={t} pad={14} radius={18} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><Tile glyph={q[0]} from={q[1]} to={q[2]} size={42} radius={13} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 10 }}>{q[3]}</div>
            <div style={{ fontSize: 11, color: t.dim, marginTop: 2 }}>{q[4]}</div>
          </Card>
        ))}
      </div>
      <SectionLabel theme={t} action="All entries">Diary · Recent</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Card theme={t} pad={15} radius={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.a1 }}>Today · 6:40am</span>
            <span style={{ fontSize: 16 }}>☀️</span>
          </div>
          <div style={{ fontSize: 13.5, color: t.text, lineHeight: 1.5, fontWeight: 500 }}>Woke early, clear head. Grateful for the quiet before the house stirs. Today I choose calm over rushing…</div>
        </Card>
        <Card theme={t} pad={15} radius={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.dim }}>Yesterday · 9:10pm</span>
            <span style={{ fontSize: 16 }}>🌙</span>
          </div>
          <div style={{ fontSize: 13.5, color: t.dim, lineHeight: 1.5 }}>A full day but a good one. Walked with the kids after dinner…</div>
        </Card>
      </div>
      <SectionLabel theme={t}>Prayer List</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Row theme={t} glyph="🙏" from="#5B8DEF" to="#7CA9FF" title="Family's health & safety" sub="Daily" right={<span style={{ fontSize: 12, color: t.dim }}>34 days</span>} />
        <Row theme={t} glyph="🕊️" from="#7C6BFF" to="#A98BFF" title="Patience & gratitude" sub="Daily" right={<span style={{ fontSize: 12, color: t.dim }}>12 days</span>} />
      </div>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

// ── 7 · Study ───────────────────────────────────────────────
function StudyScreen({ theme }) {
  const t = theme;
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Books · Language · Podcasts" title="Study" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 14 }}>
        <Card theme={t} pad={15} radius={20} glow>
          <Ring pct={60} size={48} stroke={6} theme={t}><span style={{ fontSize: 12, fontWeight: 700, color: t.text }}>3/5</span></Ring>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 12 }}>Read 5 Pages</div>
          <div style={{ fontSize: 11.5, color: t.dim, marginTop: 2 }}>Daily · 9-day streak 🔥</div>
        </Card>
        <Card theme={t} pad={15} radius={20}>
          <Ring pct={100} size={48} stroke={6} theme={t} grad={false}><Icon name="check" size={18} color={t.good} sw={2.6} /></Ring>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 12 }}>Language · 10m</div>
          <div style={{ fontSize: 11.5, color: t.dim, marginTop: 2 }}>Every 2 days · Spanish 🇪🇸</div>
        </Card>
      </div>
      <SectionLabel theme={t}>Currently Reading</SectionLabel>
      <Card theme={t} pad={15} radius={20} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 52, height: 70, borderRadius: 8, background: 'linear-gradient(150deg,#E0A93B,#FF9D4D)', boxShadow: '0 6px 16px rgba(224,169,59,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📙</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Atomic Habits</div>
          <div style={{ fontSize: 12, color: t.dim, marginTop: 2 }}>James Clear · p.148 / 320</div>
          <div style={{ height: 4, borderRadius: 4, background: t.border, marginTop: 8, overflow: 'hidden' }}><div style={{ width: '46%', height: '100%', background: t.grad }} /></div>
        </div>
      </Card>
      <SectionLabel theme={t} action="Queue">Podcasts</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Row theme={t} glyph="🎧" from="#7C6BFF" to="#A98BFF" title="The Knowledge Project" sub="Compounding · 48 min" right={<Icon name="chevR" size={18} color={t.dim} />} />
        <Row theme={t} glyph="🎙️" from="#4FB477" to="#7FD89B" title="Huberman Lab" sub="Sleep & focus · 1h 12m" right={<Icon name="chevR" size={18} color={t.dim} />} />
      </div>
      <SectionLabel theme={t} action={<>Add <Icon name="plus" size={13} color={t.a1} /></>}>Key Takeaways</SectionLabel>
      <Card theme={t} pad={15} radius={18}>
        <div style={{ fontSize: 13.5, color: t.text, lineHeight: 1.5, fontWeight: 500 }}>“You do not rise to the level of your goals, you fall to the level of your systems.”</div>
        <div style={{ fontSize: 11.5, color: t.dim, marginTop: 8 }}>Atomic Habits · ch. 1</div>
      </Card>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

// ── 8 · Good News & Gratitude ───────────────────────────────
function GratitudeScreen({ theme }) {
  const t = theme;
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="Notice the good · daily" title="Good News & Gratitude" />
      <Card theme={t} pad={18} radius={22} glow style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.dim }}>Today · 3 things I'm grateful for</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {['Morning walk with Maddie 🌅', 'Closed the Rosewood refinance 🎉', 'Quiet coffee, no rush ☕'].map((g, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: '#fff' }}>{i + 1}</div>
              <span style={{ fontSize: 14, color: t.text, fontWeight: 500 }}>{g}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, border: `1px dashed ${t.border}`, fontSize: 13, color: t.dim }}>+ Add a fourth…</div>
      </Card>
      <SectionLabel theme={t} action="14-day streak 🔥">Good News Feed</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Row theme={t} glyph="🎉" from={t.a1} to={t.a2} title="Refinance approved" sub="Today · saves $240/mo" />
        <Row theme={t} glyph="🏃" from="#4FB477" to="#7FD89B" title="Fastest 5k this year" sub="Yesterday · 26:40" />
        <Row theme={t} glyph="📚" from="#7C6BFF" to="#A98BFF" title="Finished a whole book" sub="Sun · The Almanack" />
        <Row theme={t} glyph="💬" from="#5B8DEF" to="#7CA9FF" title="Kiki's school award" sub="Fri · so proud" />
      </div>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

// ── 9 · People & Events ─────────────────────────────────────
function PeopleScreen({ theme }) {
  const t = theme;
  const bdays = [
    ['🎂', t.a1, t.a2, 'Zara', 'Jun 11 · turning 12', 'in 5 days', true],
    ['🎈', '#7C6BFF', '#A98BFF', 'Maddie', 'Mar 10', 'in 277 days', false],
    ['🎁', '#5B8DEF', '#7CA9FF', 'Kiki', 'Dec 28', 'in 205 days', false],
  ];
  return (
    <Phone theme={t}>
      <ModuleHeader theme={t} back eyebrow="People · Birthdays · Events" title="People"
        right={<div style={{ width: 38, height: 38, borderRadius: 12, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.glow }}><Icon name="plus" size={20} color="#fff" sw={2.2} /></div>} />
      <SectionLabel theme={t}>Upcoming Birthdays</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {bdays.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px', background: b[6] ? t.surface2 : t.surface, border: `1px solid ${b[6] ? t.a2 + '55' : t.border}`, borderRadius: 16 }}>
            <Tile glyph={b[0]} from={b[1]} to={b[2]} size={42} radius={13} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{b[3]}</div>
              <div style={{ fontSize: 12.5, color: t.dim, marginTop: 2 }}>{b[4]}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: b[6] ? t.a1 : t.dim, textAlign: 'right' }}>{b[5]}</div>
          </div>
        ))}
      </div>
      <SectionLabel theme={t} action={<>Add <Icon name="plus" size={13} color={t.a1} /></>}>Events</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Row theme={t} glyph="💍" from="#E0716B" to="#FF9D8A" title="Anniversary" sub="Aug 22 · 18 years" right={<span style={{ fontSize: 12, color: t.dim }}>77d</span>} />
        <Row theme={t} glyph="🏫" from="#4FB477" to="#7FD89B" title="Parent–teacher night" sub="Jun 19 · 6:30pm" right={<span style={{ fontSize: 12, color: t.a1, fontWeight: 700 }}>13d</span>} />
        <Row theme={t} glyph="✈️" from="#5B8DEF" to="#7CA9FF" title="Family trip — Gold Coast" sub="Sep 28 – Oct 4" right={<span style={{ fontSize: 12, color: t.dim }}>114d</span>} />
      </div>
      <SectionLabel theme={t}>People · Keep in touch</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Row theme={t} glyph="👨" from="#7C6BFF" to="#A98BFF" title="Dad" sub="Last called 9 days ago" right={<div style={{ fontSize: 11, fontWeight: 700, color: t.a1, padding: '6px 11px', borderRadius: 9, background: t.surface2, border: `1px solid ${t.border}` }}>Call</div>} />
        <Row theme={t} glyph="🧑" from="#4FB477" to="#7FD89B" title="Tom (mentor)" sub="Coffee due this month" right={<div style={{ fontSize: 11, fontWeight: 700, color: t.a1, padding: '6px 11px', borderRadius: 9, background: t.surface2, border: `1px solid ${t.border}` }}>Plan</div>} />
      </div>
      <BottomNav theme={t} active="grid" />
    </Phone>
  );
}

Object.assign(window, { PeaceScreen, StudyScreen, GratitudeScreen, PeopleScreen });
