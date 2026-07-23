import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import JournalListPage from "./pages/JournalListPage";
import JournalDetailPage from "./pages/JournalDetailPage";
import CreateJournalPage from "./pages/CreateJournalPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
    return (
        
        <Routes>

            {/* Public Routes */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/journals" element={<JournalListPage />} />
        <Route path="/journals/new" element={<CreateJournalPage />} />
        <Route path="/journals/:id" element={<JournalDetailPage />} />
    </Route>
</Route>

            {/* Default Route */}
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* Catch-all Route */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
        
    );
}

export default App;