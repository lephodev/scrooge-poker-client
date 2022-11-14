import { io } from "socket.io-client";

// https://poker-server-t3e66zpola-uc.a.run.app

const socket = io("https://poker-server-t3e66zpola-uc.a.run.app", {
  transports: ["websocket"],
  rejectUnauthorized: false,
  reconnection: false,
});
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  console.log("Disconnected");
});

export { socket };
