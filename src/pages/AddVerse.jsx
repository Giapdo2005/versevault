import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveVerse } from "../data/verses";
import styles from "./AddVerse.module.css";

function AddVerse() {
  // useNavigate gives us a function we can call to change the URL
  // programmatically — like clicking a link, but from code.
  const navigate = useNavigate();

  // useState holds our form data.
  // The object { reference: '', text: '' } is the initial state —
  // both fields start empty.
  //
  // `formData` is the current value.
  // `setFormData` is the function we call to update it.
  // Every time setFormData is called, React re-renders the component
  // with the new value.
  const [formData, setFormData] = useState({
    reference: "",
    text: "",
  });

  // `error` holds a message to show the user if something goes wrong.
  const [error, setError] = useState("");

  // --- handleChange ---
  // Called every time the user types in either input field.
  // `e` is the event object — e.target is the input element,
  // e.target.name is "reference" or "text", e.target.value is what
  // the user typed.
  //
  // We use the spread operator (...formData) to copy the existing
  // fields, then override just the one that changed.
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // --- handleSubmit ---
  // Called when the user clicks Save.
  function handleSubmit(e) {
    // Prevent the browser's default form behavior (a full page reload).
    // In React we handle submission ourselves.
    e.preventDefault();

    // Basic validation — both fields must have content
    if (!formData.reference.trim() || !formData.text.trim()) {
      setError("Please fill in both the reference and the verse text.");
      return;
    }

    // Save to localStorage via our data helper
    saveVerse({
      reference: formData.reference.trim(),
      text: formData.text.trim(),
    });

    // Navigate to the verse list page
    // The '/' second argument replaces history so Back doesn't return to the form
    navigate("/verses");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add a Verse</h1>
        <p className={styles.subtitle}>
          Type the reference and the verse text from your ESV Bible.
        </p>
      </div>

      {/*
        onSubmit on the <form> fires when the user clicks the submit button
        or presses Enter. We handle it in handleSubmit above.
      */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reference">
            Reference
          </label>
          {/*
            This is a "controlled input" — React owns the value.
            `value={formData.reference}` ties the input to our state.
            `onChange={handleChange}` updates state on every keystroke.
            Without both of these together, the input and state go out of sync.
          */}
          <input
            id="reference"
            name="reference"
            type="text"
            className={styles.input}
            placeholder="e.g. John 3:16"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="text">
            Verse Text
          </label>
          <textarea
            id="text"
            name="text"
            className={styles.textarea}
            placeholder="Type the verse here..."
            value={formData.text}
            onChange={handleChange}
            rows={5}
          />
        </div>

        {/* Only render the error message if there is one */}
        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          Save Verse
        </button>
      </form>
    </div>
  );
}

export default AddVerse;
