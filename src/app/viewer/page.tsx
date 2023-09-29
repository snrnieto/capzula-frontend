"use client";
import io from "socket.io-client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  // Replace with your server URL
  const socket = io(process.env.BACKEND_URL ?? "localhost:3001", {
    transports: ["websocket"],
  });

  const videoPlayer = useRef<HTMLVideoElement>({} as HTMLVideoElement);
  const [roomList, setRoomList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    videoPlayer.current.muted = true;

    socket.on("connect", () => {
      console.log("Connected as viewer");
      socket.emit("get-rooms");
    });

    socket.on("room-list", (rooms) => {
      console.log({ rooms });
      setRoomList(rooms);
      setIsLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("disconnected viewer");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="h-screen mt-10">
      <h1 className="font-bold text-2xl px-10 mb-10 text-center lg:text-start">
        Modelos en vivo
      </h1>
      {isLoading ? (
        <h1>Cargando...</h1>
      ) : roomList.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center gap-11 px-20">
          {roomList.map((room, index) => (
            <Link
              href={`/viewer/${room}`}
              key={room}
              className=" w-full min-w-[350px] max-w-xs text-center relative"
            >
              <h1>Modelo {room.slice(0, 8)}</h1>
              <div className="relative h-96 w-full">
                <Image
                  src={
                    index == 0
                      ? "https://capzula.com/wp-content/uploads/2023/09/5Vozmda6HUKaogcJ.jpg"
                      : index % 2 === 0
                      ? "https://capzula.com/wp-content/uploads/2023/09/zigb2eH38apeAYNj.jpg"
                      : "https://capzula.com/wp-content/uploads/2023/09/3nXT9nAntebPztip.jpeg"
                  }
                  alt={room}
                  fill
                  sizes="100vw"
                  objectFit="cover"
                  className="opacity-25 hover:opacity-40 rounded-xl"
                />
                <Image
                  src={"https://cdn-icons-png.flaticon.com/512/0/375.png"}
                  alt={"play"}
                  width={90}
                  height={90}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 cursor-pointer"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h1 className="w-full text-center">
          No hay modelos en vivo en este momento
        </h1>
      )}
      <video ref={videoPlayer}></video>
    </main>
  );
}
