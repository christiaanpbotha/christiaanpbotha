import { createClient, type Client, type InArgs } from '@libsql/client'
import fs from 'fs'
import path from 'path'

let _client: Client | null = null
let _ready: Promise<void> | null = null

function getClient(): Client {
  if (!_client) {
    const url = process.env.TURSO_DATABASE_URL || 'file:./data/booking.db'
    if (url.startsWith('file:')) {
      fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true })
    }
    _client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return _client
}

async function initSchema(): Promise<void> {
  const c = getClient()

  await c.batch(
    [
      `CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        ref TEXT NOT NULL UNIQUE,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        minutes INTEGER NOT NULL,
        serviceId TEXT NOT NULL,
        serviceName TEXT NOT NULL,
        price INTEGER NOT NULL,
        priceFrom INTEGER NOT NULL DEFAULT 0,
        discounted INTEGER NOT NULL DEFAULT 0,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        notes TEXT,
        extra TEXT NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ],
    'write'
  )

  // Column migrations — always run migrations BEFORE adding indexes on new columns
  const info = await c.execute('PRAGMA table_info(bookings)')
  const cols = info.rows.map((r) => r[1] as string)

  const migrations: [string, string][] = [
    // ['newColumn', 'TEXT'],
  ]

  for (const [col, def] of migrations) {
    if (!cols.includes(col)) {
      await c.execute({ sql: `ALTER TABLE bookings ADD COLUMN ${col} ${def}`, args: [] })
    }
  }

  await c.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date, time)`)
}

async function ready(): Promise<Client> {
  if (!_ready) _ready = initSchema().catch((err) => { _ready = null; throw err })
  await _ready
  return getClient()
}

function toObj(row: Record<string | number, unknown>, columns: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  for (const col of columns) obj[col] = row[col]
  return obj
}

export async function query<T = Record<string, unknown>>(sql: string, args: InArgs = []): Promise<T[]> {
  const c = await ready()
  const result = await c.execute({ sql, args })
  return result.rows.map((row) => toObj(row as Record<string | number, unknown>, result.columns) as T)
}

export async function queryOne<T = Record<string, unknown>>(sql: string, args: InArgs = []): Promise<T | null> {
  const rows = await query<T>(sql, args)
  return rows[0] ?? null
}

export async function execute(sql: string, args: InArgs = []): Promise<void> {
  const c = await ready()
  await c.execute({ sql, args })
}

export type Booking = {
  id: string
  ref: string
  date: string
  time: string
  minutes: number
  serviceId: string
  serviceName: string
  price: number
  priceFrom: number
  discounted: number
  name: string
  phone: string
  email: string | null
  notes: string | null
  extra: string // JSON of EXTRA_FIELDS answers
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  createdAt: string
}

export const ACTIVE_STATUSES = `('pending','confirmed','completed')`
