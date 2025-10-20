import React, { useState, useEffect } from "react";
import {
  Film,
  Home,
  Plus,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load admin details from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const links = [
    { to: "/admin", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/admin/movies", label: "Movies/Series", icon: <Film size={18} /> },
    { to: "/admin/new", label: "Add New", icon: <Plus size={18} /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings size={18} /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-3 text-white bg-gradient-to-r from-teal-500 to-teal-600 fixed top-4 left-4 z-50 rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-black via-zinc-950 to-black border-r border-zinc-800 transform 
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 z-40 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
              <Film size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Content Management</p>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white w-[40px]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {admin?.username || "Administrator"}
              </p>
              <p className="text-xs text-gray-400">
                {admin ? "Super Admin" : "Guest"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {links.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg shadow-teal-500/20"
                      : "text-gray-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <span
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-teal-400"
                    } transition-colors`}
                  >
                    {icon}
                  </span>
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight size={16} className="text-white" />
                  )}
                  {!isActive && (
                    <ChevronRight
                      size={16}
                      className="text-transparent group-hover:text-gray-400 transition-colors"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          {/* Quick Stats */}
          <div className="mb-3 p-3 bg-zinc-900/50 rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Status</span>
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Last Login</span>
              <span className="text-gray-300">Just now</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 p-3 w-full text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 group border border-zinc-800 hover:border-red-600"
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
