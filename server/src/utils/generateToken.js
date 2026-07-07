const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    console.log("my id", userId);
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

module.exports = generateToken;