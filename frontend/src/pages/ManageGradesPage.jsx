import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function ManageGradesPage() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [grades, setGrades] = useState({}); 
    const [message, setMessage] = useState('');
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
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        };
        fetchCourses();
    }, [token]);

    // Fetch students when a course is selected
    const handleCourseSelect = async (courseId) => {
        setSelectedCourse(courseId);
        if (!courseId) {
            setStudents([]);
            return;
        }
        try {
            const res = await axios.get(`http://127.0.0.1:8000/courses/${courseId}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
            // Initialize grades state
            const initialGrades = res.data.reduce((acc, student) => {
                acc[student.id] = { score: '', comments: '' };
                return acc;
            }, {});
            setGrades(initialGrades);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const handleGradeChange = (studentId, field, value) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!assignmentName) {
            setMessage('Please enter an assignment name.');
            return;
        }

        const gradeSubmissionPromises = Object.entries(grades)
            .filter(([studentId, grade]) => grade.score !== '') // Only submit grades that have a score
            .map(([studentId, grade]) => {
                return axios.post(`http://127.0.0.1:8000/grades/courses/${selectedCourse}`, {
                    student_id: parseInt(studentId),
                    assignment_name: assignmentName,
                    score: parseFloat(grade.score),
                    comments: grade.comments
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            });

        try {
            await Promise.all(gradeSubmissionPromises);
            setMessage('Grades submitted successfully!');
        } catch (error) {
            setMessage('Failed to submit some grades.');
            console.error(error);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Manage Grades</h1>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <select onChange={(e) => handleCourseSelect(e.target.value)} value={selectedCourse} className="p-2 border rounded-md">
                        <option value="">-- Select a Course --</option>
                        {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                    </select>
                    <input type="text" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} placeholder="Assignment Name (e.g., Midterm)" className="p-2 border rounded-md" />
                </div>
                
                {students.length > 0 && (
                    <form onSubmit={handleSubmit}>
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Student Name</th>
                                    <th className="px-4 py-2 text-left w-1/4">Score (out of 100)</th>
                                    <th className="px-4 py-2 text-left">Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} className="border-b">
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">
                                            <input type="number" min="0" max="100" step="0.5" value={grades[student.id]?.score || ''} onChange={(e) => handleGradeChange(student.id, 'score', e.target.value)} className="w-full p-1 border rounded-md" />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input type="text" value={grades[student.id]?.comments || ''} onChange={(e) => handleGradeChange(student.id, 'comments', e.target.value)} className="w-full p-1 border rounded-md" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="submit" className="mt-6 w-full p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Grades</button>
                        {message && <p className="mt-4 text-center">{message}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default ManageGradesPage;