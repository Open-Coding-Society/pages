---
toc: false
title: Submission Page
permalink: /student/testsubmissions
search_exclude: true
layout: post
---

<div>
    <label for="searchBar">Search for a name: </label>
    <input type="text" id="searchBar" placeholder="Search for a name..." onkeyup="filterNames()">
</div>
<div>
    <label for="rowsPerPage">Rows per page: </label>
    <select id="rowsPerPage" onchange="changeRowsPerPage()">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="200">200</option>
    </select>
</div>
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="namesTableBody"></tbody>
</table>
<div>
    <button id="prevPage" onclick="changePage('prev')">Previous</button>
    <span id="pageInfo"></span>
    <button id="nextPage" onclick="changePage('next')">Next</button>
</div>
<div class="Review-Group" id="Review-Group">Review-Group</div>


<script type="module">
    import { javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    let people = [], filteredPeople = [], listofpeople = [], currentPage = 1, rowsPerPage = 5, totalPages = 1;

    window.filterNames = function filterNames() {
        const searchTerm = document.getElementById("searchBar").value.toLowerCase();
        filteredPeople = people.filter(person => person.name.toLowerCase().includes(searchTerm));
        totalPages = Math.ceil(filteredPeople.length / rowsPerPage);
        currentPage = 1; // Reset to first page after filtering
        populateTable(filteredPeople.slice(0, rowsPerPage));
    };

    window.addName = function(name) {
        console.log("Added name:", name);
        listofpeople.push(name);
        console.log(listofpeople);
        const reviewGroup = document.getElementById('Review-Group');
        reviewGroup.textContent = listofpeople.join(", ");
    };

    async function fetchAllStudents() {
        try {
            const response = await fetch(javaURI + "/api/people", fetchOptions);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            people = await response.json();
            filteredPeople = people;
            totalPages = Math.ceil(people.length / rowsPerPage);
            populateTable(people.slice(0, rowsPerPage));
        } catch (error) {
            console.error("Error fetching names:", error);
        }
    }

    window.changeRowsPerPage = function changeRowsPerPage() {
        rowsPerPage = parseInt(document.getElementById("rowsPerPage").value);
        currentPage = 1;
        totalPages = Math.ceil(filteredPeople.length / rowsPerPage);
        const startIdx = 0;
        const endIdx = rowsPerPage;
        populateTable(filteredPeople.slice(startIdx, endIdx));
    };

    window.changePage = function changePage(direction) {
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        }
        const startIdx = (currentPage - 1) * rowsPerPage;
        const endIdx = startIdx + rowsPerPage;
        populateTable(filteredPeople.slice(startIdx, endIdx));
    };

    window.updatePageInfo = function updatePageInfo() {
        const pageInfo = document.getElementById("pageInfo");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;
    };

    function populateTable(names) {
        const tableBody = document.getElementById("namesTableBody");
        tableBody.innerHTML = "";
        names.forEach(name => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${name.name}</td><td><button onclick="addName('${name.name}')">Add</button></td>`;
            tableBody.appendChild(row);
        });
        updatePageInfo();
    }

    fetchAllStudents();

</script>