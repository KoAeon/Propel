'use client'
import { useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { AppProvider, useApp } from '@/context/AppContext'
import { StatusBar } from '@/components/layout/StatusBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { QuickAdd } from '@/components/sheets/QuickAdd'
import { AddReminderSheet } from '@/components/sheets/AddReminderSheet'
import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet'
import { Sheet } from '@/components/sheets/Sheet'
import { T } from '@/lib/theme'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { sheet, closeSheet, toast, tasks, flash } = useApp()
  const pathname = usePathname()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [pathname])

  const openTask = tasks.find(t => sheet?.type === 'task' && t.id === (sheet as {type:'task';id:string}).id)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.appBg,
      color: T.text,
      fontFamily: FONT_BODY,
      position: 'relative', overflow: 'hidden',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <StatusBar />
      <div
        ref={bodyRef}
        style={{
          position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
          overflowY: 'auto', overflowX: 'hidden',
          padding: '0 18px 110px',
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <BottomNav />

      {/* Sheets */}
      {sheet?.type === 'quick' && <QuickAdd />}
      {sheet?.type === 'reminder' && <AddReminderSheet />}
      {sheet?.type === 'task' && openTask && <TaskDetailSheet task={openTask} />}
      {sheet?.type === 'info' && (
        <Sheet title="Heads up" onClose={closeSheet}>
          <div style={{ fontSize: 14, color: T.dim, lineHeight: 1.6, paddingBottom: 8 }}>
            {(sheet as {type:'info';message:string}).message}
          </div>
        </Sheet>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)',
          background: T.text, color: '#15121f',
          padding: '11px 18px', borderRadius: 14,
          fontSize: 13, fontWeight: 700, zIndex: 60,
          boxShadow: '0 8px 30px rgba(0,0,0,.4)',
          whiteSpace: 'nowrap', animation: 'pl-fade .2s ease',
          fontFamily: FONT_BODY,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    <AppProvider>
      {/* Phone frame on desktop, full-screen on mobile */}
      <div style={{
        minHeight: '100vh',
        background: [
          'radial-gradient(110% 80% at 80% -10%, rgba(155,107,255,.22), transparent 55%)',
          'radial-gradient(100% 70% at -10% 10%, rgba(91,141,239,.18), transparent 52%)',
          'radial-gradient(120% 90% at 60% 120%, rgba(255,107,193,.12), transparent 55%)',
          'linear-gradient(180deg, #0a0814, #07060f)',
        ].join(','),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_BODY,
      }}>
        <div style={{
          width: 'min(390px, 100vw)',
          height: 'min(844px, 100vh)',
          position: 'relative',
          borderRadius: 40,
          overflow: 'hidden',
          background: '#0c0a16',
          boxShadow: [
            '0 40px 100px rgba(0,0,0,.6)',
            '0 0 0 1px rgba(255,255,255,.06)',
            '0 0 0 11px rgba(20,16,32,.9)',
            '0 0 0 12px rgba(255,255,255,.04)',
          ].join(','),
        }}>
          <AppShellInner>{children}</AppShellInner>
        </div>
      </div>
    </AppProvider>
    </SessionProvider>
  )
}
