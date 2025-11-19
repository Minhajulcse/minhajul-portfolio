import React from "react";
import { motion } from "framer-motion";

export default function Portfolio(): JSX.Element {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay }
  });

  const achievements = [
    'https://i.imgur.com/6EkztmC.jpeg',
    'https://i.imgur.com/z2eJvXM.jpeg',
    'https://i.imgur.com/gRzFCl2.jpeg',
    'https://i.imgur.com/TuCvCQO.jpeg',
    'https://i.imgur.com/6eYIPaK.jpeg',
    'https://i.imgur.com/xb1cuSx.jpeg',
    'https://i.imgur.com/fNYKSVi.jpeg',
    'https://i.imgur.com/3zrahPq.jpeg',
    'https://i.imgur.com/oVcSNFi.jpeg',
    'https://i.imgur.com/ifxVSh2.jpeg',
    'https://i.imgur.com/eWl43DX.jpeg',
    'https://i.imgur.com/NZ4h4qn.jpeg'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* -------- NAVBAR -------- */}
        <nav className="flex items-center justify-between mb-10">
          <div className="text-xl font-bold text-indigo-600">Minhajul Islam</div>
          <div className="hidden md:flex gap-6 text-sm text-gray-600">
            <a href="#home" className="hover:text-indigo-700">Home</a>
            <a href="#projects" className="hover:text-indigo-700">Projects</a>
            <a href="#competitive" className="hover:text-indigo-700">Competitive</a>
            <a href="#achievements" className="hover:text-indigo-700">Gallery</a>
            <a href="#cv" className="hover:text-indigo-700">Resume</a>
            <a href="#about" className="hover:text-indigo-700">About</a>
            <a href="#contact" className="hover:text-indigo-700">Contact</a>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* -------- LEFT SIDEBAR -------- */}
          <motion.aside {...fadeUp(0.05)} className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
            <img src="https://i.imgur.com/lmfwK7x.jpeg" className="w-44 h-44 rounded-full ring-4 ring-white shadow-lg hover:scale-105 transition" />

            <h2 className="mt-4 text-2xl font-bold text-gray-800">Minhajul Islam</h2>
            <p className="text-sm text-gray-600 mt-1 text-center">CSE Student • Competitive Programmer • Educator</p>

            <p className="mt-4 text-center text-gray-700 text-sm">
              Passionate about software development, competitive programming, and teaching. I create Bangla educational content and mentor juniors.
            </p>

            <div className="mt-6 flex flex-col gap-3 w-full">
              <a href="/resume.pdf" download className="bg-indigo-600 text-white text-center py-2 rounded-lg font-semibold shadow hover:scale-105">📄 Download CV</a>
              <a href="https://codeforces.com/profile/NoObMin" target="_blank" className="border border-indigo-200 text-indigo-600 text-center py-2 rounded-lg hover:bg-indigo-50">🏅 Codeforces</a>
            </div>

            <div className="mt-6 text-sm w-full text-gray-700">
              <p className="font-medium">Contact</p>
              <p>Email: minhajul.cse.diu@gmail.com</p>
              <p>Phone: +880-1859-695000</p>
              <div className="mt-3 flex justify-center gap-4 text-indigo-600">
                <a href="https://www.linkedin.com/in/minhajulcse/" target="_blank">LinkedIn</a>
                <a href="https://github.com/Minhajulcse" target="_blank">GitHub</a>
              </div>
            </div>
          </motion.aside>

          {/* -------- MAIN CONTENT -------- */}
          <main className="lg:col-span-2 space-y-10">

            {/* -------- HERO -------- */}
            <motion.section {...fadeUp(0.1)} id="home" className="bg-gradient-to-r from-indigo-600 to-green-500 text-white p-8 rounded-2xl shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold">Hi, I'm Minhajul</h1>
              <p className="mt-3 text-lg max-w-xl">I build software, solve algorithmic problems, and create Bangla programming tutorials.</p>

              <div className="mt-6 flex gap-3 flex-wrap">
                <a href="#projects" className="bg-white/10 px-4 py-2 rounded border border-white/20">View Projects</a>
                <a href="#achievements" className="bg-white/10 px-4 py-2 rounded border border-white/20">See Achievements</a>
              </div>
            </motion.section>

            {/* -------- PROJECTS -------- */}
            <motion.section {...fadeUp(0.15)} id="projects" className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Projects</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg shadow hover:scale-105 transition">
                  <h4 className="font-bold text-indigo-600">💰 Banking System</h4>
                  <p className="text-sm mt-2">Java-based OOP system with accounts, transactions & history.</p>
                  <p className="text-xs mt-2 text-gray-500">Tech: Java, MySQL</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow hover:scale-105 transition">
                  <h4 className="font-bold text-indigo-600">🏥 Hospital Management</h4>
                  <p className="text-sm mt-2">3NF database + Java system for managing hospital operations.</p>
                  <p className="text-xs mt-2 text-gray-500">Tech: SQL, Java</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow hover:scale-105 transition">
                  <h4 className="font-bold text-indigo-600">💬 Messaging Website</h4>
                  <p className="text-sm mt-2">React + Java real-time messaging with photo upload.</p>
                  <p className="text-xs mt-2 text-gray-500">Tech: React, Java, MySQL</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow hover:scale-105 transition">
                  <h4 className="font-bold text-indigo-600">✨ Algorithm Roadmap</h4>
                  <p className="text-sm mt-2">DP & Graph theory learning path.</p>
                </div>
              </div>
            </motion.section>

            {/* -------- COMPETITIVE PROGRAMMING -------- */}
            <motion.section {...fadeUp(0.2)} id="competitive" className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800">Competitive Programming</h3>

              <ul className="list-disc pl-5 text-gray-700 mt-3 space-y-1">
                <li>Problem Setter at DIU ACM Lab (since 2024)</li>
                <li>Specialist on Codeforces — Rating: <b>1294</b></li>
                <li>Skills: Algorithms, DP, Graphs, C/C++, Java</li>
              </ul>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border-l-4 border-orange-500 bg-white shadow rounded">
                  <h4 className="font-semibold text-orange-600">Unlock The Algorithm 2024</h4>
                  <p className="text-sm">Preliminary: 2nd • Final: 7th</p>
                </div>

                <div className="p-3 border-l-4 border-blue-500 bg-white shadow rounded">
                  <h4 className="font-semibold text-blue-600">Take Off 2023</h4>
                  <p className="text-sm">17th Place</p>
                </div>

                <div className="p-3 border-l-4 border-green-500 bg-white shadow rounded">
                  <h4 className="font-semibold text-green-600">CodeTrap 2024</h4>
                  <p className="text-sm">4th Place</p>
                </div>

              </div>
            </motion.section>

            {/* -------- ACHIEVEMENTS GALLERY -------- */}
            <motion.section {...fadeUp(0.25)} id="achievements" className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Achievements Gallery</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {achievements.map((src, i) => (
                  <a key={i} href={src} target="_blank">
                    <img src={src} className="rounded-lg shadow hover:scale-110 transition object-cover h-40 w-full" />
                  </a>
                ))}
              </div>
            </motion.section>

            {/* -------- RESUME SUMMARY -------- */}
            <motion.section {...fadeUp(0.3)} id="cv" className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Resume Summary</h3>
              <p>CSE Student — DIU (CGPA: 3.89)</p>
              <ul className="list-disc pl-5 text-gray-700 mt-3">
                <li>Programming: Java, C/C++, Python</li>
                <li>Web: React, SQL, MySQL</li>
                <li>Topics: Algorithms, DP, Graphs</li>
                <li>Problem Setter at DIU ACM Lab</li>
                <li>ICPC Volunteer 2024</li>
              </ul>
            </motion.section>

            {/* -------- ABOUT ME -------- */}
            <motion.section {...fadeUp(0.35)} id="about" className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold">About Me</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                I am Minhajul Islam, a passionate CSE student and programmer with a deep interest in
                software development, algorithms, and competitive programming.  
                I love solving challenging problems, building practical projects, and teaching others.
                I also enjoy chess which improves focus and strategy.
                I believe in continuous learning and helping others grow.
              </p>
              <p className="mt-4 font-semibold text-indigo-700 text-lg italic">
                “Code. Learn. Teach. Inspire.” — Minhajul Islam
              </p>
            </motion.section>

            {/* -------- CONTACT -------- */}
            <motion.section {...fadeUp(0.4)} id="contact" className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold">Contact Me</h3>
              <p className="text-gray-700 mt-2">Reach out for collaboration or mentorship.</p>
              <p className="mt-3"><b>Email:</b> minhajul.cse.diu@gmail.com</p>
              <p><b>Phone:</b> +880-1859-695000</p>
              <div className="mt-4 flex gap-4 text-indigo-600">
                <a href="https://www.linkedin.com/in/minhajulcse/" target="_blank">LinkedIn</a>
                <a href="https://github.com/Minhajulcse" target="_blank">GitHub</a>
                <a href="https://codeforces.com/profile/NoObMin" target="_blank">Codeforces</a>
              </div>
            </motion.section>

          </main>
        </div>

        <footer className="mt-10 text-center text-sm text-gray-500">
          © 2025 Minhajul Islam — Portfolio
        </footer>

      </div>
    </div>
  );
}
