---
layout: post 
show_reading_time: false
title: Activitity Days Ideas 
description: Here are some activities day options
---

## Nature/Physical Goals

Modified Frisbee Golf
Modified Dodge Ball
Four Square
Camping and Fire
Camping and Cooking
Backpacking and Hiking
Pool Party
Scuba Basics
Gravel Biking

## Talent Building

Chess Playing Basics
Learning to Draw
Learning to Paint
Wood Craft (Bird House)
Wood Milling

## Intellectual Goals

Basic Automotive
Navigation Basis
Knots and Ropes
3D Printing Makerspace
Video Game Making - Plan of Happiness
Air Rockets Launching
Popsicle Stick (Catapults)

## Follow Jesus and Social

Love your Neighbor - Baking Cookies and Delivery
Go ye into the World - Meet snd feed the Missionaries
Bless your fellow man - Lunch and Yard cleanup
Easter Atonement - Breakfast Study and Egg Hunt
Learn of the Prophets - Conference Lunch and Notes

## Let's Schedule

We will vote by season.

### Winter
<!-- SECTION 1: Winter options -->
<div id="winter_container"></div>

### Spring
<!-- SECTION 2: Spring options -->
<div id="spring_container"></div>

### Summer
<!-- SECTION 3: Summer Options -->
<div id="summer_container"></div>

### Fall
<!-- SECTION 4: Fall Options -->
<div id="fall_container"></div>

<script>
{
  
// Winter Defines
  const id = "winter_container";
  const data = [
    {image: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg", title: "Hey", description: "California - forever"},
    {image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg", title: "Hi", description: "Oregon - 9 years"},
    {image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg", title: "Alright mate", description: "England - 2 years"},
    {image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg", title: "Aloha", description: "Hawaii - 2 years"}
  ];
  const outputElement = document.getElementById(id);

  // Clear containter
  outputElement.innerHTML = '';

  // Create grid container
  const container = document.createElement('div');
  container.id = id;
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
  container.style.gap = '10px';

  // Loop through each element
  for (const element of data) {
    // Create grid item
    const gridItem = document.createElement('div');
    gridItem.style.textAlign = 'center';
    
    // Create and add image image
    const img = document.createElement('img');
    img.src = element.image;
    img.alt = element.description;
    img.style.width = '100%';
    img.style.height = '100px';
    img.style.objectFit = 'contain';
    
    // Create description
    const description = document.createElement('p');
    description.textContent = element.description;
    description.style.margin = '5px 0';
    description.style.fontWeight = 'bold';
    
    // Create title
    const title = document.createElement('p');
    title.textContent = element.title;
    title.style.margin = '5px 0';
    title.style.fontStyle = 'italic';
    title.style.opacity = '0.7';
    
    // Add all elements to grid item
    gridItem.appendChild(img);
    gridItem.appendChild(description);
    gridItem.appendChild(title);
    
    // Add grid item to container
    container.appendChild(gridItem);
  }

  outputElement.appendChild(container);
}
</script>

---

