import React, { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import {
  CalendarDays,
  ArrowLeft,
  Pencil,
  AwardIcon
} from "lucide-react";
import CreateProjectModal from "./CreateProjectModal";
import CreateTaskModal from "./CreateTaskModal";
import { useNavigate } from "react-router-dom";
import { StatusDropdown, useUpdateStatus } from "./StatusDropdown";

const CommonHeader = ({ 
  title, 
  description, 
  status, 
  progress, 
  deadline, 
  startDate, 
  from, 
  projectN = null, 
  assign = {}, 
  priority = null, 
  project, 
  isFromAssignedTask,
  task 
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [openTaskUpdateModal, setTaskUpdateModal] = useState(false);
  const [openProjectUpdateModal, setProjectUpdateModal] = useState(false);
  
  const updateStatus = useUpdateStatus();

  const handleEdit = () => {
    if (from === "TaskDetail") {
      setTaskUpdateModal(!openTaskUpdateModal);
    } else {
      setProjectUpdateModal(!openProjectUpdateModal);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return theme.status.progress;
      case "planning":
        return theme.status.todo;
      case "on-hold":
        return theme.status.review;
      case "completed":
        return theme.status.completed;
      case "cancelled":
        return theme.status.overdue;
      default:
        return theme.text.muted;
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return theme.priority.high;
      case "medium":
        return theme.priority.medium;
      case "low":
        return theme.priority.low;
      default:
        return theme.text.muted;
    }
  };

  // Get avatar gradient based on title
  const getAvatarGradient = (text) => {
    const gradients = theme.avatar || [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-700",
      "from-pink-500 to-rose-700",
      "from-cyan-500 to-sky-700",
      "from-indigo-500 to-indigo-700",
      "from-red-500 to-red-700",
    ];
    const index = text?.charAt(0)?.toUpperCase()?.charCodeAt(0) || 0;
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-4">
      {/* Modals */}
      {openProjectUpdateModal && (
        <CreateProjectModal 
          open={openProjectUpdateModal}
          onClose={() => setProjectUpdateModal(!openProjectUpdateModal)}
          title={project?.title}
          description={project?.description}
          status={project?.status}
          deadline={new Date(project?.deadline).toISOString().split("T")[0]}
          startDate={new Date(project?.start_date).toISOString().split("T")[0]}
          from="commonH"
        />
      )}
      
      {openTaskUpdateModal && (
        <CreateTaskModal 
          open={openTaskUpdateModal} 
          onClose={() => setTaskUpdateModal(!openTaskUpdateModal)}
          title={task?.title}
          description={task?.description}
          status={task?.status}
          deadline={new Date(task?.deadline).toISOString().split("T")[0] || ""}
          priority={task?.priority}
          project={project?.pid}
          assign={assign?.uid}
          from="commonH"
        />
      )}

      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
        {/* Left Side */}
        <div className="flex gap-4 w-full sm:w-auto">
          {/* Project Avatar */}
          <div className={`
            w-14 h-14 sm:w-16 sm:h-16
            rounded-2xl
            bg-linear-to-br
            ${getAvatarGradient(from === "TaskDetail" ? projectN : title)}
            flex items-center justify-center
            text-2xl sm:text-3xl
            font-bold text-white
            shrink-0
            shadow-lg
          `}>
            {from === "TaskDetail" ? projectN?.charAt(0)?.toUpperCase() : title?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div className="flex-1 min-w-0">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className={`
                flex items-center gap-2
                ${theme.text.muted}
                hover:${theme.text.primary}
                text-sm mb-2
                cursor-pointer
                transition-colors
                duration-200
              `}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            {/* Title */}
            <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary} truncate`}>
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className={`${theme.text.muted} mt-1 max-w-3xl text-sm sm:text-base`}>
                {description}
              </p>
            )}

            {/* Status + Deadline + Progress */}
            {from === "projectDetail" && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {/* Status Badge */}
                <span className={`
                  px-3 py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${getStatusStyle(status)}
                `}>
                  {status}
                </span>

                {/* Deadline */}
                {deadline && (
                  <div className={`flex items-center gap-2 ${theme.text.secondary} text-sm`}>
                    <CalendarDays size={15} />
                    {new Date(deadline).toLocaleDateString()}
                  </div>
                )}

                {/* Progress */}
                {progress !== undefined && progress !== null && (
                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-32 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <span className={`${theme.text.primary} text-sm font-medium`}>
                      {Math.min(progress, 100)}%
                    </span>
                  </div>
                )}

                {/* Priority (if task) */}
                {from === "TaskDetail" && priority && (
                  <span className={`
                    px-2.5 py-0.5
                    rounded-full
                    text-xs
                    font-medium
                    ${getPriorityStyle(priority)}
                  `}>
                    {priority}
                  </span>
                )}
              </div>
            )}

            {/* Task specific info */}
            {from === "TaskDetail" && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {/* Status */}
                <span className={`
                  px-3 py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${getStatusStyle(status)}
                `}>
                  {status}
                </span>

                {/* Priority */}
                {priority && (
                  <span className={`
                    px-2.5 py-0.5
                    rounded-full
                    text-xs
                    font-medium
                    ${getPriorityStyle(priority)}
                  `}>
                    {priority}
                  </span>
                )}

                {/* Deadline */}
                {deadline && (
                  <div className={`flex items-center gap-2 ${theme.text.secondary} text-sm`}>
                    <CalendarDays size={15} />
                    {new Date(deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {!isFromAssignedTask && from ? (
            <button
              onClick={handleEdit}
              className={`
                flex items-center justify-center
                gap-2
                px-4 py-2
                w-full sm:w-auto
                rounded-xl
                ${theme.button.secondary}
                ${theme.text.primary}
                transition-all
                duration-200
                hover:scale-[1.02]
                active:scale-[0.98]
                cursor-pointer
              `}
            >
              <Pencil size={16} />
              Edit {from === "TaskDetail" ? "Task" : "Project"}
            </button>
          ) : from ? (
            <StatusDropdown
              currentStatus={status}
              onStatusChange={(newStatus) => {
                updateStatus(task?.tid, newStatus);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;