function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[420px]">

                <h2 className="text-2xl font-bold">
                    {title}
                </h2>

                <p className="text-slate-600 mt-4">
                    {message}
                </p>

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-xl border hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmModal;