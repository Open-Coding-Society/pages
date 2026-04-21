/* ================================
         CONFIG
      ================================ */
      import { javaURI, pythonURI, fetchOptions } from '/assets/js/api/config.js';

      /* ================================
         STATE
      ================================ */
      let allGroups = [];
      let peopleCache = [];  // Cache people to avoid repeated API calls
      let activePeriods = [];
      let activeClasses = [];
      let loadingCount = 0;  // Track concurrent loading operations
      let isAdmin = false;   // Track if current user is an admin
      let selectedUsersForGroup = {}; // Track multi-select members per group
      let collapsedGroups = {}; // Track collapsed/expanded state per group id
      let isSearchMode = false;  // Track if we're in search mode to disable collapse

      // Chat state
      let activeChatGroupId = null;
      let activeChatGroupName = '';
      let stompClient = null;
      let currentUser = null;
      let currentUserDisplayName = 'You';
      let pendingChatImageBase64 = null;
      let pendingChatImageMime = 'image/png';
      let renderedChatMessageKeys = new Set();

      /* ================================
         LOADING HELPERS
      ================================ */
      function showLoading(message = "Loading...") {
        loadingCount++;
        document.getElementById("loadingText").textContent = message;
        document.getElementById("loadingOverlay").classList.remove("hidden");
      }

      function hideLoading() {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount === 0) {
          document.getElementById("loadingOverlay").classList.add("hidden");
        }
      }

      /* ================================
         INIT
      ================================ */
      document.addEventListener("DOMContentLoaded", () => {
        initializeData();
        initializeChatUser();
      });

      // Search groups using API with chaining for better performance
      window.searchGroups = function () {
        const searchTerm = document.getElementById("searchInput").value.trim();
        isSearchMode = !!searchTerm;
        const url = searchTerm
          ? `${javaURI}/api/groups/search?name=${encodeURIComponent(searchTerm)}`
          : `${javaURI}/api/groups`;

        showLoading("Searching...");

        fetch(url, fetchOptions)
          .then(res => res.ok ? res.json() : Promise.reject(new Error("Search failed")))
          .then(data => {
            allGroups = data;
            renderGroups();
          })
          .catch(err => console.error("Search failed", err))
          .finally(() => hideLoading());
      }

      // Load groups, people, and admin status in parallel on page load with chaining
      function initializeData() {
        showLoading("Loading groups...");

        Promise.all([
          fetch(`${javaURI}/api/groups`, fetchOptions)
            .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to load groups"))),
          fetch(`${javaURI}/api/people`, fetchOptions)
            .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to load people"))),
          fetch(`${pythonURI}/api/id`, fetchOptions)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)  // Don't fail if user check fails
        ])
          .then(([groups, people, user]) => {
            allGroups = groups;
            peopleCache = people;
            currentUser = user; // Set global currentUser
            isAdmin = user && user.role === "Admin";
            renderGroups();
          })
          .catch(err => console.error("Failed to initialize data", err))
          .finally(() => hideLoading());
      }

      window.parseUIDs = function (raw) {
        return raw
          .split("\n")
          .map(u => u.trim())
          .filter(Boolean);
      }

      // Synchronous lookup from cache - no API call needed
      window.getPersonIdFromUID = function (uid) {
        const match = peopleCache.find(p => p.uid === uid);
        if (!match) {
          throw new Error(`UID not found: ${uid}`);
        }
        return match.id;
      };

      // Get person object from cache by ID
      window.getPersonById = function (personId) {
        return peopleCache.find(p => p.id === personId);
      };

      // Helpers for multi-select state per group
      function getSelectedUsers(groupId) {
        return selectedUsersForGroup[groupId] || [];
      }

      function setSelectedUsers(groupId, users) {
        selectedUsersForGroup[groupId] = users;
        updateAddSelectedButton(groupId);
        updateSearchResultsSelection(groupId);
      }

      // Search for users by name or GitHub ID with chaining
      window.searchPeopleForGroup = function (groupId) {
        const searchInput = document.getElementById(`member-search-${groupId}`);
        const query = searchInput.value.trim();

        if (!query) {
          alert("Please enter a search term");
          return;
        }

        showLoading("Searching users...");

        fetch(`${javaURI}/api/people/search?query=${encodeURIComponent(query)}`, fetchOptions)
          .then(res => res.ok ? res.json() : Promise.reject(new Error("Search failed")))
          .then(results => displaySearchResults(groupId, results))
          .catch(err => {
            console.error("User search failed", err);
            alert("Failed to search users");
          })
          .finally(() => hideLoading());
      }

      // Display search results in dropdown
      window.displaySearchResults = function (groupId, results) {
        const dropdown = document.getElementById(`search-results-${groupId}`);
        const selected = getSelectedUsers(groupId).map(u => u.id);

        if (!results || results.length === 0) {
          dropdown.innerHTML = `
      <div class="p-3 text-gray-400 text-sm text-center">No users found</div>
    `;
          dropdown.classList.remove("hidden");
          return;
        }

        dropdown.innerHTML = results.map(person => {
          const isSelected = selected.includes(person.id);
          return `
      <div 
        class="px-3 py-2 ${isSelected ? "bg-neutral-600 border border-neutral-500" : "hover:bg-neutral-600"} cursor-pointer flex items-center justify-between text-sm"
        data-person-id="${person.id}"
        onclick="toggleUserSelectionFromResult(${groupId}, ${person.id}, '${person.uid}', '${person.name.replace(/'/g, "\\'")}')">
        <div>
          <span class="text-white font-medium">${person.name}</span>
          <span class="text-gray-400 ml-2">@${person.uid}</span>
        </div>
        <span class="text-xs ${isSelected ? "text-green-400" : "text-gray-500"}">${isSelected ? "Selected" : "Tap to select"}</span>
      </div>
    `;
        }).join("");

        dropdown.classList.remove("hidden");
      }

      // Toggle user selection from search results
      window.toggleUserSelectionFromResult = function (groupId, personId, uid, name) {
        const current = getSelectedUsers(groupId);
        const exists = current.find(u => u.id === personId);
        const updated = exists
          ? current.filter(u => u.id !== personId)
          : [...current, { id: personId, uid, name }];
        setSelectedUsers(groupId, updated);
      }

      // Clear selected users for a group
      window.clearSearchSelection = function (groupId) {
        setSelectedUsers(groupId, []);
        const searchInput = document.getElementById(`member-search-${groupId}`);
        if (searchInput) searchInput.value = "";
        const dropdown = document.getElementById(`search-results-${groupId}`);
        if (dropdown) dropdown.classList.add("hidden");
      }

      // Add all selected members to group with chaining
      window.addSelectedMembersToGroup = async function (groupId) {
        const selected = getSelectedUsers(groupId);

        if (!selected.length) {
          alert("Please select at least one user");
          return;
        }

        showLoading("Adding members...");
        const successes = [];
        const failures = [];

        for (const person of selected) {
          try {
            const res = await fetch(`${javaURI}/api/groups/${groupId}/members/${person.id}`, { ...fetchOptions, method: "POST" });
            if (!res.ok) {
              const text = await res.text();
              console.error("ADD MEMBER ERROR:", text);
              failures.push(person);
              continue;
            }
            successes.push(person);
          } catch (err) {
            console.error("ADD MEMBER ERROR:", err);
            failures.push(person);
          }
        }

        const group = allGroups.find(g => g.id === groupId);
        if (group) {
          if (!group.members) group.members = [];
          successes.forEach(person => {
            if (!group.members.find(m => m.id === person.id)) {
              group.members.push({ id: person.id, name: person.name, uid: person.uid });
            }
          });
        }

        setSelectedUsers(groupId, []);
        renderGroups();
        if (failures.length) {
          alert(`Added ${successes.length} member(s). ${failures.length} failed. Is the user already a member of the group? Check console for details.`);
        }
        hideLoading();
      }

      // Add member to group with chaining - updates local state instead of refetching
      window.addMemberToGroup = function (groupId, uid) {
        showLoading("Adding member...");

        const personId = getPersonIdFromUID(uid);
        const person = getPersonById(personId);

        fetch(`${javaURI}/api/groups/${groupId}/members/${personId}`, { ...fetchOptions, method: "POST" })
          .then(res => {
            if (!res.ok) {
              return res.text().then(text => {
                console.error("ADD MEMBER ERROR:", text);
                return Promise.reject(new Error("Failed to add member"));
              });
            }
            return res;
          })
          .then(() => {
            // Update local state instead of refetching all groups
            const group = allGroups.find(g => g.id === groupId);
            if (group) {
              if (!group.members) group.members = [];
              // Only add if not already present
              if (!group.members.find(m => m.id === personId)) {
                group.members.push({ id: personId, name: person?.name || uid, uid: uid });
              }
            }
            renderGroups();
          })
          .catch(err => alert(err.message))
          .finally(() => hideLoading());
      }

      // Remove member from group with chaining - updates local state instead of refetching
      window.removeMemberFromGroup = function (groupId, personId) {
        showLoading("Removing member...");

        fetch(`${javaURI}/api/groups/${groupId}/members/${personId}`, { ...fetchOptions, method: "DELETE" })
          .then(res => res.ok ? res : Promise.reject(new Error("Failed to remove member")))
          .then(() => {
            // Update local state instead of refetching all groups
            const group = allGroups.find(g => g.id === groupId);
            if (group && group.members) {
              group.members = group.members.filter(m => m.id !== personId);
            }
            renderGroups();
          })
          .catch(err => alert(err.message))
          .finally(() => hideLoading());
      }

      // Open group chat modal
      window.openGroupChat = async function (groupId, groupName) {
        const group = allGroups.find(g => g.id === groupId);
        if (!group) {
          alert(`Group not found`);
          return;
        }

        activeChatGroupId = groupId;
        activeChatGroupName = groupName;

        const memberCount = (group.members || []).length;

        // Update modal header
        document.getElementById('chatModalTitle').textContent = groupName;
        document.getElementById('chatModalSubtitle').textContent =
          `Period ${group.period} · ${group.course} · ${memberCount} member${memberCount !== 1 ? 's' : ''}`;

        // Update input placeholder
        const chatInput = document.getElementById('chatInput');
        const groupNameFormatted = groupName.toLowerCase().replace(/\s+/g, '-');
        chatInput.placeholder = `Message #${groupNameFormatted}`;

        // Show modal and prevent body scroll
        document.getElementById('chatModal').classList.remove('hidden');
        document.body.classList.add('modal-open');

        showChatTab();
        clearChatImagePreview();

        try {
          await fetchChatMessages();
          await fetchSharedFiles();
          startChatPolling();
        } catch (err) {
          console.error('Failed to open chat', err);
        }
      }

      // Close group chat modal
      window.closeGroupChat = function () {
        document.getElementById('chatModal').classList.add('hidden');
        document.body.classList.remove('modal-open');
        stopChatPolling();
        activeChatGroupId = null;
        activeChatGroupName = '';
        clearChatImagePreview();
      }

      // Delete group with chaining - updates local state instead of refetching
      window.deleteGroup = function (groupId) {
        const confirmed = confirm(
          "Are you sure you want to delete this group?\n\nThis action cannot be undone."
        );

        if (!confirmed) return;

        showLoading("Deleting group...");

        fetch(`${javaURI}/api/groups/${groupId}`, { ...fetchOptions, method: "DELETE" })
          .then(res => {
            if (!res.ok) {
              return res.text().then(text => {
                console.error("DELETE GROUP ERROR:", text);
                alert("Failed to delete group");
                return Promise.reject(new Error("Failed to delete group"));
              });
            }
            return res;
          })
          .then(() => {
            // Update local state instead of refetching all groups
            allGroups = allGroups.filter(g => g.id !== groupId);
            renderGroups();
          })
          .catch(err => console.error(err))
          .finally(() => hideLoading());
      };

      // Navigate to group dashboard page
      window.navigateToGroupDashboard = function (groupName) {
        // Convert group name to URL-friendly format
        const urlFriendlyName = encodeURIComponent(groupName.toLowerCase().replace(/\s+/g, '-'));
        window.location.href = `/student/groups/dashboard?group=${urlFriendlyName}`;
      };

      /* ================================
         API CALLS
      ================================ */
      // Manual refresh function with chaining - only call when absolutely needed
      window.loadGroups = function () {
        fetch(`${javaURI}/api/groups`, fetchOptions)
          .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to load groups")))
          .then(data => {
            allGroups = data;
            renderGroups();
          })
          .catch(err => console.error("Failed to load groups", err));
      }

      // Refresh people cache with chaining if needed (e.g., new user registered)
      window.refreshPeopleCache = function () {
        fetch(`${javaURI}/api/people`, fetchOptions)
          .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to refresh people")))
          .then(data => { peopleCache = data; })
          .catch(err => console.error("Failed to refresh people cache", err));
      }

      // Create new group with chaining (single API call)
      window.saveNewGroup = function () {
        const name = document.getElementById("newGroupName").value.trim();
        const period = document.getElementById("newGroupPeriod").value;
        const course = document.getElementById("newGroupClass").value;

        console.log("Submit button clicked! Group Name:", name, "Period:", period, "Course:", course);

        if (!name || !period || !course) {
          alert("Please fill all required fields.");
          return;
        }

        showLoading("Creating group...");

        fetch(`${javaURI}/api/groups`, {
          ...fetchOptions,
          method: "POST",
          body: JSON.stringify({ name, period: String(period), course })
        })
          .then(res => {
            if (!res.ok) {
              return res.text().then(text => {
                console.error("GROUP CREATION ERROR:", text);
                return Promise.reject(new Error("Group creation failed"));
              });
            }
            return res.json();
          })
          .then(newGroup => {
            newGroup.members = [];
            // Update local state instead of refetching
            allGroups.push(newGroup);
            cancelAddGroup();
            renderGroups();
          })
          .catch(err => {
            console.error(err);
            alert(err.message);
          })
          .finally(() => hideLoading());
      };



      /* ================================
         RENDERING
      ================================ */
      window.renderGroups = function () {
        const container = document.getElementById("groupsContainer");
        const empty = document.getElementById("emptyState");

        container.innerHTML = "";

        // Only filter by period/class (search is handled by API)
        const filtered = allGroups.filter(g => {
          if (activePeriods.length && !activePeriods.includes(String(g.period))) return false;
          if (activeClasses.length && !activeClasses.includes(g.course)) return false;
          return true;
        });

        if (!filtered.length) {
          empty.classList.remove("hidden");
          return;
        }

        empty.classList.add("hidden");

        filtered.forEach(group => {
          const el = document.createElement("div");
          el.className = "bg-neutral-700 rounded-lg p-4 border border-neutral-600";

          const isCollapsed = isSearchMode ? false : (collapsedGroups[group.id] !== false);

          el.innerHTML = `
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2">
          <!-- Toggle visibility button -->
          ${!isSearchMode ? `
          <button
            class="w-8 h-8 flex items-center justify-center rounded bg-neutral-600 hover:bg-neutral-500 text-gray-300 hover:text-white transition-colors"
            title="${isCollapsed ? 'Show' : 'Hide'} member details"
            onclick="toggleGroupDetails(${group.id})">
            ${isCollapsed ? `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            ` : `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            `}
          </button>
          ` : ''}
          <div class="cursor-pointer hover:opacity-80 transition-opacity" onclick="navigateToGroupDashboard('${group.name.replace(/'/g, "\\'")}')">
            <h4 class="text-lg font-semibold text-white hover:text-indigo-400 transition-colors">${group.name}</h4>
            <p class="text-sm text-gray-400">
              Period ${group.period} · ${group.course}${isCollapsed ? ` · ${((members) => {
              if (!members.length) return 'No members';
              const shown = members.slice(0, 3).map(m => m.name).join(', ');
              return members.length > 3 ? shown + ` +${members.length - 3} more` : shown;
            })(group.members || [])}` : ''}
            </p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-2">
          <!-- Join/Add button (Added per user request) -->
          ${(() => {
              const isMember = group.members?.some(m => m.uid === currentUser?.uid);
              if (!isMember && currentUser?.uid) {
                return `
                <button
                  class="w-auto px-3 flex items-center justify-center rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors gap-1"
                  title="Join this group"
                  onclick="addMemberToGroup(${group.id}, '${currentUser.uid}')">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Join Group
                </button>
              `;
              }
              return '';
            })()}

          <!-- Dashboard button -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded bg-neutral-600 hover:bg-indigo-600 text-gray-300 hover:text-white transition-colors"
            title="View group dashboard"
            onclick="navigateToGroupDashboard('${group.name.replace(/'/g, "\\'")}')">
            📊
          </button>
          <!-- Chat button -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded bg-neutral-600 hover:bg-green-600 text-gray-300 hover:text-white transition-colors"
            title="Chat with group members"
            onclick="openGroupChat(${group.id}, '${group.name.replace(/'/g, "\\'")}')" >
            💬
          </button>

          <!-- Feedback button -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded bg-neutral-600 hover:bg-indigo-600 text-gray-300 hover:text-white transition-colors"
            title="Submit feedback for this group"
            onclick="openFeedbackModal(${group.id})">
            📝
          </button>

          <!-- Trash (admin only) -->
          ${isAdmin ? `
          <button
            class="w-9 h-9 flex items-center justify-center rounded bg-neutral-600 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
            title="Delete group (Admin only)"
            onclick="deleteGroup(${group.id})">
            🗑️
          </button>
          ` : ''}
        </div>
      </div>

      ${!isCollapsed ? `
      <!-- Members row -->
      <div class="mt-3 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
        ${(group.members || []).map(m => `
          <span
            class="group px-3 py-1 bg-neutral-600 hover:bg-red-600 text-sm text-gray-200 rounded-full cursor-pointer transition-colors"
            onclick="removeMemberFromGroup(${group.id}, ${m.id})"
            title="Click to remove">
            <span class="group-hover:hidden">${m.name} <span class="text-gray-400">@${m.uid}</span></span>
            <span class="hidden group-hover:inline">Remove ${m.uid}</span>
          </span>
        `).join("")}
      </div>

      <!-- Add member by search -->
      <div class="mt-4 relative">
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by full name"
            class="flex-1 px-3 py-2 bg-neutral-600 text-white text-sm rounded-lg border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="member-search-${group.id}"
            onkeydown="if(event.key==='Enter') searchPeopleForGroup(${group.id})"
            oninput="if(!this.value.trim()) document.getElementById('search-results-${group.id}').classList.add('hidden')"
          />

          <!-- Search button -->
          <button
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            title="Search users"
            onclick="searchPeopleForGroup(${group.id})">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>

          <!-- Add selected user -->
          <button
            id="add-selected-btn-${group.id}"
            class="px-4 h-10 flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add selected members"
            onclick="addSelectedMembersToGroup(${group.id})"
            disabled>
            Add Selected
          </button>
        </div>

        <!-- Search results dropdown -->
        <div
          id="search-results-${group.id}"
          class="hidden absolute left-0 right-12 mt-1 bg-neutral-700 border border-neutral-600 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
        </div>
      </div>
      ` : ''}
    `;
          container.appendChild(el);
          updateAddSelectedButton(group.id);
        });
      }

      // Update add button label/state based on selection count
      function updateAddSelectedButton(groupId) {
        const btn = document.getElementById(`add-selected-btn-${groupId}`);
        if (!btn) return;
        const count = getSelectedUsers(groupId).length;
        btn.textContent = count ? `Add Selected (${count})` : "Add Selected";
        btn.disabled = count === 0;
      }

      // Highlight selected rows in search dropdown after rerender
      function updateSearchResultsSelection(groupId) {
        const dropdown = document.getElementById(`search-results-${groupId}`);
        if (!dropdown) return;
        const selectedIds = getSelectedUsers(groupId).map(u => u.id);
        dropdown.querySelectorAll("[data-person-id]").forEach(item => {
          const id = Number(item.dataset.personId);
          const isSelected = selectedIds.includes(id);
          item.classList.toggle("bg-neutral-600", isSelected);
          item.classList.toggle("border", isSelected);
        });
      }

      /* ================================
         ADD GROUP TOGGLE
      ================================ */
      window.toggleAddGroup = function () {
        document.getElementById("addGroupExpanded").classList.toggle("hidden");
        document.getElementById("addGroupChevron").classList.toggle("rotate-180");
      }

      // Toggle visibility of group member details
      window.toggleGroupDetails = function (groupId) {
        collapsedGroups[groupId] = collapsedGroups[groupId] === false ? true : false;
        renderGroups();
      }

      window.cancelAddGroup = function () {
        document.getElementById("addGroupExpanded").classList.add("hidden");
        document.getElementById("newGroupName").value = "";
        document.getElementById("newGroupPeriod").value = "";
        document.getElementById("newGroupClass").value = "";
      }

      /* ================================
         PRIOR EXPERIENCE (Smart Groups)
      ================================ */

      const PERSONA_OPTIONS = [
        "Technologist", "Scrummer", "Planner", "Closer"
      ];

      function renderPriorPersonaChoices() {
        const wrap = document.getElementById("priorPersonaChoices");
        if (!wrap) return;

        wrap.innerHTML = PERSONA_OPTIONS.map(p => `
    <label class="flex items-center gap-2 px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-700">
      <input type="checkbox" class="accent-indigo-500 prior-persona-checkbox" value="${p}">
      <span class="text-sm text-gray-200">${p}</span>
    </label>
  `).join("");
      }

      window.togglePriorExperience = function () {
        const toggle = document.getElementById("usePriorExpToggle");
        const knob = document.getElementById("usePriorExpKnob");
        const form = document.getElementById("priorExperienceForm");

        if (!toggle || !knob || !form) return;

        const on = toggle.checked;
        form.classList.toggle("hidden", !on);

        // tiny visual toggle effect
        knob.style.transform = on ? "translateX(20px)" : "translateX(0px)";
        toggle.parentElement.querySelector("div").style.backgroundColor = on ? "#4f46e5" : "#525252";

        if (on) renderPriorPersonaChoices();
      };

      window.previewPriorFeedbackCount = function () {
        const status = document.getElementById("priorFeedbackStatus");
        if (!status) return;

        const stored = (typeof getFeedbackStore === "function") ? getFeedbackStore() : [];
        status.textContent = `Stored feedback rows on this device: ${stored.length}`;
      };

      // Builds one feedback row from the inline “prior experiences” form
      function readInlinePriorExperienceRow() {
        const enabled = document.getElementById("usePriorExpToggle")?.checked;
        if (!enabled) return null;

        const prevSize = parseInt(document.getElementById("priorGroupSize")?.value || "0", 10);
        const studentRating = parseInt(document.getElementById("priorStudentRating")?.value || "0", 10);
        const teacherRating = parseInt(document.getElementById("priorTeacherRating")?.value || "0", 10);
        const note = (document.getElementById("priorNote")?.value || "").trim();

        if (!(prevSize >= 2 && prevSize <= 10)) throw new Error("Prior group size must be 2–10.");
        if (!(studentRating >= 1 && studentRating <= 5)) throw new Error("Prior student rating must be 1–5.");
        if (!(teacherRating >= 1 && teacherRating <= 5)) throw new Error("Prior teacher rating must be 1–5.");

        const personas = [...document.querySelectorAll(".prior-persona-checkbox:checked")].map(cb => cb.value);
        if (!personas.length) throw new Error("Select at least 1 persona for the prior group.");

        return {
          ts: Date.now(),
          source: "inline_prior_experience",
          prev_group_size: prevSize,
          personas: personas,
          student_rating_1to5: studentRating,
          teacher_rating_1to5: teacherRating,
          note
        };
      }

      // Collects feedback rows that will be sent to Flask:
      // - localStorage saved feedback (your existing modal submissions)
      // - + the inline prior experience row (if enabled)
      function collectFeedbackRowsForTraining() {
        const toggleOn = document.getElementById("usePriorExpToggle")?.checked;
        if (!toggleOn) return [];

        const stored = (typeof getFeedbackStore === "function") ? getFeedbackStore() : [];
        const normalizedStored = stored.map(r => ({
          ts: r.ts,
          source: "stored_group_feedback",
          prev_group_size: (r.members?.length ? r.members.length : null),
          // if you later add personas snapshot to stored feedback, include it here:
          personas: r.personas || null,
          student_rating_1to5: r.student_rating_1to5,
          teacher_rating_1to5: r.teacher_rating_1to5,
          note: r.note
        }));

        const inlineRow = readInlinePriorExperienceRow(); // can throw
        return inlineRow ? [...normalizedStored, inlineRow] : normalizedStored;
      }

      /* ================================
         FILTERS
      ================================ */
      window.toggleDropdown = function (type) {
        document.getElementById(type + "Dropdown").classList.toggle("hidden");
      }

      window.clearAllFilters = function () {
        activePeriods = [];
        activeClasses = [];
        document.querySelectorAll(".period-checkbox,.class-checkbox").forEach(cb => cb.checked = false);
        document.getElementById("periodAllCheckbox").checked = true;
        document.getElementById("classAllCheckbox").checked = true;
        document.getElementById("periodFilterLabel").textContent = "All Periods";
        document.getElementById("classFilterLabel").textContent = "All Classes";
        document.getElementById("searchInput").value = "";
        searchGroups();  // Reload all groups
      }

      window.onPeriodCheckboxChange = function (cb) {
        activePeriods = [...document.querySelectorAll(".period-checkbox:checked")].map(c => c.value);
        document.getElementById("periodAllCheckbox").checked = !activePeriods.length;
        document.getElementById("periodFilterLabel").textContent =
          activePeriods.length ? `Periods: ${activePeriods.join(", ")}` : "All Periods";
        renderGroups();
      }

      window.onClassCheckboxChange = function (cb) {
        activeClasses = [...document.querySelectorAll(".class-checkbox:checked")].map(c => c.value);
        document.getElementById("classAllCheckbox").checked = !activeClasses.length;
        document.getElementById("classFilterLabel").textContent =
          activeClasses.length ? `Classes: ${activeClasses.join(", ")}` : "All Classes";
        renderGroups();
      }

      window.onPeriodAllChange = function (cb) {
        if (cb.checked) {
          document.querySelectorAll(".period-checkbox").forEach(c => c.checked = false);
          activePeriods = [];
          renderGroups();
        }
      }

      window.onClassAllChange = function (cb) {
        if (cb.checked) {
          document.querySelectorAll(".class-checkbox").forEach(c => c.checked = false);
          activeClasses = [];
          renderGroups();
        }
      }

      /* ================================
         SMART GROUP FORMATION (SRP VERSION)
      ================================ */
      let generatedGroups = []; // Store generated groups before saving

      function readSmartGroupForm() {
        return {
          period: document.getElementById('smartGroupPeriod').value,
          course: document.getElementById('smartGroupClass').value,
          groupSize: parseInt(document.getElementById('smartGroupSize').value, 10),
          prefix: document.getElementById('smartGroupPrefix').value.trim() || 'Team'
        };
      }

      function validateSmartGroupForm({ period, course, groupSize }) {
        if (!period || !course) {
          throw new Error('Please select both period and class');
        }

        if (groupSize < 2 || groupSize > 10) {
          throw new Error('Group size must be between 2 and 10');
        }
      }

      function resetSmartGroupForm() {
        document.getElementById('smartGroupPeriod').value = '';
        document.getElementById('smartGroupClass').value = '';
        document.getElementById('smartGroupSize').value = '4';
        document.getElementById('smartGroupPrefix').value = '';
        generatedGroups = [];
        lockedGroups = new Set();
      }

      function openSmartGroupModalUI() {
        document.getElementById('smartGroupModal').classList.remove('hidden');
        document.getElementById('smartGroupResults').classList.add('hidden');
        document.body.classList.add('modal-open');
      }

      function closeSmartGroupModalUI() {
        document.getElementById('smartGroupModal').classList.add('hidden');
        document.body.classList.remove('modal-open');
      }

      function getStudentsInSelectedClass(period, course) {
        const groupsInPeriod = allGroups.filter(g =>
          String(g.period) === String(period) && g.course === course
        );

        const seenIds = new Set();
        const studentsInClass = [];

        groupsInPeriod.forEach(group => {
          (group.members || []).forEach(member => {
            if (!seenIds.has(member.id)) {
              seenIds.add(member.id);
              studentsInClass.push(member);
            }
          });
        });

        return studentsInClass;
      }

      function validateEnoughStudents(students, groupSize, period, course) {
        if (students.length < groupSize) {
          throw new Error(
            `Not enough students in Period ${period} ${course}. Found ${students.length}, need at least ${groupSize}.`
          );
        }
      }

      function buildUserUids(students) {
        return students.map(student => student.uid);
      }

      async function evaluatePersonaCoverage(user_uids, groupSize, totalStudents) {
        try {
          const checkResp = await fetch(`${pythonURI}/api/persona/evaluate-group`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ user_uids })
          });

          if (!checkResp.ok) {
            return { studentsWithPersonas: 0, useAI: false };
          }

          const checkResult = await checkResp.json();
          const studentsWithPersonas = checkResult.members.filter(
            m => m.personas && m.personas.length > 0
          ).length;

          const minRequired = Math.max(groupSize * 2, Math.ceil(totalStudents * 0.5));
          const useAI = studentsWithPersonas >= minRequired;

          return { studentsWithPersonas, useAI };
        } catch (err) {
          console.log('⚠️ Persona check failed, falling back to random:', err);
          return { studentsWithPersonas: 0, useAI: false };
        }
      }

      async function requestAIGroups(user_uids, groupSize, feedbackRows) {
        const response = await fetch(`${pythonURI}/api/persona/form-groups`, {
          ...fetchOptions,
          method: 'POST',
          body: JSON.stringify({
            user_uids,
            group_size: groupSize,
            incorporate_prior_experiences: feedbackRows.length > 0,
            feedback_rows: feedbackRows
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to form groups');
        }

        return response.json();
      }

      function buildRandomGroups(students, groupSize) {
        const shuffled = [...students].sort(() => Math.random() - 0.5);
        const randomGroups = [];

        for (let i = 0; i < shuffled.length; i += groupSize) {
          const groupMembers = shuffled.slice(i, i + groupSize);
          randomGroups.push({
            user_uids: groupMembers.map(p => p.uid),
            team_score: null
          });
        }

        return {
          groups: randomGroups,
          average_score: null,
          method: 'random'
        };
      }

      function getMethodBadgeHTML(useAI) {
        return useAI
          ? '<span class="inline-flex px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">✨ AI-Optimized</span>'
          : '<span class="inline-flex px-3 py-1 bg-neutral-600 text-white text-xs font-semibold rounded-full">🎲 Random Assignment</span>';
      }

      function convertResultToGeneratedGroups(result, students, period, course, prefix) {
        return result.groups.map((group, index) => {
          const letter = String.fromCharCode(65 + index);
          const members = group.user_uids.map(uid => {
            const person = students.find(p => p.uid === uid);
            return { id: person?.id, uid, name: person?.name || uid };
          });

          return {
            name: `${prefix} ${letter}`,
            period,
            course,
            team_score: group.team_score,
            memberIds: members.map(m => m.id),
            members
          };
        });
      }

      function renderSmartGroupMethodBadge(useAI) {
        document.getElementById('stagingMethodBadge').innerHTML = getMethodBadgeHTML(useAI);
      }

      function showSmartGroupResults() {
        document.getElementById('smartGroupResults').classList.remove('hidden');
        document.getElementById('smartGroupResults').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

      function applySmartGroupResults(result, config, students, useAI) {
        lockedGroups = new Set();

        generatedGroups = convertResultToGeneratedGroups(
          result,
          students,
          config.period,
          config.course,
          config.prefix
        );

        renderSmartGroupMethodBadge(useAI);
        renderStagingGroups();
        showSmartGroupResults();
      }

      async function buildSmartGroupResult(students, config, useAI) {
        if (!useAI) {
          console.log('🎲 Using random grouping');
          showLoading('Creating random groups...');
          return buildRandomGroups(students, config.groupSize);
        }

        console.log('✨ Using AI grouping');
        showLoading('Using AI to create optimal groups...');

        let feedbackRows = [];
        try {
          feedbackRows = collectFeedbackRowsForTraining();
        } catch (e) {
          throw new Error(`Prior experience input error: ${e.message}`);
        }

        return requestAIGroups(
          buildUserUids(students),
          config.groupSize,
          feedbackRows
        );
      }

      window.openSmartGroupFormation = function () {
        openSmartGroupModalUI();
      };

      window.closeSmartGroupModal = function () {
        closeSmartGroupModalUI();
        resetSmartGroupForm();
      };

      window.generateSmartGroups = async function () {
        showLoading('Finding students and analyzing personas...');

        try {
          const config = readSmartGroupForm();
          validateSmartGroupForm(config);

          const students = getStudentsInSelectedClass(config.period, config.course);
          validateEnoughStudents(students, config.groupSize, config.period, config.course);

          const user_uids = buildUserUids(students);
          const { studentsWithPersonas, useAI } = await evaluatePersonaCoverage(
            user_uids,
            config.groupSize,
            students.length
          );

          console.log(`Students with personas: ${studentsWithPersonas}`);
          const result = await buildSmartGroupResult(students, config, useAI);

          applySmartGroupResults(result, config, students, useAI);
        } catch (error) {
          console.error('❌ Error generating groups:', error);
          alert(error.message || 'Failed to generate groups');
        } finally {
          hideLoading();
        }
      };

      /* ================================
         STAGING STATE
      ================================ */
      let lockedGroups = new Set(); // indices of locked groups
      let dragSrc = null; // { groupIndex, memberIndex }

      window.displaySmartGroupResults = function (result, period, course, allPeople, useAI = true) {
        const prefix = document.getElementById('smartGroupPrefix').value.trim() || 'Team';
        lockedGroups = new Set();

        // Build groups with member details
        generatedGroups = result.groups.map((group, index) => {
          const letter = String.fromCharCode(65 + index);
          const members = group.user_uids.map(uid => {
            const person = allPeople.find(p => p.uid === uid);
            return { id: person?.id, uid, name: person?.name || uid };
          });
          return {
            name: `${prefix} ${letter}`,
            period, course,
            team_score: group.team_score,
            memberIds: members.map(m => m.id),
            members
          };
        });

        // Method badge
        const methodBadge = useAI
          ? '<span class="inline-flex px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">✨ AI-Optimized</span>'
          : '<span class="inline-flex px-3 py-1 bg-neutral-600 text-white text-xs font-semibold rounded-full">🎲 Random Assignment</span>';
        document.getElementById('stagingMethodBadge').innerHTML = methodBadge;

        renderStagingGroups();

        document.getElementById('smartGroupResults').classList.remove('hidden');
        document.getElementById('smartGroupResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function renderStagingGroups() {
        const container = document.getElementById('smartGroupResultsContent');

        container.innerHTML = generatedGroups.map((group, gi) => {
          const locked = lockedGroups.has(gi);
          const scoreHtml = group.team_score !== null
            ? `<span class="text-xs font-semibold ${group.team_score >= 70 ? 'text-green-400' : group.team_score >= 60 ? 'text-yellow-400' : 'text-orange-400'}">${group.team_score.toFixed(1)}</span>`
            : `<span class="text-xs text-gray-500">Random</span>`;

          const membersHtml = group.members.map((m, mi) => `
      <div
        class="staging-member flex items-center gap-2 px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg cursor-grab active:cursor-grabbing transition-colors text-xs"
        draggable="true"
        data-group="${gi}"
        data-member="${mi}"
        ondragstart="onDragStart(event, ${gi}, ${mi})"
        ondragend="onDragEnd(event)">
        <svg class="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
        </svg>
        <span class="text-white font-medium truncate">${m.name}</span>
        <span class="text-gray-400 truncate">@${m.uid}</span>
      </div>
    `).join('');

          return `
      <div
        class="staging-group rounded-xl border-2 ${locked ? 'border-green-500/60 bg-green-950/20' : 'border-neutral-600 bg-neutral-800'} transition-all duration-200 flex flex-col"
        data-group="${gi}"
        ondragover="onDragOver(event)"
        ondragleave="onDragLeave(event)"
        ondrop="onDrop(event, ${gi})">

        <!-- Card header -->
        <div class="flex items-center justify-between px-3 pt-3 pb-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-white font-semibold text-sm">${group.name}</span>
              ${locked ? '<span class="text-xs text-green-400 font-medium">Locked</span>' : ''}
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-gray-400">${group.members.length} members</span>
              ${scoreHtml}
            </div>
          </div>
          <button
            onclick="toggleLock(${gi})"
            title="${locked ? 'Unlock group' : 'Lock group'}"
            class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${locked ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white'}">
            ${locked
              ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`
              : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>`
            }
          </button>
        </div>

        <!-- Drop zone -->
        <div class="flex flex-col gap-1.5 px-3 pb-3 min-h-[60px]">
          ${membersHtml}
          <div class="drop-hint hidden text-xs text-center text-gray-500 py-2 border border-dashed border-neutral-600 rounded-lg mt-1">
            Drop here
          </div>
        </div>
      </div>
    `;
        }).join('');
      }

      /* ================================
         DRAG AND DROP
      ================================ */
      window.onDragStart = function (e, groupIndex, memberIndex) {
        dragSrc = { groupIndex, memberIndex };
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('opacity-40');

        // Show drop hints on all other groups
        document.querySelectorAll('.staging-group').forEach((card, i) => {
          if (i !== groupIndex) {
            card.querySelector('.drop-hint')?.classList.remove('hidden');
          }
        });
      }

      window.onDragEnd = function (e) {
        e.target.classList.remove('opacity-40');
        document.querySelectorAll('.drop-hint').forEach(h => h.classList.add('hidden'));
        document.querySelectorAll('.staging-group').forEach(c => c.classList.remove('drag-over'));
      }

      window.onDragOver = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
      }

      window.onDragLeave = function (e) {
        e.currentTarget.classList.remove('drag-over');
      }

      window.onDrop = function (e, targetGroupIndex) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (dragSrc === null) return;
        if (dragSrc.groupIndex === targetGroupIndex) return;

        const { groupIndex: srcGi, memberIndex: srcMi } = dragSrc;

        // Move the member
        const member = generatedGroups[srcGi].members[srcMi];
        generatedGroups[srcGi].members.splice(srcMi, 1);
        generatedGroups[srcGi].memberIds = generatedGroups[srcGi].members.map(m => m.id);
        generatedGroups[targetGroupIndex].members.push(member);
        generatedGroups[targetGroupIndex].memberIds = generatedGroups[targetGroupIndex].members.map(m => m.id);

        // Auto-unlock source group if it was locked
        if (lockedGroups.has(srcGi)) {
          lockedGroups.delete(srcGi);
        }

        dragSrc = null;
        renderStagingGroups();
      }

      /* ================================
         LOCK TOGGLE
      ================================ */
      window.toggleLock = function (groupIndex) {
        if (lockedGroups.has(groupIndex)) {
          lockedGroups.delete(groupIndex);
        } else {
          lockedGroups.add(groupIndex);
        }
        renderStagingGroups();
      }

      /* ================================
         REGENERATE UNLOCKED
      ================================ */
      window.regenerateUnlocked = async function () {
        const unlockedIndices = generatedGroups
          .map((_, i) => i)
          .filter(i => !lockedGroups.has(i));

        if (unlockedIndices.length === 0) {
          alert('All groups are locked. Unlock at least one group to regenerate.');
          return;
        }

        // Collect students from unlocked groups only
        const unlockedStudents = [];
        const seenIds = new Set();
        unlockedIndices.forEach(i => {
          generatedGroups[i].members.forEach(m => {
            if (!seenIds.has(m.id)) {
              seenIds.add(m.id);
              unlockedStudents.push(m);
            }
          });
        });

        const groupSize = parseInt(document.getElementById('smartGroupSize').value);
        const period = document.getElementById('smartGroupPeriod').value;
        const course = document.getElementById('smartGroupClass').value;

        showLoading('Regenerating unlocked groups...');

        try {
          const user_uids = unlockedStudents.map(s => s.uid);

          // Try AI, fall back to random
          let newGroups = [];
          try {
            const resp = await fetch(`${pythonURI}/api/persona/form-groups`, {
              ...fetchOptions,
              method: 'POST',
              body: JSON.stringify({ user_uids, group_size: groupSize })
            });
            if (resp.ok) {
              const result = await resp.json();
              const prefix = document.getElementById('smartGroupPrefix').value.trim() || 'Team';
              newGroups = result.groups.map(g => {
                const members = g.user_uids.map(uid => unlockedStudents.find(s => s.uid === uid)).filter(Boolean);
                return { members, memberIds: members.map(m => m.id), team_score: g.team_score };
              });
            } else {
              throw new Error('AI failed');
            }
          } catch {
            // Random fallback
            const shuffled = [...unlockedStudents].sort(() => Math.random() - 0.5);
            for (let i = 0; i < shuffled.length; i += groupSize) {
              const members = shuffled.slice(i, i + groupSize);
              newGroups.push({ members, memberIds: members.map(m => m.id), team_score: null });
            }
          }

          // Replace unlocked groups with new ones, keeping names and period/course
          let newGroupIdx = 0;
          unlockedIndices.forEach(i => {
            if (newGroupIdx < newGroups.length) {
              generatedGroups[i].members = newGroups[newGroupIdx].members;
              generatedGroups[i].memberIds = newGroups[newGroupIdx].memberIds;
              generatedGroups[i].team_score = newGroups[newGroupIdx].team_score;
              newGroupIdx++;
            } else {
              // No more new groups - empty this slot
              generatedGroups[i].members = [];
              generatedGroups[i].memberIds = [];
            }
          });

          // Remove empty groups
          generatedGroups = generatedGroups.filter(g => g.members.length > 0);

          renderStagingGroups();
        } catch (err) {
          console.error('Regeneration failed:', err);
          alert('Failed to regenerate groups');
        } finally {
          hideLoading();
        }
      }

      /* ================================
         SAVE
      ================================ */
      window.saveSmartGroups = async function () {
        if (!generatedGroups.length) {
          alert('No groups to save');
          return;
        }

        showLoading(`Creating ${generatedGroups.length} groups...`);
        const createdGroups = [];
        const failedGroups = [];

        try {
          for (let i = 0; i < generatedGroups.length; i++) {
            const group = generatedGroups[i];
            showLoading(`Creating group ${i + 1} of ${generatedGroups.length}...`);

            try {
              const createResp = await fetch(`${javaURI}/api/groups`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ name: group.name, period: group.period, course: group.course })
              });

              if (!createResp.ok) {
                failedGroups.push(group.name);
                continue;
              }

              const createdGroup = await createResp.json();

              for (const memberId of group.memberIds) {
                if (!memberId) continue;
                try {
                  await fetch(`${javaURI}/api/groups/${createdGroup.id}/members/${memberId}`, {
                    ...fetchOptions, method: 'POST'
                  });
                } catch (err) {
                  console.error(`Failed to add member ${memberId}`, err);
                }
              }

              createdGroups.push(createdGroup);
            } catch (err) {
              failedGroups.push(group.name);
            }
          }

          allGroups.push(...createdGroups);

          if (failedGroups.length === 0) {
            alert(`✅ Successfully created all ${createdGroups.length} groups!`);
          } else {
            alert(`⚠️ Created ${createdGroups.length} groups. ${failedGroups.length} failed.`);
          }

          closeSmartGroupModal();
          renderGroups();
        } catch (err) {
          alert(`Failed to save groups: ${err.message}`);
        } finally {
          hideLoading();
        }
      }

      // ================================
      // CHAT FUNCTIONALITY
      // ================================
      const slashCommands = ['/calendar', '/adduser'];
      let selectedCommandIndex = 0;

      async function initializeChatUser() {
        try {
          const res = await fetch(`${pythonURI}/api/id`, fetchOptions);
          if (!res.ok) return;
          const user = await res.json();
          currentUser = user || null;
          currentUserDisplayName = user?.name || user?.uid || user?.github || 'You';
        } catch (err) {
          console.warn('User lookup failed', err);
        }
      }

      function formatTimestamp(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      }

      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      function setChatImagePreview(base64, mimeType = 'image/png') {
        pendingChatImageBase64 = base64;
        pendingChatImageMime = mimeType;
        const messageBox = document.getElementById('imageMessageBox');
        messageBox.innerHTML = '';
        const img = document.createElement('img');
        img.src = `data:${mimeType};base64,${base64}`;
        img.alt = 'Selected image';
        img.className = 'mt-2 max-w-xs rounded-lg border border-neutral-700';
        messageBox.appendChild(img);
      }

      function clearChatImagePreview() {
        pendingChatImageBase64 = null;
        pendingChatImageMime = 'image/png';
        const messageBox = document.getElementById('imageMessageBox');
        messageBox.innerHTML = '';
      }

      window.triggerChatImagePicker = function () {
        const input = document.getElementById('chatImageInput');
        if (input) input.click();
      };

      window.handleChatImageSelected = async function (event) {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          const base64 = await fileToBase64(file);
          setChatImagePreview(base64, file.type || 'image/png');
        } catch (err) {
          console.error('Failed to read image', err);
        }
      };

      window.handlePastedChatImage = async function (event) {
        const items = (event.clipboardData || window.clipboardData)?.items || [];
        const imageItem = Array.from(items).find(item => item.type.startsWith('image/'));
        if (!imageItem) return;
        const imageFile = imageItem.getAsFile();
        if (!imageFile) return;
        try {
          const base64 = await fileToBase64(imageFile);
          setChatImagePreview(base64, imageFile.type || 'image/png');
        } catch (err) {
          console.error('Image paste failed', err);
        }
      };

      function getChatMessageKey(msg) {
        return JSON.stringify([
          msg?.name || '',
          msg?.date || '',
          msg?.message || '',
          msg?.image || ''
        ]);
      }

      function getChatImageSrc(image) {
        if (!image) return null;
        if (/^(data:|https?:\/\/|\/)/i.test(image)) return image;
        return `data:image/png;base64,${image}`;
      }

      function appendSingleMessage(msg) {
        const chatMessages = document.getElementById('chatMessages');
        let emptyState = document.getElementById('chatEmptyState');
        const messageKey = getChatMessageKey(msg);

        if (!chatMessages || renderedChatMessageKeys.has(messageKey)) {
          return;
        }

        if (!emptyState) {
          emptyState = document.createElement('div');
          emptyState.id = 'chatEmptyState';
          emptyState.className = 'text-center text-gray-500 text-sm py-6';
          emptyState.textContent = 'No messages yet.';
        }

        emptyState.classList.add('hidden');

        const wrapper = document.createElement('div');

        const header = document.createElement('div');
        header.className = 'flex items-baseline gap-2 mb-1';

        const nameEl = document.createElement('span');
        nameEl.className = 'text-white font-semibold text-sm';
        nameEl.textContent = msg.name === currentUserDisplayName ? 'You' : (msg.name || 'Unknown');

        const timeEl = document.createElement('span');
        timeEl.className = 'text-gray-500 text-xs';
        timeEl.textContent = formatTimestamp(msg.date);

        header.appendChild(nameEl);
        header.appendChild(timeEl);
        wrapper.appendChild(header);

        if (msg.message) {
          const textEl = document.createElement('p');
          textEl.className = 'text-gray-200 text-sm';
          textEl.textContent = msg.message;
          wrapper.appendChild(textEl);
        }

        if (msg.image) {
          const img = document.createElement('img');
          img.src = getChatImageSrc(msg.image);
          img.alt = 'Shared image';
          img.className = 'mt-2 max-w-xs rounded-lg border border-neutral-700';
          wrapper.appendChild(img);
        }

        chatMessages.appendChild(wrapper);
        renderedChatMessageKeys.add(messageKey);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function renderChatMessages(messages) {
        const chatMessages = document.getElementById('chatMessages');
        let emptyState = document.getElementById('chatEmptyState');
        chatMessages.innerHTML = '';
        renderedChatMessageKeys = new Set();

        if (!emptyState) {
          emptyState = document.createElement('div');
          emptyState.id = 'chatEmptyState';
          emptyState.className = 'text-center text-gray-500 text-sm py-6';
          emptyState.textContent = 'No messages yet.';
        }

        if (!messages || messages.length === 0) {
          chatMessages.appendChild(emptyState);
          emptyState.classList.remove('hidden');
          return;
        }

        messages.forEach(appendSingleMessage);
      }

      async function fetchChatMessages() {
        if (!activeChatGroupId) return;
        try {
          const res = await fetch(`${javaURI}/api/groups/chat/${activeChatGroupId}/messages`, fetchOptions);
          if (!res.ok) throw new Error('Failed to load chat messages');
          const messages = await res.json();
          renderChatMessages(messages);
        } catch (err) {
          console.error('Chat fetch failed', err);
        }
      }

      window.sendChatMessage = async function () {
        if (!activeChatGroupId) {
          console.warn('Chat group not resolved yet');
          return;
        }
        const chatInput = document.getElementById('chatInput');
        const text = chatInput.value.trim();
        const image = pendingChatImageBase64 || null;

        if (!text && !image) return;

        const payload = {
          name: currentUserDisplayName,
          message: text,
          date: new Date().toISOString(),
          image: image
        };

        // Clear UI immediately for responsive UX; rendering is handled by WebSocket broadcast.
        chatInput.value = '';
        clearChatImagePreview();

        try {
          const res = await fetch(`${javaURI}/api/groups/chat/${activeChatGroupId}/messages`, {
            ...fetchOptions,
            method: 'POST',
            headers: {
              ...(fetchOptions.headers || {}),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error('Failed to send message');
        } catch (err) {
          console.error('Send message failed', err);
        }
      };

      function startChatPolling() {
        if (!activeChatGroupId) return;

        if (stompClient) {
          stopChatPolling();
        }

        if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
          console.error('SockJS/STOMP dependencies are not available');
          return;
        }

        console.log(`Attempting WebSocket connection to ${javaURI}/ws-chat`);
        const socket = new SockJS(`${javaURI}/ws-chat`);
        stompClient = Stomp.over(socket);
        stompClient.debug = console.log;

        stompClient.connect({}, () => {
          if (!stompClient || !activeChatGroupId) return;

          console.log('WebSocket Connected Successfully!');
          const topic = `/topic/group/${activeChatGroupId}`;
          console.log(`Subscribing to topic: ${topic}`);

          stompClient.subscribe(topic, (message) => {
            try {
              console.log('Incoming WebSocket payload:', message.body);
              const payload = JSON.parse(message.body);
              appendSingleMessage(payload);
            } catch (err) {
              console.error('Failed to parse incoming chat message', err);
            }
          });
        }, (err) => {
          console.error('WebSocket connection failed', err);
        });
      }

      function stopChatPolling() {
        if (stompClient) {
          const clientToDisconnect = stompClient;
          stompClient = null;
          clientToDisconnect.disconnect(() => { });
        }
      }

      function downloadBase64File(filename, base64Data) {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }

      function isImageFile(filename) {
        return /\.(png|jpe?g|gif)$/i.test(filename || '');
      }

      function getImageMimeType(filename) {
        if (/\.jpe?g$/i.test(filename)) return 'image/jpeg';
        if (/\.gif$/i.test(filename)) return 'image/gif';
        return 'image/png';
      }

      function renderSharedFiles(files) {
        const list = document.getElementById('sharedFilesList');
        let emptyState = document.getElementById('filesEmptyState');
        list.innerHTML = '';

        if (!emptyState) {
          emptyState = document.createElement('div');
          emptyState.id = 'filesEmptyState';
          emptyState.className = 'text-center text-gray-500 text-sm py-6';
          emptyState.textContent = 'No files uploaded yet.';
        }

        if (!files || files.length === 0) {
          list.appendChild(emptyState);
          emptyState.classList.remove('hidden');
          return;
        }

        emptyState.classList.add('hidden');
        files.forEach(file => {
          const card = document.createElement('div');
          card.className = 'bg-neutral-700 border border-neutral-600 rounded-lg p-3 flex items-center gap-3';

          if (isImageFile(file.filename)) {
            const img = document.createElement('img');
            const mime = getImageMimeType(file.filename);
            img.src = `data:${mime};base64,${file.base64Data}`;
            img.alt = file.filename;
            img.className = 'w-12 h-12 object-cover rounded-md border border-neutral-600';
            card.appendChild(img);
          } else {
            const icon = document.createElement('div');
            icon.className = 'w-12 h-12 flex items-center justify-center bg-neutral-800 rounded-md text-gray-400 text-sm';
            icon.textContent = 'FILE';
            card.appendChild(icon);
          }

          const info = document.createElement('div');
          info.className = 'flex-1';
          const nameEl = document.createElement('div');
          nameEl.className = 'text-white text-sm font-medium';
          nameEl.textContent = file.filename;
          info.appendChild(nameEl);
          card.appendChild(info);

          const downloadBtn = document.createElement('button');
          downloadBtn.className = 'px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg';
          downloadBtn.textContent = 'Download';
          downloadBtn.addEventListener('click', () => downloadBase64File(file.filename, file.base64Data));
          card.appendChild(downloadBtn);

          list.appendChild(card);
        });
      }

      async function fetchSharedFiles() {
        if (!activeChatGroupId) return;
        try {
          const res = await fetch(`${javaURI}/api/groups/chat/${activeChatGroupId}/files`, fetchOptions);
          if (!res.ok) throw new Error('Failed to load shared files');
          const files = await res.json();
          renderSharedFiles(files);
        } catch (err) {
          console.error('Shared files fetch failed', err);
        }
      }

      window.uploadSharedFile = async function () {
        if (!activeChatGroupId) return;
        const input = document.getElementById('sharedFileInput');
        const file = input.files?.[0];
        if (!file) return;

        try {
          const base64Data = await fileToBase64(file);
          const payload = { filename: file.name, base64Data };

          const res = await fetch(`${javaURI}/api/groups/chat/${activeChatGroupId}/files`, {
            ...fetchOptions,
            method: 'POST',
            headers: {
              ...(fetchOptions.headers || {}),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error('Failed to upload file');
          input.value = '';
          await fetchSharedFiles();
        } catch (err) {
          console.error('Upload failed', err);
        }
      };

      window.showChatTab = function () {
        document.getElementById('chatPanel').classList.remove('hidden');
        document.getElementById('filesPanel').classList.add('hidden');
        document.getElementById('chatTabButton').className = 'px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white';
        document.getElementById('filesTabButton').className = 'px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-neutral-700';
      };

      window.showFilesTab = function () {
        document.getElementById('filesPanel').classList.remove('hidden');
        document.getElementById('chatPanel').classList.add('hidden');
        document.getElementById('filesTabButton').className = 'px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white';
        document.getElementById('chatTabButton').className = 'px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-neutral-700';
        fetchSharedFiles();
      };

      function handleChatInputChange(event) {
        const input = event.target;
        const value = input.value;
        const popup = document.getElementById('slashCommandPopup');

        if (value.startsWith('/') && !value.includes(' ')) {
          const filter = value.toLowerCase();
          const items = document.querySelectorAll('.slash-command-item');
          let visibleCount = 0;

          items.forEach(item => {
            const command = item.querySelector('.text-white').textContent.toLowerCase();
            if (command.startsWith(filter)) {
              item.classList.remove('hidden');
              visibleCount++;
            } else {
              item.classList.add('hidden');
            }
          });

          if (visibleCount > 0) {
            popup.classList.remove('hidden');
            selectedCommandIndex = 0;
            updateCommandSelection();
          } else {
            popup.classList.add('hidden');
          }
        } else {
          popup.classList.add('hidden');
        }
      }

      function handleChatInputKeydown(event) {
        const popup = document.getElementById('slashCommandPopup');
        const isPopupVisible = !popup.classList.contains('hidden');

        if (isPopupVisible) {
          const visibleItems = Array.from(document.querySelectorAll('.slash-command-item:not(.hidden)'));

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedCommandIndex = Math.min(selectedCommandIndex + 1, visibleItems.length - 1);
            updateCommandSelection();
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedCommandIndex = Math.max(selectedCommandIndex - 1, 0);
            updateCommandSelection();
          } else if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            const selectedItem = visibleItems[selectedCommandIndex];
            if (selectedItem) {
              const command = selectedItem.querySelector('.text-white').textContent;
              selectSlashCommand(command);
            }
          } else if (event.key === 'Escape') {
            popup.classList.add('hidden');
          }
        } else if (event.key === 'Enter') {
          const chatInput = document.getElementById('chatInput');
          if (chatInput.value.trim().toLowerCase() === '/calendar') {
             event.preventDefault();
             chatInput.value = '';
             calendarModalController.open();
             return;
          }
          window.sendChatMessage();
        }
      }

      function updateCommandSelection() {
        const items = document.querySelectorAll('.slash-command-item:not(.hidden)');
        items.forEach((item, index) => {
          if (index === selectedCommandIndex) {
            item.classList.add('bg-neutral-600');
          } else {
            item.classList.remove('bg-neutral-600');
          }
        });
      }

      function selectSlashCommand(command) {
        if (command === '/calendar') {
          document.getElementById('slashCommandPopup').classList.add('hidden');
          document.getElementById('chatInput').value = '';
          calendarModalController.open();
          return;
        }

        const input = document.getElementById('chatInput');
        const popup = document.getElementById('slashCommandPopup');

        input.value = command + ' ';
        popup.classList.add('hidden');
        input.focus();
        highlightCommand(input);
      }

      function highlightCommand(input) {
        const value = input.value;
        const commandMatch = value.match(/^\/\w+/);

        if (commandMatch) {
          input.classList.add('has-command');
        } else {
          input.classList.remove('has-command');
        }
      }

      /* ================================
         CALENDAR EVENT MODAL (SRP)
      ================================ */
      const calendarModalController = {
        open: function() {
          document.getElementById('calendarEventModal').classList.remove('hidden');
          document.getElementById('calEventTitle').focus();
          document.getElementById('calEventPeriod').value = '';
          document.getElementById('calEventStatus').textContent = '';
          document.getElementById('calEventStatus').className = 'text-sm mt-2';
          
          const groupContainer = document.getElementById('calEventGroupContainer');
          const groupNameEl = document.getElementById('calEventGroupName');
          if (typeof activeChatGroupName !== 'undefined' && activeChatGroupName) {
            if (groupNameEl) groupNameEl.textContent = activeChatGroupName;
            if (groupContainer) groupContainer.classList.remove('hidden');
          } else {
            if (groupContainer) groupContainer.classList.add('hidden');
          }
        },
        close: function() {
          document.getElementById('calendarEventModal').classList.add('hidden');
          this.reset();
        },
        reset: function() {
          document.getElementById('calEventTitle').value = '';
          document.getElementById('calEventDate').value = '';
          document.getElementById('calEventPeriod').value = '';
          document.getElementById('calEventDesc').value = '';
          document.getElementById('calEventPriority').value = 'P2';
          document.getElementById('calEventStatus').textContent = '';
          document.getElementById('calEventSubmitBtn').disabled = false;
          document.getElementById('calEventSubmitBtn').innerHTML = 'Create Event';
        },
        setStatus: function(msg, isError = false) {
          const statusEl = document.getElementById('calEventStatus');
          statusEl.textContent = msg;
          statusEl.className = 'text-sm mt-2 ' + (isError ? 'text-red-400' : 'text-green-400');
        },
        submit: async function() {
          const titleInput = document.getElementById('calEventTitle').value.trim();
          const dateInput = document.getElementById('calEventDate').value;
          const periodInput = document.getElementById('calEventPeriod').value.trim();
          const descInput = document.getElementById('calEventDesc').value.trim();
          const priorityInput = document.getElementById('calEventPriority').value;

          if (!titleInput || !dateInput) {
            this.setStatus('Title and Date are required.', true);
            return;
          }

          const btn = document.getElementById('calEventSubmitBtn');
          btn.disabled = true;
          // spinner
          btn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...';
          
          let emoji = '📅';
          let finalTitle = `[${priorityInput}] ${emoji} ${titleInput}`;
          if (typeof activeChatGroupName !== 'undefined' && activeChatGroupName) {
            finalTitle += ` (${activeChatGroupName})`;
          }

          const eventPayload = {
            title: finalTitle,
            description: descInput,
            date: dateInput,
            period: periodInput,
            priority: priorityInput
          };

          if (typeof activeChatGroupId !== 'undefined' && activeChatGroupId) {
            eventPayload.groupId = activeChatGroupId;
          }

          try {
            const res = await fetch(`${javaURI}/api/calendar/add_event`, {
              ...fetchOptions,
              method: 'POST',
              body: JSON.stringify(eventPayload)
            });

            if (res.status === 401 || res.status === 403 || (res.redirected && res.url.includes('/login'))) {
              this.setStatus('Session expired. Please log in again.', true);
              btn.disabled = false;
              btn.innerHTML = 'Create Event';
              return;
            }

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.message || 'Server returned an error');
            }

            this.setStatus('Event created successfully!');
            setTimeout(() => {
              this.close();
            }, 1000);
          } catch (err) {
            console.error('Failed to create calendar event:', err);
            this.setStatus(`Error: ${err.message}`, true);
            btn.disabled = false;
            btn.innerHTML = 'Create Event';
          }
        }
      };
      
      window.calendarModalController = calendarModalController;

      window.handleChatInputChange = handleChatInputChange;
      window.handleChatInputKeydown = handleChatInputKeydown;
      window.selectSlashCommand = selectSlashCommand;
      window.downloadBase64File = downloadBase64File;

      document.addEventListener('paste', function (event) {
        if (document.getElementById('chatModal').classList.contains('hidden')) return;
        if (typeof window.handlePastedChatImage === 'function') {
          window.handlePastedChatImage(event);
        }
      });
