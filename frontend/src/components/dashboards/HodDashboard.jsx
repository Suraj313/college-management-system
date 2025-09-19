import React from 'react';

function HodDashboard() {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800">
                HOD Dashboard 🏛️
            </h2>
            <p className="text-gray-600">
                Welcome, Head of Department. You can oversee all courses, manage faculty,
                and view analytics and reports from this portal.
            </p>
            {/* Future components will go here */}
            {/* e.g., <FacultyManagement />, <AnalyticsReports /> */}
        </div>
    );
}

export default HodDashboard;