/**
 * Example usage of the reusable Gemini API module
 * This file demonstrates various ways to use the gemini.js API module
 */

import { queryGemini } from './api/gemini.js';

// Example 1: Basic AI query returning raw text/markdown (default behavior)
async function basicTextAnalysis() {
    try {
        /**
 * Basic usage examples for the Gemini API module
 * For interactive learning, visit: /hacks/gemini
 */

import { queryGemini } from './gemini.js';

// Example 1: Basic text analysis (C4-style - default behavior)
function analyzeText(prompt, text) {
    return queryGemini({
        prompt: prompt,
        text: text
        // parseJSON: false (default) - returns raw response
    });
}

// Example 2: Structured data extraction (C2-style - JSON parsing)
function extractStructuredData(prompt, text) {
    return queryGemini({
        prompt: prompt,
        text: text,
        parseJSON: true  // parse response as JSON
    });
}

// Example 3: Basic error handling pattern
function safeQuery(prompt, text, parseJSON = false) {
    return queryGemini({
        prompt: prompt,
        text: text,
        parseJSON: parseJSON
    })
    .then(result => {
        console.log('Query successful:', result);
        return result;
    })
    .catch(error => {
        console.error('Query failed:', error.message);
        throw error;
    });
}

// Export functions
export {
    analyzeText,
    extractStructuredData,
    safeQuery
};
        
        // result contains raw response data (for C4-style markdown analysis)
        console.log('Analysis result:', result);
        return result;
    } catch (error) {
        console.error('Analysis failed:', error.message);
    }
}

// Example 2: Citation research requesting JSON parsing (C2-style)
function researchQuoteExample() {
    const CITATION_PROMPT = `Please locate a primary source for the provided text and format response as JSON structure with these exact keys: author, date, title, source, url, formal_quote, intext_citation. The quote is: `;
    
    return queryGemini({
        prompt: CITATION_PROMPT,
        text: "The only way to do great work is to love what you do",
        parseJSON: true  // Request JSON parsing for structured citation data
    })
    .then(citation => {
        console.log('Citation found:', citation);
        // citation is parsed JSON with: author, date, title, source, url, formal_quote, intext_citation
        return citation;
    })
    .catch(error => {
        console.error('Citation research failed:', error.message);
        throw error;
    });
}

// Example 3: Promise chaining with multiple operations
function chainedQueries() {
    // First query
    return queryGemini({
        prompt: "Summarize this in one sentence:",
        text: "Long article text here..."
    })
    .then(summaryData => {
        // summaryData is already parsed and validated
        const summaryText = summaryData.summary || summaryData.text || summaryData;
        
        // Second query using result from first
        return queryGemini({
            prompt: "Extract 5 keywords from this summary:",
            text: summaryText
        });
    })
    .then(keywordsData => {
        console.log('Keywords extracted:', keywordsData);
        return keywordsData;
    })
    .catch(error => {
        console.error('Chained queries failed:', error.message);
        throw error;
    });
}

// Example 4: Simple error handling
function simpleAnalysisExample() {
    return queryGemini({
        prompt: "Analyze this text and return JSON with keys: sentiment, keywords, summary",
        text: "I love this new technology! It's amazing and revolutionary."
    })
    .then(analysisData => {
        // Data is already parsed and validated by the API
        console.log('Analysis completed:', analysisData);
        return analysisData;
    })
    .catch(error => {
        // All errors are already standardized by the API
        console.error('Analysis failed:', error.message);
        throw error;
    });
}

// Example 5: Functional style with validation
function validateAndProcess(userInput) {
    if (!userInput || userInput.trim().length === 0) {
        return Promise.reject(new Error('User input is required'));
    }
    
    return queryGemini({
        prompt: "Validate and improve this text:",
        text: userInput.trim()
    })
    .then(result => {
        // result is already parsed JSON
        if (!result || typeof result !== 'object') {
            throw new Error('Invalid response format');
        }
        return result;
    })
    .catch(error => {
        console.error('Validation and processing failed:', error);
        // Return safe fallback
        return { 
            original: userInput, 
            error: error.message,
            validated: false 
        };
    });
}

// Example 6: Parallel queries (avoid this pattern generally, but shown for completeness)
function parallelQueries(texts) {
    const promises = texts.map(text => 
        queryGemini({
            prompt: "Analyze sentiment:",
            text: text
        })
        .catch(error => ({ error: error.message, text: text }))
    );
    
    return Promise.all(promises)
        .then(results => {
            console.log('All analyses complete:', results);
            return results;
        });
}

// Export for use in other modules
export {
    basicAIQuery,
    researchQuoteExample,
    chainedQueries,
    customParsingExample,
    validateAndProcess,
    parallelQueries
};