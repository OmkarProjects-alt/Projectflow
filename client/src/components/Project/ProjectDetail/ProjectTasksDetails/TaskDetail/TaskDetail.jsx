import React, { useEffect, useMemo, useState } from 'react'
import { useTaskStore } from '../../../../../store/tasksStore'
import { useProjectStore } from '../../../../../store/projectStore'
import { useUserStore } from '../../../../../store/userStore'
import { useUserContext } from '../../../../../context/UserContext'
import TaskDetailHeader from './TaskDetailHeader'
import { useParams } from 'react-router-dom'
import TaskCards from './TaskCards'
import TaskFooter from './TaskFooter'
import { getCurrentTask } from '../../../../../services/task.service'
import { useError } from '../../../../../context/ErrorAndSuccessMsgContext'

const TaskDetail = () => {
  const { taskId } = useParams()
  const { userData } = useUserContext()
  const { addMessage } = useError()

  const tasks = useTaskStore((state) => state.createdTasks)
  const myTasks = useTaskStore((state) => state.MyTasks)
  const addTask = useTaskStore((state) => state.addTask)

  const projects = useProjectStore((state) => state.MyProjects)
  const assignedProjects = useProjectStore((state) => state.assignedProject)
  const fetchAssignedProjects = useProjectStore((state) => state.FecthAssignedProjects)

  const users = useUserStore((state) => state.users)

  const [project, setProject] = useState(null)
  const [user, setUser] = useState(null)
  const [isFromAssignedTask, setIsAssignedTask] = useState(false)

  const task = useMemo(() => {
    return (
      tasks?.find((task) => String(task?.tid) === String(taskId)) ||
      myTasks?.find((task) => String(task?.tid) === String(taskId)) ||
      null
    )
  }, [taskId, tasks, myTasks])

  const taskLoading = !task && !tasks?.length && !myTasks?.length

  useEffect(() => {
    if (task || !taskId) return

    const loadTask = async () => {
      try {
        const result = await getCurrentTask(taskId)
        if (result?.data?.success) {
          addTask(result.data.task)
        }
      } catch (error) {
        addMessage(error?.response?.data?.message || error?.message)
      }
    }

    loadTask()
  }, [task, taskId, addTask, addMessage])

  useEffect(() => {
    if (!task) return

    let active = true

    const resolveProjectAndUser = async () => {
      let foundProject = projects?.find(
        (project) => String(project.pid) === String(task?.project_id)
      )

      if (!foundProject) {
        foundProject = assignedProjects?.find(
          (project) => String(project.pid) === String(task?.project_id)
        )
      }

      if (!foundProject) {
        await fetchAssignedProjects()
        const freshAssignedProjects = useProjectStore.getState().assignedProject
        foundProject = freshAssignedProjects?.find(
          (project) => String(project.pid) === String(task?.project_id)
        )
      }

      let foundUser = users?.find(
        (user) => String(user.uid) === String(task?.assigned_to)
      )

      if(!foundUser) {
        foundUser = users?.find(
            (user) => String(user.uid) === String(task?.assigned_by)
        )
      }


      const isProjectOwner = foundProject?.created_by === userData?.uid

      if (!active) return

      setProject(foundProject || null)
      setUser(foundUser || null)
      setIsAssignedTask(!isProjectOwner)
    }

    resolveProjectAndUser()

    return () => {
      active = false
    }
  }, [task, projects, assignedProjects, users, fetchAssignedProjects, userData])

  if (taskLoading) {
    return <div className="text-white">Loading task...</div>
  }

  if (!task) {
    return <div className="text-white">Task not found</div>
  }

  const assigne = {
    name: isFromAssignedTask ? task?.assigned_by_name : task?.assigned_user_name,
    link: isFromAssignedTask ? task?.assigned_by_id : task?.assigned_user_id
  }
  
  return (
    <div className="flex flex-col gap-4">
      <TaskDetailHeader
        task={task}
        user={user}
        project={project}
        isFromAssignedTask={isFromAssignedTask}
      />
      <TaskCards
        deadline={task?.deadline}
        projectName={project?.title}
        assign={assigne.name}
        assignUid={assigne.link}
        projectPid={project?.pid}
        status={task?.status}
        isFromAssignedTask={isFromAssignedTask}
      />
      <TaskFooter task={task} isFromAssignedTask={isFromAssignedTask} />
    </div>
  )
}

export default TaskDetail