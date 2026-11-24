import { useState } from "react";

function CourseForm({ course, onSave, onCancel }) {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [objectives, setObjectives] = useState(
    course?.objectives?.join("\n") || "",
  );
  const [category, setCategory] = useState(course?.category || "");
  const [level, setLevel] = useState(course?.level || "beginner");
  const [duration, setDuration] = useState(
    String(course?.estimatedDuration || ""),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const objectiveList = objectives
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      objectiveList.length === 0 ||
      Number(duration) < 1
    ) {
      setError(
        "Complete every field. Add one objective per line and a duration of at least 1.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSave(course?._id || null, {
        title: title.trim(),
        description: description.trim(),
        objectives: objectiveList,
        category: category.trim(),
        level,
        estimatedDuration: Number(duration),
      });
    } catch (problem) {
      if (problem.status === 403) {
        setError("Access denied (403). Your changes were not saved.");
      } else if (problem.status === 400 || problem.status === 409) {
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
      <p className="eyebrow">COURSE EDITOR</p>
      <h2>{course ? "Edit course" : "Create course"}</h2>
      <p className="muted">Add the details learners will see in the catalog.</p>
      <label htmlFor="course-title">Title</label>
      <input
        id="course-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <label htmlFor="course-description">Description</label>
      <textarea
        id="course-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />
      <label htmlFor="course-objectives">Objectives (one per line)</label>
      <textarea
        id="course-objectives"
        value={objectives}
        onChange={(event) => setObjectives(event.target.value)}
        required
      />
      <label htmlFor="course-category">Category</label>
      <input
        id="course-category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
      />
      <label htmlFor="course-level">Level</label>
      <select
        id="course-level"
        value={level}
        onChange={(event) => setLevel(event.target.value)}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <label htmlFor="course-duration">Estimated duration (minutes)</label>
      <input
        id="course-duration"
        type="number"
        min="1"
        value={duration}
        onChange={(event) => setDuration(event.target.value)}
        required
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="button-row">
        <button type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save course"}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CourseForm;
