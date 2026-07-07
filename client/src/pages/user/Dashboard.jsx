import React from 'react'
import DashboardHeader from '../../components/Dashboard/DashboardHeader'
import StatsSection from '../../components/Dashboard/Stats/StatsSection'
import BottomSection from '../../components/Dashboard/BottomSection'
import { useProjectStore } from '../../store/projectStore'
import { useTaskStore } from '../../store/tasksStore'
import { useUserStore } from '../../store/userStore'
import ActivitySection from '../../components/Dashboard/Charts/ActivitySection'

const Dashboard = () => {

  const projects = useProjectStore((state) => state.MyProjects);
  const tasks = useTaskStore((state) => state.MyTasks);
  const users = useUserStore((state) => state.users);

  return (
    <div className='space-y-6'>
      <DashboardHeader />
      <StatsSection />
      <ActivitySection />
      <BottomSection />
    </div>
  )
}

export default Dashboard
