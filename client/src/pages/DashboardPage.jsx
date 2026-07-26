import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Flame, Plus, ArrowRight } from "lucide-react";

import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../api/dashboardService";

function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-rose text-center">{error}</p>;
    if (!summary) return null;

    const firstName = user?.name?.split(" ")[0] || "there";

    return (
        <div>
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="font-display text-4xl text-ink">
                        Welcome back, {firstName}.
                    </h1>
                    <p className="text-ink-soft mt-2">
                        The clarity you seek is found within. Your thoughts are ready for exploration.
                    </p>
                </div>

                {summary.currentStreak > 0 && (
                    <div className="text-right shrink-0">
                        <p className="text-[11px] tracking-widest text-ink-soft uppercase mb-1">
                            Writing Streak
                        </p>
                        <p className="font-display text-2xl flex items-center gap-2 justify-end">
                            <Flame className="text-clay" size={22} />
                            {summary.currentStreak} Day{summary.currentStreak !== 1 ? "s" : ""}
                        </p>
                    </div>
                )}
            </div>

            <Card className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-accent-soft flex items-center justify-center">
                        <BookOpen className="text-accent" size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-ink-soft uppercase tracking-wide">Total Entries</p>
                        <p className="font-display text-2xl">{summary.totalEntries}</p>
                    </div>
                </div>

                <Link to="/journals/new">
                    <Button>
                        <Plus size={16} />
                        Start New Entry
                    </Button>
                </Link>
            </Card>

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl">Recent Reflections</h2>
                <Link to="/journals" className="text-sm text-accent hover:underline flex items-center gap-1">
                    View Archive <ArrowRight size={14} />
                </Link>
            </div>

            {summary.recentEntries.length === 0 ? (
                <Card className="text-center py-16">
                    <BookOpen size={40} className="mx-auto text-ink-soft mb-4" />
                    <h3 className="font-display text-xl mb-2">No reflections yet</h3>
                    <p className="text-ink-soft mb-6">Your first entry is a page away.</p>
                    <Link to="/journals/new">
                        <Button>Write your first entry</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid md:grid-cols-3 gap-5">
                    {summary.recentEntries.map((entry) => {
                        const status = entry.reflection?.status || "pending";
                        return (
                            <Link key={entry._id} to={`/journals/${entry._id}`}>
                                <Card className="h-full hover:shadow-md transition flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs text-ink-soft">
                                            {new Date(entry.createdAt).toLocaleDateString(undefined, {
                                                month: "short", day: "numeric", year: "numeric"
                                            })}
                                        </p>
                                        <Badge tone={status === "ready" ? "ready" : status === "failed" ? "failed" : "pending"}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Badge>
                                    </div>
                                    <p className="text-ink text-sm leading-relaxed line-clamp-3">
                                        {entry.content}
                                    </p>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;