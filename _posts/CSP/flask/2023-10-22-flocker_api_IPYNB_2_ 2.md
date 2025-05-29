---
layout: post
title: Flocker Start APIs
description: Defing the APIs for the Flocker project
permalink: /flask-flocker-api
toc: True
type: ccc
courses: {'csp': {'week': 10}}
---

## Clone flocker_frontend `https://github.com/open-coding-society/flocker_frontend.git`

To set up the workspace for your frontend project, follow these steps:

1. **Setup Virtual Environment**:
   - Create a virtual environment to manage your project's dependencies:
     ```bash
     python -m venv venv
     ```

2. **Activate Virtual Environment**:
   - Activate the virtual environment to use the isolated Python environment:
     ```bash
     source venv/bin/activate
     ```

3. **Install Required Packages**:
   - Install the necessary packages listed in the `requirements.txt`
     ```bash
     pip install -r requirements.txt
     ```

4. **Start Visual Studio Code**:
   - Open Visual Studio Code in the current directory:
     ```bash
     code .
     ```

5. **Run Make Command**:
   - Use the make build and run the frontend project:
     ```bash
     make
     ```

6. **Access the Web Server**:
   - Click the loopback address (e.g., `http://127.0.0.1:4887`) displayed in the terminal to load the web server in your browser.

## Clone Backend flocker_backend `https://github.com/open-coding-society/flocker_backend.git`

1. **Ensure .env Setup**:
   - Create a `.env` file in the root directory of your project with the following content:
     ```plaintext
     ADMIN_USER='toby'
     ADMIN_PASSWORD='123Toby!'
     DEFAULT_USER='hop'
     DEFAULT_PASSWORD='123Hop!'
     ```
   - This file contains environment variables for admin and default user credentials.

2. **Setup Virtual Environment**:
   - Create a virtual environment to manage your project's dependencies:
     ```bash
     python -m venv venv
     ```

3. **Activate Virtual Environment**:
   - Activate the virtual environment to use the isolated Python environment:
     ```bash
     source venv/bin/activate
     ```

4. **Install Required Packages**:
   - Install the necessary packages listed in the `requirements.txt`
     ```bash
     pip install -r requirements.txt
     ```

5. **Initialize the Database**:
   - Run the database initialization script to set up the database:
     ```bash
     scripts/db_init.py
     ```

## Stop Python processes

If you have problems with port-in-use errors in VSCode, you can stop Python processes

1. **Show Activity Monitor or Task Manager Instances of Python**:
   - Before starting the backend server, open Activity Monitor (on macOS) or Task Manager (on Windows) to show the current instances of Python running.  Filter with python.

2. **Stop Python processese**:
   - Stop the server, look for ways to stop Python proccess, for instance on Mac double click and Force stop.

## Visual Recap

```plaintext
    +---------------+
    | GitHub Pages  |
    | Design, Layout|
    |   Frontend    |
    +---------------+
          |
          | User presentation, style 
          | 
          v
    +--------------+
    |  JavaScript  |
    | Logic/Events |
    +--------------+
          |
          | JS Functionality, interactivity
          | Sends API request
          v
    +----------------+
    | Python / Flask |
    |     Backend    |
    +----------------+
          |
          | Python Server-Side API Processing
          | Communicate with Data Services
          | Replies with Response
          v
    +----------------+
    |  SQL Alchemy   |
    |   Store Data   |
    +----------------+
```

### Text Representation Walk-through

1. **GitHub Pages (Frontend)**:
   - **Design, Layout**: The frontend is hosted on GitHub Pages, where the design and layout are defined.
   - **User Presentation, Style**: This layer is responsible for presenting the user interface and applying styles.

2. **JavaScript (Logic/Events)**:
   - **JS Functionality, Interactivity**: JavaScript adds functionality and interactivity to the frontend.
   - **Sends API Request**: When a user interacts with the frontend, JavaScript sends an API request to the backend.

3. **Python / Flask (Backend)**:
   - **Python Server-Side API Processing**: The Flask backend processes the API requests sent from the frontend.
   - **Communicate with Data Services**: The backend communicates with data services to fetch or store data.
   - **Replies with Response**: After processing the request, the backend sends a response back to the frontend.

4. **SQL Alchemy (Store Data)**:
   - **Store Data**: SQL Alchemy is used to interact with the database, storing and retrieving data as needed.


## Using Postman

Postman is a powerful tool for testing APIs. It allows developers to send HTTP requests to their APIs, inspect responses, and automate testing. Here are some key points and steps to guide your discussion on Postman:

1. **Postman Concepts**:
   - Postman can be used to test individual endpoints of the backend API without needing the frontend to be fully developed.
   - This allows developers to ensure that the backend logic is working correctly before integrating it with the frontend.

