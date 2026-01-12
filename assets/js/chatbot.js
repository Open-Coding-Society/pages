import {javaURI} from '{{site.baseurl}}/assets/js/api/config.js';

//fetchUserData();
let chatHistoryMode = false; 

// Define and select essential elements from the DOM for interaction
const elements = {
  form: document.querySelector(".msger-inputarea"), // The form where users input their messages
  input: document.querySelector(".msger-input"), // The text input field within the form
  chat: document.querySelector(".msger-chat"), // The chat display area
  spinner: document.getElementById("waiting"), // A loading spinner element
  deleteChat: document.getElementById("delete_chat"), // The button to delete chat history
  retrieveChatHistory: document.getElementById("retieve_chat_history"), // The button to retrieve chat history
  personid: document.getElementById("initId"), // personid hidden field
};
document.getElementById("initId").value=1; // hardcode userID for now...

// URLs for local or deployed access
//uri = "https://codemaxxers.stu.nighthawkcodingsociety.com";
const urls = {
  chat: `${javaURI}/aichatbot/chat?message=`, // Endpoint for sending a chat message
  clearHistory: `${javaURI}/aichatbot/chat/history/clear?personid=`, // Endpoint for clearing chat history
  retrieveHistory: `${javaURI}/aichatbot/chat/history?personid=`, // Endpoint for retrieving chat history
  deleteChat: `${javaURI}/aichatbot/chat/history/delete/`, //Endpoint for deleting a chat
  };

// Define assets such as images and names for the bot and user
const assets = {
  botImg: "/pages/assets/icons/icons8-chat-bot-64.png", // Bot image icon
  personImg: "/pages/assets/icons/icons8-person-94.png", // User image icon
  botName: "Chat Bot", // Bot name
  personName: "You", // User name
  botTitle: "AI Bot", // Bot title for image tooltip
  personTitle: "You", // User title for image tooltip
};

// Event listener for the delete chat button
elements.deleteChat.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent the default form submission
  
  await fetchData(`${urls.clearHistory}${elements.personid.value}`, "DELETE"); // Send a DELETE request to clear chat history
  elements.chat.innerHTML = ""; // Clear the chat display area
  appendMessage(assets.botName, assets.botImg, "left", "Your chat history has been cleared! Go ahead and send me a new message. 😄", assets.botTitle, "", formatDate(new Date())); // Inform the user that the chat history is cleared
});

// Event listener for the retrieve chat history button
elements.retrieveChatHistory.addEventListener("click", async (event) => {
  chatHistoryMode = true;
  event.preventDefault(); // Prevent the default form submission
  const chats = await fetchData(`${urls.retrieveHistory}${elements.personid.value}`); // Fetch chat history
  console.log(chats);
  elements.chat.innerHTML = ""; // Clear the chat display area
  appendMessage(assets.botName, assets.botImg, "left", "Your chat history!", assets.botTitle, "", formatDate(new Date())); // Inform the user that the chat history is loaded

  chats.forEach(chat => { // Loop through each chat message
    console.log(chat);
    appendMessage(assets.personName, assets.personImg, "right", chat['chatMessage'], assets.personTitle, chat['id'], formatMessageDate(chat['timestamp'])); // Append user's message
    appendMessage(assets.botName, assets.botImg, "left", chat['chatResponse'], assets.botTitle, chat['id'], formatMessageDate(chat['timestamp'])); // Append bot's response
  });
});


// State variable to keep track of the current response function
let instantChatResponseFlag = false;

// Event listener for the toggle button

document.getElementById("toggle-response-btn").addEventListener("click", () => {
  instantChatResponseFlag = !instantChatResponseFlag;
  alert(`Using ${instantChatResponseFlag ? "instant chat" : "streamed chat"}`);
});


// Event listener for form submission (sending a new message)
elements.form.addEventListener("submit", (event) => {
  chatHistoryMode = false;
  event.preventDefault(); // Prevent the default form submission
  const msgText = elements.input.value; // Get the message text from the input field
  if (!msgText) return; // Do nothing if the input field is empty
  appendMessage(assets.personName, assets.personImg, "right", msgText, assets.personTitle, "", formatDate(new Date())); // Append the user's message to the chat
  elements.input.value = ""; // Clear the input field
  elements.spinner.style.display = ""; // Display the loading spinner)
  botResponse(msgText); // Send the message to the bot
  });

// Function to append a message to the chat display area
function appendMessage(name, img, side, text, title, chatid, chattime) {
  const deleteChatDiv = `<div style="cursor: pointer;"><i class="fa fa-trash" title="Delete Chat" onclick="deleteChat(${chatid})"></i></div>`;
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})" title="${title}"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${chattime}</div>
          ${chatHistoryMode && side == "right" ? deleteChatDiv : ''}
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  elements.chat.insertAdjacentHTML("beforeend", msgHTML); // Insert the message HTML into the chat display area
  elements.chat.scrollTop += 500; // Scroll to the bottom of the chat display area
}

