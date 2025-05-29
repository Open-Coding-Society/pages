// import uri
import { javaURI } from '../../js/api/config.js';

let assignment = null;
let currentQueue = [];

let person;

document.getElementById('addQueue').addEventListener('click', addToQueue);
document.getElementById('removeQueue').addEventListener('click', removeFromQueue);

let timerInterval;
let timerlength;
let queueUpdateInterval;

const URL = javaURI + "/api/assignments/"
console.log(URL)

// timer function to start countdown for person
function startTimer() {
    let time = timerlength;
    document.getElementById('beginTimer').style.display = 'none';
    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('timerDisplay').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.title = "" + `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} | Presentation Queue`;
        time--;
        if (time < 0) {
            clearInterval(timerInterval);
            moveToDoneQueue();
            alert("Timer is up! Your presentation is over.")
            document.getElementById('beginTimer').style.display = 'block';
            document.title = "Presentation Queue | Nighthawk Pages"
        }
    }, 1000);
}

// ensure accessible outside of current module
window.startTimer = startTimer;

async function fetchQueue() {
    const response = await fetch(URL + `getQueue/${assignment}`);
    if (response.ok) {
        const data = await response.json();
        updateQueueDisplay(data);
    }
}

async function fetchTimerLength() {
    console.log("test")
    const response = await fetch(URL + `getPresentationLength/${assignment}`);
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        timerlength = data;
        document.getElementById('timerDisplay').textContent = `${Math.floor(timerlength / 60).toString().padStart(2, '0')}:${(timerlength % 60).toString().padStart(2, '0')}`;
    }
}

// add user to waiting
async function addToQueue() {
    let list = document.getElementById("notGoneList").children;
    let names = [];
    Array.from(list).forEach(child => {
        names.push(child.textContent);
    });
    if (names.includes(person)) {
        await fetch(URL + `addToWaiting/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([person])
        });
        fetchQueue();
    } else {
        alert("ERROR: You are not in the working list.")
    }
}

// remove user from waiting
async function removeFromQueue() {
    let list = document.getElementById("waitingList").children;
    let names = [];
    Array.from(list).forEach(child => {
        names.push(child.textContent);
    });
    if (names.includes(person)) {
        await fetch(URL + `removeToWorking/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([person])
        });
        fetchQueue();
    } else {
        alert("ERROR: You are not in the waiting list.")
    }
}

// move user to completed
async function moveToDoneQueue() {
    const firstPerson = [currentQueue[0]];
    await fetch(URL + `doneToCompleted/${assignment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firstPerson)
    });
    fetchQueue();
}

// reset queue - todo: admin only
async function resetQueue() {
    await fetch(URL + `resetQueue/${assignment}`, {
        method: 'PUT'
    });
    fetchQueue();
}

// add/remove a group from waiting list
async function toggleGroupInQueue() {
    // ask for group names
    const groupName = prompt("Enter the group name to add/remove in the waiting queue:");
    if (!groupName || !groupName.trim()) {
        alert("Please enter a valid group name.");
        return;
    }
    
    const trimmedGroup = groupName.trim();
    
    // if group is in queue, remove group, else add group to queue
    const isInQueue = currentQueue.some(item => item === trimmedGroup);
    
    if (isInQueue) {        
        // Now move the group to the completed queue endpoint
        await fetch(URL + `doneToCompleted/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([trimmedGroup])
        });
        alert(`Moved "${trimmedGroup}" to completed queue.`);
    } else {
        // add to queue
        await fetch(URL + `addToWaiting/${assignment}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([trimmedGroup])
        });
        alert(`Added "${trimmedGroup}" to waiting queue.`);
    }
    
    // Refresh the queue display
    fetchQueue();
}

// Attach event listener to the toggle button
document.getElementById('customToggleBtn').addEventListener('click', toggleGroupInQueue);


// update display - ran periodically
function updateQueueDisplay(queue) {
    currentQueue = queue.waiting;

    const notGoneList = document.getElementById('notGoneList');
    const waitingList = document.getElementById('waitingList');
    const doneList = document.getElementById('doneList');

    const notGoneElements = queue.working.map(person => `<div class="card">${person}</div>`);
    notGoneList.innerHTML = notGoneElements.join('');
    waitingList.innerHTML = queue.waiting.map(person => `<div class="card">${person}</div>`).join('');
    doneList.innerHTML = queue.completed.map(person => `<div class="card">${person}</div>`).join('');

    // Check and update global person variable
    if (!person.includes("|")) {
        const matchingPerson = queue.working.find(p => p.includes(person));
        if (matchingPerson) {
            person = matchingPerson; // Update global person variable
        }
    }
}


document.getElementById('beginTimer').addEventListener('click', startTimer);

// Start the interval to periodically update the queue
function startQueueUpdateInterval(intervalInSeconds) {
    if (queueUpdateInterval) clearInterval(queueUpdateInterval); // Clear existing interval if any
    queueUpdateInterval = setInterval(() => {
        console.log("Updating queue...");
        fetchQueue();
        fetchTimerLength();
    }, intervalInSeconds * 1000);
}

// Stop the interval for queue updates if needed
function stopQueueUpdateInterval() {
    if (queueUpdateInterval) clearInterval(queueUpdateInterval);
}

window.addEventListener('load', () => {
    fetchQueue();
    fetchUser();
    showAssignmentModal();
});

async function fetchUser() {
    const response = await fetch(javaURI + `/api/person/get`, {
        method: 'GET',
        cache: "no-cache",
        credentials: 'include',
        headers: { 
            'Content-Type': 'application/json',
            'X-Origin': 'client' 
        }
    });
    
    if (response.ok) {
        const userInfo = await response.json();
        person = userInfo.name;

        console.log(typeof person);
        if (typeof person == 'undefined') {
            alert("Error: You are not logged in. Redirecting you to the login page.")
            let loc = window.location.href
            loc = loc => loc.split('/').slice(0, -2).join('/') || loc;
            window.location.href = loc + "/toolkit-login"
        }
    }
}

async function showAssignmentModal() {
    const modal = document.getElementById('assignmentModal');
    const modalDropdown = document.getElementById('modalAssignmentDropdown');

    const response = await fetch(URL + 'debug');
    if (response.ok) {
        const assignments = await response.json();
        modalDropdown.innerHTML = assignments.map(assignment =>
            `<option value="${assignment.id}">${assignment.name}</option>`
        ).join('');
    }

    modal.style.display = 'block';

    // Add event listener for the confirm button
    document.getElementById('confirmAssignment').addEventListener('click', () => {
        const selectedAssignment = modalDropdown.value;
        if (selectedAssignment) {
            assignment = selectedAssignment; // Set the global assignment variable
            fetchQueue();
            startQueueUpdateInterval(10);
            fetchTimerLength();
            modal.style.display = 'none';
        } else {
            alert('Please select an assignment.');
        }
    });
}

fetchAssignments();
fetchQueue();