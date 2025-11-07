export const webSocketConnection = () => {
  const accessToken = localStorage.getItem("auth_token");
  const agentId = localStorage.getItem("agent_id");
  if (!accessToken || !agentId) {
    return;
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const websocketURL = `${protocol}://192.168.0.155:7000/ws/agent/${agentId}`;

  try {
    const websocket = new WebSocket(websocketURL);
  } catch (error) {
    console.error("Failed to create WebSocket:", error);
  }
};
