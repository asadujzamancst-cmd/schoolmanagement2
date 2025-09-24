'use client'

import React, { useEffect, useState } from 'react'

interface Student {
  id: number
  student_id: string
  name: string
  email: string
  Phone_number: number
  department: string
  year: number
  college: string
}

export default function SendNoticePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([])

  const [studentId, setStudentId] = useState('')
  const [subject1, setSubject1] = useState('')
  const [message1, setMessage1] = useState('')
  const [status1, setStatus1] = useState('')

  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [subject2, setSubject2] = useState('')
  const [message2, setMessage2] = useState('')
  const [status2, setStatus2] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/payment/students/')
        const data = await res.json()
        setStudents(data)
      } catch (err) {
        console.error('Failed to fetch students:', err)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    const filtered = students.filter(
      (s) =>
        s.department.toLowerCase() === department.toLowerCase() &&
        s.year.toString() === year.toString()
    )
    setFilteredStudents(filtered)
  }, [department, year, students])

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id))
    }
  }

  const handleCheckboxChange = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus1('Sending...')
    try {
      const res = await fetch('http://127.0.0.1:8000/notice/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, subject: subject1, message: message1 }),
      })
      if (res.ok) {
        setStatus1('✅ Notice sent to student.')
        setStudentId('')
        setSubject1('')
        setMessage1('')
      } else {
        const err = await res.json()
        setStatus1('❌ Error: ' + JSON.stringify(err))
      }
    } catch {
      setStatus1('❌ Failed to send notice.')
    }
  }

  const handleMultiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus2('Sending...')
    try {
      const res = await fetch('http://127.0.0.1:8000/notice/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          year,
          subject: subject2,
          message: message2,
        }),
      })
      if (res.ok) {
        setStatus2('✅ Notice sent to filtered students.')
        setDepartment('')
        setYear('')
        setSubject2('')
        setMessage2('')
        setSelectedStudentIds([])
      } else {
        const err = await res.json()
        setStatus2('❌ Error: ' + JSON.stringify(err))
      }
    } catch {
      setStatus2('❌ Failed to send notice.')
    }
  }

  const matchedStudent = students.find((s) => s.student_id === studentId)

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 rounded shadow bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">📢 Send Notice</h1>

      {/* Single Student */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Send to Single Student</h2>
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            required
          />
          {studentId && (
            <p className="text-sm text-gray-400">
              Name: {matchedStudent ? matchedStudent.name : '❌ Not Found'}
            </p>
          )}
          <input
            type="text"
            placeholder="Subject"
            value={subject1}
            onChange={(e) => setSubject1(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            required
          />
          <textarea
            placeholder="Message"
            value={message1}
            onChange={(e) => setMessage1(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            rows={4}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send Notice
          </button>
          {status1 && <p className="text-sm mt-2">{status1}</p>}
        </form>
      </section>

      <hr className="border-gray-400 my-6" />

      {/* Multiple Students */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Send to Multiple Students (by Department & Year)</h2>
        <form onSubmit={handleMultiSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              required
            />
          </div>

          <div className="border p-2 rounded dark:border-gray-600 max-h-48 overflow-y-auto">
            <label className="block mb-2">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                className="mr-2"
              />
              Select All
            </label>
            {filteredStudents.map((student) => (
              <label key={student.id} className="block text-sm">
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(student.id)}
                  onChange={() => handleCheckboxChange(student.id)}
                  className="mr-2"
                />
                {student.name} ({student.student_id}) - {student.department} - Year {student.year}
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={subject2}
            onChange={(e) => setSubject2(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            required
          />
          <textarea
            placeholder="Message"
            value={message2}
            onChange={(e) => setMessage2(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            rows={4}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Send Notice
          </button>
          {status2 && <p className="text-sm mt-2">{status2}</p>}
        </form>
      </section>
    </div>
  )
}
