const PATHS: Record<string, string> = {
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
  heart: 'M12 20s-7-4.5-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.5 12 20 12 20z',
  wallet: 'M3 7h15a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0V6a2 2 0 012-2h11M17 12.5h.01',
  book: 'M4 5a2 2 0 012-2h13v15H6a2 2 0 00-4 2V5zM19 18H6',
  leaf: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19c3-3 6-5 9-6',
  gift: 'M4 11h16v9H4zM4 7h16v4H4zM12 7v13M12 7S10 3 8 4s0 3 4 3zM12 7s2-4 4-3 0 3-4 3z',
  user: 'M5 20a7 7 0 0114 0M12 11a4 4 0 100-8 4 4 0 000 8z',
  cal: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4',
  steps: 'M8 20c-2 0-3-2-2.5-4S8 12 8 9s2-4 3-4 1 3 0 5-1 4 0 6M16 4c1 1 1 3 0 5s-2 4-1 6',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 014 10.5c-.7.7-1 1.3-1 2.5H9c0-1.2-.3-1.8-1-2.5A6 6 0 0112 3z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  x: 'M18 6L6 18M6 6l12 12',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  pencil: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  monitor: 'M2 4h20v13H2zM8 21h8M12 17v4',
  phone: 'M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM10 19h4',
  folder: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
  cog: 'M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 13a7.8 7.8 0 000-2l2-1.5-2-3.5-2.4 1a7.8 7.8 0 00-1.7-1L15 2.5h-4l-.3 2.5a7.8 7.8 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 000 2l-2 1.5 2 3.5 2.4-1a7.8 7.8 0 001.7 1l.3 2.5h4l.3-2.5a7.8 7.8 0 001.7-1l2.4 1 2-3.5z',
}

interface IconProps {
  name: string
  size?: number
  color?: string
  sw?: number
  style?: React.CSSProperties
}

export function Icon({ name, size = 20, color = 'currentColor', sw = 1.7, style }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path d={PATHS[name] || PATHS.grid} />
    </svg>
  )
}
