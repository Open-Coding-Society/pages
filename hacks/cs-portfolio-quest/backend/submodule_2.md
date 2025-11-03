---
layout: cs-portfolio-lesson
title: "Submodule 2"
description: "Submodule 2 of Backend Development Mini-Quest"
permalink: /cs-portfolio-quest/backend/submodule_2/
parent: "Backend Development"
team: "Encrypters"
submodule: 2
categories: [CSP, Submodule, Backend]
tags: [backend, submodule, encrypters]
author: "Encrypters Team"
date: 2025-10-21
---

# Submodule 2 Databases - Data Persistence & Management

## Welcome to the World of Data Storage! 

Imagine your backend without a database - every time the server restarts, all data disappears! Databases are the long-term memory of your application.

---

## 1. Database Fundamentals

### What is a Database?

A database is an organized collection of data that can be easily:
- **Stored**: Save information permanently
- **Retrieved**: Get information quickly
- **Updated**: Change information
- **Deleted**: Remove information

### Real-World Analogy: Library vs. Pile of Books

**Without Database** (Pile of Books):
```
All books thrown in a room
Want to find "Harry Potter"? → Search through every book
Want all books by J.K. Rowling? → Search through every book again
Want to add a book? → Throw it in the pile
Organization? → None!
```

**With Database** (Organized Library):
```
Books organized by:
- Author (quick lookup)
- Category (find similar books)
- ISBN (unique identifier)
Want "Harry Potter"? → Look up catalog, find shelf A3
Want all J.K. Rowling books? → Check author index
Add a book? → Assign location, update catalog
```

---

## 2. Relational vs. Non-Relational Databases

### Relational Databases (SQL)

Think of spreadsheets with multiple sheets that reference each other.

**Examples**: PostgreSQL, MySQL, SQLite

**Structure**: Tables with rows and columns

**Example - Social Media App**:

**Users Table**:
```
+----+----------+-------------------+------------+
| id | username | email             | created_at |
+----+----------+-------------------+------------+
| 1  | alice    | alice@email.com   | 2024-01-15 |
| 2  | bob      | bob@email.com     | 2024-01-20 |
+----+----------+-------------------+------------+
```

**Posts Table**:
```
+----+---------+------------------+-------+------------+
| id | user_id | content          | likes | created_at |
+----+---------+------------------+-------+------------+
| 1  | 1       | Hello world!     | 10    | 2024-01-16 |
| 2  | 1       | Learning SQL!    | 5     | 2024-01-17 |
| 3  | 2       | Backend is fun   | 15    | 2024-01-21 |
+----+---------+------------------+-------+------------+
```

Notice: `user_id` in Posts connects to `id` in Users!

**When to Use SQL**:
- Data has clear relationships (users have posts, orders have items)
- Need complex queries (find all users who posted in January AND have >100 followers)
- Data integrity is critical (banking, healthcare)
- Structured data that fits in tables

---

### Non-Relational Databases (NoSQL)

**Structure**: Collections of documents (like JSON objects)

**Example - Same Social Media App**:

**Users Collection**:
```json
{
  "_id": "abc123",
  "username": "alice",
  "email": "alice@email.com",
  "posts": [
    {
      "content": "Hello world!",
      "likes": 10,
      "created_at": "2024-01-16"
    },
    {
      "content": "Learning SQL!",
      "likes": 5,
      "created_at": "2024-01-17"
    }
  ],
  "created_at": "2024-01-15"
}
```

Everything for one user is stored together!

**When to Use NoSQL**:
- Flexible data structure (not all users have same fields)
- Need to scale horizontally (millions of users)
- Rapid development (structure can change easily)
- Hierarchical data (comments within posts within users)

---

### Comparison Table

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|------------------|------------------------|
| **Structure** | Tables with fixed columns | Flexible documents/objects |
| **Relationships** | Foreign keys, JOIN operations | Nested documents or references |
| **Schema** | Must be defined upfront | Can change anytime |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **Best for** | Complex queries, transactions | Fast reads, flexible data |
| **Learning curve** | Moderate (need to learn SQL) | Easier (like working with JSON) |

---

## 3. More on SQL (We'll focus on SQL for this course)

### Tables, Columns, and Rows

