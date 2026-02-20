import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import ChatDashboardSidebar from "./Sidebar";

const ChatLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Large screens */}
      <div className="hidden h-screen lg:block w-64 lg:w-auto bg-gray-800 text-white">
        <ChatDashboardSidebar onClose={() => setOpen(false)} />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 lg:w-auto bg-gray-800 text-white transform 
        ${open ? "translate-x-0 z-30" : "-translate-x-full"} 
        transition-transform duration-300 lg:hidden`}
      >
        <ChatDashboardSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-bg border-b border-b-border px-4 py-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-text">FSD Monitoring</p>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-text" />
          </button>
        </header>

        {/* Content */}
        <main className=" flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
