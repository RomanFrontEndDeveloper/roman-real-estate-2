"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function SocketTestPage() {
  const [status, setStatus] = useState("Не підключено");

  useEffect(() => {
    const handleConnect = () => {
      setStatus(`Підключено: ${socket.id}`);
    };

    const handleDisconnect = () => {
      setStatus("З'єднання втрачено");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Socket.IO test</h1>
      <p className="mt-4">Статус: {status}</p>
    </main>
  );
}
