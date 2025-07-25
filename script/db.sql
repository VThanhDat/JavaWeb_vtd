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
(9, 'Cà phê 9', 'uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg', 'Cà phê đậm, thêm sữa 5', 15, 1, 'drink', '2025-07-22 07:19:33', '2025-07-22 07:19:33'),
(10, 'Cà phê sữa đặc biệt 1', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Vị cà phê sữa đặc biệt thơm ngon', 25, 1, 'food', '2025-07-25 09:00:00', '2025-07-25 09:00:00'),
(11, 'Cà phê đá lạnh 2', 'uploads/food/7e9c2054-187a-4f63-9802-26353f4d483a_caphesua.jpg', 'Cà phê đá lạnh truyền thống', 20, 1, 'drink', '2025-07-25 09:01:00', '2025-07-25 09:01:00'),
(12, 'Cà phê sữa truyền thống 3', 'uploads/food/7ddeffb8-30c8-419f-931f-1be2e11039ec_caphesua.jpg', 'Cà phê sữa vị truyền thống', 22, 1, 'food', '2025-07-25 09:02:00', '2025-07-25 09:02:00'),
(13, 'Cà phê đen đặc 4', 'uploads/drink/87c2e5bb-93e5-4a2e-a805-9e10b9db9a41_caphesua.jpg', 'Cà phê đen đậm đặc', 18, 1, 'drink', '2025-07-25 09:03:00', '2025-07-25 09:03:00'),
(14, 'Cà phê sữa đá 5', 'uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg', 'Cà phê sữa đá mát lạnh', 24, 1, 'drink', '2025-07-25 09:04:00', '2025-07-25 09:04:00'),
(15, 'Cà phê mạnh 6', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Cà phê vị mạnh dành cho người sành', 30, 1, 'food', '2025-07-25 09:05:00', '2025-07-25 09:05:00'),
(16, 'Cà phê sữa thơm 7', 'uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg', 'Thơm béo, đậm đà', 26, 1, 'food', '2025-07-25 09:06:00', '2025-07-25 09:06:00'),
(17, 'Cà phê vị caramel 8', 'uploads/food/f0b37752-cb7a-440d-8c0f-dd82f8d28379_caphesua.jpg', 'Cà phê sữa với hương caramel ngọt nhẹ', 28, 1, 'food', '2025-07-25 09:07:00', '2025-07-25 09:07:00'),
(18, 'Cà phê mocha 9', 'uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg', 'Cà phê kết hợp với socola', 32, 1, 'drink', '2025-07-25 09:08:00', '2025-07-25 09:08:00'),
(19, 'Cà phê food đặc biệt 1', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Mô tả sản phẩm food 1', 26, 1, 'food', '2025-07-25 09:10:00', '2025-07-25 09:10:00'),
(20, 'Cà phê food đặc biệt 2', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Mô tả sản phẩm food 2', 20, 1, 'food', '2025-07-25 09:11:00', '2025-07-25 09:11:00'),
(21, 'Cà phê food đặc biệt 3', 'uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg', 'Mô tả sản phẩm food 3', 30, 1, 'food', '2025-07-25 09:12:00', '2025-07-25 09:12:00'),
(22, 'Cà phê food đặc biệt 4', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm food 4', 20, 1, 'food', '2025-07-25 09:13:00', '2025-07-25 09:13:00'),
(23, 'Cà phê food đặc biệt 5', 'uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg', 'Mô tả sản phẩm food 5', 22, 1, 'food', '2025-07-25 09:14:00', '2025-07-25 09:14:00'),
(24, 'Cà phê food đặc biệt 6', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Mô tả sản phẩm food 6', 22, 1, 'food', '2025-07-25 09:15:00', '2025-07-25 09:15:00'),
(25, 'Cà phê food đặc biệt 7', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Mô tả sản phẩm food 7', 18, 1, 'food', '2025-07-25 09:16:00', '2025-07-25 09:16:00'),
(26, 'Cà phê food đặc biệt 8', 'uploads/food/7ddeffb8-30c8-419f-931f-1be2e11039ec_caphesua.jpg', 'Mô tả sản phẩm food 8', 32, 1, 'food', '2025-07-25 09:17:00', '2025-07-25 09:17:00'),
(27, 'Cà phê food đặc biệt 9', 'uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg', 'Mô tả sản phẩm food 9', 18, 1, 'food', '2025-07-25 09:18:00', '2025-07-25 09:18:00'),
(28, 'Cà phê food đặc biệt 10', 'uploads/food/f0b37752-cb7a-440d-8c0f-dd82f8d28379_caphesua.jpg', 'Mô tả sản phẩm food 10', 20, 1, 'food', '2025-07-25 09:19:00', '2025-07-25 09:19:00'),
(29, 'Cà phê food đặc biệt 11', 'uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg', 'Mô tả sản phẩm food 11', 26, 1, 'food', '2025-07-25 09:20:00', '2025-07-25 09:20:00'),
(30, 'Cà phê food đặc biệt 12', 'uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg', 'Mô tả sản phẩm food 12', 28, 1, 'food', '2025-07-25 09:21:00', '2025-07-25 09:21:00'),
(31, 'Cà phê food đặc biệt 13', 'uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg', 'Mô tả sản phẩm food 13', 18, 1, 'food', '2025-07-25 09:22:00', '2025-07-25 09:22:00'),
(32, 'Cà phê food đặc biệt 14', 'uploads/food/f0b37752-cb7a-440d-8c0f-dd82f8d28379_caphesua.jpg', 'Mô tả sản phẩm food 14', 28, 1, 'food', '2025-07-25 09:23:00', '2025-07-25 09:23:00'),
(33, 'Cà phê food đặc biệt 15', 'uploads/food/f0b37752-cb7a-440d-8c0f-dd82f8d28379_caphesua.jpg', 'Mô tả sản phẩm food 15', 20, 1, 'food', '2025-07-25 09:24:00', '2025-07-25 09:24:00'),
(34, 'Cà phê food đặc biệt 16', 'uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg', 'Mô tả sản phẩm food 16', 18, 1, 'food', '2025-07-25 09:25:00', '2025-07-25 09:25:00'),
(35, 'Cà phê food đặc biệt 17', 'uploads/food/f0b37752-cb7a-440d-8c0f-dd82f8d28379_caphesua.jpg', 'Mô tả sản phẩm food 17', 26, 1, 'food', '2025-07-25 09:26:00', '2025-07-25 09:26:00'),
(36, 'Cà phê food đặc biệt 18', 'uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg', 'Mô tả sản phẩm food 18', 24, 1, 'food', '2025-07-25 09:27:00', '2025-07-25 09:27:00'),
(37, 'Cà phê food đặc biệt 19', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm food 19', 30, 1, 'food', '2025-07-25 09:28:00', '2025-07-25 09:28:00'),
(38, 'Cà phê food đặc biệt 20', 'uploads/drink/87c2e5bb-93e5-4a2e-a805-9e10b9db9a41_caphesua.jpg', 'Mô tả sản phẩm food 20', 32, 1, 'food', '2025-07-25 09:29:00', '2025-07-25 09:29:00'),
(39, 'Cà phê food đặc biệt 21', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm food 21', 20, 1, 'food', '2025-07-25 09:30:00', '2025-07-25 09:30:00'),
(40, 'Cà phê food đặc biệt 22', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm food 22', 20, 1, 'food', '2025-07-25 09:31:00', '2025-07-25 09:31:00'),
(41, 'Cà phê food đặc biệt 23', 'uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg', 'Mô tả sản phẩm food 23', 22, 1, 'food', '2025-07-25 09:32:00', '2025-07-25 09:32:00'),
(42, 'Cà phê food đặc biệt 24', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm food 24', 32, 1, 'food', '2025-07-25 09:33:00', '2025-07-25 09:33:00'),
(43, 'Cà phê food đặc biệt 25', 'uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg', 'Mô tả sản phẩm food 25', 24, 1, 'food', '2025-07-25 09:34:00', '2025-07-25 09:34:00'),
(44, 'Cà phê drink đặc biệt 26', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm drink 26', 22, 1, 'drink', '2025-07-25 09:35:00', '2025-07-25 09:35:00'),
(45, 'Cà phê drink đặc biệt 27', 'uploads/food/b8c941ca-a0c7-47fd-b58b-2a565626b7b5_caphesua.jpg', 'Mô tả sản phẩm drink 27', 18, 1, 'drink', '2025-07-25 09:36:00', '2025-07-25 09:36:00'),
(46, 'Cà phê drink đặc biệt 28', 'uploads/drink/f32c0947-5379-4581-8b3c-35211698c4b8_caphesua.jpg', 'Mô tả sản phẩm drink 28', 18, 1, 'drink', '2025-07-25 09:37:00', '2025-07-25 09:37:00'),
(47, 'Cà phê drink đặc biệt 29', 'uploads/drink/87c2e5bb-93e5-4a2e-a805-9e10b9db9a41_caphesua.jpg', 'Mô tả sản phẩm drink 29', 22, 1, 'drink', '2025-07-25 09:38:00', '2025-07-25 09:38:00'),
(48, 'Cà phê drink đặc biệt 30', 'uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg', 'Mô tả sản phẩm drink 30', 28, 1, 'drink', '2025-07-25 09:39:00', '2025-07-25 09:39:00')
