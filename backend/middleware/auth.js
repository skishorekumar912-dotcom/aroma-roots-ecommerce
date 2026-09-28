const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
    const header = req.get("authorization");
    const token = header && header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        console.error("AUTH ERROR:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = { requireAdmin };
