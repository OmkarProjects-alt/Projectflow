import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useProjectStore } from "../store/projectStore";
import { useUserStore } from '../store/userStore';
import { useTaskStore } from "../store/tasksStore";
import { useNotificationStore } from "../store/notificationStore";
import { useError } from "../context/ErrorAndSuccessMsgContext";
import MessageAlert from '../components/common/MessageAlert';
import { useUserContext } from "../context/UserContext";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";
import { useSocket } from "../context/SocketContext";
import { getProjectsId } from "../services/project.service";

export default function AppLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { theme } = useTheme();

  const socket = useSocket();

  const { addMessage } = useError();

  const { setUserData, userData, fetchUserData } = useUserContext();

  const MyProjects = useProjectStore((state) => state.MyProjects);
  const assignedProject = useProjectStore((state) => state.assignedProject);
  const loading = useProjectStore((state) => state.loading);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const users = useUserStore((state) => state.users);
  const messages = useUserStore((state) => state.messages);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const taskMessage = useTaskStore((state) => state.messages);

  const fetchNotifications =
    useNotificationStore(
        state=>state.fetchNotifications
    );

  useEffect(() => {
    // if(userData) return
    fetchUserData();
  }, [fetchUserData])

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchTasks();
    fetchNotifications();
  }, [fetchProjects, fetchUsers, fetchTasks, fetchNotifications]);

  useEffect(() => {
    if (messages?.isMessage) {
      addMessage(messages.String, messages.success);
    }

    if(taskMessage.isMessage) {
      addMessage(taskMessage.String, taskMessage.success);
    }

  }, [messages.isMessage, taskMessage.isMessage]);


  const fecthAllProjectIds = async () => {
    const result = await getProjectsId();

    if(result.data.success) {
      return result.data.projectIds;
    }
  }

  useEffect(() => {
    if (!userData) return;

    socket.emit("register", { userId: userData.uid });

    const joinAllProjects = async () => {
      try {
        const ids = await fecthAllProjectIds();
        if (ids) socket.emit("join-project", ids);
      } catch (e) {
      }
    };

    joinAllProjects();

    return () => {
      socket.off("register");
      socket.off("join-project");
    };
  }, [userData, socket]);


  return (
    <div className={`h-screen ${theme.layout.background} flex overflow-hidden`}>

    <Sidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />

  <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

    <Navbar
      setSidebarOpen={setSidebarOpen}
    />

    <main
      className="
        flex-1
        overflow-y-auto
        px-4
        py-4
        sm:px-6
        lg:px-8
        z-30 
      "
    >
      <Outlet />
    </main>

  </div>

</div>
  );
}