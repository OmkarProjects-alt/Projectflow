const pool = require("../config/DbConnection");


const fetchUsers = async (
    userId,
    page,
    limit,
    search,
    sort
) => {

    const offset = (page - 1) * limit;

    let orderBy = "u.name ASC";

    switch (sort) {

        case "newer":
            orderBy = "u.created_at DESC";
            break;

        case "older":
            orderBy = "u.created_at ASC";
            break;

        case "role":
            orderBy = "u.role DESC, u.name ASC";
            break;

        default:
            orderBy = "u.name ASC";
    }

    const values = [
        userId,
        `%${search}%`,
        limit,
        offset
    ];

    const totalResult = await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM (
            SELECT DISTINCT
                u.uid
            FROM users u
            JOIN project_members pm
                ON pm.user_id = u.uid

            WHERE
                pm.project_id IN (

                    SELECT pid
                    FROM projects
                    WHERE created_by = $1

                    UNION

                    SELECT project_id
                    FROM project_members
                    WHERE user_id = $1
                )

            AND u.uid <> $1
            AND u.is_verified = true

            AND (
                u.name ILIKE $2
                OR u.email ILIKE $2
            )

        ) t
        `,
        values.slice(0,2)
    );

    const users = await pool.query(
        `
        SELECT DISTINCT
            u.uid,
            u.name,
            u.email,
            u.created_at,
            u.role

        FROM users u

        JOIN project_members pm
            ON pm.user_id = u.uid

        WHERE
            pm.project_id IN (

                SELECT pid
                FROM projects
                WHERE created_by = $1

                UNION

                SELECT project_id
                FROM project_members
                WHERE user_id = $1
            )

        AND u.uid <> $1
        AND u.is_verified = true

        AND (
            u.name ILIKE $2
            OR u.email ILIKE $2
        )

        ORDER BY ${orderBy}

        LIMIT $3
        OFFSET $4
        `,
        values
    );

    const total = totalResult.rows[0].total;

    return {

        success: true,

        users: users.rows,

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

const searchMembersService = async (query, projectId) => {
    if (!query?.trim() || !projectId) {
        return [];
    }

    const search = `%${query.trim()}%`;

    const result = await pool.query(
        `
        SELECT DISTINCT
            u.uid,
            u.name,
            u.email,
            u.user_role

        FROM users u

        LEFT JOIN project_members pm
            ON pm.user_id = u.uid

        LEFT JOIN projects p
            ON p.pid = pm.project_id

        WHERE
            u.is_verified = true

        AND NOT EXISTS (
            SELECT 1
            FROM project_members current_pm
            WHERE current_pm.project_id = $2
              AND current_pm.user_id = u.uid
        )

        AND (
            u.name ILIKE $1
            OR u.email ILIKE $1
            OR COALESCE(u.user_role, '') ILIKE $1
            OR p.title ILIKE $1
        )

        ORDER BY
            CASE
                WHEN u.name ILIKE $1 THEN 1
                WHEN u.email ILIKE $1 THEN 2
                WHEN COALESCE(u.user_role, '') ILIKE $1 THEN 3
                WHEN p.title ILIKE $1 THEN 4
                ELSE 5
            END,
            u.name ASC

        LIMIT 10;
        `,
        [search, projectId]
    );

    return result.rows;
};


const updateUserProfileService = async (
    userId,
    req,
) => {

     const fieldsMap = {
        name: "name",
        about: "about",
        location: "location",
        role: "user_role",
        skills: "skills"
    }

    const update = [];
    const values = [];
    let index = 1;

    for (const [field, fieldValue] of Object.entries(req.body)) {
        const dbField = fieldsMap[field];
        if (!dbField) continue;

        update.push(`${dbField} = $${index}`);
        values.push(fieldValue);
        index++;
    }

    values.push(userId);

    const query = `
    UPDATE users
    SET ${update.join(', ')}, updated_at =  CURRENT_TIMESTAMP
    WHERE uid = $${index}
    RETURNING *
    `

    const result = await pool.query(query, values);

    return result;
}

module.exports = {
    searchMembersService,
    fetchUsers,
    updateUserProfileService
};