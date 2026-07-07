import React, { useEffect } from 'react'
import TeamHeader from './TeamPage/TeamHeader'
import { useUserStore } from '../../store/userStore'
import { useTaskStore } from '../../store/tasksStore'
import TeamDetailTable from './TeamPage/TeamDetailTable'
import { useProjectStore } from '../../store/projectStore'

const TeamMemberPage = () => {

    const assignedProject = useProjectStore((state) => state.assignedProject);

    const assignedTasks = useTaskStore((state) => state.MyTasks);
    const FetchAllTasks = useTaskStore((state) => state.FetchAllTasks);
    const allTasksLoaded = useTaskStore((state) => state.allTasksLoaded);
    
    const users = useUserStore((state) => state.users);

    useEffect(() => {
        if(allTasksLoaded) return;

        FetchAllTasks();
    }, [])

  return (
    <div>
      <TeamHeader />
      <TeamDetailTable
        assignedTasks={assignedTasks}
        users = {users}
      />
    </div>
  )
}

export default TeamMemberPage
