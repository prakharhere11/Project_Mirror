import { Link } from "react-router-dom";
import Card from "./Card";

function EmptyState({
    icon,
    title,
    description,
    buttonText,
    buttonLink,
}) {
    return (
        <Card className="text-center p-12">

            <div className="flex justify-center mb-5">
                {icon}
            </div>

            <h2 className="text-2xl font-bold">
                {title}
            </h2>

            <p className="text-slate-500 mt-3">
                {description}
            </p>

            {buttonText && (

                <Link
                    to={buttonLink}
                    className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
                >
                    {buttonText}
                </Link>

            )}

        </Card>
    );
}

export default EmptyState;