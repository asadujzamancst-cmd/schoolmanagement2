"use client";

import React, { useEffect, useState } from "react";

interface Teacher {
  teacher_id: number;
  title: string;
  teacher_name: string;
  details: string;
  image?: string | null;
}

export default function TeachersView() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">👨‍🏫 Our Teachers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.teacher_id}
            className="border rounded p-4 bg-gray-100 dark:bg-gray-800 shadow"
          >
            <h3 className="text-lg font-bold mb-1">{teacher.title}</h3>
            <p className="font-medium mb-1">👤 {teacher.teacher_name}</p>
            <p className="text-sm mb-2">{teacher.details}</p>
            {teacher.image && (
              <a
                href={`http://127.0.0.1:8000${teacher.image}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`http://127.0.0.1:8000${teacher.image}`}
                  alt="Teacher"
                  className="w-full h-48 object-cover mb-2 rounded border hover:opacity-80 transition"
                />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
