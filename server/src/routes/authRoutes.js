const express = require('express');
const Router = express.Router();
const aysncHandler = require('../utils/asyncHandler');
const pool = require("../config/DbConnection");
const bcrypt = require("bcryptjs");
const generateToken = require('../utils/generateToken');
const { sendMail, sendMailAsync, sendMailWithRetry } = require('../utils/SendMail');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    logoutUser,
    verifySession,
    loginUser,
    registerUser,
} = require("../controller/auth.controller");

Router.post('/register', 
    aysncHandler(registerUser)
);


Router.post("/logout", authMiddleware, aysncHandler(logoutUser));

Router.post('/verify-otp',
    aysncHandler(async (req, res) => {
        const { email, OTP } = req.body;

        if(!email || !OTP ) {
            res.status(400);
            throw new Error("Please enter your otp");
        }

        const findUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(findUser.rows.length === 0) {
            res.status(401);
            throw new Error("Email not found, Please try again to register");
        }

        const DbOtp = findUser.rows[0].otp;
        const currentTime = new Date(Date.now())
        const ExpireOtpTime = findUser.rows[0].otp_expires_at;

        if(ExpireOtpTime < currentTime) {
            res.status(410)
            throw new Error("OTP has expired. Please resend OTP.");
        } 
        
        if(OTP !== DbOtp) {
            res.status(400);
            throw new Error("Invalid OTP");
        }

        const user =  await pool.query(
            "UPDATE users SET is_verified = $1, otp = NULL, otp_expires_at = NULL WHERE email = $2 RETURNING name, email, uid",
            [true, email]
        );

        await generateToken(res, user.rows[0].uid);

        res.status(200).json({
            success: true,
            user,
            message: "User verified successfully"
        });
    })
);

Router.post('/re-send-otp',
    aysncHandler(async (req, res) => {
        const { email } = req.body;

        console.log("my email 1");
        if(!email) {
            res.status(400)
            throw new Error("Email not found, Please Re-enter your email");
        }

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        console.log("my email 2");

        let verified = false;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 

        console.log("my otp", otp);

        const result = await await sendMailWithRetry(email, "Your OTP Code", otp, 2);

        if(!result.status) {
            res.status(503);
            throw new Error(result.userMessage || "We couldn't send the verification code. Please check your email and try again.");
        };

        await pool.query(
            "UPDATE users SET otp = $1, otp_expires_at = $2 WHERE email = $3",
            [otp, otpExpiresAt, email]
        );

        console.log("my email 3");

        res.status(200).json({
            success: true,
            message: "Verification code sent! Check your email inbox or spam folder."
        });
    })
)

Router.get(
    "/me",
    authMiddleware,
    aysncHandler(verifySession)
);

Router.post('/login', 
    aysncHandler(loginUser)
);

Router.post('/verify-session', authMiddleware,
    aysncHandler(async (req, res) => {
        const user = req.user;
        
        res.status(200).json({
            success: true,
            user,
        })
    })
)

module.exports = Router;