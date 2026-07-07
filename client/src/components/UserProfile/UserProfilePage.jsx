import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import ProfileHeader from "./ProfileCommponent/ProfileHeader";
import ProfileFooter from "./ProfileCommponent/ProfileFooter";
import ProfileCard from "./ProfileCommponent/ProfileCard";
import { useUserStore } from "../../store/userStore";
import { useProjectStore } from "../../store/projectStore";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import {
  getCreatedProjectsOfUser,
  getAssignedProjectsOfUser,
} from "../../services/project.service";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { userData } = useUserContext();

  const users = useUserStore((state) => state.users);

  const projects = useProjectStore((state) => state.MyProjects);

  const { addMessage } = useError();

  const [loading, setLoading] = useState(false);
  const [userCreatedProjects, setUserCreatedProjects] = useState([]);
  const [userAssignedProjects, setUserAssignedProjects] = useState([]);

  const [isCurrentUser, setCurrentUser] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    if (!userId) return;
    if (!userData) return;

    if (userId === userData?.uid) {
      setUser(userData);
      setCurrentUser(true);
    } else {
      const getUser = users.filter((user) => user.uid === userId);
      setCurrentUser(false);
      setUser(getUser[0]);
    }
  }, [userId, userData]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);

        // const [createdRes, assignedRes] =
        //     await Promise.all([
        //       getCreatedProjectsOfUser(user.uid),
        //       getAssignedProjectsOfUser(user.uid),
        //     ]);

        const assignedRes = await getAssignedProjectsOfUser(user.uid);

        if (!isCurrentUser) {
          const createdRes = await getCreatedProjectsOfUser(user.uid);

          if (createdRes?.data?.success) {
            setUserCreatedProjects(createdRes.data.projects || []);
          }
        } else {
          setUserCreatedProjects(projects || []);
        }

        if (assignedRes?.data?.success) {
          console.log("comming assinged data", assignedRes.data.projects, "and", userAssignedProjects)
          setUserAssignedProjects(assignedRes.data.projects || []);
        } else {
          setUserAssignedProjects([])
        }
      } catch (error) {
        addMessage(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.uid, user]);

  if (loading) {
    return (
      <div className="bg-[#0b1423e4] border border-gray-800 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-neutral-700 rounded mb-6" />

          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-neutral-800 rounded-lg mb-3" />
          ))}
        </div>
      </div>
    );
  }

  console.log("Cheking user data", userAssignedProjects);

  return (
    <div className="flex flex-col p-3">
      {/* Profile Header */}
      <ProfileHeader 
        user={user} 
        isCurrentUser={isCurrentUser} 
        userAssignedProjects={userAssignedProjects}
      />

      {/* Cards */}
      <ProfileCard 
        user={user}
        userAssignedProjects={userAssignedProjects}
      />

      {/* Profile Footer  */}
      <ProfileFooter
        user={user}
        isCurrentUser={isCurrentUser}
        userCreatedProjects={userCreatedProjects}
        userAssignedProjects={userAssignedProjects}
      />
    </div>
  );
};

export default UserProfilePage;
