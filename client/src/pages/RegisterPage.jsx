import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const [submitting,setSubmitting]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        setSubmitting(true);

        try{
            await register(name,email,password);

            toast.success("Account created!");

            navigate("/dashboard");
        }
        catch(err){
            toast.error(
                err.response?.data?.message ||
                "Registration failed"
            );
        }
        finally{
            setSubmitting(false);
        }
    };

    return(
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

                <p className="text-slate-500 text-center mt-2">
                    Join Atlas today
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <div>
                        <label className="block mb-2 font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition"
                    >
                        {submitting
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>

                <p className="text-center mt-6 text-slate-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-semibold"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default RegisterPage;