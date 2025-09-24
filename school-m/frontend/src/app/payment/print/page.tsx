'use client';

import React, { useEffect, useState, useRef } from 'react';

// ✅ Interfaces
interface Student {
  id: number;
  student_id: string;
  name: string;
  phone_number:number;
  department: string;
  year: string;
  email: string;
  college:string;
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [studentId, setStudentId] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/payment/payments/')
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setFilteredPayments(data);
      });
  }, []);

  const handleSearch = () => {
    if (studentId.trim() === '') {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter(
        (payment) =>
          payment.student.student_id.toLowerCase() === studentId.toLowerCase()
      );
      setFilteredPayments(filtered);
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Student Name', 'Student ID', 'Amount', 'Status', 'Due Date', 'Paid On', 'Reference ID'],
      ...filteredPayments.map((p) => [
        p.student.name,
        p.student.student_id,
        p.amount,
        p.status,
        p.due_date,
        p.payment_date,
        p.reference_id,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      csvRows.map((row) => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_payments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printTable = () => {
    if (tableRef.current) {
      const printContent = tableRef.current.outerHTML;
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Student Payments</title>
              <style>
                table { width: 100%; border-collapse: collapse; }
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
    }
  };

  return (
    <div className="overflow-x-auto mb-6 mt-20 p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">💰 Payments</h2>

      {/* 🔍 Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2 dark:bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export CSV
        </button>
        <button
          onClick={printTable}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          🖨️ Print Table
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
            <th className="border px-2 py-1">Reference</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="border px-2 py-1">{payment.student.name}</td>
                <td className="border px-2 py-1">{payment.student.student_id}</td>
                <td className="border px-2 py-1">${payment.amount}</td>
                <td className="border px-2 py-1">{payment.status}</td>
                <td className="border px-2 py-1">{payment.due_date}</td>
                <td className="border px-2 py-1">{payment.payment_date}</td>
                <td className="border px-2 py-1">{payment.reference_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4">
                No payments found for this student.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
