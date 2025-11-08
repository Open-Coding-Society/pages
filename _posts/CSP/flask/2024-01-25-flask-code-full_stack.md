---
layout: post
title: Profile
description: Full Stack Development with Flask explained by terms and examples.
permalink: /flask-code-full-stack
author: Isabel Marilla
menu: nav/flask.html
toc: True
---

 # Introduction
In a web application, the **profile page** plays a crucial role in providing users with a personalized experience. It allows users to view and manage their personal information, update their credentials, and customize their account settings. In this tutorial, we'll explore how to create a dynamic and user-friendly profile page using Flask, a lightweight and versatile Python web framework.

> Before the Lesson:

Before you start, try logging in  and playing around with the profile page features. How do you add a section? What happens when you change your uid and password? This will help you understand **what** the goal of the application is.


### What You'll Learn

In this step-by-step guide, you'll learn how to:
- Create and use a Flask application.
- Design and implement a user profile page.
- Integrate a profile picture upload feature.
- Allow users to update their personal information and credentials.
- Connect the front-end profile form to the back-end Flask application using API calls.

### Building the Profile Page

We'll begin by setting up the basic UI layout for the profile page. Next, we'll dive into creating editable fields for user information, including a profile picture upload feature. We'll then integrate these components with the back-end, specifically focusing on handling API calls and data validation. Finally, we'll ensure the page is responsive and user-friendly, providing a seamless experience for users managing their profiles.


For our frontend,  we need a basic outline for our UI. For example, here is the  basic html profile code I created for this site. 

As I mentioned in the Ideation page, users have these attributes:

- Name of Student
- Github ID of Student 
- Classes Student
- KASM Server 
- uid (Github ID)
- password
- pfp

In the profile, users should be able to change and update ALL of their information. So I includes all of these attributes as fields in the form.



```python
<div class="profile-container">
 <div class="card">
   <form>
     <div>
       <label for="newUid">Enter New UID:</label>
       <input type="text" id="newUid" placeholder="New UID">
     </div>
     <div>
       <label for="newName">Enter New Name:</label>
       <input type="text" id="newName" placeholder="New Name">
     </div>
      <div>
       <label for="newPassword">Enter New Password:</label>
       <input type="text" id="newPassword" placeholder="New Password">
     </div>
     <br>
     <div>
       <label for="kasmServerNeeded">Kasm Server Needed:
       <input type="checkbox" id="kasmServerNeeded" onclick="toggleKasmServerNeeded()">
       </label>
     </div>
     <br>
     <div>
       <label for="sectionDropdown">Select and Add Section:</label>
       <div class="icon-container">
         <select id="sectionDropdown">
           <!-- Options will be dynamically populated -->
         </select>
         <i class="fas fa-plus" onclick="addSection()"></i>
       </div>
     </div>
     <table>
       <thead>
         <tr>
           <th>Abbreviation</th>
           <th>Name</th>
           <th>Year</th>
         </tr>
       </thead>
       <tbody id="profileResult">
         <!-- Table rows will be dynamically populated -->
       </tbody>
     </table>
     <label for="profilePicture" class="file-icon"> Upload Profile Picture <i class="fas fa-upload"></i> <!-- Replace this with your desired icon -->
     </label>
     <input type="file" id="profilePicture" accept="image/*" onchange="saveProfilePicture()">
     <div class="image-container" id="profileImageBox">
         <!-- Profile picture will be displayed here -->
     </div>
     <p id="profile-message" style="color: red;"></p>
   </form>
 </div>
</div>
```

Since users are updating MANY fields, we need to make MANY HTTP requests.
The methods we will be using are: 

- PUT (update uid, name, password, profile picture)
- DELETE (delete sections,  log out (delete JWT) after updating uid/password)


Making multiple requests with the same method for different field is a lot of redundant code! 

Let's take a look at the original code for profile:


