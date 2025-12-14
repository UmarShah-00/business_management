import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import DashboardDropDown from "../../components/DashboardDropDown";
function EditUser({ userRole, setUserRole }) {
    const { id } = useParams(); // 🔹 user id from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
    });

    // 🔹 Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get(
                    `http://localhost:5000/api/auth/users/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFormData({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    role: res.data.role || "",
                    password: "",
                    confirmPassword: "",
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, [id]);

    // 🔹 handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 submit update
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔐 password match check
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            const token = localStorage.getItem("adminToken");

            await axios.put(
                `http://localhost:5000/api/auth/users/${id}`,
                {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password || undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("User updated successfully");
            navigate("/admin-user");
        } catch (error) {
            alert(error.response?.data?.message || "Server error");
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
            <div className="p-4 sm:ml-64 mt-14 mx-auto">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                <div className="w-full bg-white p-6 rounded-lg shadow-xl">
                    <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full border p-2 rounded"
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autocomplete="off"
                            placeholder="Email"
                            className="w-full border p-2 rounded"
                        />

                        {/* Role */}
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>

                        {/* Password */}
                        <input
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="New Password (optional)"
                            className="w-full border p-2 rounded"
                        />

                        {/* Confirm Password */}
                        <input
                            type="password"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="w-full border p-2 rounded"
                        />

                       <div className="flex justify-end">
                         <button className="bg-purple-500 font-semibold text-white px-4 py-2 rounded">
                            Update User
                        </button>
                       </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default EditUser;
