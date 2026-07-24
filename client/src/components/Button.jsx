function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center gap-2
                px-5 py-3
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-medium
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
}

export default Button;