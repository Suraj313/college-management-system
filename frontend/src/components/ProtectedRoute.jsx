import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/auth";

export default function ProtectedRoute({ allowedRoles, children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCurrentUser()
      .then((user) => {
        if (!active) return;
        if (!allowedRoles.length || allowedRoles.includes(user.role)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(() => setAuthorized(false))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [allowedRoles]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
