const express = require('express');
const Router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/DbConnection');
const { sign } = require('jsonwebtoken');
const { 
    searchProjectMembers, 
    getUsers 
} = require("../controller/user.controller");

Router.get('/', authMiddleware,
    asyncHandler(getUsers)
);

Router.patch(
    "/profile",
    authMiddleware,
    asyncHandler(async (req, res) => {
        const userId = req.user.uid;

        const {
            name,
            about,
            location,
            role,
            skills,
        } = req.body;
        
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

       console.log("result", result.rows[0]);

        if (result.rowCount === 0) {
            res.status(404);
            throw new Error("User not found.");
        }

        return res.status(200).json({
            success: true,
            message: "User data updated successfully.",
            user: result.rows[0],
        });
    })
);


Router.get(
    "/search-members",
    authMiddleware,
    asyncHandler(searchProjectMembers)
);

module.exports = Router;