'use client';

import React, { useEffect, useState } from 'react';

interface Course {
  title: string;
  instructor: string;
  duration: number;
  level: string;
  certificate: string;
  price: number;
  description: string;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/course/course/') // তোমার Django API URL
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Duration:</strong> {course.duration} hours</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Certificate:</strong> {course.certificate}</p>
              <p><strong>Price:</strong> ৳{course.price}</p>
              <p className="text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
