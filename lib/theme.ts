export const aurora = {
  key: 'aurora',
  dark: true,
  appBg: [
    'radial-gradient(120% 80% at 84% -8%, rgba(155,107,255,.28), transparent 55%)',
    'radial-gradient(110% 70% at -8% 10%, rgba(91,141,239,.22), transparent 52%)',
    'radial-gradient(120% 90% at 60% 120%, rgba(255,107,193,.16), transparent 55%)',
    'linear-gradient(180deg,#100d1d,#0c0a16 60%,#090814)',
  ].join(','),
  surface: 'rgba(255,255,255,.05)',
  surface2: 'rgba(255,255,255,.08)',
  border: 'rgba(255,255,255,.10)',
  text: '#eef0fb',
  dim: 'rgba(238,240,251,.58)',
  faint: 'rgba(238,240,251,.34)',
  a1: '#5B8DEF',
  a2: '#9B6BFF',
  a3: '#FF6BC1',
  grad: 'linear-gradient(135deg,#5B8DEF,#9B6BFF 52%,#FF6BC1)',
  glow: '0 8px 30px rgba(123,124,255,.34)',
  good: '#54D6C0',
  warn: '#FFC24B',
} as const

export type Theme = typeof aurora
export const T = aurora
