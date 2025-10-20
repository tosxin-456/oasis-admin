import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import AdminDashboard from "./pages/dashboard";
import AdminMovies from "./pages/movies";
import AdminNew from "./pages/add new";
import AdminSettings from "./pages/settings";
import AdminSidebar from "./components/sideBar";
import Login from "./pages/login";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex-1 p-4">
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="movies" element={<AdminMovies />} />
                    <Route path="new" element={<AdminNew />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
