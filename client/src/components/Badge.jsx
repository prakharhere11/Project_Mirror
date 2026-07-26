const styles = {
    ready: "bg-sage-soft text-sage",
    pending: "bg-clay-soft text-clay",
    failed: "bg-rose-soft text-rose",
    neutral: "bg-accent-soft text-accent",
};

function Badge({ tone = "neutral", children }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[tone]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {children}
        </span>
    );
}
export default Badge;