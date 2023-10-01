"use client";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Peer from "peerjs";

export default function Home() {
  const peerClient = typeof window !== "undefined" ? new Peer() : ({} as Peer);
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "localhost:3000", {
    transports: ["websocket"],
  });

  let myuuid = uuidv4();

  const videoRecorder = useRef<HTMLVideoElement>({} as HTMLVideoElement);
  const [stream, setStream] = useState<boolean>(false);

  function connectToNewViewer(viewerId: string, stream: MediaStream) {
    console.log("Calling viewer: " + viewerId);
    peerClient.call(viewerId, stream);
  }

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
    video.srcObject = stream;
    setStream(true);
    video.addEventListener("loadedmetadata", async () => {
      video
        .play()
        .then(() => {})
        .catch((error) => {
          alert("Camera video failed:" + error);
        });
    });
  }

  function handleStartStream() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        console.log("My room id: " + myuuid);
        addVideoStream(videoRecorder.current, stream);

        socket.on("viewer-connected", (viewerId) => {
          connectToNewViewer(viewerId, stream);
        });

        // create a room for the streamer
        socket.emit("join", myuuid);
      });
  }
  return (
    <main className="mt-10">
      {stream ? (
        <h1 className="font-bold text-xl">Estás en vivo</h1>
      ) : (
        <button
          onClick={handleStartStream}
          className="bg-green-600 hover:bg-green-500 font-semibold text-white px-10 py-2 rounded-md mx-10"
        >
          Iniciar transmisión
        </button>
      )}
      <video ref={videoRecorder} muted></video>
    </main>
  );
}
