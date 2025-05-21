// import the fetchUserData function
import { fetchUserData } from './fetchUserData.js';


// loads user data and updates the profile form fields
export async function setUserData() {
    try {
        // fetch all profile data at once
        const [name, uid, email, sid, kasm] = await fetchUserData();

        // update the name, uid, and email placeholders
        const nameInput = document.getElementById("nameChangeInput");    // full name
        const uidInput = document.getElementById("uidChangeInput");      // github id
        const emailInput = document.getElementById("emailChangeInput");  // email
        const sidInput = document.getElementById("sidChangeInput");      // canvas id
        const kasmCheckbox = document.getElementById("kasmChangeInput"); // do you need kasm?

        nameInput.value = name ? name : "Failed to load name. Are you logged in?";
        uidInput.value = uid ? uid : "Failed to load UID. Are you logged in?";
        emailInput.value = email ? email : "Failed to load email. Are you logged in?";
        sidInput.value = sid ? sid : "Failed to load SID. Are you logged in?";
        kasmCheckbox.checked = kasm;
    } catch (error) {
        console.error("error setting placeholders:", error.message);
    }
}