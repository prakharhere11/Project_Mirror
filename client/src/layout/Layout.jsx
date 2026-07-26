import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
    return (
        <div className="flex min-h-screen bg-canvas">
            <Sidebar />
            <main className="flex-1 px-10 py-10 max-w-6xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;