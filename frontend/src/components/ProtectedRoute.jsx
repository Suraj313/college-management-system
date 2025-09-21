import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { token } = useAuth();

    // debugging log
    console.log("Checking protected route. Token is:", token);

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;