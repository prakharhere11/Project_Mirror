import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";

import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAllJournals } from "../api/journalService";

function JournalListPage() {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const data = await getAllJournals();
                setJournals(Array.isArray(data.entries) ? data.entries : []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load journals.");
            } finally {
                setLoading(false);
            }
        };
        fetchJournals();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <Card className="text-center py-16">
                <p className="text-rose mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="font-display text-4xl text-ink">Your Entries</h1>
                    <p className="text-ink-soft mt-2">
                        {journals.length} reflection{journals.length !== 1 ? "s" : ""} written so far.
                    </p>
                </div>
                <Link to="/journals/new">
                    <Button>
                        <Plus size={16} />
                        New Entry
                    </Button>
                </Link>
            </div>

            {journals.length === 0 ? (
                <Card className="text-center py-20">
                    <BookOpen size={40} className="mx-auto text-ink-soft mb-4" />
                    <h3 className="font-display text-xl mb-2">No journal entries yet</h3>
                    <p className="text-ink-soft mb-6">Start writing your first reflection.</p>
                    <Link to="/journals/new">
                        <Button>Write your first entry</Button>
                    </Link>
                </Card>
            ) : (
                <div className="flex flex-col gap-4">
                    {journals.map((journal) => {
                        const status = journal.reflection?.status || "pending";
                        return (
                            <Link key={journal._id} to={`/journals/${journal._id}`}>
                                <Card className="hover:shadow-md transition">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-ink-soft uppercase tracking-wide mb-2">
                                                {new Date(journal.createdAt).toLocaleDateString(undefined, {
                                                    weekday: "long", month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </p>
                                            <p className="text-ink leading-relaxed line-clamp-2">
                                                {journal.content}
                                            </p>
                                        </div>
                                        <Badge tone={status === "ready" ? "ready" : status === "failed" ? "failed" : "pending"}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Badge>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default JournalListPage;