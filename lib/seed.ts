import type { Habit, Reminder, Task, Project } from './types'
import type { Person } from './people'

export const SEED_HABITS: Habit[] = [
  { id: 'health', glyph: '🏃', from: '#4FB477', to: '#7FD89B', name: 'Daily Exercise', meta: '30 min · Health', streak: 0, done: false },
  { id: 'study', glyph: '📚', from: '#5B8DEF', to: '#9B6BFF', name: 'Study / Learning', meta: '30 min', streak: 0, done: false },
  { id: 'water', glyph: '💧', from: '#3FA9F5', to: '#5BD0E8', name: 'Drink 2L Water', meta: 'Daily', streak: 0, done: false },
  { id: 'sugar', glyph: '🍬', from: '#E0A93B', to: '#FF9D4D', name: 'No Sugar Day', meta: 'Diet goal', streak: 0, done: false },
  { id: 'read', glyph: '📖', from: '#6B8AFF', to: '#8FA9FF', name: 'Reading', meta: '20 min', streak: 0, done: false },
  { id: 'peace', glyph: '🧘', from: '#7C6BFF', to: '#A98BFF', name: 'Peacefulness', meta: 'Meditation · 10 min', streak: 0, done: false },
]

export const SEED_REMINDERS: Reminder[] = [
  { id: 'pr1', glyph: '🎂', title: "Zara's Birthday",   sub: 'Jun 11 · yearly', days: 4,   date: '2026-06-11', cat: 'Birthday' },
  { id: 'pr3', glyph: '🎂', title: "Kiki's Birthday",   sub: 'Dec 28 · yearly', days: 204, date: '2026-12-28', cat: 'Birthday' },
  { id: 'pr2', glyph: '🎂', title: "Maddie's Birthday", sub: 'Mar 10 · yearly', days: 276, date: '2027-03-10', cat: 'Birthday' },
]

export const SEED_PROJECTS: Project[] = []

export const SEED_TASKS: Task[] = []

export const SEED_PEOPLE: Person[] = [
  {
    id: 'p_zara', name: 'Zara', relationship: 'Family',
    dob: '2014-06-11', notes: 'Loves art and music. Turning 12.',
    reminders: [{ id: 'pr1', label: "Zara's Birthday", date: '2026-06-11', freq: 'Yearly' }],
  },
  {
    id: 'p_maddie', name: 'Maddie', relationship: 'Family',
    dob: '1990-03-10', notes: '',
    reminders: [{ id: 'pr2', label: "Maddie's Birthday", date: '2027-03-10', freq: 'Yearly' }],
  },
  {
    id: 'p_kiki', name: 'Kiki', relationship: 'Family',
    dob: '2010-12-28', notes: '',
    reminders: [{ id: 'pr3', label: "Kiki's Birthday", date: '2026-12-28', freq: 'Yearly' }],
  },
]

export const STATUS_ORDER = ['Not Started', 'Started', 'On Hold', 'Waiting', 'Completed'] as const

export const STATUS_COLOR: Record<string, string> = {
  'Not Started': '#6B7280',
  Started: '#3B82F6',
  'On Hold': '#E0A93B',
  Waiting: '#A855F7',
  Completed: '#1F9D6B',
}

export const REMINDER_CATS = ['All', 'Renewal', 'Birthday', 'Financial', 'Health', 'Task'] as const

export const CAT_GLYPH: Record<string, string> = {
  Renewal: '🔄',
  Birthday: '🎂',
  Financial: '💰',
  Health: '🩺',
  Task: '✅',
}

export function formatDue(due: string): string {
  if (!due) return ''
  if (due.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const d = new Date(due + 'T12:00:00')
    return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
  }
  return due
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function daysUntil(str: string): number | null {
  const m = String(str || '').toLowerCase().match(/([a-z]{3})[a-z]*\s+(\d{1,2})/)
  if (!m) return null
  const mi = MONTHS.indexOf(m[1])
  if (mi < 0) return null
  const today = new Date(2026, 5, 6)
  let d = new Date(2026, mi, parseInt(m[2], 10))
  if (d < today) d = new Date(2027, mi, parseInt(m[2], 10))
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

const STORE_KEY = 'propel-data'

export function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return (parsed[key] as T) ?? fallback
  } catch {
    return fallback
  }
}

export function saveStored(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    const existing = JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...existing, ...data }))
  } catch {}
}
