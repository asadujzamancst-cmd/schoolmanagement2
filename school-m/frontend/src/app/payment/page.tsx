'use client';

import React, { useState, useRef } from 'react';

interface Student {
  id: number;
  student_id: string;
  name: string;
  phone_number: number;
  department: string;
  year: number;
  email: string;
  college: string;
  password: string;
}

interface Payment {
  id: number;
  student: Student;
  amount: number;
  status: string;
  due_date: string;
  payment_date: string;
  reference_id: string;
}

export default function PaymentTable() {
  const [queryId, setQueryId] = useState('');
  const [queryPassword, setQueryPassword] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleSearch = async () => {
    const id = queryId.trim();
    const password = queryPassword.trim();

    if (!id || !password) {
      alert('Please enter both Student ID and Password');
      return;
    }

    try {
      // Step 1: Fetch students and verify credentials
      const studentRes = await fetch('http://127.0.0.1:8000/payment/students/');
      if (!studentRes.ok) throw new Error('Failed to fetch students');
      const students: Student[] = await studentRes.json();

      const student = students.find(
        (s) => s.student_id === id && s.password === password
      );

      if (!student) {
        alert('Invalid Student ID or Password');
        setFilteredPayments([]);
        return;
      }

      // Step 2: Fetch payments and filter by verified student ID
      const paymentsRes = await fetch('http://127.0.0.1:8000/payment/payments/');
      if (!paymentsRes.ok) throw new Error('Failed to fetch payments');
      const payments: Payment[] = await paymentsRes.json();

      const studentPayments = payments.filter(
        (p) => p.student.id === student.id
      );

      if (studentPayments.length === 0) {
        alert('No payments found for this student');
      }

      setFilteredPayments(studentPayments);
    } catch (error) {
      console.error(error);
      alert('Error fetching data. Please try again.');
      setFilteredPayments([]);
    }
  };

  const exportToCSV = () => {
    if (filteredPayments.length === 0) return;

    const csvRows = [
      ['Student Name', 'Student ID', 'Amount', 'Status', 'Due Date', 'Paid On', 'Reference ID'],
      ...filteredPayments.map(p => [
        p.student.name,
        p.student.student_id,
        p.amount,
        p.status,
        p.due_date,
        p.payment_date,
        p.reference_id,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_payments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printTable = () => {
    if (!tableRef.current || filteredPayments.length === 0) return;

    const printContent = tableRef.current.outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Payments</title>
            <style>
              table { width: 100%; border-collapse: collapse; font-size: 14px; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            <h2>💰 Student Payments</h2>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="overflow-x-auto mb-6 mt-20 p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">💰 Payment Management (Login to view)</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="🎓 Student ID"
          value={queryId}
          onChange={e => setQueryId(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4 dark:bg-gray-800"
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={queryPassword}
          onChange={e => setQueryPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4 dark:bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={exportToCSV}
          disabled={filteredPayments.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export CSV
        </button>
        <button
          onClick={printTable}
          disabled={filteredPayments.length === 0}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          🖨️ Print
        </button>
      </div>

      <table
        ref={tableRef}
        className="table-auto w-full border dark:border-gray-700 text-sm"
      >
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-2 py-1">Student</th>
            <th className="border px-2 py-1">Student ID</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Due Date</th>
            <th className="border px-2 py-1">Paid On</th>
            <th className="border px-2 py-1">Reference ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td className="border px-2 py-1">{payment.student.name}</td>
                <td className="border px-2 py-1">{payment.student.student_id}</td>
                <td className="border px-2 py-1">৳{payment.amount}</td>
                <td className="border px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="border px-2 py-1">{payment.due_date}</td>
                <td className="border px-2 py-1">{payment.payment_date}</td>
                <td className="border px-2 py-1">{payment.reference_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No payments found. Please search with correct ID & password.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
