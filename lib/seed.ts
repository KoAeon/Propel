import type { Habit, Reminder, Task } from './types'

export const SEED_HABITS: Habit[] = [
  { id: 'med', glyph: '🧘', from: '#7C6BFF', to: '#A98BFF', name: 'Morning Meditation', meta: '10 min', streak: 21, done: true },
  { id: 'water', glyph: '💧', from: '#3FA9F5', to: '#5BD0E8', name: 'Drink 2L Water', meta: 'Daily', streak: 14, done: true },
  { id: 'steps', glyph: '👟', from: '#5B8DEF', to: '#9B6BFF', name: '10,000 Steps', meta: '7,420 today', streak: 6, done: false },
  { id: 'read', glyph: '📖', from: '#4FB477', to: '#7FD89B', name: 'Read 5 Pages', meta: 'Atomic Habits', streak: 9, done: false },
  { id: 'lang', glyph: '🗣️', from: '#E0716B', to: '#FF9D8A', name: 'Language · 10 min', meta: 'Spanish 🇪🇸', streak: 4, done: false },
  { id: 'sugar', glyph: '🚫', from: '#E0A93B', to: '#FF9D4D', name: 'No Sugar Day', meta: 'Diet goal', streak: 3, done: false },
  { id: 'journal', glyph: '✍️', from: '#6B8AFF', to: '#8FA9FF', name: 'Evening Journal', meta: 'Gratitude', streak: 12, done: false },
]

export const SEED_REMINDERS: Reminder[] = [
  { id: 'zara',   glyph: '🎂', title: "Zara's Birthday",        sub: 'Wed, Jun 11 · turning 12',  days: 4,  date: '2026-06-11', cat: 'Birthday'  },
  { id: 'car',    glyph: '🚗', title: 'Car Registration',        sub: 'Renewal due Jun 14',        days: 7,  date: '2026-06-14', cat: 'Renewal'   },
  { id: 'ins',    glyph: '🏠', title: 'Home Insurance',          sub: 'Renewal · Jun 28',          days: 21, date: '2026-06-28', cat: 'Renewal'   },
  { id: 'dental', glyph: '🦷', title: 'Dental Check-up',         sub: '6-month · Jun 30',          days: 23, date: '2026-06-30', cat: 'Health'    },
  { id: 'super',  glyph: '📈', title: 'Super Contribution',      sub: 'Before EOFY · Jun 30',      days: 23, date: '2026-06-30', cat: 'Financial' },
  { id: 'loan',   glyph: '🏦', title: 'Investment Loan Review',  sub: 'Compare rates · Sep 1',     days: 86, date: '2026-09-01', cat: 'Financial' },
]

export const SEED_TASKS: Task[] = [
  {
    id: 't1',
    title: "Plan Zara's birthday party",
    desc: 'Turning 12 on Jun 11. Backyard theme, ~10 friends. Book the cake, sort decorations and a small gift. Keep it relaxed.',
    status: 'Started', due: 'Jun 11', priority: 'High', pillar: 'Family & Connection',
    subs: [
      { t: 'Book the cake', done: true, due: 'Jun 8' },
      { t: 'Send invites', done: false, due: 'Jun 7' },
      { t: 'Buy decorations', done: false },
      { t: 'Pick up gift', done: false, due: 'Jun 10' },
    ],
  },
  {
    id: 't2',
    title: 'Lodge FY24–25 tax return',
    desc: 'Gather receipts, investment property statements and super contributions. Review with accountant before lodging.',
    status: 'Waiting', due: 'Jun 30', priority: 'High', pillar: 'Financial Freedom',
    subs: [
      { t: 'Collect receipts', done: true },
      { t: 'Property statements', done: false, due: 'Jun 20' },
      { t: 'Send to accountant', done: false, due: 'Jun 25' },
    ],
  },
  {
    id: 't3',
    title: 'Reach goal weight 70 kg',
    desc: 'Down from 74.2kg. Stay on the no-sugar days, 10k steps, and 4 exercise days a week.',
    status: 'Started', due: 'Dec 31', priority: 'Med', pillar: 'Health & Vitality',
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
    status: 'On Hold', due: 'Sep 1', priority: 'Med', pillar: 'Financial Freedom',
    subs: [
      { t: 'Compare 3 lenders', done: false },
      { t: 'Call broker', done: false },
    ],
  },
  {
    id: 't5',
    title: 'Finish Spanish A2 course',
    desc: '10 minutes every 2 days. Aim to finish the A2 module before the Gold Coast trip.',
    status: 'Started', due: 'Aug 30', priority: 'Low', pillar: 'Growth & Learning',
    subs: [
      { t: 'Unit 4', done: true },
      { t: 'Unit 5', done: false },
      { t: 'A2 review test', done: false },
    ],
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

const STORE_KEY = 'propel-proto-v3'

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
