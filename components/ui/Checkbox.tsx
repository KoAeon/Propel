import { T } from '@/lib/theme'
import { Icon } from './Icon'

export function Checkbox({ on, size = 28 }: { on: boolean; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: on ? T.grad : 'transparent',
      border: on ? 'none' : `2px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: on ? T.glow : 'none',
      transition: 'all .2s ease',
    }}>
      {on && <Icon name="check" size={size * 0.52} color="#fff" sw={2.6} />}
    </div>
  )
}
