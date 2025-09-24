"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/logOutButton";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // ✅ যদি টোকেন না থাকে → login এ পাঠাবে
      router.push("/login");
    } else {
      // ✅ টোকেন থাকলে loading false → dashboard দেখাবে
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      
             <div
        className="cursor-pointer border border-red-600 hover:border-sky-400 hover:text-sky-700 p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105"
        onClick={() => router.push('/staff/AddStaff')}
      >
        <h2 className="text-xl font-bold mb-2">Techer Management</h2>
        <p className="text-gray-600">Manage Teacher-related tasks here</p>
      </div>


  

      <LogoutButton />
    </div>
  );
}
