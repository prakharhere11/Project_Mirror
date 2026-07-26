import { useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import { searchJournals } from "../api/journalService";

function highlightMatch(text, query) {
    if (!query.trim()) return text;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark key={i} className="bg-accent-soft text-accent rounded px-0.5">
                {part}
            </mark>
        ) : (
            part
        )
    );
}

function SearchPage() {
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            toast.error("Enter something to search.");
            return;
        }

        try {
            setLoading(true);
            const data = await searchJournals(query);
            setResults(data.entries || []);
            setSubmittedQuery(query);
            setHasSearched(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Search failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl text-ink mb-2">Search Reflections</h1>
            <p className="text-ink-soft mb-8">Reconnect with your past thoughts and growth.</p>

            <form onSubmit={handleSearch} className="relative mb-10">
                <SearchIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your reflections..."
                    className="w-full border border-line rounded-xl py-3.5 pl-12 pr-28 text-ink placeholder:text-ink-soft/60 focus:ring-2 focus:ring-accent outline-none bg-surface"
                />
                <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 py-2 px-4">
                    Search
                </Button>
            </form>

            {loading && <LoadingSpinner />}

            {!loading && hasSearched && results.length === 0 && (
                <Card className="text-center py-16">
                    <p className="text-ink-soft">No reflections matched "{submittedQuery}".</p>
                </Card>
            )}

            {!loading && results.length > 0 && (
                <div className="flex flex-col gap-4">
                    {results.map((journal) => {
                        const status = journal.reflection?.status || "pending";
                        return (
                            <Link key={journal._id} to={`/journals/${journal._id}`}>
                                <Card className="hover:shadow-md transition">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-ink-soft uppercase tracking-wide mb-2">
                                                {new Date(journal.createdAt).toLocaleDateString(undefined, {
                                                    month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </p>
                                            <p className="text-ink leading-relaxed line-clamp-3">
                                                {highlightMatch(journal.content, submittedQuery)}
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

export default SearchPage;