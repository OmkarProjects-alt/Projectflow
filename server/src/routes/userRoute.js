const express = require('express');
const Router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/DbConnection');
const { sign } = require('jsonwebtoken');
const { 
    searchProjectMembers, 
    getUsers,
    updateUserProfile
} = require("../controller/user.controller");

Router.get('/', authMiddleware,
    asyncHandler(getUsers)
);

Router.patch(
    "/profile",
    authMiddleware,
    asyncHandler(updateUserProfile)
);


Router.get(
    "/search-members",
    authMiddleware,
    asyncHandler(searchProjectMembers)
);

module.exports = Router;