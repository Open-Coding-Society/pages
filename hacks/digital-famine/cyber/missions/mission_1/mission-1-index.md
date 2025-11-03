---
layout: post
title: "Mission 1 — Build the Base Database"
description: "Learn database fundamentals through hands-on SQLite construction"
permalink: /digital-famine/cybersecurity-game/submodule_1
categories: [CSP, Submodule, Database]
tags: [sql, database, fundamentals, sqlite]
author: "Cybersecurity Team"
date: 2025-10-24
---

# Mission 1: Build the Base Database
## Complete Learning Module

## 🎬 Mission Briefing

**INCOMING TRANSMISSION...**

Commander, Earth's intelligence network is down. The alien strike obliterated our orbital database—every agent profile, every sighting record, gone. Without this data, our radar systems are blind and field teams can't coordinate.

Your mission: rebuild `earth_base.db` from scratch. You'll need to architect two critical tables, populate them with intel, and bring our early warning system back online.

**Time Estimate:** 45-60 minutes  
**Difficulty:** ⭐⭐☆☆☆ Beginner  
**Reward:** Code Fragment `ALPHA-7X9K`

---

## 📚 Part 1: Database Fundamentals (The Briefing)

### What IS a Database?

Think of a database like a super-organized filing cabinet. Instead of papers scattered everywhere, you have:
- **Tables** = Filing drawers (each holds related information)
- **Rows** = Individual files (one agent, one sighting)
- **Columns** = Specific details (name, date, location)

### Why SQLite?

SQLite is perfect for learning because:
- ✅ No server setup required—just one file
- ✅ Used in phones, browsers, even spacecraft
- ✅ Speaks SQL, the universal database language
- ✅ Small but mighty (powers apps with millions of records)

### Real-World Context

NASA uses databases to track:
- 🛰️ Satellite positions and telemetry
- 🔭 Star catalogs with billions of entries
- 👩‍🚀 Astronaut medical records

You're learning the same tech that helps explore space!

---

## 🎯 Part 2: Understanding Tables & Schema

### The Blueprint: Schema Design

Before building anything, architects draw blueprints. In databases, this is called a **schema**—it defines:
1. What columns exist
2. What type of data each holds
3. Rules the data must follow

### Mission Tables Overview

#### Table 1: `Agents` (Your Defense Team)
Stores information about Earth's field operatives.

**Required Columns:**
- `agent_id` → Unique number for each agent (like an employee ID)
- `codename` → Secret identity (must be unique, no duplicates)
- `clearance_level` → Security rating from 1-10
- `location` → Where they're stationed
- `status` → Current state: 'active', 'standby', or 'compromised'

#### Table 2: `Alien_Sightings` (Threat Intelligence)
Logs every alien contact event.

**Required Columns:**
- `sighting_id` → Unique event number
- `timestamp` → When it happened
- `location` → Where it happened
- `threat_level` → Danger rating 1-5 (5 = extreme)
- `description` → What was seen
- `verified_by` → Which agent confirmed it (links to Agents table)

### 🔗 The Connection: Foreign Keys

Notice `verified_by` in Sightings? This creates a relationship:
- Each sighting must be verified by a real agent
- If we try to delete an agent who verified sightings, the database warns us
- This keeps data accurate and connected

---

## 🧪 Part 3: Interactive Concept Check

**Before coding, test your understanding:**

**Question 1:** If Agent "Shadow" has `agent_id = 5`, what value goes in `verified_by` for their sightings?
<details>
<summary>Click for answer</summary>
Answer: 5 (the agent_id, not the codename)
</details>

**Question 2:** Can two agents have the same codename?
<details>
<summary>Click for answer</summary>
No! Codename is UNIQUE—duplicates aren't allowed.
</details>

**Question 3:** What happens if you try to insert clearance_level = 15?
<details>
<summary>Click for answer</summary>
ERROR! We'll set a CHECK constraint limiting it to 1-10.
</details>

---

## 💻 Part 4: Hands-On Mission Start

### Setup Your Workspace

Create a new file: `mission1_base_database.py`

