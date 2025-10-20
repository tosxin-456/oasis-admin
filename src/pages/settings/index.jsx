import React, { useState } from "react";
import {
  Settings,
  UserPlus,
  User,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";
import { API_BASE_URL } from "../../config/apiConfig";



const AdminSettings = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setMessage("Please fill in all fields");
      setIsSuccess(false);
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsSuccess(false);
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("New admin created successfully!");
        setFormData({ username: "", password: "" });
        setTimeout(() => setMessage(""), 4000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Failed to create admin");
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setIsSuccess(false);
      setMessage("Error connecting to server");
      setTimeout(() => setMessage(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 md:ml-64">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
          </div>
          <p className="text-gray-400 ml-6">
            Manage administrative accounts and system settings
          </p>
        </div>

        {/* Notification Banner */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              isSuccess
                ? "bg-green-900/20 border-green-500/50"
                : "bg-red-900/20 border-red-500/50"
            }`}
          >
            <span className="text-2xl">{isSuccess ? "✅" : "⚠️"}</span>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isSuccess ? "text-green-300" : "text-red-300"
                }`}
              >
                {message}
              </p>
            </div>
            <button
              onClick={() => setMessage("")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <AlertCircle size={18} />
            </button>
          </div>
        )}

        {/* Create Admin Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-zinc-800 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-500/10 rounded-lg">
              <UserPlus className="text-teal-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Admin</h2>
              <p className="text-sm text-gray-400">
                Add a new administrator to the system
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-start gap-3">
            <Shield className="text-blue-400 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-blue-300">
              Only superadmins can create new admin accounts. The new admin will
              have full access to the system.
            </p>
          </div>

          <div className="space-y-5">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-white placeholder-gray-500 transition-all"
                  placeholder="Enter admin username"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Choose a unique username for the new admin
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-white placeholder-gray-500 transition-all"
                  placeholder="Enter secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Minimum 6 characters required
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setFormData({ username: "", password: "" })}
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || !formData.username || !formData.password
                }
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-teal-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Admin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Settings Section (Optional) */}
        <div className="mt-6 bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings size={20} className="text-teal-500" />
            System Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-gray-400">Current User</span>
              <span className="text-white font-medium">Administrator</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-gray-400">Access Level</span>
              <span className="text-teal-400 font-medium">Super Admin</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Total Admins</span>
              <span className="text-white font-medium">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
