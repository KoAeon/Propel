'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Habit, Reminder, Task, SheetType, TaskStatus } from '@/lib/types'
import {
  SEED_HABITS, SEED_REMINDERS, SEED_TASKS,
  loadStored, saveStored,
} from '@/lib/seed'

interface AppState {
  habits: Habit[]
  reminders: Reminder[]
  tasks: Task[]
  autoRemind: boolean
  sheet: SheetType | null
  toast: string | null
  toggleHabit: (id: string) => void
  addReminder: (r: Omit<Reminder, 'id'>) => void
  toggleSub: (taskId: string, i: number) => void
  setStatus: (taskId: string, status: TaskStatus) => void
  setSubText: (taskId: string, i: number, text: string) => void
  setSubDue: (taskId: string, i: number, due: string) => void
  addSub: (taskId: string) => void
  delSub: (taskId: string, i: number) => void
  setAutoRemind: (v: boolean) => void
  openSheet: (s: SheetType) => void
  closeSheet: () => void
  flash: (msg: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => loadStored('habits', SEED_HABITS))
  const [reminders, setReminders] = useState<Reminder[]>(() => loadStored('reminders', SEED_REMINDERS))
  const [tasks, setTasks] = useState<Task[]>(() => loadStored('tasks', SEED_TASKS))
  const [autoRemind, setAutoRemindState] = useState(() => loadStored<boolean>('autoRemind', true))
  const [sheet, setSheet] = useState<SheetType | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { saveStored({ habits, reminders, tasks, autoRemind }) }, [habits, reminders, tasks, autoRemind])

  const flash = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const toggleHabit = useCallback((id: string) => {
    setHabits(hs => hs.map(h =>
      h.id === id ? { ...h, done: !h.done, streak: h.done ? Math.max(0, h.streak - 1) : h.streak + 1 } : h
    ))
  }, [])

  const addReminder = useCallback((r: Omit<Reminder, 'id'>) => {
    setReminders(rs => [{ ...r, id: 'r' + Date.now() }, ...rs].sort((a, b) => a.days - b.days))
    setSheet(null)
    flash('Reminder added · auto-nudges set')
  }, [flash])

  const toggleSub = useCallback((taskId: string, i: number) => {
    setTasks(ts => ts.map(t =>
      t.id === taskId ? { ...t, subs: t.subs.map((s, j) => j === i ? { ...s, done: !s.done } : s) } : t
    ))
  }, [])

  const setStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status } : t))
  }, [])

  const setSubText = useCallback((taskId: string, i: number, text: string) => {
    setTasks(ts => ts.map(t =>
      t.id === taskId ? { ...t, subs: t.subs.map((s, j) => j === i ? { ...s, t: text } : s) } : t
    ))
  }, [])

  const setSubDue = useCallback((taskId: string, i: number, due: string) => {
    setTasks(ts => ts.map(t =>
      t.id === taskId ? { ...t, subs: t.subs.map((s, j) => j === i ? { ...s, due } : s) } : t
    ))
  }, [])

  const addSub = useCallback((taskId: string) => {
    setTasks(ts => ts.map(t =>
      t.id === taskId ? { ...t, subs: [...t.subs, { t: '', done: false, due: '' }] } : t
    ))
  }, [])

  const delSub = useCallback((taskId: string, i: number) => {
    setTasks(ts => ts.map(t =>
      t.id === taskId ? { ...t, subs: t.subs.filter((_, j) => j !== i) } : t
    ))
  }, [])

  const setAutoRemind = useCallback((v: boolean) => setAutoRemindState(v), [])
  const openSheet = useCallback((s: SheetType) => setSheet(s), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  return (
    <Ctx.Provider value={{
      habits, reminders, tasks, autoRemind, sheet, toast,
      toggleHabit, addReminder, toggleSub, setStatus,
      setSubText, setSubDue, addSub, delSub, setAutoRemind,
      openSheet, closeSheet, flash,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
