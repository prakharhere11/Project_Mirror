import Card from "./Card";

function StatCard({
    icon,
    title,
    value,
}) {
    return (
        <Card>

            <div className="flex items-center gap-3">

                {icon}

                <div>

                    <h3 className="text-slate-500">
                        {title}
                    </h3>

                    <h2 className="text-3xl font-bold">
                        {value}
                    </h2>

                </div>

            </div>

        </Card>
    );
}

export default StatCard;