import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getJournalById,
    updateJournal,
    deleteJournal,
} from "../api/journalService";

function JournalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const data = await getJournalById(id);

                setJournal(data.entry);
                setContent(data.entry.content);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Failed to load journal."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJournal();
    }, [id]);

    const handleUpdate = async () => {
        if (!content.trim()) {
            alert("Journal cannot be empty.");
            return;
        }

        try {
            const response = await updateJournal(id, { content });

                setJournal(response.entry);
                setContent(response.entry.content);

                setIsEditing(false);
            alert("Journal updated successfully.");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Failed to update journal."
            );
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this journal?"
        );

        if (!confirmed) return;

        try {
            await deleteJournal(id);

            navigate("/journals");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Failed to delete journal."
            );
        }
    };

    if (loading) {
        return <h2>Loading journal...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!journal) {
        return <h2>Journal not found.</h2>;
    }

    return (
        <div>
            <h1>Journal Entry</h1>

            <p>
                <strong>Date:</strong>{" "}
                {new Date(journal.createdAt).toLocaleString()}
            </p>

            <hr />

            <h3>Content</h3>

            {isEditing ? (
                <textarea
                    rows={10}
                    cols={60}
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                />
            ) : (
                <p>{journal.content}</p>
            )}

            <hr />

            <h3>Reflection Status</h3>

            <p>
                {journal.reflection?.status === "ready" &&
                    "🟢 Ready"}

                {journal.reflection?.status === "pending" &&
                    "🟡 Pending"}

                {journal.reflection?.status === "failed" &&
                    "🔴 Failed"}
            </p>

            <hr />

            {isEditing ? (
    <>
        <button onClick={handleUpdate}>
            Save Changes
        </button>

        {" "}

        <button
            onClick={() => {
                setContent(journal.content);
                setIsEditing(false);
            }}
        >
            Cancel
        </button>
    </>
) : (
    <button
        onClick={() => setIsEditing(true)}
    >
        Edit Journal
    </button>
)}

            {"  "}

            <button onClick={handleDelete}>
                Delete Journal
            </button>
        </div>
    );
}

export default JournalDetailPage;