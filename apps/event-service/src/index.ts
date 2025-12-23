import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { redis } from "./redis";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = Number(process.env.PORT) || 5000;

// ✅ WebSocket server binds the port ONCE


console.log(`WebSocket server running on port ${PORT}`);

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

// Redis → WebSocket fan-out
redis.subscribe("events:order:status");

redis.on("message", (_, message) => {
  const event = JSON.parse(message);
  const socket = clients.get(event.userId);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "ORDER_UPDATE",
        data: event,
      })
    );
  }
});
