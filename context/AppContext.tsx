'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { Habit, Reminder, Task, Project, SheetType, TaskStatus } from '@/lib/types'
import type { Person, PersonReminder } from '@/lib/people'
import {
  SEED_HABITS, SEED_REMINDERS, SEED_TASKS, SEED_PROJECTS, SEED_PEOPLE,
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
  dbLoading: boolean
  cloudSyncNeeded: boolean
  syncToCloud: () => Promise<void>
  addHabit: (h: Omit<Habit, 'id'>) => void
  editHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void
  deleteHabit: (id: string) => void
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
  people: Person[]
  addPerson: (p: Omit<Person, 'id'>) => void
  editPerson: (id: string, updates: Partial<Omit<Person, 'id'>>) => void
  deletePerson: (id: string) => void
  addPersonReminder: (personId: string, r: Omit<PersonReminder, 'id'>) => void
  deletePersonReminder: (personId: string, reminderId: string) => void
  setAutoRemind: (v: boolean) => void
  setWebMode: (v: boolean) => void
  openSheet: (s: SheetType) => void
  closeSheet: () => void
  flash: (msg: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { status: sessionStatus } = useSession()

  const [habits, setHabits] = useState<Habit[]>(() => loadStored('habits', SEED_HABITS))
  const [reminders, setReminders] = useState<Reminder[]>(() => loadStored('reminders', SEED_REMINDERS))
  const [tasks, setTasks] = useState<Task[]>(() => loadStored('tasks', SEED_TASKS))
  const [projects, setProjects] = useState<Project[]>(() => loadStored('projects', SEED_PROJECTS))
  const [people, setPeople] = useState<Person[]>(() => loadStored('people', SEED_PEOPLE))
  const [autoRemind, setAutoRemindState] = useState(() => loadStored<boolean>('autoRemind', true))
  const [webMode, setWebModeState] = useState(() => loadStored<boolean>('webMode', false))
  const [sheet, setSheet] = useState<SheetType | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [dbLoading, setDbLoading] = useState(true)
  const [dbLoaded, setDbLoaded] = useState(false)
  const [cloudSyncNeeded, setCloudSyncNeeded] = useState(false)

  const flash = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  // Load from Supabase when signed in
  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (sessionStatus === 'unauthenticated') {
      setDbLoading(false)
      setDbLoaded(true)
      return
    }
    fetch('/api/db')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          if (data.habits) setHabits(data.habits)
          if (data.reminders) setReminders(data.reminders)
          if (data.tasks) setTasks(data.tasks)
          if (data.projects) setProjects(data.projects)
          if (data.people) setPeople(data.people)
          if (data.autoRemind !== undefined) setAutoRemindState(data.autoRemind)
          if (data.webMode !== undefined) setWebModeState(data.webMode)
        } else {
          // Supabase is empty — check if there's local data to migrate
          const hasLocal = !!localStorage.getItem('propel-data')
          if (hasLocal) setCloudSyncNeeded(true)
        }
      })
      .catch(() => {}) // keep localStorage state on error
      .finally(() => {
        setDbLoading(false)
        setDbLoaded(true)
      })
  }, [sessionStatus])

  // Save to Supabase (debounced 1.5s) or localStorage
  useEffect(() => {
    if (!dbLoaded) return
    if (sessionStatus !== 'authenticated') {
      saveStored({ habits, reminders, tasks, projects, people, autoRemind, webMode })
      return
    }
    const timer = setTimeout(() => {
      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits, reminders, tasks, projects, people, autoRemind, webMode }),
      }).catch(() => saveStored({ habits, reminders, tasks, projects, people, autoRemind, webMode }))
    }, 1500)
    return () => clearTimeout(timer)
  }, [habits, reminders, tasks, projects, people, autoRemind, webMode, dbLoaded, sessionStatus])

  const syncToCloud = useCallback(async () => {
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habits, reminders, tasks, projects, people, autoRemind, webMode }),
    })
    setCloudSyncNeeded(false)
    flash('Data synced to cloud ✓')
  }, [habits, reminders, tasks, projects, people, autoRemind, webMode, flash])

  const addHabit = useCallback((h: Omit<Habit, 'id'>) => {
    setHabits(hs => [...hs, { ...h, id: 'hab' + Date.now() }])
    setSheet(null)
    flash('Habit added')
  }, [flash])

  const editHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id'>>) => {
    setHabits(hs => hs.map(h => h.id === id ? { ...h, ...updates } : h))
    setSheet(null)
    flash('Habit saved')
  }, [flash])

  const deleteHabit = useCallback((id: string) => {
    setHabits(hs => hs.filter(h => h.id !== id))
    flash('Habit removed')
  }, [flash])

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

  const addPerson = useCallback((p: Omit<Person, 'id'>) => {
    setPeople(ps => [{ ...p, id: 'per' + Date.now() }, ...ps])
    setSheet(null)
    flash('Contact added')
  }, [flash])

  const editPerson = useCallback((id: string, updates: Partial<Omit<Person, 'id'>>) => {
    setPeople(ps => ps.map(p => p.id === id ? { ...p, ...updates } : p))
    setSheet(null)
    flash('Contact saved')
  }, [flash])

  const deletePerson = useCallback((id: string) => {
    setPeople(ps => ps.filter(p => p.id !== id))
    setSheet(null)
    flash('Contact deleted')
  }, [flash])

  const addPersonReminder = useCallback((personId: string, r: Omit<PersonReminder, 'id'>) => {
    setPeople(ps => ps.map(p => p.id === personId
      ? { ...p, reminders: [...p.reminders, { ...r, id: 'pr' + Date.now() }] }
      : p
    ))
  }, [])

  const deletePersonReminder = useCallback((personId: string, reminderId: string) => {
    setPeople(ps => ps.map(p => p.id === personId
      ? { ...p, reminders: p.reminders.filter(r => r.id !== reminderId) }
      : p
    ))
  }, [])

  const setAutoRemind = useCallback((v: boolean) => setAutoRemindState(v), [])
  const setWebMode = useCallback((v: boolean) => setWebModeState(v), [])
  const openSheet = useCallback((s: SheetType) => setSheet(s), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  return (
    <Ctx.Provider value={{
      habits, reminders, tasks, projects, autoRemind, webMode, sheet, toast,
      dbLoading, cloudSyncNeeded, syncToCloud,
      addHabit, editHabit, deleteHabit, toggleHabit,
      addReminder, editReminder, deleteReminder, setReminderEventId,
      addTask, editTask, deleteTask,
      toggleSub, setStatus, setSubText, setSubDue, addSub, delSub,
      addProject, editProject, deleteProject,
      people, addPerson, editPerson, deletePerson, addPersonReminder, deletePersonReminder,
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
