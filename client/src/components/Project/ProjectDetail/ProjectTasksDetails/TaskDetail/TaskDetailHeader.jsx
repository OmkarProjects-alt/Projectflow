import React from 'react'
import CommonHeader from '../../../../common/CommonHeader'

const TaskDetailHeader = ({task, user, project, isFromAssignedTask = false}) => {

    const assigned = {
      uid: task?.assigned_user_id
    }

  return (
    <div>
        <CommonHeader 
            title = {task?.title}
            description = {task?.description}
            status = {task?.status}
            deadline = {task?.deadline}
            priority = {task?.priority}
            assign = {assigned}
            projectN = {project?.title}
            task={task}
            project={project}
            isFromAssignedTask = {isFromAssignedTask}
            from="TaskDetail"
        />
    </div>
  )
}

export default TaskDetailHeader
