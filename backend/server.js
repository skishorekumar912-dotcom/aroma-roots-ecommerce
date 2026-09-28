const express = require("express");
const cors = require("cors");
const db = require("./db");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { ensureSchema } = require("./schema");
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Aroma Roots Backend is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.json({
            message: "MySQL connected successfully",
            result: rows
        });
    } catch (error) {
        console.error("MYSQL ERROR:", error);

        res.status(500).json({
            message: "MySQL connection failed",
            error: error.message
        });
    }
});

const PORT = Number(process.env.PORT) || 5000;

ensureSchema()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Aroma Roots backend running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("DATABASE INITIALIZATION ERROR:", error.message);
        process.exitCode = 1;
    });