async function deleteChat(id){
  const chats = await fetchData(`${urls.deleteChat}${id}?personid=${elements.personid.value}`, "DELETE"); // Send a DELETE request to clear chat history
  // it returns the update chat history
  // display updated chat history
  console.log(chats);
  elements.chat.innerHTML = ""; // Clear the chat display area
  appendMessage(assets.botName, assets.botImg, "left", "Your updated chat history!", assets.botTitle, "", formatDate(new Date())); // Inform the user that the chat history is loaded

  chats.forEach(chat => { // Loop through each chat message
    console.log(chat);
    appendMessage(assets.personName, assets.personImg, "right", chat['chatMessage'], assets.personTitle, chat['id'], formatMessageDate(chat['timestamp'])); // Append user's message
    appendMessage(assets.botName, assets.botImg, "left", chat['chatResponse'], assets.botTitle, chat['id'], formatMessageDate(chat['timestamp'])); // Append bot's response
  });
  
}

async function secondbotResponse(msgText) {
  const data = await fetchData(`${urls.chat}${msgText}&personid=${elements.personid.value}`); // Fetch the bot's response
  appendMessage(assets.botName, assets.botImg, "left", data.chatResponse, assets.botTitle,data.id, formatMessageDate(data.timestamp)); // Append the bot's response to the chat
  elements.spinner.style.display = "none"; // Hide the loading spinner
}

// Function to handle bot responses
async function botResponse(msgText) {
  console.log("Bot Response");
  console.log(msgText);
  // Show the loading spinner
  elements.spinner.style.display = "block";

  // Fetch the bot's response
  const data = await fetchData(`${urls.chat}${msgText}&personid=${elements.personid.value}`);
if(data.chatResponse == null) {
  console.log("No Response");
}
  console.log(data);
  console.log(data.chatResponse);
  console.log(data.id);

  if (instantChatResponseFlag){
    appendMessage(assets.botName, assets.botImg, "left", data.chatResponse, assets.botTitle,data.id, formatMessageDate(data.timestamp)); // Append the bot's response to the chat
    elements.spinner.style.display = "none"; // Hide the loading spinner
  } else {
  // Function to split the data into smaller chunks
  function* chunkString(str, size) {
    for (let i = 0; i < str.length; i += size) {
      yield str.slice(i, i + size);
    }
  }


  
  // Split the response into chunks of a specified size (e.g., 10 characters)
  const chunks = Array.from(chunkString(data.chatResponse, 10));

  // Create a single message container for the response
  appendMessage(assets.botName, assets.botImg, "left", "", assets.botTitle, data.id, formatMessageDate(data.timestamp));

  // Get the newly created message element
  const lastMsgTextElement = elements.chat.querySelector(".msg.left-msg:last-child .msg-text");

  // Function to append the next chunk
  let currentChunk = 0;
  function appendNextChunk() {
    if (currentChunk < chunks.length) {
      lastMsgTextElement.innerHTML += chunks[currentChunk];
      currentChunk++;
      elements.chat.scrollTop += 500; // Ensure the chat scrolls to show the latest content
    } else {
      // Stop the interval when all chunks are appended
      clearInterval(intervalId);
      // Hide the loading spinner
      elements.spinner.style.display = "none";
    }
  }

  // Set an interval to append chunks at specified intervals (e.g., every 100 milliseconds)
  const intervalId = setInterval(appendNextChunk, 100);

  }
}

// Function to format the date/time for messages
function formatDate(date) {
  const currentDateTime = new Date().getMilliseconds();
  const messageMs = date.getMilliseconds();
  console.log("Message Time: " + date);
  console.log("Current Time: " + new Date());
  const timeElapsed = currentDateTime - messageMs;
  console.log(timeElapsed);

  if (timeElapsed > 3*24*60*60*1000)
    return "Few Days Ago";
  else if (timeElapsed > 2*24*60*60*1000)
    return "2 Days Ago";
  else if (timeElapsed > 1*24*60*60*1000)
    return "Yesterday";
  else {
    const h = String(date.getHours()).padStart(2, "0"); // Get hours with leading zero
    const m = String(date.getMinutes()).padStart(2, "0"); // Get minutes with leading zero
    return `${h}:${m}`; // Return formatted time
  }
}

function formatMessageDate(datestr) {
  return formatDate(new Date(datestr));
}

// Function to fetch data from the API
async function fetchData(url, method = "GET", data = null) {
  const options = {
    method, // HTTP method (GET, POST, DELETE, etc.)
    headers: { "Content-Type": "application/json" }, // Headers for the request
    mode: "cors", // Cross-origin resource sharing
    cache: "no-cache", // No caching
    credentials: "same-origin", // Same-origin credentials
    redirect: "follow", // Follow redirects
    referrerPolicy: "no-referrer", // No referrer policy
  };
  if (data) options.body = JSON.stringify(data); // Add body data if provided
  const response = await fetch(url, options); // Fetch data from the API //:)
  if (!response.ok){
    appendMessage(assets.botName, assets.botImg, "left", "response failed, your gpt key is likely broken. check console in backend if running locally."); // Append the bot's response to the chat
    elements.spinner.style.display = "none"; // Hide the loading spinner

    const errorMsg = 'AI Bot Error: ' + response.status;
    console.log(errorMsg);
    console.log("failed to send request, if running locally check console in backend, key is likely broken.");
    return Promise.reject(errorMsg);
  }
  console.log(response); // Log the response for debugging
  return response.json(); // Return the response text
}
