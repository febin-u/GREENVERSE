
import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import "./Auth.css";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Record successful logins in Supabase
    async function recordLogin(userId, loginType) {
        const { error } = await supabase
            .from("login_events")
            .insert({
                user_id: userId,
                login_type: loginType,
            });

        if (error) {
            console.error("Login tracking error:", error.message);
        }
    }

    // Email login and signup
    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (isLogin) {
                const { data, error } =
                    await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                if (error) throw error;

                await recordLogin(data.user.id, "email");
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.session && data.user) {
                    await recordLogin(data.user.id, "email");
                } else {
                    setMessage(
                        "Account created! Please check your email to confirm your account."
                    );
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Guest login
    async function handleGuestLogin() {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const { data, error } =
                await supabase.auth.signInAnonymously();

            if (error) throw error;

            if (data.user) {
                await recordLogin(data.user.id, "guest");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="auth-section" id="auth">
            <div className="auth-card">
                <span className="auth-tag">YOUR GREENER JOURNEY</span>

                <h2>{isLogin ? "Welcome Back" : "Create Your Account"}</h2>

                <p className="auth-description">
                    {isLogin
                        ? "Sign in and continue your journey towards a greener planet."
                        : "Join GREENVERSE and start making a positive impact."}
                </p>

                <div className="auth-tabs">
                    <button
                        type="button"
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
                        type="button"
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

                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}

                <div className="auth-guest-divider">
                    <span>OR</span>
                </div>

                <div className="auth-guest-note">
                    <strong>Want to explore first?</strong>
                    <p>
                        You can continue as a guest, but signing up gives you
                        a better experience. Create an account to keep your
                        progress and access your GREENVERSE journey again.
                    </p>
                </div>

                <button
                    type="button"
                    className="auth-guest-button"
                    onClick={handleGuestLogin}
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Continue as Guest"}
                </button>
            </div>
        </section>
    );
}

export default Auth;
