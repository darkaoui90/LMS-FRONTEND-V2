import { useState } from "react";

function UserForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const result = await onSubmit(name.trim(), email.trim(), password);
      setSuccess("Learner created: " + result.data.user.name);
      setName("");
      setEmail("");
      setPassword("");
    } catch (problem) {
      if (problem.status === 409) {
        setError("This email is already registered.");
      } else if (problem.status === 400) {
        setError(problem.message);
      } else {
        setError(problem.message || "Could not reach the server.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <p className="eyebrow">NEW ACCOUNT</p>
      <h2>Add a learner</h2>
      <p className="muted">
        Fill in these three fields to create a learner account.
      </p>
      <label htmlFor="new-name">Name</label>
      <input
        id="new-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <label htmlFor="new-email">Email</label>
      <input
        id="new-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <label htmlFor="new-password">Password</label>
      <input
        id="new-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="notice" role="status">
          {success}
        </p>
      )}
      <button type="submit" disabled={busy}>
        {busy ? "Saving..." : "Create learner"}
      </button>
    </form>
  );
}

export default UserForm;
