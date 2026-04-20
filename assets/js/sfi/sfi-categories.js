// ════════════════════════════════════════════════════
// SFI Category Definitions (Pure Data)
// Single Responsibility: Define what equipment categories
// exist and their detection keyword mappings.
// ════════════════════════════════════════════════════

const SFI_CATEGORIES = [
  {
    name: "Helmets",
    color: "#F0A500",
    items: [
      "Flame Resistant Motorsports Helmets",
      "Youth Full Face Helmets",
      "Motorsports Helmet"
    ],
    cocoKeys: [],
    mnetKeys: ["helmet", "crash helmet", "football helmet", "hard hat", "protective helmet", "head protector", "visor"],
    boost: 0
  },
  {
    name: "Driver Suits & Protective Gear",
    color: "#00d4ff",
    items: [
      "Driver Suits", "Advanced Driver Suits",
      "Driver Accessories", "Abrasion Resistant Driver/Rider Suits",
      "Go-Kart Chest Protector (Youth)", "Fueler Apron", "Shift Boot Covers"
    ],
    cocoKeys: ["person"],
    mnetKeys: ["suit", "uniform", "military uniform", "bulletproof vest", "jersey", "lab coat", "vestment",
               "protective garment", "coverall", "trench coat", "cloak", "apron", "bib"],
    boost: -0.05
  },
  {
    name: "Clutch & Flywheel Assemblies",
    color: "#ff6b6b",
    items: [
      "Replacement Flywheels and Clutch Assemblies",
      "Multiple Disc Clutch Assemblies for Naturally Aspirated Engines",
      "Nitro-Methane Drag Race Multiple Disc Clutch Assemblies",
      "Methanol Drag Race Multiple Disc Clutch Assemblies",
      "Multiple Disc Clutch Assemblies for Supercharged/Turbo/Nitrous Vehicles"
    ],
    cocoKeys: [],
    mnetKeys: ["disc", "disk", "plate", "clutch", "flywheel", "brake pad", "brake disc",
               "circular saw", "manhole cover", "rotary", "washer"],
    boost: 0
  },
  {
    name: "Bellhousings",
    color: "#a855f7",
    items: [
      "Containment Bellhousing for SFI 1.1 & 1.2 Clutch Assemblies",
      "Passenger Car Replacement Containment Bellhousings",
      "Containment Bellhousing for SFI 1.3 & 1.4 Clutch Assemblies",
      "Containment Bellhousing for Supercharged/Nitrous-Oxide Applications",
      "Pulling and Diesel Drag Racing Bellhousing"
    ],
    cocoKeys: [],
    mnetKeys: ["bell", "dome", "caldron", "cauldron", "cast iron", "housing", "shield",
               "cylinder", "bucket", "pail", "pot"],
    boost: 0
  },
  {
    name: "Transmission & Drivetrain",
    color: "#22d3ee",
    items: [
      "Automatic Transmission Shields (Flexible Type)",
      "Automatic Transmission Shields (Rigid Type)",
      "Automatic Transmission Flexplates",
      "High Horsepower Automatic Transmission Flexplates",
      "Automatic Transmission Flexplates for Diesel Applications",
      "Automatic Transmission Flexplate Shields",
      "Drive Shafts",
      "Steering Wheel Quick Disconnect/Release"
    ],
    cocoKeys: [],
    mnetKeys: ["shaft", "axle", "rod", "pipe", "steel", "metal", "gear", "cog",
               "steering wheel", "wheel", "reel", "spool", "spindle"],
    boost: 0
  },
  {
    name: "Roll Cages & Chassis",
    color: "#f97316",
    items: [
      "Funny Car Roll Cage (Alcohol, Advanced ET, Nostalgia, etc.)",
      "Altered Car Roll Cage - 6.00 to 7.49 Seconds",
      "Altered and Funny Car Roll Cage - 7.50 Seconds & Slower",
      "Side Steer Roadster Roll Cage",
      "Nitro Fuel Funny Car Chassis - 4.99 Seconds & Quicker",
      "Full Bodied Car Tube Chassis (all variants)",
      "Driver Roll Cage for Tractors (all weight classes)"
    ],
    cocoKeys: ["car", "truck"],
    mnetKeys: ["cage", "framework", "steel arch bridge", "suspension bridge", "trestle",
               "lattice", "grille", "grill", "tubular", "scaffold", "frame",
               "go-kart", "gokart", "racer", "race car", "sports car"],
    boost: 0
  },
  {
    name: "Supercharger & Turbo Systems",
    color: "#ec4899",
    items: [
      "Supercharger Restraint Devices",
      "Methanol Fuel Supercharger Restraint Devices",
      "Nitro-Methane Fuel Supercharger Restraint Devices",
      "Screw-Type Supercharger Restraint Devices",
      "Nitro-Methane Fuel Supercharger Restraint Strap Engine Brackets",
      "Supercharger Pressure Relief Assemblies",
      "Screw-Type Superchargers",
      "Turbochargers"
    ],
    cocoKeys: [],
    mnetKeys: ["turbine", "engine", "motor", "compressor", "pump", "machine",
               "chain", "chain mail", "strap", "buckle", "harness",
               "power drill", "vacuum", "fan", "impeller"],
    boost: 0
  },
  {
    name: "Engine Components",
    color: "#84cc16",
    items: [
      "Lower Engine Containment Device",
      "Sportsman Lower Engine Containment Device",
      "Containment Valve Covers/Valve Cover Shields",
      "Manifold Blankets", "Engine Blankets - Rear",
      "Crankshaft Hub Harmonic Dampers"
    ],
    cocoKeys: [],
    mnetKeys: ["engine", "motor", "piston", "cylinder", "radiator", "valve",
               "manifold", "gasket", "mechanical", "machine", "damper",
               "shock absorber", "carburetor"],
    boost: 0
  },
  {
    name: "Wheels",
    color: "#eab308",
    items: [
      "Drag Race Drive Wheels", "Drag Race Front Wheels",
      "High Horsepower Drag Race Drive Wheels",
      "Top Fuel and Funny Car Drag Race Drive Beadlock Wheels",
      "Stock Car Steel Wheels", "Heavy Duty Stock Car Steel Wheels",
      "Alloy Stock Car Wheels", "Stock Car Wheel Spacers"
    ],
    cocoKeys: [],
    mnetKeys: ["wheel", "car wheel", "tire", "rim", "spoke", "hubcap",
               "disc", "alloy wheel", "mag wheel"],
    boost: 0.05
  },
  {
    name: "Driver Restraint Systems",
    color: "#14b8a6",
    items: [
      "Driver Restraint Assemblies",
      "Restraint Assemblies for Youth Drivers",
      "Stock Car Driver Restraint Assemblies",
      "Advanced Motorsport Driver Restraint Assemblies",
      "Reclined Driver Advanced Motorsport Restraint Assemblies",
      "Head and Neck Restraint Systems"
    ],
    cocoKeys: [],
    mnetKeys: ["seat belt", "safety belt", "harness", "strap", "buckle", "leash",
               "brace", "restraint", "collar", "neck brace", "yoke"],
    boost: 0
  },
  {
    name: "Fire Suppression Systems",
    color: "#ef4444",
    items: [
      "On Board Fire Suppression Systems",
      "Single Seat Open Wheel Rear Engine On Board Fire Suppression Systems",
      "Single Seat Open Wheel Front Engine On Board Fire Suppression Systems",
      "Non Flammable, Thermal Barrier / Fire Extinguishing Coatings"
    ],
    cocoKeys: ["fire hydrant"],
    mnetKeys: ["fire extinguisher", "extinguisher", "cylinder", "canister", "tank",
               "bottle", "oxygen mask", "nozzle", "hose", "spray can"],
    boost: 0
  },
  {
    name: "Fuel Cells & Tanks",
    color: "#06b6d4",
    items: [
      "Polymer (Foam-Filled) Fuel Cells",
      "Crash Resistant Fuel Cells",
      "Competition Fuel Cell Bladder",
      "Open Wheel Front Engine Fuel Cells",
      "Stock Car Fuel Cell Bladder",
      "Stock Car Fill/Vent Check Valve Assembly"
    ],
    cocoKeys: [],
    mnetKeys: ["container", "barrel", "drum", "tank", "bucket", "tub", "vat",
               "crate", "chest", "box", "canister", "jerry can", "gas pump"],
    boost: 0
  },
  {
    name: "Racing Seats",
    color: "#8b5cf6",
    items: [
      "Stock Car Type Racing Seats (Custom)",
      "Racing Seats (Standard)"
    ],
    cocoKeys: ["chair"],
    mnetKeys: ["seat", "chair", "throne", "barber chair", "rocking chair",
               "folding chair", "car seat", "bucket seat"],
    boost: 0
  },
  {
    name: "Safety Nets, Padding & Blankets",
    color: "#10b981",
    items: [
      "Window Nets", "Roll Cage Nets",
      "Roll Bar Padding", "Impact Padding",
      "Tractor Blankets", "Centrifugal Supercharger Blankets",
      "Manifold Blankets", "Engine Blankets - Rear"
    ],
    cocoKeys: [],
    mnetKeys: ["net", "mesh", "web", "hammock", "volleyball net",
               "cushion", "pillow", "pad", "mattress", "quilt", "blanket",
               "comforter", "sleeping bag", "wool", "fabric", "velvet"],
    boost: 0
  },
  {
    name: "Aero, Structural & Specialty",
    color: "#f59e0b",
    items: [
      "Top Fuel Rear Wing", "Top Fuel Front Wing",
      "NASCAR-Type Tethers",
      "NASCAR Dashboard and Other Carbon Fiber Components",
      "Drag Boat Capsule Shell Material",
      "Drag Boat Capsule Canopy Material",
      "Drag Boat Capsule Roll Cage",
      "Nitro-Methane Fuel Motorcycle Engine Restraint Devices"
    ],
    cocoKeys: ["boat", "airplane"],
    mnetKeys: ["wing", "airfoil", "spoiler", "fin", "rudder",
               "canopy", "parachute", "cable", "wire", "tether",
               "carbon fiber", "composite", "hull", "speedboat",
               "aircraft carrier", "warplane"],
    boost: 0
  }
];
