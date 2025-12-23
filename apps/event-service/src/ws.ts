import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { redis } from "./redis";

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

const clients = new Map<string, WebSocket>(); // userId → socket

wss.on("connection", (ws, req) => {
  try {
    const token = req.url?.split("token=")[1];
    if (!token) return ws.close();

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    clients.set(payload.userId, ws);

    ws.on("close", () => {
      clients.delete(payload.userId);
    });
  } catch {
    ws.close();
  }
});

redis.subscribe("events:order:status");

redis.on("message", (_, message) => {
  const event = JSON.parse(message);
  const socket = clients.get(event.userId);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "ORDER_UPDATE",
        data: event
      })
    );
  }
});
