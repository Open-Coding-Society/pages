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

We will vote by season. Hover over each activity to learn more!

### Winter ❄️
<!-- SECTION 1: Winter options -->
<div id="winter_container"></div>

### Spring 🌸
<!-- SECTION 2: Spring options -->
<div id="spring_container"></div>

### Summer ☀️
<!-- SECTION 3: Summer Options -->
<div id="summer_container"></div>

### Fall 🍂
<!-- SECTION 4: Fall Options -->
<div id="fall_container"></div>

<style>
  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  
  .activity-item {
    text-align: center;
    padding: 15px;
    border-radius: 10px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .activity-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .activity-item img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .activity-item .title {
    font-weight: bold;
    margin: 8px 0;
    color: #333;
    font-size: 1em;
  }
  
  .activity-item .short-desc {
    font-size: 0.85em;
    color: #666;
    margin: 5px 0;
  }
  
  .activity-item .hover-desc {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    font-size: 0.85em;
    line-height: 1.4;
  }
  
  .activity-item:hover .hover-desc {
    transform: translateY(0);
  }
</style>

<script>
{
  // Function to create activity grid
  function createActivityGrid(containerId, activities) {
    const outputElement = document.getElementById(containerId);
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'activity-grid';

    for (const activity of activities) {
      const item = document.createElement('div');
      item.className = 'activity-item';

      const img = document.createElement('img');
      img.src = activity.image;
      img.alt = activity.title;

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = activity.title;

      const shortDesc = document.createElement('div');
      shortDesc.className = 'short-desc';
      shortDesc.textContent = activity.shortDesc;

      const hoverDesc = document.createElement('div');
      hoverDesc.className = 'hover-desc';
      hoverDesc.textContent = activity.hoverDesc;

      item.appendChild(img);
      item.appendChild(title);
      item.appendChild(shortDesc);
      item.appendChild(hoverDesc);

      container.appendChild(item);
    }

    outputElement.appendChild(container);
  }
  
  // Winter Activities (December - February)
  const winterActivities = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Emberiza_citrinella_-_Corn_Bunting%2C_Adana_2016.jpg/800px-Emberiza_citrinella_-_Corn_Bunting%2C_Adana_2016.jpg",
      title: "Build Bird Houses",
      shortDesc: "Wood Craft",
      hoverDesc: "Learn basic woodworking skills by building homes for our feathered friends. Perfect indoor winter activity!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Chess_pieces_0l.jpg/800px-Chess_pieces_0l.jpg",
      title: "Chess Basics",
      shortDesc: "Strategy & Thinking",
      hoverDesc: "Learn the ancient game of chess! Develop critical thinking, patience, and strategic planning skills."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Chocolate_Chip_Cookies_-_kimberlykv.jpg/800px-Chocolate_Chip_Cookies_-_kimberlykv.jpg",
      title: "Baking & Delivery",
      shortDesc: "Love Your Neighbor",
      hoverDesc: "Bake delicious cookies and deliver them to neighbors. Learn baking skills while spreading joy!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Missionaries_2.jpg/800px-Missionaries_2.jpg",
      title: "Feed Missionaries",
      shortDesc: "Go Into the World",
      hoverDesc: "Prepare and share a meal with local missionaries. Learn about service and hearing their stories!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/3D_Printer.jpg/800px-3D_Printer.jpg",
      title: "3D Printing",
      shortDesc: "Makerspace Fun",
      hoverDesc: "Design and create your own 3D printed objects. Introduction to modern manufacturing technology!"
    }
  ];
  
  // Spring Activities (March - May)
  const springActivities = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Easter_egg_on_grass_%28Unsplash%29.jpg/800px-Easter_egg_on_grass_%28Unsplash%29.jpg",
      title: "Easter Activities",
      shortDesc: "Atonement Study",
      hoverDesc: "Breakfast study about the Atonement followed by a fun Easter egg hunt in the spring sunshine!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Colored_pencils_in_a_cup.jpg/800px-Colored_pencils_in_a_cup.jpg",
      title: "Learning to Draw",
      shortDesc: "Artistic Skills",
      hoverDesc: "Discover your artistic side! Learn basic drawing techniques and create your own masterpieces."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Estes_Park_Aerial_Tramway_02.jpg/800px-Estes_Park_Aerial_Tramway_02.jpg",
      title: "Backpacking Prep",
      shortDesc: "Outdoor Skills",
      hoverDesc: "Learn essential backpacking and hiking skills. Perfect time to prepare for summer adventures!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Yard_work.jpg/800px-Yard_work.jpg",
      title: "Yard Cleanup",
      shortDesc: "Bless Your Fellow Man",
      hoverDesc: "Help someone in the community with spring yard cleanup. Service project with lunch included!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Estes_water_rocket.jpg/800px-Estes_water_rocket.jpg",
      title: "Air Rockets",
      shortDesc: "Science & Launch",
      hoverDesc: "Build and launch air-powered rockets! Learn about physics, pressure, and aerodynamics."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Knots.jpg/800px-Knots.jpg",
      title: "Knots & Ropes",
      shortDesc: "Practical Skills",
      hoverDesc: "Master essential knot-tying skills for camping, sailing, and everyday use. Very handy knowledge!"
    }
  ];
  
  // Summer Activities (June - August)
  const summerActivities = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Campfire_4213.jpg/800px-Campfire_4213.jpg",
      title: "Camping & Fire",
      shortDesc: "Outdoor Adventure",
      hoverDesc: "Learn campfire safety, setup camp, and enjoy the great outdoors under the stars!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Cooking_outdoors.jpg/800px-Cooking_outdoors.jpg",
      title: "Camping Cooking",
      shortDesc: "Outdoor Chef",
      hoverDesc: "Cook delicious meals in nature! Learn camping cooking techniques and outdoor food safety."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Swimming_Pool_in_Atacama_Desert.jpg/800px-Swimming_Pool_in_Atacama_Desert.jpg",
      title: "Pool Party",
      shortDesc: "Water Fun",
      hoverDesc: "Beat the summer heat with swimming, pool games, and water safety lessons!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Scuba_diver_in_Red_Sea.jpg/800px-Scuba_diver_in_Red_Sea.jpg",
      title: "Scuba Basics",
      shortDesc: "Underwater World",
      hoverDesc: "Introduction to scuba diving! Learn basic equipment, safety, and breathing techniques."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Mountain_biking.jpg/800px-Mountain_biking.jpg",
      title: "Gravel Biking",
      shortDesc: "Bike Adventure",
      hoverDesc: "Explore trails on two wheels! Learn bike safety and enjoy outdoor cycling adventures."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Video_game_controller_Flickr_steeljam.jpg/800px-Video_game_controller_Flickr_steeljam.jpg",
      title: "Video Game Making",
      shortDesc: "Plan of Happiness",
      hoverDesc: "Create your own video game with a positive message! Learn basic game design and coding."
    }
  ];
  
  // Fall Activities (September - November)
  const fallActivities = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Frisbee_in_flight.jpg/800px-Frisbee_in_flight.jpg",
      title: "Frisbee Golf",
      shortDesc: "Modified Sport",
      hoverDesc: "Play disc golf on a custom course! Great outdoor activity combining skill and fun."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Dodgeball_game.jpg/800px-Dodgeball_game.jpg",
      title: "Modified Dodgeball",
      shortDesc: "Team Sport",
      hoverDesc: "Fun, safe version of dodgeball with soft balls. Great for teamwork and exercise!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Four_square.jpg/800px-Four_square.jpg",
      title: "Four Square",
      shortDesc: "Classic Game",
      hoverDesc: "The timeless playground game! Develop hand-eye coordination and quick thinking."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Painting-artist.jpg/800px-Painting-artist.jpg",
      title: "Learning to Paint",
      shortDesc: "Artistic Expression",
      hoverDesc: "Explore painting with different mediums. Express yourself through color and creativity!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Salt_Lake_LDS_Conference_Center.jpg/800px-Salt_Lake_LDS_Conference_Center.jpg",
      title: "Conference Notes",
      shortDesc: "Learn of Prophets",
      hoverDesc: "Watch General Conference, take notes, and discuss over a delicious lunch together."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Catapult_-_Mangonnel.jpg/800px-Catapult_-_Mangonnel.jpg",
      title: "Popsicle Catapults",
      shortDesc: "Engineering Fun",
      hoverDesc: "Build working catapults from popsicle sticks! Learn about physics and medieval engineering."
    }
  ];
  
  // Create all grids
  createActivityGrid('winter_container', winterActivities);
  createActivityGrid('spring_container', springActivities);
  createActivityGrid('summer_container', summerActivities);
  createActivityGrid('fall_container', fallActivities);
}
</script>

---
