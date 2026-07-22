import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJournal } from "../api/journalService";

function JournalCreatePage() {
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError("Journal cannot be empty.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const response = await createJournal({ content });

            navigate(`/journals/${response.entry._id}`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save journal."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Create Journal</h1>

            <form onSubmit={handleSubmit}>
                <textarea
                    rows={10}
                    cols={60}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write about your day..."
                    required
                />

                <br />
                <br />

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? "Saving..."
                        : "Save Journal"}
                </button>
            </form>
        </div>
    );
}

export default JournalCreatePage;