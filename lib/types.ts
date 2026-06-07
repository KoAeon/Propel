export interface Habit {
  id: string
  glyph: string
  from: string
  to: string
  name: string
  meta: string
  streak: number
  done: boolean
}

export interface Reminder {
  id: string
  glyph: string
  title: string
  sub: string
  days: number
  cat: 'Renewal' | 'Birthday' | 'Financial' | 'Health'
  gcalEventId?: string
}

export interface Subtask {
  t: string
  done: boolean
  due?: string
}

export type TaskStatus = 'Not Started' | 'Started' | 'On Hold' | 'Waiting' | 'Completed'
export type TaskPriority = 'High' | 'Med' | 'Low'

export interface Task {
  id: string
  title: string
  desc: string
  status: TaskStatus
  due: string
  priority: TaskPriority
  pillar: string
  subs: Subtask[]
}

export type SheetType =
  | { type: 'quick' }
  | { type: 'reminder' }
  | { type: 'task'; id: string }
  | { type: 'info'; message: string }
