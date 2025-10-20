import React, { useState } from "react";
import { API_BASE_URL } from "../../config/apiConfig";

const AdminNew = () => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [type, setType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/new_movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          year,
          downloadUrl,
          type,
          genre,
          description
        })
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(
          `${type === "movie" ? "Movie" : "Series"} added successfully!`,
          true
        );
        setTitle("");
        setYear("");
        setDownloadUrl("");
        setGenre("");
        setDescription("");
        setType("movie");
      } else {
        showNotification(data.message || "Failed to add content", false);
      }
    } catch (err) {
      console.error("Error adding new content:", err);
      showNotification("Error connecting to server. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setYear("");
    setDownloadUrl("");
    setGenre("");
    setDescription("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-black min-h-screen text-white p-6 md:ml-64">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#21A9A9] to-[#1A8989] rounded-full"></div>
            <h1 className="text-3xl font-bold">Add New Content</h1>
          </div>
          <p className="text-gray-400 ml-6">
            Add a new movie or series to your platform
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              notification.isSuccess
                ? "bg-green-900/20 border-green-500/50"
                : "bg-red-900/20 border-red-500/50"
            }`}
          >
            <span className="text-2xl">
              {notification.isSuccess ? "✅" : "⚠️"}
            </span>
            <div className="flex-1">
              <p
                className={`text-sm ${
                  notification.isSuccess ? "text-green-300" : "text-red-300"
                }`}
              >
                {notification.message}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-8 rounded-xl border border-[#333333]">
          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Content Type
            </label>
            <div className="flex gap-4">
              {["movie", "series"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                    type === t
                      ? "border-[#21A9A9] bg-[#21A9A9]/10"
                      : "border-[#333333] hover:border-[#555555]"
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {t === "movie" ? "🎬" : "📺"}
                  </div>
                  <div className="text-sm font-medium capitalize">{t}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-black border border-[#333333] text-white focus:border-[#21A9A9] focus:outline-none focus:ring-2 focus:ring-[#21A9A9]/20 transition-all"
              placeholder={`Enter ${type} title`}
              required
            />
          </div>

          {/* Year and Genre Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Year <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={currentYear + 1}
                className="w-full p-3 rounded-lg bg-black border border-[#333333] text-white focus:border-[#21A9A9] focus:outline-none focus:ring-2 focus:ring-[#21A9A9]/20 transition-all"
                placeholder="e.g., 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Genre
              </label>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 rounded-lg bg-black border border-[#333333] text-white focus:border-[#21A9A9] focus:outline-none focus:ring-2 focus:ring-[#21A9A9]/20 transition-all"
                placeholder="e.g., Action, Drama"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-black border border-[#333333] text-white focus:border-[#21A9A9] focus:outline-none focus:ring-2 focus:ring-[#21A9A9]/20 transition-all resize-none"
              placeholder={`Brief description of the ${type}`}
            />
          </div>

          {/* Download URL */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Download URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-black border border-[#333333] text-white focus:border-[#21A9A9] focus:outline-none focus:ring-2 focus:ring-[#21A9A9]/20 transition-all font-mono text-sm"
              placeholder="https://example.com/download-link"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !title || !year || !downloadUrl}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#21A9A9] to-[#1A8989] hover:from-[#1A8989] hover:to-[#21A9A9] text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save {type === "movie" ? "Movie" : "Series"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-[#333333] hover:bg-[#444444] text-white font-semibold transition-all duration-300 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNew;
