"use client";

import React, { useEffect, useState } from "react";

interface Student {
  id: number;
  student_id: string;
  name: string;
  department: string;
  year: number;
}

interface Attendance {
  id: number;
  student: number; // ID only
  date: string;
  status: string;
}

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Attendance[]>([]);
  const [filterId, setFilterId] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [formData, setFormData] = useState<{ status: string; date: string } | null>(null);

  const fetchAll = async () => {
    try {
      const attRes = await fetch("http://127.0.0.1:8000/attendance/attendance/");
      const attData = await attRes.json();

      const stuRes = await fetch("http://127.0.0.1:8000/payment/students/");
      const stuData = await stuRes.json();

      setAttendances(attData);
      setStudents(stuData);
      setFiltered(attData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getStudentDetails = (id: number) => {
    return students.find((s) => s.id === id);
  };

  const handleFilter = () => {
    let data = attendances;

    if (filterId.trim() !== "") {
      data = data.filter((a) => {
        const student = getStudentDetails(a.student);
        return student?.student_id.toLowerCase().includes(filterId.toLowerCase());
      });
    }

    if (filterDepartment.trim() !== "") {
      data = data.filter((a) => {
        const student = getStudentDetails(a.student);
        return student?.department.toLowerCase() === filterDepartment.toLowerCase();
      });
    }

    if (filterYear.trim() !== "") {
      data = data.filter((a) => {
        const student = getStudentDetails(a.student);
        return String(student?.year) === filterYear;
      });
    }

    setFiltered(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attendance?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/attendance/attendance/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAll();
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEditClick = (attendance: Attendance) => {
    setEditingAttendance(attendance);
    setFormData({
      status: attendance.status,
      date: attendance.date,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendance || !formData) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/attendance/attendance/${editingAttendance.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: editingAttendance.student,
            date: formData.date,
            status: formData.status,
          }),
        }
      );

      if (res.ok) {
        setEditingAttendance(null);
        setFormData(null);
        fetchAll();
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Attendance Management</h1>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Filter by ID (e.g., 2023-001)"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Department (e.g., CSE)"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Year (e.g., 2)"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {editingAttendance && formData && (
        <form
          onSubmit={handleUpdate}
          className="mb-10 border p-4 rounded bg-gray-50 dark:bg-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Attendance</h2>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setEditingAttendance(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((attendance) => {
          const student = getStudentDetails(attendance.student);
          if (!student) return null;

          return (
            <div
              key={attendance.id}
              className="border rounded p-4 shadow bg-white dark:bg-gray-900"
            >
              <h3 className="text-lg font-bold">{student.name}</h3>
              <p>🆔 ID: {student.student_id}</p>
              <p>🏛️ Dept: {student.department}</p>
              <p>🎓 Year: {student.year}</p>
              <p>📅 Date: {attendance.date}</p>
              <p>✅ Status: {attendance.status}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEditClick(attendance)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(attendance.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