2. **Backend / Frontend are independent until Integration**:
   - Developers can verify that each API endpoint behaves as expected, which simplifies debugging and ensures that the backend is robust before integration with the frontend.
   - Postman can help in designing and documenting APIs.
     - By defining the expected inputs and outputs for each endpoint, developers can establish clear requirements for the frontend.
     - This ensures that both frontend and backend teams are aligned on the API specifications.

4. **Postman Demo**:

### Demonstration Steps

1. **Open Postman**:
   - Launch the Postman application on your computer.

2. **Create a New Request**:
   - Click on the "New" button and select "Request".
   - Enter a name for your request and choose a collection to save it in.

3. **Set the Request Method and URL**:
   - Select the HTTP method (e.g., GET, POST, PUT, DELETE) from the dropdown menu.
   - Enter the URL of the API endpoint you want to test (e.g., `http://127.0.0.1:8587/api/jokes`).

4. **Add Request Body (for POST/PUT requests)**:
   - If you are sending data to the server (e.g., for a POST or PUT request), add the request body in the "Body" tab.
   - Select the appropriate format (e.g., JSON) and enter the data.

5. **Send the Request**:
   - Click the "Send" button to send the request to the server.

6. **Inspect the Response**:
   - Review the response returned by the server in the "Response" section.
   - Check the status code, headers, and body to ensure that the API is behaving as expected.

7. **Save the Request**:
   - Save the request in a collection for future use and documentation.

### Summary

- **Testing Frontend in Different Parts**: Use Postman to test individual backend endpoints.
- **Independent Testing**: Verify backend functionality independently before integration.
- **API Design and Documentation**: Use Postman to design and document APIs, establishing clear requirements for the frontend.
- **Demonstration**: Follow the steps to create, send, and inspect requests using Postman.


### Flocker Authenticate through Postman

Here’s how you can use Postman to authenticate users:

Request type `POST`
Endpoint `http://127.0.0.1:8887/api/authenticate`

To authenticate different users, you need to send the appropriate JSON payload in the body of the request. i

Here are examples for different users:
Payload in Body-Raw-JSON 
    Toby: `{"uid": "toby", "password": "123Toby!"}`
    Hop: `http://127.0.0.1:8887/api/authenticate`
    Niko: `{"uid": "niko", "password": "123niko"}`


### Flocker GET requests through Postman

Testing your APIs using Postman will save time!  It will help you determine if backend is working prior to defining frontend.  This enables you to split the work between people or debug backend prior to completing frontend work.

Request type `GET`

Obtain list of Users
Endpoint: `http://127.0.0.1:8887/api/users`

Obtain list of posts for logged in user.  This should change depending on cookies.
Endpoint: `http://127.0.0.1:8887/api/post`

Obtain a list of sections (aka communities) in flocker.
Endpoint: `http://127.0.0.1:8887/api/section`

Obtain a list of groups (aka sub communities) in flocker.
Endpoint: `http://127.0.0.1:8887/api/group`



## Running Deployed Frontend / Backend `https://open-coding-society.github.io/flocker_frontend/`

The frontend is deployed using GitHub Pages, and the backend is deployed using AWS. Pull requests to your integration leads will enable your project to be updated. Teams will fork both repositories and will make pull requests to update their work.

Some samples of frontend to backend interactions already exist in the project.

### Signup and Login `https://open-coding-society.github.io/flocker_frontend/login`

Add your own account and credentials using the signup and login features.

### Test Users

There are three test users in the system:
- `toby` (admin)
- `hop`
- `niko`

### Login and Signup

After logging in, you will see the username at the top of the page `https://open-coding-society.github.io/flocker_frontend/profile`. Hover over the name for other options such as `Post` and `History`. These options help you add and review post history by the user.

### Using the Code from Website Frontend

1. **Access the Frontend**:
   - Navigate to the deployed frontend at `https://open-coding-society.github.io/flocker_frontend/`.

2. **Signup and Login**:
   - Use the signup feature to create a new account or login with existing credentials.
   - Test users (`toby`, `hop`, `niko`) can be used for testing purposes.

3. **Navigate to Profile**:
   - After logging in, go to the profile page at `https://open-coding-society.github.io/flocker_frontend/profile`.
   - Your username will be displayed at the top of the page.

4. **Explore Options**:
   - Hover over your username to see additional options such as `Post` and `History`.
   - Use the `Post` option to add new posts.
   - Use the `History` option to review your post history.

5. **Integration with Backend**:
   - The frontend interacts with the backend deployed on AWS to handle user authentication, post creation, and history retrieval.

6. **Make code updates**
    - To impact or change how things work
    - Update and test code locally running both frontend and backend through VSCode
    - Commit changes to your forked repositories
    - Ensure that your changes are properly integrated by making pull requests to the respective repositories.

## Frontend Code

