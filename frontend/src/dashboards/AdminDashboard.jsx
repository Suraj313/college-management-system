import React from "react";
import { logout } from "../services/auth";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button
        className="mt-4 bg-gray-200 px-3 py-2 rounded"
        onClick={() => { logout(); window.location = "/login"; }}
      >
        Logout
      </button>
    </div>
  );
}
