import socket from "@/lib/socket/config";
import React, { useEffect } from "react";

function useWebsocket(callback: () => void, key?: any) {
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      if (key) {
        socket.emit("join-room", key);
      }
      socket.io.engine.on("upgrade", (transport) => {});
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    callback();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
}

export default useWebsocket;
