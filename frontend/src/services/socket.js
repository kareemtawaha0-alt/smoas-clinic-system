import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (socket) return socket;
  const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
  socket = io(url, { transports: ["websocket"] });

  const user = JSON.parse(localStorage.getItem("smoas_user") || "null");
  if (user?._id) socket.emit("auth:join", { userId: user._id });

  return socket;
}
