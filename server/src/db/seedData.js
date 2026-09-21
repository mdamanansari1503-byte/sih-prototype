// Seed Data for AwaazGram Prototype

export const seedUsers = [
  {
    id: "user-cit-1",
    name: "Rahul Mishra",
    email: "rahul.mishra@gmail.com",
    role: "citizen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    phone: "+91 98765 43210",
    city: "Bhopal",
    state: "Madhya Pradesh",
    verified: true
  },
  {
    id: "user-cit-2",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    role: "citizen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    phone: "+91 98765 88990",
    city: "Bhopal",
    state: "Madhya Pradesh",
    verified: true
  },
  {
    id: "user-gov-1",
    name: "Anita Sharma",
    email: "anita.sharma@gov.in",
    role: "government",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    designation: "Municipal Verification Officer & Smart City Lead",
    department: "Bhopal Municipal Corporation",
    jurisdiction: "Bhopal Smart City Cell",
    city: "Bhopal",
    state: "Madhya Pradesh"
  },
  {
    id: "user-uni-1",
    name: "Prof. Kumar",
    email: "prof.kumar@manit.ac.in",
    role: "university",
    institution: "MANIT Bhopal Innovation Hub",
    department: "Electrical & IoT Innovation Cell",
    teamName: "MANIT IoT & Energy Innovation Team",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    studentLead: "Rohan Nair",
    teamSize: 6,
    city: "Bhopal",
    state: "Madhya Pradesh"
  },
  {
    id: "user-ind-1",
    name: "Amit Verma",
    email: "amit.verma@tatacsr.org",
    role: "industry",
    organization: "Tata Sustainability & CSR Initiatives",
    designation: "CSR Head & Tech Incubation Lead",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    sector: "Clean Energy, Water & Urban Infra",
    fundsCommitted: "₹ 45,00,000",
    city: "Bhopal",
    state: "Madhya Pradesh"
  },
  {
    id: "user-admin",
    name: "AwaazGram Central Administrator",
    email: "admin@awaazgram.gov.in",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    designation: "National Civic Coordinator"
  }
];

export const seedProblems = [
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
      lat: 23.2599,
      lng: 77.4126
    },
    images: [
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600"
    ],
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
    },
    verification: {
      verifiedBy: "Anita Sharma",
      verifiedAt: "2026-05-12T14:15:00Z",
      status: "verified",
      remarks: "Critical safety hazard. Grant sanctioned for MANIT engineering team deployment.",
      allocatedBudget: 180000,
      priority: "High"
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
      lat: 23.3441,
      lng: 85.3096
    },
    images: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600"
    ],
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
      lat: 23.2847,
      lng: 85.3131
    },
    images: [
      "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600"
    ],
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
    },
    verification: {
      verifiedBy: "Anita Sharma",
      verifiedAt: "2026-05-09T16:00:00Z",
      status: "verified",
      remarks: "Approved for university innovation adoption.",
      allocatedBudget: 145000,
      priority: "Critical"
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
      lat: 23.4147,
      lng: 85.5298
    },
    images: [
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600"
    ],
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
    },
    verification: {
      verifiedBy: "Anita Sharma",
      verifiedAt: "2026-05-06T11:00:00Z",
      status: "verified",
      remarks: "Priority energy restoration sanctioned.",
      allocatedBudget: 85000,
      priority: "High"
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
      lat: 23.4475,
      lng: 85.6543
    },
    images: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600"
    ],
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
    },
    verification: {
      verifiedBy: "Anita Sharma",
      verifiedAt: "2026-05-03T10:00:00Z",
      status: "verified",
      remarks: "Bridge culvert safety clearance approved.",
      allocatedBudget: 210000,
      priority: "Critical"
    }
  },
  {
    id: "ag1006",
    title: "Unregulated Solid Waste Overflow near Community Market",
    description: "Bio-hazard and open waste dumping overflowing into drainage channels near daily market.",
    category: "Waste Management & Sanitation",
    location: {
      address: "Daily Vegetable Market Chowk, Sector 2",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834002",
      lat: 23.3601,
      lng: 85.3250
    },
    images: [
      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600"
    ],
    reportedBy: "Vikas Sinha",
    reportedByName: "Vikas Sinha",
    reportedAt: "2026-05-03T12:00:00Z",
    status: "verified",
    upvotes: 35,
    aiAnalysis: {
      urgency: "High",
      category: "Waste Management & Sanitation",
      feasibilityScore: 93,
      estimatedBudget: "₹75,000",
      recommendedDepartment: "Urban Sanitation & Smart Waste Hub",
      summary: "Automated ultrasonic fill-level telemetry bins and community organic bio-composting unit."
    },
    verification: {
      verifiedBy: "Anita Sharma",
      verifiedAt: "2026-05-04T15:00:00Z",
      status: "verified",
      remarks: "Smart waste bin prototype sanctioned.",
      allocatedBudget: 75000,
      priority: "High"
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
      lat: 23.6693,
      lng: 86.1511
    },
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600"
    ],
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
    },
    verification: {
      verifiedBy: "Anita Sharma",
      verifiedAt: "2026-04-22T11:00:00Z",
      status: "verified",
      remarks: "Sanctioned for community deployment.",
      allocatedBudget: 190000,
      priority: "High"
    }
  }
];

