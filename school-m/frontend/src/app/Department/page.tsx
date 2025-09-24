"use client"

import React from "react"
import Link from "next/link"
import {
  Wrench,
  Briefcase,
  FlaskConical,
  BookOpen,
  Code2,
  Atom,
} from "lucide-react"

const departments = [
  {
    name: "Engineering",
    description: "Build your future with Civil, Mechanical & CSE programs.",
    icon: <Wrench className="w-10 h-10 text-blue-600" />,
    link: "/departments/engineering",
  },
  {
    name: "Business",
    description: "Master finance, marketing, and entrepreneurship.",
    icon: <Briefcase className="w-10 h-10 text-green-600" />,
    link: "/departments/business",
  },
  {
    name: "Science",
    description: "Explore Physics, Chemistry, and Biology foundations.",
    icon: <FlaskConical className="w-10 h-10 text-purple-600" />,
    link: "/departments/science",
  },
  {
    name: "Arts & Humanities",
    description: "Dive into literature, philosophy, and history.",
    icon: <BookOpen className="w-10 h-10 text-yellow-600" />,
    link: "/departments/arts",
  },
  {
    name: "Computer Science",
    description: "Learn software, AI, and data science skills.",
    icon: <Code2 className="w-10 h-10 text-indigo-600" />,
    link: "/departments/cs",
  },
  {
    name: "Physics",
    description: "Discover the laws that govern the universe.",
    icon: <Atom className="w-10 h-10 text-red-500" />,
    link: "/departments/physics",
  }, 
]

export default function DepartmentCards() {
  return (
    <section className="py-12 min-w-2xs mt-20 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 dark:text-white">
          Our Departments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="flex flex-col items-start p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="mb-4">{dept.icon}</div>
              <h3 className="text-xl  font-semibold mb-2 dark:text-white decoration-red-100">{dept.name}</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {dept.description}
              </p>
              <Link
                href={dept.link}
                className="text-blue-600 text-sm hover:underline"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
