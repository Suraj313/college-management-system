import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function ViewAttendancePage() {
    const [courses, setCourses] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [loadingRecords, setLoadingRecords] = useState(false); 
    const { token } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://127.0.0.1:8000/courses/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            }
        };
        fetchCourses();
    }, [token]);

    const handleFetchAttendance = async () => {
        if (!selectedCourse || !selectedDate) {
            setError('Please select a course and a date.');
            setRecords([]);
            return;
        }
        setError('');
        setRecords([]);
        setLoadingRecords(true); // Start loading
        try {
            const res = await axios.get(`http://127.0.0.1:8000/reports/attendance/courses/${selectedCourse}/date/${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecords(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No attendance records found for this course and date.');
            } else {
                setError('Failed to fetch attendance data. Please try again.');
            }
            console.error("Failed to fetch attendance records", err);
        } finally {
            setLoadingRecords(false); // End loading
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 pb-4">View Class Attendance Report</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Course and Date</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <select 
                        onChange={(e) => setSelectedCourse(e.target.value)} 
                        value={selectedCourse} 
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    >
                        <option value="">-- Select Course --</option>
                        {courses.map(course => <option key={course.id} value={course.id}>{course.name} ({course.code})</option>)}
                    </select>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                    />
                    <button 
                        onClick={handleFetchAttendance} 
                        className="p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
                        disabled={loadingRecords || !selectedCourse || !selectedDate}
                    >
                        {loadingRecords ? 'Fetching...' : 'Fetch Attendance'}
                    </button>
                </div>
                {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">{error}</p>}
            </div>

            {records.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Records for {courses.find(c => c.id == selectedCourse)?.name} on {selectedDate}</h2>
                    <table className="min-w-full bg-white border-collapse">
                         <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {records.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.student_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                                              record.status === 'absent' ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loadingRecords && !error && records.length === 0 && selectedCourse && selectedDate && (
                <p className="mt-6 text-center text-gray-600">No attendance data to display. Select a course and date, then click "Fetch Attendance".</p>
            )}
        </div>
    );
}

export default ViewAttendancePage;