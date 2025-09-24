'use client';

import React, { useEffect, useState } from 'react';

// Interfaces
interface Student {
  id: number;
  student_id: string;
  name: string;
  department: string;
  semester: string;
  email: string;
}

interface Attendance {
  id: number;
  date: string;
  status: string;
  student: number;
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filtered, setFiltered] = useState<Attendance[]>([]);
  const [studentId, setStudentId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Fetch attendance and students
  useEffect(() => {
    fetch('http://127.0.0.1:8000/attendance/attendance/')
      .then(res => res.json())
      .then(setAttendance)
      .catch(() => console.error('Failed to load attendance'));

    fetch('http://127.0.0.1:8000/payment/students/')
      .then(res => res.json())
      .then(setStudents)
      .catch(() => console.error('Failed to load students'));
  }, []);

  const handleSearch = () => {
    const matchedStudent = students.find((s) => s.student_id === studentId);
    if (!matchedStudent) {
      setFiltered([]);
      return;
    }

    let result = attendance.filter((a) => a.student === matchedStudent.id);

    // Filter by date range
    if (fromDate) {
      result = result.filter((a) => new Date(a.date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter((a) => new Date(a.date) <= new Date(toDate));
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = [
      ['Student ID', 'Name', 'Date', 'Status'],
      ...filtered.map((a) => {
        const student = students.find((s) => s.id === a.student);
        return [student?.student_id || '', student?.name || '', a.date, a.status];
      }),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'attendance.csv';
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6 bg-white dark:bg-gray-900 dark:text-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 print:hidden">📋 Attendance Records</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 print:hidden">
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 Search
        </button>
      </div>

      {/* Export & Print */}
      <div className="flex gap-2 mb-4 print:hidden">
        <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
          📤 Export CSV
        </button>
        <button onClick={handlePrint} className="bg-yellow-600 text-white px-4 py-2 rounded">
          🖨️ Print
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border px-4 py-2">Student ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((entry) => {
                const student = students.find((s) => s.id === entry.student);
                return (
                  <tr key={entry.id}>
                    <td className="border px-4 py-2">{student?.student_id}</td>
                    <td className="border px-4 py-2">{student?.name}</td>
                    <td className="border px-4 py-2">{entry.date}</td>
                    <td className="border px-4 py-2">{entry.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-4 flex justify-between items-center print:hidden">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
