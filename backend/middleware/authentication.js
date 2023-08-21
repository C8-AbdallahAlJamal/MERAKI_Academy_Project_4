const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ").pop();
            jwt.verify(token, process.env.SECRET, (err, result) => {
                if (err) {
                    res.json({
                        success: false,
                        message: "The token is invalid or expired"
                    })
                } else {
                    req.token = result
                    next();
                }
            })
        } else {
            res.status(403).json({
                success: false,
                message: "Forbidden"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

module.exports = authentication;