'use client'

import React, { useEffect, useState } from 'react'

interface Question {
  id: number
  text: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_answer: string
}

interface Exam {
  id: number
  title: string
}

interface Result {
  id: number
  name: string
  exam: number | string
  score: number
  submitted_at: string
}

export default function ExamPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [studentName, setStudentName] = useState('')
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/exams/exams/')
      .then(res => res.json())
      .then(data => setExams(data))
      .catch(err => console.error('Failed to load exams', err))
  }, [])

  useEffect(() => {
    if (selectedExamId) {
      fetch(`http://127.0.0.1:8000/exams/questions/?exam_id=${selectedExamId}`)
        .then(res => res.json())
        .then(data => {
          setQuestions(data)
          setTimeLeft(60 * 5)
          setTimerActive(true)
        })
        .catch(err => console.error('Failed to load questions', err))
    } else {
      setQuestions([])
    }
  }, [selectedExamId])

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(interval)
    } else if (timeLeft === 0 && timerActive) {
      alert('⏰ Time is up! Submitting automatically.')
      handleSubmit()
    }
  }, [timeLeft, timerActive])

  const handleSubmit = async () => {
    if (!studentName.trim() || !selectedExamId) {
      alert('Please enter your name and select an exam.')
      return
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/exams/submit-exam/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName, exam_id: selectedExamId, answers }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(`❌ Submit failed: ${errorData.error || 'Unknown error'}`)
        return
      }

      const data = await res.json()
      alert(`✅ Submitted! Your score: ${data.score}`)
      setSubmitted(true)
      setTimerActive(false)
      fetchResults()
    } catch (error) {
      alert('❌ Submission error. Check console for details.')
      console.error(error)
    }
  }

  const fetchResults = () => {
    setLoading(true)
    fetch(`http://127.0.0.1:8000/exams/results/?student_name=${encodeURIComponent(studentName)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error('Failed to fetch results', err))
      .finally(() => setLoading(false))
  }

  const exportCSV = () => {
    if (results.length === 0) {
      alert('No results to export.')
      return
    }

    const headers = ['Name', 'Exam', 'Score', 'Date']
    const rows = results.map(r => [
      r.name,
      r.exam,
      r.score.toString(),
      new Date(r.submitted_at).toLocaleString(),
    ])

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printContents = document.getElementById('results-table')?.outerHTML
    if (printContents) {
      const newWindow = window.open('', '', 'width=800,height=600')
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Print Results</title></head>
            <body>
              <h2>Student Exam Results</h2>
              ${printContents}
            </body>
          </html>
        `)
        newWindow.document.close()
        newWindow.print()
        newWindow.close()
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="p-6 max-w-3xl mx-auto mt-20 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📝 Online Exam</h1>

      <div className="mb-4">
        <label className="font-semibold block mb-1">👤 Student Name</label>
        <input
          className="w-full p-2 border rounded"
          placeholder="Enter your name"
          value={studentName}
          onChange={e => setStudentName(e.target.value)}
          disabled={submitted}
        />
      </div>

      <div className="mb-6">
        <label className="font-semibold block mb-1">📚 Select Exam</label>
        <select
          className="w-full p-2 border rounded dark:text-green-600"
          value={selectedExamId ?? ''}
          onChange={e => setSelectedExamId(Number(e.target.value))}
          disabled={submitted}
        >
          <option value="">-- Select an exam --</option>
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>{exam.title}</option>
          ))}
        </select>
      </div>

      {questions.length > 0 && !submitted && (
        <>
          <div className="mb-4 text-right text-lg font-semibold text-red-600">
            ⏳ Time Left: {formatTime(timeLeft)}
          </div>
          <h2 className="text-xl font-semibold mb-4">📖 Questions</h2>
          {questions.map((q, i) => (
            <div key={q.id} className="mb-6">
              <p className="font-semibold">{i + 1}. {q.text}</p>
              {[q.option1, q.option2, q.option3, q.option4].map((opt, index) => (
                <label key={`${q.id}-${index}`} className="block">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            ✅ Submit Exam
          </button>
        </>
      )}

      {submitted && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">📊 Results</h2>
          <div className="mb-4 flex gap-2">
            <button onClick={exportCSV} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              ⬇️ Export CSV
            </button>
            <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              🖨️ Print
            </button>
          </div>
          <table id="results-table" className="w-full border border-collapse">
            <thead className="bg-gray-200 dark:bg-green-800">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Exam</th>
                <th className="border p-2 text-left">Score</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? results.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.name}</td>
                  <td className="border p-2">{r.exam}</td>
                  <td className="border p-2">{r.score}</td>
                  <td className="border p-2">{new Date(r.submitted_at).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="text-center p-4">No results yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
