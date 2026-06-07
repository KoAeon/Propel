'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Habit, Reminder, Task, Project, SheetType, TaskStatus } from '@/lib/types'
import {
  SEED_HABITS, SEED_REMINDERS, SEED_TASKS, SEED_PROJECTS,
  loadStored, saveStored,
} from '@/lib/seed'

interface AppState {
  habits: Habit[]
  reminders: Reminder[]
  tasks: Task[]
  projects: Project[]
  autoRemind: boolean
  webMode: boolean
  sheet: SheetType | null
  toast: string | null
  toggleHabit: (id: string) => void
  addReminder: (r: Omit<Reminder, 'id'>) => void
  editReminder: (id: string, r: Partial<Omit<Reminder, 'id'>>) => void
  deleteReminder: (id: string) => void
  setReminderEventId: (id: string, gcalEventId: string) => void
  addTask: (t: Omit<Task, 'id'>) => void
  editTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void
  deleteTask: (id: string) => void
  toggleSub: (taskId: string, i: number) => void
  setStatus: (taskId: string, status: TaskStatus) => void
  setSubText: (taskId: string, i: number, text: string) => void
  setSubDue: (taskId: string, i: number, due: string) => void
  addSub: (taskId: string) => void
  delSub: (taskId: string, i: number) => void
  addProject: (p: Omit<Project, 'id'>) => void
  editProject: (id: string, updates: Partial<Omit<Project, 'id'>>) => void
  deleteProject: (id: string) => void
  setAutoRemind: (v: boolean) => void
  setWebMode: (v: boolean) => void
  openSheet: (s: SheetType) => void
  closeSheet: () => void
  flash: (msg: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => loadStored('habits', SEED_HABITS))
  const [reminders, setReminders] = useState<Reminder[]>(() => loadStored('reminders', SEED_REMINDERS))
  const [tasks, setTasks] = useState<Task[]>(() => loadStored('tasks', SEED_TASKS))
  const [projects, setProjects] = useState<Project[]>(() => loadStored('projects', SEED_PROJECTS))
  const [autoRemind, setAutoRemindState] = useState(() => loadStored<boolean>('autoRemind', true))
  const [webMode, setWebModeState] = useState(() => loadStored<boolean>('webMode', false))
  const [sheet, setSheet] = useState<SheetType | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    saveStored({ habits, reminders, tasks, projects, autoRemind, webMode })
  }, [habits, reminders, tasks, projects, autoRemind, webMode])

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
    flash('Reminder added · syncing to Google Calendar…')
  }, [flash])

  const editReminder = useCallback((id: string, updates: Partial<Omit<Reminder, 'id'>>) => {
    setReminders(rs => rs
      .map(r => r.id === id ? { ...r, ...updates, gcalEventId: undefined } : r)
      .sort((a, b) => a.days - b.days)
    )
    setSheet(null)
    flash('Reminder updated · syncing to Google Calendar…')
  }, [flash])

  const deleteReminder = useCallback((id: string) => {
    setReminders(rs => rs.filter(r => r.id !== id))
    flash('Reminder deleted')
  }, [flash])

  const setReminderEventId = useCallback((id: string, gcalEventId: string) => {
    setReminders(rs => rs.map(r => r.id === id ? { ...r, gcalEventId } : r))
  }, [])

  const addTask = useCallback((t: Omit<Task, 'id'>) => {
    setTasks(ts => [{ ...t, id: 't' + Date.now() }, ...ts])
    setSheet(null)
    flash('Task added')
  }, [flash])

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t))
    setSheet(null)
    flash('Task saved')
  }, [flash])

  const deleteTask = useCallback((id: string) => {
    setTasks(ts => ts.filter(t => t.id !== id))
    setSheet(null)
    flash('Task deleted')
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
      t.id === taskId ? { ...t, subs: [...t.subs, { t: '', done: false }] } : t
    ))
  }, [])

  const delSub = useCallback((taskId: string, i: number) => {
    setTasks(ts => ts.map(t =>
      t.id === taskId ? { ...t, subs: t.subs.filter((_, j) => j !== i) } : t
    ))
  }, [])

  const addProject = useCallback((p: Omit<Project, 'id'>) => {
    setProjects(ps => [{ ...p, id: 'proj' + Date.now() }, ...ps])
    setSheet(null)
    flash('Project created')
  }, [flash])

  const editProject = useCallback((id: string, updates: Partial<Omit<Project, 'id'>>) => {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, ...updates } : p))
    setSheet(null)
    flash('Project saved')
  }, [flash])

  const deleteProject = useCallback((id: string) => {
    setProjects(ps => ps.filter(p => p.id !== id))
    setTasks(ts => ts.map(t => t.projectId === id ? { ...t, projectId: undefined } : t))
    setSheet(null)
    flash('Project deleted')
  }, [flash])

  const setAutoRemind = useCallback((v: boolean) => setAutoRemindState(v), [])
  const setWebMode = useCallback((v: boolean) => setWebModeState(v), [])
  const openSheet = useCallback((s: SheetType) => setSheet(s), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  return (
    <Ctx.Provider value={{
      habits, reminders, tasks, projects, autoRemind, webMode, sheet, toast,
      toggleHabit,
      addReminder, editReminder, deleteReminder, setReminderEventId,
      addTask, editTask, deleteTask,
      toggleSub, setStatus, setSubText, setSubDue, addSub, delSub,
      addProject, editProject, deleteProject,
      setAutoRemind, setWebMode, openSheet, closeSheet, flash,
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
