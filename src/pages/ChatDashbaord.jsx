import { useEffect } from "react";
import { useAppStore } from "../store/appStore";
import Conversation from "../components/chat/Conversation";
import { useWebSocketConnection } from "../hooks/Websocket";
import { toast, ToastContainer } from "react-toastify";

const ChatDashboard = () => {
  const websocketNotification = useAppStore(
    (state) => state.websocketNotification,
  );
  useWebSocketConnection();
  useEffect(() => {
    if (websocketNotification) {
      toast.info(websocketNotification);
    }
  }, [websocketNotification]);
  return (
    <div>
      <Conversation />
      {/* <ToastContainer /> */}
    </div>
  );
};

export default ChatDashboard;
