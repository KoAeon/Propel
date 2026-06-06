import { T } from '@/lib/theme'
import { Press } from './Press'

export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <Press onClick={onClick} scale={0.92} style={{
      width: 46, height: 27, borderRadius: 14, position: 'relative',
      background: on ? T.grad : T.surface2,
      border: `1px solid ${T.border}`,
      boxShadow: on ? T.glow : 'none',
      transition: 'background .2s',
    }}>
      <div style={{
        position: 'absolute', top: 2.5,
        left: on ? 22 : 2.5,
        width: 21, height: 21, borderRadius: '50%',
        background: '#fff',
        transition: 'left .2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,.3)',
      }} />
    </Press>
  )
}
