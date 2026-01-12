import json
import os
import requests
from datetime import datetime

def generate_markdown_file(issue_data, file_path, type):
    """
    Generate a Markdown file for a GitHub issue or pull request.
    
    Args:
        issue_data (dict): Dictionary containing issue or pull request data.
        file_path (str): Path to save the Markdown file.
        type (str): Type of the content, either 'issue' or 'pull_request'.
    """
    with open(file_path, 'w', encoding='utf-8') as file:
        # Write front matter
        file.write('---\n')
        file.write(f"title: '{issue_data['title']}'\n")
        file.write('layout: post\n')  # Adjust layout as needed
        file.write(f"tags: [github, {type}]\n")  # Add relevant tags
        file.write(f"type: {type}\n")
        file.write("description: Automatically Populated GitHub Issue or Pull Request\n")
        file.write('---\n\n')
        
        # Write issue or pull request body
        file.write(f"[{type.capitalize()} Link]({issue_data['url']})\n\n")
        file.write(issue_data['body'] + '\n\n')
        
        # Write comments if available
        if 'comments' in issue_data:
            file.write('## Comments\n\n')
            for comment in issue_data['comments']:
                file.write(f"**{comment['author']['login']}**: {comment['body']}\n\n")

def get_github_repository_issues_and_prs(token, owner, repo):
    # Construct the GraphQL query
    query = f"""
    query {{
        repository(owner: "{owner}", name: "{repo}") {{
            issues(first: 100) {{
                nodes {{
                    title
                    body
                    url
                    createdAt
                    comments(first: 10) {{
                        nodes {{
                            body
                            author {{
                                login
                            }}
                        }}
                    }}
                }}
            }}
            pullRequests(first: 100) {{
                nodes {{
                    title
                    body
                    url
                    createdAt
                    author {{
                        login
                    }}
                    comments(first: 10) {{
                        nodes {{
                            body
                            author {{
                                login
                            }}
                        }}
                    }}
                }}
            }}
        }}
    }}
    """

    # Define headers
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    # Make the request
    response = requests.post(
        "https://api.github.com/graphql",
        json={"query": query},
        headers=headers
    )

    # Check for successful response
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch data:", response.text)
        return None

def create_issues_and_prs():
    token = os.environ.get('GITHUB_TOKEN')  # via GitHub secrets
    owner = "open-coding-society"  # replace with your repository owner
    repo = "flask_2025"  # replace with your repository name

    data = get_github_repository_issues_and_prs(token, owner, repo)
    if not data:
        return

    # Debugging: Print the response data
    print(json.dumps(data, indent=2))

    # Check if 'data' key exists in the response
    if 'data' not in data:
        print("Error: 'data' key not found in the response")
        return
    
    issues = data["data"]["repository"]["issues"]["nodes"]
    pull_requests = data["data"]["repository"]["pullRequests"]["nodes"]

    for issue in issues:
        issue_data = {
            'title': issue["title"],
            'body': issue["body"],
            'url': issue["url"],
            'created_at': issue["createdAt"][:10],
            'comments': issue["comments"]["nodes"]
        }
        generate_markdown_file(issue_data, f"_posts/{issue_data['created_at']}-{issue['title'].replace(' ', '-').replace('/', ' ')}_GithubIssue.md", "issue")

    for pr in pull_requests:
        pr_data = {
            'title': pr["title"],
            'body': pr["body"],
            'url': pr["url"],
            'created_at': pr["createdAt"][:10],
            'comments': pr["comments"]["nodes"]
        }
        generate_markdown_file(pr_data, f"_posts/{pr_data['created_at']}-{pr['title'].replace(' ', '-').replace('/', ' ')}_GithubPR.md", "pull_request")

if __name__ == "__main__":
    create_issues_and_prs()