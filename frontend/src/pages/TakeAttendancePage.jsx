import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function TakeAttendancePage() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({}); 
    const [message, setMessage] = useState('');
    const { token } = useAuth();

    // Fetch courses to populate the dropdown
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
            // Initialize attendance state for each student
            const initialAttendance = res.data.reduce((acc, student) => {
                acc[student.id] = 'present'; // Default to 'present'
                return acc;
            }, {});
            setAttendance(initialAttendance);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const records = Object.entries(attendance).map(([student_id, status]) => ({
            student_id: parseInt(student_id),
            status,
        }));

        try {
            await axios.post(`http://127.0.0.1:8000/attendance/courses/${selectedCourse}/date/${selectedDate}`,
                { records },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Attendance submitted successfully!');
        } catch (error) {
            setMessage('Failed to submit attendance.');
            console.error(error);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Take Attendance</h1>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex gap-4 mb-6">
                    <select onChange={(e) => handleCourseSelect(e.target.value)} value={selectedCourse} className="p-2 border rounded-md w-1/2">
                        <option value="">-- Select a Course --</option>
                        {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                    </select>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-2 border rounded-md w-1/2" />
                </div>
                
                {students.length > 0 && (
                    <form onSubmit={handleSubmit}>
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Student Name</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} className="border-b">
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-4">
                                                <label><input type="radio" name={`status-${student.id}`} value="present" checked={attendance[student.id] === 'present'} onChange={() => handleStatusChange(student.id, 'present')} /> Present</label>
                                                <label><input type="radio" name={`status-${student.id}`} value="absent" checked={attendance[student.id] === 'absent'} onChange={() => handleStatusChange(student.id, 'absent')} /> Absent</label>
                                                <label><input type="radio" name={`status-${student.id}`} value="late" checked={attendance[student.id] === 'late'} onChange={() => handleStatusChange(student.id, 'late')} /> Late</label>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="submit" className="mt-6 w-full p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit Attendance</button>
                        {message && <p className="mt-4 text-center">{message}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default TakeAttendancePage;