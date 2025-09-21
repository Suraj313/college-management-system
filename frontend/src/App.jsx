import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminPage from './pages/AdminPage.jsx';
import CoursePage from './pages/CoursePage.jsx'; 
import TakeAttendancePage from './pages/TakeAttendancePage.jsx';
import MyAttendancePage from './pages/MyAttendancePage.jsx';
import ViewAttendancePage from './pages/ViewAttendancePage.jsx';
import ManageGradesPage from './pages/ManageGradesPage.jsx';
import MyGradesPage from './pages/MyGradesPage.jsx';
import ViewGradesPage from './pages/ViewGradesPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/courses" element={<CoursePage />} /> 
                    <Route path="/take-attendance" element={<TakeAttendancePage />} />
                    <Route path="/my-attendance" element={<MyAttendancePage />} />
                    <Route path="/view-attendance" element={<ViewAttendancePage />} />
                    <Route path="/manage-grades" element={<ManageGradesPage />} />
                    <Route path="/my-grades" element={<MyGradesPage />} />
                    <Route path="/view-grades" element={<ViewGradesPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
export default App;