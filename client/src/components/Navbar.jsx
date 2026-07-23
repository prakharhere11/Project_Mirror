import { Link, useNavigate } from "react-router-dom";
import {
    Home,
    BookOpen,
    SquarePen,
    User,
    LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="text-2xl font-bold tracking-wide"
                >
                    Atlas
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 hover:text-indigo-200 transition"
                    >
                        <Home size={18} />
                        Dashboard
                    </Link>

                    <Link
                        to="/journals"
                        className="flex items-center gap-2 hover:text-indigo-200 transition"
                    >
                        <BookOpen size={18} />
                        Journals
                    </Link>

                    <Link
                        to="/journals/new"
                        className="flex items-center gap-2 hover:text-indigo-200 transition"
                    >
                        <SquarePen size={18} />
                        New Entry
                    </Link>

                    <Link
                        to="/profile"
                        className="flex items-center gap-2 hover:text-indigo-200 transition"
                    >
                        <User size={18} />
                        Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;