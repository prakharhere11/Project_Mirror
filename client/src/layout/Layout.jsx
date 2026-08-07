import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-canvas">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile-only top bar */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-line bg-surface sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
                            <Sparkles className="text-white" size={14} />
                        </div>
                        <span className="font-display font-semibold">Atlas</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="text-ink">
                        <Menu size={22} />
                    </button>
                </div>

                <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-6xl mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;