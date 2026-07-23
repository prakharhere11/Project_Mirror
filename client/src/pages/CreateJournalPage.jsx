import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJournal } from "../api/journalService";
import { toast } from "react-toastify";


function CreateJournalPage() {
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
           toast.warning("Journal cannot be empty.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const response = await createJournal({ content });

            navigate(`/journals/${response.entry._id}`);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to save journal."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-slate-900">
                    New Journal Entry
                </h1>

                <p className="text-slate-500 mt-2">
                    Take a moment to reflect on your day.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-white rounded-2xl shadow-md p-8"
                >
                    <label className="block text-lg font-semibold mb-4">
                        What's on your mind today?
                    </label>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={14}
                        placeholder="Start writing..."
                        className="w-full border border-slate-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-slate-400">
                            {content.length} characters
                        </span>

                        <span className="text-sm text-slate-400">
                            AI reflection will be generated after saving
                        </span>
                    </div>

                    {error && (
                        <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 mt-8">

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-xl transition"
                        >
                            {submitting
                                ? "Saving..."
                                : "Save Journal"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/journals")}
                            className="border border-slate-300 hover:bg-slate-100 px-6 py-3 rounded-xl transition"
                        >
                            Cancel
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
}

export default CreateJournalPage;