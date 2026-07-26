import { NavLink } from "react-router-dom";
import { LayoutDashboard, PenSquare, Search, Settings, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/journals", label: "Entries", icon: PenSquare },
    { to: "/search", label: "Search", icon: Search },
];

function Sidebar() {
    const { logout } = useAuth();

    return (
        <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r border-line bg-canvas px-5 py-6">
            <div className="flex items-center gap-2 px-2 mb-10">
                <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
                    <Sparkles className="text-white" size={18} />
                </div>
                <div>
                    <p className="font-display text-lg font-semibold leading-tight">Atlas</p>
                    <p className="text-[10px] tracking-widest text-ink-soft uppercase">Mindful Clarity</p>
                </div>
            </div>

            <nav className="flex flex-col gap-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                                isActive
                                    ? "bg-surface text-ink shadow-sm"
                                    : "text-ink-soft hover:bg-surface/60 hover:text-ink"
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6">
                <NavLink
                    to="/journals/new"
                    className="flex items-center justify-center gap-2 bg-ink text-white text-sm font-medium py-2.5 rounded-xl hover:bg-ink/90 transition"
                >
                    <PenSquare size={16} />
                    New Reflection
                </NavLink>

                <div className="flex flex-col gap-1 pt-3 border-t border-line">
                    <NavLink
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-surface/60 transition"
                    >
                        <Settings size={16} />
                        Settings
                    </NavLink>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-surface/60 transition text-left"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;