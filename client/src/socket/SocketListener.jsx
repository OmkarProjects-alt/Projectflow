import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

import { useNotificationStore } from "../store/notificationStore";
import { useActivityStore } from "../store/activityStore";
import { useTaskStore } from "../store/tasksStore";
import { useUserStore } from "../store/userStore";


export default function SocketListener() {

    const socket = useSocket();

    const { updateMyTask } = useTaskStore();

    const addNotification =
        useNotificationStore(
            state => state.addNotification
        );

    const addActivity =
        useActivityStore(
            state => state.addActivity
        );

    const addAssignedTask =
        useTaskStore(
            state => state.addAssignedTask
        );

    const setUserStatus = useUserStore(state => state.setUserStatus);

    useEffect(() => {
        socket.on("user:status", ({ userId, isOnline }) => {
            setUserStatus(userId, isOnline);
        });

        return () => {
            socket.off("user:status");
        };
    }, [setUserStatus]);

    useEffect(() => {

        socket.on( "notification", (data) => {
            console.log("socket notification", data);
            addNotification(data);
        });

        socket.on("activity", (data) => {
            console.log("my comming activity", data);
            addActivity(data);
        });

        socket.on( "task:assigned", (data) => {
            addAssignedTask(data);
        });

        socket.on("task:updated", (data) => {
            console.log("socket comming tast", data);
            updateMyTask(data)
        });


        return () => {

            socket.off("notification");
            socket.off("activity");
            socket.off("task:assigned");
            socket.off("task:updated");
        };

    }, []);

    return null;
}