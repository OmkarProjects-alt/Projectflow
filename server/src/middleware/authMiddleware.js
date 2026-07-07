const jwt = require('jsonwebtoken');
const pool = require('../config/DbConnection');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unautherized,"
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query(
            "SELECT * FROM users WHERE uid = $1",
            [decode.userId],
        );

        if(user.rows.length === 0 ) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ ok: false, message: "Invalid token" });
    }
}

module.exports = authMiddleware;