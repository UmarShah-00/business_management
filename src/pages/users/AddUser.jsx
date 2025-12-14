import Sidebar from "../../components/Sidebar";
import DashboardDropDown from "../../components/DashboardDropDown";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
function AddUser({setUserRole, userRole}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔐 Password match check
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            // 🔑 Token get (localStorage se)
            const token = localStorage.getItem("adminToken");

            await axios.post(
                "http://localhost:5000/api/auth/add-user",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 👈 IMPORTANT
                    },
                }
            );

            alert("User added successfully");
          navigate("/admin-user")
            // 🧹 Form reset
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "",
            });
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error adding user");
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
                    <h1 className="text-3xl font-bold ">Create User</h1>
                    <Link to="/admin-user" className="text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none shadow">Back</Link>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-xl">
                    <form class="space-y-4" onSubmit={handleSubmit}>

                        {/* <!-- Name --> */}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            {/* <!-- Email --> */}
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    autocomplete="off"
                                    value={formData.email}
                                    onChange={handleChange}
                                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>


                        {/* <!-- Password --> */}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autocomplete="new-password"
                                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>
                        {/* <!-- Role --> */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select role</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        {/* <!-- Submit --> */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none shadow"
                            >
                                Add User
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUser;