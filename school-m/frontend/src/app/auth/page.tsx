'use client'

import { useEffect, useState } from 'react'

type Mode = 'login' | 'signup' | 'forgot' | 'dashboard'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')

  const backend = 'http://127.0.0.1:8000/accounts'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('⏳ Sending...')

    let url = ''
    let payload: any = {}

    if (mode === 'signup') {
      url = `${backend}/signup/`
      payload = {
        username: form.username,
        email: form.email,
        password1: form.password,
        password2: form.password,
      }
    } else if (mode === 'login') {
      url = `${backend}/login/`
      payload = {
        username: form.username,
        password: form.password,
      }
    } else if (mode === 'forgot') {
      url = `${backend}/forgot-password/`
      payload = { email: form.email }
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Success')

        if (mode === 'login') {
          localStorage.setItem('access', data.access)
          setToken(data.access)
          setMode('dashboard')
        } else if (mode === 'signup') {
          setMode('login')
          setMessage('✅ Signup successful, please login')
        }
      } else {
        setMessage(data.detail || '❌ Failed')
      }
    } catch (err) {
      setMessage('❌ Error connecting to server')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access')
    setToken('')
    setForm({ username: '', email: '', password: '' })
    setMode('login')
    setMessage('✅ Logged out')
  }

  const fetchDashboard = async () => {
    const res = await fetch(`${backend}/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()

    if (res.ok) {
      setMessage(`👋 Welcome ${data.username} (${data.email})`)
    } else {
      setMessage('❌ Session expired or invalid token')
      handleLogout()
    }
  }

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (access) {
      setToken(access)
      setMode('dashboard')
    }
  }, [])

  useEffect(() => {
    if (mode === 'dashboard' && token) {
      fetchDashboard()
    }
  }, [mode, token])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-md mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-semibold capitalize mb-4 text-center">{mode}</h1>

        {mode !== 'dashboard' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {(mode === 'login' || mode === 'signup') && (
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            )}

            {(mode === 'signup' || mode === 'forgot') && (
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            )}

            {(mode === 'login' || mode === 'signup') && (
              <input
                name="password"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            )}

            <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
              {mode === 'login' ? 'Login' : mode === 'signup' ? 'Signup' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4">{message}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}

        {message && <p className="text-sm mt-3 text-center">{message}</p>}

        <div className="mt-4 flex justify-between text-sm text-blue-600">
          {mode !== 'login' && <span onClick={() => setMode('login')} className="cursor-pointer">🔐 Login</span>}
          {mode !== 'signup' && <span onClick={() => setMode('signup')} className="cursor-pointer">📝 Signup</span>}
          {mode !== 'forgot' && <span onClick={() => setMode('forgot')} className="cursor-pointer">🔑 Forgot?</span>}
        </div>
      </div>
    </div>
  )
}