export const seedProjects = [
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
    startedAt: "2026-08-15T10:00:00Z",
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
      { id: "exp-1", item: "12x High-Efficiency 60W LED Luminaires", amount: 48000, category: "Hardware & Electronics", vendor: "Havells India Industrial", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-08-20" },
      { id: "exp-2", item: "4x 100Ah LiFePO4 Solar Battery Packs & BMS", amount: 62000, category: "Batteries & Power", vendor: "Exide Energy Solutions", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-08-25" },
      { id: "exp-3", item: "LoRaWAN Gateway & Pole Sensor Nodes", amount: 24500, category: "IoT & Telemetry", vendor: "Robu.in Electronics", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-09-02" },
      { id: "exp-4", item: "Mounting Brackets & Weatherproof Enclosures", amount: 21400, category: "Fabrication & Mounting", vendor: "City Metal Fabricators", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-09-10" }
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
    startedAt: "2026-07-01T10:00:00Z",
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
      { id: "exp-1", item: "Commercial Multi-Stage RO Membrane System", amount: 75000, category: "Filtration Units", vendor: "AquaPure Industrial", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-07-10" },
      { id: "exp-2", item: "RFID Smart Card Reader & Microcontroller Kit", amount: 32000, category: "Dispenser Automation", vendor: "Robu.in Electronics", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-07-18" },
      { id: "exp-3", item: "3kW Solar Inverter & Heavy-duty Structure", amount: 55000, category: "Solar Power Hub", vendor: "Waaree Solar Technologies", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-07-28" },
      { id: "exp-4", item: "Stainless Steel Storage Tank & Plumbing", amount: 20000, category: "Plumbing & Housing", vendor: "SteelFab Corporation", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", date: "2026-08-05" }
    ]
  }
];

export const seedExpenses = [
  {
    id: "exp-1",
    projectId: "proj-201",
    item: "12x High-Efficiency 60W LED Luminaires",
    category: "Hardware & Electronics",
    amount: 48000,
    vendor: "Havells India Industrial",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-08-20"
  },
  {
    id: "exp-2",
    projectId: "proj-201",
    item: "4x 100Ah LiFePO4 Solar Battery Packs & BMS",
    category: "Batteries & Power",
    amount: 62000,
    vendor: "Exide Energy Solutions",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-08-25"
  },
  {
    id: "exp-3",
    projectId: "proj-201",
    item: "LoRaWAN Gateway & Pole Sensor Nodes",
    category: "IoT & Telemetry",
    amount: 24500,
    vendor: "Robu.in Electronics",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-09-02"
  },
  {
    id: "exp-4",
    projectId: "proj-201",
    item: "Mounting Brackets & Weatherproof Enclosures",
    category: "Fabrication & Mounting",
    amount: 21400,
    vendor: "City Metal Fabricators",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-09-10"
  },
  {
    id: "exp-201",
    projectId: "proj-202",
    item: "Commercial Multi-Stage RO Membrane System",
    category: "Filtration Units",
    amount: 75000,
    vendor: "AquaPure Industrial",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-07-10"
  },
  {
    id: "exp-202",
    projectId: "proj-202",
    item: "RFID Smart Card Reader & Microcontroller Kit",
    category: "Dispenser Automation",
    amount: 32000,
    vendor: "Robu.in Electronics",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-07-18"
  },
  {
    id: "exp-203",
    projectId: "proj-202",
    item: "3kW Solar Inverter & Heavy-duty Structure",
    category: "Solar Power Hub",
    amount: 55000,
    vendor: "Waaree Solar Technologies",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-07-28"
  },
  {
    id: "exp-204",
    projectId: "proj-202",
    item: "Stainless Steel Storage Tank & Plumbing",
    category: "Plumbing & Housing",
    amount: 20000,
    vendor: "SteelFab Corporation",
    invoiceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    date: "2026-08-05"
  }
];

export const seedLeaderboard = [
  {
    rank: 1,
    institution: "MANIT Bhopal Innovation Hub",
    teamName: "MANIT IoT & Energy Innovation Team",
    city: "Bhopal",
    state: "Madhya Pradesh",
    projectsSolved: 8,
    activeProjects: 2,
    impactScore: 2840,
    badges: ["Clean Energy Pioneer", "SIH Top Contributor"],
    fundsSecured: "₹ 18,50,000",
    avatar: "https://images.unsplash.com/photo-1562774053-701939374585?w=150"
  },
  {
    rank: 2,
    institution: "BIT Mesra Innovation Cell",
    teamName: "Team Jaltarang Hydro Lab",
    city: "Ranchi",
    state: "Jharkhand",
    projectsSolved: 6,
    activeProjects: 3,
    impactScore: 2310,
    badges: ["Smart Water Award", "Tech Innovator"],
    fundsSecured: "₹ 14,20,000",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  }
];

export const seedNotifications = [
  {
    id: "notif-1",
    recipientRole: "all",
    title: "Project Clean Water ATM Marked SOLVED! 🎉",
    message: "BIT Mesra Innovation Cell successfully commissioned the Clean Water ATM in Bokaro. 5000L daily pure drinking water active.",
    timestamp: "2026-08-05T16:05:00Z",
    read: false,
    link: "/projects/proj-202",
    type: "success"
  }
];
