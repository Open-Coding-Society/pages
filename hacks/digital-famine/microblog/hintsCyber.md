---
layout: post
title: "Hints"
description: "Submodule 2 of Hints Mini-Quest"
permalink: /digital-famine/microblog/hintsCyber/
parent: "AI Usage"
team: "Thinkers"
submodule: 2
categories: [CSP, Submodule, Microblogging]
tags: [microblogging, submodule, unzippers]
author: "Jaynee Chauhan, Michelle Ji"
date: 2025-10-28
breadcrumb: true
---

# Database & Security Quiz

1. What is a database schema?  
**Hint:** Think about blueprints and architectural plans  

---

2. Which constraint uniquely identifies each record in a table?  
**Hint:** Every table needs one of these to identify rows  

---

3. What does a FOREIGN KEY do in the earth_base.db?  
**Hint:** Think about the verified_by column connecting Agents to Alien_Sightings  

---

4. Which SQL statement adds new agents to the database?  
**Hint:** You're putting new data INTO the table  

---

5. What happens if you delete an agent who verified alien sightings?  
**Hint:** Consider referential integrity and orphaned records  

---

6. Which data type stores clearance_level values (1-10)?  
**Hint:** These are whole numbers, not decimals or text  

---

7. What does `CHECK(threat_level >= 1 AND threat_level <= 5)` do?  
**Hint:** This enforces business rules on data values  

---

8. What is SQL Injection?  
**Hint:** Malicious code inserted through user input fields  

---

9. Which login input could be a SQL injection attempt?  
**Hint:** Look for SQL operators like OR and quotes  

---

10. What's the best defense against SQL injection?  
**Hint:** Separate SQL code from user data using placeholders  

---

11. Why is string concatenation vulnerable?  
**Hint:** When you use `+` to combine user input with SQL queries  

---

12. Which payload could expose ALL agent records?  
**Hint:** Make the WHERE clause always true, then comment out the rest  

---

13. What does input validation prevent?  
**Hint:** Checking data format before processing  

---

14. In SQL injection attacks, what does `--` do?  
**Hint:** Everything after this symbol is ignored  

---

15. What's the difference between hashing and encryption?  
**Hint:** Can you reverse the process or not?  

---

16. How many characters is a SHA-256 hash output?  
**Hint:** It's always the same length — 256 bits = ? hex characters  

---

17. What is the 'avalanche effect' in SHA-256?  
**Hint:** Change one letter, get a completely different result  

---

18. Why hash launch codes instead of storing them in plaintext?  
**Hint:** Protection if the database is breached  

---

19. If you hash 'ALPHA-001' today and tomorrow, will the hashes match?  
**Hint:** Is hashing deterministic or random?  

---

20. What is 'salt' in password hashing?  
**Hint:** Random data added to defeat pre-computed hash tables  
