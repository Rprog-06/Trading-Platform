"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string|null>(null);

  const login = async () => {
    try{
      setError(null);
    
    const res = await api("/auth/login", "POST", { email, password });
    sessionStorage.setItem("token", res.token);
    window.location.href = "/trade";
  } catch (err: any) {
    setError(err.message);
  };
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error &&( <div className="text-red-500">{error}</div>)}

        <button className="bg-blue-600 text-white p-2 w-full" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
