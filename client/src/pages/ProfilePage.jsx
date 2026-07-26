import { useEffect, useState } from "react";
import { Mail, CalendarDays, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Card from "../components/Card";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProfile, updateProfile } from "../api/profileService";

function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data.user);
                setName(data.user.name);
            } catch {
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }
        try {
            const data = await updateProfile({ name: name.trim() });
            setProfile(data.user);
            setName(data.user.name);
            setEditing(false);
            toast.success("Profile updated.");
        } catch {
            toast.error("Update failed.");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!profile) {
        return (
            <div className="text-center py-20">
                <h2 className="font-display text-2xl text-rose">Failed to load profile.</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-line hover:bg-canvas transition mb-8"
                aria-label="Go back"
            >
                <ArrowLeft size={18} />
            </button>

            <Card className="p-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-ink text-white flex items-center justify-center font-display text-3xl">
                        {profile.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h1 className="font-display text-3xl text-ink">{profile.name}</h1>
                        <div className="flex items-center gap-2 text-ink-soft mt-2 text-sm">
                            <Mail size={16} />
                            <span>{profile.email}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="mt-6 flex items-center gap-3">
                <CalendarDays className="text-accent" size={20} />
                <div>
                    <p className="text-xs text-ink-soft uppercase tracking-wide">Member Since</p>
                    <p className="font-display text-lg">
                        {new Date(profile.createdAt).toLocaleDateString(undefined, {
                            month: "long", day: "numeric", year: "numeric"
                        })}
                    </p>
                </div>
            </Card>

            <Card className="mt-6">
                <h2 className="font-display text-2xl mb-6">Account Settings</h2>

                <label className="block mb-2 text-sm font-medium text-ink">Name</label>
                <input
                    className="w-full border border-line rounded-xl p-3 text-ink disabled:bg-canvas disabled:text-ink-soft focus:ring-2 focus:ring-accent outline-none"
                    value={name}
                    disabled={!editing}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="mt-6 flex gap-3">
                    {editing ? (
                        <>
                            <Button onClick={handleSave} disabled={name.trim() === profile.name}>
                                Save
                            </Button>
                            <Button
                                onClick={() => { setName(profile.name); setEditing(false); }}
                                className="bg-surface text-ink border border-line hover:bg-canvas"
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default ProfilePage;