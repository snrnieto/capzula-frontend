"use client";
import io from "socket.io-client";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface LiveRoomProps {
  room_id: string;
}
export const LiveRoom = ({ room_id }: LiveRoomProps) => {
  const router = useRouter();

  // Replace with your server URL
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? "localhost:3001", {
    transports: ["websocket"],
  });

  const myPeer = typeof window !== "undefined" ? new Peer() : ({} as Peer);
  const videoPlayer = useRef<HTMLVideoElement>({} as HTMLVideoElement);
  const reload = () => {};

  useEffect(() => {
    console.log("Join to room id: " + room_id);

    /**
     * Socket Event Handlers
     */

    socket.on("connect", () => {
      console.log("Connected as viewer");
    });

    myPeer.on("open", (viewerId) => {
      console.log("My viewer id: " + viewerId);
      socket.emit("join", room_id);
      socket.emit("join-as-viewer", viewerId);
    });

    myPeer.on("call", (call) => {
      console.log("Got a call from streamer");
      call.answer();
      call.on("stream", (stream) => {
        console.log("Got a stream from streamer");
        addVideoStream(videoPlayer.current, stream);
      });
    });

    myPeer.on("connection", (conn) => {
      conn.on("close", () => {
        setTimeout(reload, 1000);
      });
    });

    socket.on("disconnect", () => {
      // we dont really care about emitting this to the streamer tbh
      console.log("disconnected viewer");
    });

    socket.on("streamer-disconnected", (streamerId) => {
      console.log(streamerId, " Streamer has ended stream");
      setTimeout(reload, 2000);
    });

    socket.on("streamer-joined", (streamerId) => {
      console.log("A streamer just joined!", streamerId);
      setTimeout(reload, 2000);
    });

    function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = [
    {
      image:
        "https://capzula.com/wp-content/uploads/2023/09/QXUsm4pixS3R33aT.jpg",
      name: "Top",
      store: "Nisan",
      colors: ["red", "blue", "green"],
      url: "https://capzula.com/product/top-4/",
    },
    {
      image:
        "https://capzula.com/wp-content/uploads/2023/09/QjgbxkglKPO2jPru.jpg",
      name: "Jean Pants",
      store: "Nisan",
      colors: ["pink", "blue", "yellow"],
      url: "https://capzula.com/product/cargo-pants/",
    },
    {
      image:
        "https://capzula.com/wp-content/uploads/2023/09/dEYgt4y385sw6dMe-768x1152.jpeg",
      name: "Thin Bar Fringe Earrings",
      store: "Fame Accesories",
      colors: ["yellow"],
      url: "https://capzula.com/product/thin-bar-fringe-earrings/",
    },
    {
      image:
        "https://capzula.com/wp-content/uploads/2023/09/FFaIJ78MehjSK6Bf.png",
      name: "Bakatá ShoesQ",
      store: "Bakatá ShoesQ",
      colors: ["beige"],
      url: "https://capzula.com/product/bakata-shoesq-2/",
    },
  ];

  const [openProducts, setOpenProducts] = useState(false);
  return (
    <main className="h-screen snap-start object-fill relative max-h-[700px]">
      <div className="flex flex-col-reverse md:flex-row gap-14 h-full">
        <div
          className={`h-full max-h-[600px] z-10 bg-white rounded-t-3xl overflow-y-auto px-6 absolute bottom-0 ${
            openProducts ? "block" : "hidden"
          }`}
        >
          <h1 className="font-bold text-2xl mb-4">Productos</h1>
          <div className="flex flex-col gap-10 h-full overflow-y-auto pb-40 pr-2">
            {products.map((product) => (
              <div className="flex gap-5 h-full w-full" key={product.url}>
                <div className="relative min-w-[100px] md:min-w-[150px] min-h-[150px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    className="rounded-tl-2xl"
                  />
                </div>
                <div className="flex flex-col justify-between w-full">
                  <h2 className="font-bold text-xl lg:text-3xl">
                    {product.name}
                  </h2>
                  <h3 className="font-bold">
                    By{" "}
                    <span className="underline text-[#3F5D71]">
                      {product.store}
                    </span>
                  </h3>
                  <div className="flex flex-row gap-4">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        className={`w-[20px] h-[20px] rounded-full`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end w-full">
                    <Link
                      href={product.url}
                      className="bg-orange-300 hover:bg-orange-400 rounded-full px-6 lg:px-10 py-2 text-white font-semibold"
                    >
                      Comprar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="absolute bottom-0 py-2 bg-white bg-opacity-70 text-center w-full font-bold text-xl z-10"
          onClick={() => setOpenProducts(true)}
          hidden={openProducts}
        >
          Ver productos
        </div>
        <video
          ref={videoPlayer}
          muted
          className="w-full h-full  object-fill object-center"
          onClick={() => setOpenProducts(false)}
        />
      </div>
    </main>
  );
};
