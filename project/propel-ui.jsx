// propel-ui.jsx — Propel My Life: themes + shared primitives
// Exports to window. Loaded after React + Babel, before screen files.

// ── Themes ──────────────────────────────────────────────────
// Ember = dark warm (the picked accent). Daylight = light/calm.
// Aurora = dark, blue→violet→pink high-glow (reference homage).
const THEMES = {
  ember: {
    key: 'ember', name: 'Ember', dark: true,
    appBg: 'radial-gradient(120% 80% at 85% -8%, rgba(255,107,107,.20), transparent 55%),'
      + 'radial-gradient(110% 70% at -10% 8%, rgba(255,157,77,.16), transparent 50%),'
      + 'radial-gradient(120% 90% at 50% 120%, rgba(255,209,102,.10), transparent 55%),'
      + 'linear-gradient(180deg,#160e0a,#120b09 60%,#0e0807)',
    surface: 'rgba(255,255,255,.045)',
    surface2: 'rgba(255,255,255,.07)',
    border: 'rgba(255,255,255,.09)',
    text: '#f8efe8', dim: 'rgba(248,239,232,.56)', faint: 'rgba(248,239,232,.34)',
    a1: '#FF9D4D', a2: '#FF6B6B', a3: '#FFD166',
    grad: 'linear-gradient(135deg,#FF9D4D,#FF6B6B)',
    glow: '0 8px 30px rgba(255,107,107,.28)',
    good: '#5BD6A3', warn: '#FFC24B',
  },
  daylight: {
    key: 'daylight', name: 'Daylight', dark: false,
    appBg: 'radial-gradient(120% 80% at 88% -6%, rgba(245,146,59,.14), transparent 52%),'
      + 'radial-gradient(100% 70% at -8% 6%, rgba(224,86,86,.10), transparent 50%),'
      + 'linear-gradient(180deg,#f6f1ea,#efe7dd)',
    surface: '#ffffff',
    surface2: '#fbf6f0',
    border: 'rgba(40,25,15,.08)',
    text: '#2a201a', dim: 'rgba(42,32,26,.58)', faint: 'rgba(42,32,26,.40)',
    a1: '#F5923B', a2: '#E05656', a3: '#E0A93B',
    grad: 'linear-gradient(135deg,#F5923B,#E8662E)',
    glow: '0 10px 26px rgba(232,102,46,.18)',
    good: '#1F9D6B', warn: '#D98A1E',
  },
  aurora: {
    key: 'aurora', name: 'Aurora', dark: true,
    appBg: 'radial-gradient(120% 80% at 84% -8%, rgba(155,107,255,.28), transparent 55%),'
      + 'radial-gradient(110% 70% at -8% 10%, rgba(91,141,239,.22), transparent 52%),'
      + 'radial-gradient(120% 90% at 60% 120%, rgba(255,107,193,.16), transparent 55%),'
      + 'linear-gradient(180deg,#100d1d,#0c0a16 60%,#090814)',
    surface: 'rgba(255,255,255,.05)',
    surface2: 'rgba(255,255,255,.08)',
    border: 'rgba(255,255,255,.10)',
    text: '#eef0fb', dim: 'rgba(238,240,251,.58)', faint: 'rgba(238,240,251,.34)',
    a1: '#5B8DEF', a2: '#9B6BFF', a3: '#FF6BC1',
    grad: 'linear-gradient(135deg,#5B8DEF,#9B6BFF 52%,#FF6BC1)',
    glow: '0 8px 30px rgba(123,124,255,.34)',
    good: '#54D6C0', warn: '#FFC24B',
  },
};

// Density: cozy (default) vs compact — scales paddings/gaps.
const DENSITY = { cozy: 1, compact: 0.78 };

const FONT = "'Manrope', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
const DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif";

// ── Line icon set (simple, stroke-based) ────────────────────
const PATHS = {
  home: 'M3 10.5L12 3l9 7.5M5 9.5V20h14V9.5',
  flame: 'M12 3c1 3-2 4-2 7a2 2 0 004 0c0-1 0-1.5-.4-2.2C15 10 17 12 17 15a5 5 0 01-10 0c0-4 3-5 5-12z',
  check: 'M4 12.5l5 5L20 6',
  bell: 'M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6M9.5 21a2.5 2.5 0 005 0',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10zm0 4a1 1 0 100 2 1 1 0 000-2z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  plus: 'M12 5v14M5 12h14',
  chevR: 'M9 5l7 7-7 7',
  chevD: 'M5 9l7 7 7-7',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowR: 'M5 12h14M13 6l6 6-6 6',
  heart: 'M12 20s-7-4.5-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.5 12 20 12 20z',
  wallet: 'M3 7h15a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0V6a2 2 0 012-2h11M17 12.5h.01',
  book: 'M4 5a2 2 0 012-2h13v15H6a2 2 0 00-2 2V5zM19 18H6',
  leaf: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19c3-3 6-5 9-6',
  gift: 'M4 11h16v9H4zM4 7h16v4H4zM12 7v13M12 7S10 3 8 4s0 3 4 3zM12 7s2-4 4-3 0 3-4 3z',
  user: 'M5 20a7 7 0 0114 0M12 11a4 4 0 100-8 4 4 0 000 8z',
  cal: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4',
  steps: 'M8 20c-2 0-3-2-2.5-4S8 12 8 9s2-4 3-4 1 3 0 5-1 4 0 6M16 4c1 1 1 3 0 5s-2 4-1 6',
  ruler: 'M4 8h16v8H4zM8 8v3M12 8v4M16 8v3',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 014 10.5c-.7.7-1 1.3-1 2.5H9c0-1.2-.3-1.8-1-2.5A6 6 0 0112 3z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M18 6l1.5-1.5M4.5 19.5L6 18M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon: 'M20 14.5A8 8 0 119.5 4 6.5 6.5 0 0020 14.5z',
  dumbbell: 'M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
};
function Icon({ name, size = 20, color = 'currentColor', sw = 1.7, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d={PATHS[name] || PATHS.grid} />
    </svg>
  );
}

// ── Phone shell ─────────────────────────────────────────────
function Phone({ theme, children, pad = 18, density = 'cozy' }) {
  const t = theme; const d = DENSITY[density] || 1;
  return (
    <div style={{ width: '100%', height: '100%', background: t.appBg, color: t.text,
      fontFamily: FONT, position: 'relative', overflow: 'hidden',
      WebkitFontSmoothing: 'antialiased' }}>
      <StatusBar theme={t} />
      <div style={{ padding: `0 ${pad}px ${96 * d}px`, position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function StatusBar({ theme }) {
  const t = theme;
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', fontFamily: DISPLAY, fontSize: 14, fontWeight: 600, color: t.text }}>
      <span style={{ letterSpacing: .3 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: .9 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={t.text}><rect x="0" y="6" width="3" height="5" rx="1"/><rect x="4.5" y="4" width="3" height="7" rx="1"/><rect x="9" y="2" width="3" height="9" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={t.text} strokeWidth="1.3"><path d="M1 4.5C4.5 1 11.5 1 15 4.5M3.3 6.8c2.6-2.5 6.8-2.5 9.4 0M5.6 9c1.3-1.2 3.5-1.2 4.8 0" strokeLinecap="round"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke={t.text} strokeOpacity=".5"/><rect x="3" y="3" width="15" height="6" rx="1.5" fill={t.text}/><rect x="23.5" y="4" width="1.6" height="4" rx="1" fill={t.text} fillOpacity=".6"/></svg>
      </div>
    </div>
  );
}

// ── Glass card ──────────────────────────────────────────────
function Card({ theme, children, style, pad = 16, radius = 22, glow = false }) {
  const t = theme;
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: radius, padding: pad,
      boxShadow: glow ? t.glow : (t.dark ? '0 1px 0 rgba(255,255,255,.04) inset' : '0 4px 18px rgba(40,25,15,.05)'),
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      ...style }}>{children}</div>
  );
}

// ── Gradient emoji tile (matches reference) ─────────────────
function Tile({ glyph, from, to, size = 44, radius = 13, ring }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(150deg, ${from}, ${to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.46, lineHeight: 1,
      boxShadow: `0 6px 16px ${from}44, inset 0 1px 0 rgba(255,255,255,.25)`,
      border: ring ? '1px solid rgba(255,255,255,.18)' : 'none' }}>
      <span>{glyph}</span>
    </div>
  );
}

// ── Progress ring ───────────────────────────────────────────
function Ring({ pct, size = 62, stroke = 7, theme, grad = true, children, track }) {
  const t = theme; const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
  const gid = 'rg' + Math.round(Math.random() * 1e6);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.a1}/><stop offset="1" stopColor={t.a2}/>
        </linearGradient></defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track || t.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={grad ? `url(#${gid})` : t.a1} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

// ── Header (greeting / module) ──────────────────────────────
function ModuleHeader({ theme, eyebrow, title, right, back }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0 14px' }}>
      {back && (
        <div style={{ width: 38, height: 38, borderRadius: 12, background: t.surface,
          border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={t.text} style={{ transform: 'scaleX(-1)' }}/>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4,
          textTransform: 'uppercase', color: t.dim, marginBottom: 3 }}>{eyebrow}</div>}
        <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5,
          color: t.text }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// ── Pill chip row ───────────────────────────────────────────
function Chip({ theme, active, children, glyph }) {
  const t = theme;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap',
      fontSize: 13, fontWeight: 600,
      background: active ? t.grad : t.surface,
      color: active ? '#fff' : t.dim,
      border: `1px solid ${active ? 'transparent' : t.border}`,
      boxShadow: active ? t.glow : 'none' }}>
      {glyph && <span style={{ fontSize: 14 }}>{glyph}</span>}{children}
    </div>
  );
}

