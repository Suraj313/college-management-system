import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function AdminPage() {
    // State for dashboard data
    const [dashboardData, setDashboardData] = useState(null);
    // State for the user list
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const { token } = useAuth();

    // State for the new user form
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('teacher');
    const [formMessage, setFormMessage] = useState('');

    // State for managing which user's role is being edited
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        // This effect runs when the component mounts and anytime the 'token' value changes.
        if (!token) {
            return;
        }

        const fetchData = async () => {
            setError('');
            const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

            try {
                // Fetch dashboard data and user list in parallel
                const [dashboardRes, usersRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/admin/dashboard-data', authHeaders),
                    axios.get('http://127.0.0.1:8000/admin/users', authHeaders)
                ]);

                setDashboardData(dashboardRes.data);
                setUsers(usersRes.data);

            } catch (err) {
                setError('Failed to fetch admin data. Please ensure the backend is running and you have permissions.');
                console.error("API Fetch Error:", err);
            }
        };

        fetchData();
        
    }, [token]); 
    
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormMessage('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/admin/create-user', 
            { name: newName, email: newEmail, password: newPassword, role: newRole }, 
            { headers: { Authorization: `Bearer ${token}` } });

            setFormMessage(`Successfully created user: ${response.data.name}`);
            
            // Re-fetch users to update the list instantly
            const usersRes = await axios.get('http://127.0.0.1:8000/admin/users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(usersRes.data);
            
            // Clear form
            setNewName('');
            setNewEmail('');
            setNewPassword('');
        } catch (err) {
            setFormMessage('Failed to create user. Email may already exist.');
            console.error(err);
        }
    };

    const handleRoleChangeClick = (user) => {
        setEditingUserId(user.id);
        setSelectedRole(user.role);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
    };

    const handleSaveRole = async (userId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/admin/users/${userId}/role`, 
                { role: selectedRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh the user list to show the change
            const usersRes = await axios.get('http://127.0.0.1:8000/admin/users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(usersRes.data);
            setEditingUserId(null); // Exit editing mode
        } catch (err) {
            console.error("Failed to update role:", err);
            alert("Failed to update role. Please try again.");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
            {error && <p className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</p>}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">System Overview 🛡️</h2>
                        {dashboardData ? (
                            <div className="space-y-2 text-lg">
                                <p><strong>Active Users:</strong> {dashboardData.active_users}</p>
                                <p><strong>Total Courses:</strong> {dashboardData.courses_count}</p>
                            </div>
                        ) : (<p>Loading overview...</p>)}
                    </div>
                    
                    <div className="p-6 bg-white border rounded-lg shadow-lg">
                        <h3 className="mb-6 text-2xl font-bold text-gray-800">Create New User</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full Name" required className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" required className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password" required className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="teacher">Teacher</option>
                                <option value="hod">HOD</option>
                                <option value="student">Student</option>
                            </select>
                            <button type="submit" className="w-full p-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                                Create User
                            </button>
                            {formMessage && <p className="mt-4 text-center text-sm font-medium text-gray-700">{formMessage}</p>}
                        </form>
                    </div>
                </div>
                <div className="p-6 bg-white border rounded-lg shadow-lg">
                    <h3 className="mb-6 text-2xl font-bold text-gray-800">Manage Users</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">
                                            {editingUserId === user.id ? (
                                                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full p-1 border rounded bg-white">
                                                    <option value="student">student</option>
                                                    <option value="teacher">teacher</option>
                                                    <option value="hod">hod</option>
                                                   
                                                </select>
                                            ) : (
                                                <span className="font-mono text-sm">{user.role}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {editingUserId === user.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleSaveRole(user.id)} className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                                                    <button onClick={handleCancelEdit} className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleRoleChangeClick(user)} className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">Change Role</button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No users found or data is loading...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;