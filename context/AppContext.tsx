'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { Habit, Reminder, Task, Project, SheetType, TaskStatus } from '@/lib/types'
import type { Person, PersonReminder } from '@/lib/people'

interface AppState {
  habits: Habit[]
  reminders: Reminder[]
  tasks: Task[]
  projects: Project[]
  people: Person[]
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

function post(path: string, body: unknown) {
  return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}
function del(path: string) {
  return fetch(path, { method: 'DELETE' })
}

function sortReminders(rs: Reminder[]) {
  return [...rs].sort((a, b) => {
    if (a.days !== b.days) return a.days - b.days
    const ta = a.time ?? '09:00'
    const tb = b.time ?? '09:00'
    return ta < tb ? -1 : ta > tb ? 1 : 0
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const authed = sessionStatus === 'authenticated'

  const [habits, setHabits] = useState<Habit[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [autoRemind, setAutoRemindState] = useState(true)
  const [webMode, setWebModeState] = useState(false)
  const [sheet, setSheet] = useState<SheetType | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [dbLoading, setDbLoading] = useState(true)
  const [cloudSyncNeeded, setCloudSyncNeeded] = useState(false)

  // Track latest task state for subtask saves without stale closure
  const tasksRef = useRef(tasks)
  useEffect(() => { tasksRef.current = tasks }, [tasks])

  const peopleRef = useRef(people)
  useEffect(() => { peopleRef.current = people }, [people])

  const flash = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  // Load all data from Supabase on sign-in
  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (!authed) {
      setDbLoading(false)
      // Check if there's local data to migrate
      const hasLocal = typeof window !== 'undefined' && !!localStorage.getItem('propel-data')
      if (hasLocal) setCloudSyncNeeded(true)
      return
    }
    setDbLoading(true)
    fetch('/api/db')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setHabits(data.habits ?? [])
          setReminders(data.reminders ?? [])
          setProjects(data.projects ?? [])
          setTasks(data.tasks ?? [])
          setPeople(data.people ?? [])
          setAutoRemindState(data.autoRemind ?? true)
          setWebModeState(data.webMode ?? false)
        }
        // If Supabase is empty, check for local data to migrate
        const isEmpty = !data || (
          !data.habits?.length && !data.reminders?.length &&
          !data.tasks?.length && !data.projects?.length && !data.people?.length
        )
        if (isEmpty && typeof window !== 'undefined' && !!localStorage.getItem('propel-data')) {
          setCloudSyncNeeded(true)
        }
      })
      .catch(() => {})
      .finally(() => setDbLoading(false))
  }, [authed, sessionStatus])

  // Migrate localStorage data to Supabase
  const syncToCloud = useCallback(async () => {
    const raw = localStorage.getItem('propel-data')
    if (!raw) return
    await post('/api/db/migrate', JSON.parse(raw))
    // Reload fresh from DB
    const res = await fetch('/api/db')
    if (res.ok) {
      const data = await res.json()
      setHabits(data.habits ?? [])
      setReminders(data.reminders ?? [])
      setProjects(data.projects ?? [])
      setTasks(data.tasks ?? [])
      setPeople(data.people ?? [])
    }
    setCloudSyncNeeded(false)
    flash('Data migrated to cloud ✓')
  }, [flash])

  // ── Habits ────────────────────────────────────────────
  const addHabit = useCallback((h: Omit<Habit, 'id'>) => {
    const habit = { ...h, id: 'hab' + Date.now() }
    setHabits(hs => [...hs, habit])
    if (authed) post('/api/db/habits', habit)
    setSheet(null); flash('Habit added')
  }, [authed, flash])

  const editHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id'>>) => {
    setHabits(hs => hs.map(h => {
      if (h.id !== id) return h
      const updated = { ...h, ...updates }
      if (authed) post('/api/db/habits', updated)
      return updated
    }))
    setSheet(null); flash('Habit saved')
  }, [authed, flash])

  const deleteHabit = useCallback((id: string) => {
    setHabits(hs => hs.filter(h => h.id !== id))
    if (authed) del(`/api/db/habits/${id}`)
    flash('Habit removed')
  }, [authed, flash])

  const toggleHabit = useCallback((id: string) => {
    setHabits(hs => hs.map(h => {
      if (h.id !== id) return h
      const updated = { ...h, done: !h.done, streak: h.done ? Math.max(0, h.streak - 1) : h.streak + 1 }
      if (authed) post('/api/db/habits', updated)
      return updated
    }))
  }, [authed])

  // ── Reminders ─────────────────────────────────────────
  const addReminder = useCallback((r: Omit<Reminder, 'id'>) => {
    const reminder = { ...r, id: 'r' + Date.now() }
    setReminders(rs => sortReminders([...rs, reminder]))
    if (authed) post('/api/db/reminders', reminder)
    setSheet(null); flash('Reminder added · syncing to Google Calendar…')
  }, [authed, flash])

  const editReminder = useCallback((id: string, updates: Partial<Omit<Reminder, 'id'>>) => {
    setReminders(rs => sortReminders(rs.map(r => {
      if (r.id !== id) return r
      const updated = { ...r, ...updates, gcalEventId: undefined }
      if (authed) post('/api/db/reminders', updated)
      return updated
    })))
    setSheet(null); flash('Reminder updated · syncing to Google Calendar…')
  }, [authed, flash])

  const deleteReminder = useCallback((id: string) => {
    setReminders(rs => rs.filter(r => r.id !== id))
    if (authed) del(`/api/db/reminders/${id}`)
    flash('Reminder deleted')
  }, [authed, flash])

  const setReminderEventId = useCallback((id: string, gcalEventId: string) => {
    setReminders(rs => rs.map(r => {
      if (r.id !== id) return r
      const updated = { ...r, gcalEventId }
      if (authed) post('/api/db/reminders', updated)
      return updated
    }))
  }, [authed])

  // ── Tasks ──────────────────────────────────────────────
  const addTask = useCallback((t: Omit<Task, 'id'>) => {
    const task = { ...t, id: 't' + Date.now() }
    setTasks(ts => [task, ...ts])
    if (authed) post('/api/db/tasks', task)
    setSheet(null); flash('Task added')
  }, [authed, flash])

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t
      const updated = { ...t, ...updates }
      if (authed) post('/api/db/tasks', updated)
      return updated
    }))
    setSheet(null); flash('Task saved')
  }, [authed, flash])

  const deleteTask = useCallback((id: string) => {
    setTasks(ts => ts.filter(t => t.id !== id))
    if (authed) del(`/api/db/tasks/${id}`)
    setSheet(null); flash('Task deleted')
  }, [authed, flash])

  const updateTask = useCallback((id: string, fn: (t: Task) => Task) => {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t
      const updated = fn(t)
      if (authed) post('/api/db/tasks', updated)
      return updated
    }))
  }, [authed])

  const toggleSub = useCallback((taskId: string, i: number) =>
    updateTask(taskId, t => ({ ...t, subs: t.subs.map((s, j) => j === i ? { ...s, done: !s.done } : s) }))
  , [updateTask])

  const setStatus = useCallback((taskId: string, status: TaskStatus) =>
    updateTask(taskId, t => ({ ...t, status }))
  , [updateTask])

  const setSubText = useCallback((taskId: string, i: number, text: string) =>
    updateTask(taskId, t => ({ ...t, subs: t.subs.map((s, j) => j === i ? { ...s, t: text } : s) }))
  , [updateTask])

  const setSubDue = useCallback((taskId: string, i: number, due: string) =>
    updateTask(taskId, t => ({ ...t, subs: t.subs.map((s, j) => j === i ? { ...s, due } : s) }))
  , [updateTask])

  const addSub = useCallback((taskId: string) =>
    updateTask(taskId, t => ({ ...t, subs: [...t.subs, { t: '', done: false }] }))
  , [updateTask])

  const delSub = useCallback((taskId: string, i: number) =>
    updateTask(taskId, t => ({ ...t, subs: t.subs.filter((_, j) => j !== i) }))
  , [updateTask])

  // ── Projects ──────────────────────────────────────────
  const addProject = useCallback((p: Omit<Project, 'id'>) => {
    const project = { ...p, id: 'proj' + Date.now() }
    setProjects(ps => [project, ...ps])
    if (authed) post('/api/db/projects', project)
    setSheet(null); flash('Project created')
  }, [authed, flash])

  const editProject = useCallback((id: string, updates: Partial<Omit<Project, 'id'>>) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== id) return p
      const updated = { ...p, ...updates }
      if (authed) post('/api/db/projects', updated)
      return updated
    }))
    setSheet(null); flash('Project saved')
  }, [authed, flash])

  const deleteProject = useCallback((id: string) => {
    setProjects(ps => ps.filter(p => p.id !== id))
    setTasks(ts => ts.map(t => t.projectId === id ? { ...t, projectId: undefined } : t))
    if (authed) del(`/api/db/projects/${id}`)
    setSheet(null); flash('Project deleted')
  }, [authed, flash])

  // ── People ────────────────────────────────────────────
  const addPerson = useCallback((p: Omit<Person, 'id'>) => {
    const person = { ...p, id: 'per' + Date.now() }
    setPeople(ps => [person, ...ps])
    if (authed) post('/api/db/people', person)
    setSheet(null); flash('Contact added')
  }, [authed, flash])

  const editPerson = useCallback((id: string, updates: Partial<Omit<Person, 'id'>>) => {
    setPeople(ps => ps.map(p => {
      if (p.id !== id) return p
      const updated = { ...p, ...updates }
      if (authed) post('/api/db/people', updated)
      return updated
    }))
    setSheet(null); flash('Contact saved')
  }, [authed, flash])

  const deletePerson = useCallback((id: string) => {
    setPeople(ps => ps.filter(p => p.id !== id))
    if (authed) del(`/api/db/people/${id}`)
    setSheet(null); flash('Contact deleted')
  }, [authed, flash])

  const addPersonReminder = useCallback((personId: string, r: Omit<PersonReminder, 'id'>) => {
    setPeople(ps => ps.map(p => {
      if (p.id !== personId) return p
      const updated = { ...p, reminders: [...p.reminders, { ...r, id: 'pr' + Date.now() }] }
      if (authed) post('/api/db/people', updated)
      return updated
    }))
  }, [authed])

  const deletePersonReminder = useCallback((personId: string, reminderId: string) => {
    setPeople(ps => ps.map(p => {
      if (p.id !== personId) return p
      const updated = { ...p, reminders: p.reminders.filter(r => r.id !== reminderId) }
      if (authed) post('/api/db/people', updated)
      return updated
    }))
  }, [authed])

  // ── Settings ──────────────────────────────────────────
  const setAutoRemind = useCallback((v: boolean) => {
    setAutoRemindState(v)
    if (authed) post('/api/db/settings', { autoRemind: v, webMode })
  }, [authed, webMode])

  const setWebMode = useCallback((v: boolean) => {
    setWebModeState(v)
    if (authed) post('/api/db/settings', { autoRemind, webMode: v })
  }, [authed, autoRemind])

  const openSheet = useCallback((s: SheetType) => setSheet(s), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  // Suppress unused ref warnings
  void tasksRef; void peopleRef

  return (
    <Ctx.Provider value={{
      habits, reminders, tasks, projects, people, autoRemind, webMode, sheet, toast,
      dbLoading, cloudSyncNeeded, syncToCloud,
      addHabit, editHabit, deleteHabit, toggleHabit,
      addReminder, editReminder, deleteReminder, setReminderEventId,
      addTask, editTask, deleteTask,
      toggleSub, setStatus, setSubText, setSubDue, addSub, delSub,
      addProject, editProject, deleteProject,
      addPerson, editPerson, deletePerson, addPersonReminder, deletePersonReminder,
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
