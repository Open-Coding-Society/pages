---
layout: post
title: Create A Sign Up Page Flask Full-Stack web application
description: Full Stack Development with Flask explained by terms and examples.
permalink: /flask-code-sign-up
author: Isabel Marilla
menu: nav/flask.html
toc: True
---

# Introduction
For any web application, the sign-up page is a critical component for developers and users alike. In this tutorial, we'll dive into the process of creating a sign-up page using Flask, a lightweight and versatile Python web framework that is perfect for developing full-stack web applications.

### What You'll Learn

In this step-by-step guide, you'll learn how to:

- Use a basic Flask application.
- Design and implement a user sign-up form.
- Validate form inputs to ensure data integrity.
- Connect the front-end form to the back-end Flask application.
- Store user data securely in a database.

### Building the Sign-Up Page

We'll start by setting up the basic UI outline for the sign up form. Then, we'll talk about the database/API in the backend and how they work together. Next, we'll talk about using the frontend API layer to integrate the frontend and backend. Finally, we'll touch on implementing form validation to prevent errors and ensure the data collected is accurate.

---

# Frontend HTML


For our frontend,  we need a basic outline for our UI. For example, here is the  basic html sign up code I created for this site. As I mentioned in the ideation page, some of the attributes we need are name, github id, password, and the kasm_server_needed attribute (if the user needs a KASM server). When a user submits the form, their  information will be stored in the database. 



```html
<div class="signup-card">
        <h1 id="signupTitle">Sign Up</h1>
        <form id="signupForm" onsubmit="signup(); return false;">
            <p>
                <label>
                    Name:
                    <input type="text" name="name" id="name" required>
                </label>
            </p>
            <p>
                <label>
                    GitHub ID:
                    <input type="text" name="signupUid" id="signupUid" required>
                </label>
            </p>
            <p>
                <label>
                    Password:
                    <input type="password" name="signupPassword" id="signupPassword" required>
                </label>
            </p>
            <p>
                <label>
                    <input type="checkbox" name="kasmNeeded" id="kasmNeeded">
                    Kasm Server Needed
                </label>
            </p>
            <p>
                <button type="submit">Sign Up</button>
            </p>
            <p id="signupMessage" style="color: green;"></p>
        </form>
    </div>
</div> 
```


# Backend Code


As mentioned in flask anatomy, this directory contains files that implement the backend functionality for many of the files in the api directory. In the api directory, the files should contains code that receives and responds to requests from external servers. In this case, the user.py in model implements the backend functionality for the user.py in the api directory. If you generated a template from the flask_2025 repository backend, you should have these files.



The code needed for creating a user is already provided for your in these files here:

The following block of code  is  from user.py in the api directory, under the CRUD class. It processes the HTTP request from the frontend and updates the fields in the database using functions imported by the model.  As you can see, the function uses the POST method to create a user in the backend.


```python
class _CRUD(Resource):  # Users API operation for Create, Read, Update, Delete 
        def post(self): # Create method
            ''' Read data for json body '''
            body = request.get_json()
            
            ''' Avoid garbage in, error checking '''
            # validate name
            name = body.get('name')
            password = body.get('password')
            if name is None or len(name) < 2:
                return {'message': f'Name is missing, or is less than 2 characters'}, 400
            
            # validate uid
            uid = body.get('uid')
            if uid is None or len(uid) < 2:
                return {'message': f'User ID is missing, or is less than 2 characters'}, 400
          
            # Accounts are desired to be GitHub accounts, create must be validated 
            _, status = GitHubUser().get(uid)
            if status != 200:
                return {'message': f'User ID {uid} not a valid GitHub account' }, 404
            
            ''' #1: Setup minimal USER OBJECT '''
            user_obj = User(name=name, uid=uid)
            
            ''' #2: Add user to database '''
            user = user_obj.create(body) # pass the body elements to be saved in the database
            if not user: # failure returns error message
                return {'message': f'Processed {name}, either a format error or User ID {uid} is duplicate'}, 400
            
            return jsonify(user.read())
```



The following block of code is from the user.py in the model, under the User class. This creates a user in the database. 

```python
 # CRUD create/add a new record to the table
    # returns self or None on error
    def create(self, inputs=None):
        try:
            db.session.add(self)  # add prepares to persist person object to Users table
            db.session.commit()  # SqlAlchemy "unit of work pattern" requires a manual commit
            if inputs:
                self.update(inputs) # save additional elements passed on create call
            return self
        except IntegrityError:
            db.session.rollback()
            return None
```

