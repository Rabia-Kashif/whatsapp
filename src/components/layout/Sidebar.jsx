import profile from "../../assets/images/profile_fallback.png";
import { bsIcons, faIcons, piIcons } from "../../global/icons";
import { useNavigate } from "react-router-dom";
import { useGetAgentSessions } from "../../services/chat/chat.hooks";
import { formatDate } from "../../utils/dateFormatter";
import { useAppStore } from "../../../store/appStore";
import { toSentenceCase } from "../../utils/SentenceCase";
import { useState } from "react";
import Modal from "../Modals/Modal";
import LogoutAlertModal from "../Modals/LogoutAlertModal";
const Sidebar = () => {
  const { data: agentSessions } = useGetAgentSessions();
  const { clientId, setClientId, setSessionStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLogout, setIsLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("agent_id");
    // Reset in-memory state
    useAppStore.setState({
      clientId: null,
      sessionStatus: "",
      websocketClientMessage: null,
      websocketNotification: null,
    });

    // Clear persisted storage
    useAppStore.persist.clearStorage();

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // Filter chats based on search term
  const filteredChats = agentSessions?.filter(
    (chat) =>
      chat.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.client_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.total_sessions
        .toString()
        .toLowerCase()
        .includes(searchTerm.toString().toLowerCase()),
  );
  return (
    <div className="relative w-[400px] h-screen bg-bg border-r border-border">
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-border py-2 pl-10 pr-4 rounded-lg outline-none"
          />
          <p
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text"
            size={16}
          >
            {bsIcons.BsSearch}
          </p>
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto h-[calc(100vh-136px)]">
        {filteredChats?.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              onClick={() => {
                setClientId(chat.client_id);
                setSessionStatus(chat?.status);
              }}
              key={chat.id}
              className={`${
                clientId === chat.client_id && "bg-[#fbf7ee]"
              } px-5 py-4 flex items-center text-text border-b border-border hover:bg-[#f8f0e0] cursor-pointer transition-all duration-200 group`}
            >
              <div className="relative mr-4">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-stone-200 group-hover:ring-border transition-all">
                  <img
                    src={profile}
                    alt={chat.client_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {chat.status === "active" && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-status rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-text truncate pr-2">
                    {chat.client_name}
                  </h3>
                  <span className="text-xs text-text whitespace-nowrap">
                    {formatDate(chat.last_activity)}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        chat.status === "active"
                          ? "text-status bg-green-50"
                          : "text-gray-400 bg-gray-100"
                      }`}
                    >
                      {toSentenceCase(chat.status)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-session">
                      {chat.total_sessions} session
                      {chat.total_sessions !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {chat.unread_count > 0 && (
                    <span className="bg-status text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold shadow-sm">
                      {chat.unread_count > 99 ? "99+" : chat.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            No conversations found
          </div>
        )}
      </div>
      {/* Header */}
      <div className="absolute bottom-0 w-full h-16 px-4 flex items-center justify-between text-text border-t border-border bg-bg">
        <div className="flex items-center gap-2 ">
          <span className="rounded-full overflow-hidden text-text bg-chat-client border border-border p-2">
            {" "}
            {faIcons.FaUser}
          </span>{" "}
          {localStorage.getItem("username")}
        </div>

        <div className="whitespace-nowrap">
          <button
            onClick={() => setIsLogout(true)}
            title="Logout"
            className="flex items-center gap-2 px-4 py-2 text-xl rounded-md text-text cursor-pointer"
          >
            {piIcons.PiSignOutFill}
          </button>
        </div>
      </div>

      {/* Logout Alert Modal */}
      {isLogout && (
        <Modal open={isLogout} onClose={() => setIsLogout(false)}>
          <LogoutAlertModal
            onClose={() => setIsLogout(false)}
            onLogout={handleLogout}
          />
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
