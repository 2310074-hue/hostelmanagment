-- ============================================================================
-- HOSTEL COMPLAINT MANAGEMENT SYSTEM (HCMS) - FULL DATABASE DUMP
-- Includes Schema Definition + Seed Records
-- ============================================================================

CREATE DATABASE IF NOT EXISTS hcms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hcms_db;

-- Drop tables in reverse order of dependencies if recreating
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS mess_contractor_actions;
DROP TABLE IF EXISTS mess_reviews;
DROP TABLE IF EXISTS mess_menus;
DROP TABLE IF EXISTS complaint_messages;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS students;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Table: students
-- ----------------------------------------------------------------------------
CREATE TABLE students (
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
CREATE TABLE admins (
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
CREATE TABLE technicians (
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
CREATE TABLE complaints (
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
CREATE TABLE complaint_messages (
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
CREATE TABLE mess_menus (
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
CREATE TABLE mess_reviews (
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
CREATE TABLE mess_contractor_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_type VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- INSERT SEED DATA
-- ============================================================================

INSERT INTO students (id, student_id, full_name, email, password_hash, mobile, hostel_name, room_number)
VALUES 
(1, 'STU1001', 'Rohan Deshmukh', 'rohan@example.com', 'password123', '9876543210', 'Ganga Hostel', 'A-101'),
(2, 'STU1002', 'Ananya Sharma', 'ananya@example.com', 'password123', '9876501234', 'Yamuna Hostel', 'B-204');

INSERT INTO admins (id, full_name, email, password_hash, status)
VALUES 
(1, 'Admin User', 'admin@hostel.com', 'admin123', 'Active');

INSERT INTO technicians (id, name, role, phone, rating, jobs_completed, avatar_url, specialty)
VALUES
('TECH-101', 'Rameshwar Sharma', 'Chief Electrician', '+91 98765-43210', 4.9, 142, 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80', 'Fans, Wiring & MCBs'),
('TECH-102', 'Mukesh Kumar', 'Master Plumber', '+91 98765-11223', 4.8, 98, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 'Pipe Leaks, Taps & Flush'),
('TECH-103', 'Imran Khan', 'Network Engineer', '+91 98765-77889', 4.7, 76, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', 'Wi-Fi APs, LAN & Switches'),
('TECH-104', 'Suresh Carpenter', 'Furniture Specialist', '+91 98765-99001', 4.8, 115, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', 'Door Locks, Almirah & Beds');

INSERT INTO complaints (id, student_id, title, category, description, hostel_name, room_number, priority, status, tracker_stage, technician_id, resolution_otp, otp_verified, admin_response, preferred_visit_time, key_status, call_before_entry, entry_notes)
VALUES
(101, 1, 'Fan not working', 'Electricity', 'The ceiling fan in room A-101 has stopped working since two days. Making sparking noise.', 'Ganga Hostel', 'A-101', 'High', 'In Progress', 'IN_PROGRESS', 'TECH-101', '4829', FALSE, 'Electrician has been assigned with new capacitor.', 'After 4:00 PM', 'Roommate inside', TRUE, 'Please knock gently, online lecture ongoing before 4 PM.'),
(102, 1, 'Water leakage in bathroom', 'Water', 'There is continuous water leakage from the bathroom pipe.', 'Ganga Hostel', 'A-101', 'Medium', 'In Progress', 'IN_TRANSIT', 'TECH-102', '7315', FALSE, 'Plumber Mukesh dispatched.', 'Morning 10 AM - 12 PM', 'I will be present', FALSE, 'Leakage is near washbasin.'),
(103, 2, 'Wi-Fi not working in room', 'Wi-Fi', 'Wi-Fi signal is extremely weak in room B-204.', 'Yamuna Hostel', 'B-204', 'Low', 'Resolved', 'RESOLVED', 'TECH-103', '9042', TRUE, 'Router and AP replaced. Verified with Student OTP.', 'Anytime', 'Key at hostel reception', TRUE, ''),
(104, 2, 'Mess food quality complaint', 'Food', 'Food served yesterday was not properly cooked.', 'Yamuna Hostel', 'B-204', 'Medium', 'Rejected', 'SUBMITTED', NULL, '1198', FALSE, 'Kitchen staff investigated - please submit daily meal rating via Mess Matrix tab.', 'Anytime', 'I will be present', FALSE, '');

INSERT INTO complaint_messages (complaint_id, sender_role, sender_name, message_text, is_voice_note, audio_duration)
VALUES
(101, 'student', 'Rohan Deshmukh', 'Hello Bhaiya, fan is sparking. Please visit in the evening.', FALSE, '0:00'),
(101, 'admin', 'Rameshwar (Electrician)', 'Hello Rohan, I have received the ticket. Will arrive by 4:30 PM.', FALSE, '0:00'),
(101, 'admin', 'Rameshwar (Electrician)', 'Bhaiya spare parts collect kar liye hain store se. 10 min me aapke room pe aa raha hu.', TRUE, '0:12');

INSERT INTO mess_menus (day_of_week, meal_type, menu_items, estimated_calories)
VALUES
('Monday', 'breakfast', 'Aloo Paratha, Curd, Pickle, Boiled Eggs / Banana, Tea / Coffee', '450 kcal'),
('Monday', 'lunch', 'Rajma Masala, Steamed Basmati Rice, Mix Veg, Phulka (Roti), Boondi Raita, Salad', '680 kcal'),
('Monday', 'snacks', 'Samosa / Poha, Mint Chutney, Masala Chai', '280 kcal'),
('Monday', 'dinner', 'Paneer Butter Masala, Yellow Dal Tadka, Jeera Rice, Tandoori Roti, Gulab Jamun', '720 kcal'),
('Tuesday', 'breakfast', 'Idli, Medu Vada, Sambar, Coconut Chutney, Tea / Coffee', '420 kcal'),
('Tuesday', 'lunch', 'Kadhi Pakoda, Jeera Rice, Aloo Gobhi Dry, Chapati, Papad, Green Salad', '640 kcal'),
('Tuesday', 'snacks', 'Veg Sandwich, Green Tea / Filter Coffee', '250 kcal'),
('Tuesday', 'dinner', 'Egg Curry / Malai Kofta, Dal Makhani, Steamed Rice, Butter Naan, Fruit Custard', '750 kcal'),
('Wednesday', 'breakfast', 'Poori Bhaji (Aloo Curry), Sooji Halwa, Sprouts Salad, Tea', '520 kcal'),
('Wednesday', 'lunch', 'Chole Bhature / Rice, Dal Fry, Seasonal Veg, Curd, Pickle', '710 kcal'),
('Wednesday', 'snacks', 'Bread Pakoda, Tomato Sauce, Ginger Tea', '310 kcal'),
('Wednesday', 'dinner', 'Chicken Curry / Shahi Paneer, Dal Tadka, Peas Pulao, Chapati, Ice Cream', '780 kcal'),
('Thursday', 'breakfast', 'Poha with Roasted Peanuts, Sev, Boiled Corn, Tea / Milk', '380 kcal'),
('Thursday', 'lunch', 'Dal Palak, Baingan Bharta, Steamed Rice, Phulka, Butter Milk, Onion Salad', '600 kcal'),
('Thursday', 'snacks', 'Pav Bhaji (2 pcs), Lemonade / Tea', '340 kcal'),
('Thursday', 'dinner', 'Mushroom Masala / Mix Veg, Dal Fry, Jeera Rice, Roti, Kheer', '690 kcal'),
('Friday', 'breakfast', 'Masala Dosa, Tomato Chutney, Sambar, Sweet Kesari Bath, Coffee', '460 kcal'),
('Friday', 'lunch', 'Veg Biryani / Dum Chicken Biryani, Mirchi Ka Salan, Veg Raita, Gulab Jamun', '790 kcal'),
('Friday', 'snacks', 'Veg Cutlet, Masala Chai', '270 kcal'),
('Friday', 'dinner', 'Dum Aloo Kashmiri, Dal Makhani, Steamed Rice, Butter Roti, Rasgulla', '730 kcal'),
('Saturday', 'breakfast', 'Stuffed Gobhi/Paneer Paratha, Butter, Pickle, Dahi, Tea', '490 kcal'),
('Saturday', 'lunch', 'Sambhar Rice, Poriyal, Rasam, Papad, Curd Rice, Payasam', '630 kcal'),
('Saturday', 'snacks', 'Pasta / Maggi with Veggies, Cold Coffee', '320 kcal'),
('Saturday', 'dinner', 'Matar Paneer, Chana Dal Fry, Pulao, Missi Roti, Moong Dal Halwa', '760 kcal'),
('Sunday', 'breakfast', 'Chole Kulche, Sweet Lassi, Fresh Fruits, Tea', '540 kcal'),
('Sunday', 'lunch', 'Special Sunday Feast: Paneer Lababdar, Dal Bukhara, Fried Rice, Naan, Jalebi', '820 kcal'),
('Sunday', 'snacks', 'Bhel Puri / Sev Puri, Masala Tea', '230 kcal'),
('Sunday', 'dinner', 'Light Khichdi / Kadhi Chawal, Aloo Bhaja, Roasted Papad, Ice Cream', '580 kcal');

INSERT INTO mess_reviews (student_id, hostel_name, meal_type, meal_name, review_date, taste_rating, hygiene_rating, freshness_rating, portions_rating, overall_score, issue_tags, comment, contractor_flagged)
VALUES
(1, 'Ganga Hostel', 'lunch', 'Lunch (Rajma Rice)', CURDATE(), 4, 5, 4, 5, 4.50, '[]', 'Rajma was very flavorful today and spoons were properly sanitized!', FALSE),
(2, 'Yamuna Hostel', 'lunch', 'Lunch (Rajma Rice)', CURDATE(), 2, 2, 2, 3, 2.25, '["Stale / Cold Food", "Unhygienic Utensils / Spoons"]', 'Chapatis were cold and dry. Please check dishwashing unit.', TRUE),
(1, 'Ganga Hostel', 'breakfast', 'Breakfast (Aloo Paratha)', CURDATE(), 5, 4, 5, 4, 4.50, '[]', 'Hot parathas served with fresh curd. Really good breakfast.', FALSE);

INSERT INTO mess_contractor_actions (admin_name, title, description, action_type)
VALUES
('Chief Warden Office', 'Utensil Sanitation Audit Scheduled', 'Surprise inspection ordered for Yamuna Hostel kitchen dishwashing unit following student flags.', 'Notice Issued to Contractor');
