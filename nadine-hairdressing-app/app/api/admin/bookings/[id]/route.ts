import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/db'

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await req.json()
  if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Bad status' }, { status: 400 })
  await execute(`UPDATE bookings SET status = ?, updatedAt = datetime('now') WHERE id = ?`, [status, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await execute(`DELETE FROM bookings WHERE id = ?`, [id])
  return NextResponse.json({ ok: true })
}
