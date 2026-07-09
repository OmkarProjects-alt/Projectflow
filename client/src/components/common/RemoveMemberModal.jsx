import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { X, AlertTriangle, Users, Check, Loader2 } from "lucide-react";
import { useProjectStore } from "../../store/projectStore";
import { useError } from "../../context/ErrorAndSuccessMsgContext";
import { removeMember } from "../../services/project.service";
import ModalPortal from "./ModalPortal";

const RemoveMemberModal = ({ 
  open, 
  onClose, 
  member, 
  userAssignedProjects,
  projects 
}) => {
  const { theme } = useTheme();
  const { addMessage } = useError();
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const removeMemberFromProject = useProjectStore((state) => state.removeMemberFromProject);

  // Get projects where member is assigned
  const memberProjects = useMemo(() => {
  
      let Allprojects = [];  
      projects.forEach((project) => {
  
        const commonProject = userAssignedProjects.filter((p) =>
          p.pid === project.pid
        );
  
        Allprojects.push(commonProject[0]);
      });
  
      return Allprojects;
    }, [userAssignedProjects, projects]);

  const handleRemove = async () => {
    if (!selectedProject) {
      addMessage("Please select a project to remove the member from");
      return;
    }

    setLoading(true);
    try {
      const result = await removeMember(selectedProject, member.uid);
      if (result?.data?.success) {
        setSuccess(true);
        addMessage(`Successfully removed ${member.name} from the project`, true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        addMessage(result?.message || "Failed to remove member");
      }
    } catch (error) {
      addMessage(error?.response?.data?.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedProject("");
      setSuccess(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 px-3 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={handleClose}
      >
        <div
          className={`
            w-full max-w-md
            ${theme.card.modal}
            overflow-hidden
            flex flex-col
            transition-all
            duration-300
            scale-100
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
                bg-red-500/10
                ${theme.text.danger}
              `}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                  Remove Member
                </h2>
                <p className={`${theme.text.muted} text-xs`}>
                  Select a project to remove {member?.name} from
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={loading}
              className={`
                p-1.5 rounded-lg
                ${theme.text.muted}
                hover:${theme.text.primary}
                hover:bg-gray-200/20
                dark:hover:bg-gray-800/50
                transition-all
                duration-200
                cursor-pointer
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 px-6 py-4">
            {success ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className={`
                  p-4 rounded-full
                  bg-green-500/10
                  ${theme.text.success}
                  mb-4
                `}>
                  <Check size={48} />
                </div>
                <h3 className={`text-xl font-semibold ${theme.text.primary}`}>
                  Member Removed!
                </h3>
                <p className={`${theme.text.muted} text-sm mt-2 text-center max-w-sm`}>
                  {member?.name} has been successfully removed from the project.
                </p>
              </div>
            ) : (
              <>
                {/* Member Info */}
                <div className={`
                  flex items-center gap-3
                  p-3
                  rounded-lg
                  ${theme.card.secondary}
                  ${theme.table.divider}
                  border
                  mb-4
                `}>
                  <div className={`
                    w-10 h-10
                    rounded-full
                    bg-gradient-to-br
                    from-blue-500 to-blue-700
                    flex items-center justify-center
                    text-white font-semibold text-sm
                  `}>
                    {member?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${theme.text.primary} font-medium text-sm`}>
                      {member?.name || 'Unknown User'}
                    </p>
                    <p className={`${theme.text.muted} text-xs truncate`}>
                      {member?.email || 'No email'}
                    </p>
                  </div>
                  <div className={`
                    px-2 py-1
                    rounded-full
                    text-xs
                    ${theme.status.todo}
                  `}>
                    Member
                  </div>
                </div>

                {/* Project Select */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text.secondary} mb-2`}>
                    Select Project to Remove From
                  </label>
                  {memberProjects.length === 0 ? (
                    <div className={`
                      p-4
                      rounded-lg
                      ${theme.card.secondary}
                      text-center
                      ${theme.text.muted}
                    `}>
                      <Users size={24} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No projects found for this member</p>
                      <p className="text-xs mt-1">This member is not assigned to any project</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {memberProjects.map((project) => (
                        <button
                          key={project.pid}
                          onClick={() => setSelectedProject(project.pid)}
                          className={`
                            w-full flex items-center gap-3
                            p-3
                            rounded-lg
                            border-2
                            transition-all
                            duration-200
                            ${selectedProject === project.pid
                              ? `border-blue-500 ${theme.card.primary}`
                              : `${theme.card.secondary} border-transparent hover:border-gray-600`
                            }
                            cursor-pointer
                            group
                          `}
                        >
                          <div className={`
                            w-8 h-8
                            rounded-lg
                            bg-gradient-to-br
                            from-blue-500 to-purple-500
                            flex items-center justify-center
                            text-white font-semibold text-xs
                            flex-shrink-0
                          `}>
                            {project.title?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className={`${theme.text.primary} text-sm font-medium truncate`}>
                              {project.title || 'Untitled Project'}
                            </p>
                            <p className={`${theme.text.muted} text-xs truncate`}>
                              {project.members?.length || 0} members
                            </p>
                          </div>
                          {selectedProject === project.pid && (
                            <Check size={18} className={theme.text.success} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className={`
              flex items-center justify-end gap-3
              px-6 py-4
              ${theme.table.divider}
              border-t
              flex-shrink-0
            `}>
              <button
                onClick={handleClose}
                disabled={loading}
                className={`
                  px-4 py-2
                  rounded-lg
                  ${theme.button.secondary}
                  ${theme.text.secondary}
                  transition-all
                  duration-200
                  hover:${theme.text.primary}
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={!selectedProject || loading || memberProjects.length === 0}
                className={`
                  flex items-center gap-2
                  px-6 py-2.5
                  rounded-lg
                  text-white
                  font-medium
                  transition-all
                  duration-200
                  ${selectedProject && !loading && memberProjects.length > 0
                    ? `${theme.button.danger} hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98]`
                    : 'bg-red-600/40 cursor-not-allowed opacity-60'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    Remove Member
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};

export default RemoveMemberModal;