```python
import sqlite3
import os
from datetime import datetime

# 🎮 MISSION CONTROL CENTER
print("=" * 60)
print("🛰️  MISSION 1: REBUILD EARTH'S DEFENSE DATABASE")
print("=" * 60)
print()

# TODO CHECKPOINT 1: Create the database file
# Hint: Use sqlite3.connect() to create 'earth_base.db'
# Remember to remove old versions first!

def create_database():
    """
    Your first objective: Initialize the database file
    
    Steps:
    1. Check if 'earth_base.db' already exists
    2. If it does, delete it (fresh start!)
    3. Create a new connection to 'earth_base.db'
    4. Return the connection object
    """
    
    # 🚧 YOUR CODE HERE 🚧
    # Delete existing database if present
    # if os.path.exists('earth_base.db'):
    #     os.remove('earth_base.db')
    
    # Create new database connection
    # conn = sqlite3.connect('earth_base.db')
    # return conn
    
    pass  # Remove this when you add your code

# Test your function
conn = create_database()
if conn:
    print("✅ Database connection established!")
    print("📁 File created: earth_base.db")
else:
    print("❌ Database creation failed. Check your code!")
```

### 🎯 Checkpoint 1 Solution Check

Run your code. You should see:
- ✅ A new file `earth_base.db` appears in your folder
- ✅ No error messages
- ✅ Success message prints

**Stuck?** Make sure you:
- Imported `sqlite3` at the top
- Used the exact filename 'earth_base.db'
- Returned the connection object

---

## 🏗️ Part 5: Building the Agents Table

### SQL Syntax Primer

SQL looks like English! Here's the pattern:

```sql
CREATE TABLE TableName (
    column_name DATA_TYPE CONSTRAINTS,
    another_column DATA_TYPE CONSTRAINTS,
    ...
);
```

### Data Types You'll Use

| Type | What It Stores | Example |
|------|----------------|---------|
| `INTEGER` | Whole numbers | 42, -7, 1000 |
| `TEXT` | Words/sentences | "Shadow", "New York" |
| `REAL` | Decimals | 3.14, 99.9 |

### Common Constraints

| Constraint | Meaning |
|------------|---------|
| `PRIMARY KEY` | Unique identifier for each row |
| `NOT NULL` | This field must have a value |
| `UNIQUE` | No duplicates allowed |
| `CHECK` | Value must pass a test |

### 🎮 Mission Step 2: Create Agents Table

Add this function to your file:

```python
def create_agents_table(conn):
    """
    Objective: Build the Agents table to store defender info
    
    Requirements:
    - agent_id: INTEGER, PRIMARY KEY (auto-increments)
    - codename: TEXT, NOT NULL, UNIQUE
    - clearance_level: INTEGER, must be between 1 and 10
    - location: TEXT
    - status: TEXT, default value 'active'
    
    💡 Hint: Use CHECK for clearance validation
    Example: CHECK(clearance_level >= 1 AND clearance_level <= 10)
    """
    
    cursor = conn.cursor()
    
    # 🚧 YOUR CODE HERE 🚧
    # Write the CREATE TABLE statement
    # Uncomment and complete:
    
    # cursor.execute("""
    #     CREATE TABLE Agents (
    #         agent_id INTEGER PRIMARY KEY,
    #         codename TEXT NOT NULL UNIQUE,
    #         -- Add remaining columns here
    #     )
    # """)
    
    conn.commit()
    print("✅ Agents table created successfully!")

# Call your function
create_agents_table(conn)
```

### 🧪 Self-Test Your Table

Add this validation code:

```python
def test_agents_table(conn):
    """Check if your table structure is correct"""
    cursor = conn.cursor()
    
    # Get table structure
    cursor.execute("PRAGMA table_info(Agents)")
    columns = cursor.fetchall()
    
    print("\n🔍 Agents Table Structure:")
    print("-" * 40)
    for col in columns:
        print(f"  {col[1]:20} {col[2]:10}")
    
    # Verify required columns
    column_names = [col[1] for col in columns]
    required = ['agent_id', 'codename', 'clearance_level', 'location', 'status']
    
    missing = [c for c in required if c not in column_names]
    if missing:
        print(f"\n❌ Missing columns: {missing}")
    else:
        print("\n✅ All required columns present!")

test_agents_table(conn)
```

---

## 🌟 Part 6: Populating with Data

### INSERT Syntax

```sql
INSERT INTO TableName (column1, column2, column3)
VALUES (value1, value2, value3);
```

### 🎮 Mission Step 3: Add Agent Intel

