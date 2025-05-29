import {baseurl, fetchOptions, pythonURI, javaURI } from './config.js';

// Update User Data with "Put"
export function putUpdate(options) {
    // Modify the options to use the PUT method and include the request body.
    const requestOptions = {
        ...fetchOptions, // This will copy all properties from options
        method: 'PUT', // Override the method property
        cache: options.cache, // Set the cache property
        body: JSON.stringify(options.body)
    };

    // Clear the message area

    // Send PUT request
    fetch(options.URL, requestOptions)
        .then(response => {
            // Trap error response from Web API
            if (!response.ok) {
                const errorMsg = 'Error: ' + response.status;
                console.log(errorMsg);
                return;
            }
            // Success!!!
            // Call the callback function
            options.callback();
        })
        .catch(error => {
            // Handle network errors
            console.log('Possible CORS or Service Down error: ' + error);
           
        });
}



// Update User Data with "POST" 
export function postUpdate(options) {
    // Modify the options to use the POST method and include the request body.
    const requestOptions = {
        ...fetchOptions, // This will copy all properties from options
        method: 'POST', // Override the method property
        cache: options.cache, // Set the cache property
        body: JSON.stringify(options.body)
    };

    // Clear the message area
    // Send POST request
    fetch(options.URL, requestOptions)
        .then(response => {
            // Trap error response from Web API
            if (!response.ok) {
                const errorMsg = 'Error: ' + response.status;
                console.log(errorMsg);
                return;
            }
            // Success!!!
            // Call the callback function
            options.callback();
        })
        .catch(error => {
            // Handle network errors
            console.log('Possible CORS or Service Down error: ' + error);
           
        });
}

export async function logoutUser() {
        const URL = pythonURI + '/api/authenticate'; // Adjusted endpoint for logout
        
         const options = {
                ...fetchOptions,
                method: 'DELETE',
            };
         
         
            console.log('Logout clicked');
         
         
        try {
                const response = await fetch(URL, options);
                if (response.ok) {
                    window.location.href = "${baseurl}/duallogin"; // Redirect to login page
                } else {
                    const errorMessage = await response.text();
                    console.error('Logout failed:', errorMessage);
                    // Optionally display an error message to the user
                }
            } catch (error) {
                console.error('Error during logout:', error.message);
                // Optionally display an error message to the user
            }
         }


 

         
         
         
export function deleteData(options)  {
             // Modify the options to use the DELETE method and include the request body.
             const requestOptions = {
                 ...fetchOptions, // This will copy all properties from options
                 method: 'DELETE', // Override the method property
                 cache: options.cache, // Set the cache property
                 body: JSON.stringify(options.body) // Include the request body
             };
         
             // Clear the message area
         
             // Send DELETE request
             fetch(options.URL, requestOptions)
                 .then(response => {
                     // Trap error response from Web API
                     if (!response.ok) {
                         const errorMsg = 'Error: ' + response.status;
                         console.log(errorMsg);
                         return;
                     }
                     // Success!!!
                     // Call the callback function
                     options.callback();
                 })
                 .catch(error => {
                     // Handle network errors
                     console.log('Possible CORS or Service Down error: ' + error);
                     
                 });
         
             }
         
         // Java User Logout
export async function logoutUserJava() {
             const logoutURL = javaURI + '/my/logout'; // Logout API endpoint
         
             const options = {
                 ...fetchOptions, // Include necessary headers from fetchOptions
                 method: 'POST',
                 credentials: 'include', // Ensure cookies like JWT are included
             };
         
             console.log('Logout initiated.');
         
             try {
                 const response = await fetch(logoutURL, options);
         
                 if (response.redirected) {
                     // Handle server-side redirection
                     window.location.href = response.url;
                 } else if (response.ok) {
                     // Redirect to a specific logout page if the request is successful
                     console.log("Yeah") // Replace with the correct relative URL
                 } else {
                     // Log failure with detailed information
                     console.error('Logout failed:', response.status, response.statusText);
                 }
             } catch (error) {
                 // Handle network or unexpected errors
                 console.error('An error occurred during logout:', error);
             }
         }
         
         

// session
// asynchronous session response
//session call api----?
// then--> javascript promise
// data loaded
// screen establishes 5 different sessions
// talk about play
// iteration style ----> little pieces
// Your teacher likes to iterate -->
// =======
// >>>>>>> 3bc039a1ce9c33f5a7dac69ee7fa36f013b5533f
