"""
Mission 3: Launch Codes Database Manager
Create and manage the LaunchCodes table with secure hashing
"""
import sqlite3
import hashlib
import os

class LaunchCodesDB:
    def __init__(self, db_path):
        """Initialize database connection"""
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.setup_table()
    
    def setup_table(self):
        """Create LaunchCodes table if it doesn't exist"""
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS LaunchCodes (
            code_id INTEGER PRIMARY KEY,
            code_name TEXT UNIQUE,
            code_hash TEXT,
            created_date TEXT
        )''')
        self.conn.commit()
    
    def hash_code(self, code):
        """Create SHA-256 hash of a launch code"""
        return hashlib.sha256(code.encode()).hexdigest()
    
    def add_code(self, code_name, code):
        """Add a new launch code with its hash"""
        try:
            code_hash = self.hash_code(code)
            self.cursor.execute('''
            INSERT INTO LaunchCodes (code_name, code_hash, created_date)
            VALUES (?, ?, datetime('now'))
            ''', (code_name, code_hash))
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False
    
    def verify_code(self, code_name, code):
        """Verify a launch code against its stored hash"""
        self.cursor.execute('SELECT code_hash FROM LaunchCodes WHERE code_name = ?', (code_name,))
        result = self.cursor.fetchone()
        if result:
            return result[0] == self.hash_code(code)
        return False
    
    def close(self):
        """Close database connection"""
        self.conn.close()

def main():
    # Use the shared database in resources directory
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'resources', 'earth_base.db')
    db = LaunchCodesDB(db_path)
    
    print("🚀 Launch Codes Database Manager 🚀")
    print("-" * 50)
    
    while True:
        print("\nOptions:")
        print("1. Add new launch code")
        print("2. Verify launch code")
        print("3. Exit")
        
        choice = input("\nChoice: ")
        
        if choice == "1":
            name = input("Enter code name: ")
            code = input("Enter launch code: ")
            if db.add_code(name, code):
                print("✅ Code added successfully!")
            else:
                print("❌ Error: Code name already exists")
        
        elif choice == "2":
            name = input("Enter code name: ")
            code = input("Enter launch code: ")
            if db.verify_code(name, code):
                print("✅ Code verified!")
            else:
                print("❌ Invalid code")
        
        elif choice == "3":
            break
    
    db.close()

if __name__ == "__main__":
    main()