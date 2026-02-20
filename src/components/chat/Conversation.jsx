import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { FiSend, FiArrowDown } from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import { useAppStore } from "../../store/appStore";
import {
  useCloseChatSession,
  useGetClientConversation,
  useSendMessageToClient,
} from "../../services/chat/chat.hooks";
import profile from "../../assets/images/profile_fallback.png";
import { formatDate, formatTimeOnly } from "../../utils/dateFormatter";
import { toast } from "react-toastify";
import Modal from "../Modals/Modal";
import CloseSessionAlert from "../Modals/CloseSessionAlert";
import chatBg from "../../assets/images/chat-bg.png";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Conversation = () => {
  const { clientId, setClientId, setSessionStatus, sessionStatus } =
    useAppStore();
  const { data: conversation, refetch: refetchConversation } =
    useGetClientConversation(clientId, { enabled: !!clientId });
  const { mutate: sendMessageToClient } = useSendMessageToClient();
  const { mutate: closeSession } = useCloseChatSession();

  const [messages, setMessages] = useState([]);
  const [agentMessage, setAgentMessage] = useState("");
  const [groupedMessages, setGroupedMessages] = useState({});
  const [isSessionClose, setIsSessionClose] = useState(null);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const websocketClientMessage = useAppStore(
    (state) => state.websocketClientMessage,
  );
  const scrollRef = useRef(null);
  const isInitialRender = useRef(true);
  const previousClientId = useRef(null);
  const pendingMessageIds = useRef(new Set());

  // Check if user is near bottom of scroll
  const isNearBottom = () => {
    if (!scrollRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Handle scroll detection
  const handleScroll = () => {
    const nearBottom = isNearBottom();
    setIsUserScrolling(!nearBottom);
    if (nearBottom) {
      setShowNewMessageAlert(false);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = (behavior = "smooth") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });
    setShowNewMessageAlert(false);
    setIsUserScrolling(false);
  };

  // Auto-scroll only on initial render or when sending messages
  useLayoutEffect(() => {
    if (!scrollRef.current) return;

    // Only auto-scroll if user is already at bottom or it's initial render
    if (isInitialRender.current || !isUserScrolling) {
      const behavior = isInitialRender.current ? "auto" : "smooth";
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
      isInitialRender.current = false;
    }
  }, [messages]);

  // Normalize + group messages
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
        message_type: rawMsg.message_type || "text",
        timestamp: rawMsg.timestamp || new Date().toISOString(),
      };
    } catch (err) {
      console.error("Invalid message:", err);
      return null;
    }
  };

  const groupMessagesBySession = (msgs) =>
    msgs.reduce((acc, msg) => {
      const session = msg.session_id || "unknown";
      if (!acc[session]) acc[session] = [];
      acc[session].push(msg);
      return acc;
    }, {});

  // Update messages when conversation changes
  useEffect(() => {
    if (conversation?.messages) {
      // Remove any pending temp messages when real messages arrive
      const realMessageIds = new Set(conversation.messages.map((m) => m.id));
      pendingMessageIds.current.forEach((tempId) => {
        if (!realMessageIds.has(tempId)) {
          pendingMessageIds.current.delete(tempId);
        }
      });

      setMessages(conversation.messages);
    }
  }, [conversation]);

  // Scroll to bottom on first conversation load
  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      setTimeout(() => {
        scrollToBottom("auto");
      }, 50);
    }
  }, [conversation]);

  // Handle client change from sidebar
  useEffect(() => {
    if (clientId !== previousClientId.current) {
      // Reset scroll state when switching clients
      isInitialRender.current = true;
      setIsUserScrolling(false);
      setShowNewMessageAlert(false);
      pendingMessageIds.current.clear();
      previousClientId.current = clientId;

      if (clientId) {
        refetchConversation();
      }
    }
  }, [clientId, refetchConversation]);

  // Websocket incoming message
  useEffect(() => {
    if (!websocketClientMessage || !conversation) return;
    if (websocketClientMessage.client_phone !== conversation.client_phone)
      return;

    const message = normalizeMessage(websocketClientMessage);
    if (!message) return;

    // Check if message already exists (including temp messages)
    setMessages((prev) => {
      const messageExists = prev.some(
        (m) =>
          m.id === message.id ||
          (m.text === message.text &&
            m.sender === message.sender &&
            Math.abs(new Date(m.timestamp) - new Date(message.timestamp)) <
              2000),
      );

      if (messageExists) return prev;

      // Show "new message" alert if user is scrolled up
      if (!isNearBottom() && message.sender !== "agent") {
        setShowNewMessageAlert(true);
      } else {
        // Auto-scroll if user is at bottom
        setTimeout(() => scrollToBottom("smooth"), 100);
      }

      return prev
        .filter((m) => !pendingMessageIds.current.has(m.id)) // remove temp
        .concat(message); // add real message
    });
  }, [websocketClientMessage, conversation]);

  useEffect(() => {
    if (messages.length > 0) {
      setGroupedMessages(groupMessagesBySession(messages));
    }
  }, [messages]);

  // Handle send message
  const handleSendMessageToClient = () => {
    if (!agentMessage.trim()) return;

    const message = agentMessage.trim();
    if (!message) return;

    const tempId = `temp_${Date.now()}`;
    const tempMsg = {
      id: tempId,
      sender: "agent",
      text: message,
      timestamp: new Date().toISOString(),
      session_id:
        conversation?.messages?.[conversation?.messages.length - 1]?.session_id,
    };

    // Track this as a pending message
    pendingMessageIds.current.add(tempId);

    // Add temp message to UI
    setMessages((prev) => {
      const exists = prev.some(
        (m) => m.text === tempMsg.text && m.sender === "agent",
      );
      if (exists) return prev;
      return [...prev, tempMsg];
    });
    setAgentMessage("");

    // Force scroll to bottom when sending
    setIsUserScrolling(false);
    setTimeout(() => scrollToBottom("smooth"), 50);

    sendMessageToClient(
      { clientId, message },
      {
        onSuccess: async () => {
          // Wait a bit for websocket message, then refetch to sync
          setTimeout(async () => {
            pendingMessageIds.current.delete(tempId);
            await refetchConversation();
          }, 500);

          if (sessionStatus === "closed") setSessionStatus("active");
        },
        onError: (error) => {
          // Remove temp message on error
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          pendingMessageIds.current.delete(tempId);
          toast.error(error || "Failed to send message. Please try again.");
        },
      },
    );
  };

  // Handle close session
  const handleSessionClose = (sessionId) => {
    if (!sessionId) return;
    setSessionStatus("closing");

    closeSession(sessionId, {
      onSuccess: () => {
        toast.success("Session closed successfully!");
        setClientId(null);
        setSessionStatus("closed");
        setMessages([]);
        setIsSessionClose(null);
      },
      onError: (error) => {
        toast.error(error || "Failed to close session! Please try again.");
        setSessionStatus("active");
      },
    });
  };

  if (!conversation || clientId === null) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-bg">
        <div className="p-8 text-center">
          <FaComments className="text-text text-6xl mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-text mb-2">
            No Client Selected
          </h3>
          <p className="text-text">
            Select a client from the left sidebar to view conversation
          </p>
        </div>
      </div>
    );
  }

  const isClosable = sessionStatus === "active";

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-bg border-b border-border">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={profile}
            alt={conversation?.client_name || "Client Avatar"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text">
            {conversation?.client_name || "Unknown"}
          </div>
          <div className="text-xs text-text">{conversation?.client_phone}</div>
        </div>

        <button
          onClick={() => {
            if (!isClosable) return;
            setIsSessionClose(
              conversation?.messages?.[conversation?.messages.length - 1]
                ?.session_id,
            );
          }}
          disabled={!isClosable}
          className={`${
            isClosable
              ? "bg-close-btn hover:bg-close-btn-hovered cursor-pointer"
              : "bg-neutral-500 cursor-not-allowed"
          } rounded-lg px-3 py-1 text-white transition`}
        >
          {isClosable ? "Close Session" : "Session Closed"}
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          backgroundImage: `url(${chatBg})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
        }}
        onScroll={handleScroll}
        className="flex-1 h-full w-full overflow-y-auto p-6 bg-bg relative lg:pb-6 pb-24"
      >
        <div className="space-y-10 max-w-5xl mx-auto">
          {Object.entries(groupedMessages).map(
            ([sessionId, sessionMessages]) => (
              <div key={sessionId}>
                <div className="flex justify-center mb-4">
                  <div className="text-xs bg-stone-100 shadow px-3 py-1 rounded-md text-gray-600">
                    {formatDate(sessionMessages[0]?.timestamp)}
                  </div>
                </div>

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
                            ? "bg-chat-agent text-text"
                            : "bg-chat-client text-text"
                        }  rounded-xl min-w-32 px-3 py-2 shadow-sm max-w-[80%] lg:max-w-[60%]`}
                      >
                        {m.message_type === "text" && (
                          <div className="text-sm">{m.text}</div>
                        )}
                        {m.message_type === "image" && m.media_url && (
                          <img
                            src={`${BASE_URL}/api/proxy-media?url=${encodeURIComponent(
                              m.media_url,
                            )}`}
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
                                      m.media_url,
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
                                      m.media_url,
                                    )}`
                                  : m.media_url
                              }
                              type="audio/mpeg"
                            />
                          </audio>
                        )}
                        <div className="text-xs text-gray-400 text-right mt-1">
                          {formatTimeOnly(m.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>

        {/* New Message Alert - WhatsApp Style */}
        {showNewMessageAlert && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={() => scrollToBottom("smooth")}
              className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200"
            >
              <FiArrowDown className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                New message
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 lg:relative flex items-center justify-center gap-4 px-12 py-3 h-16 bg-bg border-t border-border">
        <div className="flex-1 max-w-[90%] flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message here..."
            value={agentMessage}
            onChange={(e) => setAgentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessageToClient();
              }
            }}
            className="flex-1 border-2 rounded-full px-4 py-2 outline-none text-text border-border bg-transparent"
          />
          <button
            onClick={handleSendMessageToClient}
            className="p-2 rounded-full text-white bg-send-btn hover:bg-send-btn-hovered transition"
          >
            <FiSend />
          </button>
        </div>
      </div>

      {isSessionClose !== null && (
        <Modal open={!!isSessionClose} onClose={() => setIsSessionClose(null)}>
          <CloseSessionAlert
            onClose={() => setIsSessionClose(null)}
            onSessionClose={() => handleSessionClose(isSessionClose)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Conversation;
