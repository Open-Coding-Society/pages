---
layout: post 
show_reading_time: false
title: Activitity Days Schedule
description: Here are the activities. Hover over image for more details
---

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
  
  .activity-item .dual-images {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
  }
  
  .activity-item .dual-images img {
    width: calc(50% - 2.5px);
    height: 120px;
    margin-bottom: 0;
  }
  
  .activity-item .title {
    font-weight: bold;
    margin: 8px 0;
    font-size: 1em;
  }
  
  .activity-item .short-desc {
    font-size: 0.85em;
    margin: 5px 0;
  }
  
  .activity-item .date {
    font-size: 0.8em;
    font-style: italic;
    margin: 3px 0;
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

## Winter ❄️
<!-- SECTION 1: Winter options -->
<div id="winter_container"></div>

## Spring 🌸
<!-- SECTION 2: Spring options -->
<div id="spring_container"></div>

## Summer ☀️
<!-- SECTION 3: Summer Options -->
<div id="summer_container"></div>

## Fall 🍂
<!-- SECTION 4: Fall Options -->
<div id="fall_container"></div>

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

      // Handle single or dual images
      if (activity.image2) {
        const dualContainer = document.createElement('div');
        dualContainer.className = 'dual-images';
        
        const img1 = document.createElement('img');
        img1.src = activity.image;
        img1.alt = activity.title;
        
        const img2 = document.createElement('img');
        img2.src = activity.image2;
        img2.alt = activity.title;
        
        dualContainer.appendChild(img1);
        dualContainer.appendChild(img2);
        item.appendChild(dualContainer);
      } else {
        const img = document.createElement('img');
        img.src = activity.image;
        img.alt = activity.title;
        item.appendChild(img);
      }

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = activity.title;

      const shortDesc = document.createElement('div');
      shortDesc.className = 'short-desc';
      shortDesc.textContent = activity.shortDesc;

      const dateElem = document.createElement('div');
      dateElem.className = 'date';
      if (activity.date) {
        dateElem.textContent = activity.date;
      }

      const hoverDesc = document.createElement('div');
      hoverDesc.className = 'hover-desc';
      hoverDesc.textContent = activity.hoverDesc;

      //item.appendChild(img);
      item.appendChild(title);
      item.appendChild(shortDesc);
      if (activity.date) {
        item.appendChild(dateElem);
      }
      item.appendChild(hoverDesc);

      container.appendChild(item);
    }

    outputElement.appendChild(container);
  }
  
  // Winter Activities (December - February)
  const winterActivities = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Nf_knots.png",
      title: "Knots & Ropes",
      shortDesc: "Practical Skills",
      hoverDesc: "Master essential knot-tying skills for camping, sailing, and everyday use. Very handy knowledge!",
      date: "Jan 13 - Church"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/ChessSet.jpg/640px-ChessSet.jpg",
      image2: "https://www.tasteofhome.com/wp-content/uploads/2024/03/Dirt-Dessert_FT24_36973_ST_0405_1-1.jpg?fit=700%2C1024",
      title: "Chess and Dirt Cake",
      shortDesc: "Strategy & Thinking",
      hoverDesc: "Learn the ancient game of chess! Develop critical thinking, patience, and strategic planning skills. Dirt Cake recipe: https://www.tasteofhome.com/recipes/dirt-dessert/",
      date: "Jan 27 - Church"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/3D_printer.png",
      image2: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Chocolate_Chip_Cookies_-_kimberlykv.jpg",
      title: "3D Printing and Baking",
      shortDesc: "Makerspace Fun",
      hoverDesc: "Design and create your own 3D printed objects. Introduction to modern manufacturing technology! Bake delicious cookies and deliver them to neighbors. Learn baking skills while spreading joy!",
      date: "Feb 10 - Spring Meadow Lane"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Fotograf%C3%ADa_de_taller.jpg/2560px-Fotograf%C3%ADa_de_taller.jpg",
      title: "Basic Automotive",
      shortDesc: "Car Basics",
      hoverDesc: "Learn fundamental automotive skills: checking oil, changing tires, and understanding how cars work!",
      date: "Feb 24 - Church"
    },
    {
      image: "{{site.baseurl}}/images/activity/missionaries.jpeg",
      title: "Feed Missionaries",
      shortDesc: "Go Ye Into the World",
      hoverDesc: "Prepare and share a meal with local missionaries. Learn about service and hearing their stories!",
      date: "Mar 10 - Spring Meadow Lane"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nestbox_metal_protection.jpg/1280px-Nestbox_metal_protection.jpg",
      title: "Build Bird Houses",
      shortDesc: "Wood Craft",
      hoverDesc: "Learn basic woodworking skills by building homes for our feathered friends. Perfect indoor winter activity!",
      date: "Mar 24 - TBD"
    },

  ];
  
  // Spring Activities (March - May)
  const springActivities = [
    {
      image: "https://i.pinimg.com/736x/00/9e/8d/009e8d29e58f7f92385055dafcdd35e9.jpg",
      title: "Easter Activities",
      shortDesc: "Atonement Study",
      hoverDesc: "Breakfast study about the Atonement followed by a fun Easter egg hunt in the spring sunshine!",
      date: "Sunday April 5 - Spring Meadow Lane"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/9/99/Kompas_Sofia.JPG",
      title: "Compass Navigation",
      shortDesc: "Find Your Way",
      hoverDesc: "Learn to use a compass and map! Discover navigation skills for hiking and outdoor adventures.",
      date: "Apr 21 - Church"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Overgrown_yard_-_geograph.org.uk_-_964505.jpg",
      title: "Yard Cleanup",
      shortDesc: "Bless Your Fellow Man",
      hoverDesc: "Help someone in the community with spring yard cleanup. Service project with lunch included!",
      date: "May 5 - Church"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Backpacking_supplies_%28pack%2C_tent%2C_sleeping_pad%2C_and_bear_box%29_at_Panhandle_Gap.jpg",
      title: "Backpacking Prep",
      shortDesc: "Outdoor Skills",
      hoverDesc: "Learn essential backpacking and hiking skills. Perfect time to prepare for summer adventures!",
      date: "May 19 - Church"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/A_simple_campfire.jpg/2560px-A_simple_campfire.jpg",
      image2: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Coleman_stove.jpg",
      title: "Camping & Outdoors Activities",
      shortDesc: "Outdoor Adventure",
      hoverDesc: "Setup camp, learn campfire safety, how to cook delicious meals in nature, hiking, milling, offroad, and how to enjoy the great outdoors under the stars!",
      date: "Saturday May 23 - Julian"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/An_photograph_of_a_model_rocket_being_launched%2C_taken_in_2019.jpg/1280px-An_photograph_of_a_model_rocket_being_launched%2C_taken_in_2019.jpg",
      title: "Air Rockets",
      shortDesc: "Science & Launch",
      hoverDesc: "Build and launch air-powered rockets! Learn about physics, pressure, and aerodynamics.",
      date: "June 9 - Church"
    }
  ];
  
  // Summer Activities (June - August)
  const summerActivities = [
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Cloth_dodgeball.jpg",
      title: "Modified Dodgeball",
      shortDesc: "Team Sport",
      hoverDesc: "Fun, safe version of dodgeball with soft balls. Great for teamwork and exercise!",
      date: "June 23 - Church"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Napa_Pool_Party.jpg/2560px-Napa_Pool_Party.jpg",
      title: "Pool Party",
      shortDesc: "Water Fun",
      hoverDesc: "Beat the summer heat with swimming, pool games, and water safety lessons!",
      date: "July 7 - Spring Meadow Lane"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Scouts_Scuba_in_Pool.jpg",
      title: "Scuba Basics",
      shortDesc: "Underwater World",
      hoverDesc: "Introduction to scuba diving! Learn basic equipment, safety, and breathing techniques.",
      date: "July 21 - Spring Meadow Lane"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Look_765_Gravel_Bicycle.jpg",
      title: "Gravel Biking",
      shortDesc: "Bike Adventure",
      hoverDesc: "Explore trails on two wheels! Learn bike safety and enjoy outdoor cycling adventures.",
      date: "Aug 4 - Spring Meadow Lane"
    },
    {
      image: "{{site.baseurl}}/images/activity/planofhappygame.png",
      title: "Video Game Making",
      shortDesc: "Plan of Happiness",
      hoverDesc: "Create your own video game with a positive message! Learn basic game design and coding.",
      date: "Aug 18 - Spring Meadow Lane"
    }
  ];
  
  // Fall Activities (September - November)
  const fallActivities = [
    {
      image: "{{site.baseurl}}/images/activity/frisbeegolf.png",
      title: "Frisbee Golf",
      shortDesc: "Modified Sport",
      hoverDesc: "Play disc golf on a custom course! Great outdoor activity combining skill and fun."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Utopia_Playground_td_%282020-12-14%29_100.jpg/2560px-Utopia_Playground_td_%282020-12-14%29_100.jpg",
      title: "Four Square",
      shortDesc: "Classic Game",
      hoverDesc: "The timeless playground game! Develop hand-eye coordination and quick thinking."
    },
    {
      image: "{{site.baseurl}}/images/activity/learningtopaint.png",
      title: "Learning to Paint",
      shortDesc: "Artistic Expression",
      hoverDesc: "Explore painting with different mediums. Express yourself through color and creativity!"
    },
    {
      image: "https://www.churchofjesuschrist.org/imgs/li6h2f1zh38l26ueaiy8epfjmrpqc8oywz2uy7cf/full/!1280%2C1024/0/default",
      title: "Conference Notes",
      shortDesc: "Learn of Prophets",
      hoverDesc: "Watch General Conference, take notes, and discuss over a delicious lunch together."
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Catapult_made_with_craft_sticks.jpg/1920px-Catapult_made_with_craft_sticks.jpg?20161025110105",
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

## Activity Day Compass

The four areas of personal development are Spiritual, Social, Physical, and Intellectual.  Everything we do has social and physical elements.  Activity is in the title.  Christ centered is themed into all our events.

### Physical Playbook

Modified Frisbee Golf → Modified Dodge Ball → Four Square → Camping and Fire → Camping and Cooking → Backpacking and Hiking → Pool Party → Scuba Basics → Gravel Biking

### Intellectual Focus

Chess Playing → Learning to Draw → Learning to Paint → Wood Craft → Wood Milling → Knots and Ropes → Basic Automotive → Compass Navigation → 3D Printing Makerspace → Video Game Making → Air Rockets → Catapults

### Spititual Connections using the examples of Jesus

Love your Neighbor → Go ye into the World  → Bless your fellow man → Easter Atonement → Learn of the Prophets
