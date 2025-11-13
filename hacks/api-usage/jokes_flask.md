---
title: Fetch of Flask Backend Jokes
layout: post
description: An introductory example of Frontend talking to Backend Python Flask application serving jokes.  
permalink: /python/flask/api/jokes
image: /images/jokes.png
breadcrumb: true
show_reading_time: false
---

<!-- HTML table fragment for page -->
<table>
  <thead>
  <tr>
    <th>Joke</th>
    <th>HaHa</th>
    <th>Boohoo</th>
  </tr>
  </thead>
  <tbody id="result">
    <!-- javascript generated data -->
  </tbody>
</table>

<script type="module">
  import { javaURI, pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

  // prepare HTML defined "result" container for new output
  const resultContainer = document.getElementById("result");

  // keys for joke reactions
  const HAHA = "haha";
  const BOOHOO = "boohoo";

  // prepare fetch urls
  const url = `${pythonURI}/api/jokes`;
  //const url = `${javaURI}/api/jokes`;
  const getURL = url +"/";
  const likeURL = url + "/like/";  // haha reaction
  const jeerURL = url + "/jeer/";  // boohoo reaction

  // prepare fetch PUT options, clones with JS Spread Operator (...)
  const reactOptions = {...fetchOptions,
    method: 'PUT',
  }; // clones and replaces method


  // fetch the API to obtain jokes data
  fetch(getURL, fetchOptions)
    .then(response => {
      if (response.status !== 200) {
        error('GET API response failure: ' + response.status);
        return;
      }
      response.json().then(data => {
        console.log(data);
        // format response data into a table
        for (const row of data) {
          // make "tr element" for each "row of data"
          const tr = document.createElement("tr");

          // td for joke cell
          const joke = document.createElement("td");
          joke.innerHTML = row.id + ". " + row.joke;

          // td for haha cell with onclick actions
          const haha = document.createElement("td");
          const hahaBtn = document.createElement('button');
          hahaBtn.id = HAHA + row.id;
          hahaBtn.innerHTML = row.haha;
          hahaBtn.onclick = function () {
            reaction(HAHA, likeURL + row.id, hahaBtn.id);
          };
          haha.appendChild(hahaBtn);

          // td for boohoo cell with onclick actions
          const boohoo = document.createElement("td");
          const boohooBtn = document.createElement('button');
          boohooBtn.id = BOOHOO + row.id;
          boohooBtn.innerHTML = row.boohoo;
          boohooBtn.onclick = function () {
            reaction(BOOHOO, jeerURL + row.id, boohooBtn.id);
          };
          boohoo.appendChild(boohooBtn);

          // finish row and append to DOM container
          tr.appendChild(joke);
          tr.appendChild(haha);
          tr.appendChild(boohoo);
          resultContainer.appendChild(tr);
        }
      })
    })
    .catch(err => {
      error(err + ": " + getURL);
    });

  // Function and interval to refresh the haha and boohoo counts every 5 seconds
  function refreshReactions() {
    fetch(getURL, fetchOptions)
      .then(response => response.json())
      .then(data => {
        // update all reaction data
        for (const row of data) {
          const hahaBtn = document.getElementById(HAHA + row.id);
          if (hahaBtn) hahaBtn.innerHTML = row.haha;
          const boohooBtn = document.getElementById(BOOHOO + row.id);
          if (boohooBtn) boohooBtn.innerHTML = row.boohoo;
        }
      })
      .catch(err => {
        // Optionally handle refresh errors
        console.error('Refresh error:', err);
      });
  }
  // Call refreshReactions every 5 seconds
  setInterval(refreshReactions, 5000);

  // Reaction function to likes or jeers user actions
  function reaction(type, postURL, elemID) {

    // fetch the API
    fetch(postURL, reactOptions)
    // response is a RESTful "promise" on any successful fetch
    .then(response => {
      // check for response errors
      if (response.status !== 200) {
          error("Post API response failure: " + response.status)
          return;  // api failure
      }
      // valid response will have JSON data
      response.json().then(data => {
          console.log(data);
          // Likes or Jeers updated/incremented
          if (type === HAHA) // like data element
            document.getElementById(elemID).innerHTML = data.haha;  // fetched haha data assigned to haha Document Object Model (DOM)
          else if (type === BOOHOO) // jeer data element
            document.getElementById(elemID).innerHTML = data.boohoo;  // fetched boohoo data assigned to boohoo Document Object Model (DOM)
          else
            error("unknown type: " + type);  // should never occur
      })
    })
    // catch fetch errors (ie Nginx ACCESS to server blocked)
    .catch(err => {
      error(err + " " + postURL);
    });
  
  }

  // Something went wrong with actions or responses
  function error(err) {
    // log as Error in console
    console.error(err);
    // append error to resultContainer
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.innerHTML = err;
    tr.appendChild(td);
    resultContainer.appendChild(tr);
  }

</script>
