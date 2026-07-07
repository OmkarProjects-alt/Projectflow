import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeProvider'
import { Filter, Plus, FolderKanban } from 'lucide-react'
import CreateProjectModal from '../common/CreateProjectModal'

const ProjectHeader = () => {
  const { theme } = useTheme();
  const [openProjectModal, setProjectModal] = useState(false);

  return (
    <>
      {openProjectModal && (
        <CreateProjectModal 
          open={openProjectModal} 
          onClose={() => setProjectModal(!openProjectModal)} 
        />
      )}

      <div className={`
        flex 
        flex-col 
        sm:flex-row 
        sm:items-center 
        justify-between 
        gap-4 
        sm:gap-0
        transition-all
        duration-300
      `}>
        {/* Left Section - Title */}
        <div className="flex items-center gap-3">
          <div className={`
            p-2.5 rounded-xl
            bg-blue-500/10
            ${theme.text.info}
            hidden
            sm:block
          `}>
            <FolderKanban className="h-6 w-6" />
          </div>
          
          <div>
            <h1 className={`
              text-2xl 
              sm:text-3xl 
              font-bold 
              ${theme.text.primary}
              flex
              items-center
              gap-2
            `}>
              Projects
              <span className={`
                text-xs 
                font-normal
                ${theme.text.muted}
                bg-white/5
                px-2.5
                py-0.5
                rounded-full
              `}>
                All
              </span>
            </h1>
            <p className={`
              ${theme.text.muted} 
              text-sm 
              mt-0.5
              hidden
              sm:block
            `}>
              Manage all your projects in one place
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter Button (Optional - for future use) */}
          <button
            className={`
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-lg
              ${theme.button.secondary}
              ${theme.text.secondary}
              transition-all
              duration-200
              hover:${theme.text.primary}
              hover:scale-[1.02]
              active:scale-[0.98]
              flex-1
              sm:flex-none
            `}
            aria-label="Filter projects"
          >
            <Filter className="h-4 w-4" />
            <span className="sm:hidden">Filter</span>
          </button>

          {/* Create Project Button */}
          <button
            onClick={() => setProjectModal(!openProjectModal)}
            className={`
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-lg
              ${theme.button.primary}
              text-white
              font-medium
              transition-all
              duration-200
              hover:scale-[1.02]
              hover:shadow-lg
              hover:shadow-blue-500/25
              active:scale-[0.98]
              flex-1
              sm:flex-none
              cursor-pointer
            `}
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ProjectHeader