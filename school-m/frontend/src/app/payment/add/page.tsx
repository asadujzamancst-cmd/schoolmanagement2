'use client';

import React, { useEffect, useState } from 'react';

// Interfaces
interface Student {
  id: number;
  student_id: string;
  name: string;
  phone_number: number;
  department: string;
  year: string;
  email: string;
  college: string;
}

interface Payment {
  id: number;
  student: Student;
  amount: number | string;  // backend might send string, so handle both
  status: string;
  due_date: string;
  payment_date: string;
  reference_id: string;
}

export default function PaymentDashboard() {
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentPayments, setStudentPayments] = useState<Payment[]>([]);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    due_date: '',
    reference_id: '',
  });

  // Load students and payments on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/payment/students/')
      .then(res => res.json())
      .then(setStudents);

    fetch('http://127.0.0.1:8000/payment/payments/')
      .then(res => res.json())
      .then(setPayments);
  }, []);

  // When selectedStudent changes, filter payments for that student
  useEffect(() => {
    if (selectedStudent) {
      const filteredPayments = payments.filter(
        (p) => p.student.id === selectedStudent.id
      );
      setStudentPayments(filteredPayments);
    } else {
      setStudentPayments([]);
    }
  }, [selectedStudent, payments]);

  // Search student by ID
  const handleSearch = () => {
    const found = students.find((s) => s.student_id === studentId.trim());
    setSelectedStudent(found || null);
  };

  // Add new payment for selected student
  const handleNewPayment = async () => {
    if (!selectedStudent) return;

    if (!newPayment.amount || !newPayment.due_date || !newPayment.reference_id) {
      alert('Please fill all payment fields');
      return;
    }

    try {
      await fetch('http://127.0.0.1:8000/payment/payments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          amount: parseFloat(newPayment.amount),
          due_date: newPayment.due_date,
          reference_id: newPayment.reference_id,
          status: 'Pending',
        }),
      });

      alert('Payment added successfully');

      // Refresh payments after adding
      const res = await fetch('http://127.0.0.1:8000/payment/payments/');
      const updatedPayments = await res.json();
      setPayments(updatedPayments);

      // Reset new payment form
      setNewPayment({ amount: '', due_date: '', reference_id: '' });
    } catch (error) {
      alert('Failed to add payment. Try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4 bg-white dark:bg-gray-900 dark:text-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">🎓 Payment Management</h1>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border px-3 py-2 rounded w-full dark:bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Student Info and Payment Form */}
      {selectedStudent && (
        <div className="mb-6 p-4 border dark:border-gray-700 rounded">
          <h2 className="text-lg font-bold">👤 {selectedStudent.name}</h2>
          <p>ID: {selectedStudent.student_id}</p>
          <p>Department: {selectedStudent.department}</p>
          <p>Email: {selectedStudent.email}</p>

          {/* Payment List */}
          <h3 className="mt-4 font-semibold mb-2">Payments</h3>
          <table className="w-full table-auto border text-sm dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border px-3 py-1">Amount</th>
                <th className="border px-3 py-1">Reference ID</th>
                <th className="border px-3 py-1">Due Date</th>
                <th className="border px-3 py-1">Payment Date</th>
                <th className="border px-3 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentPayments.length > 0 ? (
                studentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="border px-3 py-1">
                      ${Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="border px-3 py-1">{payment.reference_id}</td>
                    <td className="border px-3 py-1">{payment.due_date}</td>
                    <td className="border px-3 py-1">{payment.payment_date || '-'}</td>
                    <td className="border px-3 py-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Add Payment Form */}
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">➕ Add Payment</h3>
            <input
              type="number"
              placeholder="Amount"
              className="border px-3 py-2 rounded w-full dark:bg-gray-800"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Reference ID"
              className="border px-3 py-2 rounded w-full dark:bg-gray-800"
              value={newPayment.reference_id}
              onChange={(e) => setNewPayment({ ...newPayment, reference_id: e.target.value })}
            />
            <input
              type="date"
              className="border px-3 py-2 rounded w-full dark:bg-gray-800"
              value={newPayment.due_date}
              onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
            />
            <button
              onClick={handleNewPayment}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
