import os
import requests
from datetime import datetime
import math
import json
from datetime import date
import github_api_funcs as gha


def generate_markdown_file(issue_data, file_path, course):
    """
    Generate a Markdown file for a GitHub issue.
    
    Args:
        issue_data (dict): Dictionary containing issue data.
        file_path (str): Path to save the Markdown file.
    """
    with open(file_path, 'w', encoding='utf-8') as file:

        # Write front matter
        file.write('---\n')
        file.write(f"title: '{issue_data['title']}'\n")
        file.write('layout: post\n')  # Adjust layout as needed
        
        file.write('tags: [github, issue]\n')  # Add relevant tags
        file.write("courses: {'"+ course + "': {'week': " + str(issue_data['week']) + "}}\n")
        file.write("type : issues\n")
        file.write("description : Automatically Populated Github Issue\n")
        file.write('---\n\n')
        # Write issue body
        file.write("[Issue Link](" + issue_data['url'] + ")\n\n")

        file.write(issue_data['body'] + '\n\n')
        
        # Write comments if available
        if 'comments' in issue_data:
            file.write('## Comments\n\n')
            for comment in issue_data['comments']:
                file.write(f"**{comment['user']['login']}**: {comment['body']}\n\n")


# Generate Markdown file
# generate_markdown_file(issue_data, '_posts/sample_issue.md')

def get_github_repository_issues(token=None):
    # we need to move the query logic in yml file in order to support multiple queries, specificallly for CSP and CSSE
    # Construct the GraphQL query, using multiple lines for readability
    query = """
    query {
    organization(login: "open-coding-society") {
        projectsV2(first: 2) {
        nodes {
            items(first: 100) {
            nodes {
                content{
                    ... on Issue {
                    title
                    body
                    url
                    createdAt
                    projectItems(first: 10){
                        nodes{
                            fieldValues(first:5){
                            nodes{
                                ... on ProjectV2ItemFieldValueCommon{
                                ... on ProjectV2ItemFieldDateValue{
                                    date
                                }
                                }
                            }
                            }
                        }
                    }
                }
                }
            }
            }
        }
        }
    }
    }
    """

    # Define headers
    headers = {
        "Authorization": f"Bearer {token}" if token else None,
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

def create_issues():
  # extract the GitHub API token from the secrets in AWS Secrets Manager
  # token = getToken() # via amazon secrets manager
  token = os.environ.get('GITHUB_TOKEN') # via github secrets
  
  # Call the function to get the issues data, then extract a nested data structure from the response, this corresonds to an array of issues
  # we need to extract the specific project data, perhaps "projectsV2" in the code to yml file, so we can run CSP and CSSE with same python script
  csa_data = get_github_repository_issues(token)["data"]["organization"]["projectsV2"]["nodes"][0]["items"]["nodes"]
  # we need to move the data logic into yml file in order to have accurate week calculation
  date1 = datetime(2023, 8, 21)
  for issue in csa_data:
      issue = issue["content"]
      if issue:
        dueDate = date.today().strftime('%Y-%m-%d')  # default value
        for i in [4, 3]:
            try:
                dueDate = issue["projectItems"]["nodes"][0]["fieldValues"]["nodes"][i]["date"]
                break  # if the date is found, exit the loop
            except:
                pass  # if the date is not found, continue with the next index
        year, month, day = map(int, dueDate.split("-"))
        date2 = datetime(year,month,day)
        difference = date2 - date1
        week = difference.days/7
        issue_data = {
            'title': issue["title"],
            'body': issue["body"],
            'url': issue["url"],
            'created_at': issue["createdAt"][:10],
            'week': math.floor(week - 3)
        }
        generate_markdown_file(issue_data, f"_posts/{dueDate}-{issue['title'].replace(' ', '-').replace('/', ' ')}_GithubIssue_.md", "csa")

  # Recieves the CSP data through searching the second project entry rather than the first
  csp_data = get_github_repository_issues(token)["data"]["organization"]["projectsV2"]["nodes"][1]["items"]["nodes"]
  date1 = datetime(2023, 8, 21)
  for issue in csp_data:
      issue = issue["content"]
      if issue:
        dueDate = date.today().strftime('%Y-%m-%d')  # default value
        for i in [4, 3]:
            try:
                dueDate = issue["projectItems"]["nodes"][0]["fieldValues"]["nodes"][i]["date"]
                break  # if the date is found, exit the loop
            except:
                pass  # if the date is not found, continue with the next index
        year, month, day = map(int, dueDate.split("-"))
        date2 = datetime(year,month,day)
        difference = date2 - date1
        week = difference.days/7
        issue_data = {
            'title': issue["title"],
            'body': issue["body"],
            'url': issue["url"],
            'created_at': issue["createdAt"][:10],
            'week': math.floor(week - 3)
        }
        generate_markdown_file(issue_data, f"_posts/{dueDate}-{issue['title'].replace(' ', '-').replace('/', ' ')}_GithubIssue_.md", "csp")


# Not used in this script, but can be used to get the token
def getToken():
    # confirm that this endpoing is storing key that works for all open-coding-society repos 
    api_endpoint = 'https://7vybv54v24.execute-api.us-east-2.amazonaws.com/GithubSecret'

    # Define headers if needed
    headers = {
        'Content-Type': 'application/json',
    }

    try:
        # Make a POST request (or GET, PUT, DELETE, etc. depending on your API)
        response = requests.post(api_endpoint, headers=headers)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            return json.loads(response.json())
        else:
            print("Request failed with status code:", response.status_code)
            print("Response:", response.text)

    except Exception as e:
        print("Error:", str(e))

    
if __name__ == "__main__":
    create_issues()