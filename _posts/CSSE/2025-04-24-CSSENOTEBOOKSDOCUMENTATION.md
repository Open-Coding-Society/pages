---
layout: post
title: Web APIs and Local Storage Documentation
description: This documentation provides a comprehensive overview of Web APIs and Local Storage, based on our notebooks. It covers key concepts, implementation details, and practical examples.
categories: [JavaScript]
type: docs
courses: { csse: {week: 17} }
author: Zhengji Li
sections:
  - id: web-apis-overview
    title: "Web APIs Overview"
    content: |
      Web APIs (Application Programming Interfaces) serve as bridges between different software components. In web development, they come in two main forms:

      1. **Browser APIs**
         - Built into web browsers
         - Extend browser functionality
         - Examples: Geolocation, Local Storage, Fetch API

      2. **Server APIs**
         - Run on web servers
         - Provide data and services
         - Examples: REST APIs, GraphQL APIs
    code_examples:
      - title: "Crypto API Example"
        code: |
          const myArray = new Uint32Array(10);
          crypto.getRandomValues(myArray);
          console.log(myArray);
        explanation: "This API generates cryptographically secure random values for security implementations, random key generation, and secure token creation"

  - id: geolocation-api
    title: "Geolocation API"
    content: |
      The Geolocation API provides the user's current location after getting their permission.
    interactive: true
    code_examples:
      - title: "Getting User Location"
        code: |
          function getLocation() {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
            } else {
              console.log("Geolocation not supported");
            }
          }

          function showPosition(position) {
            console.log("Latitude: " + position.coords.latitude);
            console.log("Longitude: " + position.coords.longitude);
          }
        explanation: "This code demonstrates how to request and display a user's geographic coordinates"

  - id: fetch-api
    title: "Fetch API"
    content: |
      The Fetch API provides a modern interface for making HTTP requests.
    interactive: true
    code_examples:
      - title: "Making HTTP Requests"
        code: |
          async function fetchData() {
            try {
              const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
              const data = await response.json();
              console.log('Fetched data:', data);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
        explanation: "This example shows how to fetch data from an API endpoint using async/await"

  - id: local-storage
    title: "Local Storage"
    content: |
      Local Storage is a web storage API that allows websites to store key-value pairs persistently in a user's browser.

      ### Key Features

      1. **Persistence**
         - Data remains after browser closes
         - Survives page refreshes
         - Browser-specific storage

      2. **Storage Limit**
         - Typically 5-10 MB
         - Varies by browser
         - Per-origin storage

      3. **Data Format**
         - Stores strings only
         - Requires JSON conversion for objects
         - Key-value pairs
    code_examples:
      - title: "Basic Storage Operations"
        code: |
          // Storing data
          localStorage.setItem('username', 'pika43');

          // Complex data
          const user = { name: "pika43", age: 15 };
          localStorage.setItem('user', JSON.stringify(user));

          // Retrieving data
          const username = localStorage.getItem('username');
          const storedUser = JSON.parse(localStorage.getItem('user'));

          // Removing data
          localStorage.removeItem('username');
          localStorage.clear();
        explanation: "Examples of storing, retrieving, and removing data from Local Storage"

  - id: practical-applications
    title: "Practical Applications"
    content: |
      Here are some real-world applications of Web APIs and Local Storage.
    code_examples:
      - title: "Theme Preference"
        code: |
          // Save user theme preference
          function saveThemePreference(isDark) {
              localStorage.setItem('darkMode', isDark);
          }

          // Load theme preference
          function loadThemePreference() {
              return localStorage.getItem('darkMode') === 'true';
          }
        explanation: "Implementation of dark mode preference using Local Storage"
      - title: "Form Data Persistence"
        code: |
          // Save form data
          function saveFormData(formData) {
              localStorage.setItem('formData', JSON.stringify(formData));
          }

          // Restore form data
          function restoreFormData() {
              const saved = localStorage.getItem('formData');
              return saved ? JSON.parse(saved) : null;
          }
        explanation: "Saving and restoring form data using Local Storage"

questions:
  - id: q1
    title: "Web APIs Understanding"
    question: "What is the difference between Browser APIs and Server APIs? Provide examples of each."
  
  - id: q2
    title: "Local Storage Implementation"
    question: "How would you implement a shopping cart that persists across page refreshes using Local Storage?"
  
  - id: q3
    title: "API Integration"
    question: "Write a function that fetches data from an API and caches it in Local Storage for future use."
---

{% include tailwind/lesson.html %}

## Web APIs Overview

### What is a Web API?

Web APIs (Application Programming Interfaces) serve as bridges between different software components. In web development, they come in two main forms:

1. **Browser APIs**
   - Built into web browsers
   - Extend browser functionality
   - Examples: Geolocation, Local Storage, Fetch API

2. **Server APIs**
   - Run on web servers
   - Provide data and services
   - Examples: REST APIs, GraphQL APIs

### Key Browser APIs

#### 1. Crypto API
```javascript
const myArray = new Uint32Array(10);
crypto.getRandomValues(myArray);
console.log(myArray);
```
This API generates cryptographically secure random values, useful for:
- Security implementations
- Random key generation
- Secure token creation

#### 2. Geolocation API
```javascript
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation not supported");
  }
}

function showPosition(position) {
  console.log("Latitude: " + position.coords.latitude);
  console.log("Longitude: " + position.coords.longitude);
}
```
Features:
- Gets user's current location
- Requires user permission
- Returns coordinates object

#### 3. Fetch API
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log('Fetched data:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```
Key aspects:
- Makes HTTP requests
- Returns Promises
- Supports async/await
- Handles various data formats

## Local Storage

### Understanding Local Storage

Local Storage is a web storage API that allows websites to store key-value pairs persistently in a user's browser.

### Key Features

1. **Persistence**
   - Data remains after browser closes
   - Survives page refreshes
   - Browser-specific storage

2. **Storage Limit**
   - Typically 5-10 MB
   - Varies by browser
   - Per-origin storage

3. **Data Format**
   - Stores strings only
   - Requires JSON conversion for objects
   - Key-value pairs

### Basic Operations

#### 1. Storing Data
```javascript
// Simple data
localStorage.setItem('username', 'pika43');

// Complex data
const user = { name: "pika43", age: 15 };
localStorage.setItem('user', JSON.stringify(user));
```

#### 2. Retrieving Data
```javascript
// Simple data
const username = localStorage.getItem('username');

// Complex data
const storedUser = JSON.parse(localStorage.getItem('user'));
```

#### 3. Removing Data
```javascript
// Remove specific item
localStorage.removeItem('username');

// Clear all data
localStorage.clear();
```

### Best Practices

1. **Data Handling**
   - Always use try-catch when parsing JSON
   - Check for storage availability
   - Handle storage quota exceeded errors

2. **Security Considerations**
   - Don't store sensitive information
   - Validate stored data before use
   - Clear sensitive data when needed

3. **Performance**
   - Minimize storage operations
   - Batch updates when possible
   - Use appropriate data structures

## Practical Applications

### 1. User Preferences
```javascript
// Save user theme preference
function saveThemePreference(isDark) {
    localStorage.setItem('darkMode', isDark);
}

// Load theme preference
function loadThemePreference() {
    return localStorage.getItem('darkMode') === 'true';
}
```

### 2. Form Data Persistence
```javascript
// Save form data
function saveFormData(formData) {
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Restore form data
function restoreFormData() {
    const saved = localStorage.getItem('formData');
    return saved ? JSON.parse(saved) : null;
}
```

### 3. API Data Caching
```javascript
async function getCachedData(url) {
    const cached = localStorage.getItem(url);
    if (cached) {
        return JSON.parse(cached);
    }
    
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem(url, JSON.stringify(data));
    return data;
}
```

## Common Challenges and Solutions

1. **Storage Limits**
   - Implement data cleanup strategies
   - Use compression when needed
   - Monitor storage usage

2. **Data Type Limitations**
   - Convert objects to JSON
   - Handle complex data structures
   - Validate data integrity

3. **Browser Compatibility**
   - Check for feature support
   - Implement fallbacks
   - Test across browsers

## Conclusion

Web APIs and Local Storage are fundamental tools in modern web development. They enable:
- Rich browser interactions
- Persistent data storage
- Enhanced user experiences
- Efficient data handling

Understanding these technologies is crucial for building robust web applications that can work offline, maintain state, and provide seamless user experiences.

## Additional Resources

- [MDN Web API Documentation](https://developer.mozilla.org/en-US/docs/Web/API)
- [Web Storage API Specification](https://html.spec.whatwg.org/multipage/webstorage.html)
- [JavaScript.info Local Storage Tutorial](https://javascript.info/localstorage)
