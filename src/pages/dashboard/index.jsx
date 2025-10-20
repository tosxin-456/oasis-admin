import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/apiConfig";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    pendingUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE_URL}/movies`);
        const data = await res.json();

        if (res.ok) {
          const movies = Array.isArray(data.movies) ? data.movies : [];

          setStats({
            totalMovies: data.totalMovies || movies.length,
            totalSeries: data.totalSeries || 0,
            pendingUploads: data.pendingUploads || 0
          });
        } else {
          setError(data.message || "Failed to fetch stats");
        }
      } catch (err) {
        setError("Unable to connect to server. Please try again.");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-6 rounded-xl border border-[#333333] hover:border-[#21A9A9] transition-all duration-300 hover:shadow-lg hover:shadow-[#21A9A9]/20 group">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
          {title}
        </h2>
        <div
          className={`text-2xl opacity-60 group-hover:opacity-100 transition-opacity ${gradient}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold text-white mb-1">
        {value.toLocaleString()}
      </p>
      <div className="h-1 w-12 bg-gradient-to-r from-[#21A9A9] to-[#1A8989] rounded-full mt-3"></div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#21A9A9] to-[#1A8989] rounded-full"></div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400 ml-6">
            Welcome to your admin panel. Monitor your content and manage your
            platform efficiently.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <h3 className="text-red-400 font-semibold mb-1">
                Error Loading Stats
              </h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] animate-pulse"
              >
                <div className="h-4 bg-[#333333] rounded w-24 mb-4"></div>
                <div className="h-10 bg-[#333333] rounded w-16 mb-1"></div>
                <div className="h-1 bg-[#333333] rounded w-12 mt-3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Movies"
                value={stats.totalMovies}
                icon="🎬"
                gradient="text-[#21A9A9]"
              />
              <StatCard
                title="Series"
                value={stats.totalSeries}
                icon="📺"
                gradient="text-[#21A9A9]"
              />
              <StatCard
                title="Pending Uploads"
                value={stats.pendingUploads}
                icon="⏳"
                gradient="text-[#21A9A9]"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-xl border border-[#333333] p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-[#21A9A9]">⚡</span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Add Movie", icon: "➕" },
                  { label: "Manage Content", icon: "📋" },
                  { label: "View Analytics", icon: "📊" },
                  { label: "Settings", icon: "⚙️" }
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className="bg-[#0D0D0D] hover:bg-[#21A9A9]/20 border border-[#333333] hover:border-[#21A9A9] rounded-lg p-4 transition-all duration-300 text-left group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-[#21A9A9] transition-colors">
                      {action.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
