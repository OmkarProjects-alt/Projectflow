const pool = require("../config/DbConnection");

const globalSearchService = async (userId, query) => {

    if (!query.trim()) {

        return {
            projects: [],
            tasks: [],
            members: [],
            activities: [],
        };

    }

    const search = `%${query}%`;

    //----------------------------------------
    // PROJECTS
    //----------------------------------------

    const projectQuery = pool.query(
        `
        SELECT

            pid,
            title,
            status,
            created_at

        FROM projects

        WHERE

        (
            created_by = $1

            OR

            pid IN
            (
                SELECT project_id
                FROM project_members
                WHERE user_id = $1
            )
        )

        AND
        (
            title ILIKE $2
        )

        ORDER BY title

        LIMIT 5
        `,
        [userId, search]
    );

    //----------------------------------------
    // TASKS
    //----------------------------------------

    const taskQuery = pool.query(
        `
        SELECT

            t.tid,
            t.title,
            t.status,
            t.priority,
            t.project_id,

            p.title AS project_name

        FROM tasks t

        LEFT JOIN projects p
            ON p.pid = t.project_id

        WHERE

        t.project_id IN (

            SELECT pid
            FROM projects
            WHERE created_by=$1

            UNION

            SELECT project_id
            FROM project_members
            WHERE user_id=$1

        )

        AND
        (

            t.title ILIKE $2

            OR

            t.description ILIKE $2

        )

        ORDER BY t.created_at DESC

        LIMIT 5
        `,
        [userId, search]
    );

    //----------------------------------------
    // MEMBERS
    //----------------------------------------

    const memberQuery = pool.query(
        `
        SELECT DISTINCT

            u.uid,
            u.name,
            u.email,
            u.user_role

        FROM users u

        JOIN project_members pm
            ON pm.user_id=u.uid

        WHERE

        pm.project_id IN(

            SELECT pid
            FROM projects
            WHERE created_by=$1

            UNION

            SELECT project_id
            FROM project_members
            WHERE user_id=$1

        )

        AND

        (

            u.name ILIKE $2

            OR

            u.email ILIKE $2

        )

        ORDER BY u.name

        LIMIT 5
        `,
        [userId, search]
    );

    //----------------------------------------
    // ACTIVITIES
    //----------------------------------------

    const activityQuery = pool.query(
        `
        SELECT

            a.aid,
            a.title,
            a.message,
            a.type,
            a.created_at,

            u.name AS actor_name,

            p.title AS project_name

        FROM activities a

        LEFT JOIN users u
            ON u.uid=a.user_id

        LEFT JOIN projects p
            ON p.pid=a.project_id

        WHERE

        a.project_id IN(

            SELECT pid
            FROM projects
            WHERE created_by=$1

            UNION

            SELECT project_id
            FROM project_members
            WHERE user_id=$1

        )

        AND
        (

            a.title ILIKE $2

            OR

            a.message ILIKE $2

        )

        ORDER BY a.created_at DESC

        LIMIT 5
        `,
        [userId, search]
    );

    //----------------------------------------

    const [
        projects,
        tasks,
        members,
        activities
    ] = await Promise.all([
        projectQuery,
        taskQuery,
        memberQuery,
        activityQuery
    ]);

    return {

        projects: projects.rows,

        tasks: tasks.rows,

        members: members.rows,

        activities: activities.rows,

    };

};

module.exports = {
    globalSearchService
};