**Key Terms**:
- **Table**: A collection of related data (like "users" or "posts")
- **Column**: A specific attribute (like "email" or "username")
- **Row**: A single record (one user, one post)
- **Schema**: The structure/blueprint of a table (what columns exist and their types)

---

### Data Types

Just like variables in programming, database columns have types:

#### Common Data Types:

**Text Types**:
```sql
VARCHAR(50)    → Variable-length text up to 50 characters
                 Example: usernames, emails
                 
TEXT           → Long text (no limit)
                 Example: blog post content, descriptions
                 
CHAR(2)        → Fixed-length text
                 Example: US state codes (CA, NY, TX)
```

**Number Types**:
```sql
INT            → Whole numbers (-2,147,483,648 to 2,147,483,647)
                 Example: age, post count
                 
BIGINT         → Really big whole numbers
                 Example: view counts, like counts
                 
DECIMAL(10,2)  → Decimal numbers (10 total digits, 2 after decimal)
                 Example: prices (199.99), ratings (4.75)
                 
FLOAT          → Approximate decimal numbers
                 Example: scientific calculations
```

**Date/Time Types**:
```sql
DATE           → Date only (2024-01-15)
                 Example: birthday, account creation date
                 
TIME           → Time only (14:30:00)
                 Example: appointment time
                 
TIMESTAMP      → Date and time together (2024-01-15 14:30:00)
                 Example: when post was created, last login
```

**Boolean Type**:
```sql
BOOLEAN        → True or False
                 Example: is_active, email_verified, is_admin
```

**Creating a Table with Types**:
```sql
CREATE TABLE users (
    id INT,
    username VARCHAR(30),
    email VARCHAR(100),
    age INT,
    bio TEXT,
    is_active BOOLEAN,
    account_balance DECIMAL(10,2),
    created_at TIMESTAMP
);
```

---

### Primary Keys: Unique Identifiers

Every row needs a unique identifier (like a person's ID card).

**Without Primary Key** :
```
users table:
+----------+-----------------+
| username | email           |
+----------+-----------------+
| alice    | alice@email.com |
| alice    | alice@email.com |  ← Duplicate! Which Alice?
+----------+-----------------+
```

**With Primary Key**:
```
users table:
+----+----------+-----------------+
| id | username | email           |
+----+----------+-----------------+
| 1  | alice    | alice@email.com |
| 2  | alice    | other@email.com |  ← Different person!
+----+----------+-----------------+
```

**Creating with Primary Key**:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- Automatically increases
    username VARCHAR(30),
    email VARCHAR(100)
);
```
---

### Foreign Keys: Connecting Tables

Foreign keys create relationships between tables.

**Example: Blog System**

**Users Table**:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30),
    email VARCHAR(100)
);
```

**Posts Table**:
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,                        -- Foreign Key!
    title VARCHAR(200),
    content TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**What This Means**:
- `user_id` in posts MUST match an `id` in users
- Can't create a post with `user_id = 999` if user 999 doesn't exist
- Protects data integrity!

**Visual Representation**:
```
users table:                    posts table:
+----|----------+               +----+---------+-------------+
| id | username |               | id | user_id | title       |
|----|----------|               |----|---------|-------------|
| 1  | alice    |   ←───────────| 1  | 1       | First post  |
| 2  | bob      |   ←───────────| 2  | 2       | Hello!      |
+----|----------+           ↑   | 3  | 1       | Second one  |
                            |   +----+---------+-------------+
                            |
                    user_id connects to id
```

---

## 4. CRUD Operations in SQL

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete (the four basic operations)

### CREATE (INSERT)

**Adding Data to Tables**

**Single Row**:
```sql
INSERT INTO users (username, email, created_at)
VALUES ('alice', 'alice@email.com', NOW());
```

**Multiple Rows**:
```sql
INSERT INTO users (username, email, created_at)
VALUES 
    ('alice', 'alice@email.com', NOW()),
    ('bob', 'bob@email.com', NOW()),
    ('charlie', 'charlie@email.com', NOW());
```

**Real-World Scenario**: User signs up on your website
```sql
-- They fill out registration form
INSERT INTO users (username, email, password_hash, is_active)
VALUES ('new_user', 'newuser@email.com', '$2b$12$...', true);
```

---

### READ (SELECT)

