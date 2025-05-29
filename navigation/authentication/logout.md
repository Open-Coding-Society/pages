---
layout: base
title: Logout
permalink: /logout
search_exclude: true
---

<script type="module">
    import { fetchOptions, pythonURI } from '{{site.baseurl}}/assets/js/api/config.js';
    const URL = pythonURI + '/api/authenticate'; // Assuming pythonURI is defined elsewhere
    const options = {
        ...fetchOptions, // Assuming fetchOptions is defined elsewhere and includes necessary headers, etc.
        method: 'DELETE',
    };
    console.log('Logout clicked');

    fetch(URL, options)
        .then(response => {
            if (response.ok) {
                window.location.href = "{{site.baseurl}}/login";
                // Successfully called the logout endpoint, now redirect to the current page
            } else {
                // Handle response not ok (e.g., display an error message)
                console.error('Logout failed:', response.statusText);
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error during logout:', error);
        });

</script>
