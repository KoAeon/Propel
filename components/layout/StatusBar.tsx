import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

export function StatusBar() {
  return (
    <div style={{
      height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: T.text,
      position: 'relative', zIndex: 2,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: .9 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={T.text}>
          <rect x="0" y="6" width="3" height="5" rx="1" />
          <rect x="4.5" y="4" width="3" height="7" rx="1" />
          <rect x="9" y="2" width="3" height="9" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={T.text} strokeWidth="1.3">
          <path d="M1 4.5C4.5 1 11.5 1 15 4.5M3.3 6.8c2.6-2.5 6.8-2.5 9.4 0M5.6 9c1.3-1.2 3.5-1.2 4.8 0" strokeLinecap="round" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="1" y="1" width="21" height="10" rx="3" stroke={T.text} strokeOpacity=".5" />
          <rect x="3" y="3" width="15" height="6" rx="1.5" fill={T.text} />
          <rect x="23.5" y="4" width="1.6" height="4" rx="1" fill={T.text} fillOpacity=".6" />
        </svg>
      </div>
    </div>
  )
}
