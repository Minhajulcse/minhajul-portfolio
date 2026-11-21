import Head from "next/head";
import React, { useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { profileData } from "../data/profile";
import { Icon } from "../components/Icons";
import Chatbot from "../components/Chatbot";

interface PortfolioProps {
  currentTheme?: "light" | "dark";
  toggleTheme?: () => void;
  mounted?: boolean;
}

const navItems = [
  ["About", "about"],
  ["Academic", "academic"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Competitive", "competitive"],
  ["Skills", "skills"],
  ["Achievements", "achievements"],
  ["Contact", "contact"],
];

const reveal = (delay = 0, distance = 22) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.16, margin: "-8% 0px -8% 0px" },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Portfolio({ currentTheme = "light", toggleTheme }: PortfolioProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  const achievements = profileData.achievements;
  const isDark = currentTheme === "dark";

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
  }, [galleryOpen, achievements.length]);

  const copyEmail = () => {
    navigator.clipboard.writeText(profileData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Head>
        <title>{profileData.fullName} | Competitive Programmer & CSE Student</title>
        <meta
          name="description"
          content="Official portfolio of Minhajul Islam — CSE student, competitive programmer (Codeforces Specialist 1432, AtCoder Green 828), PPS Lab Prefect, and problem setter at Daffodil International University."
        />
        <meta name="keywords" content="Minhajul Islam, Competitive Programming, Codeforces Specialist, AtCoder, DIU, Daffodil International University, PPS Lab Prefect, Problem Setter, Next.js, Developer Portfolio" />
        <meta name="author" content="Minhajul Islam" />
        <meta property="og:title" content="Minhajul Islam — Competitive Programmer & CSE Student" />
        <meta property="og:description" content="Explore Minhajul's competitive programming journey, academic projects, technical toolkit, and achievements." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content={isDark ? "#090b10" : "#f8fafc"} />
      </Head>

      <div className="portfolio-site" id="home">
        {/* Scroll Progress Indicator */}
        {!reduceMotion && (
          <motion.div className="scroll-progress" style={{ scaleX: scrollScale }} aria-hidden="true" />
        )}

        {/* Site Header & Navigation */}
        <header className="site-header">
          <div className="shell nav-shell">
            <motion.a
              href="#home"
              className="wordmark"
              onClick={() => setMenuOpen(false)}
              aria-label="Minhajul Islam home"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="wordmark-mark">MI</span>
              <span>{profileData.fullName}</span>
            </motion.a>

            <nav className={menuOpen ? "nav-menu open" : "nav-menu"}>
              {navItems.map(([label, href]) => (
                <a key={href} href={`#${href}`} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>
                Let’s talk <Icon name="arrow" size={14} />
              </a>
            </nav>

            <div className="nav-actions">
              {toggleTheme && (
                <button
                  type="button"
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
                  title={`Switch to ${isDark ? "light" : "dark"} theme`}
                >
                  <Icon name={isDark ? "sun" : "moon"} size={18} />
                </button>
              )}
              <button
                type="button"
                className="menu-toggle"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <Icon name={menuOpen ? "close" : "menu"} size={20} />
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="hero shell">
            <motion.div {...reveal(0)} className="hero-copy">
              <div className="eyebrow-row">
                <span className="live-dot" /> {profileData.availability.toUpperCase()}
              </div>
              <h1>
                Competitive programmer.<br />
                <em>CSE student.</em><br />
                Problem solver.
              </h1>
              <p className="hero-lead">
                {profileData.shortBio}
              </p>

              <div className="hero-buttons">
                <a className="btn btn-solid" href="#projects">
                  View selected work <Icon name="arrow" size={16} />
                </a>
                <a className="btn btn-outline" href="#contact">
                  Contact Me
                </a>
                <a className="btn btn-outline" href={profileData.resumeUrl} download>
                  <Icon name="download" size={15} /> Download CV
                </a>
              </div>

              <div className="hero-meta">
                <span>📍 Based in {profileData.location}</span>
                <span>•</span>
                <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
                <span>•</span>
                <a href={profileData.profiles.github.url} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </motion.div>

            <motion.div
              {...reveal(0.08, 28)}
              className="hero-visual"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="portrait-frame">
                <div className="portrait-topline">
                  <span>{profileData.fullName.toUpperCase()}</span>
                  <span>01 / PROFILE</span>
                </div>
                <img
                  src="https://i.imgur.com/lmfwK7x.jpeg"
                  alt={profileData.fullName}
                  className="portrait"
                />
                <div className="portrait-caption">
                  <strong>CSE · DIU</strong>
                  <span>Competitive Programming · Education</span>
                </div>
              </div>

              {/* Stat 1: Codeforces Specialist 1432 */}
              <div className="hero-stat hero-stat-one">
                <span>CF RATING</span>
                <strong>{profileData.profiles.codeforces.rating}</strong>
                <small>Specialist (Cyan)</small>
              </div>

              {/* Stat 2: DIU ACM Lab Problem Setter */}
              <div className="hero-stat hero-stat-two">
                <span>DIU ACM LAB</span>
                <strong>2024+</strong>
                <small>Problem Setter</small>
              </div>

              {/* Stat 3: AtCoder Green 828 */}
              <div className="hero-stat hero-stat-three">
                <span>ATCODER</span>
                <strong>{profileData.profiles.atcoder.rating}</strong>
                <small>Green Tier</small>
              </div>
            </motion.div>
          </section>

          {/* About Section */}
          <section id="about" className="section shell split-section">
            <motion.div {...reveal(0)} className="section-intro">
              <span className="section-number">01</span>
              <div>
                <span className="eyebrow">PROFILE</span>
                <h2>About me</h2>
              </div>
            </motion.div>
            <motion.div {...reveal(0.06)} className="section-body about-body">
              <p className="big-copy">
                I like work that requires both <strong>clear thinking and careful implementation.</strong>
              </p>
              <p>{profileData.extendedBio}</p>

              {/* Bento Grid Stats */}
              <div className="about-stats-grid">
                <div className="about-stat-box">
                  <strong>3.87</strong>
                  <span>CGPA (DIU CSE)</span>
                </div>
                <div className="about-stat-box">
                  <strong>1432</strong>
                  <span>Codeforces Specialist</span>
                </div>
                <div className="about-stat-box">
                  <strong>828</strong>
                  <span>AtCoder (Green)</span>
                </div>
                <div className="about-stat-box">
                  <strong>6+</strong>
                  <span>Lab & Web Projects</span>
                </div>
              </div>

              <div className="inline-links">
                <a href={profileData.profiles.github.url} target="_blank" rel="noreferrer">
                  GitHub <Icon name="external" size={13} />
                </a>
                <a href={profileData.profiles.linkedin.url} target="_blank" rel="noreferrer">
                  LinkedIn <Icon name="external" size={13} />
                </a>
                <a href={profileData.profiles.codeforces.url} target="_blank" rel="noreferrer">
                  Codeforces <Icon name="external" size={13} />
                </a>
                <a href={profileData.profiles.atcoder.url} target="_blank" rel="noreferrer">
                  AtCoder <Icon name="external" size={13} />
                </a>
              </div>
            </motion.div>
          </section>

          {/* Academic / Education Section */}
          <section id="academic" className="section shell split-section section-rule academic-section">
            <motion.div {...reveal(0)} className="section-intro">
              <span className="section-number">02</span>
              <div>
                <span className="eyebrow">ACADEMIC INFORMATION</span>
                <h2>Education</h2>
              </div>
            </motion.div>
            <div className="section-body academic-card-wrap">
              <motion.article
                {...reveal(0.05, 18)}
                className="academic-card"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.24 }}
              >
                <div className="academic-topline">
                  <span className="academic-badge">B.Sc. IN COMPUTER SCIENCE & ENGINEERING</span>
                  <span className="academic-year">{profileData.graduationYear}</span>
                </div>
                <h3>{profileData.institution}</h3>
                <p className="academic-location">{profileData.location}</p>
                <div className="academic-meta-grid">
                  <div>
                    <span>PROGRAM</span>
                    <strong>CSE (Day)</strong>
                  </div>
                  <div>
                    <span>CGPA</span>
                    <strong>{profileData.cgpa} / {profileData.cgpaScale}</strong>
                  </div>
                  <div>
                    <span>STATUS</span>
                    <strong>Current Student</strong>
                  </div>
                </div>
              </motion.article>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="section shell split-section section-rule">
            <motion.div {...reveal(0)} className="section-intro">
              <span className="section-number">03</span>
              <div>
                <span className="eyebrow">ACADEMIC & CONTEST MANAGEMENT</span>
                <h2>Experience</h2>
              </div>
            </motion.div>
            <div className="section-body timeline-clean">
              {profileData.experience.map((item, index) => (
                <motion.article
                  {...reveal(index * 0.04, 18)}
                  className="experience-row"
                  key={item.title}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="experience-index">0{index + 1}</div>
                  <div>
                    <div className="experience-head">
                      <h3>{item.title}</h3>
                      <span>{item.period}</span>
                    </div>
                    <p className="experience-meta">{item.meta}</p>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide">
              <div>
                <span className="section-number">04</span>
                <span className="eyebrow">SELECTED WORK</span>
                <h2>Key academic & software projects</h2>
              </div>
              <p>
                Academic and personal projects where I focused on algorithm implementation, database design, full-stack architectures, and systems programming from scratch.
              </p>
            </motion.div>
            <div className="project-grid">
              {profileData.projects.map((project, index) => (
                <motion.article
                  {...reveal(index * 0.04, 20)}
                  className="project-card"
                  key={project.title}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.22 }}
                >
                  <div>
                    <div className="project-card-header">
                      <span className="project-num">{project.no}</span>
                      <span className="project-category-badge">{project.label}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-card-footer">
                    <div className="project-tech">
                      {project.tech.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    {project.githubUrl && (
                      <div className="project-actions">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="project-action-link"
                        >
                          <Icon name="github" size={14} /> View on GitHub <Icon name="external" size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Competitive Programming Section */}
          <section id="competitive" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide compact-heading">
              <div>
                <span className="section-number">05</span>
                <span className="eyebrow">COMPETITIVE PROGRAMMING</span>
                <h2>Contest profiles & statistics</h2>
              </div>
              <a
                className="text-link"
                href={profileData.profiles.codeforces.url}
                target="_blank"
                rel="noreferrer"
              >
                Open Codeforces profile <Icon name="external" size={14} />
              </a>
            </motion.div>

            {/* Profile Ratings Cards */}
            <div className="profiles-grid">
              {/* Codeforces Card - Specialist 1432 */}
              <motion.a
                {...reveal(0.03, 20)}
                className="profile-card profile-card-codeforces"
                href={profileData.profiles.codeforces.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22 }}
              >
                <div className="profile-card-top">
                  <span className="profile-platform">CODEFORCES</span>
                  <span className="profile-rank-badge rank-badge-specialist">
                    Specialist (Cyan)
                  </span>
                </div>
                <div className="profile-card-mid">
                  <div className="profile-rating-display">
                    <strong>{profileData.profiles.codeforces.rating}</strong>
                    <span className="rating-specialist-title">— Specialist</span>
                  </div>
                </div>
                <div className="profile-card-bottom">
                  <span>Handle: @{profileData.profiles.codeforces.handle}</span>
                  <span>Open profile ↗</span>
                </div>
              </motion.a>

              {/* AtCoder Card - Green 828 */}
              <motion.a
                {...reveal(0.08, 20)}
                className="profile-card profile-card-atcoder"
                href={profileData.profiles.atcoder.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22 }}
              >
                <div className="profile-card-top">
                  <span className="profile-platform">ATCODER</span>
                  <span className="profile-rank-badge rank-badge-green">
                    Green Tier (800–1199)
                  </span>
                </div>
                <div className="profile-card-mid">
                  <div className="profile-rating-display">
                    <strong>{profileData.profiles.atcoder.rating}</strong>
                    <span className="rating-atcoder-tier">— Green</span>
                  </div>
                </div>
                <div className="profile-card-bottom">
                  <span>Handle: @{profileData.profiles.atcoder.handle}</span>
                  <span>Open profile ↗</span>
                </div>
              </motion.a>

              {/* CodeChef Card - 1429 */}
              <motion.a
                {...reveal(0.13, 20)}
                className="profile-card profile-card-codechef"
                href={profileData.profiles.codechef.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22 }}
              >
                <div className="profile-card-top">
                  <span className="profile-platform">CODECHEF</span>
                  <span className="profile-rank-badge rank-badge-neutral">
                    {profileData.profiles.codechef.stars}
                  </span>
                </div>
                <div className="profile-card-mid">
                  <div className="profile-rating-display">
                    <strong>{profileData.profiles.codechef.rating}</strong>
                  </div>
                </div>
                <div className="profile-card-bottom">
                  <span>Handle: @{profileData.profiles.codechef.handle}</span>
                  <span>Open profile ↗</span>
                </div>
              </motion.a>
            </div>

            {/* Contest History Table */}
            <div className="contest-grid">
              <div className="contest-header">
                <h4>Recent Contest Participations & Honors</h4>
                <span className="eyebrow">ICPC & IUPC Rounds</span>
              </div>
              <div className="contest-table">
                {profileData.contests.map((item) => {
                  const isTopPlace =
                    item.result.includes("Place") || item.result.includes("Regional");
                  return (
                    <div className="contest-item" key={item.name}>
                      <div className="contest-item-title">
                        <Icon name="trophy" size={16} />
                        <strong>{item.name}</strong>
                      </div>
                      <span className={`contest-pill ${isTopPlace ? "contest-pill-win" : ""}`}>
                        {item.result}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Technical Skills Section */}
          <section id="skills" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide">
              <div>
                <span className="section-number">06</span>
                <span className="eyebrow">TECHNICAL SKILLS</span>
                <h2>Core toolkit & technologies</h2>
              </div>
              <p>
                The programming languages, algorithm domains, machine learning frameworks, databases, and tooling I use across university labs, contest problem solving, and personal projects.
              </p>
            </motion.div>
            <div className="skills-grid">
              {profileData.skillCategories.map((group) => (
                <motion.div
                  key={group.category}
                  className="skill-group"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="skill-group-head">
                    <Icon name="code" size={18} />
                    <span>{group.category}</span>
                  </div>
                  <p className="skill-group-desc">{group.description}</p>
                  <div className="skill-tags">
                    {group.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Achievements Photo Gallery */}
          <section id="achievements" className="section shell section-rule">
            <motion.div {...reveal(0)} className="section-heading-wide">
              <div>
                <span className="section-number">07</span>
                <span className="eyebrow">MOMENTS & MILESTONES</span>
                <h2>Achievements gallery</h2>
              </div>
              <p>
                Highlights and memories from national programming contests, university ceremonies, and competitive programming events.
              </p>
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
                    <img src={src} alt={`Minhajul Islam Achievement ${i + 1}`} loading="lazy" />
                    <span className="gallery-overlay">
                      <span className="gallery-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="gallery-view">View photo ↗</span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Lightbox Modal */}
            {galleryOpen && (
              <div
                className="gallery-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label="Achievement photo viewer"
                onClick={() => setGalleryOpen(false)}
              >
                <button
                  type="button"
                  className="gallery-close"
                  onClick={() => setGalleryOpen(false)}
                  aria-label="Close photo viewer"
                >
                  <Icon name="close" size={20} />
                </button>
                <button
                  type="button"
                  className="gallery-nav gallery-prev"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImage((value) => (value - 1 + achievements.length) % achievements.length);
                  }}
                  aria-label="Previous photo"
                >
                  ←
                </button>
                <figure className="gallery-lightbox-figure" onClick={(event) => event.stopPropagation()}>
                  <img
                    src={achievements[activeImage]}
                    alt={`Achievement milestone ${activeImage + 1}`}
                  />
                  <figcaption>
                    <span>Achievement {String(activeImage + 1).padStart(2, "0")}</span>
                    <span>
                      {activeImage + 1} / {achievements.length}
                    </span>
                  </figcaption>
                </figure>
                <button
                  type="button"
                  className="gallery-nav gallery-next"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImage((value) => (value + 1) % achievements.length);
                  }}
                  aria-label="Next photo"
                >
                  →
                </button>
              </div>
            )}
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact-band">
            <div className="shell contact-inner">
              <motion.div {...reveal(0)}>
                <span className="eyebrow">08 · CONTACT & COLLABORATION</span>
                <h2>Let’s connect and build something impactful.</h2>
                <p>
                  Available for competitive programming mentoring, academic collaborations, open-source initiatives, and software engineering opportunities.
                </p>
              </motion.div>
              <motion.div {...reveal(0.08)} className="contact-buttons">
                <a className="btn btn-light" href={`mailto:${profileData.email}`}>
                  <Icon name="mail" size={16} /> Email me
                </a>
                <button type="button" className="btn btn-dark-outline" onClick={copyEmail}>
                  <Icon name={copiedEmail ? "check" : "copy"} size={16} />
                  {copiedEmail ? "Email Copied!" : "Copy Email"}
                </button>
                <a
                  className="btn btn-dark-outline"
                  href={profileData.profiles.github.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="github" size={16} /> GitHub
                </a>
                <a
                  className="btn btn-dark-outline"
                  href={profileData.profiles.linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="linkedin" size={16} /> LinkedIn
                </a>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Site Footer */}
        <footer className="site-footer shell">
          <span>© 2026 {profileData.fullName} · {profileData.institution} · {profileData.location}</span>
          <div className="footer-links">
            <a href="#home">Back to top ↑</a>
            <span>•</span>
            <a href={profileData.profiles.codeforces.url} target="_blank" rel="noreferrer">
              Codeforces (1432 Specialist)
            </a>
            <span>•</span>
            <a href={profileData.profiles.atcoder.url} target="_blank" rel="noreferrer">
              AtCoder (828 Green)
            </a>
          </div>
        </footer>

        {/* AI-Powered Portfolio Assistant */}
        <Chatbot />
      </div>
    </MotionConfig>
  );
}
