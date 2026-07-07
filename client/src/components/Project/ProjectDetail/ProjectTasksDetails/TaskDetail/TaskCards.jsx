import React from 'react'
import CommonCards from '../../../../common/CommonCards'

const TaskCards = ({ deadline, projectName, assign, status, isFromAssignedTask, assignUid, projectPid }) => {

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'>
      <CommonCards
        title= {isFromAssignedTask ? "Assigned By" : "Assigned To"}
        value={assign}
        textColor='text-blue-400 rounded-lg p-2 bg-blue-950/90'
        link={assignUid}
        from="TaskCard"
      />
      <CommonCards
        title="Project"
        value={projectName}
        textColor='text-green-400 rounded-lg p-2 bg-green-950/90'
        link={projectPid}
        from="TaskCard"
      />
      <CommonCards
        title="Deadline"
        value={new Date(deadline).toLocaleDateString()}
        textColor='text-rose-400 rounded-lg p-2 bg-rose-500/15'
        from="TaskCard"
      />
      <CommonCards
        title="Status"
        value={status}
        textColor='text-purple-400 rounded-lg p-2 bg-purple-500/15'
        from="TaskCard"
      />
    </div>
  )
}

export default TaskCards
