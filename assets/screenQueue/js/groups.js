// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
    });
});

// Set API URI based on environment
const javaURI = (location.hostname === "localhost" || location.hostname === "127.0.0.1") 
    ? "http://localhost:8585" 
    : "https://spring.opencodingsociety.com";
    const baseFetchOptions = {
        mode: 'cors',
        cache: 'default',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Origin': 'client'
        }
    };
    
    const fetchOptions = {
        ...baseFetchOptions,
        method: 'GET'
    };
    
    const fetchOptionsPost = {
        ...baseFetchOptions,
        method: 'POST'
    };

// Global variables
let allPeople = [];
let selectedPeople = [];
let allGroups = [];
let dataLoaded = {
    people: false,
    groups: false
};

// Initialize data loading on page load - no matter which tab is active
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Set up form submission
    const form = document.getElementById('create-group-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createGroup();
        });
    }
});

// Initialize data loading
function initializeData() {
    // Load current user, people, and groups regardless of active tab
    Promise.all([fetchPeople(), fetchGroups()])
        .then(() => {
            console.log('All data loaded successfully');
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
}

// Fetch people from API
function fetchPeople() {
    return new Promise((resolve, reject) => {
        fetch(`${javaURI}/api/peopleget`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Get raw text instead of trying to parse JSON directly
            })
            .then(rawText => {
                // Attempt to clean malformed JSON: trim after last valid closing bracket
                const fixedText = rawText.slice(0, rawText.lastIndexOf(']') + 1);
                let data;
                try {
                    data = JSON.parse(fixedText);
                } catch (parseError) {
                    throw new Error('Failed to parse fixed JSON');
                }

                allPeople = data;
                dataLoaded.people = true;
                renderPeopleList();
                resolve(data);
            })
            .catch(error => {
                const personList = document.getElementById('person-list');
                if (personList) {
                    personList.innerHTML = 
                        `<div class="error">Error loading people: ${error.message}</div>`;
                }
                reject(error);
            });
    });
}

// Fetch groups from API
function fetchGroups() {
    return new Promise((resolve, reject) => {
        fetch(`${javaURI}/api/groups`, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                allGroups = data;
                dataLoaded.groups = true;
                renderGroupList();
                resolve(data);
            })
            .catch(error => {
                const groupList = document.getElementById('available-groups');
                if (groupList) {
                    groupList.innerHTML = 
                        `<div class="error">Error loading groups: ${error.message}</div>`;
                }
                reject(error);
            });
    });
}

// Render people list
function renderPeopleList() {
    const personList = document.getElementById('person-list');
    if (!personList) return; // Guard clause if element doesn't exist
    
    if (allPeople.length === 0) {
        personList.innerHTML = '<div class="empty">No people available</div>';
        return;
    }

    personList.innerHTML = allPeople.map(person => `
        <div class="person-item">
            <div class="flex items-center gap-2">
                <input type="checkbox" class="person-checkbox" id="person-${person.id}" 
                    data-id="${person.id}" data-uid="${person.uid}" data-name="${person.name}">
                <label for="person-${person.id}">${person.name} (${person.email})</label>
            </div>
        </div>
    `).join('');

    // Add event listeners to checkboxes
    document.querySelectorAll('.person-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const personId = this.dataset.id;
            const personUid = this.dataset.uid;
            const personName = this.dataset.name;
            
            if (this.checked) {
                if (!selectedPeople.some(p => p.id === personId)) {
                    selectedPeople.push({
                        id: personId,
                        uid: personUid,
                        name: personName
                    });
                }
            } else {
                selectedPeople = selectedPeople.filter(p => p.id !== personId);
            }
            
            renderSelectedPeople();
        });
    });
    
    // Update checkbox state based on selectedPeople
    selectedPeople.forEach(person => {
        const checkbox = document.querySelector(`.person-checkbox[data-id="${person.id}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Render selected people
function renderSelectedPeople() {
    const selectedPeopleList = document.getElementById('selected-people-list');
    if (!selectedPeopleList) return; // Guard clause if element doesn't exist
    
    if (selectedPeople.length === 0) {
        selectedPeopleList.innerHTML = '<div class="empty-selection">No people selected</div>';
        return;
    }

    selectedPeopleList.innerHTML = selectedPeople.map(person => `
        <div class="selected-person" data-id="${person.id}">
            ${person.name}
            <button class="remove-person" data-id="${person.id}">×</button>
        </div>
    `).join('');

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-person').forEach(button => {
        button.addEventListener('click', function() {
            const personId = this.dataset.id;
            selectedPeople = selectedPeople.filter(p => p.id !== personId);
            
            // Uncheck the corresponding checkbox
            const checkbox = document.querySelector(`.person-checkbox[data-id="${personId}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
            
            renderSelectedPeople();
        });
    });
}

// Render group list
function renderGroupList() {
    const groupList = document.getElementById('available-groups');
    if (!groupList) return; // Guard clause if element doesn't exist
    
    if (allGroups.length === 0) {
        groupList.innerHTML = '<div class="empty">No groups available</div>';
        return;
    }

    groupList.innerHTML = allGroups.map(group => `
        <div class="group-item">
            <div class="group-header">
                <div class="group-name">${group.name}</div>
                <div class="group-period">Period: ${group.period}</div>
            </div>
            <div class="group-members">
                <strong>Members (${group.members ? group.members.length : 0}):</strong>
                <div>
                    ${group.members ? group.members.map(member => `
                        <span class="member-tag">${member.name}</span>
                    `).join('') : 'No members'}
                </div>
            </div>
        </div>
    `).join('');
}

// Create a group
function createGroup() {
    const groupName = document.getElementById('group-name').value;
    const groupPeriod = document.getElementById('group-period').value;
    
    if (selectedPeople.length === 0) {
        alert('Please select at least one person for the group');
        return;
    }

    const groupData = {
        name: groupName,
        period: groupPeriod,
        personUids: selectedPeople.map(person => person.uid)
    };

    fetch(`${javaURI}/api/groups`, {
        ...fetchOptionsPost,
        body: JSON.stringify(groupData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Group created successfully!');
        // Reset form
        document.getElementById('create-group-form').reset();
        selectedPeople = [];
        renderSelectedPeople();
        // Uncheck all checkboxes
        document.querySelectorAll('.person-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        // Refresh groups and switch to view tab
        fetchGroups();
        const viewTab = document.querySelector('.tab[data-tab="view"]');
        if (viewTab) {
            viewTab.click();
        }
    })
    .catch(error => {
        alert(`Error creating group: ${error.message}`);
    });
}