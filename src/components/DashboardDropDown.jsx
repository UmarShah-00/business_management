import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardDropDown({setUserRole}) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSignOut = () => {
    setUserRole(null);
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center">
      <div className="flex items-center ms-3 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo"
          />
        </button>

        {isOpen && user && (
          <div className="absolute right-0 z-50 top-8 mt-3 bg-neutral-primary-medium border rounded-base shadow-lg w-44">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-heading">{user.name}</p>
              <p className="text-sm text-body truncate">{user.email}</p>
            </div>
            <ul className="p-2 text-sm text-body font-medium">
              <li>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  LogOut
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
