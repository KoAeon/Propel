interface TileProps {
  glyph: string
  from: string
  to: string
  size?: number
  radius?: number
  ring?: boolean
}

export function Tile({ glyph, from, to, size = 44, radius = 13, ring }: TileProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(150deg, ${from}, ${to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.46, lineHeight: 1,
      boxShadow: `0 6px 16px ${from}44, inset 0 1px 0 rgba(255,255,255,.25)`,
      border: ring ? '1px solid rgba(255,255,255,.18)' : 'none',
    }}>
      <span>{glyph}</span>
    </div>
  )
}
