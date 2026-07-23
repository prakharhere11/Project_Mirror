import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import ConfirmModal from "../components/ConfirmModal";
import {
    CalendarDays,
    Pencil,
    Trash2,
    Save,
    X,
    CircleCheckBig,
    LoaderCircle,
    CircleAlert,
} from "lucide-react";

import Layout from "../layout/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";import {
    getJournalById,
    updateJournal,
    deleteJournal,
} from "../api/journalService";

import { toast } from "react-toastify";

function JournalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [journal, setJournal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
            toast.error("Journal cannot be empty.");
            return;
        }

        try {
            const response = await updateJournal(id, {
                content,
            });

            setJournal(response.entry);
            setContent(response.entry.content);

            setIsEditing(false);

            toast.success("Journal updated successfully.");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    "Failed to update journal."
            );
        }
    };

    const handleDelete = async () => {
    try {
        await deleteJournal(id);

        toast.success("Journal deleted.");

        navigate("/journals");
    } catch (err) {
        toast.error(
            err.response?.data?.message ||
            "Failed to delete journal."
        );
    }
};

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

                    <Card className="p-8">

                        <h1 className="text-3xl font-bold mb-6">
                            Journal Entry
                        </h1>

                        <div className="flex items-center gap-3 text-slate-500 mb-8">

                            <CalendarDays size={20} />

                            {new Date(
                                journal.createdAt
                            ).toLocaleString()}

                        </div>

                        <div className="mb-8">

                            <h2 className="text-xl font-semibold mb-4">
                                Content
                            </h2>

                            {isEditing ? (
                                <textarea
                                    rows={12}
                                    value={content}
                                    onChange={(e) =>
                                        setContent(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            ) : (
                                <p className="leading-8 text-slate-700 whitespace-pre-wrap">
                                    {journal.content}
                                </p>
                            )}

                        </div>

                        <div className="mb-8">

                            <h2 className="text-xl font-semibold mb-4">
                                Reflection Status
                            </h2>

                            {journal.reflection?.status ===
                                "ready" && (
                                <span className="flex items-center gap-2 text-green-600 font-semibold">
                                    <CircleCheckBig />
                                    Ready
                                </span>
                            )}

                            {journal.reflection?.status ===
                                "pending" && (
                                <span className="flex items-center gap-2 text-yellow-600 font-semibold">
                                    <LoaderCircle className="animate-spin" />
                                    Pending
                                </span>
                            )}

                            {journal.reflection?.status ===
                                "failed" && (
                                <span className="flex items-center gap-2 text-red-600 font-semibold">
                                    <CircleAlert />
                                    Failed
                                </span>
                            )}

                        </div>
                        <Card className="mt-8">

    <h2 className="text-2xl font-bold mb-6">
        AI Reflection
    </h2>

    {journal.reflection?.status !== "ready" ? (

        <p className="text-slate-500">
            Reflection is not available yet.
        </p>

    ) : (

        <div className="space-y-6">

            <div>
                <h3 className="font-semibold text-indigo-600">
                    Summary
                </h3>

                <p className="mt-2">
                    {journal.reflection.summary}
                </p>
            </div>

            <div>
                <h3 className="font-semibold text-pink-600">
                    Emotions
                </h3>

                <div className="flex flex-wrap gap-2 mt-2">

                    {journal.reflection.emotions.map((emotion) => (

                        <span
                            key={emotion}
                            className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                        >
                            {emotion}
                        </span>

                    ))}

                </div>
            </div>

            <div>
                <h3 className="font-semibold text-green-600">
                    Positive Observation
                </h3>

                <p className="mt-2">
                    {journal.reflection.positiveObservation}
                </p>
            </div>

            <div>
                <h3 className="font-semibold text-orange-600">
                    Reflection Questions
                </h3>

                <ul className="list-disc ml-6 mt-2 space-y-2">

                    {journal.reflection.reflectionQuestions.map((question) => (

                        <li key={question}>
                            {question}
                        </li>

                    ))}

                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-blue-600">
                    Actionable Suggestion
                </h3>

                <p className="mt-2">
                    {journal.reflection.suggestion}
                </p>
            </div>

        </div>

    )}

</Card>

                        <div className="flex gap-4 flex-wrap">

                            {isEditing ? (
                                <>
                                    <Button
                                            onClick={handleUpdate}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                        >
                                            <Save size={18} />
                                            Save Changes
                                        </Button>

                                    <Button
                                        onClick={() => {
                                            setContent(journal.content);
                                            setIsEditing(false);
                                        }}
                                        className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Pencil size={18} />
                                        Edit Journal
                                    </Button>
                            )}

                            <Button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                            >
                                <Trash2 size={18} />
                                Delete
                            </Button>

                        </div>

                    </Card>

                
            <ConfirmModal
            isOpen={showDeleteModal}
            title="Delete Journal"
            message="This action cannot be undone."
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => {
                setShowDeleteModal(false);
                handleDelete();
            }}
        />

        </Layout>
    );
}

export default JournalDetailPage;