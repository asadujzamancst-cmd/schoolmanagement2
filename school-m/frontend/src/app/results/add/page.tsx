'use client';

import { useState } from "react";
import axios from "axios";

interface ResultForm {
  roll: string;
  name: string;
  semester: string;
  exam_title: string;
  subject: string;
  mark: number;
  total_mark: number;
}

export default function AddResultPage() {
  const [formData, setFormData] = useState<ResultForm>({
    roll: "",
    name: "",
    semester: "",
    exam_title: "",
    subject: "",
    mark: 0,
    total_mark: 0
  });

  const [percentage, setPercentage] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = (name === "mark" || name === "total_mark") ? Number(value) : value;
    setFormData({ ...formData, [name]: val });

    if (name === "mark" || name === "total_mark") {
      const m = name === "mark" ? Number(value) : formData.mark;
      const t = name === "total_mark" ? Number(value) : formData.total_mark;
      setPercentage(t > 0 ? (m / t) * 100 : 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/result/results/", formData);
      setMessage("Result saved successfully!");
      setFormData({
        roll: "",
        name: "",
        semester: "",
        exam_title: "",
        subject: "",
        mark: 0,
        total_mark: 0
      });
      setPercentage(0);
    } catch (err) {
      console.error(err);
      setMessage("Error saving result");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Student Result</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="roll" placeholder="Roll" value={formData.roll} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="semester" placeholder="Semester" value={formData.semester} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="exam_title" placeholder="Exam Title" value={formData.exam_title} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input type="number" name="mark" placeholder="Mark" value={formData.mark} onChange={handleChange} className="w-full p-2 border rounded"/>
        <input type="number" name="total_mark" placeholder="Total Mark" value={formData.total_mark} onChange={handleChange} className="w-full p-2 border rounded"/>
        
        <div>Percentage: {percentage.toFixed(2)}%</div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Save Result</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
