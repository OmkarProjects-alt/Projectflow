import React, { useMemo } from 'react'
import { useTheme } from '../../../context/ThemeProvider'
import ProfileCardStateSection from './ProfileCardStateSection'
import { useTaskStore } from '../../../store/tasksStore'

const ProfileCard = ({ userAssignedProjects, user }) => {
  const { theme } = useTheme();
  const allTasks = useTaskStore((state) => state.allTasks);

  const getValues = useMemo(() => {
    const stat = {
      project: userAssignedProjects?.length || 0
    };

    const UserAssignedTasks = allTasks.filter(
      (task) => task.assigned_to === user?.uid
    );

    stat.alltasks = UserAssignedTasks?.length || 0;
    stat.completed = UserAssignedTasks.filter(
      (task) => task.status?.toLowerCase() === "completed"
    ).length || 0;
    stat.overdue = UserAssignedTasks.filter(
      (task) =>
        new Date(task.deadline) < new Date() &&
        task.status?.toLowerCase() !== "completed"
    ).length || 0;

    return stat;
  }, [user, userAssignedProjects, allTasks]);

  // Check if there's any data to show
  const hasData = getValues.project > 0 || getValues.alltasks > 0;

  return (
    <div className="mt-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProfileCardStateSection
          title="Projects"
          value={getValues.project}
          detail={`${getValues.project} assigned projects`}
        />

        <ProfileCardStateSection
          title="Task Assigned"
          value={getValues.alltasks}
          detail={`${getValues.alltasks} total assigned tasks`}
        />

        <ProfileCardStateSection
          title="Task Completed"
          value={getValues.completed}
          detail={`${getValues.completed} tasks completed`}
        />

        <ProfileCardStateSection
          title="Overdue Tasks"
          value={getValues.overdue}
          detail={getValues.overdue > 0 ? "Need attention" : "All up to date"}
        />
      </div>

      {/* No Data State */}
      {!hasData && (
        <div className={`
          ${theme.card.secondary}
          p-6
          mt-4
          rounded-xl
          text-center
        `}>
          <p className={`${theme.text.muted} text-sm`}>
            No projects or tasks assigned yet
          </p>
        </div>
      )}
    </div>
  )
}

export default ProfileCard