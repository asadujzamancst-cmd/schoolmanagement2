'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Teacher {
  teacher_id: number
  title: string
  teacher_name: string
  details: string
  image?: string | null
  password: string
}

export default function TeacherLoginDashboard() {
  const router = useRouter()
  const [teacherId, setTeacherId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [error, setError] = useState('')

  // ✅ Check localStorage on page load
  useEffect(() => {
    const savedTeacher = localStorage.getItem('teacher')
    if (savedTeacher) {
      setTeacher(JSON.parse(savedTeacher))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://127.0.0.1:8000/teacher/teacher/')
      const data: Teacher[] = await res.json()

      const matched = data.find(
        (t) =>
          t.teacher_id === Number(teacherId) &&
          t.password === password
      )

      if (matched) {
        setTeacher(matched)
        localStorage.setItem('teacher', JSON.stringify(matched)) // ✅ save to localStorage
      } else {
        setError('Invalid ID or Password ❌')
      }
    } catch (err) {
      setError('Server error ❌')
    }
  }

  const handleLogout = () => {
    setTeacher(null)
    setTeacherId('')
    setPassword('')
    localStorage.removeItem('teacher') // ✅ clear localStorage
  }

  // ✅ যদি লগইন সফল হয় → Dashboard দেখাবে
  if (teacher) {
    return (
      <div className="max-w-4xl mx-auto mt-20 px-4">
        {/* Top Bar with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            👋 Welcome, {teacher.teacher_name}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="cursor-pointer border border-red-500 hover:text-sky-700 hover:border-sky-700 p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
            onClick={() => router.push('/Staff_Dashbord/card')}
          >
            <h2 className="text-xl font-bold mb-2">STUDENT MANAGEMENT</h2>
            <p className="text-gray-600">Manage Student-related tasks here</p>
          </div>

          <div
            className="cursor-pointer border border-red-500 hover:text-sky-700 hover:border-sky-700 p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
            onClick={() => router.push('/Staff_Dashbord/card2')}
          >
            <h2 className="text-xl font-bold mb-2">PAYMENT MANAGEMENT</h2>
            <p className="text-gray-600">Manage staff-related tasks here</p>
          </div>

            



      <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card3')}
      >
        <h2 className="text-xl font-bold mb-2">COURSE MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>



      <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card4')}
      >
        <h2 className="text-xl font-bold mb-2">ATTENDANCE MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>



      <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card5')}
      >
        <h2 className="text-xl font-bold mb-2">EXAM MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>



      <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card6')}
      >
        <h2 className="text-xl font-bold mb-2">RESULT MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>


      <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card7')}
      >
        <h2 className="text-xl font-bold mb-2">LIBRARY MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>


      <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card8')}
      >
        <h2 className="text-xl font-bold mb-2">NOTICE MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>



          <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card9')}
      >
        <h2 className="text-xl font-bold mb-2">RESULT MANAGEMENT</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>


            <div
        className="cursor-pointer ml-2rem border border-red-500 hover:text-sky-700 hover:border-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/Staff_Dashbord/card10')}
      >
        <h2 className="text-xl font-bold mb-2">SEND NOTICE</h2>
        <p className="text-gray-600">Manage staff-related tasks here</p>
      </div>
        </div>
      </div>
    )
  }

  // ✅ Login form দেখাবে যদি এখনো লগইন না করা থাকে
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center">🔐 Teacher Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="number"
          placeholder="Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* ✅ Password field with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}