```python
def insert_agents(conn):
    """
    Objective: Add field agents to the database
    
    Mission Requirements:
    - Insert at least 5 different agents
    - Include variety in clearance levels (mix of 3-10)
    - Have at least one 'compromised' agent
    - Use realistic military codenames
    """
    
    cursor = conn.cursor()
    
    # 🚧 YOUR CODE HERE 🚧
    # Example template (uncomment and add more):
    
    # agents = [
    #     ('Shadow', 9, 'New York', 'active'),
    #     ('Phoenix', 7, 'Tokyo', 'active'),
    #     # Add 3 more agents here
    # ]
    
    # for codename, clearance, location, status in agents:
    #     cursor.execute("""
    #         INSERT INTO Agents (codename, clearance_level, location, status)
    #         VALUES (?, ?, ?, ?)
    #     """, (codename, clearance, location, status))
    
    conn.commit()
    print(f"✅ Inserted {len(agents)} agents into database")
    return len(agents)

# Execute
agent_count = insert_agents(conn)
```

### 💡 Creative Challenge

Design agents with interesting backstories! Examples:
- `Cipher` - Cryptography expert in Berlin
- `Radar` - Surveillance specialist in London
- `Ghost` - Stealth operative, location classified

---

## 🛸 Part 7: Building the Sightings Table

### 🎮 Mission Step 4: Create Alien_Sightings

```python
def create_sightings_table(conn):
    """
    Objective: Build table to log alien encounters
    
    Requirements:
    - sighting_id: INTEGER, PRIMARY KEY
    - timestamp: TEXT (we'll use ISO format)
    - location: TEXT, NOT NULL
    - threat_level: INTEGER, CHECK between 1 and 5
    - description: TEXT
    - verified_by: INTEGER, FOREIGN KEY referencing Agents(agent_id)
    
    🔑 Foreign Key Syntax:
    FOREIGN KEY (verified_by) REFERENCES Agents(agent_id)
    """
    
    cursor = conn.cursor()
    
    # 🚧 YOUR CODE HERE 🚧
    # Create the table with all requirements
    
    conn.commit()
    print("✅ Alien_Sightings table created!")

create_sightings_table(conn)
```

### 🎮 Mission Step 5: Log Sighting Events

```python
def insert_sightings(conn):
    """
    Objective: Record alien contact events
    
    Requirements:
    - At least 8 different sightings
    - Mix of threat levels 1-5
    - Use agents that exist in your Agents table
    - Timestamps should use datetime.now().isoformat()
    """
    
    cursor = conn.cursor()
    
    # 🚧 YOUR CODE HERE 🚧
    # Example sighting template:
    
    # sightings = [
    #     (datetime.now().isoformat(), 'Nevada Desert', 4, 
    #      'Triangular craft, silent propulsion', 1),  # verified by agent_id 1
    #     (datetime.now().isoformat(), 'Pacific Ocean', 3,
    #      'Submerged lights, rapid movement', 2),
    #     # Add 6 more sightings
    # ]
    
    # for timestamp, location, threat, desc, agent_id in sightings:
    #     cursor.execute("""
    #         INSERT INTO Alien_Sightings 
    #         (timestamp, location, threat_level, description, verified_by)
    #         VALUES (?, ?, ?, ?, ?)
    #     """, (timestamp, location, threat, desc, agent_id))
    
    conn.commit()
    print(f"✅ Logged {len(sightings)} alien encounters")
    return len(sightings)

sighting_count = insert_sightings(conn)
```

---

## 🎯 Part 8: Mission Validation & Reward

### Automated Radar Check System

