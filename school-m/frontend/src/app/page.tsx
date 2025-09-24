"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="bg-gray-50 text-gray-800 font-sans mx-auto  mt-20 ">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Welcome to ABC English</h1>
            <p className="text-base sm:text-lg md:text-xl">
              Empowering students to succeed with excellence in education, research, and social impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/#" className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-green-700 text-center">
                Learn More
              </Link>
              <Link href="/Contact" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition text-center">
                contact us
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image src="/hero.png" alt="ABC College Campus" width={500} height={400} className="rounded-lg shadow-xl w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center dark:bg-gray-900 ">
        {[
          { title: "Academics", desc: "High-quality programs with expert faculty.", icon: "🎓" },
          { title: "Research", desc: "Innovative projects shaping the future.", icon: "🔬" },
          { title: "Community", desc: "Vibrant student life & campus activities.", icon: "🗕️" },
        ].map((item) => (
          <div key={item.title} className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl sm:text-5xl mb-4">{item.icon}</div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm sm:text-base">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Why Choose Section */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">Why Choose ABC College?</h2>
            <ul className="space-y-4 list-disc list-inside text-sm sm:text-base dark:text-white">
              <li>Accredited & experienced faculty</li>
              <li>State-of-the-art facilities</li>
              <li>Strong alumni network</li>
              <li>Scholarships & financial support</li>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image src="/hero.png" alt="Student life" width={500} height={400} className="rounded-lg shadow-lg w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 dark:bg-gray-900">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-10 dark:text-white">Our Programs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Engineering", "Business", "Arts & Sciences", "Computer Science"].map((prog) => (
            <div key={prog} className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold">{prog}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Explore our {prog} programs and career opportunities.
              </p>
              <Link href={`/programs/${prog.toLowerCase().replace(/ & /g, "-").replace(/\s/g, "-")}`} className="mt-4 inline-block text-blue-700 hover:underline text-sm">
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* News & Events Section */}
      <section className="bg-gray-100 py-16 dark:bg-gray-900 dark:text-white">
        
          <div className="flex justify-center text-center text-[23px]">News & Event</div>
         
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-gray-200 py-10 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold">ABC College</h3>
            <p>Address Line 1, City, Country</p>
            <p>Phone: +1 123-456-7890</p>
            <p>Email: info@abccollege.edu</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/academics">Academics</Link></li>
              <li><Link href="/admissions">Admissions</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} ABC College. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
