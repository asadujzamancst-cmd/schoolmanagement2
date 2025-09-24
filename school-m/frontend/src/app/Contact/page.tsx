'use client'

import { useState, useEffect } from 'react'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const apiURL = 'http://127.0.0.1:8000/contacts/contacts/'

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    setLoading(true)
    try {
      const res = await fetch(apiURL)
      const data = await res.json()
      setContacts(data)
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({ name: '', email: '', phone: '', address: '' })
        fetchContacts()
      } else {
        alert('Failed to add contact')
      }
    } catch (error) {
      alert('Error adding contact')
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Contact
        </button>
      </form>
{/* 
      <h2 className="text-xl font-semibold mb-2">Contacts List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id} className="border p-2 mb-2 rounded">
              <p><strong>{contact.name}</strong></p>
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
              <p>{contact.address}</p>
            </li>
          ))}
        </ul>
      )} */}
    </main>
  )
}
