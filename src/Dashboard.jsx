
import { useEffect, useState } from "react";

import {
    Leaf,
    Trophy,
    Target,
    Award,
    TreePine,
    Droplets,
    Bike,
    Lightbulb,
    ShoppingBag,
    Recycle,
    ArrowUpRight,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

import { supabase } from "./lib/supabaseClient";
import "./Dashboard.css";

const challenges = [
    { id: 1, title: "Plant a Green Future", points: 50, category: "Nature", icon: TreePine },
    { id: 2, title: "Save Every Drop", points: 30, category: "Water", icon: Droplets },
    { id: 3, title: "Choose Greener Travel", points: 40, category: "Transport", icon: Bike },
    { id: 4, title: "Switch Off to Save", points: 25, category: "Energy", icon: Lightbulb },
    { id: 5, title: "Say No to Single-use Plastic", points: 35, category: "Lifestyle", icon: ShoppingBag },
    { id: 6, title: "Sort Your Waste", points: 30, category: "Recycling", icon: Recycle },
];

const achievements = [
    { name: "First Steps", description: "Complete your first challenge", threshold: 1, icon: Leaf },
    { name: "Eco Explorer", description: "Complete three challenges", threshold: 3, icon: Target },
    { name: "Planet Protector", description: "Complete all six challenges", threshold: 6, icon: Trophy },
];

function getLocalChallenges() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("greenverse-challenges-v1") || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return saved.filter((id) =>
            challenges.some((challenge) => challenge.id === id)
        );
    } catch {
        return [];
    }
}

