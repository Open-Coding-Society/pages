"""
Mission 3: Hashing Lab
Learn about SHA-256 hashing through interactive demonstrations
"""
import hashlib
import time

def demo_basic_hash(text):
    """Demonstrate basic SHA-256 hashing"""
    return hashlib.sha256(text.encode()).hexdigest()

def demo_avalanche(text):
    """Demonstrate the avalanche effect"""
    hash1 = demo_basic_hash(text)
    hash2 = demo_basic_hash(text + ".")
    return hash1, hash2

def speed_test(iterations=1000):
    """Test hashing speed"""
    start = time.time()
    for i in range(iterations):
        demo_basic_hash(f"test{i}")
    return time.time() - start

def main():
    print("🔬 SHA-256 Hashing Lab 🔬")
    print("-" * 50)
    
    # Basic hashing demo
    text = input("\n1. Enter text to hash: ")
    print(f"SHA-256 Hash: {demo_basic_hash(text)}")
    
    # Avalanche effect demo
    print("\n2. Demonstrating Avalanche Effect...")
    hash1, hash2 = demo_avalanche(text)
    print(f"Original text hash: {hash1}")
    print(f"Changed text hash:  {hash2}")
    
    # Speed test
    print("\n3. Running speed test...")
    duration = speed_test()
    print(f"Time to hash 1000 items: {duration:.3f} seconds")

if __name__ == "__main__":
    main()