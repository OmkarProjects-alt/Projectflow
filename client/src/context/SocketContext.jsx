import { createContext, useContext, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { io } from "socket.io-client";

import { useTaskStore } from "../store/tasksStore";

const socketUrl = (import.meta.env.VITE_SOCKET_URL || "https://projectflow-30pc.onrender.com")
  .replace(/^['"]|['"]$/g, "");

const socket = io(socketUrl, {
    withCredentials: true,
    transports: ["websocket"],
});

console.log("socket connection", socket, "and", import.meta.env.VITE_SOCKET_URL);

const SocketContext = createContext(socket);

export function SocketProvider({ children }) {

    const { userData } = useUserContext();

    const addMyTask = useTaskStore((state) => state.addMyTask);
    const updateMyTask = useTaskStore((state) => state.updateMyTask);

    useEffect(() => {

        socket.on("task:created", (task) => {
            addMyTask(task);
        });

        socket.on("task:updated", (task) => {
            updateMyTask(task);
        });

        socket.on("notification", (notification) => {
            console.log("My notification is ", notification.message, "and",  notification);
        });

        return () => {
            socket.off("task:created");
            socket.off("task:updated");
            socket.off("notification");
        }
    }, [])


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);