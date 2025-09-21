import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

import StudentDashboard from '../components/dashboards/StudentDashboard.jsx';
import TeacherDashboard from '../components/dashboards/TeacherDashboard.jsx';
import HodDashboard from '../components/dashboards/HodDashboard.jsx';
import SuperuserDashboard from '../components/dashboards/SuperuserDashboard.jsx';

function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderDashboardByRole = () => {
        if (!user) return <div>Loading...</div>;

        switch (user.role) {
            case 'student': return <StudentDashboard />;
            case 'teacher': return <TeacherDashboard />;
            case 'hod': return <HodDashboard />;
            case 'superuser': return <SuperuserDashboard />;
            default: return <div>Invalid user role.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="flex items-center justify-between p-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold text-blue-700">College Portal</h1>
                <div className="flex items-center">
                    
                    <Link 
                        to="/courses" 
                        className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Courses
                    </Link>
                    
                    {/* Attendance Links */}
                    {user && (user.role === 'hod' || user.role === 'superuser') && (
                        <Link 
                            to="/view-attendance" 
                            className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            View Attendance
                        </Link>
                    )}
                    {user && user.role === 'teacher' && (
                        <Link 
                            to="/take-attendance" 
                            className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Take Attendance
                        </Link>
                    )}
                    {user && user.role === 'student' && (
                        <Link 
                            to="/my-attendance" 
                            className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            My Attendance
                        </Link>
                    )}

                    {user && user.role === 'teacher' && (
                        <Link 
                            to="/manage-grades" 
                            className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Enter Grades
                        </Link>
                    )}
                    {user && (user.role === 'teacher' || user.role === 'hod' || user.role === 'superuser') && (
                        <Link 
                            to="/view-grades" // You will need to create this page
                            className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            View Grades
                        </Link>
                    )}
                    {/* "My Grades" link for students */}
                    {user && user.role === 'student' && (
                        <Link 
                            to="/my-grades" 
                            className="px-4 py-2 mr-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            My Grades
                        </Link>
                    )}
                    
                    {/* Admin Link */}
                    {user && user.role === 'superuser' && (
                        <Link 
                            to="/admin"
                            className="px-4 py-2 mr-4 font-semibold text-white bg-purple-700 rounded-md hover:bg-purple-800"
                        >
                            System Administration
                        </Link>
                    )}

                    <span className="mr-4 text-gray-700">
                        Welcome, <span className="font-semibold">{user?.name || user?.sub}</span> ({user?.role})
                    </span>
                    
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="p-8">
                {renderDashboardByRole()}
            </main>
        </div>
    );
}

export default DashboardPage;