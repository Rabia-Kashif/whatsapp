import profile from "../../assets/images/profile_fallback.png";
import { bsIcons, faIcons, piIcons } from "../../global/icons";
import { useNavigate } from "react-router-dom";
import { useGetAgentSessions } from "../../services/chat/chat.hooks";
import { formatDate } from "../../utils/dateFormatter";
import { useAppStore } from "../../../store/appStore";
import { toSentenceCase } from "../../utils/SentenceCase";
const Sidebar = () => {
  const { data: agentSessions } = useGetAgentSessions();
  const { clientId, setClientId, setSessionStatus } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <div className="relative w-[400px] h-screen bg-white border-r border-gray-300">
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
            onClick={() => {
              setClientId(chat.client_id);
              setSessionStatus(chat?.status);
            }}
            key={chat.id}
            className={`${
              clientId === chat.client_id && "bg-[#f0f5f8]"
            } px-5 py-4 flex items-center border-b border-gray-200 hover:bg-linear-to-r hover:from-blue-50 hover:to-transparent cursor-pointer transition-all duration-200 group`}
          >
            <div className="relative mr-4">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-[#4c73ad] transition-all">
                <img
                  src={profile}
                  alt={chat.client_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {chat.status === "active" && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-gray-900 truncate pr-2">
                  {chat.client_name}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(chat.last_activity)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      chat.status === "active"
                        ? "text-green-700 bg-green-100"
                        : "text-gray-600 bg-gray-200"
                    }`}
                  >
                    {toSentenceCase(chat.status)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#0F52BA]">
                    {chat.total_sessions} session
                    {chat.total_sessions !== 1 ? "s" : ""}
                  </span>
                </div>
                {chat.unread_count > -1 && (
                  <span className="bg-[#37a037] text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold shadow-sm">
                    {chat.unread_count > 99 ? "99+" : chat.unread_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="absolute bottom-0 w-full h-16 px-4 flex items-center justify-between border-t border-gray-300 bg-gray-100">
        <div className="flex items-center gap-2 ">
          <span className="rounded-full overflow-hidden bg-gray-200 p-2">
            {" "}
            {faIcons.FaUser}
          </span>{" "}
          {localStorage.getItem("username")}
        </div>

        <div className="whitespace-nowrap">
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 px-4 py-2 text-xl rounded-md text-gray-800 cursor-pointer"
          >
            {piIcons.PiSignOutFill}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
