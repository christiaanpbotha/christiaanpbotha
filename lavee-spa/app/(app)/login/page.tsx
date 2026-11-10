'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-full max-w-sm p-8 rounded-th"
        style={{ backgroundColor: 'var(--th-card)', border: '1px solid var(--th-border)' }}
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-wide">Sign in</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--th-text-muted)' }}>
            Staff only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-3 py-2 rounded-th text-sm outline-none transition-colors"
              style={{ border: '1px solid var(--th-border)' }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--th-danger)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-th text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
