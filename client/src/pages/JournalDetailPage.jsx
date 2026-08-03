import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    Pencil,
    Trash2,
    Save,
    X,
} from "lucide-react";

import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
    getJournalById,
    updateJournal,
    deleteJournal,
    retryReflection,
} from "../api/journalService";
import { toast } from "react-toastify";

const categoryStyles = {
    summary: { label: "Summary", text: "text-accent" },
    emotions: { label: "Emotions", text: "text-rose" },
    positiveObservation: { label: "Positive Observation", text: "text-sage" },
    reflectionQuestions: { label: "Reflection Questions", text: "text-clay" },
    suggestion: { label: "Actionable Suggestion", text: "text-denim" },
};

function JournalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [journal, setJournal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [retrying, setRetrying] = useState(false);

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const data = await getJournalById(id);
                setJournal(data.entry);
                setContent(data.entry.content);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load journal.");
            } finally {
                setLoading(false);
            }
        };
        fetchJournal();
    }, [id]);

    useEffect(() => {
        if (!journal || journal.reflection?.status !== "pending") return;
        let attempts = 0;
        const MAX_ATTEMPTS = 15;
        const intervalId = setInterval(async () => {
            attempts++;
            try {
                const data = await getJournalById(id);
                if (data.entry.reflection?.status !== "pending") {
                    setJournal(data.entry);
                    clearInterval(intervalId);
                }
            } catch {
                clearInterval(intervalId);
            }
            if (attempts >= MAX_ATTEMPTS) clearInterval(intervalId);
        }, 3000);
        return () => clearInterval(intervalId);
    }, [journal?.reflection?.status, id]);

    const handleUpdate = async () => {
        if (!content.trim()) {
            toast.error("Journal cannot be empty.");
            return;
        }
        try {
            const response = await updateJournal(id, { content });
            setJournal(response.entry);
            setContent(response.entry.content);
            setIsEditing(false);
            toast.success("Journal updated.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update journal.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteJournal(id);
            toast.success("Journal deleted.");
            navigate("/journals");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete journal.");
        }
    };

const handleRetry = async () => {
    setRetrying(true);

    try {
        const response = await retryReflection(id);

        setJournal(response.entry);

        toast.success("Reflection generated successfully!");
    } catch (err) {
        toast.error(
            err.response?.data?.message ||
            "Failed to generate reflection."
        );
    } finally {
        setRetrying(false);
    }
};

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-rose text-center">{error}</p>;
    if (!journal) return null;

    const status = journal.reflection?.status || "pending";
    const badgeTone = status === "ready" ? "ready" : status === "failed" ? "failed" : "pending";

    return (
        <div>
            {/* Top bar: back button + breadcrumb + status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-line hover:bg-surface transition"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-ink-soft">
                        <span>Journal Entry</span>
                        <span>/</span>
                        <span className="text-ink font-medium">
                            {new Date(journal.createdAt).toLocaleDateString(undefined, {
                                month: "long", day: "numeric", year: "numeric"
                            })}
                        </span>
                    </div>
                </div>
                <Badge tone={badgeTone}>
                    {status === "ready" ? "Reflection Ready" : status === "failed" ? "Reflection Failed" : "Reflecting..."}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                {/* Left: journal content */}
                <Card className="p-8">
                    <div className="flex items-center gap-2 text-xs text-ink-soft uppercase tracking-widest mb-6">
                        <CalendarDays size={14} />
                        {new Date(journal.createdAt).toLocaleString(undefined, {
                            weekday: "long", hour: "numeric", minute: "2-digit"
                        })}
                    </div>

                    {isEditing ? (
                        <textarea
                            rows={14}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-line rounded-xl p-4 text-ink leading-relaxed focus:ring-2 focus:ring-accent outline-none"
                        />
                    ) : (
                        <p className="text-ink leading-8 whitespace-pre-wrap">
                            {journal.content}
                        </p>
                    )}

                    <div className="flex gap-3 flex-wrap mt-10 pt-6 border-t border-line">
                        {isEditing ? (
                            <>
                                <Button onClick={handleUpdate}>
                                    <Save size={16} /> Save Changes
                                </Button>
                                <Button
                                    onClick={() => { setContent(journal.content); setIsEditing(false); }}
                                    className="bg-surface text-ink border border-line hover:bg-canvas"
                                >
                                    <X size={16} /> Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                <Pencil size={16} /> Edit Entry
                            </Button>
                        )}
                        <Button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-surface text-rose border border-rose-soft hover:bg-rose-soft"
                        >
                            <Trash2 size={16} /> Delete
                        </Button>
                    </div>
                </Card>

                {/* Right: AI reflection panel */}
                <Card className="p-6 lg:sticky lg:top-10">
                    <h2 className="font-display text-xl mb-6">AI Reflection</h2>

                    
                    {status === "ready" ? (

                    <div className="space-y-7">
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${categoryStyles.summary.text}`}>
                                    Summary
                                </p>
                                <p className="font-display italic text-ink leading-relaxed">
                                    "{journal.reflection.summary}"
                                </p>
                            </div>

                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${categoryStyles.emotions.text}`}>
                                    Emotions
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {journal.reflection.emotions.map((emotion) => (
                                        <span key={emotion} className="bg-rose-soft text-rose text-xs px-3 py-1 rounded-full">
                                            {emotion}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${categoryStyles.positiveObservation.text}`}>
                                    Positive Observation
                                </p>
                                <p className="text-sm text-ink leading-relaxed">
                                    {journal.reflection.positiveObservation}
                                </p>
                            </div>

                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${categoryStyles.reflectionQuestions.text}`}>
                                    Reflection Questions
                                </p>
                                <ul className="space-y-3">
                                    {journal.reflection.reflectionQuestions.map((q) => (
                                        <li key={q} className="text-sm text-ink leading-relaxed border-l-2 border-clay-soft pl-3">
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${categoryStyles.suggestion.text}`}>
                                    Actionable Suggestion
                                </p>
                                <p className="text-sm text-ink leading-relaxed">
                                    {journal.reflection.suggestion}
                                </p>
                            </div>
                        </div>

                ) : status === "failed" ? (

                        <div className="space-y-4">
                            <p className="text-sm text-rose">
                                Reflection couldn't be generated.
                                Please try again.
                            </p>

                            <Button
                                onClick={handleRetry}
                                disabled={retrying}
                            >
                                {retrying ? "Retrying..." : "Retry Reflection"}
                            </Button>
                        </div>

                    ) : (

                        <p className="text-sm text-ink-soft">
                            Reading through your entry...
                        </p>

                    )}
                </Card>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Journal"
                message="This action cannot be undone."
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() => { setShowDeleteModal(false); handleDelete(); }}
            />
        </div>
    );
}

export default JournalDetailPage;