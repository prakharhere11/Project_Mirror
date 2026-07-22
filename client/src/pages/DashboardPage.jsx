import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Welcome, {user?.name}</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default DashboardPage;