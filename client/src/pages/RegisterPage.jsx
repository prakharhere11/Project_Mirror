import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await register(name, email, password);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Name</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Creating Account..." : "Register"}
                </button>

            </form>

            <br />

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default RegisterPage;