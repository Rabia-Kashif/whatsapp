import profile from "../../assets/images/profile_fallback.png";
import { bsIcons, riIcons } from "../../global/icons";
import userProfile from "../../assets/images/user.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAgentSessions } from "../../services/chat/chat.hooks";
import { formatDate } from "../../utils/dateFormatter";
import { useAppStore } from "../../../store/appStore";
const Sidebar = () => {
  const [threeMenuClicked, setThreeMenuClicked] = useState(false);
  const { data: agentSessions } = useGetAgentSessions();
  const setClientId = useAppStore((state) => state.setClientId);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <div className="w-[400px] h-screen bg-white border-r border-gray-300">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-gray-100">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={userProfile}
            alt="Profile"
            className="w-full h-full p-1 object-cover bg-gray-300"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setThreeMenuClicked(true)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <span className="h-20">{bsIcons.BsThreeDotsVertical}</span>
          </button>

          {threeMenuClicked && (
            <div className="absolute top-10 w-auto whitespace-nowrap  bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <ul>
                <li
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 font-semibold hover:bg-gray-50 rounded-md  cursor-pointer"
                >
                  <span className="text-rose-700">
                    {riIcons.RiLogoutCircleRLine}
                  </span>{" "}
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-gray-100 py-2 pl-10 pr-4 rounded-lg outline-none"
          />
          <p
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          >
            {bsIcons.BsSearch}
          </p>
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100vh-136px)]">
        {agentSessions?.map((chat) => (
          <div
            onClick={() => setClientId(chat.client_id)}
            key={chat.id}
            className="px-4 py-3 flex items-center border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <img
                src={profile}
                alt={chat.client_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{chat.client_name}</h3>
                <span className="text-xs text-gray-500">
                  {formatDate(chat.last_activity)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p
                  className={`text-sm truncate border rounded-md px-1 ${
                    chat.status === "active"
                      ? "text-green-500 bg-green-200 border-green-300"
                      : "text-gray-500 bg-gray-200 border-gray-300"
                  }`}
                >
                  {chat.status}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.unread_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
