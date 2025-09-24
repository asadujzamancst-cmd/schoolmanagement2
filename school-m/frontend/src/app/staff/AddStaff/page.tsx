"use client";

import React, { useEffect, useState } from "react";

interface Teacher {
  teacher_id: number;
  title: string;
  teacher_name: string;
  details: string;
  image?: string | null;
  password?: string; // ✅ password যোগ হলো
}

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [title, setTitle] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [details, setDetails] = useState("");
  const [password, setPassword] = useState(""); // ✅ password state
  const [image, setImage] = useState<File | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/teacher/teacher/");
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to fetch teachers");
    }
  };

  const resetForm = () => {
    setTitle("");
    setTeacherName("");
    setDetails("");
    setPassword(""); // reset password
    setImage(null);
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("teacher_name", teacherName);
    formData.append("details", details);
    formData.append("password", password); // ✅ include password
    if (image) {
      formData.append("image", image);
    }

    try {
      let res: Response;
      if (editingTeacher) {
        res = await fetch(
          `http://127.0.0.1:8000/teacher/teacher/${editingTeacher.teacher_id}/`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        res = await fetch("http://127.0.0.1:8000/teacher/teacher/", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        alert("Error: " + JSON.stringify(errData));
        return;
      }

      await fetchTeachers();
      resetForm();
    } catch {
      alert("Network error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/teacher/teacher/${id}/`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      await fetchTeachers();
    } catch {
      alert("Delete error");
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTitle(teacher.title);
    setTeacherName(teacher.teacher_name);
    setDetails(teacher.details);
    setPassword(teacher.password || ""); // ✅ load password if exists
    setImage(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-20 dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">
        👨‍🏫 Teacher Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 border p-4 rounded bg-gray-50 dark:bg-gray-800"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <textarea
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          className="w-full mb-2 p-2 border rounded resize-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required={!editingTeacher} // নতুন teacher হলে required
        />
        <label className="block mb-1 font-medium">Image (optional):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImage(e.target.files[0]);
            }
          }}
          className="mb-2"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingTeacher ? "Update" : "Add"}
          </button>
          {editingTeacher && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-4">All Teachers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.teacher_id}
            className="border rounded p-4 bg-gray-100 dark:bg-gray-800 shadow"
          >
            <h3 className="text-lg font-bold">{teacher.title}</h3>
            <p className="font-medium mb-1">👨‍🏫 {teacher.teacher_name}</p>
            <p className="text-sm mb-2">{teacher.details}</p>
            <p className="text-sm mb-2">
              🔑 <span className="font-mono">{teacher.password}</span>
            </p>
            {teacher.image && (
              <a
                href={`http://127.0.0.1:8000${teacher.image}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`http://127.0.0.1:8000${teacher.image}`}
                  alt="Teacher"
                  className="w-full h-40 object-cover mb-2 rounded border hover:opacity-80 transition"
                />
              </a>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(teacher)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(teacher.teacher_id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
