-- Create database and use charset to support Vietnamese
CREATE DATABASE IF NOT EXISTS appfood
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE appfood;

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Food / Drink Table
CREATE TABLE IF NOT EXISTS items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    price DOUBLE NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '0 = inactive, 1 = active',
    type VARCHAR(20) NOT NULL COMMENT 'Enum values: FOOD, DRINK',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Customer Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    ward VARCHAR(100),
    address VARCHAR(255),
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Order table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    total_price DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new' COMMENT 'new, completed, cancelled',
    customer_id BIGINT,
    shipping_fee DOUBLE NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Order detail table
CREATE TABLE IF NOT EXISTS order_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert data items
INSERT INTO items (id, name, image, description, price, status, type, created_at, updated_at) VALUES
(1, 'Cà phê sữa đậm 9', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Cà phê đậm, thêm sữa 4', 22, 0, 'food', '2025-07-21 10:17:34', '2025-07-21 11:40:21'),
(2, 'Cà phê sữa đậm 5', 'uploads/food/7e9c2054-187a-4f63-9802-26353f4d483a_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 22, 1, 'food', '2025-07-21 11:27:03', '2025-07-21 11:27:03'),
(3, 'Cà đậm 5', 'uploads/food/7ddeffb8-30c8-419f-931f-1be2e11039ec_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 22, 1, 'food', '2025-07-21 11:27:11', '2025-07-21 11:27:11'),
(4, 'Cà đậm 5', 'uploads/drink/87c2e5bb-93e5-4a2e-a805-9e10b9db9a41_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 22, 1, 'drink', '2025-07-21 21:16:42', '2025-07-21 21:16:42'),
(5, 'Cà phê 5', 'uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 22, 1, 'drink', '2025-07-21 21:34:29', '2025-07-21 21:34:29'),
(6, 'Cà phê 6', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 36, 1, 'drink', '2025-07-22 07:18:02', '2025-07-22 07:18:02'),
(7, 'Cà phê 7', 'uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 21, 1, 'food', '2025-07-22 07:18:17', '2025-07-22 07:18:17'),
(8, 'Cà phê 8', 'uploads/food/f0b37752-cb7a-440d-8c0f-dd82f8d28379_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 36, 1, 'food', '2025-07-22 07:19:22', '2025-07-22 07:19:22'),
(9, 'Cà phê 9', 'uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 15, 1, 'drink', '2025-07-22 07:19:33', '2025-07-22 07:19:33');
