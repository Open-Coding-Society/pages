---
layout: post
title: Styling with SASS and Using Different Icons
description: Styling your frontend features
permalink: /flask-code-style
author: Isabel Marilla
menu: nav/flask.html
toc: True
---

## Style Sells It!

Are you finally finished with your feature? Now, it's time to style it! This documentation will guide you through using SASS for styling your frontend, focusing on incorporating different icons for a more interactive and user-friendly interface. We will cover how to style elements like a profile container, custom icons for file upload, editing, deleting, and adding new items using Font Awesome icons.

If you're not familar with SASS, please check out [this guide](https://pages.opencodingsociety.com/sass_basics/coding#fundementals-sass) before starting.

## Basic Styling

To get started, let's go over the user profile example to get started. First, we  can create a style block (CSS) to do some basic styling for our page. 

```html
<style>

 .profile-container {
     display: flex;
     justify-content: center;
     align-items: center;
 }

.profile-card {
     width: 100%;
     max-width: 600px;
     background-color: #2c3e50; /* Dark blue background */
     border: 1px solid #34495e; /* Darker border */
     border-radius: 5px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
     padding: 20px;
     color: #ffffff; /* White text */
 }


 .profile-card label {
     display: block;
     font-weight: bold;
     margin-bottom: 5px;
 }

 .profile-card input[type="text"],
 .profile-card input[type="file"],
 .profile-card select {
     width: calc(100% - 12px);
     padding: 8px;
     border: 1px solid #ddd;
     border-radius: 4px;
     font-size: 16px;
 }

 .profile-card button {
     background-color: #3498db; /* Blue button */
     color: #ffffff;
     border: none;
     border-radius: 4px;
     padding: 10px 20px;
     cursor: pointer;
     font-size: 16px;
 }

 .profile-card button:hover {
     background-color: #2980b9; /* Darker blue on hover */
 }

 .profile-table {
     width: 100%;
     margin-top: 20px;
     border-collapse: collapse;
 }

 .profile-table th,
 .profile-table td {
     border: 1px solid #ddd;
     padding: 10px;
     text-align: left;
 }
 .details-button {
     display: block;
     width: 100%;
     padding: 10px;
     margin-top: 20px;
     background-color: #3498db; /* Blue button */
     color: white;
     border: none;
     border-radius: 5px;
     cursor: pointer;
     text-align: center;
     text-decoration: none;
 }
 .details-button:hover {
     background-color: #2980b9; /* Darker blue on hover */
 }

 .profile-image-box {
     text-align: center;
     margin-top: 20px;
 }

 .profile-image-box img {
     max-width: 100%;
     height: auto;
     border-radius: 50%;
     border: 2px solid #34495e;
 }

</style>
```


### Explanation of CSS

- **`.profile-container`**
  - Centers contents horizontally and vertically using the flex property. 

- **`.profile-card`**
  - Styles the profile card with a dark blue background, rounded corners, and a subtle shadow.

- **Inside `.profile-card`**
  - **Labels**: 
    - Displayed as block-level elements.
    - Styled to be bold with space below them.
  - **Input Fields and Select Elements**:
    - Set to a width almost full of the container, with padding, light gray border, and rounded corners.

- **Buttons within `.profile-card`**
  - Blue background with white text, rounded corners, and padding.
  - Change to a darker blue when hovered over.

- **`.profile-table`**
  - Takes full width of its container.
  - Includes space above it and collapsed borders for a clean appearance.

- **Inside `.profile-table`**
  - **Table Headers and Cells**:
    - Have a light gray border and padding for improved readability.

## Converting to SASS

The pages project is attempting to organize style at a project level, minimizing CSS in local files.  Tho follow this path, we have to organize style according to SASS. Since we're developing the nighthawk theme for pages, we make a file under the nighthawk directory called profile.css. To convert the CSS to SASS, we start SASS journy by nesting the code in scss file.

**Note** As an aside style enhancement, if you look closely, you'll won't see the code for buttons is removed. This is because I changed my code to use icons instead of buttons, which we will cover later.

### Explanation of SASS

- **`.profile-container`**
  - Centers contents horizontally and vertically using the flex property. 

- **`.card`**
  - Styles the profile card with a dark blue background, rounded corners, and a subtle shadow.

- **Inside `.card`**
  - **Labels**: 
    - Displayed as block-level elements.
    - Styled to be bold with space below them.
  - **Input Fields and Select Elements**:
    - Set to a width almost full of the container, with padding, light gray border, and rounded corners.

- **`.icon-container`**
  -  Handles layout and spacing for icons and dropdowns.

- **`.file-icon`**
  -   Custom styling for the file upload icon, with hover effects. 

- **`image container`**
    - Styles for displaying the profile picture with rounded corners and a border.

- **`.profile-table`**
  - Takes full width of its container.
  - Includes space above it and collapsed borders for a clean appearance.

- **Inside `.profile-table`**
  - **Table Headers and Cells**:
    - Have a light gray border and padding for improved readability.

```scss
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    width: 100%;
    max-width: 800px;
    background-color: #2c3e50; // Dark blue background
    border: 1px solid #34495e; // Darker border
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    color: #ffffff; // White text

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }

    input[type="text"],
    input[type="file"],
    select {
      width: calc(100% - 12px);
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .icon-container {
        display: flex;
        align-items: center;
    }
    .icon-container select {
        flex-grow: 1;
        margin-right: 15px; /* Space between dropdown and icon */
    }

  /* Hide the default file input */
    #profilePicture {
        display: none;
    }
    /* Style the custom file icon */
    .file-icon {
        font-size: 24px;
        color: white; /* Light grey color */
        cursor: pointer; /* Indicate that it is clickable */
    }
    .file-icon:hover {
        color: #ffffff; /* Change icon color on hover */
    }

    table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse;

      th,
      td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
    }

    .image-container {
      text-align: center;
      margin-top: 20px;

      img {
        max-width: 100%;
        height: auto;
        border-radius: 50%;
        border: 2px solid #34495e;
      }

    }
  }
}
```

