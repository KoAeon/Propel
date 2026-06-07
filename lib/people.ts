export type ReminderFreq = 'One-off' | 'Weekly' | 'Monthly' | 'Every 3 months' | 'Every 6 months' | 'Yearly'
export type Relationship = 'Family' | 'Friend' | 'Colleague' | 'Partner' | 'Other'

export interface PersonReminder {
  id: string
  label: string
  date?: string
  freq: ReminderFreq
}

export interface Person {
  id: string
  name: string
  relationship: Relationship
  phone?: string
  email?: string
  dob?: string
  photo?: string
  notes?: string
  reminders: PersonReminder[]
}
