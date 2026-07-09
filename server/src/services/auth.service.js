const bcrypt = require("bcryptjs");
const pool = require("../config/DbConnection");
const { sendMail, sendMailAsync, sendMailWithRetry } = require('../utils/SendMail');
const generateToken = require('../utils/generateToken');

const registerUserService = async (userData) => {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const userExist = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (userExist.rows.length > 0 && userExist.rows[0].is_verified) {
        const error = new Error("User already exist, please try to login");
        error.statusCode = 409;
        throw error;
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const result = await sendMailWithRetry(
        email,
        "Your OTP Code",
        otp,
        2
    );

    if (!result.status) {
        const error = new Error(
            result.userMessage ||
            "We couldn't send the verification code. Please check your email and try again."
        );
        error.statusCode = 503;
        throw error;
    }

    if (userExist.rows.length === 0) {
        await pool.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                is_verified,
                otp,
                otp_expires_at
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            `,
            [
                name,
                email,
                hashPassword,
                false,
                otp,
                otpExpiresAt,
            ]
        );
    } else {
        await pool.query(
            `
            UPDATE users
            SET
                name = $1,
                password = $2,
                otp = $3,
                otp_expires_at = $4
            WHERE email = $5
            `,
            [
                name,
                hashPassword,
                otp,
                otpExpiresAt,
                email,
            ]
        );
    }

    return {
        success: true,
        message: "Verification code sent! Check your email inbox or spam folder."
    };
};

const logoutService = async (res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/",
    });

    return {
        success: true,
        message: "Logged out successfully",
    };
};

const loginUserService = async (userData, res) => {
    const { email, password } = userData;

    if (!email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const userExist = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (userExist.rows.length === 0) {
        const error = new Error("User not exist, Please try to register");
        error.statusCode = 401;
        throw error;
    }

    const User = userExist.rows[0];

    if (!User.is_verified) {
        const error = new Error(
            "User is not verified by otp, Please register first"
        );
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(
        password,
        User.password
    );

    if (!isMatch) {
        const error = new Error(
            "User not exist, Please try to register"
        );
        error.statusCode = 401;
        throw error;
    }

    await generateToken(res, User.uid);

    return {
        success: true,
        message: "User Logged In successfully",
        User: {
            name: User.name,
            email: User.email,
            role: User.role,
            uid: User.uid,
            created_at: User.created_at,
        },
    };
};


module.exports = {
    logoutService,
    loginUserService,
    registerUserService,
};