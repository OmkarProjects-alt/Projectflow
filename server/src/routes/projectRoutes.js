const express = require('express');
const Router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    inviteMembers, 
    removeMember,
    getUserAssignedProjects,
    getAssignedProjects
} = require("../controller/project.controller")
const pool = require('../config/DbConnection');


Router.get('/', authMiddleware,
    asyncHandler(async (req, res) => {
        const userId = req?.user?.uid;

        const projects  = await pool.query(
            "SELECT * FROM projects WHERE created_by = $1",
            [userId],
        );

        console.log("userid", userId);

        let userProjects = projects.rows;

        if(!projects.rows.length === 0) {
            console.log("nothing to pass");
            return res.status(200).json({
                success: true,
                message: "create project",
                projects: [],
            })
        }

        res.status(200).json({
            success: true,
            projects: userProjects,
        })
    })
)

Router.post('/create', authMiddleware,
    asyncHandler(async (req, res) => {
        const { title, description, startDate, deadline, status } = req.body;

        const creatorUserId = req?.user?.uid;

        if(!title || !description || !startDate || !deadline || !status) {
            res.status(409);
            throw new Error("Missing Field's");
        }

        console.log("creator user id", creatorUserId);

        await pool.query("BEGIN");

        try {

            const result = await pool.query(
                `
                INSERT INTO projects
                (title, description, start_date, deadline, status, created_by)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *
                `,
                [
                    title,
                    description,
                    startDate,
                    deadline,
                    status,
                    creatorUserId,
                ]
            );

            const project = result.rows[0];

            await pool.query(
                `
                INSERT INTO project_members
                (project_id, user_id)
                VALUES ($1,$2)
                `,
                [
                    project.pid,
                    creatorUserId,
                ]
            );

            await pool.query("COMMIT");

            return res.status(201).json({
                success: true,
                message: "Project created successfully",
                project,
            });

        } catch (error) {

            await pool.query("ROLLBACK");
            throw error;

        }
    })
);

Router.post(
    "/invite-members",
    authMiddleware,
    asyncHandler(inviteMembers)
);

Router.delete(
    "/remove-member",
    authMiddleware,
    asyncHandler(removeMember)
);

Router.get('/project-ids', authMiddleware,
    asyncHandler(async (req, res) => {
        const userId = req.user.uid;

        const userProjectIds = await pool.query(`
                SELECT pid
                FROM projects
                WHERE created_by = $1

                UNION

                SELECT project_id
                FROM tasks
                WHERE assigned_to = $1
            `,
            [userId]
        );

        res.status(200).json({
            success: true,
            message: "User all projects ids found",
            projectIds: userProjectIds.rows,
        })
    })
)

Router.patch('/:id', authMiddleware,
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        const fieldMap = {
            title: "title",
            startDate: "start_date",
            deadline: "deadline",
            description: "description",
            status: "status",
        };

        const update = [];
        const values = [];
        let index = 1;

        Object.entries(req.body).forEach(([key, value]) => {

            const dbColumn = fieldMap[key];

            update.push(`${dbColumn} = $${index}`);
            values.push(value);
            index++;
        });

        values.push(id);

        console.log("my data",update,"and values", values, "index", index)

        const query = `
            UPDATE projects
            SET ${update.join(", ")}
            WHERE pid = $${index}
            RETURNING *
        `

        const updatedProject = await pool.query(query, values);

        res.status(200).json({
            success: true,
            project: updatedProject.rows[0],
            message: "Project updated successfully...",
        })
        
    })
);

Router.get("/assigned", authMiddleware,
    asyncHandler(getAssignedProjects)
);

Router.get(
    "/user-assigned-projects/:userId",
    authMiddleware,
    asyncHandler(getUserAssignedProjects)
);

Router.get('/user-created-projects/:userId', authMiddleware,
    asyncHandler(async (req, res) => {
        const { userId } = req.params;

        const UserCreatedProject = await pool.query(`
                SELECT * 
                FROM projects
                WHERE created_by = $1
            `,
            [userId]
        );

        if(UserCreatedProject.rowCount === 0) {
            return res.status(200).json({
                success: false,
                projects: [],
            })
        }

        res.status(200).json({
            success: true,
            projects: UserCreatedProject.rows,
        });
    })
);


module.exports = Router;