---
layout: aesthetihawk
title: Classroom Management
permalink: /student/classrooms
comments: false
---

<style>
  /* Simple modal styles  */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  .modal-backdrop.active {
    display: flex;
  }
  .modal {
    background: #1e293b; /* slate-800 */
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    color: white;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .modal-header h3 {
    margin: 0;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
  }
  .card {
    background: #334155; /* slate-700 */
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-title {
    font-weight: 600;
    font-size: 1.25rem;
    cursor: pointer;
    color: #facc15; /* amber-400 */
  }
  .card-info {
    margin: 0.5rem 0;
  }
  .card-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }
  .btn {
    padding: 0.5rem 1rem;
    background: #2563eb; /* blue-600 */
    border: none;
    border-radius: 0.375rem;
    color: white;
    cursor: pointer;
    font-weight: 600;
  }
  .btn.danger {
    background: #dc2626; /* red-600 */
  }
  .btn.secondary {
    background: #64748b; /* gray-500 */
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  th, td {
    border: 1px solid #475569; /* slate-600 */
    padding: 0.5rem;
    text-align: left;
  }
  th {
    background: #475569; /* slate-600 */
  }
  input[type="text"], input[type="number"] {
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #64748b;
    width: 100%;
    box-sizing: border-box;
    margin-top: 0.25rem;
  }
  .form-row {
    margin-bottom: 1rem;
  }
</style>

<section class="min-h-screen bg-neutral-900 py-10 px-4 max-w-7xl mx-auto text-white">

  <div id="classroomCardsContainer" aria-live="polite" aria-atomic="true">
    <!-- Cards will be injected here -->
    <p>Loading classrooms...</p>
  </div>

  <!-- Modals -->

  <!-- Edit Classroom Modal -->
  <div id="editModalBackdrop" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="editModalTitle" tabindex="-1">
    <div class="modal">
      <div class="modal-header">
        <h3 id="editModalTitle">Edit Classroom Name</h3>
        <button class="modal-close" aria-label="Close edit modal" id="closeEditModal">&times;</button>
      </div>
      <form id="editClassroomForm">
        <div class="form-row">
          <label for="editClassroomName">New Classroom Name</label>
          <input type="text" id="editClassroomName" name="editClassroomName" required />
        </div>
        <button type="submit" class="btn">Save Changes</button>
      </form>
      <p id="editModalMessage" style="margin-top:1rem; color:#f87171;"></p>
    </div>
  </div>

  <!-- Student List Modal -->
  <div id="studentsModalBackdrop" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="studentsModalTitle" tabindex="-1">
    <div class="modal">
      <div class="modal-header">
        <h3 id="studentsModalTitle">Students in Classroom</h3>
        <button class="modal-close" aria-label="Close students modal" id="closeStudentsModal">&times;</button>
      </div>

      <table aria-describedby="studentsModalTitle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="studentsTableBody">
          <!-- Students rows injected here -->
        </tbody>
      </table>

      <form id="addStudentForm" style="margin-top:1rem;">
        <label for="addStudentId">Add Student by ID</label>
        <input type="number" id="addStudentId" name="addStudentId" required min="1" />
        <button type="submit" class="btn" style="margin-top:0.5rem;">Add Student</button>
      </form>
      <p id="studentsModalMessage" style="margin-top:1rem; color:#f87171;"></p>
    </div>
  </div>

</section>

<script>
  // const API_BASE = 'http://127.0.0.1:8587/api/classrooms';
  const API_BASE = 'https://flask.opencodingsociety.com/api/classrooms';

  let classrooms = [];
  let currentEditClassroomId = null;
  let currentStudentsClassroomId = null;

  const cardsContainer = document.getElementById('classroomCardsContainer');

  // Load classrooms on page load
  async function loadClassrooms() {
    cardsContainer.innerHTML = '<p>Loading classrooms...</p>';
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Error loading classrooms: ${res.status}`);
      classrooms = await res.json();
      renderClassroomCards();
    } catch (err) {
      cardsContainer.innerHTML = `<p style="color:#f87171;">Failed to load classrooms: ${err.message}</p>`;
    }
  }

  function renderClassroomCards() {
    if (!classrooms.length) {
      cardsContainer.innerHTML = '<p>No classrooms available.</p>';
      return;
    }
    cardsContainer.innerHTML = '';
    classrooms.forEach(c => {
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('tabindex', '0');

      // Card Title clickable
      const title = document.createElement('h2');
      title.className = 'card-title';
      title.textContent = c.name || `Classroom #${c.id}`;
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-describedby', `status-${c.id}`);
      title.addEventListener('click', () => openStudentsModal(c.id, c.name));
      title.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openStudentsModal(c.id, c.name);
        }
      });

      // Info
      const teacherId = document.createElement('p');
      teacherId.className = 'card-info';
      teacherId.textContent = `Teacher ID: ${c.owner_teacher_id || 'N/A'}`;

      const school = document.createElement('p');
      school.className = 'card-info';
      school.textContent = `School: ${c.school_name || c._school_name || 'N/A'}`;

      const statusP = document.createElement('p');
      statusP.className = 'card-info';
      // Assuming 'active' or 'archived' status; adjust if your data differs
      const status = c.status || 'active';
      statusP.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;

      // Card Actions: Edit, Delete
      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn secondary';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', `Edit classroom ${c.name}`);
      editBtn.addEventListener('click', () => openEditModal(c.id, c.name));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete classroom ${c.name}`);
      deleteBtn.addEventListener('click', () => deleteClassroom(c.id, c.name));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      // Assemble card
      card.appendChild(title);
      card.appendChild(teacherId);
      card.appendChild(school);
      card.appendChild(statusP);
      card.appendChild(actions);

      cardsContainer.appendChild(card);
    });
  }

  // ========== Edit Modal ==========

  const editModalBackdrop = document.getElementById('editModalBackdrop');
  const closeEditModalBtn = document.getElementById('closeEditModal');
  const editClassroomForm = document.getElementById('editClassroomForm');
  const editClassroomNameInput = document.getElementById('editClassroomName');
  const editModalMessage = document.getElementById('editModalMessage');

  function openEditModal(id, currentName) {
    currentEditClassroomId = id;
    editClassroomNameInput.value = currentName || '';
    editModalMessage.textContent = '';
    editModalBackdrop.classList.add('active');
    editClassroomNameInput.focus();
  }

  function closeEditModal() {
    editModalBackdrop.classList.remove('active');
    currentEditClassroomId = null;
  }

  closeEditModalBtn.addEventListener('click', closeEditModal);
  editModalBackdrop.addEventListener('click', e => {
    if (e.target === editModalBackdrop) closeEditModal();
  });

  editClassroomForm.addEventListener('submit', async e => {
    e.preventDefault();
    const newName = editClassroomNameInput.value.trim();
    if (!newName) {
      editModalMessage.textContent = 'Classroom name cannot be empty.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${currentEditClassroomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to update classroom');
      }
      const updated = await res.json();
      // Update local copy and rerender cards
      const idx = classrooms.findIndex(c => c.id === currentEditClassroomId);
      if (idx >= 0) classrooms[idx] = updated;
      renderClassroomCards();
      closeEditModal();
    } catch (err) {
      editModalMessage.textContent = err.message;
    }
  });

  // ========== Delete Classroom ==========

  async function deleteClassroom(id, name) {
    if (!confirm(`Are you sure you want to delete classroom "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete classroom');
      }
      // Remove locally and rerender
      classrooms = classrooms.filter(c => c.id !== id);
      renderClassroomCards();
    } catch (err) {
      alert(`Error deleting classroom: ${err.message}`);
    }
  }

  // ========== Students Modal ==========

  const studentsModalBackdrop = document.getElementById('studentsModalBackdrop');
  const closeStudentsModalBtn = document.getElementById('closeStudentsModal');
  const studentsTableBody = document.getElementById('studentsTableBody');
  const addStudentForm = document.getElementById('addStudentForm');
  const addStudentIdInput = document.getElementById('addStudentId');
  const studentsModalMessage = document.getElementById('studentsModalMessage');

  function openStudentsModal(classroomId, classroomName) {
    currentStudentsClassroomId = classroomId;
    studentsModalMessage.textContent = '';
    studentsTableBody.innerHTML = `<tr><td colspan="2">Loading students for "${classroomName}"...</td></tr>`;
    studentsModalBackdrop.classList.add('active');
    loadStudents(classroomId);
  }

  function closeStudentsModal() {
    studentsModalBackdrop.classList.remove('active');
    studentsTableBody.innerHTML = '';
    addStudentForm.reset();
    studentsModalMessage.textContent = '';
    currentStudentsClassroomId = null;
  }

  closeStudentsModalBtn.addEventListener('click', closeStudentsModal);
  studentsModalBackdrop.addEventListener('click', e => {
    if (e.target === studentsModalBackdrop) closeStudentsModal();
  });

  async function loadStudents(classroomId) {
    try {
      const res = await fetch(`${API_BASE}/${classroomId}/students`);
      if (!res.ok) throw new Error(`Failed to load students: ${res.status}`);
      const students = await res.json();
      if (!students.length) {
        studentsTableBody.innerHTML = '<tr><td colspan="2">No students found.</td></tr>';
        return;
      }
      studentsTableBody.innerHTML = '';
      students.forEach(s => {
        const tr = document.createElement('tr');
        const nameTd = document.createElement('td');
        nameTd.textContent = s.name || `ID ${s.id}`;
        const actionTd = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.className = 'btn danger';
        delBtn.textContent = 'Delete';
        delBtn.setAttribute('aria-label', `Remove student ${s.name || s.id}`);
        delBtn.addEventListener('click', () => removeStudentFromClassroom(classroomId, s.id));
        actionTd.appendChild(delBtn);
        tr.appendChild(nameTd);
        tr.appendChild(actionTd);
        studentsTableBody.appendChild(tr);
      });
    } catch (err) {
      studentsTableBody.innerHTML = `<tr><td colspan="2" style="color:#f87171;">${err.message}</td></tr>`;
    }
  }

  addStudentForm.addEventListener('submit', async e => {
    e.preventDefault();
    studentsModalMessage.textContent = '';
    const studentId = addStudentIdInput.value.trim();
    if (!studentId) {
      studentsModalMessage.textContent = 'Please enter a valid Student ID.';
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${currentStudentsClassroomId}/students/${studentId}`, {
        method: 'POST',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to add student');
      }
      studentsModalMessage.style.color = 'lightgreen';
      studentsModalMessage.textContent = 'Student added successfully.';
      addStudentForm.reset();
      loadStudents(currentStudentsClassroomId);
    } catch (err) {
      studentsModalMessage.style.color = '#f87171';
      studentsModalMessage.textContent = err.message;
    }
  });

  async function removeStudentFromClassroom(classroomId, studentId) {
    if (!confirm(`Are you sure you want to remove student ID ${studentId} from this classroom?`)) return;
    try {
      const res = await fetch(`${API_BASE}/${classroomId}/students/${studentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to remove student');
      }
      studentsModalMessage.style.color = 'lightgreen';
      studentsModalMessage.textContent = 'Student removed successfully.';
      loadStudents(classroomId);
    } catch (err) {
      studentsModalMessage.style.color = '#f87171';
      studentsModalMessage.textContent = err.message;
    }
  }

  // Init
  loadClassrooms();
</script>