- After the data is sent to the backend, it checks if it meets the requirements, or else it returns an error message
- The code tries to add a user to the database and if there is not an integrity error saves it by committing the change.



# Frontend API Layer

Since the backend code is done for us, all we need is the  frontend API layer to send the request to the backend. The user.py file under api in the backend handles this request and creates a user based on the JSON sent from the frontend. The JSON we send is called the request payload.  In this case, the frontend API layer is located under the script tag. It crucial for integration, or making sure the backend and frontend 'work together'.

```javascript
<script type="module">
    import { login, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    window.signup = function() { // use window for  global function
        const signupOptions = {
            URL: `${pythonURI}/api/user`,
            method: "POST",
            cache: "no-cache",
            body: { // has the elements we need to create a user
                name: document.getElementById("name").value, // use form elements and format them to be sent to the backend, where the data will be processsed
                uid: document.getElementById("signupUid").value,
                password: document.getElementById("signupPassword").value,
                kasm_server_needed: document.getElementById("kasmNeeded").checked,
            }
        };

        fetch(signupOptions.URL, {
            method: signupOptions.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupOptions.body)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Signup failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("signupMessage").textContent = "Signup successful!";
            // Optionally redirect to login page or handle as needed
        })
        .catch(error => {
            console.error("Signup Error:", error);
            document.getElementById("signupMessage").textContent = `Signup Error: ${error.message}`;
        });
    }
```

As you can see in the HTTP Request, the method is a POST, which corresponds to the method in the backend. It's important that we use the correct method for our specific API endpoint, or we will get errors. For example, for the _CRUD class, the api endpoint is api/user. Therefore, the correct api endpoint we should use is the request  is `/api/user`.

Here's the code in the backend API that sets up in endpoint:

``` python
user_api = Blueprint('user_api', __name__,  

                   url_prefix='/api')

```
This code is for the user.py file under the api directory and is 'api' is  prefix for all api endpoints in user.py file. It is in the beginning of the user.py file. 


``` python
api.add_resource(_CRUD, '/user')
```
This adds the /user to the the _CRUD class endpoint. Therefore,  the api endpoint is api/user.



You can try using  [Postman](https://learning.postman.com/docs/introduction/overview/) to test out your  backend API on flask_2025 before starting this part! If you're running flask_2025 locally add the `api/user` to the [localhost](https://blog.hubspot.com/website/what-is-localhost#:~:text=Typically%2C%20you%20can%20access%20the,running%20on%20the%20same%20device.) link.






## Error Handling

What does the try/catch error block do? The try block attempts to send a payload to the backend and process the response.  If the payload is incorrectly formatted, or there is any other issue with the request, an error will be thrown. The catch block catches this error and logs an appropriate message to the console.

Error handling is needed for users and developers. For example, what if a user creates the same user twice? If we have the same uid for both users, we get a 400 BAD REQUEST Error. 

Developers can always check the console and use Postman to understand how to debug code. Thus,  logging the error in the console is important. But why is the sign up message involved? In order for users to have a seamless experience, they need to be informed of how their actions led to  the error. (How that error translates to the user's mistake is up to our interpretation.) 

In this case, we have a signup message element that details the error so text pops up on their screen when they make a mistake.  However, alerting the user might be more a  clear option as well.


# Conclusion

In this tutorial, we walked through the essential steps to create a sign-up page for a Flask full-stack web application. By setting up a Flask environment, designing a user-friendly sign-up form, validating input data, and securely storing user information in a database, we have built a great foundation for user authentication!

### Recap of What We Learned

- Using a  Flask application.
- Creating a sign-up form using HTML and integrating it with Flask.
- Implementing input validation to ensure the integrity of user data.
- Connecting the form to the back-end to handle user registration.
- Storing user data securely using a database.

These steps are fundamental to developing a full-stack web application, and mastering them will enable you to build more complex features and applications in the future. As you continue to develop your Flask skills, consider exploring additional topics such as user login, password recovery, and enhancing security measures. (User Login is also a tab on the navbar, check it out!)

By following this guide, you now have the knowledge and tools to create a functional and secure sign-up page. Keep experimenting, building, and learning to expand your capabilities as a full-stack developer with Flask.

Happy coding!

