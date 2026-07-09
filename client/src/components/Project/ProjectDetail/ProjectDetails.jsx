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
import ProjectDetailsSkeleton from './ProjectDetailsSkeleton'

const ProjectDetails = () => {
  const { theme } = useTheme();
  
  const projects = useProjectStore((state) => state.MyProjects);
  const myProjectTasksStatus = useTaskStore((state) => state.allCreatedTasksStatus);
  const FetchMyTasks = useTaskStore((state) => state.FetchMyTasks);
  const FetchAllTasksStatus = useTaskStore((state) => state.FetchAllTasksStatus);
  const createdTasks = useTaskStore((state) => state.createdTasks);
  
  const users = useUserStore((state) => state.users);

  const [openTaskModal, setTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTasksStatus, setCurrentTasksStatus] = useState([]);

  const { projectId } = useParams();

  const IsTaskAlreadyExist = myProjectTasksStatus.some(
    (task) => String(task?.project_id) === String(projectId)
  );

  useEffect(() => {
    if(!projectId) return;
    if(IsTaskAlreadyExist) {
      setLoading(false); // Set loading false if data exists
      return;
    }

    setLoading(true);
    FetchAllTasksStatus(projectId);
    // Assuming FetchAllTasksStatus is async, you might want to set loading false after it completes
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
        {loading ? (
          <ProjectDetailsSkeleton />
        ) : (
          <>
            <ProjectDetailHeader project={project} />
            
            {/* Your existing content */}
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