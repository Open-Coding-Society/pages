"""
Social Media Post API
Flask REST API endpoints for creating, reading, updating, and deleting posts
"""
from flask import Blueprint, request, jsonify, g
from flask_restful import Api, Resource
from __init__ import db
from model.post import Post
from model.user import User
from api.jwt_authorize import token_required


# Create Blueprint
post_api = Blueprint('post_api', __name__, url_prefix='/api/post')
api = Api(post_api)


class PostAPI(Resource):
    """
    POST API - Create a new post
    Requires JWT authentication
    """
    @token_required()
    def post(self):
        """
        Create a new post
        
        Expected JSON body:
        {
            "content": "Post content here",
            "gradeReceived": "A+ (97-100%)",  // optional
            "pageUrl": "/lesson/url",          // optional
            "pageTitle": "Lesson Title"        // optional
        }
        """
        try:
            # Get current user from JWT token
            current_user = g.current_user
            
            # Get request data
            data = request.get_json()
            
            if not data:
                return {'message': 'No data provided'}, 400
            
            # Validate required fields
            content = data.get('content')
            if not content or not content.strip():
                return {'message': 'Content is required'}, 400
            
            # Create new post
            new_post = Post(
                user_id=current_user.id,
                content=content.strip(),
                grade_received=data.get('gradeReceived'),
                page_url=data.get('pageUrl'),
                page_title=data.get('pageTitle')
            )
            
            # Save to database
            created_post = new_post.create()
            if not created_post:
                return {'message': 'Failed to create post'}, 500
            
            return created_post.read(), 201
            
        except Exception as e:
            return {'message': f'Error creating post: {str(e)}'}, 500


class PostListAPI(Resource):
    """
    GET API - Get all posts
    Requires JWT authentication
    """
    @token_required()
    def get(self):
        """
        Get all top-level posts with their replies
        Returns posts in reverse chronological order
        """
        try:
            posts = Post.get_all()
            return posts, 200
        except Exception as e:
            return {'message': f'Error fetching posts: {str(e)}'}, 500


class PostPageAPI(Resource):
    """
    GET API - Get posts for a specific page
    Public endpoint (no authentication required)
    """
    def get(self):
        """
        Get all posts for a specific page
        Query parameter: ?url=/lesson/url
        """
        try:
            page_url = request.args.get('url')
            if not page_url:
                return {'message': 'Page URL is required'}, 400
            
            posts = Post.get_by_page(page_url)
            return posts, 200
        except Exception as e:
            return {'message': f'Error fetching posts: {str(e)}'}, 500


class PostDetailAPI(Resource):
    """
    POST/PUT/DELETE API for individual posts
    """
    @token_required()
    def get(self, post_id):
        """Get a specific post by ID"""
        try:
            post = Post.get_by_id(post_id)
            if not post:
                return {'message': 'Post not found'}, 404
            
            return post.read(), 200
        except Exception as e:
            return {'message': f'Error fetching post: {str(e)}'}, 500
    
    @token_required()
    def put(self, post_id):
        """
        Update a post
        Only the post owner can update their post
        
        Expected JSON body:
        {
            "content": "Updated content",
            "gradeReceived": "B+ (87-89%)"  // optional
        }
        """
        try:
            current_user = g.current_user
            
            # Get the post
            post = Post.get_by_id(post_id)
            if not post:
                return {'message': 'Post not found'}, 404
            
            # Check if user owns the post
            if post._user_id != current_user.id:
                return {'message': 'You can only update your own posts'}, 403
            
            # Get update data
            data = request.get_json()
            if not data:
                return {'message': 'No data provided'}, 400
            
            # Update the post
            updated_post = post.update(
                content=data.get('content'),
                grade_received=data.get('gradeReceived')
            )
            
            return updated_post.read(), 200
            
        except Exception as e:
            return {'message': f'Error updating post: {str(e)}'}, 500
    
    @token_required()
    def delete(self, post_id):
        """
        Delete a post
        Only the post owner can delete their post
        """
        try:
            current_user = g.current_user
            
            # Get the post
            post = Post.get_by_id(post_id)
            if not post:
                return {'message': 'Post not found'}, 404
            
            # Check if user owns the post
            if post._user_id != current_user.id:
                return {'message': 'You can only delete your own posts'}, 403
            
            # Delete the post
            post.delete()
            
            return {'message': 'Post deleted successfully'}, 200
            
        except Exception as e:
            return {'message': f'Error deleting post: {str(e)}'}, 500


class PostReplyAPI(Resource):
    """
    POST API - Create a reply to a post
    Requires JWT authentication
    """
    @token_required()
    def post(self):
        """
        Create a reply to an existing post
        
        Expected JSON body:
        {
            "parentId": 123,
            "content": "Reply content here"
        }
        """
        try:
            current_user = g.current_user
            
            # Get request data
            data = request.get_json()
            if not data:
                return {'message': 'No data provided'}, 400
            
            # Validate required fields
            parent_id = data.get('parentId')
            content = data.get('content')
            
            if not parent_id:
                return {'message': 'Parent post ID is required'}, 400
            
            if not content or not content.strip():
                return {'message': 'Content is required'}, 400
            
            # Check if parent post exists
            parent_post = Post.get_by_id(parent_id)
            if not parent_post:
                return {'message': 'Parent post not found'}, 404
            
            # Create reply
            reply = Post(
                user_id=current_user.id,
                content=content.strip(),
                parent_id=parent_id
            )
            
            # Save to database
            created_reply = reply.create()
            if not created_reply:
                return {'message': 'Failed to create reply'}, 500
            
            return created_reply.read(), 201
            
        except Exception as e:
            return {'message': f'Error creating reply: {str(e)}'}, 500


class PostUserAPI(Resource):
    """
    GET API - Get all posts by a specific user
    Requires JWT authentication
    """
    @token_required()
    def get(self, user_id):
        """Get all posts by a specific user"""
        try:
            # Check if user exists
            user = User.query.get(user_id)
            if not user:
                return {'message': 'User not found'}, 404
            
            posts = Post.get_by_user(user_id)
            return posts, 200
        except Exception as e:
            return {'message': f'Error fetching user posts: {str(e)}'}, 500


# Register API endpoints
api.add_resource(PostAPI, '')  # POST /api/post
api.add_resource(PostListAPI, '/all')  # GET /api/post/all
api.add_resource(PostPageAPI, '/page')  # GET /api/post/page?url=...
api.add_resource(PostDetailAPI, '/<int:post_id>')  # GET/PUT/DELETE /api/post/{id}
api.add_resource(PostReplyAPI, '/reply')  # POST /api/post/reply
api.add_resource(PostUserAPI, '/user/<int:user_id>')  # GET /api/post/user/{id}

