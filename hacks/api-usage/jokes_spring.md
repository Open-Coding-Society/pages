---
title: Fetch of Spring Backend Jokes
layout: post
description: An introductory example of Frontend talking to Backend Java Spring application serving jokes.  
permalink: /java/spring/jokes
menu: nav/java_spring.html
image: /images/jokes.png
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
  // const url = `${pythonURI}/api/jokes`;
  const url = `${javaURI}/api/jokes`;
  const getURL = url +"/";
  const likeURL = url + "/like/";  // haha reaction
  const jeerURL = url + "/jeer/";  // boohoo reaction

  // prepare fetch PUT options, clones with JS Spread Operator (...)
  const postOptions = {...fetchOptions,
    method: 'POST',
  }; // clones and replaces method

  // fetch the API
  fetch(getURL,fetchOptions)
    // response is a RESTful "promise" on any successful fetch
    .then(response => {
      // check for response errors
      if (response.status !== 200) {
          error('GET API response failure: ' + response.status);
          return;
      }
      // valid response will have JSON data
      response.json().then(data => {
          console.log(data);
          for (const row of data) {
            // make "tr element" for each "row of data"
            const tr = document.createElement("tr");

            // td for joke cell
            const joke = document.createElement("td");
              joke.innerHTML = row.id + ". " + row.joke;  // add fetched data to innerHTML

            // td for haha cell with onclick actions
            const haha = document.createElement("td");
              const haha_but = document.createElement('button');
              haha_but.id = HAHA+row.id   // establishes a HAHA JS id for cell
              haha_but.innerHTML = row.haha;  // add fetched "haha count" to innerHTML
              haha_but.onclick = function () {
                // onclick function call with "like parameters"
                reaction(HAHA, likeURL+row.id, haha_but.id);  
              };
              haha.appendChild(haha_but);  // add "haha button" to haha cell

            // td for boohoo cell with onclick actions
            const boohoo = document.createElement("td");
              const boohoo_but = document.createElement('button');
              boohoo_but.id = BOOHOO+row.id  // establishes a BOOHOO JS id for cell
              boohoo_but.innerHTML = row.boohoo;  // add fetched "boohoo count" to innerHTML
              boohoo_but.onclick = function () {
                // onclick function call with "jeer parameters"
                reaction(BOOHOO, jeerURL+row.id, boohoo_but.id);  
              };
              boohoo.appendChild(boohoo_but);  // add "boohoo button" to boohoo cell

            // this builds ALL td's (cells) into tr (row) element
            tr.appendChild(joke);
            tr.appendChild(haha);
            tr.appendChild(boohoo);

            // this adds all the tr (row) work above to the HTML "result" container
            resultContainer.appendChild(tr);
          }
      })
  })
  // catch fetch errors (ie Nginx ACCESS to server blocked)
  .catch(err => {
    error(err + ": " + getURL);
  });

  // Reaction function to likes or jeers user actions
  function reaction(type, postURL, elemID) {

    // fetch the API
    fetch(postURL, postOptions)
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
