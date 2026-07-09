import React, { useState, useMemo } from "react";
import { useTheme } from "../../../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Edit, 
  MapPin, 
  User, 
  Briefcase, 
  Shield, 
  Hash, 
  X,
  CheckCircle,
  Clock,
  Users,
  Award,
  Activity
} from "lucide-react";
import EditAndCreateProfileModal from "../../common/EditAndCreateProfileModal";
import { useProjectStore } from "../../../store/projectStore";
import RemoveMemberModal from "../../common/RemoveMemberModal";
import { useUserStore } from "../../../store/userStore";

const ProfileHeader = ({ user, isCurrentUser, userAssignedProjects }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [removeModal, setRemoveModal] = useState({ open: false, member: null });

  const MyProjects = useProjectStore((state) => state.MyProjects);
  const onlineUsers = useUserStore(state => state.onlineUsers);
  const isOnline = onlineUsers[user?.uid];

  const CheckIsInvolvedInMyProjects = useMemo(() => {
    let CommonProjects = [];  
    MyProjects.forEach((project) => {
      const commonProject = userAssignedProjects.filter((p) =>
        p.pid === project.pid
      );
      CommonProjects.push(commonProject[0]);
    });

    if(CommonProjects.length > 0) {
      return true;
    } else {
      return false;
    }
  }, [MyProjects, userAssignedProjects]);

  const getDate = (date) => {
    if (!date) return "N/A";
    try {
      const toLocal = date.split("T")[0];
      return new Date(toLocal).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getAvatarGradient = (name) => {
    const colors = theme.avatar || [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-700",
      "from-pink-500 to-rose-700",
      "from-cyan-500 to-sky-700",
      "from-indigo-500 to-indigo-700",
      "from-red-500 to-red-700",
    ];
    const hash = name ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const avatarGradient = getAvatarGradient(user?.name);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {openEditModal && (
        <EditAndCreateProfileModal 
          open={openEditModal}
          onClose={() => setOpenEditModal(!openEditModal)}
          user={user}
        />
      )}

      {removeModal.open && (
        <RemoveMemberModal
          open={removeModal.open}
          onClose={() => setRemoveModal({ open: false, member: null })}
          member={removeModal.member}
          userAssignedProjects={userAssignedProjects}
          projects={MyProjects}
        />
      )}
      
      <div className="flex flex-col gap-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`
            flex items-center gap-2
            text-sm
            ${theme.text.muted}
            hover:${theme.text.primary}
            transition-all
            duration-200
            cursor-pointer
            w-fit
            group
          `}
        >
          <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Team
        </button>

        {/* Profile Card */}
        <div className={`
          ${theme.card.primary}
          p-6
          rounded-2xl
          transition-all
          duration-300
          ${theme.card.hover}
          border
          ${theme.border}
          shadow-xl
          shadow-black/10
        `}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className={`
                w-28 h-28
                md:w-32 md:h-32
                rounded-full
                bg-linear-to-br
                ${avatarGradient}
                flex
                items-center
                justify-center
                text-5xl
                md:text-6xl
                font-bold
                text-white
                shadow-xl
                shadow-blue-500/20
                transition-transform
                duration-300
                hover:scale-105
                relative
              `}>
                {getInitials(user?.name)}
              </div>
              
              {/* Online Status Badge */}
              <div className={`
                absolute -bottom-1 -right-1
                p-1.5
                rounded-full
                ${isOnline ? 'bg-emerald-500' : 'bg-gray-500'}
                border-4
                ${theme.card.primary}
                ${theme.border}
                shadow-lg
                transition-all
                duration-300
                ${isOnline ? 'animate-pulse' : ''}
              `}>
                <div className={`
                  w-2.5 h-2.5
                  rounded-full
                  ${isOnline ? 'bg-emerald-400' : 'bg-gray-400'}
                `} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 w-full">
              {/* Left Section - Name & Details */}
              <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left w-full md:w-auto">
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  <h2 className={`text-2xl md:text-3xl font-bold ${theme.text.primary}`}>
                    {user?.name || "Unknown User"}
                  </h2>
                  
                  {/* Status Badge */}
                  <span className={`
                    inline-flex items-center gap-1.5
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${isOnline 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }
                  `}>
                    <span className={`
                      w-1.5 h-1.5
                      rounded-full
                      ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}
                    `} />
                    {isOnline ? 'Active Now' : 'Offline'}
                  </span>
                </div>

                {/* Email */}
                <div className={`flex items-center gap-2 ${theme.text.secondary} text-sm`}>
                  <Mail size={16} className="shrink-0" />
                  <span className="break-all">{user?.email || "No email"}</span>
                </div>

                {/* Location */}
                {user?.location && (
                  <div className={`flex items-center gap-2 ${theme.text.secondary} text-sm`}>
                    <MapPin size={16} className="shrink-0" />
                    <span>{user.location}</span>
                  </div>
                )}

                {/* Joined Date */}
                <div className={`flex items-center gap-2 ${theme.text.muted} text-sm`}>
                  <Calendar size={16} className="shrink-0" />
                  <span>Joined {getDate(user?.created_at)}</span>
                </div>

                {/* Role Badge or Edit Button */}
                {!isCurrentUser ? (
                  <div className={`
                    px-4 py-1.5
                    rounded-full
                    text-sm
                    font-medium
                    ${user?.role === "user" 
                      ? theme.status.todo
                      : theme.status.progress
                    }
                    flex
                    items-center
                    gap-2
                    w-fit
                  `}>
                    <Shield size={14} />
                    {user?.role === "user" ? "Member" : "Administrator"}
                  </div>
                ) : (
                  <button
                    onClick={() => setOpenEditModal(!openEditModal)}
                    className={`
                      flex items-center gap-2
                      px-5 py-2.5
                      rounded-lg
                      ${theme.button.primary}
                      text-white
                      font-medium
                      transition-all
                      duration-200
                      hover:scale-[1.02]
                      hover:shadow-lg
                      hover:shadow-blue-500/25
                      active:scale-[0.98]
                      cursor-pointer
                    `}
                  >
                    <Edit size={17} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Right Section - Stats */}
              <div className={`
                flex flex-col gap-3 items-center
                w-full
                md:w-auto
                md:pl-6
                md:border-l
                ${theme.table.divider}
                pt-4
                md:pt-0
                mt-4
                md:mt-0
                border-t
                md:border-t-0
              `}>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full">
                  {/* Status */}
                  <div className="flex flex-col">
                    <span className={`text-xs ${theme.text.muted} uppercase tracking-wider flex items-center gap-1`}>
                      <Activity size={12} />
                      Status
                    </span>
                    <span className={`
                      text-sm font-medium
                      ${isOnline ? theme.status.completed : theme.text.muted}
                      flex items-center gap-1.5
                      mt-0.5
                    `}>
                      <span className={`
                        w-1.5 h-1.5 
                        rounded-full 
                        ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}
                      `} />
                      {isOnline ? 'Active' : 'Offline'}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="flex flex-col">
                    <span className={`text-xs ${theme.text.muted} uppercase tracking-wider flex items-center gap-1`}>
                      <Shield size={12} />
                      Role
                    </span>
                    <span className={`
                      text-sm font-medium
                      ${user?.role === "user" 
                        ? theme.status.todo
                        : theme.status.progress
                      }
                      mt-0.5
                    `}>
                      {user?.role === "user" ? "Member" : "Admin"}
                    </span>
                  </div>

                  {/* Employee ID */}
                  <div className="flex flex-col">
                    <span className={`text-xs ${theme.text.muted} uppercase tracking-wider flex items-center gap-1`}>
                      <Hash size={12} />
                      ID
                    </span>
                    <span className={`text-sm font-mono ${theme.text.secondary} mt-0.5`}>
                      {user?.uid?.split("-")[0] || "N/A"}...
                    </span>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col">
                    <span className={`text-xs ${theme.text.muted} uppercase tracking-wider flex items-center gap-1`}>
                      <Briefcase size={12} />
                      Department
                    </span>
                    <span className={`text-sm font-medium ${theme.text.secondary} mt-0.5`}>
                      {user?.user_role || "Not specified"}
                    </span>
                  </div>
                </div>

                {/* Projects & Tasks Stats */}
                <div className="flex gap-4 w-full mt-1">
                  <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <Users className={`h-4 w-4 ${theme.text.info}`} />
                    <div>
                      <p className={`text-xs ${theme.text.muted}`}>Projects</p>
                      <p className={`text-sm font-semibold ${theme.text.primary}`}>
                        {userAssignedProjects?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                    <Award className={`h-4 w-4 ${theme.text.warning}`} />
                    <div>
                      <p className={`text-xs ${theme.text.muted}`}>Tasks</p>
                      <p className={`text-sm font-semibold ${theme.text.primary}`}>
                        {user?.totalTasks || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Remove Button */}
                {!isCurrentUser && CheckIsInvolvedInMyProjects && (
                  <div className="mt-2 w-full">
                    <button
                      onClick={() => setRemoveModal({ open: true, member: user })}
                      className={`
                        w-full
                        px-4 py-2.5
                        rounded-lg
                        text-sm font-medium
                        bg-red-500/10
                        text-red-400
                        border border-red-500/20
                        hover:bg-red-500/20
                        transition-all
                        duration-200
                        hover:scale-[1.02]
                        active:scale-[0.98]
                        cursor-pointer
                      `}
                    >
                      Remove Member
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;