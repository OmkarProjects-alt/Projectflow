import React, { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeProvider'
import { useParams, useNavigate } from 'react-router-dom'
import { useTaskStore } from '../../../../../store/tasksStore'
import { Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import DeleteTaskConfirm from '../../../../common/DeleteTaskConfirm';
import { updateStatus } from '../../../../../services/task.service';
import { useError } from '../../../../../context/ErrorAndSuccessMsgContext';
import { useProjectStore } from '../../../../../store/projectStore';

const TaskFooter = ({ task, isFromAssignedTask }) => {
  const { theme } = useTheme();
  const { taskId } = useParams();
  const { addMessage } = useError();

  const updateTask = useTaskStore((state) => state.updateTask);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [openConfirmModal, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateState = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = await updateStatus(taskId, "Completed");
      
      if (result?.data?.success) {
        updateTask(result?.data?.task);
        if (result?.data?.project) {
          updateProject(result?.data?.project);
        }
        addMessage(result?.data?.message, true);
      }
    } catch (error) {
      addMessage(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if task is overdue
  const isOverdue = task?.deadline && new Date(task.deadline) < new Date();

  return (
    <>
      {openConfirmModal && (
        <DeleteTaskConfirm 
          open={openConfirmModal}
          onClose={() => setOpenConfirm(!openConfirmModal)}
          taskId={taskId}
        />
      )}
      
      {!isFromAssignedTask && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          {/* Delete Button */}
          <button 
            onClick={() => setOpenConfirm(!openConfirmModal)}
            className={`
              flex items-center justify-center gap-2
              px-5 py-2.5
              w-full sm:w-auto
              rounded-xl
              ${theme.button.danger}
              ${theme.text.primary}
              border border-red-500/30
              transition-all
              duration-200
              hover:scale-[1.02]
              hover:shadow-lg
              hover:shadow-red-500/20
              active:scale-[0.98]
              cursor-pointer
            `}
          >
            <Trash2 size={18} />
            Delete Task
          </button>

          {/* Mark as Complete Button */}
          {task?.status === "Review" && (
            <button 
              onClick={handleUpdateState}
              disabled={loading}
              className={`
                flex items-center justify-center gap-2
                px-5 py-2.5
                w-full sm:w-auto
                rounded-xl
                ${theme.button.success}
                text-white
                border border-green-500/30
                transition-all
                duration-200
                hover:scale-[1.02]
                hover:shadow-lg
                hover:shadow-green-500/20
                active:scale-[0.98]
                ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {loading ? (
                <>
                  <span className="border-2 border-t-transparent border-white w-5 h-5 rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Mark as Complete
                </>
              )}
            </button>
          )}

          {/* Overdue Warning */}
          {isOverdue && task?.status !== "Completed" && (
            <div className={`
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              ${theme.status.overdue}
              text-sm
              w-full sm:w-auto
              justify-center
            `}>
              <AlertCircle size={16} />
              <span>Task is overdue</span>
            </div>
          )}

          {/* Status Info */}
          {task?.status === "Completed" && (
            <div className={`
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              ${theme.status.completed}
              text-sm
              w-full sm:w-auto
              justify-center
            `}>
              <CheckCircle2 size={16} />
              <span>Task already completed</span>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default TaskFooter