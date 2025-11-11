import { io, Socket } from "socket.io-client";

// your gateway listens on 8001 with CORS "*"
let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:8001", {
      transports: ["websocket"], // fast path
    });
  }
  return socket;
}
