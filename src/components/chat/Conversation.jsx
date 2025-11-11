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
import { grIcons } from "../../global/icons";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Conversation = () => {
  const clientId = useAppStore((state) => state.clientId);

  const { data: conversation, refetch: refetchConversation } =
    useGetClientConversation(clientId, {
      enabled: !!clientId,
    });
  const { mutate: sendMessageToClient } = useSendMessageToClient();

  const [messages, setMessages] = useState([]);
  const [agentMessage, setAgentMessage] = useState("");
  const [groupedMessages, setGroupedMessages] = useState({});
  const websocketClientMessage = useAppStore(
    (state) => state.websocketClientMessage
  );

  const scrollRef = useRef(null);

  const normalizeMessage = (rawMsg) => {
    if (!rawMsg) return null;

    try {
      if (typeof rawMsg === "string") rawMsg = JSON.parse(rawMsg);
      if (Array.isArray(rawMsg)) rawMsg = rawMsg[0];

      return {
        id: rawMsg.id || Date.now(),
        session_id: rawMsg.session_id || null,
        sender: rawMsg.sender || "unknown",
        text: rawMsg.text || "",
        media_url: rawMsg.media_url || "",
        message_type: rawMsg.message_type || "text", // "text" | "image" | "video" | "audio"
        timestamp: rawMsg.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      console.error("Invalid message:", err);
      return null;
    }
  };

  const groupMessagesBySession = (msgs) => {
    return msgs.reduce((acc, msg) => {
      const session = msg.session_id || "unknown";
      if (!acc[session]) acc[session] = [];
      acc[session].push(msg);
      return acc;
    }, {});
  };

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

  // Append WebSocket message to local messages
  useEffect(() => {
    if (!websocketClientMessage) return;

    const message = normalizeMessage(websocketClientMessage);
    if (!message) return;

    setMessages((prev) => [...prev, message]);
  }, [websocketClientMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      setGroupedMessages(groupMessagesBySession(messages));
    }
  }, [messages]);

  // Send message
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
        <div className="space-y-10 max-w-5xl mx-auto">
          {Object.entries(groupedMessages).map(
            ([sessionId, sessionMessages]) => (
              <div key={sessionId}>
                {/* 🔹 Session Header */}
                <div className="flex justify-center mb-4">
                  <div className="text-xs bg-white px-3 py-1 rounded-md text-gray-600">
                    {formatDate(sessionMessages[0]?.timestamp)}
                  </div>
                </div>

                {/* 🔹 Session Messages */}
                <div className="space-y-6">
                  {sessionMessages.map((m) => (
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
                            ? "bg-[#246588] text-white"
                            : "bg-white text-gray-900"
                        } rounded-lg px-4 py-2 shadow-sm max-w-[70%]`}
                      >
                        {/* Message Content Based on Type */}
                        {m.message_type === "text" && (
                          <div className="text-sm">{m.text}</div>
                        )}

                        {m.message_type === "image" && m.media_url && (
                          <img
                            src={
                              m.media_url.includes("twilio.com")
                                ? `${BASE_URL}/api/proxy-media?url=${encodeURIComponent(
                                    m.media_url
                                  )}`
                                : m.media_url
                            }
                            alt="client attachment"
                            className="rounded-lg max-w-full"
                          />
                        )}

                        {m.message_type === "video" && m.media_url && (
                          <video controls className="rounded-lg max-w-full">
                            <source
                              src={
                                m.media_url.includes("twilio.com")
                                  ? `${BASE_URL}/api/proxy-media?url=${encodeURIComponent(
                                      m.media_url
                                    )}`
                                  : m.media_url
                              }
                              type="video/mp4"
                            />
                          </video>
                        )}

                        {m.message_type === "audio" && m.media_url && (
                          <audio controls className="w-full mt-1">
                            <source
                              src={
                                m.media_url.includes("twilio.com")
                                  ? `${BASE_URL}/api/proxy-media?url=${encodeURIComponent(
                                      m.media_url
                                    )}`
                                  : m.media_url
                              }
                              type="audio/mpeg"
                            />
                          </audio>
                        )}

                        <div className="text-xs text-gray-400 mt-1 text-right">
                          {formatDate(m.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center justify-start gap-4 px-12 py-3 bg-white border-t border-gray-300">
        <p className="text-lg text-gray-700">{grIcons.GrAttachment}</p>
        <div className="flex-1 max-w-3xl flex items-center gap-3">
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
