import { useEffect, useRef } from "react";
import { useAppStore } from "../store/appStore";
import { queryClient } from "../providers/queryClient";

const maxReconnectAttempts = 5;
const socketurl = import.meta.env.VITE_BASE_URL.replace(/^http/, "ws");

export const useWebSocketConnection = () => {
  const accessToken = localStorage.getItem("auth_token");
  const agentId = localStorage.getItem("agent_id");

  const {
    setWebsocketClientMessage,
    setWebsocketNotification,
    setSessionStatus,
    setClientId,
  } = useAppStore();

  const reconnectAttempts = useRef(0);
  const websocketRef = useRef(null);

  useEffect(() => {
    if (!accessToken || !agentId) return;

    const websocketURL = `${socketurl}/ws/agent/${agentId}`;

    const connect = () => {
      try {
        const ws = new WebSocket(websocketURL);
        websocketRef.current = ws;

        ws.onopen = () => {
          console.log("✅ WebSocket connection established");
          reconnectAttempts.current = 0;
          ws.send("ping");
        };

        ws.onmessage = (event) => {
          if (event.data === "pong") return;

          try {
            const message = JSON.parse(event.data);
            console.log("📩 WebSocket Message:", message);

            if (message.type === "new_message") {
              setWebsocketClientMessage(message.data);
            } else if (
              [
                "session_assigned",
                "session_closed",
                "session_reminder_sent",
                "session_updated",
              ].includes(message.type)
            ) {
              setWebsocketNotification(message.data?.message);

              if (message.type === "session_closed") {
                // Only clear if the closed session belongs to the current client
                const closedClientId = message?.data?.client_id;
                const currentClientId = useAppStore.getState().clientId;

                if (closedClientId === currentClientId) {
                  setSessionStatus(null);
                  setClientId(null);
                }
              } else if (message.type === "session_assigned") {
                setSessionStatus("active");
              }

              // reloadSessions();
              queryClient.invalidateQueries(["agent-sessions"]);
            }
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.warn("⚠️ WebSocket disconnected:", event.code, event.reason);

          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            const delay = Math.min(
              1000 * Math.pow(2, reconnectAttempts.current),
              30000,
            );

            console.log(
              `⏳ Reconnecting in ${delay}ms (Attempt ${reconnectAttempts.current})`,
            );

            setTimeout(connect, delay);
          } else {
            console.error("❌ Max reconnect attempts reached.");
          }
        };

        ws.onerror = (error) => {
          console.error("⚠️ WebSocket error:", error);
          ws.close();
        };
      } catch (error) {
        console.error("❌ Failed to create WebSocket:", error);
      }
    };

    connect();

    // ✅ Cleanup on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        console.log("🔌 WebSocket connection closed on unmount");
      }
    };
  }, [accessToken, agentId]);
};
