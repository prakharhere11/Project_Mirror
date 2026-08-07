import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Flame, Search, ArrowRight } from "lucide-react";

function LandingPage() {
    return (
        <div className="min-h-screen bg-canvas">
            {/* Top nav */}
            <header className="flex items-center justify-between px-6 sm:px-10 py-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <div>
                        <p className="font-display text-lg font-semibold leading-tight">Atlas</p>
                        <p className="text-[10px] tracking-widest text-ink-soft uppercase">Mindful Clarity</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-ink transition">
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-ink text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-ink/90 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
                <h1 className="font-display text-5xl sm:text-6xl text-ink leading-tight">
                    Reflect with clarity,
                    <br />
                    grow with purpose.
                </h1>
                <p className="text-ink-soft text-lg mt-6 max-w-xl mx-auto">
                    Atlas turns daily journaling into guided self-reflection — write freely,
                    and let AI help you notice patterns, ask better questions, and grow.
                </p>
                <div className="flex items-center justify-center gap-4 mt-10">
                    <Link
                        to="/register"
                        className="flex items-center gap-2 bg-ink text-white text-sm font-medium px-6 py-3.5 rounded-xl hover:bg-ink/90 transition"
                    >
                        Start Writing
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        to="/login"
                        className="text-sm font-medium text-ink border border-line px-6 py-3.5 rounded-xl hover:bg-surface transition"
                    >
                        I have an account
                    </Link>
                </div>
            </section>

            {/* Feature highlights */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-surface border border-line rounded-2xl p-6">
                        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                            <BookOpen className="text-accent" size={20} />
                        </div>
                        <h3 className="font-display text-lg mb-2">Write freely</h3>
                        <p className="text-sm text-ink-soft leading-relaxed">
                            No prompts, no pressure — just an honest space for your thoughts, every day.
                        </p>
                    </div>

                    <div className="bg-surface border border-line rounded-2xl p-6">
                        <div className="w-10 h-10 rounded-xl bg-sage-soft flex items-center justify-center mb-4">
                            <Sparkles className="text-sage" size={20} />
                        </div>
                        <h3 className="font-display text-lg mb-2">Reflect deeper</h3>
                        <p className="text-sm text-ink-soft leading-relaxed">
                            AI reads what you wrote and offers a summary, emotions, and honest
                            questions — like a thoughtful friend, not a therapist.
                        </p>
                    </div>

                    <div className="bg-surface border border-line rounded-2xl p-6">
                        <div className="w-10 h-10 rounded-xl bg-clay-soft flex items-center justify-center mb-4">
                            <Flame className="text-clay" size={20} />
                        </div>
                        <h3 className="font-display text-lg mb-2">Track your growth</h3>
                        <p className="text-sm text-ink-soft leading-relaxed">
                            Writing streaks, entry history, and full-text search — watch your
                            self-reflection build over time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="max-w-3xl mx-auto text-center px-6 pb-24">
                <div className="bg-surface border border-line rounded-2xl p-10">
                    <h2 className="font-display text-2xl mb-3">Ready to start reflecting?</h2>
                    <p className="text-ink-soft mb-6">It takes less than a minute to begin.</p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-ink text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-ink/90 transition"
                    >
                        Create your account
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <footer className="text-center text-xs text-ink-soft pb-8">
                Atlas — not a substitute for therapy or professional mental health support.
            </footer>
        </div>
    );
}

export default LandingPage;