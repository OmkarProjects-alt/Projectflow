const express = require('express');
const pool = require('../config/DbConnection');
const aysncHandler = require('../utils/asyncHandler');
const { 
    getActivities,
    getActivitiesController
} = require("../controller/activity.controller");
const authMiddleware = require('../middleware/authMiddleware');
const Router = express.Router();

// Router.get('/', authMiddleware,
//     aysncHandler(getActivities)
// )

Router.get(
    "/",
    authMiddleware,
    aysncHandler(getActivitiesController)
);

module.exports = Router;
