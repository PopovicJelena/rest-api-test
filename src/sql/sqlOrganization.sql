-- CREATE DATABASE IF NOT EXISTS restapitest;
-- use restapitest;

CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(64) NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    role ENUM('basic', 'admin') DEFAULT 'basic',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS task (
    id VARCHAR(64) NOT NULL,
    body TEXT NOT NULL,
    created_by VARCHAR(64) NOT NULL,
    created_at INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (created_by) REFERENCES user(id) ON DELETE CASCADE
);
