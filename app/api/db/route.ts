import { NextResponse } from 'next/server'
import { getAuthUser, loadAllData } from '@/lib/db'

export async function GET() {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  const data = await loadAllData(userId)
  return NextResponse.json(data)
}
