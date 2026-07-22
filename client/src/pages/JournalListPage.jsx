import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJournals } from "../api/journalService";

function JournalListPage() {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const data = await getAllJournals();

                // Backend may return either an array or { journals: [...] }
                    setJournals(Array.isArray(data.entries) ? data.entries : []);            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load journals."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJournals();
    }, []);

    if (loading) {
        return <h2>Loading journals...</h2>;
    }

    if (error) {
        return (
            <div>
                <h2>{error}</h2>
            </div>
        );
    }

    if (journals.length === 0) {
        return (
            <div>
                <h2>No journal entries yet.</h2>
                <p>Start writing your first reflection.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>My Journals</h1>

            {journals.map((journal) => (
                <div
                    key={journal._id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                    }}
                >
                    <h3>
                        {new Date(journal.createdAt).toLocaleDateString()}
                    </h3>

                    <p>
                        {journal.content.length > 120
                            ? journal.content.substring(0, 120) + "..."
                            : journal.content}
                    </p>

                    <p>
                        <strong>Reflection:</strong>{" "}
                        {journal.reflection?.status === "ready" && "🟢 Ready"}
                        {journal.reflection?.status === "pending" && "🟡 Pending"}
                        {journal.reflection?.status === "failed" && "🔴 Failed"}
                    </p>

                    <Link to={`/journals/${journal._id}`}>
                        View Entry
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default JournalListPage;