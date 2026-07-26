import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../components/Card";
import Button from "../components/Button";
import { createJournal } from "../api/journalService";

function CreateJournalPage() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Journal cannot be empty.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await createJournal({ content });
            navigate(`/journals/${response.entry._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save journal.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-line hover:bg-surface transition mb-8"
                aria-label="Go back"
            >
                <ArrowLeft size={18} />
            </button>

            <h1 className="font-display text-4xl text-ink mb-2">
                What's on your mind today?
            </h1>
            <p className="text-ink-soft mb-8">
                Write freely — your reflection will follow once you save.
            </p>

            <Card className="p-8">
                <form onSubmit={handleSubmit}>
                    <textarea
                        rows={14}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Today felt..."
                        autoFocus
                        className="w-full border-none outline-none resize-none text-ink leading-8 placeholder:text-ink-soft/60 text-lg"
                    />

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-line">
                        <p className="text-xs text-ink-soft flex items-center gap-1.5">
                            <Sparkles size={14} />
                            MIRROR will reflect on this once saved
                        </p>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : "Save Entry"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default CreateJournalPage;