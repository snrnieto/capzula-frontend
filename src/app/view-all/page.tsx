"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LiveRoom } from "./components/LiveRoom";

export default function ViewAllPage() {
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "localhost:3000", {
    transports: ["websocket"],
  });

  const [roomList, setRoomList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected as viewer list");
      socket.emit("get-rooms");
    });

    socket.on("room-list", (rooms) => {
      console.log({ rooms });
      setRoomList(rooms);
      setIsLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isLoading ? (
        <h1>Cargando...</h1>
      ) : roomList.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center gap-2 scroll-container">
          {roomList.map((room, index) => (
            <LiveRoom key={room} room_id={room} />
          ))}
        </div>
      ) : (
        <h1 className="w-full text-center">
          No hay modelos en vivo en este momento
        </h1>
      )}
    </>
  );
}
