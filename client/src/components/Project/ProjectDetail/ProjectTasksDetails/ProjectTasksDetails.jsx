import React, { useEffect } from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import ProjectTasksTable from './ProjectTasksTable'
import ProjectOverview from './ProjectOverview';
import TeamMembers from './TeamMembers';
import { useTaskStore } from '../../../../store/tasksStore';

const ProjectTasksDetails = ({ tasks, users, project }) => {
  const { theme } = useTheme();

  const myProjectTasks = useTaskStore((state) => state.createdTasks);
  const FetchMyTasks = useTaskStore((state) => state.FetchMyTasks);

  console.log("my all task my project", myProjectTasks);

  const IsTaskAlreadyExist = myProjectTasks.some(
    (task) => String(task?.project_id) === String(project.pid)
  );

  useEffect(() => {
    if (!project) return;
    if (IsTaskAlreadyExist) return;

    const FecthProjectTasks = async () => {
      try {
        let page = 1;
        let limit = 10
        await FetchMyTasks(page, limit, project.pid);

        
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    FecthProjectTasks();
  }, [project, IsTaskAlreadyExist, FetchMyTasks]);
  
  const TaskDetail = myProjectTasks.filter(
    (t) => t.project_id === project.pid
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="min-w-0 overflow-hidden">
            <ProjectTasksTable 
              tasks={TaskDetail}
              project={project}
            />
          </div>

          <div className="flex flex-col gap-4 min-w-0 mt-4 lg:mt-0">
            <ProjectOverview tasks={tasks} />
            <TeamMembers users={users} />
          </div>
        </div>
      </div>

      {tasks?.length === 0 && (
        <div className={`${theme.card.primary} p-8 text-center`}>
          <div className={theme.text.muted}>
            <p className="text-lg font-medium">No tasks available</p>
            <p className="text-sm mt-1">Create tasks to get started with this project</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectTasksDetails