import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function MyAttendancePage() {
    const [courses, setCourses] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchAllData = async () => {
            if (!token) return;
            try {
                // 1. Fetch all courses
                const coursesRes = await axios.get('http://127.0.0.1:8000/courses/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(coursesRes.data);

                // 2. For each course, fetch the student's attendance
                const attendancePromises = coursesRes.data.map(course =>
                    axios.get(`http://127.0.0.1:8000/attendance/my-attendance/courses/${course.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );
                
                const attendanceResults = await Promise.all(attendancePromises);
                
                const newAttendanceData = {};
                coursesRes.data.forEach((course, index) => {
                    newAttendanceData[course.id] = attendanceResults[index].data;
                });
                setAttendanceData(newAttendanceData);

            } catch (error) {
                console.error("Failed to fetch attendance data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [token]);
    
    if (loading) return <div className="p-8">Loading your attendance...</div>;

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">My Attendance</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => {
                    const records = attendanceData[course.id] || [];
                    const presentCount = records.filter(r => r.status === 'present').length;
                    const totalCount = records.length;
                    const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(0) : 'N/A';

                    return (
                        <div key={course.id} className="p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800">{course.name}</h2>
                            <p className="font-mono text-sm text-gray-500 mb-4">{course.code}</p>
                            {totalCount > 0 ? (
                                <div>
                                    <p className="text-4xl font-bold text-green-600">{percentage}%</p>
                                    <p className="text-gray-600">Present ({presentCount} / {totalCount} classes)</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No attendance records found.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyAttendancePage;