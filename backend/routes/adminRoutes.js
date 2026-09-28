const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true });

router.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const [rows] = await db.query("SELECT id, email, password_hash FROM admins WHERE email = ?", [email.trim().toLowerCase()]);
        const admin = rows[0];
        if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "8h" });
        return res.json({ token, admin: { id: admin.id, email: admin.email } });
    } catch (error) {
        console.error("ADMIN LOGIN ERROR:", error);
        return res.status(500).json({ message: "Unable to sign in" });
    }
});

router.get("/summary", requireAdmin, async (req, res) => {
    try {
        const [[products]] = await db.query("SELECT COUNT(*) AS total, SUM(is_active = 1) AS active, SUM(stock_quantity <= 5 AND is_active = 1) AS low_stock FROM products");
        const [[orders]] = await db.query("SELECT COUNT(*) AS total, SUM(status = 'Placed') AS pending, SUM(status = 'Delivered') AS delivered FROM orders");
        const [[enquiries]] = await db.query("SELECT COUNT(*) AS total FROM enquiries WHERE status = 'open'");
        return res.json({ products, orders, enquiries });
    } catch (error) {
        console.error("ADMIN SUMMARY ERROR:", error);
        return res.status(500).json({ message: "Unable to load dashboard summary" });
    }
});

router.get("/orders", requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
        return res.json(rows);
    } catch (error) {
        console.error("ADMIN ORDERS ERROR:", error);
        return res.status(500).json({ message: "Unable to load orders" });
    }
});

router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
    const statuses = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!statuses.includes(req.body && req.body.status)) return res.status(400).json({ message: "Invalid order status" });
    try {
        const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: "Order not found" });
        return res.json({ message: "Order status updated" });
    } catch (error) {
        console.error("ORDER STATUS ERROR:", error);
        return res.status(500).json({ message: "Unable to update order status" });
    }
});

module.exports = router;