```js 
  import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';




  // Global variable to hold predefined sections
  let predefinedSections = [];




  // Function to fetch  sections from kasm2_backend
  async function fetchPredefinedSections() {
      const URL = pythonURI + "/api/section";




      try {
          const response = await fetch(URL, fetchOptions);
          if (!response.ok) {
              throw new Error(`Failed to fetch predefined sections: ${response.status}`);
          }




          return await response.json();
      } catch (error) {
          console.error('Error fetching predefined sections:', error.message);
          return []; // Return empty array on error
      }
  }




  // Function to populate section dropdown menu
  function populateSectionDropdown(predefinedSections) {
      const sectionDropdown = document.getElementById('sectionDropdown');
      sectionDropdown.innerHTML = ''; // Clear existing options




      predefinedSections.forEach(section => {
          const option = document.createElement('option');
          option.value = section.abbreviation;
          option.textContent = `${section.abbreviation} - ${section.name}`;
          sectionDropdown.appendChild(option);
      });




      // Display sections in the table
      displayProfileSections();
  }




  // Global variable to hold user sections
  let userSections = [];




  // Function to add a section
  window.addSection = async function () {
      const dropdown = document.getElementById('sectionDropdown');
      const selectedOption = dropdown.options[dropdown.selectedIndex];
      const abbreviation = selectedOption.value;
      const name = selectedOption.textContent.split(' ').slice(1).join(' ');




      if (!abbreviation || !name) {
          document.getElementById('profile-message').textContent = 'Please select a section from the dropdown.';
          return;
      }




      // Clear error message
      document.getElementById('profile-message').textContent = '';




      // Add section to userSections array if not already added
      const sectionExists = userSections.some(section => section.abbreviation === abbreviation && section.name === name);
      if (!sectionExists) {
          userSections.push({ abbreviation, name });




          // Display added section in the table
          displayProfileSections();




          // Save sections immediately
          await saveSections();
      }
  }




  // Function to display added sections in the table
  function displayProfileSections() {
      const tableBody = document.getElementById('profileResult');
      tableBody.innerHTML = ''; // Clear existing rows




      userSections.forEach(section => {
          const tr = document.createElement('tr');
          const abbreviationCell = document.createElement('td');
          const nameCell = document.createElement('td');




          abbreviationCell.textContent = section.abbreviation;
          nameCell.textContent = section.name;




          tr.appendChild(abbreviationCell);
          tr.appendChild(nameCell);




          tableBody.appendChild(tr);
      });
  }




  // Function to save sections in the specified format
  async function saveSections() {
      const sectionAbbreviations = userSections.map(section => section.abbreviation);




      const sectionsData = {
          sections: sectionAbbreviations
      };




      const URL = pythonURI + "/api/user/section"; // Adjusted endpoint




      const options = {
          ...fetchOptions,
          method: 'POST',
          body: JSON.stringify(sectionsData)
      };




      try {
          const response = await fetch(URL, options);
          if (!response.ok) {
              throw new Error(`Failed to save sections: ${response.status}`);
          }
          console.log('Sections saved successfully!');




          // Fetch updated data and update table immediately after saving
          await fetchDataAndPopulateTable();
      } catch (error) {
          console.error('Error saving sections:', error.message);
          // Handle error display or fallback mechanism
      }
  }




  // Function to fetch data from the backend and populate the table
  async function fetchDataAndPopulateTable() {
      const URL = pythonURI + "/api/user/section"; // Endpoint to fetch sections data




      try {
          const response = await fetch(URL, fetchOptions);
          if (!response.ok) {
              throw new Error(`Failed to fetch sections: ${response.status}`);
          }




          const sectionsData = await response.json();
          updateTableWithData(sectionsData); // Call function to update table with fetched data
      } catch (error) {
          console.error('Error fetching sections:', error.message);
          // Handle error display or fallback mechanism
      }
  }




  // Function to update table with fetched data
  function updateTableWithData(data) {
      const tableBody = document.getElementById('profileResult');
      tableBody.innerHTML = ''; // Clear existing rows




      data.sections.forEach(section => {
          const tr = document.createElement('tr');
          const abbreviationCell = document.createElement('td');
          const nameCell = document.createElement('td');




          abbreviationCell.textContent = section.abbreviation;
          nameCell.textContent = section.name;




          tr.appendChild(abbreviationCell);
          tr.appendChild(nameCell);




          tableBody.appendChild(tr);
      });
  }




  // Function to fetch user profile data
  async function fetchUserProfile() {
      const URL = pythonURI + "/api/id/pfp"; // Endpoint to fetch user profile data




      try {
          const response = await fetch(URL, fetchOptions);
          if (!response.ok) {
              throw new Error(`Failed to fetch user profile: ${response.status}`);
          }




          const profileData = await response.json();
          displayUserProfile(profileData);
      } catch (error) {
          console.error('Error fetching user profile:', error.message);
          // Handle error display or fallback mechanism
      }
  }




  // Function to display user profile data
  function displayUserProfile(profileData) {
      const profileImageBox = document.getElementById('profileImageBox');
      if (profileData.pfp) {
          const img = document.createElement('img');
          img.src = `data:image/jpeg;base64,${profileData.pfp}`;
          img.alt = 'Profile Picture';
          profileImageBox.innerHTML = ''; // Clear existing content
          profileImageBox.appendChild(img); // Append new image element
      } else {
          profileImageBox.innerHTML = '<p>No profile picture available.</p>';
      }




      // Display other profile information as needed
      // Example: Update HTML elements with profileData.username, profileData.email
  }




  // Function to save profile picture
  window.saveProfilePicture = async function () {
      const fileInput = document.getElementById('profilePicture');
      const file = fileInput.files[0];
      if (!file) return;
      try {
          const base64String = await convertToBase64(file);
          await sendProfilePicture(base64String);
          console.log('Profile picture uploaded successfully!');
      } catch (error) {
          console.error('Error uploading profile picture:', error.message);
          // Handle error display or fallback mechanism
      }
  }




  // Function to fetch profile picture data
  async function fetchProfilePictureData() {
      try {
          const response = await fetch('/api/id/pfp', {
              method: 'GET',
          });
          if (!response.ok) {
              throw new Error('Failed to fetch profile picture data');
          }
          const imageData = await response.json();
          return imageData; // Assuming the backend returns JSON data
      } catch (error) {
          console.error('Error fetching profile picture data:', error.message);
          throw error;
      }
  }




  // Function to convert file to base64
  async function convertToBase64(file) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the prefix part of the result
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
      });
  }




  // Function to send profile picture to server
  async function sendProfilePicture(base64String) {
      const URL = pythonURI + "/api/id/pfp"; // Adjust endpoint as needed
      const options = {
          ...fetchOptions,
          method: 'PUT',
          body: JSON.stringify({ pfp: base64String })
      };




      try {
          const response = await fetch(URL, options);
          if (!response.ok) {
              throw new Error(`Failed to upload profile picture: ${response.status}`);
          }
          console.log('Profile picture uploaded successfully!');
          // Handle success response as needed
      } catch (error) {
          console.error('Error uploading profile picture:', error.message);
          // Handle error display or fallback mechanism
      }
  }




  // Function to preview profile picture
  window.previewProfilePicture = function(input) {
      const file = input.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function() {
              const profileImageBox = document.getElementById('profileImageBox');
              profileImageBox.innerHTML = `<img src="${reader.result}" alt="Profile Picture">`;
          };
          reader.readAsDataURL(file);
      }
  }


    window.changeName = async function() {
    const newName = document.getElementById('newName').value.trim();
    const URL = pythonURI + "/api/user"; // Adjusted endpoint




    if (!newName) {
        alert('Please enter a new name.');
        return;
    }




    const data = { name : newName };




    const options = {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(data)
    };




    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(`Failed to change UID: ${response.status}`);
        }
        console.log('Name changed successfully!');




        // Optionally, refresh data or UI after UID change
    } catch (error) {
        console.error('Error changing UID:', error.message);
        // Handle error display or fallback mechanism
    }
};


  window.changeUid = async function() {
    const newUid = document.getElementById('newUid').value.trim();
    const URL = pythonURI + "/api/user"; // Adjusted endpoint




    if (!newUid) {
        alert('Please enter a new UID.');
        return;
    }




    const data = { uid: newUid };




    const options = {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(data)
    };




    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(`Failed to change UID: ${response.status}`);
        }
        console.log('UID changed successfully!');




        // Optionally, refresh data or UI after UID change
    } catch (error) {
        console.error('Error changing UID:', error.message);
        // Handle error display or fallback mechanism
    }
};

window.changePassword = async function() {
    const newPassword = document.getElementById('newPassword').value.trim();
    const URL = pythonURI + "/api/user"; // Adjusted endpoint




    if (!newUid) {
        alert('Please enter a new UID.');
        return;
    }




    const data = { password: newPassword };




    const options = {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(data)
    };




    try {
        const response = await fetch(URL, options);
        if (!response.ok) {
            throw new Error(`Failed to change UID: ${response.status}`);
        }
        console.log('UID changed successfully!');




        // Optionally, refresh data or UI after UID change
    } catch (error) {
        console.error('Error changing UID:', error.message);
        // Handle error display or fallback mechanism
    }
};


window.fetchKasmServerNeeded = async function() {
   const URL = pythonURI + "/api/id"; // Adjusted endpoint


   try {
       const response = await fetch(URL, fetchOptions);
       if (!response.ok) {
           throw new Error(`Failed to fetch kasm_server_needed: ${response.status}`);
       }


       const userData = await response.json();
       const kasmServerNeeded = userData.kasm_server_needed


       // Update checkbox state based on fetched value
       const checkbox = document.getElementById('kasmServerNeeded');
       checkbox.checked = kasmServerNeeded;
   } catch (error) {
       console.error('Error fetching kasm_server_needed:', error.message);
       // Handle error display or fallback mechanism
   }
};


// Function to toggle kasm_server_needed attribute on checkbox change
window.toggleKasmServerNeeded = async function() {
   const checkbox = document.getElementById('kasmServerNeeded');
   const newKasmServerNeeded = checkbox.checked;


   const URL = pythonURI + "/api/user"; // Adjusted endpoint


   const data = {
       kasm_server_needed: newKasmServerNeeded
   };


   const options = {
       ...fetchOptions,
       method: 'PUT',
       body: JSON.stringify(data)
   };


   try {
       const response = await fetch(URL, options);
       if (!response.ok) {
           throw new Error(`Failed to update kasm_server_needed: ${response.status}`);
       }
       console.log('Kasm Server Needed updated successfully!');
   } catch (error) {
       console.error('Error updating kasm_server_needed:', error.message);
       // Handle error display or fallback mechanism
   }
};
     window.fetchUid = async function() {
      const URL = pythonURI + "/api/id"; // Adjusted endpoint


      try {
          const response = await fetch(URL, fetchOptions);
          if (!response.ok) {
              throw new Error(`Failed to fetch UID: ${response.status}`);
          }


          const data = await response.json();
          return data.uid;
      } catch (error) {
          console.error('Error fetching UID:', error.message);
          return null;
      }
  };


  // Function to fetch Name from backend
  window.fetchName = async function() {
      const URL = pythonURI + "/api/id"; // Adjusted endpoint


      try {
          const response = await fetch(URL, fetchOptions);
          if (!response.ok) {
              throw new Error(`Failed to fetch Name: ${response.status}`);
          }


          const data = await response.json();
          return data.name;
      } catch (error) {
          console.error('Error fetching Name:', error.message);
          return null;
      }
  };


  // Function to set placeholders for UID and Name
  window.setPlaceholders = async function() {
      const uidInput = document.getElementById('newUid');
      const nameInput = document.getElementById('newName');


      try {
          const uid = await window.fetchUid();
          const name = await window.fetchName();


          if (uid !== null) {
              uidInput.placeholder = uid;
          }
          if (name !== null) {
              nameInput.placeholder = name;
          }
      } catch (error) {
          console.error('Error setting placeholders:', error.message);
      }
  };




  // Call fetchPredefinedSections and initializeProfileSetup when DOM content is loaded
  document.addEventListener('DOMContentLoaded', async function () {
      try {
          predefinedSections = await fetchPredefinedSections();
          console.log('Predefined Sections:', predefinedSections);
          populateSectionDropdown(predefinedSections); // Populate dropdown with fetched sections
          await fetchUserProfile(); // Fetch user profile data
          await fetchDataAndPopulateTable(); // Fetch and populate table with user sections
          await fetchKasmServerNeeded();
          await setPlaceholders();
      } catch (error) {
          console.error('Initialization error:', error.message);
          // Handle initialization error gracefully
      }
  }); 
  ```






