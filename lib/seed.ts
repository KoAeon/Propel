import type { Habit, Reminder, Task, Project } from './types'
import type { Person } from './people'

export const SEED_HABITS: Habit[] = [
  { id: 'med', glyph: '🧘', from: '#7C6BFF', to: '#A98BFF', name: 'Morning Meditation', meta: '10 min', streak: 21, done: true },
  { id: 'water', glyph: '💧', from: '#3FA9F5', to: '#5BD0E8', name: 'Drink 2L Water', meta: 'Daily', streak: 14, done: true },
  { id: 'steps', glyph: '👟', from: '#5B8DEF', to: '#9B6BFF', name: '10,000 Steps', meta: '7,420 today', streak: 6, done: false },
  { id: 'read', glyph: '📖', from: '#4FB477', to: '#7FD89B', name: 'Read 5 Pages', meta: 'Atomic Habits', streak: 9, done: false },
  { id: 'lang', glyph: '🗣️', from: '#E0716B', to: '#FF9D8A', name: 'Language · 10 min', meta: 'Spanish 🇪🇸', streak: 4, done: false },
  { id: 'sugar', glyph: '🚫', from: '#E0A93B', to: '#FF9D4D', name: 'No Sugar Day', meta: 'Diet goal', streak: 3, done: false },
  { id: 'journal', glyph: '✍️', from: '#6B8AFF', to: '#8FA9FF', name: 'Evening Journal', meta: 'Gratitude', streak: 12, done: false },
]

export const SEED_REMINDERS: Reminder[] = []

export const SEED_PROJECTS: Project[] = [
  { id: 'proj1', title: "Zara's Birthday Party", desc: 'Backyard theme, ~10 friends. Jun 11.', status: 'Active', pillar: 'Family & Connection' },
  { id: 'proj2', title: 'FY24-25 Tax Return', desc: 'Lodge with accountant before Jun 30.', status: 'Active', pillar: 'Financial Freedom' },
  { id: 'proj3', title: 'Reach Goal Weight 70kg', desc: 'Down from 74.2kg by Dec 31.', status: 'Active', pillar: 'Health & Vitality' },
]

export const SEED_TASKS: Task[] = [
  {
    id: 't1', projectId: 'proj1',
    title: "Plan Zara's birthday party",
    desc: 'Turning 12 on Jun 11. Backyard theme, ~10 friends. Book the cake, sort decorations and a small gift. Keep it relaxed.',
    status: 'Started', due: '2026-06-11', priority: 'High', pillar: 'Family & Connection',
    subs: [
      { t: 'Book the cake', done: true, due: '2026-06-08' },
      { t: 'Send invites', done: false, due: '2026-06-07' },
      { t: 'Buy decorations', done: false },
      { t: 'Pick up gift', done: false, due: '2026-06-10' },
    ],
  },
  {
    id: 't2', projectId: 'proj2',
    title: 'Lodge FY24–25 tax return',
    desc: 'Gather receipts, investment property statements and super contributions. Review with accountant before lodging.',
    status: 'Waiting', due: '2026-06-30', priority: 'High', pillar: 'Financial Freedom',
    subs: [
      { t: 'Collect receipts', done: true },
      { t: 'Property statements', done: false, due: '2026-06-20' },
      { t: 'Send to accountant', done: false, due: '2026-06-25' },
    ],
  },
  {
    id: 't3', projectId: 'proj3',
    title: 'Reach goal weight 70 kg',
    desc: 'Down from 74.2kg. Stay on the no-sugar days, 10k steps, and 4 exercise days a week.',
    status: 'Started', due: '2026-12-31', priority: 'Med', pillar: 'Health & Vitality',
    subs: [
      { t: 'Hit 10k steps daily', done: false },
      { t: '4 workouts / week', done: true },
      { t: 'No-sugar weekdays', done: false },
    ],
  },
  {
    id: 't4',
    title: 'Review investment loan rates',
    desc: 'Compare current rate against market. Call broker about refinancing the Marina Court loan.',
    status: 'On Hold', due: '2026-09-01', priority: 'Med', pillar: 'Financial Freedom',
    subs: [
      { t: 'Compare 3 lenders', done: false },
      { t: 'Call broker', done: false },
    ],
  },
  {
    id: 't5',
    title: 'Finish Spanish A2 course',
    desc: '10 minutes every 2 days. Aim to finish the A2 module before the Gold Coast trip.',
    status: 'Started', due: '2026-08-30', priority: 'Low', pillar: 'Growth & Learning',
    subs: [
      { t: 'Unit 4', done: true },
      { t: 'Unit 5', done: false },
      { t: 'A2 review test', done: false },
    ],
  },
]

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

export const REMINDER_CATS = ['All', 'Renewal', 'Birthday', 'Financial', 'Health'] as const

export const CAT_GLYPH: Record<string, string> = {
  Renewal: '🔄',
  Birthday: '🎂',
  Financial: '💰',
  Health: '🩺',
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

const STORE_KEY = 'propel-proto-v5'

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
