const bcrypt = require("bcryptjs");
const db = require("./db");

async function ensureSchema() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS admins (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id INT PRIMARY KEY AUTO_INCREMENT,
            order_number VARCHAR(32) NOT NULL UNIQUE,
            customer_name VARCHAR(150) NOT NULL,
            phone VARCHAR(30) NOT NULL,
            email VARCHAR(255),
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            pincode VARCHAR(12) NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
            discount DECIMAL(10,2) NOT NULL DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            coupon_code VARCHAR(50),
            status ENUM('Placed','Confirmed','Shipped','Delivered','Cancelled') NOT NULL DEFAULT 'Placed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_orders_status (status),
            INDEX idx_orders_phone (phone)
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INT PRIMARY KEY AUTO_INCREMENT,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            pack_size VARCHAR(50),
            subtotal DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            INDEX idx_order_items_product (product_id)
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS coupons (
            id INT PRIMARY KEY AUTO_INCREMENT,
            code VARCHAR(50) NOT NULL UNIQUE,
            discount_type ENUM('percentage','fixed') NOT NULL,
            discount_value DECIMAL(10,2) NOT NULL,
            minimum_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            maximum_discount DECIMAL(10,2),
            start_date DATE,
            end_date DATE,
            usage_limit INT,
            used_count INT NOT NULL DEFAULT 0,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS enquiries (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(150) NOT NULL,
            phone VARCHAR(30),
            email VARCHAR(255),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            status ENUM('open','resolved') NOT NULL DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_id INT NOT NULL,
            customer_name VARCHAR(150) NOT NULL,
            rating TINYINT NOT NULL,
            review_text TEXT NOT NULL,
            is_approved BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_reviews_product (product_id)
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT NOT NULL,
            image_url TEXT,
            ingredients TEXT,
            instructions TEXT,
            cooking_time VARCHAR(50),
            difficulty VARCHAR(50),
            category VARCHAR(100),
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS product_images (
            id INT PRIMARY KEY AUTO_INCREMENT,
            product_id INT NOT NULL,
            image_url TEXT NOT NULL,
            alt_text VARCHAR(255),
            sort_order INT NOT NULL DEFAULT 0,
            is_primary BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_product_images_product (product_id)
        )
    `);

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const [admins] = await db.query("SELECT id FROM admins WHERE email = ?", [process.env.ADMIN_EMAIL]);
        if (!admins.length) {
            const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
            await db.query("INSERT INTO admins (email, password_hash) VALUES (?, ?)", [process.env.ADMIN_EMAIL, passwordHash]);
        }
    }
}

module.exports = { ensureSchema };
