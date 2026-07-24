import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100">
                <div className="max-w-6xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </>
    );
}

export default Layout;