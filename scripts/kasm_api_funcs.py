import os
from dotenv import load_dotenv
import requests

''' Development Testing notes ...
# KASM server contains setup in Settings -> Developer for API Key and Secret setup
# Editing the KASM developer API key allows adding different permissions for specific API calls
# This script requires .env file file containing the following environment variables:
KASM_SERVER=https://kasm.nighthawkcodingsociety.com  # Set to Production or Test server
KASM_API_KEY=mELdQ44qnXoq   # API Key from KASM Developer settings key creation step
KASM_API_KEY_SECRET=itsASecretToEveryone # API Key Secret from KASM Developer settings key creation step
'''
class KasmConfigurationError(Exception):
    """Custom exception for KASM configuration errors."""
    pass

def get_api_data(endpoint):
    """
    Generic function to make a KASM request to an API.
    
    :param endpoint: Portion of URL for specific KASM API.
    :return: JSON response data if successful, None otherwise.
    """
    
    try:
        # API configurations, each could raise KasmConfigurationError
        url = get_kasm_server() + endpoint
        request_data = get_kasm_request_json()
        # API request, each could raise requests.HTTPError
        response = requests.post(url, json=request_data)
        response.raise_for_status()  # Raises an HTTPError if the response status code is 4XX/5XX
        return response.json()  # Parse JSON response
    except KasmConfigurationError as config_err:
        print(f"Configuration error: {config_err}")
        return None
    except requests.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        return None
    except Exception as err:
        print(f"An error occurred: {err}")
        return None

def get_kasm_server():
    """Retrieve the KASM server from environment variables."""
    server = os.getenv('KASM_SERVER')
    if not server:
        raise KasmConfigurationError("KASM_SERVER environment variable is not set.")
    return server

def get_api_key():
    """Retrieve the KASM token from environment variables."""
    api_key = os.getenv('KASM_API_KEY')
    if not api_key:
        raise KasmConfigurationError("KASM_API_KEY environment variable is not set.")
    return api_key

def get_api_key_secret():
    """Retrieve the KASM token from environment variables."""
    api_key_secret = os.getenv('KASM_API_KEY_SECRET')
    if not api_key_secret:
        raise KasmConfigurationError("KASM_API_KEY_SECRET environment variable is not set.")
    return api_key_secret

def get_kasm_request_json():
    """Structure the KASM API keys into a JSON object.""" 
    return {
        "api_key": get_api_key(),
        "api_key_secret": get_api_key_secret(),
    }

if __name__ == "__main__":
    # Load environment variables from .env file 
    load_dotenv()  

    # KASM API to extract list of users
    # Requires "Users View" permission
    endpoint = "/api/public/get_users" 
    data = get_api_data(endpoint)
    if data:
        print("Total users", data["total"])
        for user in data["users"]:
            print(user["username"], user["last_session"])