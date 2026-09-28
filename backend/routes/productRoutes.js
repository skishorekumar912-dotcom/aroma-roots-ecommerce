const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.id,
                p.name,
                p.slug,
                p.category_id,
                c.name AS category_name,
                p.description,
                p.price,
                p.mrp,
                p.rating,
                p.review_count,
                p.pack_sizes,
                p.spice_level,
                p.dish_type,
                p.region,
                p.is_vegetarian,
                p.ingredients,
                p.image_url,
                p.badge,
                p.stock_quantity,
                p.is_active,
                p.created_at,
                p.updated_at
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1
            ORDER BY p.id
        `);

        res.json(rows);
    } catch (error) {
        console.error("PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
});

router.get("/:slugOrId", async (req, res) => {
            try {
                const value = req.params.slugOrId;
                const [rows] = await db.query(`
                    SELECT p.*, c.name AS category_name
                    FROM products p JOIN categories c ON p.category_id = c.id
                    WHERE (p.slug = ? OR p.id = ?) AND p.is_active = 1
                    LIMIT 1
                `, [value, Number(value) || 0]);
                if (!rows.length) return res.status(404).json({ message: "Product not found" });
                return res.json(rows[0]);
            } catch (error) {
                console.error("PRODUCT DETAIL ERROR:", error);
                return res.status(500).json({ message: "Failed to fetch product" });
            }
        });

router.post("/", requireAdmin, async (req, res) => {
            const product = req.body || {};
            const required = ["name", "slug", "category_id", "price", "mrp"];
            if (required.some((key) => product[key] === undefined || product[key] === "")) return res.status(400).json({ message: "Name, slug, category, price and MRP are required" });
            try {
                const [result] = await db.query(`
                    INSERT INTO products (name, slug, category_id, description, price, mrp, pack_sizes, spice_level, dish_type, region, is_vegetarian, ingredients, image_url, badge, stock_quantity, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [product.name, product.slug, product.category_id, product.description || "", product.price, product.mrp, product.pack_sizes || "", product.spice_level || "", product.dish_type || "", product.region || "", Boolean(product.is_vegetarian), product.ingredients || "", product.image_url || "", product.badge || null, Number(product.stock_quantity) || 0, product.is_active !== false]);
                return res.status(201).json({ id: result.insertId });
            } catch (error) {
                console.error("PRODUCT CREATE ERROR:", error);
                return res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({ message: error.code === "ER_DUP_ENTRY" ? "A product with this slug already exists" : "Failed to create product" });
            }
        });

router.patch("/:id", requireAdmin, async (req, res) => {
            const product = req.body || {};
            const fields = ["name", "slug", "category_id", "description", "price", "mrp", "pack_sizes", "spice_level", "dish_type", "region", "is_vegetarian", "ingredients", "image_url", "badge", "stock_quantity", "is_active"];
            const updates = fields.filter((field) => product[field] !== undefined);
            if (!updates.length) return res.status(400).json({ message: "No product fields supplied" });
            try {
                const values = updates.map((field) => field === "is_vegetarian" || field === "is_active" ? Boolean(product[field]) : product[field]);
                const [result] = await db.query(`UPDATE products SET ${updates.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`, [...values, req.params.id]);
                if (!result.affectedRows) return res.status(404).json({ message: "Product not found" });
                return res.json({ message: "Product updated" });
            } catch (error) {
                console.error("PRODUCT UPDATE ERROR:", error);
                return res.status(500).json({ message: "Failed to update product" });
            }
        });

router.delete("/:id", requireAdmin, async (req, res) => {
            try {
                const [result] = await db.query("UPDATE products SET is_active = 0 WHERE id = ?", [req.params.id]);
                if (!result.affectedRows) return res.status(404).json({ message: "Product not found" });
                return res.json({ message: "Product deactivated" });
            } catch (error) {
                console.error("PRODUCT DEACTIVATE ERROR:", error);
                return res.status(500).json({ message: "Failed to deactivate product" });
            }
});

module.exports = router;