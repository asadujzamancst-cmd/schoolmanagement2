'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface StudentResult {
  id: number;
  roll: string;
  name: string;
  semester: string;
  exam_title: string;
  subject: string;
  mark: number;
  total_mark: number;
  percentage: number;
}

export default function ResultListPage() {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [roll, setRoll] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [examTitle, setExamTitle] = useState('');

  const fetchResults = async () => {
    try {
      // Only send non-empty filters
      const params: Record<string, string> = {};
      if (roll) params.roll = roll;
      if (semester) params.semester = semester;
      if (subject) params.subject = subject;
      if (examTitle) params.exam_title = examTitle;

      const res = await axios.get<StudentResult[]>('http://127.0.0.1:8000/result/results/', { params });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const exportCSV = () => {
    if (!results.length) return;
    const headers = ['Roll', 'Name', 'Semester', 'Exam Title', 'Subject', 'Mark', 'Total Mark', 'Percentage'];
    const csvRows = [
      headers.join(','),
      ...results.map(r => [
        r.roll, r.name, r.semester, r.exam_title, r.subject, r.mark, r.total_mark, r.percentage.toFixed(2)
      ].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printResults = () => {
    const printWindow = window.open('', '', 'width=900,height=600');
    if (!printWindow) return;
    const html = `
      <html>
        <head>
          <title>Student Results</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Student Results</h2>
          <table>
            <thead>
              <tr>
                <th>Roll</th><th>Name</th><th>Semester</th><th>Exam Title</th>
                <th>Subject</th><th>Mark</th><th>Total Mark</th><th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${results.map(r => `
                <tr>
                  <td>${r.roll}</td><td>${r.name}</td><td>${r.semester}</td><td>${r.exam_title}</td>
                  <td>${r.subject}</td><td>${r.mark}</td><td>${r.total_mark}</td><td>${r.percentage.toFixed(2)}%</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 mt-20 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Results</h1>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={printResults}
              className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              Print
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            placeholder="Roll"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="flex-1 border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />
          <input
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="flex-1 border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />
          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />
          <input
            placeholder="Exam Title"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="flex-1 border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />
          <button
            onClick={fetchResults}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 dark:border-gray-600 min-w-[700px]">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <th className="border px-2 py-1">Roll</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Semester</th>
                <th className="border px-2 py-1">Exam Title</th>
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Mark</th>
                <th className="border px-2 py-1">Total Mark</th>
                <th className="border px-2 py-1">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((res) => (
                  <tr key={res.id} className="odd:bg-gray-50 even:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="border px-2 py-1">{res.roll}</td>
                    <td className="border px-2 py-1">{res.name}</td>
                    <td className="border px-2 py-1">{res.semester}</td>
                    <td className="border px-2 py-1">{res.exam_title}</td>
                    <td className="border px-2 py-1">{res.subject}</td>
                    <td className="border px-2 py-1">{res.mark}</td>
                    <td className="border px-2 py-1">{res.total_mark}</td>
                    <td className="border px-2 py-1">{res.percentage.toFixed(2)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-700 dark:text-gray-300">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
