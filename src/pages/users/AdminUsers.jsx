import Sidebar from "../../components/Sidebar";
import DashboardDropDown from "../../components/DashboardDropDown";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
function AdminUsers({ setUserRole, userRole }) {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("http://localhost:5000/api/auth/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("adminToken");
            await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("User deleted successfully");

            // Remove deleted user from local state
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error deleting user");
        }
    };
    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="top-bar-sidebar" data-drawer-toggle="top-bar-sidebar" aria-controls="top-bar-sidebar" type="button" className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                                </svg>
                            </button>
                            {/* <a href="/dashboard" className="flex ms-2 md:me-24">
                            <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white"></span>
                          </a> */}
                        </div>
                        <DashboardDropDown setUserRole={setUserRole} />
                    </div>
                </div>
            </nav>
            {/* sidebar */}
            <Sidebar setUserRole={setUserRole} userRole={userRole} />

            <div className="p-4 sm:ml-64 mt-14 ">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold ">Users</h1>
                    <Link to="/add-user" className="text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none shadow">Create User</Link>
                </div>
                <table className="border-collapse border border-gray-400 w-full mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-2 py-1">#</th>
                            <th className="border border-gray-300 px-2 py-1">Name</th>
                            <th className="border border-gray-300 px-2 py-1">Email</th>
                            <th className="border border-gray-300 px-2 py-1">Role</th>
                            <th className="border border-gray-300 px-2 py-1">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="text-center">
                                <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                                <td className="border border-gray-300 px-2 py-1">{user.name}</td>
                                <td className="border border-gray-300 px-2 py-1">{user.email}</td>
                                <td className="border border-gray-300 px-2 py-1">{user.role}</td>
                                <td className="border border-gray-300 px-2 py-1">
                                    {/* 🔹 Actions like Edit/Delete can go here */}
                                    <Link
                                        to={`/edit-user/${user._id}`}
                                        className="bg-blue-900 font-semibold text-white px-2 mr-2 py-1 rounded"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={user.role !== 'admin' ? () => handleDelete(user._id) : undefined}
                                        disabled={user.role === 'admin'}
                                        className={`px-2 py-1 rounded font-semibold text-white ${user.role === 'admin' ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;