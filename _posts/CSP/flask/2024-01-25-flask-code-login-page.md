---
layout: post
title: Create A Login Page Flask Full-Stack web application
description: Full Stack Development with Flask explained by terms and examples.
permalink: /flask-code-login
author: Isabel Marilla
menu: nav/flask.html
toc: True
---

## Introduction

In any web application, the login page is essential for user authentication and access control. In this tutorial, we'll explore the process of creating a login page using Flask, a lightweight and versatile Python web framework that is well-suited for full-stack web development.

### What You'll Learn

In this step-by-step guide, you'll learn how to:

- Understand Authentication
- Use a Flask application.
- Design and implement a user login form.
- Validate login credentials to ensure proper authentication.
- Connect the front-end login form to the back-end Flask application.

### Building the Login Page

We'll start by  talk about what <strong> authentication </strong> means and our basic workflow. Then, we'll set up the basic UI outline for the login form. Then, we'll discuss the backend components, especially the user.py file under the api directory.  Next, we'll integrate the frontend with the backend using API calls. Finally, we'll cover implementing credential validation to ensure correct user authentication.

## What is Authentication?

Authentication is the process of verifying the identity of a user or system. In web applications, it typically involves checking user credentials (like usernames and passwords) to confirm their identity. Successful authentication allows users to access their accounts and perform actions based on their roles or permissions.

## Key Concepts in Authentication

- **Credentials**: Information used to verify identity, such as usernames, passwords, and sometimes additional factors like security questions or biometrics.

- **Session Management**: Mechanism to keep track of authenticated users and manage their interactions with the web application. Sessions often involve storing session data on the server or using tokens to identify users. (Eg: Logging in on the backend site has a session id created for you)

- **Token-Based Authentication**: A method where users receive a token (like a JSON Web Token, or JWT) upon successful login. This token is sent with each request to authenticate the user. (We use JWT for handling login with a full stack application.)

