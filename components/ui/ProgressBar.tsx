import { T } from '@/lib/theme'

export function ProgressBar({ pct, done }: { pct: number; done?: boolean }) {
  return (
    <div style={{ flex: 1, height: 6, borderRadius: 4, background: T.border, overflow: 'hidden' }}>
      <div style={{
        width: pct + '%', height: '100%',
        background: done ? T.good : T.grad,
        borderRadius: 4, transition: 'width .3s ease',
      }} />
    </div>
  )
}
