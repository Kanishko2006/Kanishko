
import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const videoRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!joined) return;

    socket.on("play", () => {
      videoRef.current.play();
    });

    socket.on("pause", () => {
      videoRef.current.pause();
    });

    socket.on("seek", (time) => {
      videoRef.current.currentTime = time;
    });

    return () => {
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
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
        </>
      )}
    </div>
  );
}

export default App;
