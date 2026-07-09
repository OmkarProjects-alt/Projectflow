const {
    registerUserService,
    loginUserService,
    verifyOtpService,
    resendOtpService,
} = require("../services/auth.service");

const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

const verifySession = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};

const registerUser = async (req, res) => {
    const result = await registerUserService(req.body);

    res.status(200).json(result);
};

const loginUser = async (req, res) => {
    const result = await loginUserService(
        req.body,
        res
    );

    res.status(200).json(result);
};

const verifyOtp = async (req, res) => {
    const result = await verifyOtpService(
        req.body,
        res
    );

    res.status(200).json(result);
};

const resendOtp = async (req, res) => {
    const result = await resendOtpService(req.body);

    res.status(200).json(result);
};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    logoutUser,
    verifySession,
};