import React, { useState } from 'react'
import DeleteTaskConfirm from './DeleteTaskConfirm'
import { Trash2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeProvider'

const DeleteTaskBtn = ({ taskId , className }) => {

    const [openConfirmModal, setOpenConfirm] = useState(false);

    const { theme } = useTheme();

  return (
    <>
    {openConfirmModal && (
        <DeleteTaskConfirm 
          open={openConfirmModal}
          onClose={() => setOpenConfirm(!openConfirmModal)}
          taskId={taskId}
        />
      )}
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
    </>
  )
}

export default DeleteTaskBtn
