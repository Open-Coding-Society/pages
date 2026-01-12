import { pythonURI, fetchOptions } from './config.js';

/**
 * Gemini AI API Module
 * Provides reusable functions for interacting with Gemini AI endpoints
 */

/**
 * Send a prompt to Gemini AI and get response
 * @param {Object} options - Configuration object
 * @param {string} options.prompt - The AI prompt/instruction
 * @param {string} options.text - The user input text to process
 * @param {string} [options.endpoint='/api/gemini'] - API endpoint
 * @param {boolean} [options.parseJSON=false] - Whether to parse response as JSON
 * @returns {Promise} - Returns promise for chaining
 */
export function queryGemini(options) {
    const {
        prompt,
        text,
        endpoint = '/api/gemini',
        parseJSON = false
    } = options;

    // Validate required parameters
    if (!prompt || !text) {
        return Promise.reject(new Error('Both prompt and text parameters are required'));
    }

    const URL = pythonURI + endpoint;

    const requestOptions = {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({
            prompt: prompt,
            text: text
        })
    };

    return fetch(URL, requestOptions)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(`HTTP ${response.status}: ${text}`); 
                });
            }
            return response.json();
        })
        .then(data => {
            // Handle API-level errors before parsing
            if (data.error || (data.message && !data.success)) {
                let errorMsg = data.error || data.message || "Unknown error";
                
                // Add error code if present
                if (data.error_code) {
                    errorMsg += ` (Error ${data.error_code})`;
                }
                
                // Special handling for authentication errors
                if (data.message && data.message.includes("Authentication")) {
                    errorMsg += " (Login required)";
                }
                
                throw new Error(errorMsg);
            }
            
            // For C4-style responses: Check for successful response with content
            if (data.hasOwnProperty('success') && (!data.success || !data.text)) {
                throw new Error("No clear analysis provided by the backend");
            }
            
            // Conditionally parse JSON based on parseJSON parameter
            if (parseJSON) {
                return parseGeminiResponse(data);
            } else {
                // Return raw data for text/markdown responses (C4 style)
                return data;
            }
        });
}

/**
 * Parse Gemini AI response and extract JSON data
 * Handles various response formats and strips markdown code blocks
 * @param {Object} data - Raw response data from Gemini API
 * @returns {Object} - Parsed JSON object
 */
export function parseGeminiResponse(data) {
    try {
        // Case 1: Response wrapped in 'response' field
        if (data.response) {
            let responseText = typeof data.response === 'string' 
                ? data.response 
                : JSON.stringify(data.response);
            
            // Strip markdown code blocks
            responseText = responseText.replace(/```json\s*|\s*```/g, '').trim();
            return JSON.parse(responseText);
        }
        // Case 2: Response in 'text' field
        else if (data.text) {
            let responseText = data.text;
            // Strip markdown code blocks
            responseText = responseText.replace(/```json\s*|\s*```/g, '').trim();
            return JSON.parse(responseText);
        }
        // Case 3: Return data as-is if it already has expected structure
        else {
            return data;
        }

    } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        throw new Error('AI response was not in expected JSON format');
    }
}