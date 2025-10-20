// AppLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/sideBar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-lg">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (drawer style) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-lg z-50">
        <AdminSidebar mobile />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
