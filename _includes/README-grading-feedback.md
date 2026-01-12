# Grading Feedback Tool with Threaded Comments

This is a reusable grading feedback component that allows students to submit their grades and receive threaded feedback/comments for any lesson. **Automatically integrates with your login system!**

## Features

1. **Initial Submission Form (3 Fields):**
   - Student Name (text input - **auto-filled when logged in!**)
   - Grade Received (dropdown with common grade ranges)
   - Submission/Comments (textarea for reflections)
   
2. **🔐 Auto-Login Integration:**
   - Automatically detects logged-in users from your site's authentication system
   - Pre-fills student name from `window.user.name` (set by login.js)
   - Shows visual indicator when name is auto-filled (green border + hint text)
   - Works for both main submission and reply forms
   - No need to type your name every time - just like social media!

3. **Threaded Comment System:**
   - Each submission becomes its own thread
   - Anyone can add replies/feedback under each submission
   - Replies show author name and timestamp
   - Visual threading with indentation and borders
   - Reply count displayed for each thread

4. **Local Storage:**
   - Automatically saves all submissions and replies to browser's localStorage
   - Shows complete thread history with all replies
   - Each lesson has its own feedback storage (based on page URL)
   - Persistent across browser sessions

5. **User Experience:**
   - Clean, modern UI matching the lesson theme
   - Success/error messages for user feedback
   - Click "Add Reply / Feedback" button to respond to submissions
   - Option to clear all threads
   - Responsive design
   - Real-time updates

## How to Use in Any Lesson

Simply add this line at the end of your lesson content (before the closing `</div>`):

```liquid
{%- include grading-feedback.html -%}
```

## Example Implementation

See `/hacks/pong/2025-09-03-P0lesson.md` for a working example.

The grading feedback section will appear after all lesson content and before the utterances comments section (if enabled with `comments: True` in frontmatter).

## Customization

To customize the styling or options, edit `/Users/akshay/pages/_includes/grading-feedback.html`

### Common Customizations:

1. **Change grade options:** Edit the `<select>` dropdown options
2. **Modify colors:** Update the CSS variables and color values
3. **Add more fields:** Add new form groups in the HTML
4. **Change storage key:** Modify the `STORAGE_KEY` variable in the script

## Storage Structure

Data is stored in localStorage with the key: `lesson_grading_feedback_[page_url]`

Each submission thread includes:
- id (unique identifier)
- studentName
- gradeReceived
- additionalComments
- timestamp (auto-generated)
- pageUrl (auto-generated)
- pageTitle (auto-generated)
- replies (array of reply objects)

Each reply includes:
- id (unique identifier)
- author (name of person replying)
- content (reply text)
- timestamp (auto-generated)

## How It Works

1. **Student submits initial feedback** → Creates a new thread with their name, grade, and comments
2. **Thread appears below** → Shows all submitted threads in reverse chronological order
3. **Anyone can reply** → Click "Add Reply / Feedback" button on any thread
4. **Replies appear nested** → All replies show under the original submission with indentation
5. **Teachers/peers can give feedback** → Each person can add multiple replies to provide detailed feedback

## Browser Compatibility

Works in all modern browsers that support:
- localStorage API
- ES6 JavaScript
- CSS Grid/Flexbox

