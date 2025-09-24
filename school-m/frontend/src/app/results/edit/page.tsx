'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

interface StudentResult {
  id: number;
  roll: string;
  name: string;
  semester: string;
  exam_title: string;
  subject: string;
  mark: number;
  total_mark: number;
}

interface ResultResponse {
  results: StudentResult[];
  total: number;
  page: number;
  per_page: number;
}

export default function ResultPage() {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [roll, setRoll] = useState('');
  const [semester, setSemester] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchResults = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/result/results/', {
        params: { roll, semester, page },
      });

      const data = res.data as ResultResponse;

      // Make sure data.results exists
      setResults(data?.results ?? []);
      setTotal(data?.total ?? 0);
    } catch (err) {
      console.error('Fetch results error:', err);
      setResults([]); // fallback empty array
    }
  };

  useEffect(() => {
    fetchResults();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchResults();
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Results</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Roll"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Roll</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Semester</th>
            <th className="border px-2 py-1">Exam Title</th>
            <th className="border px-2 py-1">Subject</th>
            <th className="border px-2 py-1">Mark</th>
            <th className="border px-2 py-1">Total Mark</th>
            <th className="border px-2 py-1">Percentage</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((res) => (
              <tr key={res.id}>
                <td className="border px-2 py-1">{res.roll}</td>
                <td className="border px-2 py-1">{res.name}</td>
                <td className="border px-2 py-1">{res.semester}</td>
                <td className="border px-2 py-1">{res.exam_title}</td>
                <td className="border px-2 py-1">{res.subject}</td>
                <td className="border px-2 py-1">{res.mark}</td>
                <td className="border px-2 py-1">{res.total_mark}</td>
                <td className="border px-2 py-1">
                  {((res.mark / res.total_mark) * 100).toFixed(2)}%
                </td>
                <td className="border px-2 py-1">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-4">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-2 py-1 border rounded"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
