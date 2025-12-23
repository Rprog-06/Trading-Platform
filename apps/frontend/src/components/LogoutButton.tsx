"use client";

import { useRouter } from "next/navigation";
import { disconnectWS } from "@/lib/ws";

export default function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    disconnectWS();
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
