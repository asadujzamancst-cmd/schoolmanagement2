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

export default function NoticeManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(""); // 🟢 Add date field
  const [attachment, setAttachment] = useState<File | null>(null);

  // Editing state
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Fetch all notices
  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/notice/notices/");
      if (!res.ok) throw new Error("Failed to fetch notices");
      const data = await res.json();
      setNotices(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Reset form
  const resetForm = () => {
    setSubject("");
    setMessage("");
    setDate("");
    setAttachment(null);
    setEditingNotice(null);
  };

  // Create / update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Subject and message are required");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (date) {
      formData.append("date", date);
    }
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      let res: Response;
      if (editingNotice) {
        res = await fetch(
          `http://127.0.0.1:8000/notice/notices/${editingNotice.id}/`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        res = await fetch("http://127.0.0.1:8000/notice/notices/", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        alert("Error: " + JSON.stringify(errData));
        return;
      }

      await fetchNotices();
      resetForm();
    } catch {
      alert("Network error");
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/notice/notices/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchNotices();
    } catch {
      alert("Delete error");
    }
  };

  // Edit
  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setSubject(notice.subject);
    setMessage(notice.message);
    setDate(notice.date || "");
    setAttachment(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Notice Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 border rounded p-4 bg-gray-100 dark:bg-gray-800"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingNotice ? "Edit Notice" : "Create New Notice"}
        </h2>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full p-2 mb-4 border rounded resize-none"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Attachment (optional):</label>
        <input
          type="file"
          accept="*/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setAttachment(e.target.files[0]);
            }
          }}
          className="mb-4"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingNotice ? "Update Notice" : "Create Notice"}
          </button>
          {editingNotice && (
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

      {/* Notices List */}
      <h2 className="text-2xl font-semibold mb-4">All Notices</h2>
      {loading && <p>Loading notices...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && notices.length === 0 && <p>No notices found.</p>}

      <div className="space-y-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="border p-4 rounded bg-white dark:bg-gray-800 shadow"
          >
            <h3 className="text-xl font-bold">{notice.subject}</h3>
            <p className="whitespace-pre-wrap my-2">{notice.message}</p>
            {notice.date && (
              <p className="text-sm text-gray-500">Date: {notice.date}</p>
            )}
            <p className="text-sm text-gray-500">
              Created at: {new Date(notice.created_at).toLocaleString()}
            </p>
            {notice.attachment && (
              <p>
                Attachment:{" "}
                <a
                  href={`http://127.0.0.1:8000${notice.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View File
                </a>
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleEdit(notice)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(notice.id)}
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
