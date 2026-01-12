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
      image: "https://placehold.co/400x300/8B4513/FFFFFF?text=Bird+House",
      title: "Build Bird Houses",
      shortDesc: "Wood Craft",
      hoverDesc: "Learn basic woodworking skills by building homes for our feathered friends. Perfect indoor winter activity!"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ChessSet.jpg/640px-ChessSet.jpg",
      title: "Chess Basics",
      shortDesc: "Strategy & Thinking",
      hoverDesc: "Learn the ancient game of chess! Develop critical thinking, patience, and strategic planning skills."
    },
    {
      image: "https://placehold.co/400x300/D2691E/FFFFFF?text=Baking+Cookies",
      title: "Baking & Delivery",
      shortDesc: "Love Your Neighbor",
      hoverDesc: "Bake delicious cookies and deliver them to neighbors. Learn baking skills while spreading joy!"
    },
    {
      image: "https://placehold.co/400x300/FF6347/FFFFFF?text=Share+a+Meal",
      title: "Feed Missionaries",
      shortDesc: "Go Into the World",
      hoverDesc: "Prepare and share a meal with local missionaries. Learn about service and hearing their stories!"
    },
    {
      image: "https://placehold.co/400x300/4169E1/FFFFFF?text=3D+Printing",
      title: "3D Printing",
      shortDesc: "Makerspace Fun",
      hoverDesc: "Design and create your own 3D printed objects. Introduction to modern manufacturing technology!"
    }
  ];
  
  // Spring Activities (March - May)
  const springActivities = [
    {
      image: "https://placehold.co/400x300/FFB6C1/000000?text=Easter+Eggs",
      title: "Easter Activities",
      shortDesc: "Atonement Study",
      hoverDesc: "Breakfast study about the Atonement followed by a fun Easter egg hunt in the spring sunshine!"
    },
    {
      image: "https://placehold.co/400x300/FF69B4/FFFFFF?text=Drawing",
      title: "Learning to Draw",
      shortDesc: "Artistic Skills",
      hoverDesc: "Discover your artistic side! Learn basic drawing techniques and create your own masterpieces."
    },
    {
      image: "https://placehold.co/400x300/228B22/FFFFFF?text=Backpacking",
      title: "Backpacking Prep",
      shortDesc: "Outdoor Skills",
      hoverDesc: "Learn essential backpacking and hiking skills. Perfect time to prepare for summer adventures!"
    },
    {
      image: "https://placehold.co/400x300/32CD32/000000?text=Yard+Cleanup",
      title: "Yard Cleanup",
      shortDesc: "Bless Your Fellow Man",
      hoverDesc: "Help someone in the community with spring yard cleanup. Service project with lunch included!"
    },
    {
      image: "https://placehold.co/400x300/FF4500/FFFFFF?text=Rockets",
      title: "Air Rockets",
      shortDesc: "Science & Launch",
      hoverDesc: "Build and launch air-powered rockets! Learn about physics, pressure, and aerodynamics."
    },
    {
      image: "https://placehold.co/400x300/8B4513/FFFFFF?text=Knots+and+Ropes",
      title: "Knots & Ropes",
      shortDesc: "Practical Skills",
      hoverDesc: "Master essential knot-tying skills for camping, sailing, and everyday use. Very handy knowledge!"
    }
  ];
  
  // Summer Activities (June - August)
  const summerActivities = [
    {
      image: "https://placehold.co/400x300/FF8C00/000000?text=Campfire",
      title: "Camping & Fire",
      shortDesc: "Outdoor Adventure",
      hoverDesc: "Learn campfire safety, setup camp, and enjoy the great outdoors under the stars!"
    },
    {
      image: "https://placehold.co/400x300/DC143C/FFFFFF?text=Camp+Cooking",
      title: "Camping Cooking",
      shortDesc: "Outdoor Chef",
      hoverDesc: "Cook delicious meals in nature! Learn camping cooking techniques and outdoor food safety."
    },
    {
      image: "https://placehold.co/400x300/00CED1/000000?text=Pool+Party",
      title: "Pool Party",
      shortDesc: "Water Fun",
      hoverDesc: "Beat the summer heat with swimming, pool games, and water safety lessons!"
    },
    {
      image: "https://placehold.co/400x300/1E90FF/FFFFFF?text=Scuba+Diving",
      title: "Scuba Basics",
      shortDesc: "Underwater World",
      hoverDesc: "Introduction to scuba diving! Learn basic equipment, safety, and breathing techniques."
    },
    {
      image: "https://placehold.co/400x300/2E8B57/FFFFFF?text=Biking",
      title: "Gravel Biking",
      shortDesc: "Bike Adventure",
      hoverDesc: "Explore trails on two wheels! Learn bike safety and enjoy outdoor cycling adventures."
    },
    {
      image: "https://placehold.co/400x300/9370DB/FFFFFF?text=Game+Making",
      title: "Video Game Making",
      shortDesc: "Plan of Happiness",
      hoverDesc: "Create your own video game with a positive message! Learn basic game design and coding."
    }
  ];
  
  // Fall Activities (September - November)
  const fallActivities = [
    {
      image: "https://placehold.co/400x300/FFD700/000000?text=Frisbee+Golf",
      title: "Frisbee Golf",
      shortDesc: "Modified Sport",
      hoverDesc: "Play disc golf on a custom course! Great outdoor activity combining skill and fun."
    },
    {
      image: "https://placehold.co/400x300/FF6347/FFFFFF?text=Dodgeball",
      title: "Modified Dodgeball",
      shortDesc: "Team Sport",
      hoverDesc: "Fun, safe version of dodgeball with soft balls. Great for teamwork and exercise!"
    },
    {
      image: "https://placehold.co/400x300/FF8C00/000000?text=Four+Square",
      title: "Four Square",
      shortDesc: "Classic Game",
      hoverDesc: "The timeless playground game! Develop hand-eye coordination and quick thinking."
    },
    {
      image: "https://placehold.co/400x300/BA55D3/FFFFFF?text=Painting",
      title: "Learning to Paint",
      shortDesc: "Artistic Expression",
      hoverDesc: "Explore painting with different mediums. Express yourself through color and creativity!"
    },
    {
      image: "https://placehold.co/400x300/4682B4/FFFFFF?text=Conference",
      title: "Conference Notes",
      shortDesc: "Learn of Prophets",
      hoverDesc: "Watch General Conference, take notes, and discuss over a delicious lunch together."
    },
    {
      image: "https://placehold.co/400x300/CD853F/000000?text=Catapults",
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
