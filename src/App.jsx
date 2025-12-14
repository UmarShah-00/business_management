import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login.jsx';
import Dashboard from "./pages/AdminDashboard/Dashboard.jsx";
import StaffDashboard from "./pages/AdminDashboard/StaffDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminUsers from "./pages/users/AdminUsers.jsx";
import AddUser from "./pages/users/AddUser.jsx";
import EditUser from "./pages/users/EditUser.jsx";
import { useState, useEffect } from "react";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      const decodeJWT = (token) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };
      const decoded = decodeJWT(token);
      if (decoded && decoded.role) {
        setUserRole(decoded.role);
      }
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/admin/login' element={<Login setUserRole={setUserRole} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {userRole === "admin" ? (
                  <Dashboard userRole={userRole} setUserRole={setUserRole} />
                ) : (
                  <StaffDashboard userRole={userRole} setUserRole={setUserRole} />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-user"
            element={
              <ProtectedRoute>
                {userRole === 'admin' ? (<AdminUsers setUserRole={setUserRole} userRole={userRole} />) : (<Navigate to="/dashboard" replace />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute>
                {userRole === 'admin' ? (<AddUser setUserRole={setUserRole} userRole={userRole} />) : (<Navigate to="/dashboard" replace />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-user/:id"
            element={
              <ProtectedRoute>
               {userRole === 'admin' ? (<EditUser setUserRole={setUserRole} userRole={userRole} />) : (<Navigate to="/dashboard" replace />)}
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
