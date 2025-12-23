"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { connectWS, disconnectWS } from "@/lib/ws";
import OrderForm from "@/components/OrderForm";
import OrdersTable from "@/components/Orderstable";
import TradingChart from "@/components/TradingChart";
import { fetchCandles } from "@/lib/binance";
import LogoutButton from "@/components/LogoutButton";



export default function TradePage() {
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [candles, setCandles] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("BTCUSDT");
  
  // 1️⃣ Load token safely
  useEffect(() => {
    const t = sessionStorage.getItem("token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
  }, []);

  // 2️⃣ Fetch candles
  useEffect(() => {
    fetchCandles(symbol).then(setCandles);
  }, [symbol]);

  // 3️⃣ Orders + WebSocket (ONLY when token exists)
  useEffect(() => {
    if (!token) return;

    api("api/trading/orders", "GET", null, token)
      .then(setOrders)
      .catch(console.error);

    connectWS(token, (msg) => {
      if (msg.type === "ORDER_UPDATE") {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === msg.data.orderId ? msg.data : o
          )
        );
      }
    });

    return () => disconnectWS();
  }, [token]);

  // 4️⃣ Prevent rendering before token exists
  if (!token) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-semibold">Trading Dashboard</h1>
      <LogoutButton />
    </div>

    <div className="grid grid-cols-3 h-screen">
     <OrderForm
  token={token}
  onOrderPlaced={(order) => {
    setOrders((prev) => [order, ...prev]);
  }}
/>

      <div className="col-span-2 p-4">
        <TradingChart candles={candles} />
        <OrdersTable orders={orders}  />
      </div>
    </div>
  </div>
  );
}
