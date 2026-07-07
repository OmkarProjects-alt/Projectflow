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

const searchMembersService = async (
    query,
    projectId
) => {

    if (!query || !projectId) {
        return [];
    }

    const result = await pool.query(
        `
        SELECT
            u.uid,
            u.name,
            u.email,
            u.user_role
        FROM users u

        WHERE
            u.is_verified = true

        AND
        (
            LOWER(u.name) LIKE LOWER($1)
            OR
            LOWER(u.email) LIKE LOWER($1)
        )

        AND NOT EXISTS (

            SELECT 1

            FROM project_members pm

            WHERE
                pm.project_id = $2
            AND
                pm.user_id = u.uid

        )

        ORDER BY u.name
        LIMIT 10
        `,
        [
            `%${query}%`,
            projectId,
        ]
    );

    return result.rows;
};

module.exports = {
    searchMembersService,
    fetchUsers,
};