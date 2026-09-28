const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();
const asNumber = (value) => Number.parseFloat(value) || 0;

router.post("/", async (req, res) => {
    const { customer, items, couponCode } = req.body || {};
    if (!customer || !Array.isArray(items) || !items.length) return res.status(400).json({ message: "Customer details and cart items are required" });
    const required = ["name", "phone", "address", "city", "state", "pincode"];
    if (required.some((key) => typeof customer[key] !== "string" || !customer[key].trim())) return res.status(400).json({ message: "Please complete all delivery details" });

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const ids = items.map((item) => Number(item.productId)).filter(Number.isInteger);
        if (!ids.length || ids.length !== items.length) return res.status(400).json({ message: "Cart contains an invalid product" });
        const placeholders = ids.map(() => "?").join(",");
        const [products] = await connection.query(`SELECT id, name, price, stock_quantity, is_active FROM products WHERE id IN (${placeholders}) FOR UPDATE`, ids);
        const byId = new Map(products.map((product) => [Number(product.id), product]));
        let subtotal = 0;
        const normalizedItems = [];
        for (const item of items) {
            const product = byId.get(Number(item.productId));
            const quantity = Number(item.quantity);
            if (!product || !product.is_active) return res.status(409).json({ message: "One of the products is no longer available" });
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock_quantity) return res.status(409).json({ message: `${product.name} has insufficient stock` });
            const lineTotal = asNumber(product.price) * quantity;
            subtotal += lineTotal;
            normalizedItems.push({ product, quantity, packSize: String(item.packSize || ""), lineTotal });
        }
        let discount = 0;
        let appliedCoupon = null;
        if (couponCode) {
            const [coupons] = await connection.query("SELECT * FROM coupons WHERE code = ? AND is_active = 1 FOR UPDATE", [String(couponCode).trim().toUpperCase()]);
            const coupon = coupons[0];
            const today = new Date().toISOString().slice(0, 10);
            if (!coupon || (coupon.start_date && today < String(coupon.start_date).slice(0, 10)) || (coupon.end_date && today > String(coupon.end_date).slice(0, 10)) || (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) || subtotal < asNumber(coupon.minimum_order_amount)) {
                return res.status(400).json({ message: "Coupon is invalid or cannot be applied" });
            }
            discount = coupon.discount_type === "percentage" ? subtotal * asNumber(coupon.discount_value) / 100 : asNumber(coupon.discount_value);
            if (coupon.maximum_discount !== null) discount = Math.min(discount, asNumber(coupon.maximum_discount));
            discount = Math.min(discount, subtotal);
            appliedCoupon = coupon.code;
            await connection.query("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?", [coupon.id]);
        }
        const shippingFee = subtotal - discount >= 349 || subtotal === 0 ? 0 : 49;
        const total = subtotal + shippingFee - discount;
        const orderNumber = `AR${Date.now().toString().slice(-8)}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
        const [orderResult] = await connection.query(
            "INSERT INTO orders (order_number, customer_name, phone, email, address, city, state, pincode, subtotal, shipping_fee, discount, total_amount, coupon_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [orderNumber, customer.name.trim(), customer.phone.trim(), customer.email || null, customer.address.trim(), customer.city.trim(), customer.state.trim(), customer.pincode.trim(), subtotal, shippingFee, discount, total, appliedCoupon]
        );
        for (const item of normalizedItems) {
            await connection.query("INSERT INTO order_items (order_id, product_id, product_name, quantity, price, pack_size, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)", [orderResult.insertId, item.product.id, item.product.name, item.quantity, item.product.price, item.packSize, item.lineTotal]);
            await connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [item.quantity, item.product.id]);
        }
        await connection.commit();
        return res.status(201).json({ orderNumber, total });
    } catch (error) {
        await connection.rollback();
        console.error("ORDER CREATE ERROR:", error);
        return res.status(500).json({ message: "Unable to place order" });
    } finally {
        connection.release();
    }
});

router.get("/:orderNumber", async (req, res) => {
    try {
        const [orders] = await db.query("SELECT * FROM orders WHERE order_number = ?", [req.params.orderNumber]);
        if (!orders.length) return res.status(404).json({ message: "Order not found" });
        const [items] = await db.query("SELECT product_id, product_name, quantity, price, pack_size, subtotal FROM order_items WHERE order_id = ?", [orders[0].id]);
        return res.json({ ...orders[0], items });
    } catch (error) {
        console.error("ORDER LOOKUP ERROR:", error);
        return res.status(500).json({ message: "Unable to load order" });
    }
});

module.exports = router;
