---
layout: post
title: "San Diego"
description: "Roadtrip through SD and learn UI while you're there!"
permalink: /westcoast/aitest/travel
---
<!-- 🌍 Destination Finder Tool -->
<div style="padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #dee2e6;">
  <h3 style="margin-top: 0; color: #495057;">AI-Powered Destination Finder</h3>

  <label>Search a Place or Interest:</label>
  <textarea id="user-search-input" placeholder="e.g., beaches, hiking, Paris, ancient history..." style="min-height: 80px; width: 100%; padding: 8px; resize: vertical;"></textarea>
  
  <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #007bff;" onclick="generateDestination()">
      🔍 Search Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #28a745;" onclick="saveDestination()">
      💾 Save Destination
    </button>
    <button class="iridescent flex-1 text-white text-center py-2 rounded-lg font-semibold transition" style="background-color: #17a2b8;" onclick="loadDestination()">
      📂 Load Saved
    </button>
  </div>

  <div id="ai-status" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>

  <!-- Destination Info -->
  <div id="destination-info" style="margin-top: 15px; display: none; border-left: 4px solid #007bff; padding: 12px; border-radius: 4px;">
    <h4 id="dest-name" style="margin: 0; color: #007bff;"></h4>
    <p id="dest-country" style="font-weight: bold; margin: 5px 0;"></p>
    <p id="dest-description" style="color: #495057;"></p>
    <p><strong>🗓 Best Time to Visit:</strong> <span id="dest-best-time"></span></p>
    <p><strong>🌤️ Climate:</strong> <span id="dest-climate"></span></p>
    <p><strong>📍 Suggested Activities:</strong> <span id="dest-activities"></span></p>
  </div>
</div>

<script>
// 🌍 Status message helper
function showAIStatus(message, type) {
  const statusDiv = document.getElementById("ai-status");
  statusDiv.textContent = message;
  statusDiv.style.display = "block";

  switch (type) {
    case "loading":
      statusDiv.style.backgroundColor = "#cce5ff";
      statusDiv.style.color = "#004085";
      break;
    case "success":
      statusDiv.style.backgroundColor = "#d1ecf1";
      statusDiv.style.color = "#0c5460";
      break;
    case "error":
      statusDiv.style.backgroundColor = "#f8d7da";
      statusDiv.style.color = "#721c24";
      break;
  }

  if (type !== "loading") {
    setTimeout(() => (statusDiv.style.display = "none"), 5000);
  }
}

// 🌍 Example destinations (can be replaced with AI/Gemini API later)
const DESTINATIONS = [
  {
    keywords: ["beach", "tropical", "ocean"],
    name: "Maui",
    country: "Hawaii, USA",
    description: "A lush island paradise famous for golden beaches, waterfalls, and volcanic landscapes.",
    bestTime: "April to October",
    climate: "Warm tropical",
    activities: "Snorkeling, hiking Haleakalā, surfing, scenic drives along Hana Highway"
  },
  {
    keywords: ["mountain", "hiking", "nature", "alps"],
    name: "Zermatt",
    country: "Switzerland",
    description: "A picturesque alpine village located at the base of the iconic Matterhorn mountain.",
    bestTime: "June to September (hiking), December to March (skiing)",
    climate: "Cool mountain climate",
    activities: "Hiking, skiing, cable car rides, glacier tours"
  },
  {
    keywords: ["history", "ancient", "ruins"],
    name: "Athens",
    country: "Greece",
    description: "The birthplace of democracy and home to ancient landmarks like the Parthenon.",
    bestTime: "April to June, September to October",
    climate: "Mediterranean",
    activities: "Museum visits, walking tours, exploring Acropolis, Greek cuisine"
  },
  {
    keywords: ["art", "romantic", "europe"],
    name: "Florence",
    country: "Italy",
    description: "A Renaissance treasure known for its art, architecture, and cuisine.",
    bestTime: "May to September",
    climate: "Warm Mediterranean",
    activities: "Visiting the Uffizi Gallery, Duomo climb, wine tasting in Tuscany"
  },
  {
    keywords: ["wildlife", "adventure", "africa", "safari"],
    name: "Serengeti National Park",
    country: "Tanzania",
    description: "A vast ecosystem renowned for the Great Migration and diverse African wildlife.",
    bestTime: "June to October",
    climate: "Warm dry savanna",
    activities: "Safari drives, wildlife photography, balloon safaris"
  }
];

// 🌍 Generate Destination
function generateDestination() {
  const query = document.getElementById("user-search-input").value.trim().toLowerCase();
  if (!query) {
    showAIStatus("⚠️ Please enter a place or theme to search.", "error");
    return;
  }

  showAIStatus("🔍 Searching destinations...", "loading");

  // Find matching destination
  const found = DESTINATIONS.find(dest =>
    dest.keywords.some(k => query.includes(k))
  );

  if (found) {
    displayDestination(found);
    showAIStatus("✅ Destination found!", "success");
  } else {
    // Fallback destination
    displayDestination({
      name: "Kyoto",
      country: "Japan",
      description:
        "A serene city known for its traditional temples, cherry blossoms, and tea culture.",
      bestTime: "March to May, October to November",
      climate: "Mild temperate",
      activities: "Temple visits, tea ceremonies, exploring Arashiyama bamboo forest"
    });
    showAIStatus("🌸 No exact match found, but here’s a great suggestion: Kyoto!", "success");
  }
}

// 🌍 Display destination info
function displayDestination(dest) {
  document.getElementById("destination-info").style.display = "block";
  document.getElementById("dest-name").textContent = dest.name;
  document.getElementById("dest-country").textContent = dest.country;
  document.getElementById("dest-description").textContent = dest.description;
  document.getElementById("dest-best-time").textContent = dest.bestTime;
  document.getElementById("dest-climate").textContent = dest.climate;
  document.getElementById("dest-activities").textContent = dest.activities;
}

// 🌍 Save to localStorage
function saveDestination() {
  const data = {
    input: document.getElementById("user-search-input").value.trim(),
    name: document.getElementById("dest-name").textContent,
    country: document.getElementById("dest-country").textContent,
    description: document.getElementById("dest-description").textContent,
    bestTime: document.getElementById("dest-best-time").textContent,
    climate: document.getElementById("dest-climate").textContent,
    activities: document.getElementById("dest-activities").textContent,
    timestamp: new Date().toISOString()
  };

  if (!data.name) {
    showAIStatus("⚠️ Please generate a destination before saving.", "error");
    return;
  }

  localStorage.setItem("destination-finder-saved", JSON.stringify(data));
  showAIStatus("✅ Destination saved successfully!", "success");
}

// 🌍 Load saved destination
function loadDestination() {
  const saved = localStorage.getItem("destination-finder-saved");
  if (!saved) {
    showAIStatus("⚠️ No saved destination found.", "error");
    return;
  }

  const data = JSON.parse(saved);
  displayDestination(data);
  document.getElementById("user-search-input").value = data.input;
  const saveDate = new Date(data.timestamp).toLocaleString();
  showAIStatus(`📂 Loaded saved destination (Saved: ${saveDate})`, "success");
}
</script>
