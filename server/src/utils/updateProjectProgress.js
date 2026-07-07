const pool = require('../config/DbConnection');

const updateProjectProgress =  async(projectId) => {
    
    const result = await pool.query(`
            SELECT
             COUNT(*) AS total_tasks,
             COUNT(*) FILTER (
                WHERE LOWER(status) = 'completed'
             ) AS completed_tasks
             FROM tasks
             WHERE project_id = $1
        `,
        [projectId]
    );

    let progress = 0;

    const totalTasks = Number(result?.rows[0].total_tasks);
    const completedTasks = Number(result?.rows[0].completed_tasks);

    if(totalTasks > 0) {
        progress = Math.round(
            (completedTasks/ totalTasks) * 100
        );
    }

    console.log("my data", projectId);

    const project = await pool.query(`
        UPDATE projects
        SET progress = $1
        WHERE pid = $2
        RETURNING *
    `,
    [progress, projectId],
    );

    return project.rows[0];

}


module.exports = updateProjectProgress;