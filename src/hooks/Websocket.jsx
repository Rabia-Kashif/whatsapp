import { useAppStore } from "../../store/appStore";
import { useGetAgentSessions } from "../services/chat/chat.hooks";

const maxReconnectAttempts = 5;
const socketurl = import.meta.env.VITE_BASE_URL.replace(/^http/, "ws");
export const useWebSocketConnection = () => {
  const accessToken = localStorage.getItem("auth_token");
  const agentId = localStorage.getItem("agent_id");
  let reconnectAttempts = 0;
  const {
    setWebsocketClientMessage,
    setWebsocketNotification,
    setSessionStatus,
    setClientId,
    clientId,
  } = useAppStore();
  const { refetch: reloadSessions } = useGetAgentSessions();

  if (!accessToken || !agentId) return;
  // const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const websocketURL = `${socketurl}/ws/agent/${agentId}`;
  let websocket;

  const connect = () => {
    try {
      websocket = new WebSocket(websocketURL);

      websocket.onopen = () => {
        console.log("✅ WebSocket connection established");
        // setConnectionStatus(true);
        reconnectAttempts = 0; // reset reconnect attempts
        websocket.send("ping");
      };

      websocket.onmessage = (event) => {
        if (event.data === "pong") return;

        try {
          const message = JSON.parse(event.data);
          console.log("Message from websocket: ", message);
          if (message.type === "new_message") {
            setWebsocketClientMessage(message?.data);
          } else if (
            message.type === "session_assigned" ||
            // message.type === "session_updated" ||
            message.type === "session_closed" ||
            message.type === "session_reminder_sent"
          ) {
            setWebsocketNotification(message?.data?.message);
            if (message.type === "session_closed") {
              setSessionStatus(null);
              setClientId(null);
            }
            // else if (message.type === "session_assigned") {
            //   setSessionStatus("active");
            // }
          }
          reloadSessions();
        } catch (error) {
          console.error("❌ Error parsing websocket message:", error);
        }
      };

      websocket.onclose = (event) => {
        console.warn("⚠️ WebSocket disconnected:", event.code, event.reason);
        // setConnectionStatus(false);

        // try reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          const nextAttempt = reconnectAttempts + 1;
          reconnectAttempts = nextAttempt;

          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(
            `⏳ Reconnecting in ${delay}ms... (Attempt ${nextAttempt})`
          );

          setTimeout(() => {
            connect(); // reconnect recursively
          }, delay);
        } else {
          console.error("❌ Max reconnect attempts reached.");
        }
      };

      websocket.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
        websocket.close();
      };
    } catch (error) {
      console.error("❌ Failed to create WebSocket:", error);
      // setConnectionStatus(false);
    }
  };
  connect(); // initial connection
};
