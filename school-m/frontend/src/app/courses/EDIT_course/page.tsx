"use client";

import React, { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: number;
  level: string;
  certificate: string;
  price: number;
  description: string;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course> | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/course/course/");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/course/course/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCourses();
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      certificate: course.certificate,
      price: course.price,
      description: course.description,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (formData) {
      const value = e.target.type === "number" ? parseInt(e.target.value) : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !formData) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/course/course/${editingCourse.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingCourse(null);
        setFormData(null);
        fetchCourses();
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Update error", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Course Management</h1>

      {editingCourse && formData && (
        <form
          onSubmit={handleUpdate}
          className="mb-10 border p-4 rounded bg-gray-50 dark:bg-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
          <input
            name="title"
            placeholder="Title"
            value={formData.title || ""}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="instructor"
            placeholder="Instructor"
            value={formData.instructor || ""}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="duration"
            placeholder="Duration (hours)"
            value={formData.duration || ""}
            onChange={handleInputChange}
            type="number"
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="level"
            placeholder="Level"
            value={formData.level || ""}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="certificate"
            placeholder="Certificate"
            value={formData.certificate || ""}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            name="price"
            placeholder="Price"
            value={formData.price || ""}
            onChange={handleInputChange}
            type="number"
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setEditingCourse(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded p-4 shadow bg-white dark:bg-gray-900"
          >
            <h3 className="text-lg font-bold">{course.title}</h3>
            <p>👨‍🏫 Instructor: {course.instructor}</p>
            <p>⏰ Duration: {course.duration} hours</p>
            <p>🎓 Level: {course.level}</p>
            <p>📜 Certificate: {course.certificate}</p>
            <p>💰 Price: {course.price} BDT</p>
            <p>📝 {course.description}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEditClick(course)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
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
