import Head from "next/head";
import React, { useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

const achievements = [
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
];

const navItems = [
  ["About", "about"],
  ["Academic", "academic"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Achievements", "competitive"],
  ["Contact", "contact"],
];

const experience = [
  {
    title: "Lab Prefect – Programming for Problem Solving (PPS)",
    meta: "2024 – Present · Daffodil International University · Ashulia, Dhaka",
    period: "2024 – Present",
    points: [
      "Support the course teacher during lab classes and guide junior students through coding practice.",
      "Teach C and C++ through hints and reasoning rather than direct solutions, helping students build independent problem-solving skills.",
      "Explain recursion, pointers, and other difficult topics with simple examples that are accessible to beginners.",
    ],
  },
  {
    title: "Problem Setter & Associate Judging Director – DIU ACM Lab",
    meta: "2024 – Present · Daffodil International University · Ashulia, Dhaka",
    period: "2024 – Present",
    points: [
      "Create, test, and review programming contest problems and support contest judging workflows.",
      "Manage the Take-Off Programming Contest for 2nd-semester students and set problems for Unlock the Algorithm.",
      "Contribute to a friendly and active competitive programming culture at DIU through contest preparation and mentoring.",
    ],
  },
  {
    title: "Volunteer – ICPC 2024 Dhaka Regional Contest",
    meta: "2024 · ICPC Dhaka Regional · Bangladesh",
    period: "2024",
    points: [
      "Supported the organization of the regional programming contest as a volunteer and contributed to on-site contest operations.",
    ],
  },
  {
    title: "Volunteer – National High School Programming Contest 2026 Regional Round",
    meta: "2026 · National High School Programming Contest · Bangladesh",
    period: "2026",
    points: [
      "Contributed as a volunteer during the regional round, helping support contest activities and the smooth experience of participating students.",
    ],
  },
];

const projects = [
  {
    no: "01",
    title: "Hospital Management System",
    label: "DBMS Lab · Team Lead",
    description:
      "Built a local database system using SQL to manage patient records, doctor schedules, and medicine prescriptions.",
    tech: ["SQL", "Database Design"],
  },
  {
    no: "02",
    title: "Custom Compiler Design",
    label: "Compiler Lab · Team Lead",
    description:
      "Guided a team to build a working custom compiler around Context-Free Grammar (CFG) rules and compiler concepts.",
    tech: ["C/C++", "CFG", "Compiler"],
  },
  {
    no: "03",
    title: "Command Line File Manager",
    label: "Operating Systems Lab · Solo Developer",
    description:
      "Created a file manager that runs completely from the command line using Bash scripting in a Linux environment.",
    tech: ["Bash", "Linux", "Shell"],
  },
  {
    no: "04",
    title: "Banking System",
    label: "Data Structure & OOP Labs · Lead Developer",
    description:
      "Built banking software in C for account creation, deposits, and semester-fee payments, then upgraded the same project with OOP concepts.",
    tech: ["C", "OOP", "Data Structures"],
  },
  {
    no: "05",
    title: "Routine Hub",
    label: "Personal Project · Full-Stack Developer",
    description:
      "Built a routine-scraping website for the DIU CSE Department that helps students quickly find and view section-wise class routines instead of searching through source routine files manually.",
    tech: ["Next.js", "Web Scraping", "Supabase", "Prisma"],
  },
  {
    no: "06",
    title: "River Crossing Puzzle Game",
    label: "Personal Project · Game Developer",
    description:
      "Created an interactive river-crossing puzzle game where players solve classic constraint-based challenges through visual characters, move validation, and level progression.",
    tech: ["JavaScript", "Game Logic", "Interactive UI"],
  },
];

const contests = [
  ["ICPC 2025", "Dhaka Regional Participant"],
  ["NSU IUPC 2026", "Onsite Participant"],
  ["Unlock The Algorithm 2024", "2nd Place · Preliminary / 7th Place · Final"],
  ["CodeTrap 2024", "4th Place"],
  ["Breaking Code 2.0 · MBSTU", "9th Place"],
  ["Take Off 2023", "17th Place"],
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    github: <><path d="M9 19c-4 .9-4-2-5-2m10 5v-3.9c0-1.1-.4-1.9-1.1-2.5 3.6-.4 7.3-1.8 7.3-8A6.2 6.2 0 0 0 18.5 3c-.4-1-1.2-1-2.7-.3-1.4-.4-2.9-.4-4.3 0C10 .9 9.2.9 8.8 1.9A6.2 6.2 0 0 0 7.1 6c0 6.2 3.7 7.6 7.3 8-.7.6-1.1 1.5-1.1 2.5V22" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7.1v.1M12 17v-4a3 3 0 0 1 6 0v4M12 10v7" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20.5 15.5A8 8 0 0 1 8.5 3.5a8.4 8.4 0 1 0 12 12Z" />,
    external: <><path d="M14 4h6v6" /><path d="m10 14 10-10" /><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const reveal = (delay = 0, distance = 22) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.16, margin: "-8% 0px -8% 0px" },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Portfolio(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    setDark(saved === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!galleryOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGalleryOpen(false);
      if (event.key === "ArrowRight") setActiveImage((value) => (value + 1) % achievements.length);
      if (event.key === "ArrowLeft") setActiveImage((value) => (value - 1 + achievements.length) % achievements.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [galleryOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <Head>
        <title>Minhajul Islam | CSE Student & Competitive Programmer</title>
        <meta name="description" content="Official portfolio of Minhajul Islam — CSE student, competitive programmer, educator, problem setter, and developer at Daffodil International University." />
        <meta name="theme-color" content="#f7f8fb" />
      </Head>

      <div className="portfolio-site" id="home">
        {!reduceMotion && (
          <motion.div className="scroll-progress" style={{ scaleX: scrollScale }} aria-hidden="true" />
        )}
        <header className="site-header">
          <div className="shell nav-shell">
            <motion.a href="#home" className="wordmark" onClick={() => setMenuOpen(false)} aria-label="Minhajul Islam home" whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <span className="wordmark-mark">MI</span>
              <span>Minhajul Islam</span>
            </motion.a>

            <nav className={menuOpen ? "nav-menu open" : "nav-menu"}>
              {navItems.map(([label, href]) => (
                <a key={href} href={`#${href}`} onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
              <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <Icon name="arrow" size={15} /></a>
            </nav>

            <div className="nav-actions">
              <button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label="Toggle color theme">
                <Icon name={dark ? "sun" : "moon"} size={17} />
              </button>
              <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
                <Icon name={menuOpen ? "close" : "menu"} size={20} />
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="hero shell">
            <motion.div {...reveal(0)} className="hero-copy">
              <div className="eyebrow-row"><span className="live-dot" /> OPEN TO LEARNING, BUILDING & COLLABORATION</div>
              <h1>Competitive programmer.<br /><em>CSE student.</em><br />Problem solver.</h1>
              <p className="hero-lead">
                I am Minhajul Islam, a Computer Science student at Daffodil International University. I enjoy algorithms, practical software projects, programming education, and turning difficult problems into clear solutions.
              </p>

              <div className="hero-buttons">
                <a className="btn btn-solid" href="#projects">View selected work <Icon name="arrow" size={16} /></a>
                <a className="btn btn-outline" href="/resume.pdf" download>Download CV</a>
              </div>

              <div className="hero-meta">
                <span>Based in Dhaka, Bangladesh</span>
                <span>•</span>
                <a href="mailto:minhajul.cse.diu@gmail.com">minhajul.cse.diu@gmail.com</a>
              </div>
            </motion.div>

            <motion.div {...reveal(0.08, 28)} className="hero-visual" whileHover={{ y: -4 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <div className="portrait-frame">
                <div className="portrait-topline"><span>MINHAJUL ISLAM</span><span>01 / PROFILE</span></div>
                <img src="https://i.imgur.com/lmfwK7x.jpeg" alt="Minhajul Islam" className="portrait" />
                <div className="portrait-caption"><strong>CSE · DIU</strong><span>Competitive Programming · Education</span></div>
              </div>
              <div className="hero-stat hero-stat-one"><span>CF RATING</span><strong>1432</strong><small>Specialist</small></div>
              <div className="hero-stat hero-stat-two"><span>DIU ACM LAB</span><strong>2024+</strong><small>Problem Setter</small></div>
            </motion.div>
          </section>

          <section id="about" className="section shell split-section">
            <motion.div {...reveal(0)} className="section-intro">
              <span className="section-number">01</span>
              <div><span className="eyebrow">PROFILE</span><h2>About me</h2></div>
            </motion.div>
            <motion.div {...reveal(0.06)} className="section-body about-body">
              <p className="big-copy">I like work that requires both <strong>clear thinking and careful implementation.</strong></p>
              <p>I focus on competitive programming, algorithms, and practical academic software projects. Alongside my studies, I support programming labs, mentor junior students, and contribute to university programming contests as a problem setter and judging director.</p>
              <div className="inline-links">
                <a href="https://github.com/Minhajulcse" target="_blank" rel="noreferrer">GitHub <Icon name="external" size={14} /></a>
                <a href="https://www.linkedin.com/in/minhajulcse/" target="_blank" rel="noreferrer">LinkedIn <Icon name="external" size={14} /></a>
                <a href="https://codeforces.com/profile/NoObMin" target="_blank" rel="noreferrer">Codeforces <Icon name="external" size={14} /></a>
              </div>
            </motion.div>
          </section>

          <section id="academic" className="section shell split-section section-rule academic-section">
            <motion.div {...reveal(0)} className="section-intro">
              <span className="section-number">02</span>
              <div><span className="eyebrow">ACADEMIC INFORMATION</span><h2>Education</h2></div>
            </motion.div>
            <div className="section-body academic-card-wrap">
              <motion.article {...reveal(0.05, 18)} className="academic-card" whileHover={{ y: -5 }} transition={{ duration: 0.24 }}>
                <div className="academic-topline">
                  <span className="academic-badge">B.Sc. IN COMPUTER SCIENCE & ENGINEERING</span>
                  <span className="academic-year">Expected Graduation · 2027</span>
                </div>
                <h3>Daffodil International University</h3>
                <p className="academic-location">Dhaka, Bangladesh</p>
                <div className="academic-meta-grid">
                  <div><span>PROGRAM</span><strong>CSE</strong></div>
                  <div><span>CGPA</span><strong>3.87 / 4.00</strong></div>
                  <div><span>STATUS</span><strong>Current Student</strong></div>
                </div>
              </motion.article>
            </div>
          </section>

          <section id="experience" className="section shell split-section section-rule">
            <motion.div {...reveal(0)} className="section-intro">
              <span className="section-number">03</span>
              <div><span className="eyebrow">ACADEMIC & CONTEST MANAGEMENT</span><h2>Experience</h2></div>
            </motion.div>
            <div className="section-body timeline-clean">
              {experience.map((item, index) => (
                <motion.article {...reveal(index * 0.04, 18)} className="experience-row" key={item.title} whileHover={{ x: 5 }} transition={{ duration: 0.24 }}>
                  <div className="experience-index">0{index + 1}</div>
                  <div>
                    <div className="experience-head"><h3>{item.title}</h3><span>{item.period}</span></div>
                    <p className="experience-meta">{item.meta}</p>
                    <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section id="projects" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide">
              <div><span className="section-number">04</span><span className="eyebrow">SELECTED WORK</span><h2>Key academic projects</h2></div>
              <p>Academic projects where I focused on implementation, teamwork, and understanding systems from the ground up.</p>
            </motion.div>
            <div className="project-list">
              {projects.map((project, index) => (
                <motion.article {...reveal(index * 0.03, 20)} className="project-row" key={project.title} whileHover={{ x: 6 }} transition={{ duration: 0.24 }}>
                  <span className="project-no">{project.no}</span>
                  <div className="project-main"><span className="project-label">{project.label}</span><h3>{project.title}</h3><p>{project.description}</p></div>
                  <div className="project-tech">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
                </motion.article>
              ))}
            </div>
          </section>

          <section id="competitive" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide compact-heading">
              <div><span className="section-number">05</span><span className="eyebrow">COMPETITIVE PROGRAMMING</span><h2>Contest profile</h2></div>
              <a className="text-link" href="https://codeforces.com/profile/NoObMin" target="_blank" rel="noreferrer">Open Codeforces profile <Icon name="external" size={14} /></a>
            </motion.div>
            <div className="profiles-grid">
              <motion.a {...reveal(0.03, 20)} className="profile-card profile-card-featured" href="https://codeforces.com/profile/NoObMin" target="_blank" rel="noreferrer" whileHover={{ y: -7, scale: 1.01 }} transition={{ duration: 0.24 }}>
                <span className="profile-platform">CODEFORCES</span><strong>1432</strong><em>Specialist</em><small>Open profile ↗</small>
              </motion.a>
              <motion.a {...reveal(0.08, 20)} className="profile-card" href="https://www.codechef.com/users/NoObMin" target="_blank" rel="noreferrer" whileHover={{ y: -7, scale: 1.01 }} transition={{ duration: 0.24 }}>
                <span className="profile-platform">CODECHEF</span><strong>1429</strong><em>NoObMin</em><small>Open profile ↗</small>
              </motion.a>
              <motion.a {...reveal(0.13, 20)} className="profile-card" href="https://atcoder.jp/users/NoObMin" target="_blank" rel="noreferrer" whileHover={{ y: -7, scale: 1.01 }} transition={{ duration: 0.24 }}>
                <span className="profile-platform">ATCODER</span><strong>780</strong><em>NoObMin</em><small>Open profile ↗</small>
              </motion.a>
            </div>
            <div className="contest-grid">
              <div className="contest-table">
                {contests.map(([name, result]) => (
                  <div className="contest-item" key={name}><strong>{name}</strong><span>{result}</span></div>
                ))}
              </div>
            </div>
          </section>

          <section className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide">
              <div><span className="section-number">06</span><span className="eyebrow">TECHNICAL SKILLS</span><h2>Core toolkit</h2></div>
              <p>The languages, algorithms, machine learning tools, data libraries, and productivity software I use across coursework, contests, and personal projects.</p>
            </motion.div>
            <div className="skills-grid">
              <motion.div className="skill-group" whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
                <span>PROGRAMMING & COMPUTER SCIENCE</span>
                <div className="skill-tags">
                  {['C', 'C++', 'Python', 'SQL', 'Data Structures', 'Algorithms', 'Dynamic Programming', 'Graph Theory', 'Number Theory', 'OOP', 'CFG'].map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </motion.div>
              <motion.div className="skill-group" whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
                <span>MACHINE LEARNING & DATA SCIENCE</span>
                <div className="skill-tags">
                  {['Machine Learning', 'scikit-learn', 'Neural Networks', 'Deep Learning', 'PyTorch'].map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </motion.div>
              <motion.div className="skill-group" whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
                <span>DATA & COMPUTING TOOLS</span>
                <div className="skill-tags">
                  {['NumPy', 'Pandas', 'Seaborn'].map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </motion.div>
              <motion.div className="skill-group" whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
                <span>PRODUCTIVITY & DOCUMENTATION</span>
                <div className="skill-tags">
                  {['Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint', 'Google Docs', 'Google Sheets', 'Google Slides', 'GitHub'].map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </motion.div>
            </div>
          </section>

          <section id="achievements" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide">
              <div><span className="section-number">07</span><span className="eyebrow">MOMENTS & MILESTONES</span><h2>Achievements gallery</h2></div>
            </motion.div>
            <div className="gallery-clean">
              {achievements.map((src, i) => (
                <motion.button
                  key={src}
                  type="button"
                  className="gallery-card"
                  onClick={() => {
                    setActiveImage(i);
                    setGalleryOpen(true);
                  }}
                  aria-label={`Open achievement photo ${i + 1}`}
                  {...reveal((i % 4) * 0.04, 18)}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="gallery-image-wrap">
                    <img src={src} alt={`Achievement ${i + 1}`} loading="lazy" />
                    <span className="gallery-overlay">
                      <span className="gallery-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="gallery-view">View photo ↗</span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>

            {galleryOpen && (
              <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Achievement photo viewer" onClick={() => setGalleryOpen(false)}>
                <button type="button" className="gallery-close" onClick={() => setGalleryOpen(false)} aria-label="Close photo viewer"><Icon name="close" size={21} /></button>
                <button type="button" className="gallery-nav gallery-prev" onClick={(event) => { event.stopPropagation(); setActiveImage((value) => (value - 1 + achievements.length) % achievements.length); }} aria-label="Previous photo">←</button>
                <figure className="gallery-lightbox-figure" onClick={(event) => event.stopPropagation()}>
                  <img src={achievements[activeImage]} alt={`Achievement ${activeImage + 1}`} />
                  <figcaption><span>Achievement {String(activeImage + 1).padStart(2, "0")}</span><span>{activeImage + 1} / {achievements.length}</span></figcaption>
                </figure>
                <button type="button" className="gallery-nav gallery-next" onClick={(event) => { event.stopPropagation(); setActiveImage((value) => (value + 1) % achievements.length); }} aria-label="Next photo">→</button>
              </div>
            )}
          </section>

          <section id="contact" className="contact-band">
            <div className="shell contact-inner">
              <motion.div {...reveal(0)}><span className="eyebrow">08 · CONTACT</span><h2>Let’s connect and build something useful.</h2><p>For collaboration, programming education, project discussions, or other professional opportunities.</p></motion.div>
              <motion.div {...reveal(0.08)} className="contact-buttons"><a className="btn btn-light" href="mailto:minhajul.cse.diu@gmail.com"><Icon name="mail" size={16} /> Email me</a><a className="btn btn-dark-outline" href="https://github.com/Minhajulcse" target="_blank" rel="noreferrer"><Icon name="github" size={16} /> GitHub</a></motion.div>
            </div>
          </section>
        </main>

        <footer className="site-footer shell">
          <span>© 2026 Minhajul Islam</span>
          <span>Daffodil International University · Dhaka, Bangladesh</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
