import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useAuth } from "../hooks/useAuth";


const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {user}  = useAuth()
  const socket =  useMemo(() => {
    if(user){
      console.log("user found" , "connecting to socket")
          return io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001" , {withCredentials : true});
    }
    return null
  }, [user]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connection successfull", socket.id);
    });

    return () => {
      if (socket) {
        socket.off("connect", () => {
          console.log("connection successfull", socket.id);
        });
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
