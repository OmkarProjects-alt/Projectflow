import React, { useState, useEffect } from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import TaskHeader from './TaskHeader'
import StateSection from './StateSection'
import AllTasksTable from './AllTasksTable'
import { useTaskStore } from '../../../../store/tasksStore';
import { Loader2 } from 'lucide-react'
import TaskPageSkeleton from '../TaskPageSkeleton'

const TaskPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  
  const tasks = useTaskStore((state) => state.MyTasks);
  const fetchMyTasks = useTaskStore((state) => state.FetchMyTasks);
  const fetchMyTasksStatus = useTaskStore((state) => state.fetchMyTasksStatus);
  const allMyStatusLoaded = useTaskStore((state) => state.allMyStatusLoaded);
  const allMyTasksStatus = useTaskStore((state) => state.allMyTasksStatus);

  useEffect(() => {
    const loadTasksStatus = async () => {
      if (!allMyStatusLoaded) {
        await fetchMyTasksStatus();
      }
      setLoading(false);
    };
    loadTasksStatus();
  }, [fetchMyTasksStatus, allMyStatusLoaded]);


  // Loading State
  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-100">
  //       <Loader2 className={`h-12 w-12 ${theme.text.info} animate-spin`} />
  //       <p className={`${theme.text.muted} text-sm mt-4`}>
  //         Loading your tasks...
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {loading ? (
        <TaskPageSkeleton />
      ) : (
        <>
          <TaskHeader />
          <StateSection tasks={allMyTasksStatus} />
          <AllTasksTable tasks={tasks} />
        </>
      )}
    </div>
  )
}

export default TaskPage