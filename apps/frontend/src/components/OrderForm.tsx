"use client";
import { useState } from "react";
import { api } from "@/lib/api";
type Order = {
  orderId: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  quantity: number;
  status: string;
  timestamp: string;
};

type OrderFormProps = {
  token: string;
  onOrderPlaced: (order: Order) => void;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export default function OrderForm({ token,onOrderPlaced, }:OrderFormProps ) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [quantity, setQuantity] = useState(0.001);
  const [price, setPrice] = useState<number | "">("");

  const placeOrder = async () => {
  const res = await fetch(`${API_URL}/api/trading/order}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      symbol: "BTCUSDT",
      side,
      type: "MARKET",
      quantity,
    }),
  });

  const data = await res.json();

  onOrderPlaced({
    ...data,
    symbol: "BTCUSDT",
    side,
    type: "MARKET",
    quantity,
    timestamp: new Date().toISOString(),
  });
};


  return (
    <div className="p-4 border-r h-full space-y-4">
      {/* Buy / Sell Toggle */}
      <div className="flex">
        <button
          className={`flex-1 p-2 ${
            side === "BUY" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSide("BUY")}
        >
          Buy
        </button>
        <button
          className={`flex-1 p-2 ${
            side === "SELL" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSide("SELL")}
        >
          Sell
        </button>
      </div>

      {/* Order Type */}
      <select
        className="w-full p-2 border"
        value={type}
        onChange={(e) => setType(e.target.value as "MARKET" | "LIMIT")}
      >
        <option value="MARKET">Market</option>
        <option value="LIMIT">Limit</option>
      </select>

      {/* Quantity */}
      <div>
        <label className="text-sm">Quantity (BTC)</label>
        <input
          type="number"
          step="0.0001"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full p-2 border"
        />
      </div>

      {/* Price (Limit only) */}
      {type === "LIMIT" && (
        <div>
          <label className="text-sm">Price (USDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border"
          />
        </div>
      )}

      {/* Submit */}
      <button
        className={`w-full p-3 text-white ${
          side === "BUY" ? "bg-green-600" : "bg-red-600"
        }`}
        onClick={placeOrder}
      >
        {side} BTC
      </button>
    </div>
  );
}
