const pool = require("../config/DbConnection");

const fetchActivities = async (userId, query) => {

    console.log("userId", userId, "and query", query);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const offset = (page - 1) * limit;


    const totalResult = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM (
            SELECT DISTINCT a.aid
            FROM activities a

            LEFT JOIN projects p
                ON p.pid = a.project_id

            LEFT JOIN tasks t
                ON t.project_id = a.project_id

            WHERE
                p.created_by = $1
                OR
                t.assigned_to = $1
        ) activity_count
        `,
        [userId]
    );

    const total = Number(
        totalResult.rows[0].total
    );

    // Fetch activities
    const activityResult = await pool.query(
        `
        SELECT DISTINCT
            a.*,
            u.name AS actor_name,
            u.email AS actor_email,

            p.title AS project_name

        FROM activities a

        LEFT JOIN users u
            ON u.uid = a.user_id

        LEFT JOIN projects p
            ON p.pid = a.project_id

        LEFT JOIN tasks t
            ON t.project_id = a.project_id

        WHERE
            p.created_by = $1
            OR
            t.assigned_to = $1

        ORDER BY a.created_at DESC

        LIMIT $2
        OFFSET $3
        `,
        [userId, limit, offset]
    );

    return {
        activities: activityResult.rows,

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


const getActivitiesService = async (userId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const {
        search,
        type,
        actorId,
        projectId,
        startDate,
        endDate
    } = query;

    const where = [];
    const values = [];

    // User must belong to the project
    values.push(userId);

    where.push(`
        EXISTS (
            SELECT 1
            FROM project_members pm
            WHERE
                pm.project_id = a.project_id
                AND pm.user_id = $${values.length}
        )
    `);

    // ---------------- SEARCH ----------------

    if (search) {
        values.push(`%${search}%`);

        where.push(`
            (
                a.title ILIKE $${values.length}
                OR a.message ILIKE $${values.length}
                OR a.type ILIKE $${values.length}
                OR u.name ILIKE $${values.length}
                OR u.email ILIKE $${values.length}
                OR p.title ILIKE $${values.length}
                OR t.title ILIKE $${values.length}
            )
        `);
    }

    // ---------------- TYPE ----------------

    if (type && type !== "all") {
        values.push(type);
        where.push(`a.type = $${values.length}`);
    }

    // ---------------- PROJECT ----------------

    if (projectId) {
        values.push(projectId);
        where.push(`a.project_id = $${values.length}`);
    }

    // ---------------- ACTOR ----------------

    if (actorId) {
        values.push(actorId);
        where.push(`a.user_id = $${values.length}`);
    }

    // ---------------- DATE ----------------

    if (startDate) {
        values.push(startDate);
        where.push(`a.created_at >= $${values.length}`);
    }

    if (endDate) {
        values.push(endDate);
        where.push(`a.created_at <= $${values.length}`);
    }

    const whereClause =
        where.length > 0
            ? `WHERE ${where.join(" AND ")}`
            : "";

    // ---------------- TOTAL ----------------

    const totalQuery = await pool.query(
        `
        SELECT COUNT(*) AS total

        FROM activities a

        LEFT JOIN users u
            ON a.user_id = u.uid

        LEFT JOIN projects p
            ON a.project_id = p.pid

        LEFT JOIN tasks t
            ON a.task_id = t.tid

        ${whereClause}
        `,
        values
    );

    const total = Number(totalQuery.rows[0].total);

    // ---------------- DATA ----------------

    const dataValues = [...values, limit, offset];

    const activities = await pool.query(
        `
        SELECT

            a.*,

            u.name AS actor_name,
            u.email AS actor_email,

            p.title AS project_name,

            t.title AS task_name

        FROM activities a

        LEFT JOIN users u
            ON a.user_id = u.uid

        LEFT JOIN projects p
            ON a.project_id = p.pid

        LEFT JOIN tasks t
            ON a.task_id = t.tid

        ${whereClause}

        ORDER BY a.created_at DESC

        LIMIT $${dataValues.length - 1}
        OFFSET $${dataValues.length}
        `,
        dataValues
    );

    return {
        activities: activities.rows,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        },
    };
};

module.exports = {
    fetchActivities,
    getActivitiesService
};