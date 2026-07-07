import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTaskStore } from "../../store/tasksStore";
import { useProjectStore } from "../../store/projectStore";
import { useUserStore } from "../../store/userStore";
import { updateStatus } from "../../services/task.service";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import { Plus, ArrowRight, CalendarDays, KanbanSquare, Loader2 } from 'lucide-react';
import CreateTaskModal from '../common/CreateTaskModal';
import { Link } from "react-router-dom";
import { FetchAllMyTasksOfProject } from "../../services/task.service";

const columns = {
  Todo: { title: "To Do" },
  "In Progress": { title: "In Progress" },
  Review: { title: "Review" },
  Completed: { title: "Completed" },
};

const KanbanPage = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState("");
  const [projectTasks, setProjectTasks] = useState({});
  const [tasks, setTasks] = useState([]);
  const [openCreateTaskModal, setCreateTaskModal] = useState({ 
    status: false, 
    TaskStatus: "", 
    projectId: "" 
  });
  const [loading, setLoading] = useState(false);

  const updateTask = useTaskStore((state) => state.updateTask);

  const { addMessage } = useError();

  const projects = useProjectStore((state) => state.MyProjects);
  const updateProject = useProjectStore((state) => state.updateProject);

  const selectedProjectTasks = useMemo(() => {
    if (!selectedProject) return [];
      return projectTasks[selectedProject] || [];
  }, [ selectedProject, projectTasks]);

  useEffect(() => {
    if (!selectedProject) return;

    if (projectTasks[selectedProject]) return;

    const fetchProjectTasks = async () => {

        try {

            setLoading(true);

            const result =
                await FetchAllMyTasksOfProject(selectedProject);

           setProjectTasks(prev => ({

              ...prev,

              [selectedProject]: result.data.tasks,

          }));

        } finally {

            setLoading(false);

        }

    };

    fetchProjectTasks();

  }, [selectedProject]);

  const groupedTasks = useMemo(() => {
    return {
      Todo: selectedProjectTasks.filter(
        (task) => task.status?.toLowerCase() === "todo"
      ),
      "In Progress": selectedProjectTasks.filter(
        (task) => task.status?.toLowerCase() === "in progress"
      ),
      Review: selectedProjectTasks.filter(
        (task) => task.status?.toLowerCase() === "review"
      ),
      Completed: selectedProjectTasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
      ),
    };
  }, [selectedProjectTasks]);

  const getProject = (projectId) =>
    projects.find((project) => project.pid === projectId);

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = result.draggableId;
    const taskToUpdate = selectedProjectTasks.find(
      (task) => task.tid === taskId
    );

    const UpdateTask = {
      ...taskToUpdate,
      status: destination.droppableId
    };

    try {
      updateTask(UpdateTask);

      setProjectTasks(prev => ({
          ...prev,
          [selectedProject]:
              prev[selectedProject].map(task =>
                  task.tid === taskId
                      ? UpdateTask
                      : task
              ),
      }));

      const result = await updateStatus(
        taskId,
        destination.droppableId
      );

      if (result.data?.success) {
        updateProject(result.data?.project);
      }

      addMessage("Status updated successfully", true);
    } catch(error) {
      updateTask(taskToUpdate);
      setProjectTasks(prev => ({
          ...prev,
          [selectedProject]:
              prev[selectedProject].map(task =>
                  task.tid === taskId
                      ? taskToUpdate
                      : task
              ),
      }));
      console.log(error);
      addMessage(error?.response?.data?.message || "Failed to update status");
    }
  };

  const progressMap = {
    Todo: 25,
    "In Progress": 50,
    Review: 75,
    Completed: 100,
  };

  const getColor = {
    "To Do": theme.status.todo,
    "Review": theme.status.review,
    "In Progress": theme.status.progress,
    "Completed": theme.status.completed,
    "High": theme.priority.high,
    "Medium": theme.priority.medium,
    "Low": theme.priority.low,
  };

  const getTextColor = {
    "To Do": theme.text.muted,
    "Review": theme.text.warning,
    "In Progress": theme.text.info,
    "Completed": theme.text.success,
  };

  const getBorderColor = {
    "To Do": "border-neutral-600",
    "Review": "border-amber-800",
    "In Progress": "border-blue-900",
    "Completed": "border-green-500",
  };

  const getColumnBg = {
    "To Do": theme.kanban.todo,
    "Review": theme.kanban.review,
    "In Progress": theme.kanban.progress,
    "Completed": theme.kanban.completed,
  };

  // Get avatar gradient
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

  return (
    <>
      {openCreateTaskModal.status && (
        <CreateTaskModal 
          open={openCreateTaskModal.status} 
          onClose={() => setCreateTaskModal({ status: false, TaskStatus: "", projectId: "" })}
          status={openCreateTaskModal.TaskStatus}
          project={openCreateTaskModal.projectId}
        />
      )}
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`
              p-2.5 rounded-xl
              bg-blue-500/10
              ${theme.text.info}
            `}>
              <KanbanSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary}`}>
                Kanban Board
              </h1>
              <p className={`${theme.text.muted} text-sm mt-0.5`}>
                Manage project tasks visually
              </p>
            </div>
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className={`
              ${theme.input.select}
              ${theme.text.primary}
              px-4 py-2.5
              rounded-lg
              min-w-50
              cursor-pointer
              appearance-none
              bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
              bg-no-repeat
              bg-size-[20px]
              bg-position-[right_12px_center]
              transition-all
              duration-200
            `}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.pid} value={project.pid}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* No Project Selected */}
        {!selectedProject && (
          <div className={`
            ${theme.card.primary}
            ${theme.border}
            p-12
            text-center
            rounded-xl
          `}>
            <div className={`
              p-4 rounded-full
              ${theme.card.primary}
              ${theme.text.info}
              inline-block
              mb-4
            `}>
              <KanbanSquare className="h-12 w-12" />
            </div>
            <p className={`${theme.text.muted} text-lg font-medium`}>
              Select a project to view its Kanban board
            </p>
            <p className={`${theme.text.muted} text-sm mt-1 opacity-70`}>
              Choose a project from the dropdown above to get started
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && selectedProject && (
          <div className={`
            ${theme.card.primary}
            p-12
            text-center
            rounded-xl
            flex
            flex-col
            items-center
            gap-3
          `}>
            <Loader2 className={`h-8 w-8 ${theme.text.info} animate-spin`} />
            <p className={`${theme.text.muted} text-sm`}>
              Loading tasks...
            </p>
          </div>
        )}

        {/* Kanban Board */}
        {selectedProject && !loading && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-125">
              {Object.entries(columns).map(([columnId, column]) => {
                const columnTasks = groupedTasks[columnId] || [];
                const borderColor = getBorderColor[column.title];
                const columnBg = getColumnBg[column.title];

                return (
                  <Droppable key={columnId} droppableId={columnId}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          min-w-70
                          sm:min-w-[320px]
                          ${theme.card.primary}
                          rounded-xl
                          p-4
                          flex
                          flex-col
                          max-h-[70vh]
                          border-t-4
                          ${borderColor}
                        `}
                      >
                        {/* Column Header */}
                        <div className={`
                          flex items-center justify-between
                          mb-4
                          pb-3
                          border-b
                          ${theme.table.divider}
                        `}>
                          <h2 className={`font-semibold ${theme.text.primary}`}>
                            {column.title}
                          </h2>
                          <span className={`
                            text-xs
                            font-medium
                            px-2.5 py-1
                            rounded-full
                            ${getColor[column.title]}
                          `}>
                            {columnTasks.length}
                          </span>
                        </div>

                        {/* Tasks */}
                        <div className="flex-1 space-y-3 overflow-y-auto">
                          {columnTasks.length === 0 ? (
                            <div className={`
                              flex flex-col items-center justify-center
                              h-40
                              border-2
                              border-dashed
                              ${theme.table.divider}
                              rounded-xl
                              text-center
                              p-4
                            `}>
                              <p className={`${theme.text.muted} text-sm`}>
                                No tasks in {column.title}
                              </p>
                              <p className={`${theme.text.muted} text-xs mt-1 opacity-70`}>
                                Drag a task here or create a new one
                              </p>
                            </div>
                          ) : (
                            columnTasks.map((task, index) => {
                              const project = getProject(task.project_id);
                              const avatarGradient = getAvatarGradient(task?.assigned_user_name);
                              const isOverdue = new Date(task.deadline) < new Date() && 
                                task.status?.toLowerCase() !== "completed";

                              return (
                                <Draggable
                                  key={task.tid}
                                  draggableId={String(task.tid)}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`
                                        ${theme.card.secondary}
                                        ${theme.card.hover}
                                        border
                                        ${theme.table.divider}
                                        rounded-xl
                                        p-4
                                        cursor-grab
                                        transition-all
                                        duration-200
                                        hover:border-blue-500/50
                                      `}
                                    >
                                      {/* Task Title */}
                                      <h3 className={`font-medium ${theme.text.primary} truncate`}>
                                        {task.title}
                                      </h3>

                                      {/* Description */}
                                      {task.description && (
                                        <p className={`${theme.text.muted} text-sm mt-1 line-clamp-2`}>
                                          {task.description}
                                        </p>
                                      )}

                                      {/* Priority Badge */}
                                      <div className="mt-3">
                                        <span className={`
                                          text-xs
                                          font-medium
                                          px-2.5 py-1
                                          rounded-full
                                          ${getColor[task?.priority] || theme.text.muted}
                                        `}>
                                          {task?.priority || "Medium"}
                                        </span>
                                      </div>

                                      {/* Project & User */}
                                      <div className="mt-2 flex items-center justify-between">
                                        <span className={`
                                          text-xs
                                          px-2.5 py-1
                                          rounded-full
                                          ${theme.status.todo}
                                        `}>
                                          {project?.title || "Project"}
                                        </span>

                                        <div className="flex items-center gap-2">
                                          <div className={`
                                            w-7 h-7
                                            rounded-full
                                            bg-linear-to-br
                                            ${avatarGradient}
                                            flex
                                            items-center
                                            justify-center
                                            text-white
                                            text-xs
                                            font-medium
                                          `}>
                                            {task?.assigned_user_name?.charAt(0)?.toUpperCase() || "U"}
                                          </div>
                                          <span className={`${theme.text.secondary} text-xs truncate max-w-15`}>
                                            {task?.assigned_user_name || "Unassigned"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Overdue & Deadline */}
                                      <div className="mt-2 flex items-center justify-between">
                                        {isOverdue && (
                                          <span className={`
                                            px-2 py-0.5
                                            rounded-full
                                            text-xs
                                            ${theme.status.overdue}
                                          `}>
                                            Overdue
                                          </span>
                                        )}
                                        <div className={`flex items-center gap-1 ${theme.text.muted} text-xs ml-auto`}>
                                          <CalendarDays size={12} />
                                          <span>
                                            {new Date(task.deadline).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                            })}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Progress Bar */}
                                      <div className="mt-3">
                                        <div className={`h-2 ${theme.card.secondary} border-neutral-600 rounded-full overflow-hidden`}>
                                          <div
                                            className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                            style={{
                                              width: `${progressMap[task.status] || 0}%`,
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Footer */}
                                      <div className="mt-3 pt-2 border-t ${theme.table.divider} flex justify-between items-center">
                                        <span className={`${theme.text.muted} text-xs`}>
                                          Updated recently
                                        </span>
                                        <Link
                                          to={`/projectflow/task/${task.tid}`}
                                          className={`
                                            ${theme.text.info}
                                            flex
                                            items-center
                                            gap-1
                                            text-sm
                                            hover:${theme.text.primary}
                                            transition-all
                                            duration-200
                                            group
                                          `}
                                        >
                                          View
                                          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })
                          )}
                          {provided.placeholder}
                        </div>

                        {/* Create Task Button */}
                        <div className="mt-4 pt-3 border-t ${theme.table.divider}">
                          <button 
                            onClick={() => setCreateTaskModal({ 
                              status: true, 
                              TaskStatus: columnId, 
                              projectId: selectedProject 
                            })}
                            className={`
                              w-full
                              flex
                              items-center
                              justify-center
                              gap-1.5
                              py-2
                              rounded-lg
                              ${getTextColor[column.title] || theme.text.secondary}
                              hover:${theme.text.primary}
                              hover:bg-white/5
                              transition-all
                              duration-200
                              cursor-pointer
                              group
                            `}
                          >
                            <Plus size={18} className="transition-transform duration-200 group-hover:rotate-90" />
                            <span className="text-sm font-medium">Create Task</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>
    </>
  );
};

export default KanbanPage;