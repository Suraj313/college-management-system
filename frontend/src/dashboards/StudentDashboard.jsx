import React, { useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../services/auth";

export default function StudentDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/protected/student")
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Error: " + err.response?.data?.detail));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Student Dashboard</h1>
      <p className="mt-3">{message}</p>
      <button
        className="mt-4 bg-gray-200 px-3 py-2 rounded"
        onClick={() => { logout(); window.location = "/login"; }}
      >
        Logout
      </button>
    </div>
  );
}
