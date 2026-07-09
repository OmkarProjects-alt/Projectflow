import React, { useEffect, useState } from "react";
import { useTheme } from "../../../../context/ThemeProvider";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

const ProfileProjects = ({ user, userAssignedProjects, userCreatedProjects }) => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const getStatusStyle = (status) => {
    const statusMap = {
      "active": theme.status.progress,
      "planning": theme.status.todo,
      "completed": theme.status.completed,
      "on hold": theme.status.review,
    };
    return statusMap[status?.toLowerCase()] || theme.text.muted;
  };

  const visibleProjects = showAll
    ? userAssignedProjects
    : userAssignedProjects.slice(0, 5);

  const hasProjects = userAssignedProjects.length > 0;

  return (
    <div className={`
      ${theme.card.primary}
      ${theme.border}
      p-6
      max-h-125
      h-full
      overflow-y-auto
      transition-all
      duration-300
      scrollbar-thin
      scrollbar-thumb-gray-700
      scrollbar-track-transparent
    `}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className={`
            p-2 rounded-lg
            bg-blue-500/10
            ${theme.text.info}
          `}>
            <FolderKanban size={22} />
          </div>
          <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
            Projects
          </h2>
          <span className={`
            text-xs
            ${theme.text.muted}
            bg-white/5
            px-2 py-0.5
            rounded-full
          `}>
            {userAssignedProjects.length}
          </span>
        </div>

        <div className="flex gap-3">
          {/* Created Count */}
          <div className={`
            ${theme.card.secondary}
            px-4 py-2
            rounded-lg
            text-center
            min-w-[70px]
          `}>
            <p className={`text-xs ${theme.text.muted}`}>
              Created
            </p>
            <p className={`text-lg font-semibold ${theme.text.primary}`}>
              {userCreatedProjects?.length || 0}
            </p>
          </div>

          {/* Assigned Count */}
          <div className={`
            ${theme.card.secondary}
            px-4 py-2
            rounded-lg
            text-center
            min-w-[70px]
          `}>
            <p className={`text-xs ${theme.text.muted}`}>
              Assigned
            </p>
            <p className={`text-lg font-semibold ${theme.text.primary}`}>
              {userAssignedProjects?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2.5">
        {!hasProjects ? (
          <div className={`
            flex flex-col items-center justify-center
            py-12
            text-center
          `}>
            <div className={`
              p-4 rounded-full
              bg-blue-500/10
              ${theme.text.muted}
              mb-3
            `}>
              <FolderKanban className="h-12 w-12 opacity-30" />
            </div>
            <p className={`${theme.text.muted} text-sm font-medium`}>
              No assigned projects
            </p>
            <p className={`${theme.text.muted} text-xs mt-1 opacity-70`}>
              Projects assigned to this user will appear here
            </p>
          </div>
        ) : (
          visibleProjects.map((project) => (
            <Link
              key={project.pid}
              to={`/projectflow/projects/${project.pid}`}
              className={`
                flex
                items-center
                justify-between
                p-3.5
                rounded-lg
                ${theme.card.secondary}
                ${theme.card.hover}
                transition-all
                duration-200
                group
                cursor-pointer
                border
                border-transparent
                hover:border-blue-500/20
              `}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Project Avatar */}
                <div className={`
                  w-9 h-9
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500 to-blue-700
                  flex
                  items-center
                  justify-center
                  text-white
                  font-semibold
                  text-sm
                  flex-shrink-0
                  shadow-md
                  transition-transform
                  duration-200
                  group-hover:scale-105
                `}>
                  {project.title?.charAt(0)?.toUpperCase() || "P"}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`${theme.text.primary} text-sm font-medium truncate group-hover:text-blue-400 transition-colors duration-200`}>
                    {project.title || "Untitled Project"}
                  </span>
                  {project.description && (
                    <span className={`${theme.text.muted} text-xs truncate mt-0.5`}>
                      {project.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                {/* Status Badge */}
                <span className={`
                  px-2.5 py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${getStatusStyle(project.status)}
                `}>
                  {project.status || "Planning"}
                </span>

                {/* Arrow on hover */}
                <ArrowRight className={`
                  h-4 w-4
                  ${theme.text.muted}
                  transition-all
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:${theme.text.info}
                  opacity-0
                  group-hover:opacity-100
                `} />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Show More / Show Less */}
      {userAssignedProjects.length > 5 && (
        <div className="flex justify-center mt-5 pt-4 border-t border-gray-700/30">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`
              flex items-center gap-2
              text-sm
              font-medium
              ${theme.text.info}
              hover:${theme.text.primary}
              transition-all
              duration-200
              hover:gap-3
              cursor-pointer
            `}
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <span className="text-xs opacity-70">(−{userAssignedProjects.length - 5})</span>
              </>
            ) : (
              <>
                <span>Show More</span>
                <span className="text-xs opacity-70">(+{userAssignedProjects.length - 5})</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileProjects;