import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function ViewGradesPage() {
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // Fetch courses for the dropdown
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

    const handleFetchGrades = async () => {
        if (!selectedCourse) {
            setError('Please select a course.');
            setGrades([]);
            return;
        }
        setLoading(true);
        setError('');
        setGrades([]);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/reports/grades/courses/${selectedCourse}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGrades(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No grades found for this course.');
            } else {
                setError('Failed to fetch grades data. Please try again.');
            }
            console.error("Failed to fetch grades", err);
        } finally {
            setLoading(false);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id == courseId);
        return course ? `${course.name} (${course.code})` : 'Unknown Course';
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 pb-4">View Course Grades Report</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Course</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* This is the single, correct dropdown menu */}
                    <select 
                        onChange={(e) => setSelectedCourse(e.target.value)} 
                        value={selectedCourse} 
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    >
                        <option value="">-- Select a Course --</option>
                        {courses.map(course => <option key={course.id} value={course.id}>{course.name} ({course.code})</option>)}
                    </select>
                    <button 
                        onClick={handleFetchGrades} 
                        className="p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
                        disabled={loading || !selectedCourse}
                    >
                        {loading ? 'Fetching...' : 'Fetch Grades'}
                    </button>
                </div>
                {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">{error}</p>}
            </div>

            {grades.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Grades for {getCourseName(selectedCourse)}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Assignment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Comments</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {grades.map(grade => (
                                    <tr key={grade.id} className="hover:bg-gray-50 transition duration-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.student_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{grade.assignment_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{grade.score}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 italic">{grade.comments || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewGradesPage;