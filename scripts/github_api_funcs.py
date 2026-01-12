from datetime import datetime
import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def get_token_dotenv():
    """Retrieve the GitHub token from environment variables."""
    return os.getenv('GITHUB_TOKEN')

# Correcting the get_token_aws function to properly parse the JSON response
def get_token_aws():
    api_endpoint = 'https://7vybv54v24.execute-api.us-east-2.amazonaws.com/GithubSecret'
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(api_endpoint, headers=headers)
        if response.status_code == 200:
            # Assuming the API returns a JSON object with the token in a field named 'token'
            return response.json().get('token')
        else:
            print("Request failed with status code:", response.status_code)
            print("Response:", response.text)
    except Exception as e:
        print("Error:", str(e))
        return None
    
def get_github_token():
    """
    Attempts to retrieve the GitHub token first from environment variables.
    If not found, it falls back to retrieving the token from AWS.
    """
    # Attempt to get the token from .env
    token = get_token_dotenv()
    
    # If the token is not found in .env, attempt to get it from AWS
    if not token:
        print("Token not found in .env, attempting to retrieve from AWS...")
        token = get_token_aws()
        
        # Ensure the token received from AWS is valid
        if not token:
            print("Failed to retrieve token from AWS.")
            return None
    
    return token

def get_target_info():
    """Retrieve the target type and name from environment variables."""
    return os.getenv('GITHUB_TARGET_TYPE'), os.getenv('GITHUB_TARGET_NAME')

def test_token(token):
    """Test the GitHub token by fetching the current user's profile."""
    response = requests.get('https://api.github.com/user', headers={'Authorization': f'token {token}'})
    if response.status_code == 200:
        print("Token is valid.")
        return True
    else:
        print("Token is invalid or expired.")
        return False
    
def list_org_repos(token, org_name):
    """List all repositories for a given organization."""
    url = f'https://api.github.com/orgs/{org_name}/repos'
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()  # List of repositories
    else:
        print(f"Failed to list repositories for {org_name}, Status Code: {response.status_code}")
        return None

def fetch_profile(token, target_type, target_name):
    """Fetch profile information of a specified organization or user."""
    if target_type == 'organization':
        url = f'https://api.github.com/orgs/{target_name}'
    elif target_type == 'user':
        url = f'https://api.github.com/users/{target_name}'
    else:
        print("Invalid target type. Use 'organization' or 'user'.")
        return None

    response = requests.get(url, headers={'Authorization': f'token {token}'})
    if response.status_code == 200:
        return response.json()
    else:
        # Parse the JSON response body to extract the error message
        error_message = json.loads(response.text).get('message', 'Failed to fetch data')
        print(f"Failed to fetch data: {error_message}, status: {response.status_code}")
        return None
    
def fetch_user_commits(token, username):
    """
    Fetches a user's information from GitHub, including repositories and commit counts.
    
    Parameters:
    - token (str): Personal Access Token for GitHub API.
    - username (str): The GitHub username.
    
    Returns:
    - dict: User information including repositories and their commit counts.
    """
    
    # GraphQL query
    # Define the GraphQL query as a multi-line string. The query will:
    # Fetch user information based on the username.
    # Get a list of repositories for the user.
    # For each repository, fetch the number of commits made by the user.
    query = """
    query userInfo($username: String!) {
    user(login: $username) {
        name
        repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
            name
            url
            defaultBranchRef {
            name
            target {
                ... on Commit {
                history {
                    totalCount
                }
                }
            }
            }
        }
        }
    }
    }
    """
    
    # Headers for authorization
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    # Request payload
    payload = {
        "query": query,
        "variables": {"username": username},
    }
    
    # Make the request
    response = requests.post('https://api.github.com/graphql', json=payload, headers=headers)
    
    # Check for errors
    if response.status_code == 200:
        return response.json()  # Return the parsed JSON response
    else:
        raise Exception(f"Query failed to run by returning code of {response.status_code}. {response.text}")

def fetch_user_organization_commits(token, username, organization):
    headers = {"Authorization": f"Bearer {token}"}
    query = f"org:{organization} author:{username}"
    url = f"https://api.github.com/search/commits?q={query}"
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None
        
def list_org_projects(token, org_name):
    """Fetch all projects for a given organization, handling pagination."""
    projects = []
    url = f'https://api.github.com/orgs/{org_name}/projects'
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.inertia-preview+json'
    }
    
    while url:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            projects.extend(response.json())
            # Check if there is a 'next' page
            if 'next' in response.links:
                url = response.links['next']['url']
            else:
                url = None
        else:
            print(f"Failed to fetch projects, status code: {response.status_code}")
            break

    return projects

def list_org_projects_v2(token, org_login):
    """
    Fetch all projectsV2 for a given organization using the GitHub GraphQL API.
    
    Handles pagination to fetch more than the initial 100 projects limit.
    
    Parameters:
    - token (str): GitHub API token for authorization.
    - org_login (str): The login name of the organization.
    
    Returns:
    - list: A list of dictionaries, each containing the id, title, and URL of a project.
    """ 
       
    projects = [] # List to store projects
    graphql_url = 'https://api.github.com/graphql' # GitHub GraphQL API endpoint
    headers = { #  credentials and content type for the request
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    
    ''' 
    GraphQL query to fetch projectsV2 for an organization, 
        - open-coding-society is an example organization
        - example GitHub Projects: https://github.com/orgs/open-coding-society/projects
        - the query fetches ID, title, and URL of each project
        - review GraphQL "query" to see the organization and field names
        
    The query has pagination
        - first fetch returns up to 100 projects 
        - subsequent fetches use the 'endCursor' to fetch the next set 
    '''
    # GraphQL query to fetch projectsV2 for an organization, including pagination support.
    query = """
    query($orgLogin: String!, $cursor: String) {
      organization(login: $orgLogin) {
        projectsV2(first: 100, after: $cursor) {
          edges {
            node {
              id
              title
              url
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    """
    # Variables for the query
    #   - orgLogin: the organization login name
    #   - cursor: pagination cursor, initially set to None which means the first fetch
    variables = {'orgLogin': org_login, 'cursor': None}

    while True:
        # Send a POST request to the GraphQL API with the query and variables defined above
        response = requests.post(graphql_url, headers=headers, json={'query': query, 'variables': variables})
        if response.status_code == 200:
            data = response.json()['data']['organization']['projectsV2'] # location of project 
            projects.extend([edge['node'] for edge in data['edges']]) # add projects to the list 
            if data['pageInfo']['hasNextPage']: # check if there is another page
                variables['cursor'] = data['pageInfo']['endCursor']
            else:
                break # processed all pages
        else:
            print(f"Failed to fetch projectsV2, status code: {response.status_code}")
            break

    return projects

def list_org_projects_v2_with_issues(token, org_login):
    """
    Fetch all projectsV2 for a given organization, including issues for each project.
    
    Parameters:
    - token (str): GitHub API token for authorization.
    - org_login (str): The login name of the organization.
    
    Returns:
    - list: A list of projects with their issues. Each project includes id, title, url, and issues.
            Each issue includes id, title, url, body, and custom fields.
    """
    projects_with_issues = []
    graphql_url = 'https://api.github.com/graphql'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    # GraphQL query to fetch projectsV2 and their issues, including custom fields for each issue.
    query = """
    query($orgLogin: String!, $cursor: String) {
    organization(login: $orgLogin) {
        projectsV2(first: 10, after: $cursor) {
        edges {
            node {
            id
            title
            url
            items(first: 100) {
                nodes {
                id
                ... on ProjectV2Item {
                    type
                    content {
                    ... on Issue {
                        id
                        title
                        url
                        body
                        projectItems(first: 10){
                        nodes{
                            fieldValues(first:10){
                            nodes{
                                ... on ProjectV2ItemFieldTextValue{
                                   text 
                                }
                                ... on ProjectV2ItemFieldNumberValue{
                                   number 
                                }
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
        pageInfo {
            endCursor
            hasNextPage
        }
        }
    }
    }
    """
    variables = {'orgLogin': org_login, 'cursor': None}

    while True:
        response = requests.post(graphql_url, headers=headers, json={'query': query, 'variables': variables})
        response_json = response.json()
        
        # Check for successful response
        if response.status_code == 200:
            if 'errors' in response_json:
                print(f"Error in GraphQL query: {response_json['errors']}")
                break
            
            data = response_json.get('data', {}).get('organization', {}).get('projectsV2', None)
            if data is None:
                print("No projectsV2 data found.")
                break
            
            # Process each project and its issues
            for edge in data['edges']:
                project = edge['node']
                
                # There is some tricky nesting in the projects response
                issues = [{
                    'id': item['content']['id'],
                    'title': item['content']['title'],
                    'url': item['content']['url'],
                    'body': item['content']['body'],
                    'fields': item['content']['projectItems']['nodes'][0]['fieldValues']['nodes']
                } for item in project['items']['nodes'] if item['type'] == 'ISSUE']
                if issues:  # Add project with issues to the result list
                    projects_with_issues.append({
                        'id': project['id'],
                        'title': project['title'],
                        'url': project['url'],
                        'issues': issues
                    })
                    
            # Pagination: Check if there's a next page
            if not data['pageInfo']['hasNextPage']:
                break
            variables['cursor'] = data['pageInfo']['endCursor']
        else:
            print(f"Failed to fetch projectsV2 with issues, status code: {response.status_code}, response: {response_json}")
            break

    return projects_with_issues

def get_project_issues_as_dict(token, target_name, selected_project_title):
    """
    Retrieves issues for a specific project within an organization and formats them as a dictionary.
    
    This function first fetches all projects with their issues for a given organization. It then filters
    out the specific project by title and formats the issues into a more simplified dictionary structure
    for easier consumption.
    
    Parameters:
    - token (str): GitHub API token for authorization.
    - target_name (str): The login name of the organization.
    - selected_project_title (str): The title of the project to retrieve issues for.
    
    Returns:
    - dict: A dictionary containing the project title and a list of issues, each issue also being a dictionary
            with keys for title, url, start_week, start_date, end_date, and body. If the project or issues are
            not found, returns a dictionary with an error key.
    """
    # Fetch all projects with their issues for the given organization
    projects_with_issues = list_org_projects_v2_with_issues(token, target_name)
    
    # Filter for the selected project by title
    selected_project = next((project for project in projects_with_issues if project['title'] == selected_project_title), None)
    project_data = {}

    if selected_project:
        # If the project is found, prepare the project data dictionary
        project_data['title'] = selected_project['title']
        project_data['issues'] = []
        
        # Check if the selected project has issues
        if 'issues' in selected_project and selected_project['issues']:
            for issue in selected_project['issues']:
                # Extract date fields from issue fields
                date_fields = [field['date'] for field in issue['fields'] if 'date' in field]
                
                # Prepare issue data dictionary
                issue_data = {
                    'title': issue['title'],
                    'url': issue['url'],
                    # Extract the start week number, if available
                    'start_week': next((str(int(field['number'])) for field in issue['fields'] if 'number' in field), 'N/A'),
                    # Use the first date field as the start date, if available
                    'start_date': date_fields[0] if date_fields else 'N/A',
                    # Use the second date field as the end date, if available
                    'end_date': date_fields[1] if len(date_fields) > 1 else 'N/A',
                    'body': issue['body']
                }
                project_data['issues'].append(issue_data)
        else:
            # If no issues are found for the project, set an error message
            project_data['error'] = "No issues found for this project."
    else:
        # If the project is not found, set an error message
        project_data['error'] = "Project not found."

    return project_data


if __name__ == "__main__":
    # Main function to test the GitHub API functions
    
    ''' Development Testing: 
    # ENV files allow for easy reuse, changing of tokens and target names
    # Example .env file:
    GITHUB_TOKEN=ghp_1234567890abcdefgh # GitHub Personal Access Token, obtain through GitHub Developer Settings
    GITHUB_TARGET_TYPE=organization  # Use 'organization' or 'user', some items only work for organizations
    GITHUB_TARGET_NAME=open-coding-society # This is a GitHub organization example
    '''

    # Initialize primary data variables 
    profile = None # User or organization profile
    projects = None # List of projects
   
    # Retrieve and validate the token
    token = get_github_token()
    target_type, target_name = get_target_info()
    if token and test_token(token): # Token is valid
        # Test GitHub API with the token, returns the name of the GitHub organization or user 
        profile = fetch_profile(token, target_type, target_name)
        if profile:
            print(f"{target_type.capitalize()} Profile:", profile['name'], profile['html_url'], profile['email'])
        else:
            print("Could not retrieve profile.")
    else:
        print("Exiting due to invalid token.")
    
        
    ''' Organization-specific functions 
    List all repositories, projects, and issues for a given organizationi
    '''
    if profile and target_type == 'organization':
        # List all repositories for organization 
        repos = list_org_repos(token, target_name)
        if repos:
            print(f"Repositories for {target_name}:")
            for repo in repos:
                print(f"- {repo['name']}: {repo['html_url']}")
        else:
            print("Could not retrieve repositories.")
        
        # List all projects for the organization, V1 project only    
        projects = list_org_projects(token, target_name)
        if projects:
            print(f"Projects V1 for {target_name}:")
            for project in projects:
                print(f"- {project['name']}: {project['html_url']}")
        else:
            print("Could not retrieve projects.")
        
        # List all projects for the organization, V2 projects
        projectsV2 = list_org_projects_v2(token, target_name)
        if projectsV2:
            print(f"Projects V2 for {target_name}:")
            for project in projectsV2:
                print(f"- {project['title']}: {project['url']}")
        else:
            print("Could not retrieve projects.")
           
        # Obtain a specific project and its issues   
        selected_project_title = "CSSE 1-2,  2025"
        project_issues = get_project_issues_as_dict(token, target_name, selected_project_title)
        print()
        print(f"Issues for project {project_issues['title']}:")
        for issue in project_issues['issues']:
            print("---")
            print(f"- {issue['title']}, {issue['url']}")
            print(f"Start Week: {issue['start_week']}")
            print(f"Start Date: {issue['start_date']}")
            print(f"End Date: {issue['end_date']}")
            print(f"{issue['body']}")
            print("---")
            
    
    if profile and target_type == 'user':
        # Look a specific user commits
        usernames = ["rachit-j","tanishapatil1234","TDWolff","iKAN2025","tuckergol"]
        organization = "open-coding-society"
        
        for username in usernames:
            print()
            # Look at user's repositories and commit
            """
            user_info = fetch_user_commits(token, username)
            print("Repo Info:", user_info['data']['user']['name'])
            for repo in user_info['data']['user']['repositories']['nodes']:
                print(repo['defaultBranchRef']['target']['history']['totalCount'], repo['name'], repo['url'], repo['defaultBranchRef']['name'])
            
            print() 
            """
            
            # Look at user's commits for a specific organization
            print("Commits for user/organization", username, organization) 
            commits = fetch_user_organization_commits(token, username, organization)
            # Assuming 'commits' is the result from the fetch_user_organization_commits function
            if commits:
                print('Total commits: ', commits['total_count'])
                for commit in commits['items']:
                    commit_url = commit['url']
                    # Make an additional request to fetch detailed commit data
                    response = requests.get(commit_url, headers={"Authorization": f"Bearer {token}"})
                    if response.status_code == 200:
                        commit_data = response.json()
                        additions = commit_data['stats']['additions']
                        deletions = commit_data['stats']['deletions']
                        
                        # Parse and format the commit date as before
                        commit_date_str = commit['commit']['committer']['date']
                        if commit_date_str[-3] == ':':
                            commit_date_str = commit_date_str[:-3] + commit_date_str[-2:]
                        commit_date = datetime.fromisoformat(commit_date_str)
                        formatted_date = commit_date.strftime("%B %d, %Y, %H:%M")
                        
                        # Extract repository name and commit hash from the html_url for a concise display
                        url_parts = commit['html_url'].split('/')
                        repo_name = url_parts[4]  # Assuming standard GitHub URL format
                        commit_hash = url_parts[-1]
                        abbreviated_url = f"{repo_name}@{commit_hash[:7]}"  # Shorten the commit hash for brevity

                        # Print the formatted date, commit message, plus/minus lines, and abbreviated URL
                        print(f"{formatted_date}: {commit['commit']['message']} (+{additions}/-{deletions}) {abbreviated_url}")
                print()