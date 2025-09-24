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
  exam: number
}

interface Exam {
  id: number
  title: string
}

export default function ExamManagementPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [examTitle, setExamTitle] = useState('')
  const [editingExamId, setEditingExamId] = useState<number | null>(null)

  const [questions, setQuestions] = useState<Question[]>([])
  const [questionForm, setQuestionForm] = useState<Omit<Question, 'id'>>({
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: '',
    exam: 0,
  })
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    if (selectedExamId) {
      fetchQuestions(selectedExamId)
      resetQuestionForm(selectedExamId)
    } else {
      setQuestions([])
      resetQuestionForm(0)
    }
  }, [selectedExamId])

  const resetQuestionForm = (examId: number) => {
    setQuestionForm({
      text: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct_answer: '',
      exam: examId,
    })
    setEditingQuestionId(null)
  }

  const fetchExams = async () => {
    const res = await fetch('http://127.0.0.1:8000/exams/exams/')
    const data = await res.json()
    setExams(data)
  }

  const fetchQuestions = async (examId: number) => {
    const res = await fetch(`http://127.0.0.1:8000/exams/questions/?exam_id=${examId}`)
    const data = await res.json()
    setQuestions(data)
  }

  const handleExamSubmit = async () => {
    const url = editingExamId
      ? `http://127.0.0.1:8000/exams/exams/${editingExamId}/`
      : 'http://127.0.0.1:8000/exams/exams/'
    const method = editingExamId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: examTitle }),
    })
    setExamTitle('')
    setEditingExamId(null)
    fetchExams()
  }

  const handleEditExam = (exam: Exam) => {
    setExamTitle(exam.title)
    setEditingExamId(exam.id)
  }

  const handleDeleteExam = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/exams/exams/${id}/`, { method: 'DELETE' })
    if (selectedExamId === id) setSelectedExamId(null)
    fetchExams()
  }

  const handleQuestionSubmit = async () => {
    if (!selectedExamId) {
      alert('Please select an exam first.')
      return
    }

    const payload = {
      ...questionForm,
      exam: selectedExamId,
    }

    const url = editingQuestionId
      ? `http://127.0.0.1:8000/exams/questions/${editingQuestionId}/`
      : 'http://127.0.0.1:8000/exams/questions/'
    const method = editingQuestionId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    resetQuestionForm(selectedExamId)
    fetchQuestions(selectedExamId)
  }

  const handleEditQuestion = (question: Question) => {
    const { id, ...formWithoutId } = question
    setQuestionForm({ ...formWithoutId, exam: selectedExamId! })
    setEditingQuestionId(id)
  }

  const handleDeleteQuestion = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/exams/questions/${id}/`, { method: 'DELETE' })
    fetchQuestions(selectedExamId!)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20 text-black dark:text-green-300">
      <h1 className="text-3xl font-bold mb-6">🛠️ Exam Management</h1>

      {/* Exam Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📚 Add/Edit Exam</h2>
        <input
          className="p-2 border rounded w-full mb-2"
          placeholder="Exam title"
          value={examTitle}
          onChange={e => setExamTitle(e.target.value)}
        />
        <button
          onClick={handleExamSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingExamId ? 'Update Exam' : 'Add Exam'}
        </button>
      </div>

      {/* Exam List */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📃 All Exams</h2>
        {exams.map(exam => (
          <div key={exam.id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{exam.title}</span>
            <div className="space-x-2">
              <button onClick={() => setSelectedExamId(exam.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Manage</button>
              <button onClick={() => handleEditExam(exam)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Question Form */}
      {selectedExamId && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">✍️ Add/Edit Question</h2>
          <input
            className="p-2 border w-full mb-2"
            placeholder="Question Text"
            value={questionForm.text}
            onChange={e => setQuestionForm(p => ({ ...p, text: e.target.value }))}
          />
          {[1, 2, 3, 4].map(i => (
            <input
              key={i}
              className="p-2 border w-full mb-2"
              placeholder={`Option ${i}`}
              value={questionForm[`option${i}` as keyof typeof questionForm]}
              onChange={e => setQuestionForm(p => ({ ...p, [`option${i}`]: e.target.value }))}
            />
          ))}
          <select
            className="p-2 border w-full mb-4"
            value={questionForm.correct_answer}
            onChange={e => setQuestionForm(p => ({ ...p, correct_answer: e.target.value }))}
          >
            <option value="">Select Correct Answer</option>
            <option value={questionForm.option1}>Option 1</option>
            <option value={questionForm.option2}>Option 2</option>
            <option value={questionForm.option3}>Option 3</option>
            <option value={questionForm.option4}>Option 4</option>
          </select>
          <button
            onClick={handleQuestionSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingQuestionId ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      )}

      {/* Question List */}
      {questions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">📖 Questions for Selected Exam</h2>
          {questions.map(q => (
            <div key={q.id} className="border p-2 mb-2">
              <p className="font-semibold mb-1">{q.text}</p>
              <ul className="mb-1 list-disc pl-5">
                {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p className="mb-2 text-sm text-green-700">✅ Correct Answer: {q.correct_answer}</p>
              <button
                onClick={() => handleEditQuestion(q)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteQuestion(q.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
