import Auth from "./Auth";
import Dashboard from "./Dashboard";
import GreenChallenges from "./GreenChallenges";
import WasteGuide from "./WasteGuide";
import EcoAssistant from "./EcoAssistant";
import CarbonCalculator from "./CarbonCalculator";
import { useState } from "react";
import {
  Leaf,
  ArrowUpRight,
  Menu,
  X,
  Sprout,
  Recycle,
  Droplets,
  Wind,
  Sun,
  TreePine,
  Globe2,
  Activity,
  Footprints,
} from "lucide-react";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: Footprints,
      title: "Carbon Footprint",
      description: "Understand your environmental impact and discover ways to reduce it.",
      color: "green",
      number: "01",
    },
    {
      icon: Recycle,
      title: "Smart Recycling",
      description: "Learn how to sort waste and give everyday materials a second life.",
      color: "blue",
      number: "02",
    },
    {
      icon: Sprout,
      title: "Green Challenges",
      description: "Take small daily actions that create a lasting environmental impact.",
      color: "lime",
      number: "03",
    },
  ];

  const stats = [
    { value: "1.2M+", label: "Trees protected", icon: TreePine },
    { value: "850K+", label: "Eco actions taken", icon: Activity },
    { value: "42K+", label: "Green citizens", icon: Globe2 },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon"><Leaf size={23} /></span>
          <span>green<span className="brand-light">verse</span></span>
        </a>

        <div className={`nav-links ${menuOpen ? "show-menu" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>Our Impact</a>
          <a href="#auth" className="mobile-contact" onClick={() => setMenuOpen(false)}>Get Started ↗</a>
        </div>

        <a href="#auth" className="nav-cta">
          Get Started <ArrowUpRight size={16} />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid"></div>
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot"></span>
              THE FUTURE IS GREEN
            </div>

            <h1>
              Small actions.<br />
              <span>Big impact.</span><br />
              One planet.
            </h1>

            <p className="hero-description">
              The future of our planet starts with the choices we make today.
              Discover smarter ways to live sustainably and make every action count.
            </p>

            <div className="hero-buttons">
              <a href="#features" className="primary-btn">
                Explore the platform <ArrowUpRight size={18} />
              </a>
              <a href="#about" className="secondary-btn">
                Discover our mission
              </a>
            </div>

            <div className="hero-note">
              <span><Leaf size={15} /></span>
              BUILD A BETTER TOMORROW, STARTING TODAY.
            </div>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="planet">
              <div className="planet-glow"></div>
              <div className="planet-land land-one"></div>
              <div className="planet-land land-two"></div>
              <div className="planet-land land-three"></div>
              <div className="planet-shine"></div>
            </div>

            <div className="floating-card card-top">
              <span className="floating-icon"><Sprout size={20} /></span>
              <div>
                <strong>Grow greener</strong>
                <small>Every action matters</small>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span className="floating-icon"><Wind size={20} /></span>
              <div>
                <strong>Cleaner future</strong>
                <small>One planet. One mission.</small>
              </div>
            </div>

            <div className="orbit-label">OUR PLANET · OUR FUTURE</div>
          </div>

          <div className="hero-bottom">
            <span>01 / 04</span>
            <span className="hero-line"></span>
            <span>DESIGNED FOR A GREENER WORLD</span>
          </div>
        </section>

        <section className="stats-section" id="impact">
          <div className="stats-intro">
            <span className="section-tag">OUR VISION IN ACTION</span>
            <h2>A better world<br />starts <span>together.</span></h2>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div className="stat-item" key={stat.label}>
                  <Icon size={23} />
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              );
            })}
          </div>
          <p className="stats-disclaimer">
            Illustrative platform targets — not verified live environmental measurements.
          </p>
        </section>

        <section className="about-section" id="about">
          <div className="about-visual">
            <div className="about-circle">
              <Leaf size={75} strokeWidth={1} />
              <span>THINK GREEN</span>
            </div>
            <div className="about-small-card">
              <Sun size={19} />
              <span>POWER A CLEANER FUTURE</span>
            </div>
          </div>

          <div className="about-content">
            <span className="section-tag">WHY GREENVERSE?</span>
            <h2>Technology with a <span>purpose.</span></h2>
            <p>
              Sustainability shouldn't be complicated. GREENVERSE brings
              environmental awareness, useful tools and meaningful actions
              together in one digital ecosystem.
            </p>
            <p>
              From understanding your carbon footprint to building greener
              habits, we're here to turn awareness into action.
            </p>
            <a href="#features" className="text-link">
              Discover what you can do <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <div>
              <span className="section-tag">EXPLORE GREENVERSE</span>
              <h2>Make sustainability<br /><span>your lifestyle.</span></h2>
            </div>
            <p>
              Powerful ideas and practical tools to help you make
              a difference, one step at a time.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-top">
                    <span className={`feature-icon ${feature.color}`}>
                      <Icon size={26} />
                    </span>
                    <span className="feature-number">{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href="#contact" className="feature-link">
                    Explore feature <ArrowUpRight size={17} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>
        <CarbonCalculator />

        <EcoAssistant />

        <WasteGuide />

        <GreenChallenges />

        <Dashboard />

        <Auth />

        <section className="cta-section" id="contact">
          <div className="cta-glow"></div>
          <span className="section-tag">THE CHANGE STARTS WITH YOU</span>
          <h2>Let's build a <span>greener tomorrow.</span></h2>
          <p>Be part of a generation that chooses the planet.</p>
          <a href="#home" className="primary-btn">
            Start your green journey <ArrowUpRight size={18} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="brand">
          <span className="brand-icon"><Leaf size={21} /></span>
          <span>green<span className="brand-light">verse</span></span>
        </a>
        <p>Designed for a greener world. Built for tomorrow.</p>
        <span className="footer-copy">© 2026 GREENVERSE</span>
      </footer>
    </div>
  );
}

export default App;
