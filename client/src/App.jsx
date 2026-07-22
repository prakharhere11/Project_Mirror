import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import CreateJournalPage from "./pages/CreateJournalPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import JournalListPage from "./pages/JournalListPage";
import JournalDetailPage from "./pages/JournalDetailPage";


function App() {
    return (
        <Routes>

            {/* Public Only Routes */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                    path="/journals"
                    element={<JournalListPage />}
                />
                </Route>

            {/* Default */}
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* Catch All */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
            <Route path="/journals/new" element={<CreateJournalPage />} />
            <Route
            path="/journals/:id"
            element={<JournalDetailPage />}
        />
        </Routes>
    );
}

export default App;