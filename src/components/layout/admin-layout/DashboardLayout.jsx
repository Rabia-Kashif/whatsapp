import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminLayoutSidebar from "./Sidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Large screens */}
      <div className="hidden h-screen lg:block w-64 bg-gray-800 text-white">
        <AdminLayoutSidebar onClose={() => setOpen(false)} />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform 
        ${open ? "translate-x-0 z-30" : "-translate-x-full"} 
        transition-transform duration-300 lg:hidden`}
      >
        <AdminLayoutSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-700">Hello FSD</p>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