```python
def mission_validation(conn):
    """
    AUTOMATED MISSION VERIFICATION
    This simulates Earth's radar systems checking your database
    """
    
    cursor = conn.cursor()
    print("\n" + "=" * 60)
    print("🛰️  INITIATING RADAR SYSTEM VALIDATION")
    print("=" * 60)
    
    checks_passed = 0
    total_checks = 6
    
    # CHECK 1: Database exists and is accessible
    print("\n[1/6] Database Connectivity... ", end="")
    if conn:
        print("✅ PASS")
        checks_passed += 1
    else:
        print("❌ FAIL")
    
    # CHECK 2: Agents table structure
    print("[2/6] Agents Table Schema... ", end="")
    cursor.execute("PRAGMA table_info(Agents)")
    columns = {row[1] for row in cursor.fetchall()}
    required = {'agent_id', 'codename', 'clearance_level', 'location', 'status'}
    if required.issubset(columns):
        print("✅ PASS")
        checks_passed += 1
    else:
        print(f"❌ FAIL - Missing: {required - columns}")
    
    # CHECK 3: Minimum agent count
    print("[3/6] Agent Roster Population... ", end="")
    cursor.execute("SELECT COUNT(*) FROM Agents")
    agent_count = cursor.fetchone()[0]
    if agent_count >= 5:
        print(f"✅ PASS ({agent_count} agents)")
        checks_passed += 1
    else:
        print(f"❌ FAIL ({agent_count}/5 agents)")
    
    # CHECK 4: Sightings table structure
    print("[4/6] Sightings Table Schema... ", end="")
    cursor.execute("PRAGMA table_info(Alien_Sightings)")
    columns = {row[1] for row in cursor.fetchall()}
    required = {'sighting_id', 'timestamp', 'location', 'threat_level', 
                'description', 'verified_by'}
    if required.issubset(columns):
        print("✅ PASS")
        checks_passed += 1
    else:
        print(f"❌ FAIL - Missing: {required - columns}")
    
    # CHECK 5: Minimum sighting count
    print("[5/6] Threat Intel Population... ", end="")
    cursor.execute("SELECT COUNT(*) FROM Alien_Sightings")
    sighting_count = cursor.fetchone()[0]
    if sighting_count >= 8:
        print(f"✅ PASS ({sighting_count} sightings)")
        checks_passed += 1
    else:
        print(f"❌ FAIL ({sighting_count}/8 sightings)")
    
    # CHECK 6: Foreign key relationships
    print("[6/6] Data Integrity Links... ", end="")
    cursor.execute("""
        SELECT COUNT(*) FROM Alien_Sightings s
        LEFT JOIN Agents a ON s.verified_by = a.agent_id
        WHERE a.agent_id IS NULL
    """)
    orphaned = cursor.fetchone()[0]
    if orphaned == 0:
        print("✅ PASS")
        checks_passed += 1
    else:
        print(f"❌ FAIL ({orphaned} orphaned records)")
    
    # FINAL VERDICT
    print("\n" + "=" * 60)
    print(f"VALIDATION COMPLETE: {checks_passed}/{total_checks} checks passed")
    print("=" * 60)
    
    if checks_passed == total_checks:
        print("\n🎉 MISSION SUCCESS!")
        print("🔑 CODE FRAGMENT EARNED: ALPHA-7X9K")
        print("\n📡 Earth's radar systems are back online!")
        print("🎖️  Your database architecture has been logged in the")
        print("    Defense Network Hall of Fame.")
        print("\n➡️  Proceed to Mission 2: Patch the Wormhole")
        return True
    else:
        print("\n⚠️  MISSION INCOMPLETE")
        print(f"   {total_checks - checks_passed} objectives remaining.")
        print("   Review the failed checks and adjust your code.")
        print("   Run validation again when ready.")
        return False

# RUN FINAL VALIDATION
mission_validation(conn)
conn.close()
```

---

## 🎓 Part 9: Reflection & Extension

### What You Learned
- ✅ Database architecture and schema design
- ✅ SQL CREATE TABLE syntax
- ✅ Data types and constraints
- ✅ INSERT statements and data population
- ✅ Foreign key relationships
- ✅ Database validation techniques

### 🚀 Bonus Challenges (Optional)

**Challenge 1: Query Training**
Write SQL to find all high-clearance agents:
```python
cursor.execute("SELECT codename, clearance_level FROM Agents WHERE clearance_level >= 8")
print(cursor.fetchall())
```

**Challenge 2: Join Practice**
List all sightings with the agent who verified them:
```python
cursor.execute("""
    SELECT s.location, s.threat_level, a.codename
    FROM Alien_Sightings s
    JOIN Agents a ON s.verified_by = a.agent_id
    ORDER BY s.threat_level DESC
""")
```

**Challenge 3: Add Timestamps**
Modify your Agents table to track when each agent was recruited.

---

## 📝 Submission Checklist

Before moving to Mission 2, verify:
- [ ] `earth_base.db` file exists
- [ ] Agents table has 5+ records
- [ ] Alien_Sightings table has 8+ records
- [ ] All validation checks pass
- [ ] Code is commented and organized
- [ ] You understand foreign keys

### Save Your Code Fragment!
**Mission 1 Reward:** `ALPHA-7X9K`

You'll need all three fragments to unlock the Sacred Vault in the final mission!

---

**Next Mission:** [Mission 2 - Patch the Wormhole →](/digital-famine/cybersecurity-game/submodule_2/)

---