import { javaURI, fetchOptions } from './config.js';

/**
 * Robust API helper to handle JSON parsing and error responses
 */
async function robustFetch(url, options) {
    try {
        const response = await fetch(url, options);
        const contentType = response.headers.get("content-type");
        
        if (!response.ok) {
            let errorMessage = `Status: ${response.status}`;
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text() || errorMessage;
            }
            return { success: false, error: errorMessage, status: response.status };
        }

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return { success: true, data };
        } else {
            // Handle success but not JSON (e.g. 204 No Content)
            return { success: true, data: null };
        }
    } catch (error) {
        console.error(`Fetch error at ${url}:`, error);
        return { success: false, error: error.message || "Network error" };
    }
}

/**
 * Identify user via face scanning
 */
export async function identifyFace(image, threshold) {
    const jwtToken = document.cookie.split(';').find(c => c.trim().startsWith('jwt_java_spring='))?.split('=')[1];
    
    return await robustFetch(`${javaURI}/api/person/identify`, {
        ...fetchOptions,
        method: 'POST',
        headers: {
            ...fetchOptions.headers,
            ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` })
        },
        body: JSON.stringify({ image, threshold })
    });
}

/**
 * Add student to bathroom queue
 */
export async function addToQueue(teacherEmail, studentName) {
    return await robustFetch(`${javaURI}/api/bathroom/add`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({ teacherEmail, studentName })
    });
}

/**
 * Remove student from bathroom queue
 */
export async function removeFromQueue(teacherEmail, studentName) {
    return await robustFetch(`${javaURI}/api/bathroom/remove`, {
        ...fetchOptions,
        method: 'DELETE',
        body: JSON.stringify({ teacherEmail, studentName })
    });
}

/**
 * Get current bathroom queue for a teacher
 */
export async function getQueue(teacherEmail) {
    return await robustFetch(`${javaURI}/api/bathroom/queue/${teacherEmail}`, fetchOptions);
}

/**
 * Get current user information
 */
export async function getCurrentUser() {
    return await robustFetch(`${javaURI}/api/person/get`, fetchOptions);
}
