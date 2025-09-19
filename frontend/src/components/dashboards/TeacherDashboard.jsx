import React from 'react';

function TeacherDashboard() {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800">
                Teacher Dashboard 🧑‍🏫
            </h2>
            <p className="text-gray-600">
                Welcome! From this dashboard, you can manage your courses, take student attendance,
                and grade assignments.
            </p>
            {/* Future components will go here */}
            {/* e.g., <CourseManager />, <AttendanceTaker /> */}
        </div>
    );
}

export default TeacherDashboard;