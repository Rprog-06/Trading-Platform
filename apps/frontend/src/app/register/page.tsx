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
      await api("auth/register", "POST", form);
      alert("Registered successfully");
      router.push("/login");
    } catch (e: any) {
      alert(e.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-3">
        <h1 className="text-2xl font-bold">Register</h1>
        <label>Email</label>
        <input
          placeholder="Email"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <p className="text-xs text-gray-500">
  Password key should be at least 6 characters
</p>


        <label>Binance API Key (Testnet)</label>
        <input
          placeholder="Binance API Key (Testnet)"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, binanceApiKey: e.target.value })}
        />
        <p className="text-xs text-gray-500">
  API key should be at least 10 characters
</p>

        <label>Binance Secret Key (Testnet)</label>
        <input
          placeholder="Binance Secret Key (Testnet)"
          className="w-full border p-2"
          onChange={e => setForm({ ...form, binanceSecretKey: e.target.value })}
        />
       <p className="text-xs text-gray-500 mt-1">
  API key should be at least 10 characters
</p>

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
