import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function CoursePage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();

    // State for the form
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    
    // State to track if we are editing or creating a course
    const [editingCourseId, setEditingCourseId] = useState(null);

    // Function to fetch all courses from the backend
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/courses/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
            setError(''); // Clear any previous errors on success
        } catch (err) {
            setError('Failed to fetch courses.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses when the component mounts or the token changes
    useEffect(() => {
        if (token) {
            fetchCourses();
        }
    }, [token]);

    // function handles both creating a new course and updating an existing one
    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = { name: courseName, code: courseCode, description: courseDescription };
        
        try {
            if (editingCourseId) {
                // UPDATE logic
                await axios.put(`http://127.0.0.1:8000/courses/${editingCourseId}`, courseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // CREATE logic
                await axios.post('http://127.0.0.1:8000/courses/', courseData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            resetFormAndFetchCourses();
        } catch (err) {
            alert(`Failed to ${editingCourseId ? 'update' : 'create'} course. The course code may already exist.`);
        }
    };
    
    // Handler to populate the form when the "Edit" button is clicked
    const handleEditClick = (course) => {
        setEditingCourseId(course.id);
        setCourseName(course.name);
        setCourseCode(course.code);
        setCourseDescription(course.description || ''); // Handle null descriptions
    };

    // Function to clear the form and reset to "Create" mode
    const resetFormAndFetchCourses = () => {
        setEditingCourseId(null);
        setCourseName('');
        setCourseCode('');
        setCourseDescription('');
        fetchCourses();
    };

    // Handler to delete a course
    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to permanently delete this course?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/courses/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCourses(); // Refresh the course list
            } catch (err) {
                alert('Failed to delete course.');
            }
        }
    };

    if (loading) return <div className="p-8">Loading courses...</div>;
    if (error) return <div className="p-8 text-red-500 bg-red-100 rounded-md">{error}</div>;

    // Determine if the current user has permission to manage courses
    const canManageCourses = user && (user.role === 'hod' || user.role === 'superuser');

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">Course Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
                <div className="lg:col-span-2 p-6 bg-white border rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">All Courses</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Code</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    {canManageCourses && <th className="px-4 py-2 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 font-mono">{course.code}</td>
                                        <td className="px-4 py-2 font-semibold">{course.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{course.description}</td>
                                        {canManageCourses && (
                                            <td className="px-4 py-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(course)} 
                                                        className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    {user.role === 'superuser' && (
                                                        <button 
                                                            onClick={() => handleDeleteCourse(course.id)} 
                                                            className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {canManageCourses && (
                    <div className="p-6 bg-white border rounded-lg shadow-lg h-fit">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingCourseId ? 'Update Course' : 'Create New Course'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="Course Code (e.g., CS101)" required className="block w-full p-2 border rounded-md" />
                            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course Name" required className="block w-full p-2 border rounded-md" />
                            <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} placeholder="Description" rows="4" className="block w-full p-2 border rounded-md" />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-grow p-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                                    {editingCourseId ? 'Update Course' : 'Add Course'}
                                </button>
                                {editingCourseId && (
                                    <button type="button" onClick={resetFormAndFetchCourses} className="p-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoursePage;