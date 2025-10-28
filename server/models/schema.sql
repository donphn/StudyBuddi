-- Create database
CREATE DATABASE IF NOT EXISTS studybuddi;
USE studybuddi;

-- Example table: items
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Example table: users (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Example table: study_sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  subject VARCHAR(100) NOT NULL,
  duration_minutes INT,
  notes TEXT,
  session_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shared counter table for real-time counter feature
CREATE TABLE IF NOT EXISTS shared_counter1 (
  id INT PRIMARY KEY DEFAULT 1,
  count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shared_counter2 (
  id INT PRIMARY KEY DEFAULT 1,
  count INT DEFAULT 0
);

-- Messages table for chat feature
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data for testing
INSERT INTO items (name, description) VALUES
  ('Sample Item 1', 'This is a sample item for testing'),
  ('Sample Item 2', 'Another sample item'),
  ('Sample Item 3', 'Yet another sample item');

-- Initialize shared counter
INSERT INTO shared_counter1 (id, count) VALUES (1, 0) ON DUPLICATE KEY UPDATE id=id;
INSERT INTO shared_counter2 (id, count) VALUES (1, 0) ON DUPLICATE KEY UPDATE id=id;
