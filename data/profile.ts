export interface ExperienceItem {
  title: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  meta: string;
  points: string[];
}

export interface ProjectItem {
  no: string;
  title: string;
  label: string;
  category: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlight?: boolean;
}

export interface ContestItem {
  name: string;
  result: string;
  year?: string;
}

export interface ProfileData {
  name: string;
  fullName: string;
  handle: string;
  title: string;
  shortBio: string;
  extendedBio: string;
  status: string;
  availability: string;
  email: string;
  location: string;
  institution: string;
  department: string;
  degree: string;
  graduationYear: string;
  cgpa: string;
  cgpaScale: string;
  profiles: {
    codeforces: {
      platform: string;
      handle: string;
      url: string;
      rating: number;
      rank: string;
      rankColor: string;
      rankBadge: string;
    };
    atcoder: {
      platform: string;
      handle: string;
      url: string;
      rating: number;
      rank: string;
      rankColor: string;
      tier: string;
    };
    codechef: {
      platform: string;
      handle: string;
      url: string;
      rating: number;
      rank: string;
      stars: string;
    };
    github: {
      platform: string;
      handle: string;
      url: string;
    };
    linkedin: {
      platform: string;
      handle: string;
      url: string;
    };
  };
  resumeUrl: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  contests: ContestItem[];
  skillCategories: {
    category: string;
    description: string;
    skills: string[];
  }[];
  achievements: string[];
  quickStats: {
    label: string;
    value: string;
    sublabel: string;
  }[];
}

