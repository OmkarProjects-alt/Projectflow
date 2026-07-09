import React, { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { createNewProject, updateProject } from "../../services/project.service";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import MessageAlert from '../../components/common/MessageAlert';
import { useProjectStore } from "../../store/projectStore";
import { useParams } from "react-router-dom";
import { X, Calendar, FileText, FolderPlus, Save } from "lucide-react";
import ModalPortal from "./ModalPortal";

const CreateProjectModal = ({ 
  open, 
  onClose,
  title,
  description,
  startDate,
  deadline,
  status,
  from
}) => {
  const { theme } = useTheme();
  
  if (!open) return null;

  const addProject = useProjectStore((state) => state.addProject);
  const UpdateProject = useProjectStore((state) => state.updateProject);
  
  const { addMessage, cleareMessage } = useError();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    title: title || "",
    description: description || "",
    startDate: startDate || "",
    deadline: deadline || "",
    status: status || "",
  });

  const [isUpdate, setIsUpdate] = useState(false);
  const [UpdatedData, setUpdatedData] = useState({});

  const [oldData, setOldData] = useState({
    title: title || "",
    description: description || "",
    startDate: startDate || "",
    deadline: deadline || "",
    status: status || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedData = {
      ...projectData,
      [name]: value,
    }

    setProjectData(updatedData);
    const changedFields = {};

    Object.keys(updatedData).forEach(key => {
      if(updatedData[key] !== oldData[key]) {
        changedFields[key] = updatedData[key]
      }
    });

    setUpdatedData(changedFields);
    setIsUpdate(Object.keys(changedFields).length > 0);
  }

  const validate = () => {
    if (!projectData.title) {
      addMessage("Project name is required");
      return false;
    }
    if (!projectData.description) {
      addMessage("Project description is required");
      return false;
    }
    if (!projectData.startDate) {
      addMessage("Project Starting date is required");
      return false;
    }
    if (!projectData.deadline) {
      addMessage("Project deadline is required");
      return false;
    }
    if (!projectData.status) {
      addMessage("Please select project status");
      return false;
    }

    if (
      projectData.startDate &&
      projectData.deadline &&
      projectData.deadline < projectData.startDate
    ) {
      addMessage("Deadline cannot be earlier than start date");
      return false;
    }

    return true;
  }

  const CleareProjectData = () => {
    setProjectData({
      title: "",
      description: "",
      startDate: "",
      deadline: "",
      status: "",
    });
    setIsUpdate(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validate()) return;
    
    try {
      setLoading(true);
      
      if(from === "commonH") {
        const result = await updateProject(projectId, UpdatedData);
        if(result?.data?.success) {
          addMessage(result.data.message, true);
          UpdateProject(result?.data?.project);
          onClose();
        }
      } else {
        const result = await createNewProject({
          title: projectData.title,
          description: projectData.description,
          startDate: projectData.startDate,
          deadline: projectData.deadline,
          status: projectData.status,
        });
        
        if(result.data.success) {
          addMessage(result.data.message, true);
          addProject(result.data.project);
          CleareProjectData();
          onClose();
        }
      }
    } catch (error) {
      addMessage(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-3 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      >
        <div
          className={`
            w-full max-w-xl
            ${theme.card.modal}
            p-6
            max-h-[90vh]
            overflow-y-auto
            transition-all
            duration-300
            scale-100
            z-50
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg
                bg-blue-500/10
                ${theme.text.info}
              `}>
                <FolderPlus size={20} />
              </div>
              <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                {from === "commonH" ? "Update Project" : "Create New Project"}
              </h2>
            </div>

            <button
              onClick={onClose}
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
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Project Name */}
            <div>
              <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                Project Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                <input
                  type="text"
                  name="title"
                  placeholder="Enter project name"
                  value={projectData.title}
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
                rows="4"
                name="description"
                placeholder="Enter project description"
                value={projectData.description}
                onChange={handleChange}
                className={`
                  w-full px-4 py-2.5
                  ${theme.input.textarea}
                  transition-all
                  duration-200
                  min-h-[100px]
                `}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                  <input
                    type="date"
                    min={from !== "commonH" ? new Date().toISOString().split("T")[0] : undefined}
                    name="startDate"
                    value={projectData.startDate}
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

              <div>
                <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                  Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted}`} size={18} />
                  <input
                    type="date"
                    name="deadline"
                    value={projectData.deadline}
                    onChange={handleChange}
                    min={projectData.startDate}
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
              <select
                name="status"
                value={projectData.status}
                onChange={handleChange}
                className={`
                  w-full px-4 py-2.5
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
                <option value="">Select status</option>
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50">
              <button
                type="button"
                onClick={CleareProjectData}
                className={`
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
                Clear
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
                  <span>{from === "commonH" ? "Updating..." : "Creating..."}</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={from === "commonH" && !isUpdate}
                  className={`
                    flex-1 flex items-center justify-center gap-2
                    px-6 py-2.5
                    rounded-lg
                    text-white
                    transition-all
                    duration-200
                    ${(from === "commonH" && !isUpdate)
                      ? "bg-blue-600/40 cursor-not-allowed opacity-60"
                      : `${theme.button.primary} hover:scale-[1.02] active:scale-[0.98]`
                    }
                  `}
                >
                  <Save size={18} />
                  {from === "commonH" ? "Update Project" : "Create Project"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default CreateProjectModal;