import { useRef, useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import { useAppStore } from "../../../store/appStore";
import {
  useGetClientConversation,
  useSendMessageToClient,
} from "../../services/chat/chat.hooks";
import profile from "../../assets/images/profile_fallback.png";
import { formatDate } from "../../utils/dateFormatter";
import { toast } from "react-toastify";

const Conversation = () => {
  const clientId = useAppStore((state) => state.clientId);

  const { data: conversation, refetch: refetchConversation } =
    useGetClientConversation(clientId, {
      enabled: !!clientId,
    });
  const { mutate: sendMessageToClient } = useSendMessageToClient();

  const [messages, setMessages] = useState([]);
  const [agentMessage, setAgentMessage] = useState("");
  const websocketClientMessage = useAppStore(
    (state) => state.websocketClientMessage
  );

  console.log("WebSocket Client Message:", websocketClientMessage);
  const scrollRef = useRef(null);

  // Update local messages whenever conversation changes
  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // When client changes, refetch once
  useEffect(() => {
    if (clientId) refetchConversation();
  }, [clientId]);

  // 🔹 Send message
  const handleSendMessageToClient = () => {
    const message = agentMessage.trim();
    if (!message) return;

    const tempId = Date.now();

    // Show message instantly in UI
    const tempMsg = {
      id: tempId,
      sender: "agent",
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setAgentMessage("");

    // API call
    sendMessageToClient(
      { clientId, message },
      {
        onSuccess: async () => {
          await refetchConversation(); // fetch latest updated conversation
        },
        onError: (error) => {
          toast.error(error || "Failed to send message. Please try again.");
        },
      }
    );
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-gray-50">
        <div id="noChatSelected" className="p-8 text-center">
          <FaComments className="text-gray-300 text-6xl mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Client Selected
          </h3>
          <p className="text-gray-500">
            Select a client from the left sidebar to view conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={profile}
            alt={conversation?.client_name || "Client Avatar"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {conversation?.client_name || "Unknown"}
          </div>
          <div className="text-xs text-gray-500">
            {conversation?.client_phone}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6"
        style={{ backgroundColor: "#f2efe9" }}
      >
        <div className="flex justify-center mb-4">
          <div className="text-xs bg-white px-3 py-1 rounded-md text-gray-600">
            TODAY
          </div>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "agent" || m.sender === "system"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`${
                  m.sender === "agent" || m.sender === "system"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-900"
                } rounded-lg px-4 py-2 shadow-sm max-w-[70%]`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {formatDate(m.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-300">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message here..."
            value={agentMessage}
            onChange={(e) => setAgentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessageToClient()}
            className="flex-1 border rounded-full px-4 py-2 outline-none border-gray-300 bg-gray-100"
          />
          <button
            onClick={handleSendMessageToClient}
            className="p-2 cursor-pointer bg-secondary hover:bg-secondary-dark text-white rounded-full"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