It's a lot of repeating code, isn't it? We need to <strong> optimize </strong> our code. But....how?

Remember config.js from the Login tab? We exported a function called login that set up a request template for us, so all we had to do was fill in the appropriate parameters. 

We can do the same thing here by creating a new javascript file, called profile.js, write functions with different methods that can be exported. 

```js

import {fetchOptions, pythonURI } from './config.js';



// Update User Data with "Put"
export function putUpdate(options) {
    // Modify the options to use the PUT method and include the request body.
    const requestOptions = {
        ...fetchOptions, // This will copy all properties from options
        method: 'PUT', // Override the method property
        cache: options.cache, // Set the cache property
        body: JSON.stringify(options.body)
    };

    // Clear the message area

    // Send PUT request
    fetch(options.URL, requestOptions)
        .then(response => {
            // Trap error response from Web API
            if (!response.ok) {
                const errorMsg = 'Error: ' + response.status;
                console.log(errorMsg);
                return;
            }
            // Success!!!
            // Call the callback function
            options.callback();
        })
        .catch(error => {
            // Handle network errors
            console.log('Possible CORS or Service Down error: ' + error);
           
        });
}
// Update User Data with "POST" 
export function postUpdate(options) {
    // Modify the options to use the POST method and include the request body.
    const requestOptions = {
        ...fetchOptions, // This will copy all properties from options
        method: 'POST', // Override the method property
        cache: options.cache, // Set the cache property
        body: JSON.stringify(options.body)
    };

    // Clear the message area
    document.getElementById(options.message).textContent = "";

    // Send POST request
    fetch(options.URL, requestOptions)
        .then(response => {
            // Trap error response from Web API
            if (!response.ok) {
                const errorMsg = 'Error: ' + response.status;
                console.log(errorMsg);
                document.getElementById(options.message).textContent = errorMsg;
                return;
            }
            // Success!!!
            // Call the callback function
            options.callback();
        })
        .catch(error => {
            // Handle network errors
            console.log('Possible CORS or Service Down error: ' + error);
           
        });
}

export function deleteData(options)  {
    // Modify the options to use the DELETE method and include the request body.
    const requestOptions = {
        ...fetchOptions, // This will copy all properties from options
        method: 'DELETE', // Override the method property
        cache: options.cache, // Set the cache property
        body: JSON.stringify(options.body) // Include the request body
    };

    // Clear the message area

    // Send DELETE request
    fetch(options.URL, requestOptions)
        .then(response => {
            // Trap error response from Web API
            if (!response.ok) {
                const errorMsg = 'Error: ' + response.status;
                console.log(errorMsg);
                return;
            }
            // Success!!!
            // Call the callback function
            options.callback();
        })
        .catch(error => {
            // Handle network errors
            console.log('Possible CORS or Service Down error: ' + error);
            
        });

    }
export async function logoutUser() {
        const URL = pythonURI + '/api/authenticate'; // Adjusted endpoint for logout
        
         const options = {
                ...fetchOptions,
                method: 'DELETE',
            };
         
         
            console.log('Logout clicked');
         
         
        try {
                const response = await fetch(URL, options);
                if (response.ok) {
                    window.location.href = "/pages/login"; // Redirect to login page
                } else {
                    const errorMessage = await response.text();
                    console.error('Logout failed:', errorMessage);
                    // Optionally display an error message to the user
                }
            } catch (error) {
                console.error('Error during logout:', error.message);
                // Optionally display an error message to the user
            }
         }


```

