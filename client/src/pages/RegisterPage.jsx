// RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Sparkles } from "lucide-react";
import Button from "../components/Button";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await register(name, email, password);
            toast.success("Account created!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <span className="font-display text-xl font-semibold">Atlas</span>
                </div>

                <div className="bg-surface border border-line rounded-2xl shadow-sm p-8">
                    <h1 className="font-display text-3xl text-center text-ink">Create Account</h1>
                    <p className="text-ink-soft text-center mt-2">Join Atlas today</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-ink">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-line rounded-xl px-4 py-3 text-ink focus:ring-2 focus:ring-accent outline-none bg-surface"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-ink">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-line rounded-xl px-4 py-3 text-ink focus:ring-2 focus:ring-accent outline-none bg-surface"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-ink">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-line rounded-xl px-4 py-3 text-ink focus:ring-2 focus:ring-accent outline-none bg-surface"
                            />
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full py-3">
                            {submitting ? "Creating Account..." : "Register"}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-sm text-ink-soft">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent font-medium hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;