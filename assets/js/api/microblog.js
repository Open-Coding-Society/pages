import { pythonURI, fetchOptions } from './config.js';

/**
 * Microblog API Module
 * Provides reusable functions for interacting with the microblog API
 */

/**
 * Fetch all microblog posts
 * @returns {Promise<Array>} - Resolves to an array of posts or an error
 */
/**
 * Fetch microblog posts, optionally filtered by page
 * @param {string} [page] - Optional page filter
 * @returns {Promise<Array>} - Resolves to an array of posts or an error
 */
export async function fetchPosts(pagePath) {
    let apiUrl = pythonURI + '/api/microblog';
    if (pagePath) {
        // Encode pagePath as a query parameter
        const param = encodeURIComponent(pagePath);
        apiUrl += `?pagePath=${param}`;
    }
    const options = {
        ...fetchOptions,
        method: 'GET',
    };
    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Microblog posts retrieved:', data);
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Create a new microblog post
 * @param {Object} postData - { content, topicId, ... }
 * @returns {Promise<Object>} - Created post or error
 */
export async function createPost(postData) {
    const apiUrl = pythonURI + '/api/microblog';
    const options = {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(postData)
    };
    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Update an existing microblog post
 * @param {number|string} id - Post ID
 * @param {Object} postData - Fields to update
 * @returns {Promise<Object>} - Updated post or error
 */
export async function updatePost(postData) {
    const apiUrl = pythonURI + `/api/microblog`;
    const options = {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(postData)
    };
    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a reply to a microblog post
 * @param {Object} replyData - { postId, content, topicPath }
 * @returns {Promise<Object>} - Created reply or error
 */
export async function createReply(replyData) {
    const apiUrl = pythonURI + '/api/microblog/reply';
    const options = {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(replyData)
    };
    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch replies for a specific post
 * @param {number|string} postId - Post ID to fetch replies for
 * @returns {Promise<Array>} - Array of replies or error
 */
export async function fetchReplies(postId) {
    const apiUrl = pythonURI + `/api/microblog/reply?postId=${postId}`;
    const options = {
        ...fetchOptions,
        method: 'GET',
    };
    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
