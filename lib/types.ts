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
  date?: string
  time?: string
  cat: 'Renewal' | 'Birthday' | 'Financial' | 'Health' | 'Task'
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
  projectId?: string
  subs: Subtask[]
}

export type ProjectStatus = 'Active' | 'On Hold' | 'Completed'

export interface Project {
  id: string
  title: string
  desc: string
  status: ProjectStatus
  pillar: string
}

export type SheetType =
  | { type: 'quick' }
  | { type: 'reminder' }
  | { type: 'edit-reminder'; id: string }
  | { type: 'add-habit' }
  | { type: 'edit-habit'; id: string }
  | { type: 'add-task'; projectId?: string }
  | { type: 'task'; id: string }
  | { type: 'edit-task'; id: string }
  | { type: 'add-project' }
  | { type: 'edit-project'; id: string }
  | { type: 'add-person' }
  | { type: 'edit-person'; id: string }
  | { type: 'add-person-reminder'; personId: string }
  | { type: 'info'; message: string }
