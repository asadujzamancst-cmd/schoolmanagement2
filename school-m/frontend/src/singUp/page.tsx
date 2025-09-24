'use client'

import { useState } from 'react'

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password1: '', password2: '' })
  const [msg, setMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('http://127.0.0.1:8000/accounts/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setMsg(res.ok ? '✅ Account created' : '❌ Failed to signup')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded p-6">
      <h1 className="text-xl font-semibold mb-4">⭐ Sign Up</h1>
      <input name="username" placeholder="Username" onChange={handleChange} required className="input" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="input" />
      <input name="password1" type="password" placeholder="Password" onChange={handleChange} required className="input" />
      <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} required className="input" />
      <button className="btn">Register</button>
      {msg && <p className="mt-2 text-sm text-center">{msg}</p>}
    </form>
  )
}