What we did is called <strong> modularization </strong>. Modularization is a practice of organizing a codebase into loosely coupled and self contained parts. Each part is a module. Each module is independent and serves a clear purpose.


For example, the putUpdate is a module! Every time we use a put request to update a field, we can use putUpdate!






<strong> We can include code from profile.js and config.js in our profile.md file using these import statements. This is so we can use the variables and functions provided in config.js and profile.js! </strong>

```js


// Import fetchOptions from config.js
import {pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
// Import functions from config.js
import { putUpdate, postUpdate, deleteData, logoutUser } from "{{site.baseurl}}/assets/js/api/profile.js";



```

# **Name, UID, Password, Kasm Server**

# UPDATE

Let's talk about the backend code for  updating the name, uid, password, and kasm_server_needed field first. Since the user updates fields one a time, we need to make similar HTTP requests multiple times, with different request payloads.

## Backend Code

This code is from user.py file under the api directory , which processes the HTTP request and updates the name, uid, password, and kasm_server_needed fields in the database using functions imported by the model. This code is under the CRUD class.

```python
 @token_required()
        def put(self):
            ''' Retrieve the current user from the token_required authentication check '''
            current_user = g.current_user

            ''' Read data for json body '''
            body = request.get_json()

            ''' Error checking '''
            section_data = body.get('section')
            if not section_data:
                return {'message': 'Section data is required'}, 400
            
            if not section_data.get('abbreviation'):
                return {'message': 'Section abbreviation is required'}, 400
            
            if not section_data.get('year'):
                return {'message': 'Section year is required'}, 400

            ''' Update section year '''
            if not current_user.update_section(section_data):
                return {'message': f'Section {section_data.get("abbreviation")} not found or update failed'}, 404

            return jsonify(current_user.read_sections())

```

The following code is from the user.py file under model, which helps update name, uid, password, and kasm_server_needed in the database. PFP/Sections are covered in other parts of the model code. This function is from user.py in model directory, appropriately under the User class because it handles updating data for a user.

```python
    def update(self, name="", uid="", password="", pfp=None, kasm_server_needed=None):
        """only updates values with length"""
        if len(name) > 0:
            self.name = name
        if len(uid) > 0:
            self.uid = uid
        if len(password) > 0:
            self.set_password(password)
        if pfp is not None:  # here we explicitly check for None to allow setting pfp to None. PFP will always be NONE in this case. We use 'POST' to update pfp.
            self.pfp = pfp
        if kasm_server_needed is not None:
            self.kasm_server_needed = kasm_server_needed
        db.session.commit()
        return self

```

###  Updating Name in Frontend API Service Layer


Since the backend code is done for us, all we need is the frontend API layer to send the request to the backend to update the name. We don't have buttons to click for 'Change Name' so we have to check whether the input field is filled using event listeners to know when to update name.


- Checks if Name Field is filled
```js

// Event listener to trigger updateName function when Name field is changed
document.getElementById('newName').addEventListener('change', function() {
    const name = this.value;
    window.changeName(name);


});
```

- Changes Name 
```js

window.changeName = async function(name) {
   if (name) {
       const URL = pythonURI + "/api/user";
       const options = {
           URL,
           body: { name },
           message: 'name-message',
           callback: () => {
               console.log('Name updated successfully!');
               window.updateNameField(name);
           }
       };
       try {
           await putUpdate(options);
       } catch (error) {
           console.error('Error updating Name:', error.message);
           document.getElementById('name-message').textContent = 'Error updating Name: ' + error.message;
       }
   }
}

```





###  Updating UID in Frontend API Service Layer

We make a similar request for the uid. We don't have buttons to click for 'Change UID' so we have to check whether the input field is filled using event listeners to know when to update  uid. 


Changing uid logs user out immediately, so we can simply redirect them to the login page.

```js

// Function to change UID
window.changeUid = async function(uid) {
   if (uid) {
       const URL = pythonURI + "/api/user"; // Adjusted endpoint


       const options = {
           URL,
           body: { uid },
           message: 'uid-message', // Adjust the message area as needed
           callback: () => {
               console.log('UID updated successfully!');
               window.updateUidField(uid);
               window.location.href = '/pages/login'
           }
       };


       try {
           await putUpdate(options);
       } catch (error) {
           console.error('Error updating UID:', error.message);
           document.getElementById('uid-message').textContent = 'Error updating UID: ' + error.message;
       }
   }
}

```

###  Updating Password in Frontend API Service Layer


We make a similar request for password. However, changing the password, doesn't logout the user immediately, so we need to use the logoutUser function exported from profile.js

```js

window.changePassword = async function(password) {
   if (password) {
       const URL = pythonURI + "/api/user"; // Adjusted endpoint


       const options = {
           URL,
           body: { password },
           message: 'password-message', // Adjust the message area as needed
           callback: () => {
               console.log('Password updated successfully!');
               window.updatePasswordField(password);
               window.location.href = '/pages/login'


           }
       };


       try {
           await putUpdate(options);
           await logoutUser();
       } catch (error) {
           console.error('Error updating password:', error.message);
           document.getElementById('password-message').textContent = 'Error updating password: ' + error.message;
       }
   }
}

```


###  Updating KASM  in Frontend API Service Layer

This is similar to the code blocks above, but we instead of an string in an input field, we are using a value of checkbox  for KASM server needed(check or unchecked). So, we need to approach the request in a slightly  different way.


