import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Flame,
    SquarePen,
    ArrowRight,
} from "lucide-react";
import Button from "../components/Button";

import Layout from "../layout/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Card from "../components/Card";

import { getDashboardSummary } from "../api/dashboardService";


function DashboardPage() {
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
    return <LoadingSpinner />;
}

    if (error) {
    return (
        <Layout>
            <h2 className="text-red-500 text-center text-xl">
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
                                Dashboard
                            </h1>

                            <p className="text-slate-500 mt-2">
                                Welcome back. Here's your journaling progress.
                            </p>
                        </div>

                        <Link to="/journals/new">
                            <Button className="flex items-center gap-2">
                                <SquarePen size={18} />
                                New Entry
                            </Button>
                        </Link>

                    </div>

                    {/* Stats */}

                    <div className="grid md:grid-cols-2 gap-6 mb-10">

                        <Card>

                            <div className="flex items-center gap-3">

                                <BookOpen
                                    className="text-indigo-600"
                                    size={30}
                                />

                                <div>
                                    <p className="text-slate-500">
                                        Total Entries
                                    </p>

                                    <h2 className="text-3xl font-bold">
                                        {summary.totalEntries}
                                    </h2>
                                </div>

                            </div>

                        </Card>

                        <Card>

                            <div className="flex items-center gap-3">

                                <Flame
                                    className="text-orange-500"
                                    size={30}
                                />

                                <div>

                                    <p className="text-slate-500">
                                        Current Streak
                                    </p>

                                    <h2 className="text-3xl font-bold">

                                        {summary.currentStreak > 0
                                            ? `${summary.currentStreak} Days 🔥`
                                            : "Start Today ✨"}

                                    </h2>

                                </div>

                            </div>

                        </Card>

                    </div>

                    {/* Recent Entries */}

                    <Card className="p-6">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-semibold">
                                Recent Entries
                            </h2>

                            <Link
                                to="/journals"
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                            >
                                View All
                                <ArrowRight size={18} />
                            </Link>

                        </div>

                        {summary.recentEntries.length === 0 ? (

                            <div className="text-center py-16">

                                <BookOpen
                                    size={60}
                                    className="mx-auto text-slate-300"
                                />

                                <h3 className="text-xl font-semibold mt-4">
                                    No Journal Entries Yet
                                </h3>

                                <p className="text-slate-500 mt-2">
                                    Start writing your first journal today.
                                </p>

                                <Link to="/journals/new">
                                    <Button className="mt-6">
                                        Create First Entry
                                    </Button>
                                </Link>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                {summary.recentEntries.map((entry) => (

                                    <Link
                                        key={entry._id}
                                        to={`/journals/${entry._id}`}
                                        className="block border rounded-xl p-5 hover:bg-slate-50 transition"
                                    >

                                        <div className="flex justify-between">

                                            <h3 className="font-semibold text-lg">
                                                {new Date(
                                                    entry.createdAt
                                                ).toLocaleDateString()}
                                            </h3>

                                            <span className="text-sm text-slate-400">
                                                {entry.reflection?.status}
                                            </span>

                                        </div>

                                        <p className="text-slate-600 mt-3 line-clamp-2">
                                            {entry.content}
                                        </p>

                                    </Link>

                                ))}

                            </div>

                        )}

                    </Card>

                    </Layout>
    );
}

export default DashboardPage;