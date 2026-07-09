import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../context/ThemeProvider";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import { Link } from 'react-router-dom'
import CreateTaskModal from "../../../common/CreateTaskModal";
import DeleteTaskConfirm from "../../../common/DeleteTaskConfirm";
import { useTaskStore } from "../../../../store/tasksStore";

// Loading Skeleton Component
const TableSkeleton = ({ theme }) => {
  return (
    <div className={`${theme.card.primary} ${theme.border} overflow-hidden animate-pulse`}>
      {/* Header Skeleton */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.table.divider}`}>
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 rounded bg-gray-700" />
          <div className="h-5 w-8 rounded-full bg-gray-700" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-gray-700" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto max-h-70 h-70 overflow-y-auto">
        <table className="w-full">
          <thead className={`${theme.table.header} sticky top-0 z-10`}>
            <tr className={`${theme.table.divider} border-b`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <th key={i} className="px-3 py-3">
                  <div className="h-3 w-16 rounded bg-gray-700" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className={`${theme.table.divider} border-b`}>
                <td className="px-3 py-3.5">
                  <div className="h-4 w-32 rounded bg-gray-700" />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gray-700" />
                    <div className="h-4 w-20 rounded bg-gray-700" />
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="h-6 w-16 rounded-full bg-gray-700" />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-700" />
                    <div className="h-4 w-14 rounded bg-gray-700" />
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="h-4 w-24 rounded bg-gray-700" />
                </td>
                <td className="px-2 py-2">
                  <div className="h-8 w-8 rounded-lg bg-gray-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Skeleton */}
      <div className={`flex justify-center py-4 border-t ${theme.table.divider}`}>
        <div className="h-9 w-40 rounded-xl bg-gray-700" />
      </div>
    </div>
  );
};

const ProjectTasksTable = ({ tasks, project, loading }) => {
  const { theme } = useTheme();
  
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openDeleteConfirmModal, setDeleteConfirm] = useState({ status: false, taskId: null });
  const [OpenMenu, setOpenMenu] = useState({ status: false, id: null });

  const myProjectTasks = useTaskStore((state) => state.createdTasks);

  const { 
    createdTasksPagination, 
    fetchingLoading, 
    FetchMyTasks,
  } = useTaskStore();

  const [Task, setTask] = useState({});
  const [openEditTaskModal, setEditTaskModal] = useState({ 
    isOpen: false,
    title: "",
    description: "",
    deadline: "",
    status: "",
    priority: "",
    project: "",
    assign: "",
    taskId: "",
  });

  useEffect(() => {
    const closeMenu = () =>
      setOpenMenu({
        status: false,
        id: null,
      });

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const handleEditTask = (tid) => {
    const task = tasks.find(task => task.tid === tid);

    setEditTaskModal({
      isOpen: true,
      title: task?.title,
      description: task?.description,
      deadline: new Date(task?.deadline).toISOString().split("T")[0] || "",
      status: task?.status,
      priority: task?.priority,
      project: project?.pid,
      assign: task.assigned_user_id,
      taskId: task?.tid,
    });
  }

  const onLoadMore = () => {
    const page = createdTasksPagination.page + 1;
    const limit = 10;

    FetchMyTasks(page, limit, project.pid)
  }

  const getStatusStyle = (status) => {
    const statusMap = {
      "to do": theme.status.todo,
      "in progress": theme.status.progress,
      "review": theme.status.review,
      "completed": theme.status.completed,
    };
    return statusMap[status?.toLowerCase()] || theme.text.muted;
  };

  const getPriorityStyle = (priority) => {
    const priorityMap = {
      "high": theme.priority.high,
      "medium": theme.priority.medium,
      "low": theme.priority.low,
    };
    return priorityMap[priority?.toLowerCase()] || theme.text.muted;
  };

  const capitalizeWords = (text) => {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getUserColor = (user) => {
    if (!user) return theme.avatar?.[0] || "from-blue-500 to-blue-700";

    const hash = user
      ? user.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0;

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

    return colors[hash % colors.length];
  };

  // Show loading skeleton while fetching data
  if (loading) {
    return <TableSkeleton theme={theme} />;
  }

  return (
    <>
      {openTaskModal && (
        <CreateTaskModal
          open={openTaskModal}
          onClose={() => setOpenTaskModal(!openTaskModal)}
        />
      )}

      {openEditTaskModal.isOpen && (
        <CreateTaskModal
          open={openEditTaskModal.isOpen}
          onClose={() => setEditTaskModal({ ...openEditTaskModal, isOpen: false })}
          title={openEditTaskModal?.title}
          description={openEditTaskModal?.description}
          status={openEditTaskModal?.status}
          deadline={openEditTaskModal?.deadline}
          priority={openEditTaskModal?.priority}
          project={openEditTaskModal?.project}
          assign={openEditTaskModal?.assign}
          tid={openEditTaskModal?.taskId}
          from="TaskEditTable"
        />
      )}

      {openDeleteConfirmModal.status && (
        <DeleteTaskConfirm 
          open={openDeleteConfirmModal.status}
          onClose={() => setDeleteConfirm({ status: false, taskId: null })}
          taskId={openDeleteConfirmModal?.taskId}
        />
      )}

      <div className={`${theme.card.primary} ${theme.border} overflow-hidden`}>
        {/* Header */}
        <div className={`
          flex items-center justify-between
          px-4 py-3
          ${theme.table.divider}
          border-b
        `}>
          <h2 className={`text-base font-semibold ${theme.text.primary}`}>
            Tasks
            <span className={`ml-2 text-xs ${theme.text.muted} bg-white/5 px-2 py-0.5 rounded-full`}>
              {tasks?.length || 0}
            </span>
          </h2>

          <button
            onClick={() => setOpenTaskModal(!openTaskModal)}
            className={`
              flex items-center gap-2
              px-3 py-2
              rounded-lg
              ${theme.button.primary}
              text-white
              text-xs
              transition-all
              duration-200
              hover:scale-[1.02]
              active:scale-[0.98]
            `}
          >
            <Plus size={14} />
            Create Task
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-70 h-70 overflow-y-auto">
          <table className="w-full">
            <thead className={`${theme.table.header} sticky top-0 z-10`}>
              <tr className={`${theme.table.divider} border-b ${theme.text.secondary} text-xs`}>
                <th className="text-left px-3 py-3 font-medium">Title</th>
                <th className="text-left px-3 py-3 font-medium">Assigned</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="text-left px-3 py-3 font-medium">Priority</th>
                <th className="text-left px-3 py-3 font-medium">Due Date</th>
                <th className="text-left px-3 py-3 font-medium w-10"></th>
              </tr>
            </thead>

            <tbody>
              {tasks?.length > 0 ? (
                tasks.map((task) => {
                  const priorityStyle = getPriorityStyle(task.priority);
                  const randomColor = getUserColor(task.assigned_user_name);

                  return (
                    <tr
                      key={task.tid}
                      className={`
                        ${theme.table.row}
                        ${theme.table.divider}
                        border-b
                        transition-all
                        duration-200
                      `}
                    >
                      <td className="px-3 py-3.5">
                        <p className={`${theme.text.primary} text-sm max-w-xs truncate`}>
                          {task.title || "Untitled"}
                        </p>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <span
                              className={`
                                flex items-center justify-center
                                w-8 h-8
                                rounded-full
                                text-xs
                                font-semibold
                                text-white
                                bg-linear-to-br
                                ${randomColor}
                                shadow-md
                                transition-transform
                                duration-200
                                hover:scale-110
                              `}
                            >
                              {task?.assigned_user_name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>

                          {/* User Info */}
                          <div className="flex flex-col min-w-0">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`
                                ${theme.text.primary} 
                                text-sm 
                                font-medium 
                                truncate 
                                max-w-[80px] 
                                sm:max-w-[120px]
                                transition-colors
                                duration-200
                                group-hover:text-blue-400
                              `}>
                                {task?.assigned_user_name || "Unassigned"}
                              </span>
                              
                              {/* Role Badge */}
                              {task?.assigned_user_role && (
                                <span className={`
                                  px-1.5 py-0.5
                                  rounded-full
                                  text-[9px]
                                  font-medium
                                  bg-purple-500/10
                                  text-purple-400
                                  border
                                  border-purple-500/20
                                  hidden sm:inline-block
                                  whitespace-nowrap
                                `}>
                                  {task?.assigned_user_role}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className={`
                          px-2.5 py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${getStatusStyle(task.status)}
                        `}>
                          {capitalizeWords(task.status) || "Todo"}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`
                            inline-block
                            h-2 w-2
                            rounded-full
                            ${priorityStyle}
                          `} />
                          <span className={`${theme.text.secondary} text-sm`}>
                            {capitalizeWords(task.priority) || "Medium"}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className={`${theme.text.muted} text-sm`}>
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                        </span>
                      </td>

                      <td className="px-2 py-2 w-10 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu({
                              status: !(OpenMenu.status && OpenMenu.id === task.tid),
                              id: task.tid,
                            });
                          }}
                          className={`
                            p-1.5 rounded-lg
                            ${theme.text.muted}
                            hover:${theme.text.primary}
                            hover:bg-gray-200/20
                            dark:hover:bg-gray-800/50
                            transition-all
                            duration-200
                          `}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {OpenMenu.status && OpenMenu.id === task.tid && (
                          <div
                            className={`
                              absolute right-0 top-8
                              z-50
                              min-w-45
                              ${theme.card.secondary}
                              rounded-xl
                              shadow-2xl
                              overflow-hidden
                              animate-in
                              fade-in
                              zoom-in-95
                              border
                              ${theme.table.divider}
                            `}
                          >
                            <Link
                              className={`
                                flex items-center gap-3
                                px-4 py-2.5
                                text-sm
                                ${theme.text.secondary}
                                hover:${theme.text.primary}
                                hover:bg-gray-200/20
                                dark:hover:bg-gray-800/50
                                transition-all
                                duration-200
                              `}
                              to={`/projectflow/task/${task?.tid}`}
                            >
                              <Eye size={16} />
                              View Details
                            </Link>

                            <button
                              onClick={() => handleEditTask(task?.tid)}
                              className={`
                                w-full flex items-center gap-3
                                px-4 py-2.5
                                text-sm
                                ${theme.text.secondary}
                                hover:${theme.text.primary}
                                hover:bg-gray-200/20
                                dark:hover:bg-gray-800/50
                                transition-all
                                duration-200
                              `}
                            >
                              <Pencil size={16} />
                              Edit Task
                            </button>

                            {task.status?.toLowerCase() === "review" && (
                              <button
                                className={`
                                  w-full flex items-center gap-3
                                  px-4 py-2.5
                                  text-sm
                                  ${theme.text.success}
                                  hover:bg-green-500/10
                                  transition-all
                                  duration-200
                                `}
                              >
                                <CheckCircle2 size={16} />
                                Mark Complete
                              </button>
                            )}

                            <div className={`h-px ${theme.table.divider}`} />

                            <button
                              onClick={() => setDeleteConfirm({ status: true, taskId: task?.tid })}
                              className={`
                                w-full flex items-center gap-3
                                px-4 py-2.5
                                text-sm
                                ${theme.text.danger}
                                hover:bg-red-500/10
                                transition-all
                                duration-200
                              `}
                            >
                              <Trash2 size={16} />
                              Delete Task
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className={theme.text.muted}>
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No tasks found</p>
                      <button
                        onClick={() => setOpenTaskModal(true)}
                        className={`text-sm ${theme.text.info} hover:underline mt-1`}
                      >
                        Create your first task
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div
            className={`
                flex
                justify-center
                py-4
                border-t
                ${theme.table.divider}
            `}
          >
            {createdTasksPagination?.hasNext ? (
                <button
                    disabled={fetchingLoading}
                    onClick={onLoadMore}
                    className={`
                        px-5
                        py-2
                        rounded-xl
                        ${theme.button.primary}
                        text-white
                        text-sm
                        transition-all
                        duration-200
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        hover:scale-[1.02]
                        active:scale-[0.98]
                    `}
                >
                    {fetchingLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Loading...
                        </div>
                    ) : (
                        `Load More (${createdTasksPagination.total - tasks.length} remaining)`
                    )}
                </button>
            ) : (
                tasks.length > 0 && (
                    <p className={`${theme.text.muted} text-sm`}>
                        You've reached the end.
                    </p>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTasksTable;