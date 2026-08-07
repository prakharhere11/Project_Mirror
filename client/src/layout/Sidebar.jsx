import { NavLink } from "react-router-dom";
import { LayoutDashboard, PenSquare, Search, Settings, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/journals", label: "Entries", icon: PenSquare },
    { to: "/search", label: "Search", icon: Search },
];

function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();

    return (
        <>
            {/* Backdrop — only visible on mobile when drawer is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed lg:sticky top-0 left-0 z-50
                    w-64 h-screen flex flex-col
                    border-r border-line bg-canvas px-5 py-6
                    transition-transform duration-200
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
                            <Sparkles className="text-white" size={18} />
                        </div>
                        <div>
                            <p className="font-display text-lg font-semibold leading-tight">Atlas</p>
                            <p className="text-[10px] tracking-widest text-ink-soft uppercase">Mindful Clarity</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-ink-soft">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
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
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 bg-ink text-white text-sm font-medium py-2.5 rounded-xl hover:bg-ink/90 transition"
                    >
                        <PenSquare size={16} />
                        New Reflection
                    </NavLink>

                    <div className="flex flex-col gap-1 pt-3 border-t border-line">
                        <NavLink
                            to="/profile"
                            onClick={onClose}
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
        </>
    );
}

export default Sidebar;