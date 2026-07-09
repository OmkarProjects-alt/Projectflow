const express = require("express");
const router = express.Router();

const { globalSearch } = require("../controller/search.controller");
const authMiddleware = require("../middleware/authMiddleware");
const aysncHandler = require('../utils/asyncHandler');

router.get("/", authMiddleware, 
    aysncHandler(globalSearch)
);

module.exports = router;