import React from 'react';

function SuperuserDashboard() {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800">
                Superuser Dashboard 👑
            </h2>
            <p className="text-gray-600">
                Welcome, Admin. You have complete control over the entire system, including user management,
                system settings, and global analytics.
            </p>
        </div>
    );
}

export default SuperuserDashboard;