// Default Fallback Demo Data for Client-Side Standalone Execution on Vercel/Netlify

export const defaultProblems = [
  {
    id: "ag1001",
    title: "Broken Street Light & Dark Walking Corridor",
    description: "Main arterial road lighting is broken across 12 consecutive poles in Ward 12, causing night accidents and safety hazards for commuters.",
    category: "Street Lighting & Electrical",
    location: {
      address: "Ward 12, Link Road Junction",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462003",
      coordinates: { lat: 23.2599, lng: 77.4126 }
    },
    images: ["https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600"],
    reportedBy: "Rahul Mishra",
    reportedByName: "Rahul Mishra",
    reportedAt: "2026-05-10T09:15:00Z",
    status: "in_progress",
    upvotes: 42,
    projectId: "proj-201",
    aiAnalysis: {
      urgency: "High",
      category: "Street Lighting & Electrical",
      feasibilityScore: 92,
      estimatedBudget: "₹1,80,000",
      recommendedDepartment: "Electrical & IoT Innovation Lab",
      summary: "High hazard corridor requiring solar-assisted smart auto-dimming LED luminaires and LiFePO4 battery modules with LoRa fault alerts."
    }
  },
  {
    id: "ag1002",
    title: "Hazardous Open Pothole at Main Market Intersection",
    description: "Deep potholes on the four-way intersection near City Center causing vehicle damage and waterlogging during rains.",
    category: "Roads & Pothole Hazards",
    location: {
      address: "City Center Market Chowk",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834001",
      coordinates: { lat: 23.3441, lng: 85.3096 }
    },
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600"],
    reportedBy: "Sunita Soren",
    reportedByName: "Sunita Soren",
    reportedAt: "2026-05-12T14:20:00Z",
    status: "pending_verification",
    upvotes: 28,
    aiAnalysis: {
      urgency: "Medium",
      category: "Roads & Pothole Hazards",
      feasibilityScore: 88,
      estimatedBudget: "₹95,000",
      recommendedDepartment: "Civil & Structural Engineering Dept",
      summary: "Surface asphalt degradation requiring cold-mix bituminous patch and geo-textile drainage reinforcement."
    }
  },
  {
    id: "ag1003",
    title: "Drinking Water Fluoride Contamination in Handpumps",
    description: "High levels of fluoride and iron detected in community tube-wells causing dental and skeletal fluorosis among residents.",
    category: "Drainage & Clean Water Supply",
    location: {
      address: "Tupudana Village, Sector 4",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834003",
      coordinates: { lat: 23.2847, lng: 85.3131 }
    },
    images: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600"],
    reportedBy: "Amit Patel",
    reportedByName: "Amit Patel",
    reportedAt: "2026-05-08T11:00:00Z",
    status: "verified",
    upvotes: 67,
    aiAnalysis: {
      urgency: "Critical",
      category: "Drainage & Clean Water Supply",
      feasibilityScore: 94,
      estimatedBudget: "₹1,45,000",
      recommendedDepartment: "Chemical & Environmental Engineering Lab",
      summary: "Deployment of multi-stage activated alumina fluoride filtration column with solar UV disinfection unit."
    }
  },
  {
    id: "ag1004",
    title: "Solar Microgrid Failure in Tribal Community Center",
    description: "Community center solar panels and battery inverter have been non-functional for 3 weeks, leaving digital health clinic without power.",
    category: "Street Lighting & Electrical",
    location: {
      address: "Angara Block, Rural Health Sub-Center",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "835103",
      coordinates: { lat: 23.4147, lng: 85.5298 }
    },
    images: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600"],
    reportedBy: "Birsa Munda Ward",
    reportedByName: "Birsa Munda Ward",
    reportedAt: "2026-05-05T08:30:00Z",
    status: "verified",
    upvotes: 54,
    aiAnalysis: {
      urgency: "High",
      category: "Street Lighting & Electrical",
      feasibilityScore: 91,
      estimatedBudget: "₹85,000",
      recommendedDepartment: "Renewable Energy & Power Electronics Lab",
      summary: "MPPT solar charge controller replacement with IoT telemetry and battery cell balancing unit."
    }
  },
  {
    id: "ag1005",
    title: "Culvert Foundation Soil Erosion on Hundru Link Road",
    description: "Monsoon soil runoff has undermined the bridge culvert foundation, posing bridge collapse risk for school buses.",
    category: "Roads & Infrastructure",
    location: {
      address: "Hundru Falls Rural Link Road",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "835103",
      coordinates: { lat: 23.4475, lng: 85.6543 }
    },
    images: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"],
    reportedBy: "Priya Sharma",
    reportedByName: "Priya Sharma",
    reportedAt: "2026-05-01T16:45:00Z",
    status: "verified",
    upvotes: 39,
    aiAnalysis: {
      urgency: "Critical",
      category: "Roads & Infrastructure",
      feasibilityScore: 89,
      estimatedBudget: "₹2,10,000",
      recommendedDepartment: "Civil & Geo-technical Engineering Lab",
      summary: "Gabion wall reinforcement and reinforced concrete culvert apron with drainage weep holes."
    }
  },
  {
    id: "ag1008",
    title: "Clean Water ATM & Automated RO Purification Unit",
    description: "Installation of community water ATM with RFID dispenser providing 5000L daily pure drinking water.",
    category: "Drainage & Clean Water Supply",
    location: {
      address: "Sector 4 Market Area",
      city: "Bokaro",
      state: "Jharkhand",
      pincode: "827004",
      coordinates: { lat: 23.6693, lng: 86.1511 }
    },
    images: ["https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600"],
    reportedBy: "Rahul Mishra",
    reportedByName: "Rahul Mishra",
    reportedAt: "2026-04-20T10:00:00Z",
    status: "solved",
    upvotes: 89,
    projectId: "proj-202",
    aiAnalysis: {
      urgency: "Medium",
      category: "Drainage & Clean Water Supply",
      feasibilityScore: 95,
      estimatedBudget: "₹1,90,000",
      recommendedDepartment: "Environmental & Mechanical Engineering Lab",
      summary: "Multi-stage RO purification unit with RFID card dispenser and live TDS sensor cloud upload."
    }
  }
];

export const defaultProjects = [
  {
    id: "proj-201",
    problemId: "ag1001",
    title: "Smart Street Light Automation & Solar Battery Node",
    universityName: "MANIT Bhopal Innovation Hub",
    teamName: "MANIT IoT & Energy Innovation Team",
    studentLead: "Rohan Nair",
    facultyMentor: "Prof. Kumar",
    teamMembers: ["Rohan Nair", "Priya Verma", "Amit Patel", "Sneha Rao", "Karan Singh"],
    status: "in_progress",
    progressPercentage: 65,
    startedAt: "2026-08-15",
    allocatedBudget: 180000,
    totalExpenses: 155900,
    milestones: [
      { id: "m-1", title: "Corridor Illuminance & Solar Irradiance Survey", status: "completed", description: "Mapped 12 broken poles and simulated 60W LED luminaire lumen output." },
      { id: "m-2", title: "LiFePO4 Solar Battery & BMS Prototype Fabricated", status: "completed", description: "Fabricated 4 units of 12V 100Ah battery enclosure with auto-dimming circuitry." },
      { id: "m-3", title: "On-Site Installation & LoRaWAN Node Integration", status: "in_progress", description: "Deploying pole mounts and testing night telemetry to municipal dashboard." },
      { id: "m-4", title: "Final Handover & Ground Impact Sign-off", status: "pending", description: "Validation under heavy weather and sign-off with municipal engineer." }
    ],
    solutionDetails: {
      summary: "Smart auto-dimming LED luminaires powered by solar PV panels and LiFePO4 battery pack with LoRa fault telemetry.",
      techStack: ["ESP32 Microcontroller", "LoRaWAN", "LiFePO4 BMS", "SolidWorks"]
    },
    expenses: [
      { id: "exp-1", title: "12x High-Efficiency 60W LED Luminaires", amount: 48000, category: "Hardware & Electronics", date: "2026-08-20" },
      { id: "exp-2", title: "4x 100Ah LiFePO4 Solar Battery Packs & BMS", amount: 62000, category: "Batteries & Power", date: "2026-08-25" },
      { id: "exp-3", title: "LoRaWAN Gateway & Pole Sensor Nodes", amount: 24500, category: "IoT & Telemetry", date: "2026-09-02" },
      { id: "exp-4", title: "Mounting Brackets & Weatherproof Enclosures", amount: 21400, category: "Fabrication & Mounting", date: "2026-09-10" }
    ]
  },
  {
    id: "proj-202",
    problemId: "ag1008",
    title: "Clean Water ATM & Automated RO Purification Unit",
    universityName: "BIT Mesra Innovation Cell",
    teamName: "Team Jaltarang Hydro Lab",
    studentLead: "Aakash Deshmukh",
    facultyMentor: "Prof. Arvind Rao",
    teamMembers: ["Aakash Deshmukh", "Tanvi Joshi", "Rahul Patil", "Omkar Shinde"],
    status: "solved",
    progressPercentage: 100,
    startedAt: "2026-07-01",
    allocatedBudget: 190000,
    totalExpenses: 182000,
    milestones: [
      { id: "m-1", title: "Water Quality & TDS Testing", status: "completed", description: "Lab tested TDS levels and calibrated multi-stage filtration." },
      { id: "m-2", title: "Automated RFID Dispenser Assembly", status: "completed", description: "Integrated smart card payment and flow rate sensor." },
      { id: "m-3", title: "Community Center Installation & Commissioning", status: "completed", description: "Delivering 5,000L clean drinking water daily to 800+ residents." }
    ],
    solutionDetails: {
      summary: "Solar-powered multi-stage RO water purification unit with RFID card dispenser and live TDS monitoring.",
      techStack: ["Reverse Osmosis", "RFID Module", "Arduino Mega", "Solar Inverter"]
    },
    expenses: [
      { id: "exp-1", title: "Commercial Multi-Stage RO Membrane System", amount: 75000, category: "Filtration Units", date: "2026-07-10" },
      { id: "exp-2", title: "RFID Smart Card Reader & Microcontroller Kit", amount: 32000, category: "Dispenser Automation", date: "2026-07-18" },
      { id: "exp-3", title: "3kW Solar Inverter & Heavy-duty Structure", amount: 55000, category: "Solar Power Hub", date: "2026-07-28" },
      { id: "exp-4", title: "Stainless Steel Storage Tank & Plumbing", amount: 20000, category: "Plumbing & Housing", date: "2026-08-05" }
    ]
  }
];
