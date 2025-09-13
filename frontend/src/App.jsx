import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StudentDashboard from "./dashboards/StudentDashboard.jsx";
import TeacherDashboard from "./dashboards/TeacherDashboard.jsx";
import AdminDashboard from "./dashboards/AdminDashboard.jsx";

export default function App() {
  return (
    <div>
      <nav className="p-3 bg-white border-b flex gap-4">
        <Link to="/login" className="text-blue-600">Login</Link>
        <Link to="/signup" className="text-green-600">Sign Up</Link>
      </nav>

      <Routes>
        {/* 👇 Redirect root (/) to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />  

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "hod"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
