-- =========================================================================
-- SYSTEM NAME: COLLEGE LIBRARY MANAGEMENT SYSTEM (MINOR PROJECT)
-- TARGET DATABASE ENGINE: MySQL v5.7+ / v8.0+
-- COMPATIBLE RUNTIMES: XAMPP, WAMP, LAMP OR ANY STANDARD PHP/MYSQL STACK
-- =========================================================================

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `issued_books`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `admin_users`;
SET FOREIGN_KEY_CHECKS=1;

-- 1. ADMIN USER LOGINS
-- Password hash generated using PHP password_hash('admin123', PASSWORD_DEFAULT)
CREATE TABLE `admin_users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `photo_url` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Prof. S. R. Prasad', 'admin@library.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');


-- 2. BOOK CATEGORIES
CREATE TABLE `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Computer Science', 'Programming, algorithms, databases, and core software engineering concepts.'),
(2, 'Information Technology', 'Network systems, cybersecurity, cloud, and infrastructure administration.'),
(3, 'Mathematics', 'Discrete mathematics, linear algebra, calculus, and computational theories.'),
(4, 'Business Management', 'Business administration, digital economics, and leadership.');


-- 3. BOOKS INVENTORY
CREATE TABLE `books` (
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `category_id` INT(11) DEFAULT NULL,
  `publisher` VARCHAR(150) NOT NULL,
  `isbn` VARCHAR(50) NOT NULL UNIQUE,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `available_copies` INT(11) NOT NULL DEFAULT 1,
  `shelf_number` VARCHAR(50) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Available',
  PRIMARY KEY (`id`),
  KEY `fk_books_category_idx` (`category_id`),
  CONSTRAINT `fk_books_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `books` (`id`, `name`, `author`, `category_id`, `publisher`, `isbn`, `quantity`, `available_copies`, `shelf_number`, `status`) VALUES
('B001', 'Introduction to Algorithms', 'Thomas H. Cormen', 1, 'MIT Press', '978-0262033848', 5, 3, 'A-12', 'Available'),
('B002', 'Database System Concepts', 'Abraham Silberschatz', 1, 'McGraw Hill', '978-0073523323', 3, 2, 'A-15', 'Available'),
('B003', 'Computer Networks', 'Andrew S. Tanenbaum', 2, 'Pearson', '978-0132126953', 4, 4, 'B-04', 'Available'),
('B004', 'Discrete Mathematics and its Applications', 'Kenneth H. Rosen', 3, 'McGraw Hill', '978-0073383095', 2, 1, 'C-02', 'Available'),
('B005', 'Clean Code', 'Robert C. Martin', 1, 'Prentice Hall', '978-0132350884', 6, 5, 'A-01', 'Available');


-- 4. REGISTERED STUDENTS
CREATE TABLE `students` (
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `enrollment_no` VARCHAR(50) NOT NULL UNIQUE,
  `course` VARCHAR(50) NOT NULL,
  `semester` VARCHAR(10) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `students` (`id`, `name`, `enrollment_no`, `course`, `semester`, `email`, `phone`, `address`) VALUES
('S101', 'Aarav Sharma', 'EN202401', 'BCA', 'III', 'aarav.sharma@college.edu', '9876543210', 'Sector 62, Noida, UP'),
('S102', 'Ananya Verma', 'EN202402', 'MCA', 'I', 'ananya.verma@college.edu', '9812345678', 'Rohini Sector 9, New Delhi'),
('S103', 'Kabir Singh', 'EN202403', 'B.Tech CSE', 'V', 'kabir.singh@college.edu', '9765432109', 'Salt Lake, Kolkata, WB'),
('S104', 'Riya Patel', 'EN202404', 'BCA', 'V', 'riya.patel@college.edu', '9543210987', 'S.G. Highway, Ahmedabad, Gujarat');


-- 5. ISSUED BOOK TRANSACTIONS
CREATE TABLE `issued_books` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` VARCHAR(20) NOT NULL,
  `book_id` VARCHAR(20) NOT NULL,
  `issue_date` DATE NOT NULL,
  `return_date` DATE NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Issued',
  PRIMARY KEY (`id`),
  KEY `fk_issued_student_idx` (`student_id`),
  KEY `fk_issued_book_idx` (`book_id`),
  CONSTRAINT `fk_issued_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_issued_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `issued_books` (`id`, `student_id`, `book_id`, `issue_date`, `return_date`, `status`) VALUES
(1, 'S101', 'B001', '2026-06-25', '2026-07-15', 'Issued'),
(2, 'S102', 'B002', '2026-06-30', '2026-07-10', 'Issued'),
(3, 'S103', 'B001', '2026-06-15', '2026-06-30', 'Returned'),
(4, 'S104', 'B004', '2026-07-01', '2026-07-16', 'Issued');
