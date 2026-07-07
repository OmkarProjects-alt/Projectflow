import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import { useProjectStore } from '../../../../store/projectStore'
import { useUserStore } from '../../../../store/userStore'
import { getAssignedProject } from '../../../../services/project.service'
import { useError } from '../../../../context/ErrorAndSuccessMsgContext'
import { Link } from 'react-router-dom'
import { Eye, ClipboardCheck, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import FormateDate from '../../../../utils/FormateDate'
import { useTaskStore } from '../../../../store/tasksStore'

const AllTasksTable = ({ tasks }) => {
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState({ status: false, taskId: null })
  const [currentPage, setCurrentPage] = useState(1);

  const menuRef = useRef(null);

  const TASKS_PER_PAGE = 10;

  const { addMessage } = useError();

  const assignedProject = useProjectStore((state) => state.assignedProject)
  const setAssignedProjects = useProjectStore((state) => state.setAssignedProjects);
  const FecthAssignedProjects = useProjectStore((state) => state.FecthAssignedProjects);
  const messages = useProjectStore((state) => state.messages);
  
  const MyTasksPagination = useTaskStore((state) => state.MyTasksPagination);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const allTasksLoaded = useTaskStore((state) => state.allTasksLoaded);

  const users = useUserStore((state) => state.users);

  console.log("cheking user data format", users)

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu({ status: false, taskId: null });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const loadAssignedProjects = async () => {
      setLoading(true);
      if (assignedProject.length > 0) {
        setLoading(false);
        return;
      }

      try {
        await FecthAssignedProjects();
      } finally {
        setLoading(false);
      }
    };

    loadAssignedProjects();
  }, [assignedProject.length, FecthAssignedProjects]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Load tasks when page changes
  useEffect(() => {
    if (currentPage === 1 && tasks.length > 0) return;
    
    const loadTasksForPage = async () => {
      try {
        setLoadingMore(true);
        await fetchTasks(currentPage, TASKS_PER_PAGE);
      } catch (error) {
        console.log(error?.response?.data?.message || error?.message);
        addMessage(error?.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoadingMore(false);
      }
    };

    loadTasksForPage();
  }, [currentPage, fetchTasks, TASKS_PER_PAGE]);

  const filters = [
    { label: "All Tasks", value: "all" },
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in progress" },
    { label: "Review", value: "review" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "overdue" },
  ];

  // Client-side filtering (for status filters)
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true;

    if (activeFilter === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      return (
        task.deadline < today &&
        task.status?.toLowerCase() !== "completed"
      );
    }

    return task.status?.toLowerCase() === activeFilter;
  });

  // Use backend pagination info
  const totalPages = MyTasksPagination?.totalPages || 0;
  const hasNext = MyTasksPagination?.hasNext || false;
  const hasPrev = MyTasksPagination?.hasPrev || false;
  const totalTasks = MyTasksPagination?.total || tasks.length || 0;

  // Calculate start and end index for display
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + filteredTasks.length - 1, totalTasks);

  const getColor = (data) => {
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

    if (!data) return colors[0];

    const value = data.name || data.title || "Unknown";
    const hash = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getProjectName = (projectId) => {
    const project = assignedProject.find(
      (project) => project.pid === projectId
    );

    if (!project) return <span className={theme.text.muted}>Unknown Project</span>;

    return (
      <div className='flex items-center gap-2'>
        <div className={`
          flex items-center justify-center
          w-7 h-7
          text-[11px]
          rounded-full
          font-semibold
          text-white
          bg-linear-to-br
          ${getColor(project)}
          shrink-0
        `}>
          {project?.title?.charAt(0)?.toUpperCase() || "P"}
        </div>
        <span className={`${theme.text.secondary} text-sm truncate max-w-30`}>
          {project?.title || "Unknown Project"}
        </span>
      </div>
    );
  };

  const getUserName = (name) => {
    if (!name) return <span className={theme.text.muted}>Unknown User</span>;

    return (
      <div className='flex items-center gap-2'>
        <div className={`
          flex items-center justify-center
          w-7 h-7
          text-[10px]
          rounded-full
          font-semibold
          text-white
          bg-linear-to-br
          ${getColor(name)}
          shrink-0
        `}>
          {name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <span className={`${theme.text.secondary} text-sm truncate max-w-25`}>
          {name || "Unknown User"}
        </span>
      </div>
    );
  };

  const getDeadlineStyle = (deadline, status) => {
    const days = FormateDate(deadline, "convertToDays");

    if (status?.toLowerCase() === "completed") {
      return theme.text.success;
    }

    if (days < 0) {
      return theme.text.danger;
    }

    if (days <= 5) {
      return theme.text.danger;
    }

    if (days <= 10) {
      return theme.text.warning;
    }

    return theme.text.muted;
  };

  const getPriorityStyle = (priority) => {
    const priorityMap = {
      "high": theme.priority.high,
      "medium": theme.priority.medium,
      "low": theme.priority.low,
    };
    return priorityMap[priority?.toLowerCase()] || theme.text.muted;
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      "todo": theme.status.todo,
      "in progress": theme.status.progress,
      "review": theme.status.review,
      "completed": theme.status.completed,
    };
    return statusMap[status?.toLowerCase()] || theme.text.muted;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Pagination helper
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            disabled={loadingMore}
            className={`
              px-3 py-1.5
              rounded-lg
              text-sm
              font-medium
              transition-all
              duration-200
              ${currentPage === i
                ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
                : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
              }
              ${loadingMore ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          disabled={loadingMore}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage === 1
              ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
              : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
            }
            ${loadingMore ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          1
        </button>
      );

      if (currentPage > 4) {
        buttons.push(
          <span key="ellipsis1" className={`${theme.text.muted} px-1`}>...</span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            disabled={loadingMore}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === i
                ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
                : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
              }
              ${loadingMore ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 3) {
        buttons.push(
          <span key="ellipsis2" className={`${theme.text.muted} px-1`}>...</span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={loadingMore}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage === totalPages
              ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
              : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
            }
            ${loadingMore ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`
        flex flex-col items-center justify-center
        py-16
        ${theme.card.primary}
        rounded-xl
        transition-all
        duration-300
      `}>
        <Loader2 className={`h-10 w-10 ${theme.text.info} animate-spin`} />
        <p className={`${theme.text.muted} text-sm mt-4`}>
          Loading tasks...
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={`
        flex flex-col items-center justify-center
        py-16
        ${theme.card.primary}
        rounded-xl
        transition-all
        duration-300
      `}>
        <div className={`
          p-4 rounded-full
          bg-blue-500/10
          ${theme.text.info}
        `}>
          <ClipboardCheck size={40} />
        </div>

        <h3 className={`text-xl font-semibold ${theme.text.primary} mt-4`}>
          No Tasks Assigned
        </h3>

        <p className={`${theme.text.muted} mt-2 text-center max-w-sm`}>
          You don't have any tasks assigned right now.
          When someone assigns a task to you, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.card.primary} ${theme.border} rounded-xl overflow-hidden transition-all duration-300`}>
      {/* Filter Tabs */}
      <div className={`
        flex items-center gap-1
        px-4 pt-3
        overflow-x-auto
        scrollbar-hide
        ${theme.table.divider}
        border-b
      `}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`
              px-4 py-2.5
              text-sm
              font-medium
              transition-all
              duration-200
              whitespace-nowrap
              ${activeFilter === filter.value
                ? `${theme.text.info} border-b-2 border-blue-500`
                : `${theme.text.muted} hover:${theme.text.primary}`
              }
            `}
          >
            {filter.label}
            {filter.value !== "all" && (
              <span className={`
                ml-1.5
                text-xs
                px-1.5 py-0.5
                rounded-full
                ${theme.text.muted}
                bg-white/5
              `}>
                {tasks.filter(t => {
                  if (filter.value === "overdue") {
                    const today = new Date().toISOString().split("T")[0];
                    return t.deadline < today && t.status?.toLowerCase() !== "completed";
                  }
                  return t.status?.toLowerCase() === filter.value;
                }).length}
              </span>
            )}
          </button>
        ))}
        
        {/* Loading indicator */}
        {loadingMore && (
          <div className="ml-auto flex items-center gap-2 px-2">
            <Loader2 className={`h-4 w-4 ${theme.text.info} animate-spin`} />
            <span className={`${theme.text.muted} text-xs`}>Loading...</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-275">
          <thead className={`${theme.table.header}`}>
            <tr className={`${theme.table.divider} border-b`}>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Task
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Project
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Assigned By
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Priority
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Due Date
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Status
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task.tid}
                className={`
                  ${theme.table.row}
                  ${theme.table.divider}
                  border-b
                  transition-all
                  duration-200
                  hover:shadow-md
                `}
              >
                {/* Task */}
                <td className="px-4 py-3.5">
                  <div>
                    <h4 className={`${theme.text.primary} font-medium text-sm truncate max-w-50`}>
                      {task.title || "Untitled Task"}
                    </h4>
                    {task.description && (
                      <p className={`${theme.text.muted} text-xs truncate max-w-50 mt-0.5`}>
                        {task.description.slice(0, 60)}...
                      </p>
                    )}
                  </div>
                </td>

                {/* Project */}
                <td className="px-4 py-3.5">
                  {getProjectName(task.project_id)}
                </td>

                {/* Assigned By */}
                <td className="px-4 py-3.5">
                  {getUserName(task?.assigned_by_name)}
                </td>

                {/* Priority */}
                <td className="px-4 py-3.5">
                  <span className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${getPriorityStyle(task.priority)}
                  `}>
                    {task.priority || "Medium"}
                  </span>
                </td>

                {/* Deadline */}
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className={`${theme.text.secondary} text-sm`}>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                    </span>
                    {task.deadline && (
                      <span className={`text-xs ${getDeadlineStyle(task.deadline, task.status)}`}>
                        {FormateDate(task.deadline, "convertToDays") < 0
                          ? `${Math.abs(FormateDate(task.deadline, "convertToDays"))} days overdue`
                          : `${FormateDate(task.deadline, "convertToDays")} days left`
                        }
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${getStatusStyle(task.status)}
                  `}>
                    {task.status || "Todo"}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu({
                        status: !(openMenu.status && openMenu.taskId === task.tid),
                        taskId: task.tid
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
                      cursor-pointer
                    `}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu.status && openMenu.taskId === task.tid && (
                    <div
                      ref={menuRef}
                      className={`
                        absolute right-0 top-10
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
                        Change Status
                      </button>

                      <div className={`h-px ${theme.table.divider}`} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className={`
          flex flex-col sm:flex-row items-center justify-between
          gap-3 p-4
          ${theme.table.divider}
          border-t
        `}>
          <span className={`${theme.text.muted} text-sm`}>
            Showing{" "}
            {startIndex}
            {" - "}
            {endIndex}
            {" of "}
            {totalTasks} tasks
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1 || loadingMore}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`
                flex items-center gap-1
                px-3 py-1.5
                rounded-lg
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:${theme.text.primary}
              `}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            {renderPaginationButtons()}

            <button
              disabled={currentPage === totalPages || loadingMore}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`
                flex items-center gap-1
                px-3 py-1.5
                rounded-lg
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:${theme.text.primary}
              `}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllTasksTable