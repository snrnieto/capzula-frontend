"use client";
import io from "socket.io-client";
import Peer from "peerjs";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  // Replace with your server URL
  const socket = io(process.env.BACKEND_URL ?? "localhost:3001", {
    transports: ["websocket"],
  });

  let myuuid = uuidv4();

  const peerClient = new Peer();
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
