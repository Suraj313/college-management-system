import React from 'react';

function StudentDashboard() {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800">
                Student Dashboard 🎓
            </h2>
            <p className="text-gray-600">
                Welcome to your dashboard! Here you can view your courses, check your attendance,
                and see your grades.
            </p>
            {/* Future components will go here */}
            {/* e.g., <MyCourses />, <MyGrades /> */}
        </div>
    );
}

export default StudentDashboard;