const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, name, slug, description, image_url, created_at FROM categories ORDER BY id"
        );

        res.json(rows);
    } catch (error) {
        console.error("CATEGORY ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch categories"
        });
    }
});

module.exports = router;