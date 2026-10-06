-- ============================================================================
-- HOSTEL COMPLAINT MANAGEMENT SYSTEM (HCMS) - SEED DATA SCRIPT
-- ============================================================================

USE hcms_db;

-- 1. Insert Initial Students
INSERT INTO students (id, student_id, full_name, email, password_hash, mobile, hostel_name, room_number)
VALUES 
(1, 'STU1001', 'Rohan Deshmukh', 'rohan@example.com', 'password123', '9876543210', 'Ganga Hostel', 'A-101'),
(2, 'STU1002', 'Ananya Sharma', 'ananya@example.com', 'password123', '9876501234', 'Yamuna Hostel', 'B-204')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Insert Initial Admins
INSERT INTO admins (id, full_name, email, password_hash, status)
VALUES 
(1, 'Admin User', 'admin@hostel.com', 'admin123', 'Active')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 3. Insert Technicians
INSERT INTO technicians (id, name, role, phone, rating, jobs_completed, avatar_url, specialty)
VALUES
('TECH-101', 'Rameshwar Sharma', 'Chief Electrician', '+91 98765-43210', 4.9, 142, 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80', 'Fans, Wiring & MCBs'),
('TECH-102', 'Mukesh Kumar', 'Master Plumber', '+91 98765-11223', 4.8, 98, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 'Pipe Leaks, Taps & Flush'),
('TECH-103', 'Imran Khan', 'Network Engineer', '+91 98765-77889', 4.7, 76, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', 'Wi-Fi APs, LAN & Switches'),
('TECH-104', 'Suresh Carpenter', 'Furniture Specialist', '+91 98765-99001', 4.8, 115, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', 'Door Locks, Almirah & Beds')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Complaints
INSERT INTO complaints (id, student_id, title, category, description, hostel_name, room_number, priority, status, tracker_stage, technician_id, resolution_otp, otp_verified, admin_response, preferred_visit_time, key_status, call_before_entry, entry_notes)
VALUES
(101, 1, 'Fan not working', 'Electricity', 'The ceiling fan in room A-101 has stopped working since two days. Making sparking noise.', 'Ganga Hostel', 'A-101', 'High', 'In Progress', 'IN_PROGRESS', 'TECH-101', '4829', FALSE, 'Electrician has been assigned with new capacitor.', 'After 4:00 PM', 'Roommate inside', TRUE, 'Please knock gently, online lecture ongoing before 4 PM.'),
(102, 1, 'Water leakage in bathroom', 'Water', 'There is continuous water leakage from the bathroom pipe.', 'Ganga Hostel', 'A-101', 'Medium', 'In Progress', 'IN_TRANSIT', 'TECH-102', '7315', FALSE, 'Plumber Mukesh dispatched.', 'Morning 10 AM - 12 PM', 'I will be present', FALSE, 'Leakage is near washbasin.'),
(103, 2, 'Wi-Fi not working in room', 'Wi-Fi', 'Wi-Fi signal is extremely weak in room B-204.', 'Yamuna Hostel', 'B-204', 'Low', 'Resolved', 'RESOLVED', 'TECH-103', '9042', TRUE, 'Router and AP replaced. Verified with Student OTP.', 'Anytime', 'Key at hostel reception', TRUE, ''),
(104, 2, 'Mess food quality complaint', 'Food', 'Food served yesterday was not properly cooked.', 'Yamuna Hostel', 'B-204', 'Medium', 'Rejected', 'SUBMITTED', NULL, '1198', FALSE, 'Kitchen staff investigated - please submit daily meal rating via Mess Matrix tab.', 'Anytime', 'I will be present', FALSE, '')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 5. Insert Complaint Messages (Chat & Voice Notes)
INSERT INTO complaint_messages (complaint_id, sender_role, sender_name, message_text, is_voice_note, audio_duration)
VALUES
(101, 'student', 'Rohan Deshmukh', 'Hello Bhaiya, fan is sparking. Please visit in the evening.', FALSE, '0:00'),
(101, 'admin', 'Rameshwar (Electrician)', 'Hello Rohan, I have received the ticket. Will arrive by 4:30 PM.', FALSE, '0:00'),
(101, 'admin', 'Rameshwar (Electrician)', 'Bhaiya spare parts collect kar liye hain store se. 10 min me aapke room pe aa raha hu.', TRUE, '0:12');

-- 6. Insert 7-Day Cyclic Mess Menus
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
('Sunday', 'dinner', 'Light Khichdi / Kadhi Chawal, Aloo Bhaja, Roasted Papad, Ice Cream', '580 kcal')
ON DUPLICATE KEY UPDATE menu_items=VALUES(menu_items);

-- 7. Insert Mess Reviews & Matrix
INSERT INTO mess_reviews (student_id, hostel_name, meal_type, meal_name, review_date, taste_rating, hygiene_rating, freshness_rating, portions_rating, overall_score, issue_tags, comment, contractor_flagged)
VALUES
(1, 'Ganga Hostel', 'lunch', 'Lunch (Rajma Rice)', CURDATE(), 4, 5, 4, 5, 4.50, '[]', 'Rajma was very flavorful today and spoons were properly sanitized!', FALSE),
(2, 'Yamuna Hostel', 'lunch', 'Lunch (Rajma Rice)', CURDATE(), 2, 2, 2, 3, 2.25, '["Stale / Cold Food", "Unhygienic Utensils / Spoons"]', 'Chapatis were cold and dry. Please check dishwashing unit.', TRUE),
(1, 'Ganga Hostel', 'breakfast', 'Breakfast (Aloo Paratha)', CURDATE(), 5, 4, 5, 4, 4.50, '[]', 'Hot parathas served with fresh curd. Really good breakfast.', FALSE);

-- 8. Insert Mess Contractor Enforcement Actions
INSERT INTO mess_contractor_actions (admin_name, title, description, action_type)
VALUES
('Chief Warden Office', 'Utensil Sanitation Audit Scheduled', 'Surprise inspection ordered for Yamuna Hostel kitchen dishwashing unit following student flags.', 'Notice Issued to Contractor');
