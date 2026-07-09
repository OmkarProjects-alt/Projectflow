import React, { useMemo } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from "../../../context/ThemeProvider";
import { useTaskStore } from "../../../store/tasksStore";
import { useUserStore } from "../../../store/userStore";
import { CalendarDays, ArrowRight, FolderKanban } from "lucide-react";
import FormateDate from "../../../utils/FormateDate";

const ProjectCard = ({ project, index }) => {
  const { theme } = useTheme();

  const { createdTasks } = useTaskStore();

  const { users } = useUserStore();

  const getMembersWorkingOnProject = useMemo(() => {
      return [
        ...new Set(
          createdTasks
            .filter(task => task.project_id === project.pid)
            .map(task => task.user_assigned_name)
            .filter(Boolean)
        )
      ].slice(0, 3);
  }, [createdTasks, project])

  const getStatusStyle = (status) => {
    const statusMap = {
      "active": theme.status.progress,
      "planning": theme.status.todo,
      "on-hold": theme.status.review,
      "completed": theme.status.completed,
      "cancelled": theme.status.overdue,
    };
    return statusMap[status?.toLowerCase()] || theme.text.muted;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "from-emerald-500 to-green-600";
    if (progress >= 50) return "from-blue-500 to-blue-600";
    if (progress >= 25) return "from-amber-500 to-orange-600";
    return "from-gray-500 to-gray-600";
  };

  const projectColors = theme.avatar || [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-700",
    "from-pink-500 to-rose-700",
    "from-cyan-500 to-sky-700",
    "from-indigo-500 to-indigo-700",
    "from-red-500 to-red-700",
  ];

  const randomColor = projectColors[index % projectColors.length];

  const daysRemaining = project?.deadline ? FormateDate(project.deadline, "convertToDays") : null;

  return (
    <div
      className={`
        ${theme.card.primary}
        ${theme.card.hover}
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-blue-500/5
        flex
        flex-col
        h-full
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Project Avatar */}
        <div className={`
          shrink-0
          w-12 h-12
          rounded-xl
          bg-linear-to-br
          ${randomColor}
          flex
          items-center
          justify-center
          text-xl
          font-bold
          text-white
          shadow-lg
        `}>
          {project?.title?.charAt(0)?.toUpperCase() || "P"}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold ${theme.text.primary} truncate`}>
            {project?.title || "Untitled Project"}
          </h3>
          <p className={`${theme.text.muted} text-sm mt-0.5 line-clamp-2`}>
            {project?.description || "No description"}
          </p>
        </div>
      </div>

      {/* Status & Days Remaining */}
      <div className="mt-4 flex items-center justify-between">
        <span className={`
          px-3 py-1
          text-xs
          font-medium
          rounded-full
          ${getStatusStyle(project.status)}
        `}>
          {project?.status || "Planning"}
        </span>

        {daysRemaining !== null && (
          <span className={`
            text-xs font-medium
            ${daysRemaining < 0 ? theme.text.danger : theme.text.muted}
            flex items-center gap-1
          `}>
            {daysRemaining < 0 ? "⚠️ Overdue" : `${daysRemaining} days left`}
          </span>
        )}
      </div>

      {/* Progress Section */}
      <div className="mt-4 flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <div className={`flex items-center gap-2 ${theme.text.muted} text-xs`}>
            <CalendarDays size={14} />
            <span>
              Due: {project?.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
            </span>
          </div>

          <span className={`text-sm font-semibold ${theme.text.primary}`}>
            {Math.min(project?.progress || 0, 100)}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
          <div
            className={`
              h-full
              bg-linear-to-r
              ${getProgressColor(project?.progress || 0)}
              rounded-full
              transition-all
              duration-1000
              ease-out
            `}
            style={{
              width: `${Math.min(project?.progress || 0, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-700/50 flex justify-between items-center">
        <span className={`text-xs ${theme.text.muted}`}>
          ID: #{project?.pid || "N/A"}
        </span>

        <Link
          className={`
            flex items-center gap-2
            ${theme.text.info}
            hover:${theme.text.info}
            text-sm
            font-medium
            transition-all
            duration-200
            group
          `}
          to={`/projectflow/projects/${project?.pid}`}
          state={project}
        >
          View Details
          <ArrowRight 
            size={16} 
            className="transition-transform duration-200 group-hover:translate-x-1" 
          />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;