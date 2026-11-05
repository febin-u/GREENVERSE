
import { useEffect, useState } from "react";
import {
    Trophy,
    Target,
    CheckCircle2,
    RotateCcw,
    Sparkles,
    TreePine,
    Droplets,
    Bike,
    Lightbulb,
    ShoppingBag,
    Award,
    Recycle,
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import "./GreenChallenges.css";

const initialChallenges = [
    {
        id: 1,
        title: "Plant a Green Future",
        description: "Plant a suitable native tree or care for an existing plant.",
        category: "Nature",
        points: 50,
        icon: TreePine,
        color: "green",
    },
    {
        id: 2,
        title: "Save Every Drop",
        description: "Practise water conservation throughout your day.",
        category: "Water",
        points: 30,
        icon: Droplets,
        color: "blue",
    },
    {
        id: 3,
        title: "Choose Greener Travel",
        description: "Walk, cycle or use public transport for a suitable journey.",
        category: "Transport",
        points: 40,
        icon: Bike,
        color: "purple",
    },
    {
        id: 4,
        title: "Switch Off to Save",
        description: "Turn off unused lights and electrical appliances.",
        category: "Energy",
        points: 25,
        icon: Lightbulb,
        color: "yellow",
    },
    {
        id: 5,
        title: "Say No to Single-use Plastic",
        description: "Carry a reusable bottle or shopping bag.",
        category: "Lifestyle",
        points: 35,
        icon: ShoppingBag,
        color: "pink",
    },
    {
        id: 6,
        title: "Sort Your Waste",
        description: "Separate recyclable, organic and other household waste.",
        category: "Recycling",
        points: 30,
        icon: Recycle,
        color: "green",
    },
];

function GreenChallenges() {
    const [completed, setCompleted] = useState([]);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Detect the logged-in Supabase user.
    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data, error }) => {
            if (!active) return;

            if (error) {
                setErrorMessage(error.message);
                setReady(true);
                return;
            }

            setUserId(data.session?.user?.id || null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (active) {
                setUserId(session?.user?.id || null);
            }
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    // Load this user's challenges from Supabase.
    useEffect(() => {
        let active = true;

        async function loadChallenges() {
            setReady(false);
            setErrorMessage("");

            if (!userId) {
                try {
                    const saved = localStorage.getItem(
                        "greenverse-challenges-v1"
                    );

                    if (active) {
                        setCompleted(saved ? JSON.parse(saved) : []);
                    }
                } catch {
                    if (active) setCompleted([]);
                }

                if (active) setReady(true);
                return;
            }

            const { data, error } = await supabase
                .from("user_challenges")
                .select("challenge_id, completed")
                .eq("user_id", userId);

            if (!active) return;

            if (error) {
                setErrorMessage(error.message);
                setReady(true);
                return;
            }

            const savedIds = data
                .filter((item) => item.completed)
                .map((item) => Number(item.challenge_id));

            setCompleted(savedIds);
            setReady(true);
        }

        loadChallenges();

        return () => {
            active = false;
        };
    }, [userId]);

    // Keep local browser storage and Dashboard in sync.
    useEffect(() => {
        if (!ready) return;

        // Save locally only for users who are not logged in.
        if (!userId) {
            try {
                localStorage.setItem(
                    "greenverse-challenges-v1",
                    JSON.stringify(completed)
                );
            } catch {
                // Browser storage may be unavailable.
            }
        }

        window.dispatchEvent(
            new Event("greenverse-challenges-updated")
        );
    }, [completed, ready, userId]);

    const completedCount = initialChallenges.filter((challenge) =>
        completed.includes(challenge.id)
    ).length;

    const points = initialChallenges
        .filter((challenge) => completed.includes(challenge.id))
        .reduce((sum, challenge) => sum + challenge.points, 0);

    const progress = (completedCount / initialChallenges.length) * 100;

    const badge =
        points >= 150
            ? "Planet Protector"
            : points >= 75
                ? "Eco Champion"
                : points >= 30
                    ? "Green Starter"
                    : "New Explorer";

    // Complete or undo a challenge.
    const toggleChallenge = async (id) => {
        if (!ready || saving) return;

        setSaving(true);
        setErrorMessage("");

        const isCompleted = completed.includes(id);

        if (userId) {
            let result;

            if (isCompleted) {
                result = await supabase
                    .from("user_challenges")
                    .delete()
                    .eq("user_id", userId)
                    .eq("challenge_id", String(id));
            } else {
                result = await supabase
                    .from("user_challenges")
                    .upsert(
                        {
                            user_id: userId,
                            challenge_id: String(id),
                            completed: true,
                            updated_at: new Date().toISOString(),
                        },
                        {
                            onConflict: "user_id,challenge_id",
                        }
                    );
            }

            if (result.error) {
                setErrorMessage(result.error.message);
                setSaving(false);
                return;
            }
        }

        setCompleted((previous) =>
            isCompleted
                ? previous.filter((item) => item !== id)
                : [...previous, id]
        );

        setSaving(false);
    };

    // Reset this user's progress.
    const resetChallenges = async () => {
        if (!ready || saving) return;

        const confirmed = window.confirm(
            "Are you sure you want to reset all your challenge progress?"
        );

        if (!confirmed) return;

        setSaving(true);
        setErrorMessage("");

        if (userId) {
            const { error } = await supabase
                .from("user_challenges")
                .delete()
                .eq("user_id", userId);

            if (error) {
                setErrorMessage(error.message);
                setSaving(false);
                return;
            }
        }

        setCompleted([]);
        setSaving(false);
    };

    return (
        <section className="challenges-section" id="challenges">
            <div className="challenges-heading">
                <span className="section-tag">
                    TAKE ACTION · EARN REWARDS
                </span>

                <h2>
                    Small actions.<br />
                    <span>Big achievements.</span>
                </h2>

                <p>
                    Complete simple sustainability challenges, collect points
                    and become a champion for our planet.
                </p>
            </div>

            <div className="challenge-dashboard">
                <div className="challenge-score-card">
                    <div className="score-icon">
                        <Trophy size={27} />
                    </div>

                    <span className="score-label">YOUR ECO POINTS</span>
                    <strong className="score-number">{points}</strong>
                    <span className="score-caption">Points earned</span>
                </div>

                <div className="challenge-progress-card">
                    <div className="progress-card-top">
                        <div>
                            <span className="score-label">YOUR PROGRESS</span>
                            <h3>
                                {completedCount} / {initialChallenges.length} completed
                            </h3>
                        </div>

                        <Target size={27} />
                    </div>

                    <div className="challenge-progress-track">
                        <div
                            className="challenge-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p>{Math.round(progress)}% of challenges completed</p>
                </div>

                <div className="challenge-badge-card">
                    <div className="badge-icon">
                        <Award size={28} />
                    </div>

                    <span className="score-label">YOUR ECO RANK</span>
                    <h3>{badge}</h3>
                    <span className="score-caption">
                        Keep making a difference!
                    </span>
                </div>
            </div>

            <div className="challenge-list-heading">
                <div>
                    <span className="section-tag">YOUR MISSIONS</span>
                    <h3>Choose your next challenge</h3>
                </div>

                <button
                    className="challenge-reset"
                    type="button"
                    onClick={resetChallenges}
                    disabled={!ready || saving}
                >
                    <RotateCcw size={15} />
                    Reset progress
                </button>
            </div>

            {errorMessage && (
                <p role="alert" style={{ color: "#ff8585" }}>
                    {errorMessage}
                </p>
            )}

            {!ready && <p>Loading your saved eco progress...</p>}

            <div className="challenge-grid">
                {initialChallenges.map((challenge) => {
                    const Icon = challenge.icon;
                    const isCompleted = completed.includes(challenge.id);

                    return (
                        <article
                            className={`challenge-card ${isCompleted ? "challenge-done" : ""}`}
                            key={challenge.id}
                        >
                            <div className="challenge-card-top">
                                <div className={`challenge-icon ${challenge.color}`}>
                                    <Icon size={26} />
                                </div>

                                <span className="challenge-points">
                                    +{challenge.points} PTS
                                </span>
                            </div>

                            <span className="challenge-category">
                                {challenge.category}
                            </span>

                            <h4>{challenge.title}</h4>
                            <p>{challenge.description}</p>

                            <button
                                className={`challenge-action ${isCompleted ? "completed" : ""}`}
                                type="button"
                                disabled={!ready || saving}
                                onClick={() => toggleChallenge(challenge.id)}
                            >
                                {isCompleted ? (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Completed
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={17} />
                                        Complete challenge
                                    </>
                                )}
                            </button>
                        </article>
                    );
                })}
            </div>

            <div className="challenge-footer">
                <Trophy size={22} />
                <p>
                    Every small action counts. Keep going and help create
                    a greener tomorrow!
                </p>
            </div>
        </section>
    );
}

export default GreenChallenges;
