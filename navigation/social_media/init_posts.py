#!/usr/bin/env python3
"""
Initialize Posts Database Table

This script creates the posts table and optionally adds sample data.
Copy this to your Flask backend's scripts/ directory.

Usage:
    ./scripts/init_posts.py
    
Or from Python:
    python scripts/init_posts.py
"""

import sys
import os

# Add the parent directory to the path so we can import from the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from __init__ import app, db


def init_posts_table():
    """Initialize the posts table and sample data"""
    
    print("=" * 60)
    print("INITIALIZING POSTS TABLE")
    print("=" * 60)
    
    with app.app_context():
        # Import models
        from model.post import Post, init_posts
        from model.user import User
        
        try:
            # Create all tables (if they don't exist)
            print("\n📦 Creating database tables...")
            db.create_all()
            print("✅ Posts table created successfully!")
            
            # Check if we should add sample data
            existing_posts = Post.query.first()
            
            if existing_posts:
                print("\nℹ️  Posts table already contains data.")
                print(f"   Total posts: {Post.query.count()}")
                
                response = input("\n❓ Add sample posts anyway? (y/n): ")
                if response.lower() != 'y':
                    print("\n✅ Initialization complete (no sample data added).")
                    return
            
            # Add sample data
            print("\n📝 Adding sample posts...")
            init_posts()
            
            # Display summary
            total_posts = Post.query.count()
            top_level_posts = Post.query.filter_by(_parent_id=None).count()
            replies = total_posts - top_level_posts
            
            print("\n" + "=" * 60)
            print("INITIALIZATION COMPLETE")
            print("=" * 60)
            print(f"✅ Total posts: {total_posts}")
            print(f"✅ Top-level posts: {top_level_posts}")
            print(f"✅ Replies: {replies}")
            print("\n🎉 Posts system is ready to use!")
            print("=" * 60)
            
        except Exception as e:
            print(f"\n❌ Error during initialization: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)


def check_dependencies():
    """Check if required models exist"""
    try:
        from model.user import User
        from model.post import Post
        return True
    except ImportError as e:
        print(f"❌ Error: Required model not found: {e}")
        print("\n📋 Make sure you have:")
        print("   1. Copied model_post.py to model/post.py")
        print("   2. User model is available (model/user.py)")
        return False


if __name__ == '__main__':
    print("\n🚀 Posts Database Initialization Script")
    print("   This will create the posts table and add sample data.\n")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Run initialization
    try:
        init_posts_table()
    except KeyboardInterrupt:
        print("\n\n⚠️  Initialization cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

