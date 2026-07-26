function Button({ children, className = "", ...props }) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-ink/90 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
export default Button;