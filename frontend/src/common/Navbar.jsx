import React from "react";
import { logout } from "../../services/auth";
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 border-b">
      <div className="font-bold">College Portal</div>
      <div className="flex gap-4">
        {user ? (
          <>
            <span className="text-sm">Role: {user.role}</span>
            <button
              onClick={() => { logout(); window.location = "/login"; }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/signup" className="text-green-600">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