- **Password Hashing**: Storing passwords in a secure manner by converting them into a hash using cryptographic algorithms. This ensures that plain-text passwords are not stored in the database (If you check out user.py under the model directory, you'll find the set_password function which generates the hashed password stored in the database)

## Basic Workflow of Authentication

1. **User Registration**:
   - Users create an account by providing necessary information (e.g., username, password).
   - Passwords are hashed and stored securely in the database.

2. **User Login**:
   - Users provide their credentials (e.g., username and password).
   - The server verifies the credentials by comparing the hashed password with the stored hash.
   - Upon successful authentication, the server creates a session or issues a token for the user.

3. **Session Management**:
   - For session-based authentication, a session ID is stored on the server and a cookie is sent to the client.
   - For token-based authentication, the token is included in the HTTP headers of each request to authenticate the user.

4. **Authorization/Access Control**:
   - Determine what actions or resources a user can access based on their role or permissions.

## Frontend HTML

For our frontend, we need a basic outline for our UI. For example, here is the basic HTML login code I created for this site. The attributes we usually see for the login form include username and password.

In accordance with the ideation page, the "username" corresponds with the `uid` element in the backend, so the request payload should include the `uid`.

For our outline though, the "uid" attribute would be hard for users to understand. What does it mean to them? Since the "uid" attribute should be the user's GitHub ID, the label should be GitHub ID. That way, users know how to fill in the form correctly.

(If you need information about styling a login form for your website, you can click on the Style tab above for information about using SASS.)

```python
<div class="login-container">
    <!-- Python Login Form -->
    <div class="login-card">
        <h1 id="pythonTitle">User Login (Python/Flask)</h1>
        <form id="pythonForm" onsubmit="pythonLogin(); return false;">
            <p>
                <label for="uid">
                    GitHub ID:
                    <input type="text" name="uid" id="uid" required>
                </label>
            </p>
            <p>
                <label for="password">
                    Password:
                    <input type="password" name="password" id="password" required>
                </label>
            </p>
            <p>
                <button type="submit">Login</button>
            </p>
            <p id="message" style="color: red;"></p>
        </form>
    </div>
</div> 
```

## Backend Code

If you generated a template from the flask_2025 repository backend, you should have user.py file under model and the user.py file under api. The code needed for authenticating a user's credentials and generating a JSON Web Token for them is already provided for your in these files here:

The following block of code  is  from user.py in the api directory, under the Security class. It processes the HTTP request from the frontend, authenticates the user, and generates a JWT for their session.

```python
class _Security(Resource):
    def post(self):
        try:
            body = request.get_json()
            if not body:
                return {
                    "message": "Please provide user details",
                    "data": None,
                    "error": "Bad request"
                }, 400
            ''' Get Data '''
            uid = body.get('uid')
            if uid is None:
                return {'message': f'User ID is missing'}, 401
            password = body.get('password')
            if not password:
                return {'message': f'Password is missing'}, 401
                        
            ''' Find user '''

            user = User.query.filter_by(_uid=uid).first()
            
            if user is None or not user.is_password(password):
                
                return {'message': f"Invalid user id or password"}, 401
                        
            # Check if user is found
            if user:
                try:
                    token = jwt.encode(
                        {"_uid": user._uid},
                        current_app.config["SECRET_KEY"],
                        algorithm="HS256"
                    )
                    resp = Response("Authentication for %s successful" % (user._uid))
                    resp.set_cookie(current_app.config["JWT_TOKEN_NAME"], 
                            token,
                            max_age=3600,
                            secure=True,
                            httponly=True,
                            path='/',
                            samesite='None'  # This is the key part for cross-site requests

                                        # domain="frontend.com"
                        )
                    print(token)
                    return resp 
                except Exception as e:
                    return {
                                    "error": "Something went wrong",
                                    "message": str(e)
                                }, 500
            return {
                            "message": "Error fetching auth token!",
                            "data": None,
                            "error": "Unauthorized"
                        }, 404
        except Exception as e:
                return {
                            "message": "Something went wrong!",
                            "error": str(e),
                            "data": None
                        }, 500
```

- Login and Token Generation: Validates user credentials and generates a JWT, representing a read operation to verify data with a POST request.
- Accessing the Database Page: Uses a GET request to retrieve and display user credentials, also a read operation as no data modification occurs.

If you look at methods in the backend, other than the post  function for creating a user under CRUD class and for authenticating a user under security function, there is a decorator called `@token_required()`. What does this function do?

Take a look at jwt-authorize.py and **read the comments** to understand what `@token_required()` does. You don't have to understand every line of code, because we are still in the process of learning. However, it is important understand why we use `@token_required()` and why it is important in authentication.

```python
from flask import request
from flask import current_app, g
from functools import wraps
import jwt
from model.user import User

def token_required(roles=None):
    '''
    This function is used to guard API endpoints that require authentication.
    Here is how it works:
      1. checks for the presence of a valid JWT token in the request cookie
      2. decodes the token and retrieves the user data
      3. checks if the user data is found in the database
      4. checks if the user has the required role
      5. set the current_user in the global context (Flask's g object)
      6. returns the decorated function if all checks pass
    Here are some possible error responses:    
      A. 401 / Unauthorized: token is missing or invalid
      B. 403 / Forbidden: user has insufficient permissions
      C. 500 / Internal Server Error: something went wrong with the token decoding
    '''
    def decorator(func_to_guard):
        @wraps(func_to_guard)
        def decorated(*args, **kwargs):
            token = request.cookies.get(current_app.config["JWT_TOKEN_NAME"])
            if not token:
                return {
                    "message": "Authentication Token is missing!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            try:
                # Decode the token and retrieve the user data
                data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
                current_user = User.query.filter_by(_uid=data["_uid"]).first()
                if current_user is None:
                    return {
                        "message": "Invalid Authentication token!",
                        "data": None,
                        "error": "Unauthorized"
                    }, 401
                    
                # Check user has the required role, when role is required 
                if roles and current_user.role not in roles:
                    return {
                        "message": "Insufficient permissions. Required roles: {}".format(roles),
                        "data": None,
                        "error": "Forbidden"
                    }, 403
                    
                # Success finding user and (optional) role
                # Set the current_user in the global context
                # Flask's g object is a global object that lasts for the duration of the request
                # The g.current_user can be referenced in decorated function 
                g.current_user = current_user
            
            # Error exception is for unknown jwt.decode errors 
            except Exception as e:
                return {
                    "message": "Something went wrong decoding the token!",
                    "data": None,
                    "error": str(e)
                }, 500

            # Success, return to the decorated function
            # func_to_guard is the function with the @token_required
            # func_to_guard returns with the original function arguments
            return func_to_guard(*args, **kwargs)

        return decorated

    return decorator



```

To summarize, the global variable `g.current_user` allows us to access and update user information  if they are logged in with the decorator `@token_required()`. This helps us avoid other, more tedious methods, like using local storage to store id information or decoding JWT tokens; The magic of a token being passed with every HTTP request allows us to use a decorator to obtain user information through `@token_required()`.   FYI, if the user isn't logged in, they won't be able to obtain information from the function guarded by the `@token_required()` decorator.

## Frontend API Service Layer

Since the backend code is done for us, all we need is the frontend API layer to send the request to the backend. The idea is when a user submits the form, their credentials will be validated, and they will be authenticated against the database. Part of this code is under the script tag.

```javascript
<script type="module">
    import { login, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Function to handle Python login
    window.pythonLogin = function() {
        const options = {   
            URL: `${pythonURI}/api/authenticate`,
            callback: pythonDatabase,
            message: "message",
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("uid").value,
                password: document.getElementById("password").value,
            }
        };
        login(options);
    }```
```

If you looked at the sign up code, you might have noticed the same import statement from the frontend `API Service Layer`. You also might notice that the frontend `API Service Layer` is a lot shorter than the sign-up code. Why is that?

If we look closely, we see that login is imported from config.js. Let's take a look at config.js.

```python
export var pythonURI;
if (location.hostname === "localhost") {
        pythonURI = "http://localhost:8587";
} else if (location.hostname === "127.0.0.1") {
        pythonURI = "http://127.0.0.1:8587";
} else {
        pythonURI =  "https://flask.opencodingsociety.com";
}
export var javaURI;
if (location.hostname === "localhost") {
        javaURI = "http://localhost:8585";
} else if (location.hostname === "127.0.0.1") {
        javaURI = "http://127.0.0.1:8585";
} else {
        javaURI = "https://spring.opencodingsociety.com";
}

export const fetchOptions = {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, same-origin, omit
    headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'client' // New custom header to identify source
    },
};
// User Login Function 
export function login(options) {
        // Modify the options to use the POST method and include the request body.
        const requestOptions  = {
                ...fetchOptions, // This will copy all properties from options
                method: options.method, // Override the method property
                cache: options.cache, // Set the cache property
                body: JSON.stringify(options.body)
        };

        // Clear the message area
        document.getElementById(options.message).textContent = "";

        // Fetch JWT
        fetch(options.URL, requestOptions)
        .then(response => {
                // Trap error response from Web API
                if (!response.ok) {
                        const errorMsg = 'Login error: ' + response.status;
                        console.log(errorMsg);
                        document.getElementById(options.message).textContent = errorMsg;
                        return;
                }
                // Success!!!
                // Redirect to the Database location
                options.callback();
        })
        .catch(error => {
                // Handle network errors
                console.log('Possible CORS or Service Down error: ' + error);
                document.getElementById(options.message).textContent = 'Possible CORS or service down error: ' + error;
        });
}

