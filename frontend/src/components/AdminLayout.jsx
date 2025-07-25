import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/authContext";

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    // Add more admin routes here if needed
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden w-full bg-white shadow px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Admin</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (mobile) */}
      {mobileMenuOpen && (
        <aside className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="bg-white w-64 h-full p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded hover:bg-blue-50 ${
                    isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""
                  }`
                }
              >
                <span className="mr-2">{icon}</span>
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center w-full text-red-600 px-4 py-2 hover:bg-red-50 rounded"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white p-6 shadow">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2 flex-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded hover:bg-blue-50 ${
                  isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""
                }`
              }
            >
              <span className="mr-2">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center mt-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
