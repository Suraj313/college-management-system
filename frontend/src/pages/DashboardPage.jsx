import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

// Import the specific dashboard components
import StudentDashboard from '../components/dashboards/StudentDashboard.jsx';
import TeacherDashboard from '../components/dashboards/TeacherDashboard.jsx';
import HodDashboard from '../components/dashboards/HodDashboard.jsx';
import SuperuserDashboard from '../components/dashboards/SuperUserDashboard.jsx';


function DashboardPage() {
    // Get user data and logout function from the authentication context
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Function to handle user logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // This function determines which dashboard to render based on the user's role
    const renderDashboardByRole = () => {
        if (!user) {
            return <div>Loading...</div>; // Or a spinner component
        }

        switch (user.role) {
            case 'student':
                return <StudentDashboard />;
            case 'teacher':
                return <TeacherDashboard />;
            case 'hod':
                return <HodDashboard />;
            // Add this case to handle what the superuser sees in the main content area
            case 'superuser':
                return <SuperuserDashboard />; // A superuser can see the HOD view, for example
            default:
                // Redirect or show an error if the role is unknown
                return <div>Invalid user role. Please contact support.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <nav className="flex items-center justify-between p-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold text-blue-700">
                    College Portal
                </h1>
                <div className="flex items-center">
                    {/* Change this condition to check for 'superuser' instead of 'hod' */}
                    {user && user.role === 'superuser' && (
                        <Link 
                            to="/admin"
                            className="px-4 py-2 mr-4 font-semibold text-white bg-purple-700 rounded-md hover:bg-purple-800 transition-colors"
                        >
                            System Administration
                        </Link>
                    )}

                    {/* Display user's name and role */}
                    <span className="mr-4 text-gray-700">
                        Welcome, <span className="font-semibold">{user?.name || user?.sub}</span> ({user?.role})
                    </span>
                    
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="p-8">
                {/* Render the appropriate dashboard based on the user's role */}
                {renderDashboardByRole()}
            </main>
        </div>
    );
}

export default DashboardPage;