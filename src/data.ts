export type Track = "software" | "data";

export interface CaseStudy {
  id: string;
  title: string;
  where: string;
  when: string;
  tracks: Track[];
  summary: string;
  problem: string;
  did: string[];
  result: string;
  stack: string[];
  links?: { label: string; href: string }[];
}

export const profile = {
  name: "Heena Kamani",
  nickname: "Aces",
  role: "Systems analyst and developer",
  location: "Edmonton, Alberta",
  github: "https://github.com/Heena-Kamani",
  linkedin: "https://www.linkedin.com/in/heena-kamani-7052201a1",
  headline: "I learn by building, and I haven't stopped.",
  intro:
    "I'm a systems analyst at Bluewater Group in Edmonton and a Computing Science graduate from the University of Alberta. Most of my work sits between people and their data: figuring out what a team actually needs, then building the dashboard, automation or app that gets them there.",
};

export const caseStudies: CaseStudy[] = [
  {
    id: "311",
    title: "Routing 311 requests with a local language model",
    where: "City of Edmonton",
    when: "2024 to 2025",
    tracks: ["software", "data"],
    summary: "Replaced manual triage of a shared document with a Python tool that sorts requests and emails the right staff.",
    problem:
      "Incoming 311 requests were triaged by hand from a shared document. It was slow, easy to miss things, and took time away from the actual work.",
    did: [
      "Built a Python workflow that pulls requests in through REST APIs and classifies them",
      "Used a locally hosted language model (Ollama) so resident data never left the City",
      "Sent each request to the right staff by email automatically",
    ],
    result: "Saved more than five hours of manual work every week.",
    stack: ["Python", "REST APIs", "Ollama", "Automation"],
  },
  {
    id: "duplicates",
    title: "Finding the same asset recorded five times",
    where: "City of Edmonton",
    when: "2024 to 2025",
    tracks: ["data"],
    summary: "Traced a reporting problem to assets duplicated 3 to 5+ times across systems, then helped clean it up.",
    problem:
      "Some of our asset reporting didn't add up, and nobody was sure which number to trust.",
    did: [
      "Compared records across ArcGIS and the City's databases to find where the numbers split",
      "Documented the duplicates and worked with the teams who owned the data on the cleanup",
      "Wrote data dictionaries so the next person would know what every field meant",
    ],
    result: "Found assets duplicated three to five or more times, and left documentation so it stays fixed.",
    stack: ["SQL", "ArcGIS", "Excel", "Data quality"],
  },
  {
    id: "dashboards",
    title: "Reporting that leadership could act on",
    where: "City of Edmonton",
    when: "2024 to 2025",
    tracks: ["data"],
    summary: "Turned team requests into Tableau, Power BI and GIS dashboards and cut reporting turnaround by more than half.",
    problem:
      "Teams in City Operations needed answers about things like potholes and traffic signals, and reports took too long to come back.",
    did: [
      "Turned stakeholder requests into clear requirements before building anything",
      "Built ward-level Tableau, Power BI and ArcGIS dashboards for leadership",
      "Built ETL pipelines and FME workflows to keep the data fresh",
    ],
    result: "Cut reporting turnaround time by more than 50%.",
    stack: ["Power BI", "Tableau", "ArcGIS", "FME", "ETL"],
  },
  {
    id: "aislopguard",
    title: "AISlopGuard: spotting AI-generated images",
    where: "HackED 2026 hackathon",
    when: "February 2026",
    tracks: ["software"],
    summary: "A React Native app with a FastAPI backend, built with my team in 48 hours.",
    problem:
      "AI-generated images and videos are getting hard to tell apart from real ones, and we wanted a quick way to check on your phone.",
    did: [
      "Worked on the mobile UI and asynchronous API handling in React Native",
      "Connected the app to a FastAPI backend and on-device inference with ONNX Runtime",
      "Designed evaluation metrics and regression tests so the model stayed accurate across updates",
    ],
    result: "Shipped a working app in 48 hours.",
    stack: ["React Native", "Expo", "FastAPI", "Python", "ONNX Runtime"],
    links: [{ label: "Code", href: "https://github.com/runtimeTerrors-HackED/RuntimeTerrors_AISlopGuard" }],
  },
  {
    id: "crowdsim",
    title: "Simulating crowds in real time on the GPU",
    where: "Team research project (3 people)",
    when: "2026",
    tracks: ["software"],
    summary: "A Unity crowd simulation that decides how much physics each person gets based on how crowded their area is.",
    problem:
      "Simulating thousands of people bumping into each other is expensive. Most approaches spend the same effort on every person, even someone walking alone in an empty space.",
    did: [
      "Built the simulation in Unity with my two teammates, splitting the work equally",
      "Implemented seven interchangeable solvers, from a simple single-threaded Social Force baseline to a fully GPU-based Position-Based Dynamics solver",
      "Used a live crowd density heatmap so dense areas get full collision physics and sparse areas cost almost nothing",
      "Benchmarked every solver on the same scenes and wrote it up as a research report",
    ],
    result: "A fair, side-by-side comparison of seven approaches, with a GPU solver that spends effort where the crowd actually is.",
    stack: ["Unity", "C#", "Compute shaders", "Burst / Jobs", "Benchmarking"],
    links: [{ label: "Code and report", href: "https://github.com/tjong03/Csim-prj-2026" }],
  },
  {
    id: "socialdist",
    title: "Social Distribution: a full-stack social web app",
    where: "CMPUT 404, Web Applications and Architecture",
    when: "University of Alberta",
    tracks: ["software"],
    summary: "Team-built social media web app with authentication, feeds and a SQL backend, deployed to Heroku.",
    problem: "Build a working social platform as a team, from database to deployed site.",
    did: [
      "Developed authentication, dynamic feeds, post management and persistent SQL storage",
      "Implemented backend logic and REST API integrations",
      "Worked through Git branching, merging and pull requests with the team",
    ],
    result: "Deployed to Heroku and delivered as a team.",
    stack: ["Java", "JavaScript", "HTML/CSS", "SQL", "REST APIs", "Heroku"],
  },
  {
    id: "moodspace",
    title: "Mood Space: an Android mood tracker",
    where: "CMPUT 301, Introduction to Software Engineering",
    when: "University of Alberta",
    tracks: ["software"],
    summary: "Android app with Firebase authentication, real-time data, filtering and privacy controls.",
    problem: "Build a mood-tracking app people would actually want to use, with a team and a real process.",
    did: [
      "Built features with Firebase authentication, real-time data and filtering",
      "Added privacy controls so users decide what they share",
      "Used fragments and RecyclerView to keep the code maintainable",
    ],
    result: "A working Android app built through pull requests and code review.",
    stack: ["Java", "Android Studio", "Firebase", "Figma"],
    links: [{ label: "Code", href: "https://github.com/baconeggsrice/Just-a-cup-of-Java" }],
  },
];

