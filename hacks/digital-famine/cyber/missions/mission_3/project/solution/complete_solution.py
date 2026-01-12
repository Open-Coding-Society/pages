"""
Mission 3: Complete Solution
Full implementation of all mission challenges
"""
import hashlib
import sqlite3
import os
from datetime import datetime

class Mission3Solution:
    def __init__(self, db_path):
        """Initialize with database path"""
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.setup_tables()
    
    def setup_tables(self):
        """Set up all required tables"""
        # Create LaunchCodes table
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS LaunchCodes (
            code_id INTEGER PRIMARY KEY,
            code_name TEXT UNIQUE,
            code_hash TEXT,
            created_date TEXT
        )''')
        
        # Add security columns to existing tables
        try:
            self.cursor.execute('ALTER TABLE Agents ADD COLUMN password_hash TEXT')
        except sqlite3.OperationalError:
            pass
        
        try:
            self.cursor.execute('ALTER TABLE Alien_Sightings ADD COLUMN verification_hash TEXT')
        except sqlite3.OperationalError:
            pass
        
        self.conn.commit()
    
    def hash_string(self, text):
        """Create SHA-256 hash of a string"""
        return hashlib.sha256(str(text).encode()).hexdigest()
    
    def secure_all_data(self):
        """Apply security measures to all tables"""
        # Secure Agents
        self.cursor.execute('SELECT agent_id, codename FROM Agents')
        for agent_id, codename in self.cursor.fetchall():
            pass_hash = self.hash_string(f"{codename}123")
            self.cursor.execute('UPDATE Agents SET password_hash = ? WHERE agent_id = ?', 
                              (pass_hash, agent_id))
        
        # Secure Sightings
        self.cursor.execute('''
            SELECT sighting_id, timestamp, location, threat_level, description 
            FROM Alien_Sightings
        ''')
        for row in self.cursor.fetchall():
            v_hash = self.hash_string('|'.join(str(x) for x in row))
            self.cursor.execute('''
                UPDATE Alien_Sightings 
                SET verification_hash = ? 
                WHERE sighting_id = ?
            ''', (v_hash, row[0]))
        
        # Add sample launch codes
        sample_codes = [
            ("ALPHA", "launch-alpha-1"),
            ("BRAVO", "launch-bravo-2"),
            ("CHARLIE", "launch-charlie-3")
        ]
        for name, code in sample_codes:
            try:
                self.cursor.execute('''
                    INSERT INTO LaunchCodes (code_name, code_hash, created_date)
                    VALUES (?, ?, datetime('now'))
                ''', (name, self.hash_string(code)))
            except sqlite3.IntegrityError:
                pass
        
        self.conn.commit()
    
    def verify_all_data(self):
        """Verify integrity of all secured data"""
        issues = []
        
        # Check Agents
        self.cursor.execute('SELECT agent_id, codename, password_hash FROM Agents')
        for agent_id, codename, stored_hash in self.cursor.fetchall():
            if stored_hash != self.hash_string(f"{codename}123"):
                issues.append(f"Agent {codename} password hash mismatch")
        
        # Check Sightings
        self.cursor.execute('''
            SELECT sighting_id, timestamp, location, threat_level, description, verification_hash
            FROM Alien_Sightings
        ''')
        for row in self.cursor.fetchall():
            calc_hash = self.hash_string('|'.join(str(x) for x in row[:-1]))
            if row[-1] != calc_hash:
                issues.append(f"Sighting {row[0]} verification hash mismatch")
        
        # Check Launch Codes
        self.cursor.execute('SELECT code_name, code_hash FROM LaunchCodes')
        sample_codes = {
            "ALPHA": "launch-alpha-1",
            "BRAVO": "launch-bravo-2",
            "CHARLIE": "launch-charlie-3"
        }
        for name, stored_hash in self.cursor.fetchall():
            if name in sample_codes:
                if stored_hash != self.hash_string(sample_codes[name]):
                    issues.append(f"Launch code {name} hash mismatch")
        
        return issues
    
    def close(self):
        """Close database connection"""
        self.conn.close()

def main():
    # Use the shared database in resources directory
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'resources', 'earth_base.db')
    
    print("🎯 Mission 3: Complete Solution 🎯")
    print("-" * 50)
    
    solution = Mission3Solution(db_path)
    
    print("\n1. Applying security measures...")
    solution.secure_all_data()
    print("✅ All security measures applied")
    
    print("\n2. Verifying data integrity...")
    issues = solution.verify_all_data()
    if issues:
        print("❌ Issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ All data verified")
        print("\n🏆 Mission Complete! You've successfully secured the database.")
    
    solution.close()

if __name__ == "__main__":
    main()