```

As you can see, we use the exported  `login function` from `config.js` and pass our parameters accordingly in the the frontend `API Service Layer`. Exporting function may be useful to you to make code shorter and more efficient If you want to learn about updating/reading a lot of user information in a modularized, efficient  approach, check out Profile in the navigation bar!

Also, did you take a look at `fetchOptions`? The fetchOptions are essential for handling Cross-Orgin-Site Requests (CORS) involving JWTs. In simple terms, this is what make sure the server "knows" we're logged in, and we have rights to access and update information about ourselves on the server. These same fetchOptions will be needed for most of our requests where a token is required.

Check out [this link](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) if you are interested in learning more about CORS.

As you can see in the HTTP Request, the method is a POST, which corresponds to the method in the backend. It's important that we use the correct method for our specific API endpoint, or we will get errors. For example, for the _Security , the api endpoint is api/authenticate. Therefore, the correct api endpoint we should use is the request  is `/api/authenticate`.

Here's the code in the backend API that sets up in endpoint:

``` python
user_api = Blueprint('user_api', __name__,  

                   url_prefix='/api')

```

This code is for the user.py file under the api directory and is 'api' is  prefix for all api endpoints in user.py file. It is in the beginning of the user.py file.

``` python
api.add_resource(_Security, '/authenticate')
```

This adds the /authenticate to the the _Security class endpoint. Therefore,  the api endpoint is `api/user`

You can try using  [Postman](https://learning.postman.com/docs/introduction/overview/) to test out your  backend API on flask_2025 before starting this part! If you're running flask_2025 locally add the `api/user` to the [localhost](https://blog.hubspot.com/website/what-is-localhost#:~:text=Typically%2C%20you%20can%20access%20the,running%20on%20the%20same%20device.) link.

## Error Handling

What does the try/catch error block do in the login function for config.js? The try block attempts to `send a payload` to the backend inorder to `process the response`.  If the payload is incorrectly formatted, or there is any other issue with the request, an error will be thrown. The catch block catches this error and logs an appropriate message to the console.

> What's an example of an error we talked about?

- A 401 error

Developers can always check the console and use Postman to understand how to debug code. Thus, logging the error in the console is important. But why is the login message involved? In order for users to have a seamless experience, they need to be informed of how their actions led to  the error. (How that error translates to the user's mistake is up to developers presentation.)

In this case, we have a login message element that details the error so text pops up on their screen when they make a mistake.  However, alerting the user might be a viable option as well.

# Conclusion

In this tutorial, we covered the essential steps to create a functional login page using Flask. Here's a quick recap of what we accomplished:

- **Understanding Authentication:** We discussed the importance of authentication in web applications and how it ensures that only authorized users can access specific resources.
- **Using Flask:** We set up a basic Flask application, highlighting its simplicity and power for building web applications.
- **Designing and Implementing a User Login Form:** We created a user-friendly login form using HTML.
- **Validating Login Credentials:** We implemented backend logic to validate user credentials, ensuring proper authentication.
- **Connecting Frontend to Backend:** We integrated the frontend login form with the backend Flask application using API calls, enabling seamless communication between the two.

By following this guide, you now have a solid foundation for creating a secure login system in Flask. This knowledge can be extended to implement other authentication features such as registration, password reset, and user roles. With Flask's versatility and your new skills, you're well-equipped for your project!

Happy coding!
