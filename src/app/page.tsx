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

  function connectToNewViewer(viewerId: string, stream: MediaStream) {
    console.log("Calling viewer: " + viewerId);
    peerClient.call(viewerId, stream);
  }

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", async () => {
      try {
        await video.play();
      } catch (error) {
        alert("Video playback failed:" + error);
      }
    });
  }

  useEffect(() => {
    videoRecorder.current.muted = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main>
      <h1>Estas en vivo</h1>
      <video ref={videoRecorder}></video>
    </main>
  );
}
