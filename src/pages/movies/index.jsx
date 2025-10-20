import React, { useState } from "react";
import { Search, Film, Tv, X, Check } from "lucide-react";

const API_KEY = "49e8f09b8364cf1348ed4f97e81039bb";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const API_BASE_URL = "http://localhost:5000/api";

const AdminMovies = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 4000);
  };

  const searchMovies = async () => {
    if (!query.trim()) {
      showNotification("Please enter a search query", false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`
      );
      const data = await res.json();
      const filtered = (data.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults(filtered);

      if (filtered.length === 0) {
        showNotification("No results found", false);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      showNotification("Error connecting to TMDB", false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  };

  const handleAddDownload = async () => {
    if (!downloadUrl.trim()) {
      showNotification("Please provide a download link", false);
      return;
    }

    setIsSaving(true);

    try {
      const type = selectedMovie.media_type === "tv" ? "series" : "movie";

      const response = await fetch(`${API_BASE_URL}/new_movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovie.id,
          title: selectedMovie.title || selectedMovie.name,
          year:
            selectedMovie.release_date || selectedMovie.first_air_date
              ? (
                  selectedMovie.release_date || selectedMovie.first_air_date
                ).split("-")[0]
              : "N/A",
          downloadUrl,
          type,
          poster: selectedMovie.poster_path
            ? `${IMAGE_BASE}${selectedMovie.poster_path}`
            : null,
          overview: selectedMovie.overview
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          `${type === "series" ? "Series" : "Movie"} added successfully!`,
          true
        );
        setShowModal(false);
        setDownloadUrl("");
        setSelectedMovie(null);
      } else {
        showNotification(data.message || "Failed to add download link", false);
      }
    } catch (err) {
      console.error("Error adding download link:", err);
      showNotification("Server error while adding content", false);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredResults = results.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "movie") return item.media_type === "movie";
    if (filterType === "series") return item.media_type === "tv";
    return true;
  });

  return (
    <div className="bg-black min-h-screen text-white p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
            <h1 className="text-3xl font-bold">Manage Movies & Series</h1>
          </div>
          <p className="text-gray-400 ml-6">
            Search TMDB and add download links to your content
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

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-xl border border-zinc-800 mb-8">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for movies or series on TMDB..."
                className="w-full p-3 pl-10 rounded-lg bg-black border border-zinc-800 text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
            </div>
            <button
              onClick={searchMovies}
              disabled={isSearching}
              className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 rounded-lg hover:from-teal-600 hover:to-teal-500 flex items-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Filter Buttons */}
          {results.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "All", icon: "🎭" },
                { value: "movie", label: "Movies", icon: "🎬" },
                { value: "series", label: "Series", icon: "📺" }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === filter.value
                      ? "bg-teal-500 text-white"
                      : "bg-black text-gray-400 hover:bg-zinc-900"
                  }`}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
              <div className="ml-auto text-sm text-gray-400 flex items-center">
                {filteredResults.length} result
                {filteredResults.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredResults.map((movie) => (
              <div
                key={movie.id}
                className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-zinc-800 overflow-hidden hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 group"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-black">
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE}${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                      {movie.media_type === "tv" ? (
                        <Tv size={48} />
                      ) : (
                        <Film size={48} />
                      )}
                      <span className="text-xs mt-2">No Image</span>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                    {movie.media_type === "tv" ? (
                      <>
                        <Tv size={12} />
                        <span>Series</span>
                      </>
                    ) : (
                      <>
                        <Film size={12} />
                        <span>Movie</span>
                      </>
                    )}
                  </div>

                  {/* Rating */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {movie.release_date || movie.first_air_date
                      ? (movie.release_date || movie.first_air_date).split(
                          "-"
                        )[0]
                      : "N/A"}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedMovie(movie);
                      setShowModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-teal-500 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300 text-sm font-semibold"
                  >
                    <span>🔗</span>
                    <span>Add Link</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">
              {query ? "No results found" : "Start searching"}
            </h3>
            <p className="text-gray-500">
              {query
                ? "Try a different search term"
                : "Search for movies or series to add to your platform"}
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedMovie && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl w-full max-w-lg border border-zinc-800 overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h2 className="text-xl font-bold mb-1">
                      Add Download Link
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {selectedMovie.title || selectedMovie.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setDownloadUrl("");
                      setSelectedMovie(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Movie Info */}
                <div className="flex gap-4 mb-6">
                  {selectedMovie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE}${selectedMovie.poster_path}`}
                      alt={selectedMovie.title || selectedMovie.name}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-28 bg-zinc-800 rounded-lg flex items-center justify-center">
                      {selectedMovie.media_type === "tv" ? (
                        <Tv size={32} className="text-gray-600" />
                      ) : (
                        <Film size={32} className="text-gray-600" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      {selectedMovie.title || selectedMovie.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {selectedMovie.release_date ||
                      selectedMovie.first_air_date
                        ? (
                            selectedMovie.release_date ||
                            selectedMovie.first_air_date
                          ).split("-")[0]
                        : "N/A"}
                    </p>
                    <div className="inline-flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded text-xs">
                      {selectedMovie.media_type === "tv" ? (
                        <>
                          <Tv size={12} />
                          <span>Series</span>
                        </>
                      ) : (
                        <>
                          <Film size={12} />
                          <span>Movie</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Download URL Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Download URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/download/..."
                    className="w-full p-3 rounded-lg bg-black border border-zinc-800 text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter a valid download link for this content
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setDownloadUrl("");
                      setSelectedMovie(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDownload}
                    disabled={isSaving || !downloadUrl.trim()}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>Add Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovies;
