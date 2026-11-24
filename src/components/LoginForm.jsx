import { useState } from "react";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onLogin(email.trim(), password);
    } catch (problem) {
      if (problem.status === 401 || problem.status === 400) {
        setError("Email or password is incorrect.");
      } else if (problem.status === 403) {
        setError("Access denied (403). Please contact your administrator.");
      } else if (problem instanceof TypeError) {
        setError(
          "Cannot reach the LMS server. Check that the backend is running and try again.",
        );
      } else {
        setError(problem.message || "Cannot reach the server.");
      }
    } finally {
      setPassword("");
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="brand brand-light">
          <span className="brand-mark">E</span>
          <strong>EduLearn</strong>
        </div>
        <div className="story-content">
          <p className="story-kicker">YOUR LEARNING SPACE</p>
          <h1>A better place to learn and grow.</h1>
          <p>
            One simple space for your courses, progress, and school community.
          </p>
          <div className="story-steps">
            <span>
              01 <strong>Sign in</strong>
            </span>
            <span>
              02 <strong>Explore</strong>
            </span>
            <span>
              03 <strong>Keep learning</strong>
            </span>
          </div>
        </div>
        <p className="story-footer">EduLearn LMS · Sprint 3</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p>Enter the email and password from your LMS account.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              placeholder="you@example.com"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="login-footnote">
            Your dashboard opens based on your account role.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginForm;
