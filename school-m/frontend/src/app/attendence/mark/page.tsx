'use client';

import React, { useEffect, useState } from 'react';

interface Student {
  id: number;
  student_id: string;
  name: string;
  department: string;
  year: number;
  email: string;
}

interface AttendanceEntry {
  student: number;
  status: 'Present' | 'Absent';
  date: string;
}

const AttendanceMarkPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, 'Present' | 'Absent'>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // ✅ Fetch students
  useEffect(() => {
    fetch('http://127.0.0.1:8000/payment/students/')
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(() => setMessage('❌ Failed to load students.'));
  }, []);

  // ✅ Handle status click
  const handleStatusClick = (studentId: number, status: 'Present' | 'Absent') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // ✅ Submit attendance
  const handleSubmit = async () => {
    setMessage('Submitting...');

    const payload: AttendanceEntry[] = Object.entries(attendance).map(
      ([studentId, status]) => ({
        student: Number(studentId),
        status,
        date,
      })
    );

    try {
      for (let entry of payload) {
        await fetch('http://127.0.0.1:8000/attendance/attendance/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }
      setMessage('✅ Attendance submitted!');
    } catch {
      setMessage('❌ Failed to submit attendance.');
    }
  };

  // ✅ Filter students
  const filteredStudents = students.filter((stu) => {
    return (
      (!departmentFilter || stu.department.toLowerCase() === departmentFilter.toLowerCase()) &&
      (!yearFilter || stu.year.toString() === yearFilter)
    );
  });

  return (
    <div className="max-w-5xl mx-auto mt-20 p-6 bg-white dark:bg-gray-900 text-black dark:text-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">📅 Mark Attendance</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">📆 Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">🏢 Department</label>
          <input
            type="text"
            placeholder="e.g. CSE"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">📚 Year</label>
          <input
            type="number"
            placeholder="e.g. 2"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border table-auto mb-6">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2 text-left">Student</th>
            <th className="border px-4 py-2 text-center">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((stu) => (
              <tr key={stu.id}>
                <td className="border px-4 py-2">
                  {stu.name} ({stu.student_id}) — {stu.department}, Year {stu.year}
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleStatusClick(stu.id, 'Present')}
                      className={`px-4 py-1 rounded ${
                        attendance[stu.id] === 'Present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      ✅ Present
                    </button>
                    <button
                      onClick={() => handleStatusClick(stu.id, 'Absent')}
                      className={`px-4 py-1 rounded ${
                        attendance[stu.id] === 'Absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      ❌ Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center py-4">
                ❌ No students found for selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        ✅ Submit Attendance
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default AttendanceMarkPage;
