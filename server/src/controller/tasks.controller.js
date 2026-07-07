const { 
    fetchUserProjectTasks,
    fetchAllStatusOfMyProjectTasks,
    fetchTasksAssignedToMe,
    fetchCurrentTask,
    fetchMyTasksStatus,
    StoreNewTask,
    updateTaskInDb,
    updateAndStoreTaskStatus,
    FetchAllMyTasksOfProject,
    fetchAllTasks,
    deleteTaskFromDB    
} = require("../services/tasks.service");

const getProjectTasks = async (req, res) => {

    const result = await fetchUserProjectTasks(
        req.user.uid,
        req.params.pid,
        req.query
    );

    res.status(200).json({
        success: true,
        tasks: result.tasks,
        pagination: result.pagination,
    });

};

const getProjectTaskStatus = async (req, res) => {
    const userId = req?.user?.uid;

    const projectId = req?.params;

    console.log("project id", projectId);

    const result = await fetchAllStatusOfMyProjectTasks(projectId, userId);

    res.status(200).json({
        success: true,
        tasksStatus: result.status,
    });
};


const getTasksAssignedMe = async (req, res) => {
    const userId = req?.user?.uid;

   const result = await fetchTasksAssignedToMe(req.user.uid, req.query);

    res.status(200).json({
        success: true,
        tasks: result.tasks,
        pagination: result.pagination,
    });
};

const getCurrentTask = async (req, res) => {
    const { id } = req.params;

    const result = await fetchCurrentTask(id);

    res.status(200).json({
        success: true,
        task: result,
    });
}

const getMyTasksStatus = async (req, res) => {
    const userId = req?.user?.uid;

    const result = await fetchMyTasksStatus(userId);

    res.status(200).json({
        success: true,
        status: result,
    })
}

const createNewTask = async (req, res) => {
    
    const task = await StoreNewTask(req);

        res.status(201).json({
            success: true,
            message: "Project created successufully",
            task: task,
        });
}

const updateTask = async (req, res) => {

    const { id } = req.params;

    const result = await updateTaskInDb(id, req)

    res.status(200).json({
        success: true,
        task: result?.task,
        project: result?.project,
        message: "Task is updated successfully"
    });
}


const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if(!status) {
        res.status(400);
        throw new Error("Status required");
    }

    const sender = {
        userId: req?.user?.uid,
        name: req?.user?.name,
        role: req?.user?.user_role,
    }

    const result = await updateAndStoreTaskStatus(id, status, sender);

    res.status(200).json({
        success: true,
        task: result.task,
        project: result.project,
        message: "Status updated successfully",
    })
}

const getAllTasksOfProject = async (req, res) => {
    
    const { pid } = req.params;

    const tasks = await FetchAllMyTasksOfProject(pid);

    res.status(200).json({
        success: true,
        tasks: tasks
    });
};

const getAllTasks = async (req, res) => {
    const userId = req?.user?.uid;

    const tasks = await fetchAllTasks(userId);

    if(!tasks.length === 0) {
        console.log("nothing to pass");
        return res.status(200).json({
            success: true,
            tasks: [],
        })
    }

    res.status(200).json({
        success: true,
        AllTasks: tasks,
    });
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    const result = await deleteTaskFromDB(id);

    res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    })
}

module.exports = {
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
};