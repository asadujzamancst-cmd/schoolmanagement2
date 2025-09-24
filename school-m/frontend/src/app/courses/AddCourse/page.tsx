'use client'

import React, { useState } from 'react'

export default function AddCourse() {
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    duration: '',
    level: '',
    certificate: '',
    price: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://127.0.0.1:8000/course/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          instructor: formData.instructor,
          duration: parseInt(formData.duration),
          level: formData.level,
          certificate: formData.certificate,
          price: parseInt(formData.price),
          description: formData.description,
        }),
      })

      if (response.ok) {
        setMessage('Course added successfully!')
        setFormData({
          title: '',
          instructor: '',
          duration: '',
          level: '',
          certificate: '',
          price: '',
          description: '',
        })
      } else {
        const errorData = await response.json()
        setMessage('Error: ' + JSON.stringify(errorData))
      }
    } catch (error) {
      setMessage('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-gray-100
    ">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <input
          type="text"
          name="instructor"
          placeholder="Instructor"
          value={formData.instructor}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (hours)"
          value={formData.duration}
          onChange={handleChange}
          required
          min={0}
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <input
          type="text"
          name="level"
          placeholder="Level (e.g. Beginner)"
          value={formData.level}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <input
          type="text"
          name="certificate"
          placeholder="Certificate Type"
          value={formData.certificate}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <input
          type="number"
          name="price"
          placeholder="Price (USD)"
          value={formData.price}
          onChange={handleChange}
          required
          min={0}
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border border-gray-300 p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded
            hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </form>

      {message && (
        <p
          className="mt-4 text-center
          text-gray-900 dark:text-gray-100"
        >
          {message}
        </p>
      )}
    </div>
  )
}
