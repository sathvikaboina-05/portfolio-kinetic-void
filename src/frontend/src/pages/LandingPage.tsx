import ParticleCanvas from "@/components/portfolio/ParticleCanvas";
import PolyhedronScene from "@/components/portfolio/PolyhedronScene";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiGithub, SiInstagram, SiLinkedin } from "react-icons/si";

// ─── Debris Shard Component ──────────────────────────────────────────────────
function DebrisShards() {
  const shards = [
    {
      style: {
        top: "12%",
        left: "5%",
        width: 60,
        height: 60,
        animationName: "float-shard-1",
        animationDuration: "9s",
        animationDelay: "0s",
      },
      clip: "polygon(50% 0%, 100% 100%, 0% 100%)",
    },
    {
      style: {
        top: "25%",
        right: "8%",
        width: 45,
        height: 45,
        animationName: "float-shard-2",
        animationDuration: "12s",
        animationDelay: "2s",
      },
      clip: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    },
    {
      style: {
        top: "55%",
        left: "2%",
        width: 35,
        height: 35,
        animationName: "float-shard-3",
        animationDuration: "15s",
        animationDelay: "1s",
      },
      clip: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    },
    {
      style: {
        top: "70%",
        right: "5%",
        width: 55,
        height: 55,
        animationName: "float-shard-4",
        animationDuration: "11s",
        animationDelay: "3s",
      },
      clip: "polygon(50% 0%, 100% 100%, 0% 100%)",
    },
    {
      style: {
        top: "40%",
        left: "92%",
        width: 28,
        height: 28,
        animationName: "float-shard-5",
        animationDuration: "8s",
        animationDelay: "1.5s",
      },
      clip: "polygon(0% 0%, 100% 0%, 100% 100%)",
    },
    {
      style: {
        top: "80%",
        left: "15%",
        width: 40,
        height: 40,
        animationName: "float-shard-2",
        animationDuration: "13s",
        animationDelay: "4s",
      },
      clip: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    },
    {
      style: {
        top: "8%",
        right: "20%",
        width: 25,
        height: 25,
        animationName: "float-shard-1",
        animationDuration: "7s",
        animationDelay: "0.5s",
      },
      clip: "polygon(0% 0%, 100% 0%, 100% 100%)",
    },
  ];

  const colors = [
    "#2FE6FF",
    "#FF3BD4",
    "#7B4DFF",
    "#2DFFB3",
    "#2FE6FF",
    "#FF3BD4",
    "#7B4DFF",
  ];

  return (
    <>
      {shards.map((shard, i) => (
        <div
          key={shard.clip}
          style={{
            position: "fixed",
            ...shard.style,
            clipPath: shard.clip,
            background: `linear-gradient(135deg, ${colors[i]}22, ${colors[i]}08)`,
            border: `1px solid ${colors[i]}30`,
            zIndex: 2,
            animationName: shard.style.animationName,
            animationDuration: shard.style.animationDuration,
            animationDelay: shard.style.animationDelay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </>
  );
}

// ─── Animated Stats Counter ──────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
}: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Section Fade-In Wrapper ─────────────────────────────────────────────────
function FadeInSection({
  children,
  delay = 0,
  className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Project Cards Data ───────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "QUANTUM SHIFT",
    descriptor: "Temporal displacement visualizer",
    tag: "INTERACTIVE",
    cta: "EXPERIENCE",
    color: "#2FE6FF",
    hoverClass: "",
    gradientClass: "holo-gradient-cyan",
    lines: [
      { x1: "10%", y1: "30%", x2: "90%", y2: "70%" },
      { x1: "50%", y1: "10%", x2: "50%", y2: "90%" },
      { x1: "10%", y1: "70%", x2: "90%", y2: "30%" },
    ],
  },
  {
    id: 2,
    title: "GLITCH ODYSSEY",
    descriptor: "Reality fragmentation engine",
    tag: "EXPERIMENTAL",
    cta: "VIEW",
    color: "#FF3BD4",
    hoverClass: "neon-card-magenta",
    gradientClass: "holo-gradient-magenta",
    lines: [
      { x1: "20%", y1: "20%", x2: "80%", y2: "80%" },
      { x1: "80%", y1: "20%", x2: "20%", y2: "80%" },
      { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
    ],
  },
  {
    id: 3,
    title: "CYBERNETIC DREAMS",
    descriptor: "Neural mesh interface",
    tag: "IMMERSIVE",
    cta: "EXPLORE",
    color: "#2DFFB3",
    hoverClass: "neon-card-green",
    gradientClass: "holo-gradient-green",
    lines: [
      { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
      { x1: "25%", y1: "0%", x2: "75%", y2: "100%" },
      { x1: "75%", y1: "0%", x2: "25%", y2: "100%" },
    ],
  },
  {
    id: 4,
    title: "NEON AWAKENING",
    descriptor: "Chromatic consciousness portal",
    tag: "SPATIAL",
    cta: "DISCOVER",
    color: "#7B4DFF",
    hoverClass: "neon-card-violet",
    gradientClass: "holo-gradient-violet",
    lines: [
      { x1: "10%", y1: "10%", x2: "90%", y2: "90%" },
      { x1: "90%", y1: "10%", x2: "10%", y2: "90%" },
      { x1: "50%", y1: "20%", x2: "50%", y2: "80%" },
    ],
  },
];

// ─── Method Data ──────────────────────────────────────────────────────────────
const METHODS = [
  {
    id: 1,
    icon: "⬡",
    title: "CREATIVE ENGINEERING",
    description:
      "Bridging the gap between raw technical capability and visceral human experience. Every pixel, every frame, every interaction is engineered with intent.",
    accent: "#2FE6FF",
  },
  {
    id: 2,
    icon: "◈",
    title: "INTERACTIVE NARRATIVES",
    description:
      "Crafting stories that breathe and respond. Worlds where the audience becomes the protagonist, and data transforms into emotional resonance.",
    accent: "#FF3BD4",
  },
  {
    id: 3,
    icon: "⊹",
    title: "FUTURE-PROOFING IDEAS",
    description:
      "Building on the bleeding edge of the web. WebGL, WASM, AI-driven interfaces — technologies that don't just keep pace with tomorrow but define it.",
    accent: "#2DFFB3",
  },
];

// ─── Nav Component ────────────────────────────────────────────────────────────
function Nav({ activeSection }: { activeSection: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 2rem",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(6, 8, 19, 0.92)" : "rgba(6, 8, 19, 0.4)",
        borderBottom: scrolled ? "1px solid rgba(47, 230, 255, 0.12)" : "none",
        backdropFilter: "blur(20px)",
        transition: "all 0.4s",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="kv-badge" data-ocid="nav.logo">
          KV
        </div>
        <span
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: "rgba(242,245,255,0.9)",
          }}
        >
          KINETIC VOID
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["hero", "explorations", "method", "contact"].map((section, i) => {
          const labels = ["WORK", "EXPERIENCE", "ABOUT", "CONTACT"];
          return (
            <button
              type="button"
              key={section}
              onClick={() => scrollTo(section)}
              className={`nav-link ${activeSection === section ? "nav-link-active" : ""}`}
              data-ocid={`nav.${section}.link`}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {labels[i]}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        className="connect-btn"
        data-ocid="nav.connect.button"
        onClick={() => scrollTo("contact")}
      >
        CONNECT
      </button>
    </motion.nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "0 5%",
      }}
    >
      {/* Radial background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "10%",
          transform: "translate(0, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(47,230,255,0.08) 0%, rgba(255,59,212,0.04) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* 3D Polyhedron */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "3%",
          transform: "translateY(-50%)",
          width: "min(580px, 52vw)",
          height: "min(580px, 52vw)",
          zIndex: 3,
          filter:
            "drop-shadow(0 0 40px rgba(47,230,255,0.25)) drop-shadow(0 0 80px rgba(255,59,212,0.1))",
        }}
      >
        <PolyhedronScene />
      </div>

      {/* Chromatic ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "calc(3% + min(580px,52vw)/2 - min(580px,52vw)*0.52)",
          transform: "translate(50%, -50%)",
          width: "min(640px, 56vw)",
          height: "min(640px, 56vw)",
          borderRadius: "50%",
          border: "1px solid rgba(47,230,255,0.06)",
          pointerEvents: "none",
          zIndex: 2,
          animation: "orbit-ring 25s linear infinite",
        }}
      />

      {/* Hero text */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "55%",
          paddingTop: 80,
        }}
      >
        {/* Role badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            padding: "6px 14px",
            border: "1px solid rgba(47,230,255,0.3)",
            borderRadius: 20,
            background: "rgba(47,230,255,0.05)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#2FE6FF",
              boxShadow: "0 0 8px #2FE6FF",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "#2FE6FF",
            }}
          >
            IMMERSIVE VISUAL STORYTELLER
          </span>
        </motion.div>

        {/* Glitch title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="glitch-text"
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#F2F5FF",
            textTransform: "uppercase",
            marginBottom: 0,
          }}
        >
          CHRONOS
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65 }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#2FE6FF",
            textTransform: "uppercase",
            textShadow:
              "0 0 30px rgba(47,230,255,0.6), 0 0 60px rgba(47,230,255,0.3)",
            marginBottom: 24,
          }}
        >
          ARCANE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            color: "#2FE6FF",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          IMMERSIVE VISUAL STORYTELLER / CREATIVE DEVELOPER
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#A7B0C6",
            maxWidth: 460,
            marginBottom: 40,
          }}
        >
          Crafting impossible digital realities through the fusion of
          mathematics, light, and code. Every interaction is a portal to a
          dimension that hasn't existed before.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <button
            type="button"
            data-ocid="hero.view_work.button"
            onClick={() =>
              document
                .getElementById("explorations")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#060813",
              background: "linear-gradient(135deg, #2FE6FF, #7B4DFF)",
              border: "none",
              padding: "14px 32px",
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 0 30px rgba(47,230,255,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow =
                "0 0 50px rgba(47,230,255,0.6)";
              (e.target as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow =
                "0 0 30px rgba(47,230,255,0.35)";
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          >
            VIEW WORK
          </button>
          <button
            type="button"
            data-ocid="hero.contact.button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#FF3BD4",
              background: "transparent",
              border: "1px solid rgba(255,59,212,0.5)",
              padding: "14px 32px",
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "rgba(255,59,212,0.1)";
              (e.target as HTMLElement).style.borderColor = "#FF3BD4";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.borderColor =
                "rgba(255,59,212,0.5)";
            }}
          >
            INITIATE CONTACT
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            marginTop: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 1,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, #2FE6FF, transparent)",
              animation: "float-shard-5 3s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              color: "rgba(167,176,198,0.6)",
              textTransform: "uppercase",
            }}
          >
            SCROLL TO EXPLORE
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Explorations Section ─────────────────────────────────────────────────────
function ExplorationsSection() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section
      id="explorations"
      style={{
        position: "relative",
        padding: "120px 5% 100px",
        zIndex: 10,
      }}
    >
      {/* Section heading */}
      <FadeInSection className="">
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "rgba(47,230,255,0.6)",
              marginBottom: 16,
            }}
          >
            ◈ ◈ ◈
          </p>
          <h2
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#F2F5FF",
              textShadow: "0 0 40px rgba(47,230,255,0.2)",
            }}
          >
            SELECTED EXPLORATIONS
          </h2>
          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #2FE6FF, transparent)",
              margin: "20px auto 0",
            }}
          />
        </div>
      </FadeInSection>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {PROJECTS.map((project, i) => (
          <FadeInSection key={project.id} delay={i * 0.12}>
            <article
              className={`neon-card ${project.hoverClass}`}
              data-ocid={`explorations.item.${i + 1}`}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => setActiveCard(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveCard(i);
              }}
            >
              {/* Holographic thumbnail */}
              <div
                className={project.gradientClass}
                style={{
                  height: 180,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* SVG art */}
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", inset: 0 }}
                  aria-hidden="true"
                >
                  {project.lines.map((line) => (
                    <line
                      key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={project.color}
                      strokeWidth="0.5"
                      strokeOpacity="0.4"
                    />
                  ))}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    fill="none"
                    stroke={project.color}
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="15%"
                    fill="none"
                    stroke={project.color}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                </svg>
                {/* Center icon */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: `1.5px solid ${project.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${project.color}15`,
                    boxShadow: `0 0 20px ${project.color}40`,
                    zIndex: 1,
                  }}
                >
                  <span style={{ color: project.color, fontSize: "1.2rem" }}>
                    ◈
                  </span>
                </div>
                {/* Tag */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "0.5rem",
                    letterSpacing: "0.15em",
                    color: project.color,
                    border: `1px solid ${project.color}60`,
                    padding: "3px 8px",
                    borderRadius: 10,
                    background: `${project.color}10`,
                  }}
                >
                  {project.tag}
                </div>
              </div>

              {/* Card content */}
              <div style={{ padding: "20px 20px 22px" }}>
                <h3
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#F2F5FF",
                    marginBottom: 8,
                    textTransform: "uppercase",
                  }}
                >
                  {project.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "0.8rem",
                    color: "#A7B0C6",
                    marginBottom: 18,
                  }}
                >
                  {project.descriptor}
                </p>
                <button
                  type="button"
                  data-ocid={`explorations.cta.${i + 1}.button`}
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: project.color,
                    background: "transparent",
                    border: `1px solid ${project.color}50`,
                    padding: "8px 18px",
                    borderRadius: 20,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.background = `${project.color}15`;
                    el.style.borderColor = project.color;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.background = "transparent";
                    el.style.borderColor = `${project.color}50`;
                  }}
                >
                  {project.cta} →
                </button>
              </div>
            </article>
          </FadeInSection>
        ))}
      </div>

      {/* Carousel indicator */}
      <FadeInSection delay={0.6}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 40,
          }}
        >
          {PROJECTS.map((project, i) => (
            <button
              type="button"
              key={project.id}
              data-ocid={`explorations.indicator.${i + 1}`}
              onClick={() => setActiveCard(i)}
              style={{
                width: activeCard === i ? 24 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                background:
                  activeCard === i ? "#2FE6FF" : "rgba(47,230,255,0.2)",
                boxShadow: activeCard === i ? "0 0 10px #2FE6FF" : "none",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </FadeInSection>
    </section>
  );
}

// ─── Method Section ───────────────────────────────────────────────────────────
function MethodSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <section
      id="method"
      style={{
        position: "relative",
        padding: "100px 5% 120px",
        zIndex: 10,
      }}
    >
      {/* Divider line */}
      <div
        style={{
          width: "100%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(47,230,255,0.2), rgba(255,59,212,0.2), transparent)",
          marginBottom: 80,
        }}
      />

      <FadeInSection>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <p
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "rgba(255,59,212,0.6)",
              marginBottom: 16,
            }}
          >
            ◈ ◈ ◈
          </p>
          <h2
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#F2F5FF",
            }}
          >
            THE METHOD
          </h2>
          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #FF3BD4, transparent)",
              margin: "20px auto 0",
            }}
          />
        </div>
      </FadeInSection>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          gap: 40,
          maxWidth: 1200,
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {/* Stats card */}
        <FadeInSection delay={0.1}>
          <div
            ref={statsRef}
            style={{
              background: "rgba(11,16,32,0.9)",
              border: "1px solid rgba(47,230,255,0.2)",
              borderRadius: 12,
              padding: "30px 24px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 40px rgba(47,230,255,0.06)",
              position: "sticky",
              top: 80,
            }}
          >
            <p
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "rgba(47,230,255,0.6)",
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              Metrics
            </p>
            {[
              { label: "WORKS", value: 28, suffix: "", color: "#2FE6FF" },
              { label: "CLIENTS", value: 15, suffix: "+", color: "#FF3BD4" },
              { label: "AWARDS", value: 12, suffix: "", color: "#2DFFB3" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                data-ocid={`method.stat.${i + 1}`}
                style={{ marginBottom: i < 2 ? 28 : 0 }}
              >
                <AnimatePresence>
                  {statsInView && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2, duration: 0.6 }}
                    >
                      <div
                        style={{
                          fontFamily: "Orbitron, sans-serif",
                          fontSize: "2.4rem",
                          fontWeight: 800,
                          color: stat.color,
                          textShadow: `0 0 20px ${stat.color}60`,
                          lineHeight: 1,
                          marginBottom: 4,
                        }}
                      >
                        <AnimatedCounter
                          target={stat.value}
                          suffix={stat.suffix}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "Orbitron, sans-serif",
                          fontSize: "0.55rem",
                          letterSpacing: "0.2em",
                          color: "rgba(167,176,198,0.6)",
                          textTransform: "uppercase",
                        }}
                      >
                        {stat.label}
                      </div>
                      {i < 2 && (
                        <div
                          style={{
                            width: "100%",
                            height: 1,
                            background: `linear-gradient(90deg, ${stat.color}30, transparent)`,
                            marginTop: 20,
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Method columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {METHODS.map((method, i) => (
            <FadeInSection key={method.id} delay={0.2 + i * 0.15}>
              <div
                data-ocid={`method.item.${i + 1}`}
                style={{
                  background: "rgba(11,16,32,0.7)",
                  border: `1px solid ${method.accent}20`,
                  borderRadius: 12,
                  padding: "28px 24px",
                  height: "100%",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${method.accent}50`;
                  el.style.boxShadow = `0 0 30px ${method.accent}15`;
                  el.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${method.accent}20`;
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    color: method.accent,
                    textShadow: `0 0 20px ${method.accent}60`,
                    marginBottom: 20,
                    lineHeight: 1,
                  }}
                >
                  {method.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: method.accent,
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {method.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    color: "#A7B0C6",
                  }}
                >
                  {method.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "80px 5% 60px",
        zIndex: 10,
        borderTop: "1px solid rgba(47,230,255,0.08)",
      }}
    >
      <FadeInSection>
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
            paddingBottom: 60,
          }}
        >
          <h2
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#F2F5FF",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            INITIATE TRANSMISSION
          </h2>
          <p
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "1rem",
              color: "#A7B0C6",
              marginBottom: 36,
              lineHeight: 1.6,
            }}
          >
            Ready to build something that breaks the simulation? Let's create
            digital experiences that don't exist yet.
          </p>
          <a
            href="mailto:chronos@kineticvoid.io"
            data-ocid="contact.email.button"
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#060813",
              background: "linear-gradient(135deg, #2FE6FF, #FF3BD4)",
              border: "none",
              padding: "16px 40px",
              borderRadius: 4,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 0 40px rgba(47,230,255,0.3)",
              textTransform: "uppercase",
              transition: "all 0.3s",
            }}
          >
            chronos@kineticvoid.io
          </a>
        </div>
      </FadeInSection>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      style={{
        position: "relative",
        padding: "28px 5%",
        borderTop: "1px solid rgba(47,230,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        zIndex: 10,
      }}
    >
      {/* Social icons */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {[
          {
            Icon: SiGithub,
            href: "https://github.com",
            label: "GitHub",
            color: "#F2F5FF",
            ocid: "footer.github.link",
          },
          {
            Icon: SiLinkedin,
            href: "https://linkedin.com",
            label: "LinkedIn",
            color: "#2FE6FF",
            ocid: "footer.linkedin.link",
          },
          {
            Icon: SiInstagram,
            href: "https://instagram.com",
            label: "Instagram",
            color: "#FF3BD4",
            ocid: "footer.instagram.link",
          },
        ].map(({ Icon, href, label, color, ocid }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-ocid={ocid}
            style={{
              color: "rgba(167,176,198,0.6)",
              transition: "all 0.3s",
              display: "flex",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = color;
              (e.currentTarget as HTMLElement).style.filter =
                `drop-shadow(0 0 8px ${color})`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(167,176,198,0.6)";
              (e.currentTarget as HTMLElement).style.filter = "none";
            }}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>

      {/* Brand */}
      <div
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "rgba(167,176,198,0.5)",
          textTransform: "uppercase",
        }}
      >
        KINETIC VOID / ©{year}
      </div>

      {/* Caffeine attribution */}
      <div
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.75rem",
          color: "rgba(167,176,198,0.4)",
        }}
      >
        © {year}. Built with <span style={{ color: "#FF3BD4" }}>♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2FE6FF", textDecoration: "none" }}
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "explorations", "method", "contact"];
    const observers: IntersectionObserver[] = [];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060813",
        color: "#F2F5FF",
        overflowX: "hidden",
      }}
    >
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Debris shards */}
      <DebrisShards />

      {/* Navigation */}
      <Nav activeSection={activeSection} />

      {/* Main content */}
      <main style={{ position: "relative", zIndex: 10 }}>
        <HeroSection />
        <ExplorationsSection />
        <MethodSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
