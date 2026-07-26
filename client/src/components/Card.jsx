function Card({ children, className = "" }) {
    return (
        <div className={`bg-surface border border-line rounded-2xl shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
}
export default Card;