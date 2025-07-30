import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to your backend
const socket = io("https://kanishko-watch-party-backend.onrender.com", {
  transports: ["websocket"],
});

function App() {
  const videoRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!joined) return;

    console.log("🎯 Connecting to Socket.IO...");
    socket.on("connect", () => {
      console.log("🚀 Connected to socket:", socket.id);
    });

    socket.on("play", () => {
      console.log("🔊 Play received");
      videoRef.current.play();
    });

    socket.on("pause", () => {
      console.log("⏸️ Pause received");
      videoRef.current.pause();
    });

    socket.on("seek", (time) => {
      console.log("⏩ Seek received:", time);
      videoRef.current.currentTime = time;
    });

    return () => {
      socket.off("connect");
      socket.off("play");
      socket.off("pause");
      socket.off("seek");
    };
  }, [joined]);

  const handlePlay = () => {
    socket.emit("play", roomId);
  };

  const handlePause = () => {
    socket.emit("pause", roomId);
  };

  const handleSeek = () => {
    socket.emit("seek", {
      roomId,
      time: videoRef.current.currentTime,
    });
  };

  const handleJoin = () => {
    socket.emit("join", roomId);
    setJoined(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      {!joined ? (
        <div>
          <h2>🎬 Join a Movie Room</h2>
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleJoin}>Join Room</button>
        </div>
      ) : (
        <>
          <h3>Room: {roomId}</h3>
          <video
            ref={videoRef}
            width="640"
            height="360"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeek}
          >
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
          </video>
        </>
      )}
    </div>
  );
}

export default App;