```js

window.toggleKasmServerNeeded = async function() {
   const checkbox = document.getElementById('kasmServerNeeded');
   const newKasmServerNeeded = checkbox.checked;
   const URL = pythonURI + "/api/user"; // Adjusted endpoint
   const options = {
       URL,
       body: { kasm_server_needed: newKasmServerNeeded },
       message: 'kasm-server-message', // Adjust the message area as needed
       callback: () => {
           console.log('Kasm Server Needed updated successfully!');
       }
   };


   try {
       await putUpdate(options);
   } catch (error) {
       console.error('Error updating kasm_server_needed:', error.message);
       document.getElementById('kasm-server-message').textContent = 'Error updating kasm_server_needed: ' + error.message;
   }
} ```



# READ

Let's talk about the backend code for  reading the name, uid, and kasm_server_needed data from the backend so the user can check the  verify the attributes of their profile. This also reads the sections/pfp data! This data we get from the server is called response data!

However, we can't 'read' the password data for a user.  Why? Let's find out...


This code is from user.py file under the api directory,  which processes the HTTP request and 'reads'  the fields in the database using functions imported by the model. This function sends this data to the frontend in JSON. This code is under the _ID class, and has the `/api/id` endpoint.


```python
    class _ID(Resource):  # Individual identification API operation
        @token_required()
        def get(self):
            ''' Retrieve the current user from the token_required authentication check '''
            current_user = g.current_user
            ''' Return the current user as a json object '''
            return jsonify(current_user.read())
```

Typically, you would use GET function under the _CRUD class, which has the `api/user` endpoint. You could use this endpoint as well-I just used `api/id` for my frontend requests.

```python 
 @token_required()
        def get(self):
            # retrieve the current user from the token_required authentication check  
            current_user = g.current_user
            # current_user extracted from the token using token_required decorator
            users = User.query.all() # extract all users from the database
             
            # prepare a json list of user dictionaries
            json_ready = []  
            for user in users:
                user_data = user.read()
                if current_user.role == 'Admin' or current_user.id == user.id:
                    user_data['access'] = ['rw'] # read-write access control 
                else:
                    user_data['access'] = ['ro'] # read-only access control 
                json_ready.append(user_data)
            
            # return response, a json list of user dictionaries
            return jsonify(json_ready)
```


Here is the code for user.py file  under model that returns the data from the database. This function is from user.py in model directory, appropriately under the User class because it handles returning data for a user.


 Did you notice how password isn't included in the returned data? Hence,  we can't 'fetch' the password data from the backend because it is not provided to us.

```python 
  def read(self):
        data = {
            "id": self.id,
            "name": self.name,
            "uid": self.uid,
            "role": self._role,
            "pfp": self._pfp,
            "kasm_server_needed": self.kasm_server_needed,
        }
        sections = self.read_sections()
        data.update(sections)
        return data 
```


### Reading Name/UID

With the backend API code done for us, we can start with the frontend API service layer. For name and uid, the frontend fetches the data from the backend and fills in the input fields with 'placeholders', or prefilled fields, which have the data from the database.


- Let's take a look at the code for fetching the name data :

```js

// Function to fetch Name from backend
window.fetchName = async function() {
    const URL = pythonURI + "/api/id"; // Adjusted endpoint


    try {
        const response = await fetch(URL, fetchOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch Name: ${response.status}`);
        }


        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error fetching Name:', error.message);
        return null;
    }
};


```



- Let's take a look at the code for fetching the uid data :


```js

