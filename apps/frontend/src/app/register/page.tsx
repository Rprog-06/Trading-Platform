"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    binanceApiKey: "",
    binanceSecretKey: "",
  });

  async function register() {
    try {
      await api("/auth/register", "POST", form);
      alert("Registered successfully");
      router.push("/login");
    } catch (e: any) {
      alert(e.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-3">
        <input
          placeholder="Email"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="Binance API Key (Testnet)"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, binanceApiKey: e.target.value })}
        />
        <input
          placeholder="Binance Secret Key (Testnet)"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, binanceSecretKey: e.target.value })}
        />

        <button
          onClick={register}
          className="w-full bg-blue-600 text-white p-2"
        >
          Register
        </button>
      </div>
    </div>
  );
}
