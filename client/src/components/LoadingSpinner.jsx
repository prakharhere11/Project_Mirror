import { LoaderCircle } from "lucide-react";

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-20">

            <LoaderCircle
                className="animate-spin text-indigo-600"
                size={40}
            />

        </div>
    );
}

export default LoadingSpinner;