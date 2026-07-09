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
import UserProfilePageSkeleton from "./UserProfilePageSkeleton";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { userData } = useUserContext();

  const users = useUserStore((state) => state.users);

  const projects = useProjectStore((state) => state.MyProjects);

  const { addMessage } = useError();

  const [loading, setLoading] = useState(true); // Start with loading true
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
  }, [userId, userData, users]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
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
  }, [user?.uid, user, isCurrentUser, projects, addMessage]);

  // Show skeleton while loading
  if (loading) {
    return <UserProfilePageSkeleton />;
  }

  // If no user found, show a message
  if (!user) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${theme.card.primary} rounded-xl`}>
        <p className={`text-lg ${theme.text.primary}`}>User not found</p>
        <p className={`text-sm ${theme.text.muted} mt-2`}>The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className={`mt-4 px-6 py-2 rounded-lg ${theme.button.primary} text-white`}
        >
          Go Back
        </button>
      </div>
    );
  }

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