The code for the frontend is located in the [flocker_frontend repository](https://github.com/open-coding-society/flocker_frontend/tree/main/navigation/authentication). The key files for review are `post.md` and `history.md`. These files fetch the API and format the code on the page.

### Key Points

- **Location**: The code is in the `navigation/authenticate` directory.
- **Key Files**: Review `post.md` and `history.md` for API fetching and page formatting.
- **View in VSCode**: It's best to view these files in VSCode.
- **Inspect in Browser**: Load these files in a browser and use the inspect tool source option to verify if the code is working as expected.



```python
<!-- Walk through the code to understand the process of adding a new post to the database -->

div class="container">
    <div class="form-container">
        <h2>Add New Post</h2>
        <form id="postForm">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required>
            <label for="content">Content:</label>
            <textarea id="content" name="content" required></textarea>
            <label for="group_id">Group:</label>
            <select id="group_id" name="group_id" required>
                <option value="">Select a group</option>
            </select>
            <button type="submit">Add Post</button>
        </form>
    </div>
</div>

<script type="module">
    // Import server URI and standard fetch options
    import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

    // Fetch groups for dropdown selection
    async function fetchGroups() {
        try {
            const response = await fetch(`${pythonURI}/api/group`, fetchOptions);
            if (!response.ok) {
                throw new Error('Failed to fetch groups: ' + response.statusText);
            }
            const groups = await response.json();
            const groupSelect = document.getElementById('group_id');
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }

    // Handle form submission
    document.getElementById('postForm').addEventListener('submit', async function(event) {
        // Prevent default from submission
        event.preventDefault();

        // Extract data from form
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const group_id = document.getElementById('group_id').value;

        // Create API payload
        const postData = {
            title: title,
            content: content,
            group_id: group_id
        };

        // Trap errors
        try {
            // Send POST request to backend, purpose is to write to database
            const response = await fetch(`${pythonURI}/api/post`, {
                ...fetchOptions,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error('Failed to add post: ' + response.statusText);
            }

            // Succesfull post
            const result = await response.json();
            alert('Post added successfully!');
            document.getElementById('postForm').reset();
        } catch (error) {
            // Present alert on error from backend
            console.error('Error adding post:', error);
            alert('Error adding post: ' + error.message);
        }
    });

    // Fetch groups when the page loads
    fetchGroups();
</script>
```

## Backend API

The code for API endpoints is located in the [flocker_backend repository](https://github.com/open-coding-society/flocker_backend/tree/main/api). Key files include `post.py`, `section.py`, and `group.py`. The API is registered in the root `main.py` file.

### Key Points

- **View in VSCode**: It's best to view these files in VSCode.
- **Testing with Postman**: Use Postman and run `main.py` in debug mode to verify code performance.
- **Request Handling**: These files handle `POST`, `GET`, `PUT`, and `DELETE` requests from the frontend.
- **RESTful Responses**: Methods provide RESTful responses containing JSON and status codes (e.g., 200, 500).


```python
# Walk through the code line by line to understand the API CRUD endpoints for the Post model.

class PostAPI:
    """
    Define the API CRUD endpoints for the Post model.
    There are four operations that correspond to common HTTP methods:
    - post: create a new post
    - get: read posts
    - put: update a post
    - delete: delete a post
    """
    class _CRUD(Resource):
        @token_required()
        def post(self):
            # Obtain the current user from the token required setting in the global context
            current_user = g.current_user
            # Obtain the request data sent by the RESTful client API
            data = request.get_json()
            # Create a new post object using the data from the request
            post = Post(data['title'], data['content'], current_user.id, data['group_id'])
            # Save the post object using the Object Relational Mapper (ORM) method defined in the model
            post.create()
            # Return response to the client in JSON format, converting Python dictionaries to JSON format
            return jsonify(post.read())

        @token_required()
        def get(self):
            # Obtain the current user
            current_user = g.current_user
            # Find all the posts by the current user
            posts = Post.query.filter(Post._user_id == current_user.id).all()
            # Prepare a JSON list of all the posts, uses for loop shortcut called list comprehension
            json_ready = [post.read() for post in posts]
            # Return a JSON list, converting Python dictionaries to JSON format
            return jsonify(json_ready)

        @token_required()
        def put(self):
            # Obtain the current user
            current_user = g.current_user
            # Obtain the request data
            data = request.get_json()
            # Find the current post from the database table(s)
            post = Post.query.get(data['id'])
            # Update the post
            post._title = data['title']
            post._content = data['content']
            post._group_id = data['group_id']
            # Save the post
            post.update()
            # Return response
            return jsonify(post.read())

        @token_required()
        def delete(self):
            # Obtain the current user
            current_user = g.current_user
            # Obtain the request data
            data = request.get_json()
            # Find the current post from the database table(s)
            post = Post.query.get(data['id'])
            # Delete the post using the ORM method defined in the model
            post.delete()
            # Return response
            return jsonify({"message": "Post deleted"})

    """
    Map the _CRUD class to the API endpoints for /post.
    - The API resource class inherits from flask_restful.Resource.
    - The _CRUD class defines the HTTP methods for the API.
    """
    api.add_resource(_CRUD, '/post')
```

## Backend Model

The code for model (database) definitions is located in the [flocker_backend repository](https://github.com/open-coding-society/flocker_backend/tree/main/model). Key files include `post.py`, `section.py`, and `group.py`. The model is included in the root `main.py` file.

### Key Points

- **View in VSCode**: It's best to view these files in VSCode.
- **Accessed by API Files**: These model files are accessed by the corresponding API files.
- **Initialization Functions**: Initialization functions at the bottom of these files set up test data.
- **Run Initialization**: The initialization functions are run by the `scripts/db_init.py` script.
- **CRUD Operations**: APIs and init scripts perform CRUD operations on the SQLite database `instance/volumes/user_management.db`.  Use SQLite3 viewer to observe change.



```python
# Walk through the code line by line to understand the Post model.

class Post(db.Model):
    """
    Post Model
    
    The Post class represents an individual contribution or discussion within a group.
    
    Attributes:
        id (db.Column): The primary key, an integer representing the unique identifier for the post.
        _title (db.Column): A string representing the title of the post.
        _content (db.Column): A Text blob representing the content of the post.
        _user_id (db.Column): An integer representing the user who created the post.
        _group_id (db.Column): An integer representing the group to which the post belongs.
    """
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    _title = db.Column(db.String(255), nullable=False)
    _content = db.Column(Text, nullable=False)
    _user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    _group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)

    def __init__(self, title, content, user_id, group_id):
        """
        Constructor, 1st step in object creation.
        
        Args:
            title (str): The title of the post.
            content (str): The content of the post.
            user_id (int): The user who created the post.
            group_id (int): The group to which the post belongs.
        """
        self._title = title
        self._content = content
        self._user_id = user_id
        self._group_id = group_id

    def __repr__(self):
        """
        The __repr__ method is a special method used to represent the object in a string format.
        Called by the repr(post) built-in function, where post is an instance of the Post class.
        
        Returns:
            str: A text representation of how to create the object.
        """
        return f"Post(id={self.id}, title={self._title}, content={self._content}, user_id={self._user_id}, group_id={self._group_id})"

    def create(self):
        """
        The create method adds the object to the database and commits the transaction.
        
        Uses:
            The db ORM methods to add and commit the transaction.
        
        Raises:
            Exception: An error occurred when adding the object to the database.
        """
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        
    def read(self):
        """
        The read method retrieves the object data from the object's attributes and returns it as a dictionary.
        
        Uses:
            The Group.query and User.query methods to retrieve the group and user objects.
        
        Returns:
            dict: A dictionary containing the post data, including user and group names.
        """
        user = User.query.get(self._user_id)
        group = Group.query.get(self._group_id)
        data = {
            "id": self.id,
            "title": self._title,
            "content": self._content,
            "user_name": user.name if user else None,
            "group_name": group.name if group else None
        }
        return data
    
    def update(self):
        """
        The update method commits the transaction to the database.
        
        Uses:
            The db ORM method to commit the transaction.
        
        Raises:
            Exception: An error occurred when updating the object in the database.
        """
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    
    def delete(self):
        """
        The delete method removes the object from the database and commits the transaction.
        
        Uses:
            The db ORM methods to delete and commit the transaction.
        
        Raises:
            Exception: An error occurred when deleting the object from the database.
        """    
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

def initPosts():
    """
    The initPosts function creates the Post table and adds tester data to the table.
    
    Uses:
        The db ORM methods to create the table.
    
    Instantiates:
        Post objects with tester data.
    
    Raises:
        IntegrityError: An error occurred when adding the tester data to the table.
    """        
    with app.app_context():
        """Create database and tables"""
        db.create_all()
        """Tester data for table"""
        
        p1 = Post(title='Calculus Help', content='Need help with derivatives.', user_id=1, group_id=1)  
        p2 = Post(title='Game Day', content='Who is coming to the game?', user_id=2, group_id=2)
        p3 = Post(title='New Releases', content='What movies are you excited for?', user_id=3, group_id=3)
        p4 = Post(title='Study Group', content='Meeting at the library.', user_id=1, group_id=1)
        
        for post in [p1, p2, p3, p4]:
            try:
                post.create()
                print(f"Record created: {repr(post)}")
            except IntegrityError:
                '''fails with bad or duplicate data'''
                db.session.remove()
                print(f"Records exist, duplicate email, or error: {post.uid}")
```
