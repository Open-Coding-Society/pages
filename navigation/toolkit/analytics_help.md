---
title: Analytics Help
permalink: /dashboard/help/analytics
---

## Analytics Help

### Overview

- The Nighthawk Coders' portfolio dashboard visualizes your GitHub activity and predicts grades based on real contributions.

- Designed for both students and admins to track, review, and improve coding engagement.

- Focuses on clarity, interactivity, and actionable insights.

---

## Dashboard Features

- **Tabbed Interface:**  
  - **GitHub Analytics:** View your profile, commits, PRs, issues, and code changes.
  - **Grade Predictor:** Estimate your grade using real GitHub data.
  - **Admin Search:** Admins can look up and compare any user's contributions.

- **Interactive Commit Cards:**  
  - Each card links directly to the commit on GitHub.
  - Shows message, date, additions, deletions, and repository.

- **Modal Popups:**  
  - Click info icons to view raw JSON analytics for commits, PRs, and issues.

- **Admin Tools:**  
  - Search by UID to get a user summary and recent commit cards.

---

## API Overview

- **Blueprint:** `/api/analytics`

- **Security:**  
  - All endpoints require JWT authentication (`@token_required`).
  - Admin endpoints require admin role.

- **Date Ranges:**  
  - Optional; defaults to trimester logic (June–Nov, Nov–Mar, Apr–June).

- **Error Handling:**  
  - Clear error messages for invalid UIDs, API issues, or permission errors.

---

## API Endpoints

- **User Endpoints (JWT Protected):**
  - `GET /github/user` — Fetch your GitHub profile data.
  - `GET /github/user/profile_links` — Get links to your GitHub profile and repositories.
  - `GET /github/user/commits` — Get commit stats, additions, deletions, and details.
  - `GET /github/user/prs` — List your pull requests.
  - `GET /github/user/issues` — List your created issues.
  - `GET /github/user/issue_comments` — Your comments on issues.
  - `GET /github/user/received_issue_comments` — Comments received on your issues.

- **Admin Endpoints:**
  - `GET /commits/<uid>` — View another user's commit data (admin only).
  - `GET /issues/<uid>` — View another user's issue data (admin only).

- **Organization Endpoints:**
  - `GET /github/org/<org_name>/users` — List users in a GitHub organization.
  - `GET /github/org/<org_name>/repos` — List repositories in a GitHub organization.

---

## Backend Logic

- **Authentication:**  
  - All endpoints require a valid JWT token.
  - Admin endpoints check for admin role.

- **Date Handling:**  
  - If no date range is provided, the API uses trimester logic to select a relevant period.

- **GitHub Data Collection:**  
  - Uses both REST and GraphQL APIs for detailed commit, PR, and issue data.
  - Tracks additions, deletions, comments, and more.

- **Error Handling:**  
  - Returns clear error messages for invalid requests or API failures.

---

## Model: `GitHubUser` Class

- **Purpose:**  
  - Handles all GitHub data retrieval for a user.

- **Key Methods:**
  - `get(uid)` — Fetches user profile.
  - `get_profile_links(uid)` — Returns profile and repo URLs.
  - `get_commit_stats(uid, start, end)` — Commit details, additions, deletions.
  - `get_pr_stats(uid, start, end)` — Pull request details.
  - `get_issue_stats(uid, start, end)` — Issue details.
  - `get_total_received_issue_comments(uid, start, end)` — Total comments received.

---

## Smart Grade Logic

- **Metrics Used:**
  - Total commits
  - Lines added and deleted
  - Number of PRs and issues
  - Public repos and gists
  - Followers and following

- **Weighted Formula:**
  ```js
  score += commits * 2
  score += additions * 0.15
  score += deletions * 0.1
  score += prs * 3
  score += issues * 1.5
  score += repos * 1.2
  score += gists * 0.5
  ```

- **Grade Mapping:**
  - 90% (A): score > 70
  - 80% (B): score > 50
  - 70% (C): score > 30
  - 55% (F): score ≤ 30

---

## Visuals

- **User Story Flowchart:**  
  ![User Story Flowchart](https://github.com/user-attachments/assets/d3d4de2f-122f-41e8-b75a-341206f69914)

- **API Diagram:**  
  ![API Diagram](https://github.com/user-attachments/assets/f44da398-cb3d-43ef-b79b-9c6fdd6c30cd)


---

<a href="/dashboard" class="inline-block mb-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold no-underline">
  ← Back to Dashboard
</a>

