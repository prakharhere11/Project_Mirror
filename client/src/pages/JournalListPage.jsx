import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    CircleCheckBig,
    LoaderCircle,
    CircleAlert,
    SquarePen,
} from "lucide-react";

import Layout from "../layout/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import Button from "../components/Button";

import { getAllJournals } from "../api/journalService";

function JournalListPage() {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const data = await getAllJournals();
                setJournals(data.entries || []);
            } catch (err) {
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
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <Layout>
                <h2 className="text-center text-red-500 text-xl">
                    {error}
                </h2>
            </Layout>
        );
    }

    return (
        <Layout>

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-4xl font-bold text-slate-800">
                        My Journals
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Reflect, revisit and grow.
                    </p>
                </div>

                <Link to="/journals/new">
                    <Button className="flex items-center gap-2">
                        <SquarePen size={18} />
                        New Entry
                    </Button>
                </Link>

            </div>

            {journals.length === 0 ? (

                <EmptyState
                    icon={<BookOpen size={70} className="text-slate-300" />}
                    title="No Journal Entries Yet"
                    description="Begin your self-reflection journey today."
                    buttonText="Create First Entry"
                    buttonLink="/journals/new"
                />

            ) : (

                <div className="grid gap-6">

                    {journals.map((journal) => (

                        <Link
                            key={journal._id}
                            to={`/journals/${journal._id}`}
                        >

                            <Card className="hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

                                <div className="flex justify-between items-center">

                                    <h2 className="font-bold text-lg">
                                        {new Date(
                                            journal.createdAt
                                        ).toLocaleDateString()}
                                    </h2>

                                    {journal.reflection?.status === "ready" && (
                                        <span className="flex items-center gap-2 text-green-600 font-medium">
                                            <CircleCheckBig size={18} />
                                            Ready
                                        </span>
                                    )}

                                    {journal.reflection?.status === "pending" && (
                                        <span className="flex items-center gap-2 text-yellow-600 font-medium">
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Pending
                                        </span>
                                    )}

                                    {journal.reflection?.status === "failed" && (
                                        <span className="flex items-center gap-2 text-red-600 font-medium">
                                            <CircleAlert size={18} />
                                            Failed
                                        </span>
                                    )}

                                </div>

                                <p className="text-slate-600 mt-4 line-clamp-3">
                                    {journal.content}
                                </p>

                            </Card>

                        </Link>

                    ))}

                </div>

            )}

        </Layout>
    );
}

export default JournalListPage;