import { io, type Socket } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_BASE_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:3000";

export const socket: Socket = io(socketUrl, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  upgrade: true,
  timeout: 20000,
  forceNew: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Reconnect socket to refresh auth credentials
export const reconnectSocket = () => {
  socket.disconnect();
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const weekdays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const REQUIRED_FIELD_MESSAGE = "الرجاء إدخال البيانات المطلوبة";
