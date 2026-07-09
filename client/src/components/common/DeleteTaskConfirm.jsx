import React from 'react'
import { useError } from '../../context/ErrorAndSuccessMsgContext';
import { useTaskStore } from '../../store/tasksStore';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { deleteTask } from '../../services/task.service';
import ModalPortal from './ModalPortal';

const DeleteTaskConfirm = ({ open, onClose, taskId }) => {

    const navigate = useNavigate();

    const { addMessage } = useError();

    const DeleteTask = useTaskStore((state) => state.deleteTask)

    const handleDelete = async () => {
        if(!taskId) return
        try {
            const result = await deleteTask(taskId);
            if(result?.data?.success) {
                DeleteTask(Number(taskId))
                onClose(false);
                navigate(-1);
                addMessage(result?.data?.message, true);
            }
        } catch (error) {
            addMessage(error?.response?.data?.message || error.message);
        }
    }

  return (
    <ModalPortal>
        <div 
            className='fixed inset-0 px-3 bg-black/20 backdrop-blur-lg flex items-center justify-center z-10'
            onClick={()=> onClose(false)}
        >
            <div 
                className='bg-neutral-950 rounded-2xl p-6 w-full max-w-md text-white'
                onClick={(e) => e.stopPropagation()}
            >
                
                <h3 className='text-lg font-medium'>
                    Are you sure you want to delete this task?
                </h3>

                <p className='text-neutral-400 mt-2'>
                    This action cannot be undone.
                </p>

                <div className='flex justify-end gap-3 mt-6'>
                    <button 
                        className='px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 cursor-pointer'
                        onClick={()=> onClose(false)}
                    >
                        Cancel
                    </button>

                    <button 
                        className='px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 flex gap-1 cursor-pointer'
                        onClick={handleDelete}
                    >
                    <Trash2 />  
                    <p>Delete</p>
                    </button>
                </div>
            </div>
        </div>
    </ModalPortal>
  )
}

export default DeleteTaskConfirm
