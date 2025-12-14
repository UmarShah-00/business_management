import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login({ setUserRole }) {
    function decodeJWT(token) {
        try {
            return JSON.parse(atob(token.split('.')[1])); // decode JWT payload
        } catch (e) {
            return null;
        }
    }
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("adminToken", res.data.token); // save JWT
            const decoded = decodeJWT(res.data.token);
            if (decoded && decoded.role) setUserRole(decoded.role);
            setMessage("Login successful!");
            // Redirect to dashboard or admin page
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setMessage(err.response?.data?.message || "Server error");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form onSubmit={handleLogin} className="space-y-4 md:space-y-6" action="/login" method="POST">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                value={email}
                                id="email"
                                placeholder="name@company.com"
                                required
                                autoComplete="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                value={password}
                                id="password"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="remember"
                                        aria-describedby="remember"
                                        type="checkbox"
                                        required
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none shadow"
                        >
                            Sign In
                        </button>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
