const express = require('express');
const Router = express.Router();
const aysncHandler = require('../utils/asyncHandler');
const pool = require("../config/DbConnection");
const bcrypt = require("bcryptjs");
const generateToken = require('../utils/generateToken');
const { sendMail, sendMailAsync, sendMailWithRetry } = require('../utils/SendMail');
const authMiddleware = require('../middleware/authMiddleware');

Router.post('/register', 
    aysncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            console.log("my fields", name, email, password ,"and", req.body)
            res.status(400)
            throw new Error("All filed are required");
        }

        const userExist = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        if (userExist.rows.length > 0 && userExist.rows[0].is_verified) {
            res.status(409)
            throw new Error("User already exist, please try to login");
        }

        const hashPassword = await bcrypt.hash(password, 12);

        let verified = false;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const hash = await bcrypt.hash("12345678", 10);
        console.log("my otp", otp, "and", hash);
        const result = await sendMailWithRetry(email, "Your OTP Code", otp, 2);

        if(!result.status) {
            res.status(503);
            throw new Error(result.userMessage || "We couldn't send the verification code. Please check your email and try again.");
        };

        if(userExist.rows.length === 0) {
            await pool.query(
                "INSERT INTO users (name ,email, password, is_verified, otp, otp_expires_at) VALUES ($1, $2, $3, $4, $5, $6)",
                [name, email, hashPassword, verified, otp, otpExpiresAt]
            );
        } else {
            await pool.query(
                "UPDATE users SET name = $1, password = $2, otp = $3, otp_expires_at = $4 WHERE email = $5",
                [name, hashPassword, otp, otpExpiresAt, email]
            )
        }

        res.status(200).json({
            success: true,
            message: "Verification code sent! Check your email inbox or spam folder."
        });
    })
);

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

Router.post('/login', 
    aysncHandler(async (req, res) => {
        const { email, password } = req.body;

        if(!email || !password) {
            res.status(400)
            throw new Error("All filed are required");
        }

        const userExist = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        if(userExist.rows.length === 0) {
            res.status(401);
            throw new Error("User not exist, Please try to register");
        }

        let User = userExist.rows[0];

        if(!User.is_verified) {
            res.status(401);
            throw new Error("User is not verified by otp, Please register first");
        }

        const isMatch = await bcrypt.compare(
            password,
            User.password,
        );

        if(!isMatch) {
            res.status(401);
            throw new Error("User not exist, Please try to register");
        }

        await generateToken(res, User.uid);

        let userData = {
            name: User.name,
            email: User.email,
            role: User.role,
            uid: User.uid,
            created_at: User.created_at,
        }

        res.status(200).json({
            success: true,
            message: "User LogedIn succesfuly",
            User: userData
        });
    })
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