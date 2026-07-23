import { useEffect, useState } from "react";
import {Mail, CalendarDays} from "lucide-react";
import { toast } from "react-toastify";

import Layout from "../layout/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

import { getProfile, updateProfile } from "../api/profileService";

function ProfilePage() {

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

            const data = await updateProfile({
    name: name.trim(),
});

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
        <Layout>
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-red-500">
                    Failed to load profile.
                </h2>
            </div>
        </Layout>
    );
}

    return (

        <Layout>

            <div className="max-w-4xl mx-auto">

                <Card className="p-8">

                    <div className="flex items-center gap-6">

                        <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold">

                            {profile.name?.charAt(0).toUpperCase() || "U"}

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold">

                                {profile.name}

                            </h1>

                            <div className="flex items-center gap-2 text-slate-500 mt-2">
                                <Mail size={18} />
                                <span>{profile.email}</span>
                            </div>

                        </div>

                    </div>

                </Card>

                <div className="grid md:grid-cols-1 gap-6 mt-8">

                    

                   
                   

                    <Card>

                        <CalendarDays className="text-green-600 mb-3" />

                        <p>Member Since</p>

                        <h2 className="text-lg font-semibold">

                            {new Date(profile.createdAt).toLocaleDateString()}

                        </h2>

                    </Card>
                    

                </div>
                 <p className="text-center text-slate-500 mt-6 mb-2 italic">
    Keep reflecting. Every journal makes your AI insights smarter.
</p>
                <Card className="mt-8">

                    <h2 className="text-2xl font-bold mb-6">

                       Account Settings

                    </h2>

                    <label className="block mb-2">

                        Name

                    </label>

                    <input

                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"

                        value={name}

                        disabled={!editing}

                        onChange={(e)=>setName(e.target.value)}

                    />

                    <div className="mt-6 flex gap-4">

                        {editing ? (

                            <>

                                <Button
                                    onClick={handleSave}
                                    disabled={name.trim() === profile.name}
                                >
                                    Save
                                </Button>

                                <Button

                                    className="bg-slate-500 hover:bg-slate-600"

                                    onClick={()=>{
                                        setName(profile.name);
                                        setEditing(false);
                                    }}

                                >

                                    Cancel

                                </Button>

                            </>

                        ) : (

                            <Button

                                onClick={()=>setEditing(true)}

                            >

                                Edit Profile

                            </Button>

                        )}

                    </div>

                </Card>

            </div>

        </Layout>

    );

}

export default ProfilePage;