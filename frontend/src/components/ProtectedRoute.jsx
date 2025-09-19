import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { token } = useAuth();

    // Add this debugging log
    console.log("Checking protected route. Token is:", token);

    // If there's a token, render the child components (like AdminPage).
    // Otherwise, redirect to the login page.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;