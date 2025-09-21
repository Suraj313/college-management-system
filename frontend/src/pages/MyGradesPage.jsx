import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { groupBy } from 'lodash';
import { AcademicCapIcon } from '@heroicons/react/24/solid'; 

function MyGradesPage() {
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchGradesAndCourses = async () => {
            if (!token) return;
            try {
                const [gradesRes, coursesRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/grades/my-grades', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://127.0.0.1:8000/courses/', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setGrades(gradesRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGradesAndCourses();
    }, [token]);

    const gradesByCourse = groupBy(grades, 'course_id');

    // Function to get a color based on the score
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your grades...</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 pb-4">My Grades Report</h1>
                
                {courses.length > 0 ? (
                    <div className="space-y-8">
                        {courses.map(course => {
                            const courseGrades = gradesByCourse[course.id] || [];
                            return (
                                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 bg-gray-100 border-b flex items-center gap-4">
                                        <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{course.name}</h2>
                                            <p className="font-mono text-sm text-gray-500">{course.code}</p>
                                        </div>
                                    </div>
                                    
                                    {courseGrades.length > 0 ? (
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {courseGrades.map(grade => (
                                                    <tr key={grade.id}>
                                                        <td className="px-6 py-4 font-semibold text-gray-700">{grade.assignment_name}</td>
                                                        <td className={`px-6 py-4 font-bold text-lg ${getScoreColor(grade.score)}`}>
                                                            {grade.score} <span className="text-sm font-normal text-gray-500">/ 100</span>
                                                        </td>
                                                        <td className="px-6 py-4 italic text-gray-600">{grade.comments || 'No comments'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="p-6 text-gray-500">No grades have been recorded for this course yet.</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You are not enrolled in any courses or no grades are available.</p>
                )}
            </div>
        </div>
    );
}

export default MyGradesPage;