export const experience = [
  {
    role: "Systems Analyst",
    org: "Bluewater Group",
    when: "June 2026 to now",
    points: [
      "Own the Power BI KPI reporting built on SAP data for six operations teams",
      "Wrote a business case for connecting SAP directly to Power BI with CDS Views and OData",
      "Built a Power Automate approval workflow with Teams Adaptive Cards and escalation, rolled out company-wide",
      "Building an internal IT and company-information chatbot in Microsoft Teams",
      "Gathering requirements for an in-house field data collection app",
    ],
  },
  {
    role: "BI and Data Analyst Co-op",
    org: "City of Edmonton",
    when: "September 2024 to September 2025",
    points: [
      "Dashboards, ETL pipelines and automation for City Operations",
      "Cut reporting turnaround by more than half",
    ],
  },
  {
    role: "Coordinator",
    org: "International Students' Association, University of Alberta",
    when: "March 2022 to now",
    points: ["Plan and run networking events, including Networking 101, for 60+ students"],
  },
  {
    role: "Web Development Intern",
    org: "Bizoneer Institute of Technology",
    when: "January to July 2021",
    points: ["Gathered requirements with clients, prototyped in Figma and built web applications"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Build", items: ["TypeScript", "React", "React Native", "Python", "Java", "SQL", "FastAPI", "REST APIs", "Git"] },
  { group: "Analyze", items: ["Power BI (DAX, Power Query)", "Tableau", "Excel", "ArcGIS", "FME", "ETL"] },
  { group: "Automate", items: ["Power Automate", "Microsoft Teams", "SharePoint", "SAP S/4HANA"] },
  { group: "Speak", items: ["English", "French", "Hindi", "Gujarati", "Swahili", "Spanish (learning)"] },
];

// "Now" section: what I'm learning and building. Update this every few weeks.
export const now = {
  updated: "October 2026",
  items: [
    { label: "Building", text: "This site, in React and TypeScript, and adding to it every week." },
    { label: "At work", text: "An internal IT and company-information chatbot in Microsoft Teams, and requirements for a field data collection app." },
    { label: "Learning", text: "Finishing the Google Data Analytics Professional Certificate." },
    { label: "Next up", text: "A small web app that explores the City of Edmonton's open 311 data." },
  ],
};

// Form submissions go to my inbox through Web3Forms (free). The key is safe to be public:
// it only lets people send me a message, it can't read anything.
export const WEB3FORMS_KEY = "";
