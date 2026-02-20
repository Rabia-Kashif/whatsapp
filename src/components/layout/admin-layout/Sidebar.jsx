import { useNavigate, useLocation } from "react-router-dom";
import { mdIcons } from "../../../global/icons";

const sidebarItems = [
  {
    module: "Agents",
    icon: mdIcons.MdSupportAgent,
    label: "Agents",
    route: "/admin-dashboard/agents",
  },
];

const AdminLayoutSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    localStorage.removeItem("agent_id");
    localStorage.removeItem("username");

    navigate("/", { replace: true });
  };

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-between py-4 px-5 border-b border-gray-100">
        <p className="text-lg font-semibold text-gray-700">FSD Monitoring</p>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition"
          >
            ✕
          </button>
        )}
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.route;

            return (
              <li key={index}>
                <div
                  onClick={() => {
                    navigate(item.route);
                    onClose && onClose();
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                    ${isActive ? "bg-[#336699]/10" : "hover:bg-gray-100"}`}
                >
                  <p
                    className={`text-lg ${
                      isActive ? "text-[#336699]" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </p>

                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-[#336699]" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50"
        >
          <p className="text-lg text-red-500">{mdIcons.MdLogout}</p>

          <span className="text-sm font-medium text-red-500">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutSidebar;
