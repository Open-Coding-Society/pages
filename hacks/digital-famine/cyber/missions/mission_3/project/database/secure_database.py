"""
Mission 3: Database Security Manager
Secure existing database tables with hashing
"""
import sqlite3
import hashlib
import os
from datetime import datetime

class DatabaseSecurityManager:
    def __init__(self, db_path):
        """Initialize database connection"""
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
    
    def hash_string(self, text):
        """Create SHA-256 hash of a string"""
        return hashlib.sha256(str(text).encode()).hexdigest()
    
    def secure_agents_table(self):
        """Add hashed passwords for agents"""
        try:
            # Add password_hash column if it doesn't exist
            self.cursor.execute('''
            ALTER TABLE Agents 
            ADD COLUMN password_hash TEXT
            ''')
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        # Update with hashed default passwords
        self.cursor.execute('SELECT agent_id, codename FROM Agents')
        for agent_id, codename in self.cursor.fetchall():
            default_pass = f"{codename}123"  # Simple default password
            pass_hash = self.hash_string(default_pass)
            self.cursor.execute('''
            UPDATE Agents 
            SET password_hash = ?
            WHERE agent_id = ?
            ''', (pass_hash, agent_id))
        
        self.conn.commit()
        return True
    
    def secure_sightings_table(self):
        """Add verification hashes for sightings"""
        try:
            # Add verification_hash column if it doesn't exist
            self.cursor.execute('''
            ALTER TABLE Alien_Sightings 
            ADD COLUMN verification_hash TEXT
            ''')
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        # Update with verification hashes
        self.cursor.execute('''
        SELECT sighting_id, timestamp, location, threat_level, description 
        FROM Alien_Sightings
        ''')
        for row in self.cursor.fetchall():
            # Create hash from all fields
            verification_data = '|'.join(str(x) for x in row)
            v_hash = self.hash_string(verification_data)
            self.cursor.execute('''
            UPDATE Alien_Sightings 
            SET verification_hash = ?
            WHERE sighting_id = ?
            ''', (v_hash, row[0]))
        
        self.conn.commit()
        return True
    
    def verify_database_integrity(self):
        """Check if any records have been tampered with"""
        issues = []
        
        # Check Agents table
        self.cursor.execute('SELECT agent_id, codename, password_hash FROM Agents')
        for agent_id, codename, stored_hash in self.cursor.fetchall():
            default_pass = f"{codename}123"
            if stored_hash != self.hash_string(default_pass):
                issues.append(f"Warning: Agent {codename} password hash mismatch")
        
        # Check Alien_Sightings table
        self.cursor.execute('''
        SELECT sighting_id, timestamp, location, threat_level, description, verification_hash
        FROM Alien_Sightings
        ''')
        for row in self.cursor.fetchall():
            verification_data = '|'.join(str(x) for x in row[:-1])  # Exclude stored hash
            if row[-1] != self.hash_string(verification_data):
                issues.append(f"Warning: Sighting {row[0]} data mismatch")
        
        return issues
    
    def close(self):
        """Close database connection"""
        self.conn.close()

def main():
    # Use the shared database in resources directory
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'resources', 'earth_base.db')
    security = DatabaseSecurityManager(db_path)
    
    print("🔒 Database Security Manager 🔒")
    print("-" * 50)
    
    print("\n1. Securing Agents table...")
    if security.secure_agents_table():
        print("✅ Agent passwords hashed")
    
    print("\n2. Securing Alien_Sightings table...")
    if security.secure_sightings_table():
        print("✅ Sighting verification hashes added")
    
    print("\n3. Verifying database integrity...")
    issues = security.verify_database_integrity()
    if issues:
        print("❌ Issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ All records verified")
    
    security.close()

if __name__ == "__main__":
    main()