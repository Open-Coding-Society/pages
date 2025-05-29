---
layout: base
title: Logout
permalink: /logoutjava
search_exclude: true
---

<script type="module">
    import { fetchOptions, javaURI } from '{{site.baseurl}}/assets/js/api/config.js';
    const URL = javaURI + '/my/logout'; // Assuming javaURI is defined elsewhere
    const options = {
        ...fetchOptions, // Assumes fetchOptions contains necessary headers
        method: 'POST',
        credentials: 'include', // Ensures cookies like JWT are sent with the request
    };
    
    console.log('Logout clicked');

    fetch(URL, options)
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url; // Redirect as per response
            } else if (response.ok) {
                window.location.href = "{{site.baseurl}}/toolkit-login";
            } else {
                console.error('Logout failed:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
</script>

