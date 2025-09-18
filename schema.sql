-- Zenith Project Management Tool - Database Schema
-- Database: MySQL

-- Users table to store user information and credentials.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table to define separate workspaces.
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `project_key` VARCHAR(10) NOT NULL UNIQUE,
  `description` TEXT,
  `owner_id` INT NOT NULL,
  `is_archived` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
);

-- Junction table to manage user membership in projects.
CREATE TABLE `project_members` (
  `project_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Custom statuses for each project's Kanban board.
CREATE TABLE `project_statuses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `display_order` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(`project_id`, `name`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);

-- Labels (tags) for categorizing work items, specific to each project.
CREATE TABLE `labels` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `color` VARCHAR(7) NOT NULL, -- Hex color code e.g., '#4287f5'
    UNIQUE(`project_id`, `name`),
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
);

-- The core table for all work items (tasks, stories, bugs).
CREATE TABLE `work_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item_key` INT NOT NULL, -- Sequential ID within a project, e.g., 123 in "ZEN-123"
  `project_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `type` ENUM('STORY', 'TASK', 'BUG') NOT NULL,
  `status_id` INT NOT NULL,
  `priority` ENUM('HIGHEST', 'HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
  `assignee_id` INT,
  `reporter_id` INT NOT NULL,
  `parent_id` INT, -- For establishing parent-child relationships (WBS)
  `due_date` DATE,
  `estimated_effort` DECIMAL(4, 2), -- e.g., story points or hours
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(`project_id`, `item_key`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`status_id`) REFERENCES `project_statuses`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`parent_id`) REFERENCES `work_items`(`id`) ON DELETE SET NULL
);

-- Junction table for the many-to-many relationship between work_items and labels.
CREATE TABLE `work_item_labels` (
    `work_item_id` INT NOT NULL,
    `label_id` INT NOT NULL,
    PRIMARY KEY (`work_item_id`, `label_id`),
    FOREIGN KEY (`work_item_id`) REFERENCES `work_items`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON DELETE CASCADE
);

-- Comments on work items.
CREATE TABLE `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `content` TEXT NOT NULL,
  `work_item_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`work_item_id`) REFERENCES `work_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Attachments for work items.
CREATE TABLE `attachments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size` INT NOT NULL, -- Size in bytes
  `work_item_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`work_item_id`) REFERENCES `work_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
);

-- Add indexes for performance
CREATE INDEX idx_work_items_assignee ON work_items(assignee_id);
CREATE INDEX idx_work_items_status ON work_items(status_id);
CREATE INDEX idx_work_items_parent ON work_items(parent_id);
