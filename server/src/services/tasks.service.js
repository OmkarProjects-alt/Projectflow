const pool = require("../config/DbConnection");
const { emitToProject, emitToUser } = require("../socket/emitters");
const updateProjectProgress = require("../utils/updateProjectProgress");

const fetchUserProjectTasks = async (userId, projectId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const offset = (page - 1) * limit;
  // Total task count
  const taskResult = await pool.query(
    `
      SELECT
        t.*,
        u.uid AS assigned_user_id,
        u.name AS assigned_user_name,
        u.user_role AS assigned_user_role,
        COUNT(*) OVER() AS total
      FROM tasks t
      LEFT JOIN users u
        ON u.uid = t.assigned_to
      WHERE t.project_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2
      OFFSET $3
    `,
    [projectId, limit, offset]
  );

  const rows = taskResult.rows;

  const total = rows.length > 0 ? Number(rows[0].total) : 0;

  return {
    tasks: rows.map(({ total, ...task }) => task), // optional: remove total from each task
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

const fetchAllStatusOfMyProjectTasks = async ({ pid }) => {
  console.log("my id", pid);
  const status = await pool.query(
    `
            SELECT status, tid, project_id
            FROM tasks
            WHERE project_id = $1
        `,
    [pid],
  );

  return {
    status: status.rows,
  };
};

const fetchTasksAssignedToMe = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const offset = (page - 1) * limit;

  // Fetch paginated tasks
  const tasks = await pool.query(
    `
        SELECT
            t.*,

            assignee.uid AS assigned_user_id,
            assignee.name AS assigned_user_name,
            assignee.user_role AS assigned_user_role,

            assigner.uid AS assigned_by_id,
            assigner.name AS assigned_by_name,
            assigner.user_role AS assigned_by_role,

            COUNT(*) OVER() AS total

        FROM tasks t

        LEFT JOIN users assignee
            ON t.assigned_to = assignee.uid

        LEFT JOIN users assigner
            ON t.assigned_by = assigner.uid

        WHERE t.assigned_to = $1

        ORDER BY t.created_at DESC

        LIMIT $2 OFFSET $3
        `,
    [userId, limit, offset],
  );

  const rows = tasks.rows;

  const total = rows.length > 0 ? Number(rows[0].total) : 0

  return {
    tasks: rows.map(({ total, ...task }) => task),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

const fetchCurrentTask = async (tid) => {
  const task = await pool.query(
    `
            SELECT
                t.*,

                assignee.uid AS assigned_user_id,
                assignee.name AS assigned_user_name,
                assignee.user_role assigned_user_role,

                assigner.uid AS assigned_by_id,
                assigner.name AS assigned_by_name,
                assigner.user_role AS assigned_by_role

            FROM tasks t

            LEFT JOIN users assignee
               ON t.assigned_to = assignee.uid

            LEFT JOIN users assigner
                ON t.assigned_by = assigner.uid

            WHERE t.tid = $1
        `,
    [tid],
  );

  return task.rows[0];
};

const fetchMyTasksStatus = async (userId) => {
  const result = await pool.query(
    `
            SELECT tid, status, project_id
            FROM tasks
            WHERE assigned_to = $1
        `,
    [userId],
  );

  return result.rows;
};

const StoreNewTask = async (req) => {
  const {
    title,
    description,
    project,
    assign,
    priority,
    deadline,
    status,
  } = req.body;

  const creatorUserId = req.user.uid;

  if (
    !title ||
    !description ||
    !project ||
    !assign ||
    !priority ||
    !deadline ||
    !status
  ) {
    throw new Error("Missing fields");
  }

  try {
    await pool.query("BEGIN");
    console.log(process.env.CLOUD_DB, "my bd connection");
    // Insert task and fetch assigned user in ONE query
    const { rows } = await pool.query(
      `
      WITH new_task AS (
          INSERT INTO tasks
          (
              title,
              description,
              project_id,
              assigned_to,
              assigned_by,
              priority,
              deadline,
              status
          )
          VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8)
          RETURNING *
      )

      SELECT
          nt.*,

          u.uid       AS assigned_user_id,
          u.name      AS assigned_user_name,
          u.user_role AS assigned_user_role,

          p.title AS project_name

      FROM new_task nt
      LEFT JOIN users u
          ON u.uid = nt.assigned_to

      LEFT JOIN projects p
        ON p.pid = nt.project_id
      `,
      [
        title,
        description,
        project,
        assign,
        creatorUserId,
        priority,
        deadline,
        status,
      ]
    );

    const task = rows[0];

    console.log("my task store ", task);
    // Run independent queries simultaneously
      const activityResult = await pool.query(
        `
        INSERT INTO activities
        (
            project_id,
            task_id,
            user_id,
            type,
            title,
            message
        )
        VALUES
        ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [
          task.project_id,
          task.tid,
          creatorUserId,
          "TASK_ASSIGNED",
          "New Task",
          `${req.user.name} assigned "${task.title}" task to ${task.assigned_user_name}`,
        ]
      );

      await pool.query(
        `
        INSERT INTO project_members
        (project_id,user_id)
        VALUES ($1,$2)
        ON CONFLICT (project_id,user_id)
        DO NOTHING
        `,
        [task.project_id, task.assigned_to]
      );

      await pool.query(
        `
        INSERT INTO notifications
        (
            receiver_id,
            sender_id,
            type,
            title,
            message
        )
        VALUES
        ($1,$2,$3,$4,$5)
        `,
        [
          task.assigned_to,
          creatorUserId,
          "TASK_ASSIGNED",
          `${req.user.name} assigned you a task`,
          `${req.user.name} assigned "${task.title}" to you`,
        ]
      );


    await pool.query("COMMIT");

    // Socket events after commit
    emitToUser(task.assigned_to, "notification", {
      title: "New Task",
      message: `${req.user.name} assigned you "${task.title}"`,
      type: "task",
    });

    emitToUser(task.assigned_to, "task:updated", {
      ...task,
      assigned_by_id: req.user.uid,
      assigned_by_name: req.user.name,
      assigned_by_role: req.user.user_role,
    });

    const activities = {
      ...activityResult.rows[0],
      actor_name: req?.user?.name,
      actor_email: req?.user?.email,
      task_name: task.title,
      project_name: task?.project_name,
    }

    emitToProject(
      task.project_id,
      "activity",
      activities,
    );

    return task;
  } catch (error) {
    console.log("error", error.message);
    await pool.query("ROLLBACK");
    throw error;
  }
};


const updateTaskInDb = async (id, req) => {
  const fieldMap = {
    title: "title",
    description: "description",
    assign: "assigned_to",
    priority: "priority",
    status: "status",
    deadline: "deadline",
  };

  const updates = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(req.body)) {
    if (!fieldMap[key]) continue;

    updates.push(`${fieldMap[key]} = $${index++}`);
    values.push(value);
  }

  if (updates.length === 0) {
    throw new Error("Nothing to update");
  }

  values.push(id);

  try {
    await pool.query("BEGIN");

    // Update task + fetch assigned user in one query
    const { rows, rowCount } = await pool.query(
      `
      UPDATE tasks t
      SET ${updates.join(", ")}
      WHERE t.tid = $${index}
      RETURNING
        t.*,
        (
          SELECT name
          FROM users
          WHERE uid = t.assigned_to
        ) AS assigned_user_name,
        (
          SELECT user_role
          FROM users
          WHERE uid = t.assigned_to
        ) AS assigned_user_role
      `,
      values
    );

    if (!rowCount) {
      throw new Error("Task not found");
    }

    const task = rows[0];

    // notification
    await pool.query(
      `
      INSERT INTO notifications
      (
        receiver_id,
        sender_id,
        type,
        title,
        message
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        task.assigned_to,
        req.user.uid,
        "TASK_UPDATED",
        `Task Updated`,
        `${req.user.name} updated "${task.title}".`,
      ]
    );

    // activity
    const { rows: activityRows } = await pool.query(
      `
      INSERT INTO activities
      (
        project_id,
        task_id,
        user_id,
        type,
        title,
        message
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        task.project_id,
        task.tid,
        req.user.uid,
        "TASK_UPDATED",
        "Task Updated",
        `${req.user.name} updated "${task.title}".`,
      ]
    );

    await pool.query("COMMIT");

    let project = null;

    if ("status" in req.body) {
      project = await updateProjectProgress(task.project_id);
    }

    emitToUser(task.assigned_to, "notification", {
      title: "Task Updated",
      message: `${req.user.name} updated "${task.title}"`,
      type: "task",
    });

    emitToUser(task.assigned_to, "task:updated", {
      ...task,
      assigned_user_id: task.assigned_to,
      assigned_by_id: req.user.uid,
      assigned_by_name: req.user.name,
      assigned_by_role: req.user.user_role,
    });

    const activities = {
      ...activityRows[0],
      actor_name: req?.user?.name,
      actor_email: req?.user?.email,
      task_name: task.title,
      project_name: task?.project_name,
    }

    emitToProject(
      task.project_id, 
      "activity",
      activities,
    );

    return {
      project,
      task: {
        ...task,
        assigned_user_id: task.assigned_to,
      },
    };
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
};

const updateAndStoreTaskStatus = async (
  id,
  status,
  sender
) => {
  try {
    await pool.query("BEGIN");

    const { rows, rowCount } = await pool.query(
      `
      UPDATE tasks t
      SET
        status = $1,
        updated_at = NOW()
      FROM users u,
           projects p
      WHERE
        t.tid = $2
        AND u.uid = t.assigned_to
        AND p.pid = t.project_id
      RETURNING
        t.*,

        u.uid        AS assigned_user_id,
        u.name       AS assigned_user_name,
        u.user_role  AS assigned_user_role,

        p.title      AS project_name;
      `,
      [status, id]
    );

    if (!rowCount) {
      throw new Error("Task not found");
    }

    const task = rows[0];

    // Notification
    await pool.query(
      `
      INSERT INTO notifications
      (
        receiver_id,
        sender_id,
        type,
        title,
        message
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        task.assigned_to,
        sender.userId,
        "TASK_STATUS_CHANGED",
        `Task status updated`,
        `${sender.name} updated "${task.title}" status to ${status}`,
      ]
    );

    // Activity
    const { rows: activityRows } = await pool.query(
      `
      INSERT INTO activities
      (
        project_id,
        task_id,
        user_id,
        type,
        title,
        message
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        task.project_id,
        task.tid,
        sender.userId,
        "TASK_UPDATED",
        "Task Status Updated",
        `${sender.name} changed "${task.title}" to ${status}`,
      ]
    );

    await pool.query("COMMIT");

    // Update project progress after commit
    const project = await updateProjectProgress(task.project_id);

    // Emit activity
    emitToProject(task.project_id, "activity", {
      ...activityRows[0],
      actor_name: sender.name,
      actor_email: sender.email,
      task_name: task.title,
      project_name: task.project_name,
    });

    // Notification socket
    emitToUser(task.assigned_to, "notification", {
      title: "Task Status Updated",
      message: `${sender.name} updated "${task.title}" to ${status}`,
      type: "task",
    });

    // Live task update
    emitToUser(task.assigned_to, "task:updated", {
      ...task,
      assigned_by_id: sender.userId,
      assigned_by_name: sender.name,
      assigned_by_role: sender.role,
    });

    return {
      task: {
        ...task,
        assigned_by_id: sender.userId,
        assigned_by_name: sender.name,
        assigned_by_role: sender.role,
      },
      project,
    };

  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
};

const FetchAllMyTasksOfProject = async (pid) => {
  const { rows } = await pool.query(
    `
    SELECT
        t.tid,
        t.title,
        t.description,
        t.project_id,
        t.assigned_to,
        t.assigned_by,
        t.priority,
        t.deadline,
        t.status,
        t.created_at,

        u.uid        AS assigned_user_id,
        u.name       AS assigned_user_name,
        u.user_role  AS assigned_user_role

    FROM tasks AS t

    LEFT JOIN users AS u
        ON u.uid = t.assigned_to

    WHERE t.project_id = $1

    ORDER BY
        CASE t.status
            WHEN 'Todo' THEN 1
            WHEN 'In Progress' THEN 2
            WHEN 'Review' THEN 3
            WHEN 'Completed' THEN 4
            ELSE 5
        END,
        t.created_at DESC;
    `,
    [pid]
  );

  return rows;
};

const fetchAllTasks = async (userId) => {

  const tasks  = await pool.query(
        "SELECT * FROM tasks",
    );

  return tasks.rows;
}


const deleteTaskFromDB = async (id) => {
  return await pool.query(
      "DELETE FROM tasks WHERE tid = $1",
      [id],
  );
}

module.exports = {
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
  deleteTaskFromDB,
};
