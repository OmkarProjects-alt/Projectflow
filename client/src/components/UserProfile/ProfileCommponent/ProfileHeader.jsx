import React, { useState, useMemo } from "react";
import { useTheme } from "../../../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Edit, MapPin, User, Briefcase, Shield, Hash, X } from "lucide-react";
import EditAndCreateProfileModal from "../../common/EditAndCreateProfileModal";
import { useProjectStore } from "../../../store/projectStore";
import RemoveMemberModal from "../../common/RemoveMemberModal";

const ProfileHeader = ({ user, isCurrentUser, userAssignedProjects }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [removeModal, setRemoveModal] = useState({ open: false, member: null });

  const MyProjects = useProjectStore((state) => state.MyProjects);

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
  })

  console.log("MY all project fomr profile header", MyProjects);

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
      
      <div className="flex flex-col gap-3">
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
          Back to Profile
        </button>

        {/* Profile Card */}
        <div className={`
          ${theme.card.primary}
          p-5
          rounded-2xl
          transition-all
          duration-300
          ${theme.card.hover}
        `}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div className={`
              shrink-0
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
            `}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 w-full">
              {/* Left Section - Name & Details */}
              <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                <h2 className={`text-2xl md:text-3xl font-bold ${theme.text.primary}`}>
                  {user?.name || "Unknown User"}
                </h2>

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
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {/* Status */}
                  <div className="flex flex-col">
                    <span className={`text-xs ${theme.text.muted} uppercase tracking-wider`}>
                      Status
                    </span>
                    <span className={`
                      text-sm font-medium
                      ${theme.status.completed}
                      flex items-center gap-1.5
                      mt-0.5
                    `}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Active
                    </span>
                  </div>

                  {/* Role */}
                  <div className="flex flex-col">
                    <span className={`text-xs ${theme.text.muted} uppercase tracking-wider`}>
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
                      Employee ID
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
                
                {/* Remove Button */}
                {!isCurrentUser && CheckIsInvolvedInMyProjects && (
                  <div className="mt-2 w-full">
                    <button
                      onClick={() => setRemoveModal({ open: true, member: user })}
                      className={`
                        w-full
                        px-4 py-2
                        rounded-lg
                        text-sm font-medium
                        ${theme.button.danger}
                        text-white
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