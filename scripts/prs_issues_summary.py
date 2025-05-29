import json
import os
import requests
from datetime import datetime

def generate_json_file(data, file_path):
    """
    Generate a JSON file for GitHub issues and pull requests by author.
    
    Args:
        data (dict): Dictionary containing issues and pull requests organized by author.
        file_path (str): Path to save the JSON file.
    """
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

def get_github_repository_issues_and_prs(token, owner, repo):
    # Construct the GraphQL query
    query = f"""
    query {{
        repository(owner: "{owner}", name: "{repo}") {{
            issues(first: 100) {{
                nodes {{
                    title
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
            pullRequests(first: 100) {{
                nodes {{
                    title
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

def create_issues_and_prs_json(owner="open-coding-society", repo="pages"):
    token = os.environ.get('GITHUB_TOKEN')  # via GitHub secrets

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

    # Organize data by author
    author_data = {}

    for issue in issues:
        author = issue["author"]["login"]
        if author not in author_data:
            author_data[author] = {"issues": [], "pull_requests": []}
        author_data[author]["issues"].append({
            'title': issue["title"],
            'url': issue["url"],
            'created_at': issue["createdAt"][:10]
        })

    for pr in pull_requests:
        author = pr["author"]["login"]
        if author not in author_data:
            author_data[author] = {"issues": [], "pull_requests": []}
        author_data[author]["pull_requests"].append({
            'title': pr["title"],
            'url': pr["url"],
            'created_at': pr["createdAt"][:10]
        })

    # Generate JSON file
    generate_json_file(author_data, f"_posts/{repo}-by_author.json")

if __name__ == "__main__":
    create_issues_and_prs_json(repo="pages")
    create_issues_and_prs_json(repo="flask_2025")
    create_issues_and_prs_json(repo="kasm-multi-server")