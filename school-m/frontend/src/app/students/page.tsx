'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  student_id: string;
  name: string;
  Phone_number: number;
  department: string;
  year: number;
  email: string;
  college: string;
  password: string;
  img?: string | null;
}

interface Attendance {
  id: number;
  date: string;
  status: 'Present' | 'Absent';
  student: number;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function StudentPortal() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchId, setSearchId] = useState('');
  const [searchPassword, setSearchPassword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [filterDate, setFilterDate] = useState('');

  const [monthlySummary, setMonthlySummary] = useState<
    { month: string; present: number; absent: number }[]
  >([]);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [currentPasswordCheck, setCurrentPasswordCheck] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // fetch all students
  useEffect(() => {
    fetch(`${API_BASE_URL}/payment/students/`)
      .then(res => res.json())
      .then((data: Student[]) => setStudents(data))
      .catch(err => console.error('Error fetching students:', err));
  }, []);

  // login
  const handleSearch = async () => {
    const found = students.find(
      s => s.student_id === searchId.trim() && s.password === searchPassword.trim()
    );
    if (!found) {
      alert('No student found with that ID and password!');
      setSelectedStudent(null);
      return;
    }
    setSelectedStudent(found);

    try {
      // attendance fetch
      const res = await fetch(`${API_BASE_URL}/attendance/attendance/`);
      const data: Attendance[] = await res.json();
      const myAttendance = data.filter(a => a.student === found.id);
      setAttendances(myAttendance);
      setFilteredAttendances(myAttendance);
      generateMonthlySummary(myAttendance);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }

    setIsUpdatingPassword(false);
    setCurrentPasswordCheck('');
    setNewPassword('');
  };

  // filter by date
  const handleFilter = () => {
    if (!filterDate) {
      setFilteredAttendances(attendances);
    } else {
      setFilteredAttendances(attendances.filter(a => a.date === filterDate));
    }
  };

  const handleReset = () => {
    setFilterDate('');
    setFilteredAttendances(attendances);
  };

  // monthly summary
  const generateMonthlySummary = (records: Attendance[]) => {
    const summary: { [key: string]: { present: number; absent: number } } = {};

    records.forEach(a => {
      const month = new Date(a.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!summary[month]) summary[month] = { present: 0, absent: 0 };
      if (a.status === 'Present') summary[month].present++;
      else summary[month].absent++;
    });

    const result = Object.entries(summary).map(([month, values]) => ({
      month,
      present: values.present,
      absent: values.absent,
    }));

    setMonthlySummary(result);
  };

  // password update
  const handleStartUpdate = () => {
    setIsUpdatingPassword(true);
    setCurrentPasswordCheck('');
    setNewPassword('');
  };

  const handleCancelUpdate = () => {
    setIsUpdatingPassword(false);
    setCurrentPasswordCheck('');
    setNewPassword('');
  };

  const handleSavePassword = async () => {
    if (!selectedStudent) return;

    if (currentPasswordCheck.trim() !== selectedStudent.password) {
      alert('❌ Current password is incorrect!');
      return;
    }

    if (newPassword.trim() === '') {
      alert('New password cannot be empty!');
      return;
    }

    const updatedStudent = {
      student_id: selectedStudent.student_id,
      name: selectedStudent.name,
      Phone_number: selectedStudent.Phone_number,
      department: selectedStudent.department,
      year: selectedStudent.year,
      email: selectedStudent.email,
      college: selectedStudent.college,
      password: newPassword,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/payment/students/${selectedStudent.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });

      if (res.ok) {
        alert('✅ Password updated successfully!');
        const refreshed = await fetch(`${API_BASE_URL}/payment/students/`);
        const refreshedData: Student[] = await refreshed.json();
        setStudents(refreshedData);
        setSelectedStudent({ ...selectedStudent, password: newPassword });
        setIsUpdatingPassword(false);
        setCurrentPasswordCheck('');
        setNewPassword('');
      } else {
        const errorText = await res.text();
        console.error('Failed to update password:', errorText);
        alert('❌ Failed to update password.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Network error.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded shadow relative">
      <h1 className="text-2xl font-bold mb-4 text-center">🎓 Student Portal</h1>

      <button
        onClick={handleBack}
        className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black px-2 py-1"
        aria-label="Go Back"
      >
        ✖
      </button>

      {/* login form */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter your Student ID"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800"
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={searchPassword}
          onChange={e => setSearchPassword(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login & View
        </button>
      </div>

      {selectedStudent ? (
        <div className="border rounded p-4 dark:border-gray-700 text-center">
          <h2 className="text-lg font-semibold mb-2">👤 {selectedStudent.name}</h2>

          {selectedStudent.img ? (
            <img
              src={selectedStudent.img}
              alt={selectedStudent.name}
              className="mx-auto mb-4 rounded w-32 h-32 object-cover cursor-pointer hover:opacity-80"
              onClick={() => setModalImageUrl(selectedStudent.img!)}
            />
          ) : (
            <p className="mb-4 text-gray-500">No profile image available.</p>
          )}

          {/* student info */}
          <p><strong>ID:</strong> {selectedStudent.student_id}</p>
          <p><strong>Phone:</strong> {selectedStudent.Phone_number}</p>
          <p><strong>Department:</strong> {selectedStudent.department}</p>
          <p><strong>Year:</strong> {selectedStudent.year}</p>
          <p><strong>Email:</strong> {selectedStudent.email}</p>
          <p><strong>College:</strong> {selectedStudent.college}</p>

          {/* monthly attendance summary */}
          <div className="mt-8 text-left">
            <h3 className="font-semibold mb-2 text-lg">📊 Monthly Attendance Summary</h3>
            {monthlySummary.length > 0 ? (
              <table className="w-full border border-gray-300 dark:border-gray-700 mb-6">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border px-3 py-2">Month</th>
                    <th className="border px-3 py-2">Present</th>
                    <th className="border px-3 py-2">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummary.map((m, idx) => (
                    <tr key={idx}>
                      <td className="border px-3 py-2">{m.month}</td>
                      <td className="border px-3 py-2 text-green-600">{m.present}</td>
                      <td className="border px-3 py-2 text-red-600">{m.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No monthly summary available.</p>
            )}
          </div>

          {/* attendance records */}
          <div className="mt-6 text-left">
            <h3 className="font-semibold mb-2">📅 Attendance Records</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="px-3 py-2 border rounded dark:bg-gray-800"
              />
              <button
                onClick={handleFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Filter
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Reset
              </button>
            </div>

            {filteredAttendances.length > 0 ? (
              <div className="max-h-48 overflow-y-auto border rounded">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="border px-3 py-2">Date</th>
                      <th className="border px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendances.map(a => (
                      <tr key={a.id}>
                        <td className="border px-3 py-2">{a.date}</td>
                        <td
                          className={`border px-3 py-2 ${
                            a.status === 'Present' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {a.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No attendance records found.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">
          Please login with correct ID and password to view your details.
        </p>
      )}

      {/* modal image preview */}
      {modalImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={() => setModalImageUrl(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 font-bold hover:bg-gray-200"
              aria-label="Close image preview"
            >
              ✕
            </button>
            <img
              src={modalImageUrl}
              alt="Profile enlarged"
              className="max-w-full max-h-screen rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
