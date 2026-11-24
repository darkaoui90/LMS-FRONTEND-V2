import { useState } from "react";
import { getMyEnrollments } from "../services/api";
import EnrollmentCard from "./EnrollmentCard";

function LearnerDashboard({ user, token, onUnauthorized }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMyCourses() {
    setLoading(true);
    setError("");
    try {
      const result = await getMyEnrollments(token);
      setEnrollments(result.data.enrollments);
      setLoaded(true);
    } catch (problem) {
      if (problem.status === 401) {
        onUnauthorized();
      } else if (problem.status === 403) {
        setEnrollments([]);
        setLoaded(false);
        setError("Access denied (403). Your session is still active.");
      } else {
        setError(problem.message || "Could not load your courses.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="welcome-banner learner-banner">
        <p className="eyebrow">LEARNER SPACE</p>
        <h1>Keep going, {user.name}</h1>
        <p>Your enrolled courses are all in one place.</p>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING</p>
          <h2>My courses</h2>
          <p className="page-subtitle">Courses linked to your account.</p>
        </div>
        <button type="button" onClick={loadMyCourses} disabled={loading}>
          {loading
            ? "Loading..."
            : loaded
              ? "Refresh my courses"
              : "Load my courses"}
        </button>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="loading-state" role="status">
          Loading your courses...
        </p>
      )}
      {!loaded && !loading && !error && (
        <div className="empty-detail">
          <span className="empty-icon">C</span>
          <h3>Ready when you are</h3>
          <p>Click Load my courses to see your enrollments.</p>
        </div>
      )}
      {loaded && enrollments.length === 0 && (
        <div className="empty-detail">
          <span className="empty-icon">C</span>
          <h3>No enrollments yet</h3>
          <p>Courses you join will appear here.</p>
        </div>
      )}
      {loaded && enrollments.length > 0 && (
        <>
          <p className="muted">
            {enrollments.length} enrollment{enrollments.length === 1 ? "" : "s"}
          </p>
          <div className="card-grid">
            {enrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default LearnerDashboard;
