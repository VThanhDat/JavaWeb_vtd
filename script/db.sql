-- Create database and use charset to support Vietnamese
CREATE DATABASE IF NOT EXISTS appfood
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE appfood;

-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: appfood
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','0192023a7bbd73250516f069df18b500','2025-07-23 14:47:04','2025-07-23 14:47:04');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (30,'Nguyễn Văn A','0393456244','Ha Noi','Ba Dinh Ward','Waseco Building 10 Pho Quang','sda','2025-07-29 14:21:42','2025-07-29 14:21:42'),(31,'Nguyễn Văn A','0393456244','Ha Noi','Dong Da Ward','Waseco Building 10 Pho Quang','das','2025-07-29 14:22:26','2025-07-29 14:22:26'),(32,'Nguyễn Văn A','0393456244','Can Tho','Binh Thuy Ward','Waseco Building 10 Pho Quang','asd','2025-07-29 14:22:56','2025-07-29 14:22:56'),(33,'Nguyễn Văn A','0393456244','Ha Noi','Ba Dinh Ward','Waseco Building 10 Pho Quang','das','2025-07-29 14:43:41','2025-07-29 14:43:41'),(34,'Nguyễn Văn A','0393456244','Ha Noi','Ba Dinh Ward','Waseco Building 10 Pho Quang','dsa','2025-07-29 15:02:15','2025-07-29 15:02:15'),(35,'Nguyễn Văn A','0393456244','Ha Noi','Ba Dinh Ward','Waseco Building 10 Pho Quang','asd','2025-07-29 15:54:00','2025-07-29 15:54:00'),(36,'Nguyễn Văn A','0393456244','Ha Noi','Ba Dinh Ward','Waseco Building 10 Pho Quang','das','2025-07-29 15:54:17','2025-07-29 15:54:17'),(37,'Nguyễn Văn A','0393456244','Ho Chi Minh City','Ward 2','Waseco Building 10 Pho Quang','das','2025-07-29 15:54:33','2025-07-29 15:54:33'),(38,'Nguyễn Văn A','0393456244','Ha Noi','Ba Dinh Ward','Waseco Building 10 Pho Quang','ads','2025-07-29 15:54:56','2025-07-29 15:54:56'),(39,'Nguyễn Văn A','0393456244','Da Nang','Ngu Hanh Son Ward','Waseco Building 10 Pho Quang','das','2025-07-29 15:55:22','2025-07-29 15:55:22'),(40,'Nguyễn Văn A','0393456244','An Giang','Chau Doc Ward','Waseco Building 10 Pho Quang','das','2025-07-29 15:55:39','2025-07-29 15:55:39');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` double NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0 = inactive, 1 = active',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Enum values: FOOD, DRINK',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Cà phê sữa đậm 9','uploads/food/c873e8d3-645f-49c2-bdf9-617d4a92a7ac_1.webp','Cà phê đậm, thêm sữa 4',60000,0,'food','2025-07-21 10:17:34','2025-07-28 09:39:08'),(2,'Cà phê sữa đậm 5','uploads/food/7e9c2054-187a-4f63-9802-26353f4d483a_caphesua.jpg','Cà phê đậm, thêm sữa 5',20000,1,'food','2025-07-21 11:27:03','2025-07-29 13:36:23'),(3,'Cà đậm 5','uploads/food/485fcd9f-69b2-43c2-b1ba-609e0999195f_2.jpg','Cà phê đậm, thêm sữa 5',30000,1,'food','2025-07-21 11:27:11','2025-07-28 09:39:20'),(4,'Cà đậm 5','uploads/drink/379ba296-6269-46be-a145-6250be3f2677_2.jpg','Cà phê đậm, thêm sữa 5',22000,1,'drink','2025-07-21 21:16:42','2025-07-28 09:40:33'),(5,'Cà phê 5','uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg','Cà phê đậm, thêm sữa 5',22000,1,'drink','2025-07-21 21:34:29','2025-07-28 09:40:35'),(6,'Cà phê 6','uploads/drink/0850ae50-424a-4532-b01a-89acfde502a5_1.webp','Cà phê đậm, thêm sữa 5',36000,1,'drink','2025-07-22 07:18:02','2025-07-28 09:40:37'),(7,'Cà phê 7','uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg','Cà phê đậm, thêm sữa 5',40000,0,'food','2025-07-22 07:18:17','2025-07-28 10:46:05'),(8,'Cà phê 8','uploads/food/cb0a7d41-580e-4311-af57-e50c3d13ad9e_3.jpg','Cà phê đậm, thêm sữa 5',40000,1,'food','2025-07-22 07:19:22','2025-07-28 09:39:39'),(9,'Cà phê 9','uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg','Cà phê đậm, thêm sữa 5',15000,1,'drink','2025-07-22 07:19:33','2025-07-28 09:40:40'),(10,'Cà phê sữa đặc biệt 1','uploads/food/73ff01af-c29e-4afa-a0b9-b13b8cb6cef4_4.jpg','Vị cà phê sữa đặc biệt thơm ngon',25000,1,'food','2025-07-25 09:00:00','2025-07-28 09:39:49'),(11,'Cà phê đá lạnh 2','uploads/food/7e9c2054-187a-4f63-9802-26353f4d483a_caphesua.jpg','Cà phê đá lạnh truyền thống',20000,1,'drink','2025-07-25 09:01:00','2025-07-28 09:40:55'),(12,'Cà phê sữa truyền thống 3','uploads/food/84c40661-dbf0-4318-aaf1-0e67e8406e75_1.webp','Cà phê sữa vị truyền thống',22000,1,'food','2025-07-25 09:02:00','2025-07-28 09:39:53'),(13,'Cà phê đen đặc 4','uploads/drink/3f23b334-197d-41fb-9935-aeca075da661_3.jpg','Cà phê đen đậm đặc',18000,1,'drink','2025-07-25 09:03:00','2025-07-28 09:41:01'),(14,'Cà phê sữa đá 5','uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg','Cà phê sữa đá mát lạnh',24000,1,'drink','2025-07-25 09:04:00','2025-07-28 09:41:04'),(15,'Cà phê mạnh 6','uploads/food/f8b4ceb1-029e-4f71-9287-4607191275e2_2.jpg','Cà phê vị mạnh dành cho người sành',30000,1,'food','2025-07-25 09:05:00','2025-07-28 09:39:56'),(16,'Cà phê sữa thơm 7','uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg','Thơm béo, đậm đà',26000,1,'food','2025-07-25 09:06:00','2025-07-28 09:40:00'),(17,'Cà phê vị caramel 8','uploads/food/d4552ced-316e-4418-8de1-caa8c0da2f81_3.jpg','Cà phê sữa với hương caramel ngọt nhẹ',28000,1,'food','2025-07-25 09:07:00','2025-07-28 09:40:03'),(18,'Cà phê mocha 9','uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg','Cà phê kết hợp với socola',32000,1,'drink','2025-07-25 09:08:00','2025-07-28 09:41:07'),(19,'Cà phê food đặc biệt 1','uploads/food/dfc2feaf-db7f-4140-9a9a-8a2caa4a88a2_4.jpg','Mô tả sản phẩm food 1',26000,1,'food','2025-07-25 09:10:00','2025-07-28 09:41:55'),(20,'Cà phê food đặc biệt 2','uploads/food/b06a2adc-b27b-493b-8a72-b58b55b19421_1.webp','Mô tả sản phẩm food 2',20000,1,'food','2025-07-25 09:11:00','2025-07-28 09:41:58'),(21,'Cà phê food đặc biệt 3','uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg','Mô tả sản phẩm food 3',30000,1,'food','2025-07-25 09:12:00','2025-07-28 09:42:00'),(22,'Cà phê food đặc biệt 4','uploads/food/71ef3f1f-d6e4-419d-8df7-4ec805a50abb_2.jpg','Mô tả sản phẩm food 4',20000,1,'food','2025-07-25 09:13:00','2025-07-28 09:42:03'),(23,'Cà phê food đặc biệt 5','uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg','Mô tả sản phẩm food 5',22000,1,'food','2025-07-25 09:14:00','2025-07-28 09:42:05'),(24,'Cà phê food đặc biệt 6','uploads/food/825b43f5-5c62-4635-8da5-e26b99eefa27_3.jpg','Mô tả sản phẩm food 6',22000,1,'food','2025-07-25 09:15:00','2025-07-28 09:42:12'),(25,'Cà phê food đặc biệt 7','uploads/food/bfdfa825-3b85-4bbf-8d0f-69235fb5bec1_4.jpg','Mô tả sản phẩm food 7',18000,1,'food','2025-07-25 09:16:00','2025-07-28 09:42:15'),(26,'Cà phê food đặc biệt 8','uploads/food/bbc64feb-caec-4e72-887b-1ad7a9ff711a_1.webp','Mô tả sản phẩm food 8',32000,1,'food','2025-07-25 09:17:00','2025-07-28 09:42:21'),(27,'Cà phê food đặc biệt 9','uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg','Mô tả sản phẩm food 9',18000,1,'food','2025-07-25 09:18:00','2025-07-28 09:42:48'),(28,'Cà phê food đặc biệt 10','uploads/food/687e0972-7b45-4823-8c60-b3ea6f077760_2.jpg','Mô tả sản phẩm food 10',20000,1,'food','2025-07-25 09:19:00','2025-07-28 09:42:51'),(29,'Cà phê food đặc biệt 11','uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg','Mô tả sản phẩm food 11',26000,0,'food','2025-07-25 09:20:00','2025-07-28 10:24:34'),(30,'Cà phê food đặc biệt 12','uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg','Mô tả sản phẩm food 12',28000,1,'food','2025-07-25 09:21:00','2025-07-28 09:42:57'),(31,'Cà phê food đặc biệt 13','uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg','Mô tả sản phẩm food 13',18000,1,'food','2025-07-25 09:22:00','2025-07-28 09:42:59'),(32,'Cà phê food đặc biệt 14','uploads/food/aced70ad-3967-42da-b382-6d0046a7b8d7_3.jpg','Mô tả sản phẩm food 14',28000,1,'food','2025-07-25 09:23:00','2025-07-28 09:43:01'),(33,'Cà phê food đặc biệt 15','uploads/food/24d93ffd-f2bf-4d98-b3d7-53085bb92cdc_4.jpg','Mô tả sản phẩm food 15',20000,1,'food','2025-07-25 09:24:00','2025-07-28 09:43:45'),(34,'Cà phê food đặc biệt 16','uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg','Mô tả sản phẩm food 16',18000,1,'food','2025-07-25 09:25:00','2025-07-28 09:43:47'),(35,'Cà phê food đặc biệt 17','uploads/food/6fa8ecb1-8aec-47a0-ae2f-67029f1e3c43_1.webp','Mô tả sản phẩm food 17',26000,1,'food','2025-07-25 09:26:00','2025-07-28 09:43:50'),(36,'Cà phê food đặc biệt 18','uploads/drink/39942b09-2c45-4fd4-8386-e13293bbdde5_caphesua.jpg','Mô tả sản phẩm food 18',24000,1,'food','2025-07-25 09:27:00','2025-07-28 09:43:52'),(37,'Cà phê food đặc biệt 19','uploads/food/7d5ab41c-b537-49a9-bde3-76121dfb7434_2.jpg','Mô tả sản phẩm food 19',30000,1,'food','2025-07-25 09:28:00','2025-07-28 09:44:17'),(38,'Cà phê food đặc biệt 20','uploads/food/557bb325-c344-4623-9f3a-7073cedbd4b9_3.jpg','Mô tả sản phẩm food 20',32000,1,'food','2025-07-25 09:29:00','2025-07-28 09:44:22'),(39,'Cà phê food đặc biệt 21','uploads/food/720f667f-39d1-434b-9117-12e594b007cf_4.jpg','Mô tả sản phẩm food 21',20000,1,'food','2025-07-25 09:30:00','2025-07-28 09:45:14'),(40,'Cà phê food đặc biệt 22','uploads/food/3094a278-238d-4a26-af8b-596c776c39a8_1.webp','Mô tả sản phẩm food 22',20000,1,'food','2025-07-25 09:31:00','2025-07-28 09:45:17'),(41,'Cà phê food đặc biệt 23','uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg','Mô tả sản phẩm food 23',22000,1,'food','2025-07-25 09:32:00','2025-07-28 09:45:19'),(42,'Cà phê food đặc biệt 24','uploads/food/71235e63-93b4-4967-86ce-74834be68fe0_3.jpg','Mô tả sản phẩm food 24',32000,1,'food','2025-07-25 09:33:00','2025-07-28 09:45:22'),(43,'Cà phê food đặc biệt 25','uploads/drink/98ba059f-1ff6-4520-a5ab-9a416c48b252_caphesua.jpg','Mô tả sản phẩm food 25',24000,1,'food','2025-07-25 09:34:00','2025-07-28 09:45:24'),(44,'Cà phê drink đặc biệt 26','uploads/drink/68bbbfe9-1ca4-4f9d-a0a2-6f9f1898ca4f_4.jpg','Mô tả sản phẩm drink 26',22000,1,'drink','2025-07-25 09:35:00','2025-07-28 09:41:11'),(45,'Cà phê drink đặc biệt 27','uploads/drink/1d6cb444-7b17-4269-9b57-706696c5b1ff_1.webp','Mô tả sản phẩm drink 27',18000,0,'drink','2025-07-25 09:36:00','2025-07-28 10:24:41'),(46,'Cà phê drink đặc biệt 28','uploads/drink/2d76460d-51cd-43ae-b503-a89120828458_2.jpg','Mô tả sản phẩm drink 28',18000,1,'drink','2025-07-25 09:37:00','2025-07-28 09:41:17'),(47,'Cà phê drink đặc biệt 29','uploads/drink/05154033-82e6-4d69-9abd-47208c7c712b_4.jpg','Mô tả sản phẩm drink 29',22000,1,'drink','2025-07-25 09:38:00','2025-07-28 09:41:20'),(48,'Cà phê drink đặc biệt 30','uploads/food/b347c93e-5b9f-4dfb-8e65-1f45b16bd8fb_caphesua.jpg','Mô tả sản phẩm drink 30',28000,1,'drink','2025-07-25 09:39:00','2025-07-28 09:41:22');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `price` double NOT NULL,
  `order_id` bigint NOT NULL,
  `item_id` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (63,2,30000,24,3,'2025-07-29 14:21:42','2025-07-29 14:21:42'),(64,2,25000,24,10,'2025-07-29 14:21:42','2025-07-29 14:21:42'),(65,1,30000,25,15,'2025-07-29 14:22:26','2025-07-29 14:22:26'),(66,1,20000,25,20,'2025-07-29 14:22:26','2025-07-29 14:22:26'),(67,1,26000,26,19,'2025-07-29 14:22:56','2025-07-29 14:22:56'),(68,1,26000,26,16,'2025-07-29 14:22:56','2025-07-29 14:22:56'),(69,1,20000,26,20,'2025-07-29 14:22:56','2025-07-29 14:22:56'),(70,1,22000,27,12,'2025-07-29 14:43:41','2025-07-29 14:43:41'),(71,1,26000,27,16,'2025-07-29 14:43:41','2025-07-29 14:43:41'),(72,1,30000,27,15,'2025-07-29 14:43:41','2025-07-29 14:43:41'),(73,1,26000,28,16,'2025-07-29 15:02:15','2025-07-29 15:02:15'),(74,1,28000,28,17,'2025-07-29 15:02:15','2025-07-29 15:02:15'),(75,1,22000,28,4,'2025-07-29 15:02:15','2025-07-29 15:02:15'),(76,1,15000,28,9,'2025-07-29 15:02:15','2025-07-29 15:02:15'),(77,1,26000,29,16,'2025-07-29 15:54:00','2025-07-29 15:54:00'),(78,1,22000,29,12,'2025-07-29 15:54:00','2025-07-29 15:54:00'),(79,1,30000,29,15,'2025-07-29 15:54:00','2025-07-29 15:54:00'),(80,1,20000,30,2,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(81,2,40000,30,8,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(82,1,22000,30,12,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(83,1,25000,30,10,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(84,1,30000,30,15,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(85,1,30000,30,3,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(86,1,26000,30,16,'2025-07-29 15:54:17','2025-07-29 15:54:17'),(87,1,22000,31,4,'2025-07-29 15:54:33','2025-07-29 15:54:33'),(88,1,36000,31,6,'2025-07-29 15:54:33','2025-07-29 15:54:33'),(89,1,15000,31,9,'2025-07-29 15:54:33','2025-07-29 15:54:33'),(90,1,18000,31,13,'2025-07-29 15:54:33','2025-07-29 15:54:33'),(91,1,24000,31,14,'2025-07-29 15:54:33','2025-07-29 15:54:33'),(92,1,36000,32,6,'2025-07-29 15:54:56','2025-07-29 15:54:56'),(93,1,20000,32,11,'2025-07-29 15:54:56','2025-07-29 15:54:56'),(94,1,24000,32,14,'2025-07-29 15:54:56','2025-07-29 15:54:56'),(95,1,32000,32,18,'2025-07-29 15:54:56','2025-07-29 15:54:56'),(96,1,18000,32,13,'2025-07-29 15:54:56','2025-07-29 15:54:56'),(97,1,26000,33,19,'2025-07-29 15:55:22','2025-07-29 15:55:22'),(98,1,20000,33,20,'2025-07-29 15:55:22','2025-07-29 15:55:22'),(99,1,28000,33,17,'2025-07-29 15:55:22','2025-07-29 15:55:22'),(100,1,26000,33,16,'2025-07-29 15:55:22','2025-07-29 15:55:22'),(101,1,22000,34,4,'2025-07-29 15:55:39','2025-07-29 15:55:39'),(102,1,22000,34,5,'2025-07-29 15:55:39','2025-07-29 15:55:39'),(103,1,36000,34,6,'2025-07-29 15:55:39','2025-07-29 15:55:39'),(104,1,18000,34,13,'2025-07-29 15:55:39','2025-07-29 15:55:39');
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` double NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new' COMMENT 'new, completed, cancelled',
  `customer_id` bigint DEFAULT NULL,
  `shipping_fee` double NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (24,'OD519089',145000,'new',30,35000,'2025-07-29 14:21:42','2025-07-29 14:21:42'),(25,'OD585594',90000,'completed',31,40000,'2025-07-28 14:22:26','2025-07-29 14:31:01'),(26,'OD667868',117000,'shipping',32,45000,'2025-07-29 14:22:56','2025-07-29 14:28:00'),(27,'OD757113',113000,'cancelled',33,35000,'2025-07-23 14:43:41','2025-07-29 17:02:10'),(28,'OD406535',126000,'new',34,35000,'2025-07-24 15:02:15','2025-07-29 17:02:10'),(29,'OD794151',113000,'new',35,35000,'2025-07-25 15:54:00','2025-07-29 17:02:10'),(30,'OD297178',268000,'new',36,35000,'2025-07-26 15:54:17','2025-07-29 17:02:10'),(31,'OD952512',137000,'new',37,22000,'2025-07-27 15:54:33','2025-07-29 17:02:10'),(32,'OD272821',165000,'new',38,35000,'2025-07-28 15:54:56','2025-07-29 17:02:10'),(33,'OD899612',150000,'new',39,50000,'2025-07-22 15:55:22','2025-07-29 17:02:10'),(34,'OD540477',153000,'new',40,55000,'2025-07-29 15:55:39','2025-07-29 15:55:39');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 17:08:05
