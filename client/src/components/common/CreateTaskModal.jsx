import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import MessageAlert from '../../components/common/MessageAlert';
import { createNewTask, updateTask } from "../../services/task.service";
import { useProjectStore } from "../../store/projectStore";
import { useUserStore } from "../../store/userStore";
import { useTaskStore } from "../../store/tasksStore";
import { useParams } from "react-router-dom";
import { X, FileText, Calendar, User, FolderKanban, Flag, CheckSquare, Save, RotateCcw } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import ModalPortal from "./ModalPortal";

const CreateTaskModal = ({
  open,
  onClose,
  title,
  deadline,
  description,
  assign,
  priority,
  project,
  status,
  from,
  tid,
}) => {
  const { theme } = useTheme();
  
  if (!open) return null;

  const projects = useProjectStore((state) => state.MyProjects);
  const users = useUserStore((state) => state.users);
  const addTask = useTaskStore((state) => state.addTask);
  const addMyCreatedTaskStatus = useTaskStore((state) => state.addMyCreatedTaskStatus);
  const UpdateTask = useTaskStore((state) => state.updateTask);
  const updateProject = useProjectStore((state) => state.updateProject);

  const socket = useSocket();

  const { taskId } = useParams();

  const { addMessage } = useError();
  const [loading, setLoading] = useState(false);
  const [UpdatedData, setUpdatedData] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [taskData, setTaskData] = useState({
    title: title || "",
    description: description || "",
    project: String(project || ""),
    assign: String(assign || ""),
    priority: priority || "Medium",
    deadline: deadline || "",
    status: status || "Todo",
  });

  const [originalData] = useState({
    title: title || "",
    description: description || "",
    project: String(project || ""),
    assign: String(assign || ""),
    priority: priority || "Medium",
    deadline: deadline || "",
    status: status || "",
  });

  const isEditMode = from === "commonH" || from === "TaskEditTable";

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...taskData,
      [name]: value,
    };
    setTaskData(updatedData);

    const changedFields = {};
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] !== originalData[key]) {
        changedFields[key] = updatedData[key];
      }
    });

    setUpdatedData(changedFields);
    setIsUpdated(Object.keys(changedFields).length > 0);
  };

  const handleReset = () => {
    setTaskData(originalData);
  };

  const handleClear = () => {
    setTaskData({
      title: "",
      description: "",
      project: "",
      assign: "",
      priority: "",
      deadline: "",
      status: "",
    });
    setIsUpdated(false);
  };

  const validate = () => {
    if (!taskData.title) {
      addMessage("Task name is required");
      return false;
    }
    if (!taskData.description) {
      addMessage("Task description is required");
      return false;
    }
    if (!taskData.project) {
      addMessage("Please select a project");
      return false;
    }
    if (!taskData.deadline) {
      addMessage("Task deadline is required");
      return false;
    }
    if (!taskData.assign) {
      addMessage("Please select assignee");
      return false;
    }
    if (!taskData.priority) {
      addMessage("Please select task priority");
      return false;
    }
    if (!taskData.status) {
      addMessage("Please select task status");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEditMode) {
        let id = taskId ? taskId : tid;
        const result = await updateTask(id, UpdatedData);

        if (result?.data?.success) {
          addMessage(result.data.message, true);
          UpdateTask(result?.data?.task);
          if (result?.data?.project) {
            updateProject(result?.data?.project);
          }
          handleClear();
          onClose();
        }
      } else {
        const result = await createNewTask({
          title: taskData.title,
          description: taskData.description,
          project: taskData.project,
          assign: taskData.assign,
          priority: taskData.priority,
          deadline: taskData.deadline,
          status: taskData.status,
        });

        if (result.data.success) {
          addMessage(result.data.message, true);
          addTask(result?.data?.task);
          addMyCreatedTaskStatus(result?.data?.task);
          handleClear();
          onClose();
        }
      }
    } catch (error) {
      addMessage(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 px-3"
        onClick={onClose}
      >
        <div
          className={`
            w-full max-w-xl
            ${theme.card.modal}
            max-h-[90vh]
            overflow-hidden
            flex flex-col
            transition-all
            duration-300
            scale-100
          
            z-50
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between
            px-6 py-4
            ${theme.table.divider}
            border-b
            flex-shrink-0
          `}>
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg
                bg-blue-500/10
                ${theme.text.info}
              `}>
                <CheckSquare size={20} />
              </div>
              <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                {isEditMode ? "Update Task" : "Create New Task"}
              </h2>
            </div>

            <button
              onClick={() => onClose(false)}
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
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form className="space-y-4">
              {/* Task Title */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Task Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                  <input
                    type="text"
                    placeholder="Enter task name"
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-2.5
                      ${theme.input.input}
                      transition-all
                      duration-200
                    `}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter task description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2.5
                    ${theme.input.textarea}
                    transition-all
                    duration-200
                    min-h-[80px]
                  `}
                />
              </div>

              {/* Project & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Project <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FolderKanban className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                    <select
                      name="project"
                      value={taskData.project}
                      onChange={handleChange}
                      className={`
                        w-full pl-10 pr-8 py-2.5
                        ${theme.input.select}
                        transition-all
                        duration-200
                        cursor-pointer
                        appearance-none
                        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                        bg-no-repeat
                        bg-[length:20px]
                        bg-[right_12px_center]
                      `}
                    >
                      <option value="">Choose Project</option>
                      {projects?.map((project) => (
                        <option key={project?.pid} value={project?.pid}>{project?.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                    <select
                      name="assign"
                      value={taskData.assign}
                      onChange={handleChange}
                      className={`
                        w-full pl-10 pr-8 py-2.5
                        ${theme.input.select}
                        transition-all
                        duration-200
                        cursor-pointer
                        appearance-none
                        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                        bg-no-repeat
                        bg-[length:20px]
                        bg-[right_12px_center]
                      `}
                    >
                      <option value="">Assign Task To</option>
                      {users?.map((user) => (
                        <option key={user.uid} value={user.uid}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Priority & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Flag className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                    <select
                      name="priority"
                      value={taskData.priority}
                      onChange={handleChange}
                      className={`
                        w-full pl-10 pr-8 py-2.5
                        ${theme.input.select}
                        transition-all
                        duration-200
                        cursor-pointer
                        appearance-none
                        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                        bg-no-repeat
                        bg-[length:20px]
                        bg-[right_12px_center]
                      `}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                    <input
                      type="date"
                      name="deadline"
                      value={taskData.deadline}
                      onChange={handleChange}
                      className={`
                        w-full pl-10 pr-4 py-2.5
                        ${theme.input.input}
                        transition-all
                        duration-200
                      `}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CheckSquare className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                  <select
                    name="status"
                    value={taskData.status}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-8 py-2.5
                      ${theme.input.select}
                      transition-all
                      duration-200
                      cursor-pointer
                      appearance-none
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                      bg-no-repeat
                      bg-[length:20px]
                      bg-[right_12px_center]
                    `}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    {isEditMode && originalData.status === "Review" && (
                      <option value="Completed">Completed</option>
                    )}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className={`
            flex items-center justify-end gap-3
            px-6 py-4
            ${theme.table.divider}
            border-t
            flex-shrink-0
          `}>
            <button
              onClick={isEditMode ? handleReset : handleClear}
              className={`
                flex items-center gap-2
                px-6 py-2.5
                rounded-lg
                ${theme.button.secondary}
                ${theme.text.primary}
                transition-all
                duration-200
                cursor-pointer
                hover:scale-[1.02]
                active:scale-[0.98]
              `}
            >
              {isEditMode ? <RotateCcw size={16} /> : <X size={16} />}
              {isEditMode ? "Reset" : "Clear"}
            </button>

            {loading ? (
              <button
                disabled
                className={`
                  flex-1 flex items-center justify-center gap-2
                  px-6 py-2.5
                  rounded-lg
                  bg-blue-600/50
                  text-white
                  cursor-not-allowed
                `}
              >
                <span className="border-2 border-t-transparent border-white w-5 h-5 rounded-full animate-spin"></span>
                <span>{isEditMode ? "Updating..." : "Creating..."}</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isEditMode && !isUpdated}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  px-6 py-2.5
                  rounded-lg
                  text-white
                  transition-all
                  duration-200
                  ${(isEditMode && !isUpdated)
                    ? "bg-blue-600/40 cursor-not-allowed opacity-60"
                    : `${theme.button.primary} hover:scale-[1.02] active:scale-[0.98]`
                  }
                `}
              >
                <Save size={18} />
                {isEditMode ? "Update Task" : "Create Task"}
              </button>
            )}
          </div>
        </div>
      </div>
   </ModalPortal>
  );
};

export default CreateTaskModal;