
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import "./Auth.css";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                setMessage("Welcome back to GREENVERSE!");
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.session) {
                    setMessage("Your account has been created successfully!");
                } else {
                    setMessage("Account created! Please check your email to confirm your account.");
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setError("");
        const { error } = await supabase.auth.signOut();

        if (error) {
            setError(error.message);
        } else {
            setMessage("You have logged out successfully.");
        }
    }

    return (
        <section className="auth-section" id="auth">
            <div className="auth-card">
                <span className="auth-tag">YOUR GREENER JOURNEY</span>

                {session ? (
                    <div className="auth-logged-in">
                        <h2>Welcome to GREENVERSE!</h2>
                        <p>You are signed in as:</p>
                        <strong>{session.user.email}</strong>
                        <button onClick={handleLogout} className="auth-button">
                            Log Out
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>{isLogin ? "Welcome Back" : "Create Your Account"}</h2>
                        <p className="auth-description">
                            {isLogin
                                ? "Sign in and continue your journey towards a greener planet."
                                : "Join GREENVERSE and start making a positive impact."}
                        </p>

                        <div className="auth-tabs">
                            <button
                                className={isLogin ? "active" : ""}
                                onClick={() => {
                                    setIsLogin(true);
                                    setError("");
                                    setMessage("");
                                }}
                            >
                                Login
                            </button>

                            <button
                                className={!isLogin ? "active" : ""}
                                onClick={() => {
                                    setIsLogin(false);
                                    setError("");
                                    setMessage("");
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="auth-email">Email Address</label>
                            <input
                                id="auth-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />

                            <label htmlFor="auth-password">Password</label>
                            <input
                                id="auth-password"
                                type="password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                minLength={6}
                                required
                            />

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Please wait..."
                                    : isLogin
                                        ? "Login to GREENVERSE"
                                        : "Create Account"}
                            </button>
                        </form>
                    </>
                )}

                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}
            </div>
        </section>
    );
}

export default Auth;
