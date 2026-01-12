// Fetch all forum posts and display them
function loadForumPosts() {
    fetch('/forum/get')
        .then(response => response.json())
        .then(data => {
            const forumPostsContainer = document.getElementById('forum-posts');
            forumPostsContainer.innerHTML = ''; // Clear previous posts

            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('forum-post');
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>Author: ${post.author}</p>
                    <p>Views: ${post.views}</p>
                    <button onclick="viewPostDetails(${post.id})">View Details</button>
                `;
                forumPostsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

// Fetch and display the detailed view of a post
function viewPostDetails(postId) {
    fetch(`/forum/studentIssue/${postId}`)
        .then(response => response.text())
        .then(markdown => {
            // Convert markdown to HTML
            const postContent = marked(markdown);
            
            // Display the post content
            document.getElementById('post-content').innerHTML = postContent;

            // Hide the list of posts and show the post detail view
            document.getElementById('forum-posts').style.display = 'none';
            document.getElementById('post-detail').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
}

// Go back to the list of posts
function goBack() {
    document.getElementById('forum-posts').style.display = 'block';
    document.getElementById('post-detail').style.display = 'none';
}

// Initial load of forum posts
document.addEventListener("DOMContentLoaded", function() {
    loadForumPosts();
});
