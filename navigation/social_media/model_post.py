"""
Social Media Post Model
Defines the database schema for posts and replies
"""
from sqlite3 import IntegrityError
from sqlalchemy import Text
from __init__ import db
from datetime import datetime
import json


class Post(db.Model):
    """
    Post Model
    
    Represents a social media post or reply in the system.
    Supports threaded comments through parent-child relationships.
    """
    __tablename__ = 'posts'

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    _user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    _parent_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=True)
    
    # Post Content
    _content = db.Column(Text, nullable=False)
    _grade_received = db.Column(db.String(50), nullable=True)
    _page_url = db.Column(db.String(500), nullable=True)
    _page_title = db.Column(db.String(200), nullable=True)
    
    # Metadata
    _timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    _updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    # Link to User model
    user = db.relationship('User', foreign_keys=[_user_id], backref=db.backref('posts', lazy=True))
    
    # Self-referential relationship for replies
    replies = db.relationship(
        'Post',
        backref=db.backref('parent', remote_side=[id]),
        lazy='dynamic',
        foreign_keys=[_parent_id]
    )

    def __init__(self, user_id, content, grade_received=None, page_url=None, page_title=None, parent_id=None):
        """
        Initialize a new Post
        
        Args:
            user_id: ID of the user creating the post
            content: Text content of the post
            grade_received: Optional grade (e.g., "A+", "B", etc.)
            page_url: Optional URL of the lesson/page
            page_title: Optional title of the lesson/page
            parent_id: Optional ID of parent post (for replies)
        """
        self._user_id = user_id
        self._content = content
        self._grade_received = grade_received
        self._page_url = page_url
        self._page_title = page_title
        self._parent_id = parent_id
        self._timestamp = datetime.utcnow()

    def create(self):
        """Create a new post in the database"""
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except IntegrityError:
            db.session.rollback()
            return None
        except Exception as e:
            db.session.rollback()
            raise e

    def read(self):
        """Read post data as a dictionary"""
        # Get all replies (child posts)
        all_replies = self.replies.all()
        
        return {
            'id': self.id,
            'userId': self._user_id,
            'studentName': self.user.name if self.user else 'Unknown',
            'content': self._content,
            'gradeReceived': self._grade_received,
            'pageUrl': self._page_url,
            'pageTitle': self._page_title,
            'timestamp': self._timestamp.isoformat() if self._timestamp else None,
            'updatedAt': self._updated_at.isoformat() if self._updated_at else None,
            'parentId': self._parent_id,
            'replyCount': len(all_replies),
            'replies': [reply.read_simple() for reply in all_replies]
        }
    
    def read_simple(self):
        """Read post data as a simple dictionary (for nested replies)"""
        return {
            'id': self.id,
            'userId': self._user_id,
            'studentName': self.user.name if self.user else 'Unknown',
            'content': self._content,
            'timestamp': self._timestamp.isoformat() if self._timestamp else None,
        }

    def update(self, content=None, grade_received=None):
        """Update post content"""
        try:
            if content is not None:
                self._content = content
            if grade_received is not None:
                self._grade_received = grade_received
            self._updated_at = datetime.utcnow()
            db.session.commit()
            return self
        except Exception as e:
            db.session.rollback()
            raise e

    def delete(self):
        """Delete the post and all its replies"""
        try:
            # Delete all replies first
            for reply in self.replies.all():
                reply.delete()
            
            db.session.delete(self)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_by_id(post_id):
        """Get a post by its ID"""
        return Post.query.get(post_id)

    @staticmethod
    def get_all():
        """Get all top-level posts (not replies)"""
        posts = Post.query.filter_by(_parent_id=None).order_by(Post._timestamp.desc()).all()
        return [post.read() for post in posts]

    @staticmethod
    def get_by_page(page_url):
        """Get all posts for a specific page"""
        posts = Post.query.filter_by(_page_url=page_url, _parent_id=None).order_by(Post._timestamp.desc()).all()
        return [post.read() for post in posts]

    @staticmethod
    def get_by_user(user_id):
        """Get all posts by a specific user"""
        posts = Post.query.filter_by(_user_id=user_id, _parent_id=None).order_by(Post._timestamp.desc()).all()
        return [post.read() for post in posts]


def init_posts():
    """Initialize the posts table with sample data (for testing)"""
    with db.session.begin():
        # Check if posts already exist
        existing_posts = Post.query.first()
        if existing_posts:
            print("Posts table already contains data. Skipping initialization.")
            return
        
        # Import User model to get test users
        from model.user import User
        
        # Get first user for testing
        test_user = User.query.first()
        if not test_user:
            print("No users found. Please initialize users first.")
            return
        
        # Create sample posts
        sample_posts = [
            Post(
                user_id=test_user.id,
                content="This is my first post on the social media platform! Excited to share my learning journey.",
                grade_received="A+ (97-100%)",
                page_url="/hacks/example",
                page_title="Example Lesson"
            ),
            Post(
                user_id=test_user.id,
                content="Just completed the Flask tutorial. The authentication system is really interesting!",
                grade_received="A (93-96%)",
                page_url="/hacks/flask",
                page_title="Flask Tutorial"
            ),
        ]
        
        # Add posts to database
        for post in sample_posts:
            try:
                db.session.add(post)
                print(f"Added post: {post._content[:50]}...")
            except Exception as e:
                print(f"Error adding post: {e}")
        
        db.session.commit()
        print("Sample posts initialized successfully!")