// ── Section label row ───────────────────────────────────────
function SectionLabel({ theme, children, action }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      margin: '20px 2px 12px' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: t.text, letterSpacing: -.3 }}>{children}</div>
      {action && <div style={{ fontSize: 13, fontWeight: 600, color: t.a1, display: 'flex', alignItems: 'center', gap: 3 }}>{action}</div>}
    </div>
  );
}

// ── Bottom nav ──────────────────────────────────────────────
function BottomNav({ theme, active = 'home' }) {
  const t = theme;
  const items = [['home', 'Home'], ['grid', 'Modules'], ['plus', ''], ['bell', 'Reminders'], ['user', 'You']];
  return (
    <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, height: 64,
      background: t.dark ? 'rgba(20,14,11,.72)' : 'rgba(255,255,255,.82)',
      border: `1px solid ${t.border}`, borderRadius: 24, backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-around', padding: '0 8px', zIndex: 5,
      boxShadow: '0 10px 30px rgba(0,0,0,.28)' }}>
      {items.map(([ic, label]) => ic === 'plus' ? (
        <div key="plus" style={{ width: 50, height: 50, borderRadius: 17, background: t.grad,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.glow,
          marginTop: -2 }}><Icon name="plus" size={24} color="#fff" sw={2.2}/></div>
      ) : (
        <div key={ic} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === ic ? t.a1 : t.faint, minWidth: 52 }}>
          <Icon name={ic} size={21} sw={active === ic ? 2 : 1.7}/>
          <span style={{ fontSize: 9.5, fontWeight: 600 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Avatar ──────────────────────────────────────────────────
function Avatar({ theme, initial = 'R', size = 46 }) {
  const t = theme;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: t.grad,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: size * 0.4, color: '#fff',
      boxShadow: t.glow, border: '1.5px solid rgba(255,255,255,.25)' }}>{initial}</div>
  );
}

// ── Logo: PML + up-arrow, "Propel My Life" beneath ──────────
// variant: 'stack' (mark over wordmark) | 'row' (mark + wordmark inline) | 'mark'
function Logo({ theme, variant = 'row', scale = 1, onDark }) {
  const t = theme;
  const ink = onDark != null ? (onDark ? '#fff' : '#1c140e') : t.text;
  const s = scale;
  // The mark: "PML" with an upward arrow rising through it.
  const Mark = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 * s }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26 * s,
        letterSpacing: -.5, color: ink, lineHeight: 1 }}>PML</span>
      <span style={{ position: 'relative', width: 26 * s, height: 26 * s, flexShrink: 0,
        borderRadius: 8 * s, background: t.grad, boxShadow: t.glow,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={15 * s} height={15 * s} viewBox="0 0 16 16" fill="none"
          stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 11.5L12 4M12 4H7M12 4V9"/>
        </svg>
      </span>
    </div>
  );
  const Word = (
    <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 10.5 * s,
      letterSpacing: 3 * s, textTransform: 'uppercase', color: t.dim, lineHeight: 1 }}>
      Propel&nbsp;My&nbsp;Life</span>
  );
  if (variant === 'mark') return Mark;
  if (variant === 'stack') return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 7 * s }}>
      {Mark}{Word}
    </div>
  );
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11 * s }}>
      {Mark}
      <div style={{ width: 1, height: 22 * s, background: t.border }} />
      {Word}
    </div>
  );
}

Object.assign(window, {
  THEMES, DENSITY, FONT, DISPLAY, Icon, Phone, StatusBar, Card, Tile, Ring,
  ModuleHeader, Chip, SectionLabel, BottomNav, Avatar, Logo,
});