### Import profile.scss

To active profile.scss, we need to import the style into main.scss under the nighthawk directory, along with the other custom nighthawk styles.

```scss
@import "mixins";
@import "profile";
@import "calculator-button";
@import "dropdown-menu";
@import "platformer-game";
@import "chatbot";
@import "hacks";
```


## HTML for SASS

Here is the html. Observe the class definitions that correspond to CSS and SASS examples shown.  Each class will have styles applied as we discussed.

```html
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
      <label for="profilePicture" class="file-icon"> Upload Profile Picture <i class="fas fa-upload"></i>
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


# Using Icons

If you take a look at the profile page HTML, you can see multiple icons references:  upload symbol (fa-upload), and plus sign (fa-plus) sign. Icons make the profile page much more cleaner than tacky buttons. Excessive use of buttons can make a design look cluttered and overwhelming. The **i** tage with the associated class styles with an icon.


```html
<i class="fas fa-plus" onclick="addSection()"></i>
``` 

To use these Font Awesome (fa) icons, you have two options: 

1. You can go to [Font Awesome](https://fontawesome.com/v5/search?o=r&s=solid) directly, create an account, and check out all the cool icons you can include in your html!

2. You can directly include Font Awesome as a stylesheet and experiment with different icons form the stylesheet.

 ```html
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
 ```

 Since I had ideas in mind for how to style my frontend with particular icons I went with the first option for more creative freedom.


### Reasons to Style with Icons

Here a couple reasons to consider icons in your project!
 
1. **Space Efficiency**
Icons are compact and take up less space compared to text buttons. This allows for a cleaner and more streamlined interface, especially in designs where space is limited. By using icons, you can reduce visual clutter and make the layout look more organized.

2. **Visual Appeal**
Icons enhance the visual appeal of a design with their modern and customizable appearance. They can be styled in various ways to match the design theme, providing a cohesive and attractive user interface. Custom icons contribute to a unique brand identity and overall aesthetic.

3. **Immediate Recognition**
Well-designed icons can convey actions or functions quickly and intuitively. Users can often recognize and understand the purpose of an icon faster than reading and processing text.  Icons require no translation for English Language Learners and are preferred as the do not require localization. This helps in creating a more user-friendly experience and facilitates quicker interactions.  

By leveraging these benefits, icons can significantly improve the usability and attractiveness of your web design. 


# Explanation of Font Awesome Class and `<i>` Tag

## 1. Font Awesome Overview
- **What is Font Awesome?**
  - Font Awesome is a popular icon library that allows you to easily add vector icons and social logos to your website. It provides a wide range of icons in different styles like solid, regular, light, and brands.

## 2. Understanding the `<i>` Tag
- **Purpose of the `<i>` Tag:**
  - The `<i>` tag in HTML stands for "italic" and was originally used to style text in italics. However, it is now commonly repurposed to represent icons when using icon libraries like Font Awesome.
- **How It Works with Font Awesome:**
  - When you use Font Awesome, the `<i>` tag is often used to include an icon by assigning it specific classes provided by Font Awesome. These classes apply the icon and style it appropriately.

## 3. How Font Awesome Classes Work
- **Class Structure:**
  - Font Awesome uses a combination of classes to display icons. The basic structure looks like this:
    ```html
    <i class="fa fa-icon-name"></i>
    ```
    - **fa**: This is the base class that indicates you are using Font Awesome.
    - **fa-icon-name**: This class corresponds to the specific icon you want to display, like `fa-user`, `fa-home`, `fa-trash`, etc.
- **Example:**
  ```html
  <i class="fa fa-home"></i> ```
## 4. Additional Styling and Sizing
- **Styling the Icons:**
- You can apply additional styles directly using CSS or by adding more Font Awesome classes to control the size, rotation, and color of the icons.
For example, to make an icon larger, you can use:
<i class="fa fa-home fa-2x"></i>
- Other Modifiers:
`fa-spin`: Makes the icon spin continuously.
`fa-pulse``: Makes the icon pulse.
`fa-lg, fa-2x, fa-3x, fa-4x, fa-5x``: Increases the icon size relative to its original size.


### Icons used to trigger functions

On the profile page,  the icons trigger functions. For example, the + icon triggers the addSection function,  adds sections to the table, and add the sections to the user data. 

```html
<i class="fas fa-plus" onclick="addSection()"></i>
``` 

In the Javascript file, there are icons created within the sections table. When the trash can is clicked, the delete function is triggered. The row is deleted from the table, and the section is removed from the user data.

```javascript
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
```

 The pencil icon indicates that the year cell is editable. Once you click on the pencil icon, you can edit the year cell for the section. Once you update the year for a particular section, a function is triggered to change the year on the table and update the user's section data.
  
```javascript
yearCell.classList.add('editable'); // Make year cell editable
yearCell.innerHTML = `${section.year} <i class="fas fa-pencil-alt edit-icon" style="margin-left: 10px;"></i>`;

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
```

## Conclusion
By using SASS to style your frontend and integrating Font Awesome icons, you can create a visually appealing and user-friendly interface. Leverage SASS's features to maintain clean and organized code, and ensure your design is responsive to provide a seamless experience across different devices.
