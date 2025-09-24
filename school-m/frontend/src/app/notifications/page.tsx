"use client";

import React, { useEffect, useState } from "react";

interface Notice {
  id: number;
  subject: string;
  message: string;
  date: string | null;
  created_at: string;
  attachment?: string | null;
}

export default function StudentNoticeView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/notice/notices/");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices");
    }
  };

  const filteredNotices = dateFilter
    ? notices.filter((n) => n.date === dateFilter)
    : notices;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 mt-20 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">📢 Student Notices</h1>

      {/* Filter */}
      {!selectedNotice && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => setDateFilter("")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      )}

      {/* Notices List */}
      {!selectedNotice && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="cursor-pointer border p-4 rounded bg-gray-100 dark:bg-gray-800 hover:shadow transition"
            >
              <h3 className="text-lg font-semibold">{notice.subject}</h3>
              <p className="text-sm text-gray-600 mb-1">Date: {notice.date}</p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(notice.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Selected Notice Details */}
      {selectedNotice && (
        <div className="border p-6 rounded bg-gray-50 dark:bg-gray-800 shadow">
          <h2 className="text-2xl font-bold mb-3">{selectedNotice.subject}</h2>
          <p className="whitespace-pre-wrap mb-4">{selectedNotice.message}</p>
          <p className="text-sm text-gray-500 mb-2">📅 Date: {selectedNotice.date}</p>
          <p className="text-sm text-gray-500 mb-4">⏰ Created at: {new Date(selectedNotice.created_at).toLocaleString()}</p>

          {selectedNotice.attachment && (
            <a
              href={selectedNotice.attachment}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-2"
            >
              View & Download Attachment
            </a>
          )}

          <button
            onClick={() => setSelectedNotice(null)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