// Function to fetch Name from backend
window.fetchName = async function() {
    const URL = pythonURI + "/api/id"; // Adjusted endpoint


    try {
        const response = await fetch(URL, fetchOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch Name: ${response.status}`);
        }


        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error fetching Name:', error.message);
        return null;
    }
};


```


- Let's take a look at the code that sets placeholders for both fields:

```js


// Function to set placeholders for UID and Name
window.setPlaceholders = async function() {
    const uidInput = document.getElementById('newUid');
    const nameInput = document.getElementById('newName');


    try {
        const uid = await window.fetchUid();
        const name = await window.fetchName();


        if (uid !== null) {
            uidInput.placeholder = uid;
        }
        if (name !== null) {
            nameInput.placeholder = name;
        }
    } catch (error) {
        console.error('Error setting placeholders:', error.message);
    }
};



```


### Reading KASM

This is similar to the other 'fetch' codes, but it also includes the boolean logic with the checkbox and doesn't need a separate function to handle formatting the JSON response data  into HTML. 

```js

window.fetchKasmServerNeeded = async function() {
 const URL = pythonURI + "/api/id"; // Adjusted endpoint
 try {
     const response = await fetch(URL, fetchOptions);
     if (!response.ok) {
         throw new Error(`Failed to fetch kasm_server_needed: ${response.status}`);
     }
     const userData = await response.json();
     const kasmServerNeeded = userData.kasm_server_needed
     // Update checkbox state based on fetched value
     const checkbox = document.getElementById('kasmServerNeeded');
     checkbox.checked = kasmServerNeeded;
 } catch (error) {
     console.error('Error fetching kasm_server_needed:', error.message);
     // Handle error display or fallback mechanism
 }
};




```










# **Sections**

# ADDING SECTIONS FOR USER

Let's talk about adding sections for a user. This code might look different from updating uid, name, password, and kasm_server_needed because sections is part of a different database, and sections and users are related (or joined) databases.

## Backend Code

Let's talk about the backend code for adding sections. The following code block is from user.py under the api directory. Since sections is a part of a different database, this code is appropriately  under the Section class and not under the CRUD class. It imports functions from the user.py under the model directory such as add_sections.


```python
        @token_required() 
        def post(self):
            ''' Retrieve the current user from the token_required authentication check '''
            current_user = g.current_user
            
            ''' Read data for json body '''
            body = request.get_json()
            
            ''' Error checking '''
            sections = body.get('sections')
            if sections is None or len(sections) == 0:
                return {'message': f"No sections to add were provided"}, 400
            
            ''' Add sections'''
            if not current_user.add_sections(sections):
                return {'message': f'1 or more sections failed to add, current {sections} requested {current_user.read_sections()}'}, 404
            
            return jsonify(current_user.read_sections())
```

This function is from user.py in model directory, appropriately under the User class because it handles adding sections for a user.
Even the function below has  code for adding multiple sections at a time, but I didn't need utilize it fully  because users select sections one at a time from the dropdown menu. Maybe you can try experimenting with multiselect features with your own user profile! 


```python

  def add_sections(self, sections):
        """
        Add multiple sections to the user's profile.

        :param sections: A list of section abbreviations to be added.
        :return: The user object with the added sections, or None if any section is not found.
        """
        # Iterate over each section abbreviation provided
        for section in sections:
            # Query the Section model to find the section object by its abbreviation
            section_obj = Section.query.filter_by(_abbreviation=section).first()
            # If the section is not found, return None
            if not section_obj:
                return None
            # Add the found section object to the user's profile
            self.add_section(section_obj)
        # Return the user object with the added sections
        return self
        



```


## Frontend API Service Layer 

For adding sections, I had a plus icon trigger the addSections functions when clicked, which allowed the user's selected section
to be added to the table and updated to the database using two helper functions.

- Let's take a look at the global function userSections to  hold user sections

```js  
let userSections = [];
```



- Let's take a look at the global function addSections

```js

// Function to add sections
window.addSection = async function () {
    const dropdown = document.getElementById('sectionDropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const abbreviation = selectedOption.value;
    const name = selectedOption.textContent.split(' ').slice(1).join(' ');


    if (!abbreviation || !name) {
        document.getElementById('profile-message').textContent = 'Please select a section from the dropdown.';
        return;
    }


    // Clear error message
    document.getElementById('profile-message').textContent = '';


    // Add section to userSections array if not already added
    const sectionExists = userSections.some(section => section.abbreviation === abbreviation && section.name === name);
    if (!sectionExists) {
        userSections.push({ abbreviation, name });


        // Display added section in the table
        displayProfileSections();


        // Save sections immediately
        await saveSections();
    }
}







```




- Let's take a look at the function that adds the sections to the table.
```js
// Function to display added sections in the table
function displayProfileSections() {
       const tableBody = document.getElementById('profileResult');
       tableBody.innerHTML = ''; // Clear existing rows


       // Create a new row and cell for each section
       userSections.forEach(section => {
           const tr = document.createElement('tr');
           const abbreviationCell = document.createElement('td');
           const nameCell = document.createElement('td');
           const yearCell = document.createElement('td');


           // Fill in the corresponding cells with data
           abbreviationCell.textContent = section.abbreviation;
           nameCell.textContent = section.name;
           yearCell.textContent = section.year;


           tr.appendChild(abbreviationCell);
           tr.appendChild(nameCell);
           tr.appendChild(yearCell);


           // Add the row to table
           tableBody.appendChild(tr);
       });
   }





```



- Let's take a look at the function that sends HTTP request to add sections

```js
async function saveSections() {
   const sectionAbbreviations = userSections.map(section => section.abbreviation);


   const sectionsData = {
       sections: sectionAbbreviations
   };


   const URL = pythonURI + "/api/user/section";


   const options = {
       URL,
       body: sectionsData,
       message: 'profile-message',
       callback: async () => {
           console.log('Sections saved successfully!');
           await fetchDataAndPopulateTable();
       }
   };


   try {
       await postUpdate(options);
   } catch (error) {
       console.error('Error saving sections:', error.message);
       document.getElementById('profile-message').textContent = 'Error saving sections: ' + error.message;
   }
}
```

# READ 

You might be wondering why we need to talk about the the 'READ' function for sections. After all, we already covered the backend function for reading sections for a specific user, so why are we still talking about backend code below?

This is because I needed to fetch all the sections <strong> available </strong> to the users to populate the dropdown menu where users select their sections from.

You might think that this sounds like a lot of work. Why couldn't I  use a more <strong> static </strong> just input the sections into the code directly rather than fetching them to the backend?

It's because static code is just that: static. Rigid and inflexible. 

Think about this situation. What if an admin user decided to add a Section like 'ART' in the backend? Users wouldn't have that relevant section available to them if we input the previous sections statically. We would have to keep updating the code all the time, and it would be tedious!

This is why we use a more dynamic approach where we will never run into this problem!

## Backend Code

Let's take a look at the backend code. This is under section.py under the api directory, which is appropriate, because we're not fetching sections from a specific user. It imports the read function from the user.py file in model, under the Section class.  The api endpoint for this function is `api/section.`

```python
def get(self):
            sections = Section.query.all() # extract all sections from the database
             
            # prepare a json list of user dictionaries
            json_ready = [section.read() for section in sections]  
            
            # return response, a json list of user dictionaries
            return jsonify(json_ready)
```

You also will notice that there is no section.py file under model.This is because the section code is included in the user.py file in the model directory,  appropriately under the Section class.

``` python
    # CRUD read
    def read(self):
        return {
            "id": self.id,
            "name": self._name,
            "abbreviation": self._abbreviation
        }















## Frontend API Service Layer

To populate the dropdown menu, we need to fetch sections and put them in the dropdown menu.

- Let's take a look at the  global variable to hold predefined sections
```js 
let predefinedSections = [];
```

- Let's take a look at the function with the HTTP request to fetch  sections from the backend.

```js 
async function fetchPredefinedSections() {
    const URL = pythonURI + "/api/section";


    try {
        const response = await fetch(URL, fetchOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch predefined sections: ${response.status}`);
        }


        return await response.json();
    } catch (error) {
        console.error('Error fetching predefined sections:', error.message);
        return []; // Return empty array on error
    }
}

```
- Let's take a look at the function that populates the dropdown menu. Remember, we covered displayProfileSections earlier, and we already know what it does

```js 
// Function to populate section dropdown menu
function populateSectionDropdown(predefinedSections) {
    const sectionDropdown = document.getElementById('sectionDropdown');
    sectionDropdown.innerHTML = ''; // Clear existing options


    predefinedSections.forEach(section => {
        const option = document.createElement('option');
        option.value = section.abbreviation;
        option.textContent = `${section.abbreviation} - ${section.name}`;
        sectionDropdown.appendChild(option);
    });


    // Display sections in the table
    displayProfileSections();
}

```

 > Exercise
 - An important note. I didn't cover the frontend API layer for fetching sections data for a user in the backend(basically, populating the sections table for the user profile.) Why? This is an exercise meant for you! Try looking through the profile page and figuring out which functions fetch the data and which functions format the response into the table. Hint (Is it multiple functions or one specific function?...)


# UPDATE YEAR

Now that we've talked about adding sections and populating the dropdown menu, let's talk about updating the year for each section for each user. (Keep in mind, all of the sections default to the year we are in. Check out the code for that in user.py file under the model directory, under the Section class. Hint: we use the datetime library.)

## Backend Code
 
 Let's talk about the backend code for updating  section year. The following code block is from user.py under the api directory. Since sections is a part of a different database, this code is appropriately  under the Section class and not under the CRUD class. It imports functions from the user.py under the model directory such as update_sections.

```python 

  @token_required()
        def put(self):
            ''' Retrieve the current user from the token_required authentication check '''
            current_user = g.current_user

            ''' Read data for json body '''
            body = request.get_json()

            ''' Error checking '''
            section_data = body.get('section')
            if not section_data:
                return {'message': 'Section data is required'}, 400
            
            if not section_data.get('abbreviation'):
                return {'message': 'Section abbreviation is required'}, 400
            
            if not section_data.get('year'):
                return {'message': 'Section year is required'}, 400

            ''' Update section year '''
            if not current_user.update_section(section_data):
                return {'message': f'Section {section_data.get("abbreviation")} not found or update failed'}, 404

            return jsonify(current_user.read_sections())



```
Here is the update_section function in user.py,in the model directory,  under the Section class.


```python 

    
    def update_section(self, section_data):
        """
        Updates the year enrolled for a given section.

        :param section_data: A dictionary containing the section's abbreviation and the new year.
        :return: A boolean indicating if the update was successful.
        """
        abbreviation = section_data.get("abbreviation", None)
        year = int(section_data.get("year", default_year()))  # Convert year to integer, default to 0 if not found

        # Find the user_section that matches the provided abbreviation
        section = next(
            (s for s in self.user_sections if s.section.abbreviation == abbreviation),
            None
        )

        if section:
            # Update the year for the found section
            section.year = year
            db.session.commit()
            return True  # Update successful
        else:
            return False  # Section not found

```





# DELETE

Before we dive in the frontend for updating year, let's talk about the code for deleting sections!


## Backend Code 
Here is delete code under user.py in the api directory. It is under the section class because it has to do with user sections.


```python

  @token_required()
        def delete(self):
            ''' Retrieve the current user from the token_required authentication check '''
            current_user = g.current_user
    
            ''' Read data for json body '''
            body = request.get_json()
    
            ''' Error checking '''
            sections = body.get('sections')
            if sections is None or len(sections) == 0:
                return {'message': f"No sections to delete were provided"}, 400
    
            ''' Remove sections '''
            if not current_user.remove_sections(sections):
                return {'message': f'1 or more sections failed to delete, current {sections} requested {current_user.read_sections()}'}, 404
    
            return {'message': f'Sections {sections} deleted successfully'}, 200
        


```


Here is the remove_sections code under user.py in the model directory, under the User class, which is appropriate because it removes sections for a user.

```python

   def remove_sections(self, section_abbreviations):
        """
        Remove sections based on provided abbreviations.

        :param section_abbreviations: A list of section abbreviations to be removed.
        :return: True if all sections are removed successfully, False otherwise.
        """
        try:
            # Iterate over each abbreviation in the provided list
            for abbreviation in section_abbreviations:
                # Find the section matching the current abbreviation
                section = next((section for section in self.sections if section.abbreviation == abbreviation), None)
                if section:
                    # If the section is found, remove it from the list of sections
                    self.sections.remove(section)
                else:
                    # If the section is not found, raise a ValueError
                    raise ValueError(f"Section with abbreviation '{abbreviation}' not found.")
            db.session.commit()
            return True
        except ValueError as e:
            # Roll back the transaction if a ValueError is encountered
            db.session.rollback()
            print(e)  # Log the specific abbreviation error
            return False
        except Exception as e:
            # Roll back the transaction if any other exception is encountered
            db.session.rollback()
            print(f"Unexpected error removing sections: {e}") # Log the unexpected error
            return False
```


## Frontend API Service Layer for Update Year and Delete Section

For the frontend, I have a function that allows a year cell for each section, where  each cell has a pencil icon near it, indicating the cell is editable. Once the cell is clicked, the input field is open, where you enter the correct year. Then it is  saved in the table and  updated in the backend. The function also has a trash can icon for each section. When icon is clicked for a section , the table row is deleted and the  appropriate section data is deleted in the backend. 

```js


// Function to update table with fetched data
function updateTableWithData(data) {
   const tableBody = document.getElementById('profileResult');
   tableBody.innerHTML = '';


   data.sections.forEach((section, index) => {
       const tr = document.createElement('tr');
       const abbreviationCell = document.createElement('td');
       const nameCell = document.createElement('td');
       const yearCell = document.createElement('td');


      
       abbreviationCell.textContent = section.abbreviation;
       nameCell.textContent = section.name;
       yearCell.textContent = section.year;




       const trashIcon = document.createElement('i');
       trashIcon.className = 'fas fa-trash-alt trash-icon';
       trashIcon.style.marginLeft = '10px';
       abbreviationCell.appendChild(trashIcon);


       trashIcon.addEventListener('click', async function (event) {
           event.preventDefault();
           const URL = pythonURI + "/api/user/section";
          
           // Remove the row from the table
           tr.remove();


           const options = {
               URL,
               body: { sections: [section.abbreviation] },
               message: 'profile-message',
               callback: async () => {
                   console.log('Section deleted successfully!');
                   await fetchDataAndPopulateTable();
               }
           };


           try {
               await deleteData(options);
           } catch (error) {
               console.error('Error deleting section:', error.message);
               document.getElementById('profile-message').textContent = 'Error deleting section: ' + error.message;
           }
       });




     




      yearCell.classList.add('editable'); // Make year cell editable
      yearCell.innerHTML = `${section.year} <i class="fas fa-pencil-alt edit-icon" style="margin-left: 10px;"></i>`;


       // Make the year cell editable
       yearCell.addEventListener('click', function () {
           const input = document.createElement('input');
           input.type = 'text';
           input.value = section.year;
           input.className = 'edit-input';
           yearCell.innerHTML = '';
           yearCell.appendChild(input);


           input.focus();


           input.addEventListener('blur', async function () {
               const newYear = input.value;
               const URL = pythonURI + "/api/user/section";
               const options = {
                   URL,
                   body: { section: { abbreviation: section.abbreviation, year: newYear } },
                   message: 'profile-message',
                   callback: async () => {
                       console.log('Year updated successfully!');
                       await fetchDataAndPopulateTable();
                   }
               };


               try {
                   await putUpdate(options);
               } catch (error) {
                   console.error('Error updating year:', error.message);
                   document.getElementById('profile-message').textContent = 'Error updating year: ' + error.message;
               }


               yearCell.textContent = newYear;
           });


           input.addEventListener('keydown', function (event) {
               if (event.key === 'Enter') {
                   input.blur();
               }
           });
       });
       tr.appendChild(abbreviationCell);
       tr.appendChild(nameCell);
       tr.appendChild(yearCell);


       tableBody.appendChild(tr);
   });


  
}


```

> What does that function mean...?
- By the way, what is the fetch data/populate table function for? Think back to our exercise earlier and check out the code!




# **Profile Picture**

# UPDATE

Updating the profile will look a little different than updating the name, uid, and other fields because pfp has it's own api file with different methods. It's also stored  as a base64 string in the backend-so there are a couple extra steps. 



## Backend Code

This code is under the PFP class in the pfp.py file under the api directory. Since PFP is bit different to process than other data, we have a separate model and api pfp file.

```python

    @token_required()
    def put(self):
        """
        Updates the user's profile picture with a new image provided as base64 encoded data.

        This endpoint allows users to update their profile picture by sending a PUT request with base64 encoded image data.
        The image is decoded and saved to a secure location on the server, and the user's profile information is updated
        to reference the new image file.

        The function requires a valid authentication token and expects the base64 image data to be included in the request's JSON body
        under the key 'pfp'. If the image data is not provided, or if any error occurs during the upload process or while updating
        the user's profile in the database, an appropriate error message and status code are returned.

        Returns:
        - A JSON object with a message indicating the success or failure of the operation.
        - HTTP status code 200 if the profile picture was updated successfully.
        - HTTP status code 400 if the base64 image data is missing from the request.
        - HTTP status code 500 if an error occurs during the upload process or while updating the database.
        """
        current_user = g.current_user

        # Obtain the base64 image data from the request
        if 'pfp' not in request.json:
            return {'message': 'Base64 image data required.'}, 400
        base64_image = request.json['pfp']
       
        # Make an image file from the base64 data 
        filename = pfp_base64_upload(base64_image, current_user.uid)
        if not filename:
            return {'message': 'An error occurred while uploading the profile picture'}, 500
        
        # Update the user's profile picture to the uploaded file
        try:
            # write the filename reference to the database
            current_user.update(pfp=filename)
            return {'message': 'Profile picture updated successfully'}, 200
        except Exception as e:
            return {'message': f'A database error occurred while assigning profile picture: {str(e)}'}, 500
        







```
We won't be referencing the methods in the model, because that handles images on the server(making a directory for images for each user, etc.) If you want to check it out, check out both pfp.py files  under your flask_2025 repository.

## Frontend API Service Layer
On the frontend, we have a global function that calls other functions. Once the picture is uploaded, it is converted into a base64string and sent to the backend. 

- This function is the global function.

```js
// Function to save profile picture
window.saveProfilePicture = async function () {


    const fileInput = document.getElementById('profilePicture');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const profileImageBox = document.getElementById('profileImageBox');
            profileImageBox.innerHTML = `<img src="${reader.result}" alt="Profile Picture">`;
        };
        reader.readAsDataURL(file);
    }



    if (!file) return;


    try {
        const base64String = await convertToBase64(file);
        await sendProfilePicture(base64String);
        console.log('Profile picture uploaded successfully!');


    } catch (error) {
        console.error('Error uploading profile picture:', error.message);
        // Handle error display or fallback mechanism
    }
}


```


- This function converts the data into a base64 string

```js
// Function to convert file to base64
async function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the prefix part of the result
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}


```


- This function makes the HTTP request to update the profile picture. 
```js
async function sendProfilePicture(base64String) {
   const URL = pythonURI + "/api/id/pfp"; // Adjust endpoint as needed


   // Create options object for PUT request
   const options = {
       URL,
       body: { pfp: base64String },
       message: 'profile-message', // Adjust the message area as needed
       callback: () => {
           console.log('Profile picture uploaded successfully!');
           // Handle success response as needed
       }
   };


   try {
       await putUpdate(options);
   } catch (error) {
       console.error('Error uploading profile picture:', error.message);
       document.getElementById('profile-message').textContent = 'Error uploading profile picture: ' + error.message;
   }
}


```





# READ

We covered the read backend code for pfp already, so let's jump straight into the frontend API layer. 

## Frontend API Layer
For the frontend API, we have to remember that the image is stored as a base64 string, so we have to make some modifications to how we format the data in HTML. We have a function that displays the user profile with the image data from the backend.


- Here is the function that makes the request and calls displayUserProfile, passing in the fetched data.
```js


// Function to fetch user profile data
async function fetchUserProfile() {
    const URL = pythonURI + "/api/id/pfp"; // Endpoint to fetch user profile data


    try {
        const response = await fetch(URL, fetchOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch user profile: ${response.status}`);
        }


        const profileData = await response.json();
        displayUserProfile(profileData);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        // Handle error display or fallback mechanism
    }
}




```
- Here is the function that displays the user profile data correctly. The function set the source of the image using the base64 string from the profile data in the HTML element meant for the image. 

```js 
// Function to display user profile data
function displayUserProfile(profileData) {
    const profileImageBox = document.getElementById('profileImageBox');
    if (profileData.pfp) {
        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${profileData.pfp}`;
        img.alt = 'Profile Picture';
        profileImageBox.innerHTML = ''; // Clear existing content
        profileImageBox.appendChild(img); // Append new image element
    } else {
        profileImageBox.innerHTML = '<p>No profile picture available.</p>';
    }


    // Display other profile information as needed
    // Example: Update HTML elements with profileData.username, profileData.email
}
```


### Conclusion

In this tutorial, we walked through the process of creating a dynamic and functional profile page using Flask. We started by setting up the foundational UI elements, then implemented key features like editable fields for user information and a profile picture upload option. By connecting the front-end with the back-end using Flask APIs, we ensured that users could seamlessly update their personal information and credentials.

Through this guide, you’ve learned not only how to design a user-friendly profile page but also how to integrate it,  ensuring data validation and smooth communication between the client and server. With these skills, you're well-equipped to enhance your web applications, offering personalized and efficient user experiences.

Remember, the concepts covered here are just the beginning. You can expand on this foundation by adding more advanced features, such as multi-step forms and enhanced security measures. Keep experimenting and building, and soon you'll have a profile page that's tailored to the specific needs of your application and users.

Happy coding!




