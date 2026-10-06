-- ============================================================================
-- HOSTEL COMPLAINT MANAGEMENT SYSTEM (HCMS) - DATABASE SCHEMA
-- Database Engine: MySQL 8.0+ / MariaDB
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS hcms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hcms_db;

-- ----------------------------------------------------------------------------
-- 1. Table: students
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    hostel_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_email (email),
    INDEX idx_student_hostel (hostel_name, room_number)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 2. Table: admins
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_email (email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. Table: technicians
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technicians (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 5.0,
    jobs_completed INT DEFAULT 0,
    avatar_url VARCHAR(500),
    specialty VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. Table: complaints
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category ENUM('Electricity', 'Water', 'Cleaning', 'Food', 'Maintenance', 'Wi-Fi', 'Security', 'Other') NOT NULL,
    description TEXT NOT NULL,
    hostel_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Pending',
    tracker_stage ENUM('SUBMITTED', 'ASSIGNED', 'IN_TRANSIT', 'IN_PROGRESS', 'RESOLVED') DEFAULT 'SUBMITTED',
    technician_id VARCHAR(50) NULL,
    resolution_otp VARCHAR(10) NOT NULL,
    otp_verified BOOLEAN DEFAULT FALSE,
    admin_response TEXT NULL,
    image_url VARCHAR(500) NULL,
    preferred_visit_time VARCHAR(100) DEFAULT 'Anytime',
    key_status VARCHAR(100) DEFAULT 'I will be present',
    call_before_entry BOOLEAN DEFAULT FALSE,
    entry_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL,
    INDEX idx_complaint_status (status),
    INDEX idx_complaint_stage (tracker_stage),
    INDEX idx_complaint_hostel (hostel_name)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. Table: complaint_messages (Private Chat & Voice Notes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    sender_role ENUM('student', 'admin', 'system') NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    message_text TEXT NOT NULL,
    is_voice_note BOOLEAN DEFAULT FALSE,
    audio_duration VARCHAR(20) DEFAULT '0:10',
    audio_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_msg_complaint (complaint_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 6. Table: mess_menus (7-Day Cyclic Menu)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mess_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'snacks', 'dinner') NOT NULL,
    menu_items TEXT NOT NULL,
    estimated_calories VARCHAR(50) DEFAULT '650 kcal',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_day_meal (day_of_week, meal_type)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 7. Table: mess_reviews (Food Quality & Hygiene Live Matrix)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mess_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    hostel_name VARCHAR(100) NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'snacks', 'dinner') NOT NULL,
    meal_name VARCHAR(200) NOT NULL,
    review_date DATE NOT NULL,
    taste_rating TINYINT NOT NULL CHECK (taste_rating BETWEEN 1 AND 5),
    hygiene_rating TINYINT NOT NULL CHECK (hygiene_rating BETWEEN 1 AND 5),
    freshness_rating TINYINT NOT NULL CHECK (freshness_rating BETWEEN 1 AND 5),
    portions_rating TINYINT NOT NULL CHECK (portions_rating BETWEEN 1 AND 5),
    overall_score DECIMAL(3,2) NOT NULL,
    issue_tags JSON NULL,
    comment TEXT NULL,
    image_url VARCHAR(500) NULL,
    contractor_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_mess_date (review_date),
    INDEX idx_mess_hostel (hostel_name),
    INDEX idx_mess_flagged (contractor_flagged)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 8. Table: mess_contractor_actions (Audit & Penalty Notices)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mess_contractor_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_type VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
