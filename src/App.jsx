
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

import Auth from "./Auth";
import Dashboard from "./Dashboard";
import GreenChallenges from "./GreenChallenges";
import WasteGuide from "./WasteGuide";
import EcoAssistant from "./EcoAssistant";
import CarbonCalculator from "./CarbonCalculator";

import {
  Leaf,
  Footprints,
  Recycle,
  Sprout,
  Bot,
  ChartNoAxesCombined,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import "./App.css";

const features = [
  {
    id: "carbon",
    title: "Carbon Calculator",
    description: "Understand and reduce your carbon footprint.",
    icon: Footprints,
  },
  {
    id: "waste",
    title: "Waste Guide",
    description: "Learn how to sort and dispose of waste.",
    icon: Recycle,
  },
  {
    id: "challenges",
    title: "Green Challenges",
    description: "Complete eco-friendly daily missions.",
    icon: Sprout,
  },
  {
    id: "assistant",
    title: "Eco Assistant",
    description: "Get answers to your sustainability questions.",
    icon: Bot,
  },
  {
    id: "impact",
    title: "My Impact",
    description: "Track your environmental progress and points.",
    icon: ChartNoAxesCombined,
  },
];

function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error(error);

      if (mounted) {
        setSession(data.session);
        setCheckingSession(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCurrentPage("dashboard");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      setCurrentPage("dashboard");
    }
  }

  if (checkingSession) {
    return (
      <div className="app-loading">
        <Leaf size={35} />
        <h2>GREENVERSE</h2>
        <p>Preparing your green journey...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="app auth-screen">
        <header className="mobile-app-header">
          <div className="brand">
            <Leaf size={25} />
            <span>
              green<span className="brand-light">verse</span>
            </span>
          </div>
        </header>

        <Auth />
      </div>
    );
  }

  // FEATURE PAGE RENDERING
  function renderPage() {
    switch (currentPage) {
      case "carbon":
        return <CarbonCalculator />;

      case "waste":
        return <WasteGuide />;

      case "challenges":
        return <GreenChallenges />;

      case "assistant":
        return <EcoAssistant />;

      case "impact":
        return <Dashboard />;

      default:
        return (
          <section className="app-dashboard">
            <div className="app-home-welcome">
              <span className="section-tag">
                YOUR GREEN JOURNEY
              </span>

              <h1>
                Welcome to <span>GREENVERSE.</span>
              </h1>

              <p>
                Choose a tool and take your next step towards a greener
                planet.
              </p>
            </div>

            <div className="app-feature-grid">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <button
                    className="app-feature-card"
                    key={feature.id}
                    onClick={() => setCurrentPage(feature.id)}
                  >
                    <span className="app-feature-icon">
                      <Icon size={27} />
                    </span>

                    <strong>{feature.title}</strong>

                    <span>{feature.description}</span>

                    <span className="app-card-arrow">
                      Explore →
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
    }
  }

  const activeFeature = features.find(
    (feature) => feature.id === currentPage
  );

  // AUTHENTICATED APP
  return (
    <div className="app mobile-app">
      <header className="mobile-app-header">
        <button
          className="app-back-button"
          onClick={() => setCurrentPage("dashboard")}
          aria-label="Back to dashboard"
          hidden={currentPage === "dashboard"}
        >
          <ArrowLeft size={22} />
        </button>

        <div className="brand">
          <Leaf size={25} />
          <span>
            green<span className="brand-light">verse</span>
          </span>
        </div>

        <button
          className="app-logout-button"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </header>

      {activeFeature && (
        <div className="app-page-heading">
          <button onClick={() => setCurrentPage("dashboard")}>
            <ArrowLeft size={17} /> Dashboard
          </button>

          <h2>{activeFeature.title}</h2>
        </div>
      )}

      <main className="mobile-app-content">
        {renderPage()}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="app-bottom-nav">
        <button
          className={currentPage === "dashboard" ? "active" : ""}
          onClick={() => setCurrentPage("dashboard")}
        >
          <Leaf size={20} />
          <span>Home</span>
        </button>

        <button
          className={currentPage === "challenges" ? "active" : ""}
          onClick={() => setCurrentPage("challenges")}
        >
          <Sprout size={20} />
          <span>Challenges</span>
        </button>

        <button
          className={currentPage === "impact" ? "active" : ""}
          onClick={() => setCurrentPage("impact")}
        >
          <ChartNoAxesCombined size={20} />
          <span>My Impact</span>
        </button>
      </nav>

      {/* DEVELOPER CREDIT - SEPARATE FROM NAVIGATION */}
      <footer className="app-developer-credit">
        Designed &amp; Developed by <strong>Febin U</strong>
      </footer>
    </div>
  );
}

export default App;