function Dashboard() {
    const [completed, setCompleted] = useState(getLocalChallenges);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Detect the current logged-in user.
    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data, error }) => {
            if (!active) return;

            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }

            setUserId(data.session?.user?.id || null);
            setUserEmail(data.session?.user?.email || "");
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!active) return;

            setUserId(session?.user?.id || null);
            setUserEmail(session?.user?.email || "");
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    // Load progress from Supabase for logged-in users.
    useEffect(() => {
        let active = true;

        async function loadProgress() {
            setLoading(true);
            setErrorMessage("");

            if (!userId) {
                if (active) {
                    setCompleted(getLocalChallenges());
                    setLoading(false);
                }
                return;
            }

            const { data, error } = await supabase
                .from("user_challenges")
                .select("challenge_id, completed")
                .eq("user_id", userId);

            if (!active) return;

            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }

            const savedIds = data
                .filter((item) => item.completed)
                .map((item) => Number(item.challenge_id));

            setCompleted(savedIds);
            setLoading(false);
        }

        loadProgress();

        return () => {
            active = false;
        };
    }, [userId]);

    // Refresh dashboard when challenges change.
    useEffect(() => {
        let active = true;

        async function refreshProgress() {
            if (!userId) {
                if (active) setCompleted(getLocalChallenges());
                return;
            }

            const { data, error } = await supabase
                .from("user_challenges")
                .select("challenge_id, completed")
                .eq("user_id", userId);

            if (!active) return;

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            setCompleted(
                data
                    .filter((item) => item.completed)
                    .map((item) => Number(item.challenge_id))
            );
        }

        window.addEventListener(
            "greenverse-challenges-updated",
            refreshProgress
        );

        window.addEventListener("storage", refreshProgress);

        return () => {
            active = false;

            window.removeEventListener(
                "greenverse-challenges-updated",
                refreshProgress
            );

            window.removeEventListener("storage", refreshProgress);
        };
    }, [userId]);

    const completedChallenges = challenges.filter((challenge) =>
        completed.includes(challenge.id)
    );

    const totalPoints = completedChallenges.reduce(
        (total, challenge) => total + challenge.points,
        0
    );

    const completionRate = Math.round(
        (completedChallenges.length / challenges.length) * 100
    );

    const currentRank =
        totalPoints >= 150
            ? "Planet Protector"
            : totalPoints >= 75
                ? "Eco Champion"
                : totalPoints >= 30
                    ? "Green Starter"
                    : "New Explorer";

    return (
        <section className="dashboard-section" id="dashboard">

            {/* Dashboard heading */}
            <div className="dashboard-heading">
                <span className="section-tag">
                    YOUR SUSTAINABILITY JOURNEY
                </span>

                <h2>
                    Your impact.
                    <br />
                    <span>Your planet.</span>
                </h2>

                <p>
                    Every green action counts. Track your progress and
                    keep moving towards a sustainable future.
                </p>
            </div>

            {/* Welcome banner */}
            <div className="dashboard-welcome">
                <div className="dashboard-welcome-content">
                    <span className="welcome-label">
                        <Sparkles size={14} />
                        YOUR GREENVERSE OVERVIEW
                    </span>

                    <h3>
                        {userEmail
                            ? `Welcome, ${userEmail.split("@")[0]}!`
                            : "Welcome, Eco Explorer!"}
                    </h3>

                    <p>
                        Track your progress. Make every action count.
                    </p>
                </div>

                <div className="welcome-leaf">
                    <Leaf size={40} />
                </div>
            </div>

            {/* Error and loading messages */}
            {errorMessage && (
                <p role="alert" style={{ color: "#ff8585" }}>
                    Could not load your cloud progress: {errorMessage}
                </p>
            )}

            {loading && (
                <p>Loading your saved eco progress...</p>
            )}

            {/* Dashboard statistics */}
            <div className="dashboard-stats">

                <div className="dashboard-stat">
                    <div className="stat-icon points">
                        <Trophy size={23} />
                    </div>
                    <span>YOUR ECO POINTS</span>
                    <strong>{totalPoints}</strong>
                    <small>Points earned from challenges</small>
                </div>

                <div className="dashboard-stat">
                    <div className="stat-icon missions">
                        <CheckCircle2 size={23} />
                    </div>
                    <span>COMPLETED MISSIONS</span>
                    <strong>
                        {completedChallenges.length}/{challenges.length}
                    </strong>
                    <small>Environmental challenges</small>
                </div>

                <div className="dashboard-stat">
                    <div className="stat-icon progress">
                        <Target size={23} />
                    </div>
                    <span>COMPLETION RATE</span>
                    <strong>{completionRate}%</strong>
                    <small>Your challenge progress</small>
                </div>

                <div className="dashboard-stat">
                    <div className="stat-icon rank">
                        <Award size={23} />
                    </div>
                    <span>CURRENT ECO RANK</span>
                    <strong className="rank-name">{currentRank}</strong>
                    <small>Keep making a difference</small>
                </div>

            </div>

            {/* Main dashboard panels */}
            <div className="dashboard-main-grid">

                {/* Challenge progress */}
                <div className="dashboard-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="section-tag">YOUR PROGRESS</span>
                            <h3>Challenge overview</h3>
                        </div>
                        <Target size={23} />
                    </div>

                    <div className="dashboard-progress">
                        <div
                            className="dashboard-progress-fill"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>

                    <div className="progress-details">
                        <span>{completedChallenges.length} completed</span>
                        <span>
                            {challenges.length - completedChallenges.length} remaining
                        </span>
                    </div>

                    <div className="dashboard-completed-list">
                        {completedChallenges.length > 0 ? (
                            completedChallenges.map((challenge) => {
                                const Icon = challenge.icon;

                                return (
                                    <div
                                        className="dashboard-completed-item"
                                        key={challenge.id}
                                    >
                                        <div className="completed-icon">
                                            <Icon size={18} />
                                        </div>

                                        <div className="completed-info">
                                            <strong>{challenge.title}</strong>
                                            <small>{challenge.category}</small>
                                        </div>

                                        <span>+{challenge.points} pts</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="dashboard-empty">
                                <Leaf size={27} />
                                <p>No completed challenges yet.</p>
                                <a href="#challenges">
                                    Explore your first challenge →
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievements */}
                <div className="dashboard-panel achievement-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="section-tag">MILESTONES</span>
                            <h3>Your achievements</h3>
                        </div>
                        <Award size={23} />
                    </div>

                    {achievements.map((achievement) => {
                        const Icon = achievement.icon;

                        const unlocked =
                            completedChallenges.length >= achievement.threshold;

                        return (
                            <div
                                className={`achievement-item ${unlocked ? "unlocked" : "locked"}`}
                                key={achievement.name}
                            >
                                <div className="achievement-icon">
                                    <Icon size={23} />
                                </div>

                                <div className="achievement-info">
                                    <strong>{achievement.name}</strong>
                                    <small>{achievement.description}</small>
                                </div>

                                {unlocked ? (
                                    <CheckCircle2
                                        className="achievement-check"
                                        size={19}
                                    />
                                ) : (
                                    <span className="achievement-lock">
                                        {achievement.threshold - completedChallenges.length} left
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Quick links */}
            <div className="dashboard-quick-links">
                <div>
                    <span className="section-tag">KEEP EXPLORING</span>
                    <h3>Make your next green move.</h3>
                </div>

                <div className="quick-link-buttons">
                    <a href="#challenges">
                        Challenges <ArrowUpRight size={16} />
                    </a>

                    <a href="#waste-guide">
                        Waste Guide <ArrowUpRight size={16} />
                    </a>

                    <a href="#assistant">
                        Eco Assistant <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>

        </section>
    );
}

export default Dashboard;
