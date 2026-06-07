'use client'
import { useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { AppProvider, useApp } from '@/context/AppContext'
import { StatusBar } from '@/components/layout/StatusBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { QuickAdd } from '@/components/sheets/QuickAdd'
import { AddReminderSheet } from '@/components/sheets/AddReminderSheet'
import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet'
import { Sheet } from '@/components/sheets/Sheet'
import { AutoCalendarSync } from '@/components/AutoCalendarSync'
import { TaskSheet } from '@/components/tasks/TaskSheet'
import { ProjectSheet } from '@/components/projects/ProjectSheet'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

function Sheets() {
  const { sheet, closeSheet, tasks } = useApp()
  const openTask = tasks.find(t => sheet?.type === 'task' && t.id === (sheet as { type: 'task'; id: string }).id)
  return (
    <>
      {sheet?.type === 'quick' && <QuickAdd />}
      {sheet?.type === 'reminder' && <AddReminderSheet />}
      {sheet?.type === 'edit-reminder' && <AddReminderSheet editId={(sheet as { type: 'edit-reminder'; id: string }).id} />}
      {sheet?.type === 'add-task' && <TaskSheet projectId={(sheet as { type: 'add-task'; projectId?: string }).projectId} />}
      {sheet?.type === 'edit-task' && <TaskSheet editId={(sheet as { type: 'edit-task'; id: string }).id} />}
      {sheet?.type === 'task' && openTask && <TaskDetailSheet task={openTask} />}
      {sheet?.type === 'add-project' && <ProjectSheet />}
      {sheet?.type === 'edit-project' && <ProjectSheet editId={(sheet as { type: 'edit-project'; id: string }).id} />}
      {sheet?.type === 'info' && (
        <Sheet title="Heads up" onClose={closeSheet}>
          <div style={{ fontSize: 14, color: T.dim, lineHeight: 1.6, paddingBottom: 8 }}>
            {(sheet as { type: 'info'; message: string }).message}
          </div>
        </Sheet>
      )}
    </>
  )
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  const { toast, setWebMode } = useApp()
  const pathname = usePathname()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [pathname])

  return (
    <div style={{
      minHeight: '100vh',
      background: [
        'radial-gradient(110% 80% at 80% -10%, rgba(155,107,255,.22), transparent 55%)',
        'radial-gradient(100% 70% at -10% 10%, rgba(91,141,239,.18), transparent 52%)',
        'radial-gradient(120% 90% at 60% 120%, rgba(255,107,193,.12), transparent 55%)',
        'linear-gradient(180deg, #0a0814, #07060f)',
      ].join(','),
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT_BODY, gap: 14,
    }}>
      <div style={{
        width: 'min(390px, 100vw)', height: 'min(844px, 100vh)',
        position: 'relative', borderRadius: 40, overflow: 'hidden',
        background: '#0c0a16',
        boxShadow: [
          '0 40px 100px rgba(0,0,0,.6)',
          '0 0 0 1px rgba(255,255,255,.06)',
          '0 0 0 11px rgba(20,16,32,.9)',
          '0 0 0 12px rgba(255,255,255,.04)',
        ].join(','),
      }}>
        <div style={{ width: '100%', height: '100%', background: T.appBg, color: T.text, fontFamily: FONT_BODY, position: 'relative', overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
          <StatusBar />
          <div ref={bodyRef} style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0 18px 110px', zIndex: 1 }}>
            {children}
          </div>
          <BottomNav />
          <AutoCalendarSync />
          <Sheets />
          {toast && (
            <div style={{ position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)', background: T.text, color: '#15121f', padding: '11px 18px', borderRadius: 14, fontSize: 13, fontWeight: 700, zIndex: 60, boxShadow: '0 8px 30px rgba(0,0,0,.4)', whiteSpace: 'nowrap', animation: 'pl-fade .2s ease', fontFamily: FONT_BODY }}>
              {toast}
            </div>
          )}
        </div>
      </div>

      {/* Toggle to web view */}
      <Press onClick={() => setWebMode(true)} scale={0.96} style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px',
        borderRadius: 20, background: 'rgba(255,255,255,.05)', border: `1px solid ${T.border}`,
        color: T.faint, fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
      }}>
        <Icon name="monitor" size={14} color={T.faint} />
        Switch to web view
      </Press>
    </div>
  )
}

function WebShell({ children }: { children: React.ReactNode }) {
  const { toast } = useApp()
  const pathname = usePathname()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [pathname])

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: [
        'radial-gradient(110% 80% at 80% -10%, rgba(155,107,255,.18), transparent 55%)',
        'radial-gradient(100% 70% at -10% 10%, rgba(91,141,239,.14), transparent 52%)',
        'linear-gradient(180deg, #0a0814, #07060f)',
      ].join(','),
      color: T.text, fontFamily: FONT_BODY, WebkitFontSmoothing: 'antialiased',
    }}>
      <Sidebar />
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '36px 36px 80px' }}>
          {children}
        </div>
      </div>
      <AutoCalendarSync />
      <Sheets />
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: T.text, color: '#15121f', padding: '11px 18px', borderRadius: 14, fontSize: 13, fontWeight: 700, zIndex: 100, boxShadow: '0 8px 30px rgba(0,0,0,.4)', whiteSpace: 'nowrap', animation: 'pl-fade .2s ease', fontFamily: FONT_BODY }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { webMode } = useApp()
  return webMode
    ? <WebShell>{children}</WebShell>
    : <PhoneShell>{children}</PhoneShell>
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>
        <AppShellInner>{children}</AppShellInner>
      </AppProvider>
    </SessionProvider>
  )
}