**Retrieving Data**

**Get Everything**:
```sql
SELECT * FROM users;
-- * means "all columns"
```

Result:
```
+----+----------+-------------------+------------+
| id | username | email             | created_at |
+----+----------+-------------------+------------+
| 1  | alice    | alice@email.com   | 2024-01-15 |
| 2  | bob      | bob@email.com     | 2024-01-20 |
+----+----------+-------------------+------------+
```

**Get Specific Columns**:
```sql
SELECT username, email FROM users;
```

Result:
```
+----------+-------------------+
| username | email             |
+----------+-------------------+
| alice    | alice@email.com   |
| bob      | bob@email.com     |
+----------+-------------------+
```

**WHERE Clause (Filtering)**:
```sql
-- Find specific user
SELECT * FROM users WHERE username = 'alice';

-- Find users created after a date
SELECT * FROM users WHERE created_at > '2024-01-18';

-- Multiple conditions (AND)
SELECT * FROM users 
WHERE is_active = true AND created_at > '2024-01-01';

-- Multiple conditions (OR)
SELECT * FROM users 
WHERE username = 'alice' OR username = 'bob';
```

**Comparison Operators**:
```sql
=     → equals
!=    → not equals
>     → greater than
<     → less than
>=    → greater than or equal
<=    → less than or equal
LIKE  → pattern matching

-- Examples:
SELECT * FROM posts WHERE likes > 10;
SELECT * FROM users WHERE email LIKE '%@gmail.com';  -- % = wildcard
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
```

**ORDER BY (Sorting)**:
```sql
-- Oldest first
SELECT * FROM users ORDER BY created_at ASC;

-- Newest first
SELECT * FROM users ORDER BY created_at DESC;

-- Most liked posts
SELECT * FROM posts ORDER BY likes DESC;
```

**LIMIT (Get Only Some Results)**:
```sql
-- Get 10 most recent posts
SELECT * FROM posts 
ORDER BY created_at DESC 
LIMIT 10;

-- Get posts 11-20 (pagination)
SELECT * FROM posts 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 10;
```

---

### UPDATE (Modify Existing Data)

**Change Data in Database**

**Update Single Column**:
```sql
UPDATE users 
SET email = 'newemail@example.com'
WHERE id = 1;
```

**Update Multiple Columns**:
```sql
UPDATE users 
SET 
    username = 'alice_updated',
    email = 'alice_new@email.com',
    updated_at = NOW()
WHERE id = 1;
```

**DANGER - Updating Without WHERE**:
```sql
-- This updates EVERY user!
UPDATE users SET username = 'alice';  -- Don't do this!
```

**Real-World Scenarios**:
```sql
-- User changes their profile
UPDATE users 
SET bio = 'Backend developer learning SQL'
WHERE id = 5;

-- Increment like count on a post
UPDATE posts 
SET likes = likes + 1
WHERE id = 42;

-- Mark user as verified
UPDATE users 
SET email_verified = true, verified_at = NOW()
WHERE email = 'user@example.com';
```

---

### DELETE (Remove Data)

**Remove Rows from Table**

**Delete Specific Row**:
```sql
DELETE FROM users WHERE id = 5;
```

**Delete Multiple Rows**:
```sql
-- Delete all inactive users
DELETE FROM users WHERE is_active = false;

-- Delete old posts
DELETE FROM posts WHERE created_at < '2023-01-01';
```

**EXTREME DANGER - Delete Without WHERE**:
```sql
-- This deletes EVERYTHING!
DELETE FROM users;  -- ALL USERS GONE!
```

---

## Key Takeaways

 **Databases** provide permanent storage for application data

 **SQL databases** use tables with rows and columns (like spreadsheets)

 **Primary keys** uniquely identify each row

 **Foreign keys** create relationships between tables

 **CRUD operations**: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE)

 **Always use WHERE** with UPDATE and DELETE to avoid disaster

 **Data types** define what kind of information each column can hold

---

## Next Steps

In **Module 3**, we'll explore **APIs and HTTP Requests**! You'll learn:
- How to design RESTful APIs
- Understanding HTTP methods and status codes
- Testing APIs with Postman
- Handling errors gracefully
- Building API endpoints that connect to your database

Get ready to expose your database to the world through APIs!

