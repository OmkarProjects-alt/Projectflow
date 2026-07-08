import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../context/ThemeProvider'
import { useTaskStore } from '../../../store/tasksStore'
import { useProjectStore } from '../../../store/projectStore'
import { useParams } from 'react-router-dom'
import ProjectDetailHeader from './ProjectDetailHeader'
import { getTaskCreatedByMe } from '../../../services/task.service'
import StateSection from './TaskStat/StateSection'
import ProjectTasksDetails from './ProjectTasksDetails/ProjectTasksDetails'
import CreateTaskModal from '../../common/CreateTaskModal'
import { useUserStore } from '../../../store/userStore';
import { Plus, ClipboardList } from 'lucide-react'
import InviteMemberBtn from '../../common/InviteMemberBtn'

const ProjectDetails = () => {
  const { theme } = useTheme();
  
  const projects = useProjectStore((state) => state.MyProjects);
  const myProjectTasksStatus = useTaskStore((state) => state.allCreatedTasksStatus);
  const FetchMyTasks = useTaskStore((state) => state.FetchMyTasks);
  const FetchAllTasksStatus = useTaskStore((state) => state.FetchAllTasksStatus);
  const createdTasks = useTaskStore((state) => state.createdTasks);
  
  const users = useUserStore((state) => state.users);

  const [openTaskModal, setTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTasksStatus, setCurrentTasksStatus] = useState([]);

  const { projectId } = useParams();

  const IsTaskAlreadyExist = myProjectTasksStatus.some(
    (task) => String(task?.project_id) === String(projectId)
  );

  useEffect(() => {
     console.log("is this running 1")
    if(!projectId) return;
     console.log("is this running 2")
    if(IsTaskAlreadyExist) return
    console.log("is this running ")

    setLoading(true)

    FetchAllTasksStatus(projectId);

    setLoading(false)
    
  }, [projectId, IsTaskAlreadyExist, FetchAllTasksStatus]);

 useEffect(() => {
    if (!projectId) return;

    const filtered = myProjectTasksStatus.filter(
        task => String(task.project_id) === String(projectId)
    );

    setCurrentTasksStatus(filtered);

  }, [projectId, myProjectTasksStatus]);


  const project = projects.find(
    (project) => String(project.pid) === String(projectId)
  );



  const UsersWorkingOnTasks = users.filter((user) => 
    createdTasks.some((task) => String(task.assigned_to) === String(user.uid))
  );

  console.log("cheking data from project Detail", currentTasksStatus, "and", myProjectTasksStatus, "and users", users)

  // Get project name for display
  const projectName = project?.title || "Project";

  return (
    <>
      {openTaskModal && (
        <CreateTaskModal 
          open={openTaskModal} 
          onClose={() => setTaskModal(!openTaskModal)} 
        />
      )}
      
      <div className="space-y-6">
        {/* Project Header */}
        <ProjectDetailHeader project={project} />

        {/* Loading State */}
        {loading && (
          <div className={`
            ${theme.card.primary}
            p-12
            flex
            flex-col
            items-center
            justify-center
            gap-4
          `}>
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className={`${theme.text.muted} text-sm`}>
              Loading tasks...
            </p>
          </div>
        )}

        {!loading && currentTasksStatus?.length === 0 && (
          <div className="flex items-center justify-center">
            <div className={`
              ${theme.card.primary}
              p-8
              max-w-2xl
              w-full
              text-center
              transition-all
              duration-300
            `}>
              <div className="flex flex-col items-center gap-4">
                <div className={`
                  p-4 rounded-full
                  bg-blue-500/10
                  ${theme.text.info}
                `}>
                  <ClipboardList className="h-12 w-12" />
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
                    No tasks yet in "{projectName}"
                  </h3>
                  <p className={`${theme.text.muted} text-sm mt-1 max-w-md`}>
                    You haven't created any tasks for this project yet. 
                    Start by creating your first task to track progress.
                  </p>
                </div>

                <div>
                  <button 
                    onClick={() => setTaskModal(!openTaskModal)}
                    className={`
                      flex items-center justify-center gap-2
                      mt-2
                      px-6 py-2.5
                      rounded-xl
                      ${theme.button.primary}
                      text-white
                      transition-all
                      duration-200
                      hover:scale-[1.02]
                      hover:shadow-lg
                      hover:shadow-blue-500/20
                      active:scale-[0.98]
                      cursor-pointer
                    `}
                  >
                    <Plus size={18} />
                    Create First Task
                  </button>

                  <InviteMemberBtn 
                    users={users} 
                    projectId={projectId} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {!loading && currentTasksStatus?.length > 0 && (
          <>
            <StateSection 
              project={project} 
              tasks={currentTasksStatus} 
              loading={loading}
            />
            <ProjectTasksDetails 
              tasks={currentTasksStatus} 
              users={UsersWorkingOnTasks} 
              project={project} 
            />
          </>
        )}
      </div>
    </>
  )
}

export default ProjectDetails