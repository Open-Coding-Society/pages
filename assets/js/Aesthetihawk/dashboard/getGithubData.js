// all comments are lowercase

import { pythonURI, fetchOptions } from '../../api/config.js';

// helper to convert json to html with clickable links
function jsonToHtml(json) {
    const jsonString = JSON.stringify(json, null, 2);
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return jsonString.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
}

// helper to show modal with data
function showModal(data) {
    const modal = document.getElementById('dataModal');
    const modalData = document.getElementById('modalData');
    const closeBtn = document.getElementsByClassName['close'](0);

    modalData.innerHTML = jsonToHtml(data);
    modal.style.display = 'block';

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// main fetch function
export async function fetchGithubData() {
    try {
        // urls to fetch profile links, user data, and commits
        const profileLinksUrl = `${pythonURI}/api/analytics/github/user/profile_links`;
        const userProfileUrl = `${pythonURI}/api/analytics/github/user`;
        const commitsUrl = `${pythonURI}/api/analytics/github/user/commits`;
        const prsUrl = `${pythonURI}/api/analytics/github/user/prs`;
        const issuesUrl = `${pythonURI}/api/analytics/github/user/issues`;

        // define the fetch requests
        const profileLinksRequest = fetch(profileLinksUrl, fetchOptions);
        const userProfileRequest = fetch(userProfileUrl, fetchOptions);
        const commitsRequest = fetch(commitsUrl, fetchOptions);
        const prsRequest = fetch(prsUrl, fetchOptions);
        const issuesRequest = fetch(issuesUrl, fetchOptions);

        // run all fetch requests concurrently
        const [profileLinksResponse, userProfileResponse, commitsResponse, prsResponse, issuesResponse] = await Promise.all([
            profileLinksRequest,
            userProfileRequest,
            commitsRequest,
            prsRequest,
            issuesRequest
        ]);

        // check for errors in the responses
        if (!profileLinksResponse.ok) throw new Error('failed to fetch profile links: ' + profileLinksResponse.statusText);
        if (!userProfileResponse.ok) throw new Error('failed to fetch user profile: ' + userProfileResponse.statusText);
        if (!commitsResponse.ok) throw new Error('failed to fetch commits: ' + commitsResponse.statusText);
        if (!prsResponse.ok) throw new Error('failed to fetch pull requests: ' + prsResponse.statusText);
        if (!issuesResponse.ok) throw new Error('failed to fetch issues: ' + issuesResponse.statusText);

        // parse the json data
        const profileLinks = await profileLinksResponse.json();
        const userProfile = await userProfileResponse.json();
        const commitsData = await commitsResponse.json();
        const prsData = await prsResponse.json();
        const issuesData = await issuesResponse.json();

        // extract counts and arrays
        const commitsArray = commitsData.details_of_commits || [];
        const commitsCount = commitsData.total_commit_contributions || 0;
        const prsArray = prsData.pull_requests || [];
        const prsCount = prsArray.length || 0;
        const issuesArray = issuesData.issues || [];
        const issuesCount = issuesArray.length || 0;

        // extract relevant info from user profile data
        const username = userProfile.login || 'N/A';
        const profileUrl = profileLinks.profile_url || 'N/A';
        const avatarUrl = userProfile.avatar_url || '';
        const publicRepos = userProfile.public_repos || 'N/A';
        const followers = userProfile.followers || 'N/A';

        // update the html elements with the data
        document.getElementById('avatar').src = avatarUrl;
        document.getElementById('username').textContent = `Username: ${username}`;
        // if you want to show profile url, make sure you have an element with id 'profile-url'
        // document.getElementById('profile-url').innerHTML = `Profile URL: <a href="${profileUrl}" target="_blank">${profileUrl}</a>`;
        document.getElementById('public-repos').textContent = `${publicRepos}`;
        document.getElementById('followers').textContent = `${followers} followers`;

        document.getElementById('commits-count').innerHTML = `${commitsCount}`;
        // if you want info-link, add it to the html and uncomment below
        // document.querySelector('#commits-count .info-link').addEventListener('click', (event) => {
        //     event.preventDefault();
        //     showModal(commitsArray);
        // });

        document.getElementById('prs-count').innerHTML = `${prsCount}`;
        // document.querySelector('#prs-count .info-link').addEventListener('click', (event) => {
        //     event.preventDefault();
        //     showModal(prsArray);
        // });

        document.getElementById('issues-count').innerHTML = `${issuesCount}`;
        // document.querySelector('#issues-count .info-link').addEventListener('click', (event) => {
        //     event.preventDefault();
        //     showModal(issuesArray);
        // });

    } catch (error) {
        console.error('error fetching github data:', error);
    }
}