export const profileData: ProfileData = {
  name: "Minhajul Islam",
  fullName: "Minhajul Islam",
  handle: "NoObMin",
  title: "Competitive Programmer · CSE Student · Problem Solver",
  shortBio:
    "I am Minhajul Islam, a Computer Science student at Daffodil International University. I enjoy algorithms, practical software projects, programming education, and turning difficult problems into clear solutions.",
  extendedBio:
    "I focus on competitive programming, algorithms, and practical academic software projects. Alongside my studies at Daffodil International University, I support programming labs as a PPS Lab Prefect, mentor junior students, and contribute to university programming contests as a problem setter and judging director at DIU ACM Lab.",
  status: "Undergraduate CSE Student at Daffodil International University",
  availability: "Open to learning, building, collaboration, and educational opportunities",
  email: "minhajul.cse.diu@gmail.com",
  location: "Ashulia, Dhaka, Bangladesh",
  institution: "Daffodil International University",
  department: "Department of Computer Science & Engineering",
  degree: "B.Sc. in Computer Science & Engineering",
  graduationYear: "Expected Graduation · 2027",
  cgpa: "3.87",
  cgpaScale: "4.00",
  profiles: {
    codeforces: {
      platform: "Codeforces",
      handle: "NoObMin",
      url: "https://codeforces.com/profile/NoObMin",
      rating: 1432,
      rank: "Specialist",
      rankColor: "#03A89E", // Official Codeforces Specialist Cyan
      rankBadge: "Specialist (Cyan)",
    },
    atcoder: {
      platform: "AtCoder",
      handle: "NoObMin",
      url: "https://atcoder.jp/users/NoObMin",
      rating: 828,
      rank: "Green",
      rankColor: "#008000", // Official AtCoder Green tier (800-1199)
      tier: "Green (800-1199 tier)",
    },
    codechef: {
      platform: "CodeChef",
      handle: "NoObMin",
      url: "https://www.codechef.com/users/NoObMin",
      rating: 1429,
      rank: "Div 3",
      stars: "2-Star / Div 3",
    },
    github: {
      platform: "GitHub",
      handle: "Minhajulcse",
      url: "https://github.com/Minhajulcse",
    },
    linkedin: {
      platform: "LinkedIn",
      handle: "minhajulcse",
      url: "https://www.linkedin.com/in/minhajulcse/",
    },
  },
  resumeUrl: "/resume.pdf",
  quickStats: [
    { label: "Codeforces Rating", value: "1432", sublabel: "Specialist" },
    { label: "AtCoder Rating", value: "828", sublabel: "Green Tier" },
    { label: "Academic CGPA", value: "3.87", sublabel: "out of 4.00" },
    { label: "DIU ACM Lab", value: "2024+", sublabel: "Problem Setter" },
  ],
  experience: [
    {
      title: "Lab Prefect – Programming for Problem Solving (PPS)",
      role: "Lab Prefect",
      organization: "Daffodil International University",
      location: "Ashulia, Dhaka",
      period: "2024 – Present",
      meta: "2024 – Present · Daffodil International University · Ashulia, Dhaka",
      points: [
        "Support the course teacher during lab classes and guide junior students through coding practice.",
        "Teach C and C++ through hints and reasoning rather than direct solutions, helping students build independent problem-solving skills.",
        "Explain recursion, pointers, and other difficult topics with simple examples that are accessible to beginners.",
      ],
    },
    {
      title: "Problem Setter & Associate Judging Director – DIU ACM Lab",
      role: "Problem Setter & Associate Judging Director",
      organization: "Daffodil International University",
      location: "Ashulia, Dhaka",
      period: "2024 – Present",
      meta: "2024 – Present · Daffodil International University · Ashulia, Dhaka",
      points: [
        "Create, test, and review programming contest problems and support contest judging workflows.",
        "Manage the Take-Off Programming Contest for 2nd-semester students and set problems for Unlock the Algorithm.",
        "Contribute to a friendly and active competitive programming culture at DIU through contest preparation and mentoring.",
      ],
    },
    {
      title: "Volunteer – ICPC 2024 Dhaka Regional Contest",
      role: "Contest Operations Volunteer",
      organization: "ICPC Dhaka Regional",
      location: "Bangladesh",
      period: "2024",
      meta: "2024 · ICPC Dhaka Regional · Bangladesh",
      points: [
        "Supported the organization of the regional programming contest as a volunteer and contributed to on-site contest operations.",
      ],
    },
    {
      title: "Volunteer – National High School Programming Contest 2026 Regional Round",
      role: "Regional Round Volunteer",
      organization: "National High School Programming Contest",
      location: "Bangladesh",
      period: "2026",
      meta: "2026 · National High School Programming Contest · Bangladesh",
      points: [
        "Contributed as a volunteer during the regional round, helping support contest activities and the smooth experience of participating students.",
      ],
    },
  ],
  projects: [
    {
      no: "01",
      title: "Routine Hub",
      label: "Personal Project · Full-Stack Developer",
      category: "Full-Stack Web App",
      description:
        "Built a routine-scraping website for the DIU CSE Department that helps students quickly find and view section-wise class routines instead of searching through source routine files manually.",
      tech: ["Next.js", "Web Scraping", "Supabase", "Prisma", "TypeScript"],
      githubUrl: "https://github.com/Minhajulcse",
      highlight: true,
    },
    {
      no: "02",
      title: "Custom Compiler Design",
      label: "Compiler Lab · Team Lead",
      category: "Systems & Compilers",
      description:
        "Guided a team to build a working custom compiler around Context-Free Grammar (CFG) rules, lexical analysis, and core compiler concepts.",
      tech: ["C/C++", "CFG", "Compiler", "Lexical Analysis"],
      githubUrl: "https://github.com/Minhajulcse",
      highlight: true,
    },
    {
      no: "03",
      title: "Hospital Management System",
      label: "DBMS Lab · Team Lead",
      category: "Database Systems",
      description:
        "Built a relational database system using SQL to manage patient records, doctor schedules, medicine prescriptions, and hospital workflows.",
      tech: ["SQL", "Database Design", "Relational Schema"],
      githubUrl: "https://github.com/Minhajulcse",
    },
    {
      no: "04",
      title: "Banking System",
      label: "Data Structure & OOP Labs · Lead Developer",
      category: "Software Engineering",
      description:
        "Built banking software in C for account creation, deposits, and semester-fee payments, then upgraded the same project using Object-Oriented Programming (OOP) principles.",
      tech: ["C", "C++", "OOP", "Data Structures"],
      githubUrl: "https://github.com/Minhajulcse",
    },
    {
      no: "05",
      title: "River Crossing Puzzle Game",
      label: "Personal Project · Game Developer",
      category: "Interactive Application",
      description:
        "Created an interactive river-crossing puzzle game where players solve classic constraint-based challenges through visual characters, move validation, and level progression.",
      tech: ["JavaScript", "Game Logic", "Interactive UI", "HTML5/CSS3"],
      githubUrl: "https://github.com/Minhajulcse",
    },
    {
      no: "06",
      title: "Command Line File Manager",
      label: "Operating Systems Lab · Solo Developer",
      category: "Systems & Tooling",
      description:
        "Created a lightweight file manager that runs completely from the command line using Bash scripting in a POSIX Linux environment.",
      tech: ["Bash", "Linux", "Shell Scripting", "CLI"],
      githubUrl: "https://github.com/Minhajulcse",
    },
  ],
  contests: [
    { name: "ICPC 2025", result: "Dhaka Regional Participant" },
    { name: "NSU IUPC 2026", result: "Onsite Participant" },
    { name: "Unlock The Algorithm 2024", result: "2nd Place · Preliminary / 7th Place · Final" },
    { name: "CodeTrap 2024", result: "4th Place" },
    { name: "Breaking Code 2.0 · MBSTU", result: "9th Place" },
    { name: "Take Off 2023", result: "17th Place" },
  ],
  skillCategories: [
    {
      category: "Programming & Computer Science",
      description: "Core algorithms, data structures, and computer science foundations",
      skills: [
        "C",
        "C++",
        "Python",
        "SQL",
        "Data Structures",
        "Algorithms",
        "Dynamic Programming",
        "Graph Theory",
        "Number Theory",
        "OOP",
        "CFG",
      ],
    },
    {
      category: "Machine Learning & Data Science",
      description: "Model building, deep learning fundamentals, and analytical workflows",
      skills: [
        "Machine Learning",
        "scikit-learn",
        "Neural Networks",
        "Deep Learning",
        "PyTorch",
      ],
    },
    {
      category: "Data & Computing Tools",
      description: "Scientific computing, data manipulation, and Unix environments",
      skills: [
        "NumPy",
        "Pandas",
        "Seaborn",
        "Linux",
        "Bash / Shell",
        "Git",
      ],
    },
    {
      category: "Web & Modern Technologies",
      description: "Web development, databases, and full-stack frameworks",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "Prisma",
        "Tailwind CSS",
        "REST APIs",
      ],
    },
    {
      category: "Productivity & Contest Management",
      description: "Problem setting, contest coordination, and professional tooling",
      skills: [
        "Problem Setting",
        "Contest Judging",
        "GitHub",
        "Microsoft Excel",
        "Microsoft Word",
        "Microsoft PowerPoint",
        "Google Docs",
        "Google Sheets",
        "Google Slides",
      ],
    },
  ],
  achievements: [
    "https://i.imgur.com/6EkztmC.jpeg",
    "https://i.imgur.com/z2eJvXM.jpeg",
    "https://i.imgur.com/gRzFCl2.jpeg",
    "https://i.imgur.com/TuCvCQO.jpeg",
    "https://i.imgur.com/6eYIPaK.jpeg",
    "https://i.imgur.com/xb1cuSx.jpeg",
    "https://i.imgur.com/fNYKSVi.jpeg",
    "https://i.imgur.com/3zrahPq.jpeg",
    "https://i.imgur.com/oVcSNFi.jpeg",
    "https://i.imgur.com/ifxVSh2.jpeg",
    "https://i.imgur.com/eWl43DX.jpeg",
    "https://i.imgur.com/NZ4h4qn.jpeg",
    "/achievements/achievement-13.jpg",
    "/achievements/achievement-14.jpg",
    "/achievements/achievement-15.jpg",
    "/achievements/achievement-16.jpg",
    "/achievements/achievement-17.jpg",
    "/achievements/achievement-18.jpg",
    "/achievements/achievement-19.jpg",
    "/achievements/achievement-20.jpg",
  ],
};
