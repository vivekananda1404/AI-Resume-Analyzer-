import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

// Helper to turn camelCase keys into clean titles (e.g., "workExperience" -> "Work Experience")
const formatTitle = (key: string): string => {
    const spaced = key.replace(/([A-Z])/g, " $1");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 49
            ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary border-b border-gray-100 last:border-none p-4">
            <div className="category flex justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-xl font-medium text-gray-700">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-xl font-semibold text-gray-800">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: any }) => {
    console.log("Available sections keys:", Object.keys(feedback.sections || {}));

    // Grab all valid section keys from your backend payload, excluding utility sections if you want
    const sectionKeys = Object.keys(feedback.sections || {}).filter(
        (key) => key !== 'keyGaps' // Optional: exclude sections that don't have scores
    );

    return (
        <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden">
            <div className="flex flex-row items-center p-6 gap-8 bg-gray-50 border-b border-gray-100">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the individual section evaluations below.
                    </p>
                </div>
            </div>

            {/* Dynamically render a card for each real section from your data */}
            <div className="divide-y divide-gray-100">
                {sectionKeys.map((key) => (
                    <Category
                        key={key}
                        title={formatTitle(key)}
                        score={feedback.sections[key]?.score ?? 0}
                    />
                ))}
            </div>
        </div>
    )
}

export default Summary;