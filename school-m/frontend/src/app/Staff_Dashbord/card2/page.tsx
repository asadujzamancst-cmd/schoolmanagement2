'use client'

import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      {/* Admin Dashboard Card */}
      <div
        className="cursor-pointer border border-red-600 hover:border-sky-400 hover:text-sky-700  p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/payment/add')}
      >
        <h2 className="text-xl font-bold mb-2">ADD PAYMENT</h2>
        <p className="text-gray-600">Manage all payment tasks here</p>
      </div>

      {/* Staff Dashboard Card */}
      <div
        className="cursor-pointer border border-red-600 hover:border-sky-400 hover:text-sky-700 p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/payment/print')}
      >
        <h2 className="text-xl font-bold mb-2">all paymet</h2>
        <p className="text-gray-600">Manage student-related tasks here</p>
      </div>



       <div
        className="cursor-pointer border border-red-600 hover:border-sky-400 hover:text-sky-700 p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/payment/Edit_payment')}
      >
        <h2 className="text-xl font-bold mb-2">Edit paymet</h2>
        <p className="text-gray-600">Manage student-related tasks here</p>
      </div>


    </div>
  )
}
