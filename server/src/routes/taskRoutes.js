const express = require('express');
const Router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/DbConnection');
const updateProjectProgress = require('../utils/updateProjectProgress');
const { emitToProject, emitToUser } = require('../socket/emitters');
const { 
    getProjectTasks,
    getProjectTaskStatus,
    getTasksAssignedMe,
    getCurrentTask,
    getMyTasksStatus,
    createNewTask,
    updateTask,
    updateTaskStatus,
    getAllTasksOfProject,
    getAllTasks,
    deleteTask
} = require("../controller/tasks.controller");


Router.get('/', authMiddleware,
    asyncHandler(getTasksAssignedMe)
)

Router.get("/status", authMiddleware,
    asyncHandler(getMyTasksStatus)
);


Router.post('/create', authMiddleware,
    asyncHandler(createNewTask)
);


Router.patch('/:id', authMiddleware,
    asyncHandler(updateTask)
);

Router.delete('/:id', authMiddleware,
    asyncHandler(deleteTask)
)

Router.get('/all', authMiddleware,
    asyncHandler(getAllTasks)
)

Router.get('/:id', authMiddleware,
    asyncHandler(getCurrentTask)
);

Router.get("/status/:pid", authMiddleware,
    asyncHandler(getProjectTaskStatus)
);

Router.get('/my-project-task/:pid', authMiddleware,
    asyncHandler(getProjectTasks)
);

Router.patch('/status/:id', authMiddleware,
    asyncHandler(updateTaskStatus)
);

Router.get('/:pid/project',
    authMiddleware,
    asyncHandler(getAllTasksOfProject)
)

module.exports = Router;