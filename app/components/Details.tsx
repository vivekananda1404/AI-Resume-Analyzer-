import { cn } from "~/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordion";

// Helper to turn camelCase keys into clean titles (e.g., "workExperience" -> "Work Experience")
const formatTitle = (key: string): string => {
    const spaced = key.replace(/([A-Z])/g, " $1");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const ScoreBadge = ({ score }: { score: number }) => {
    return (
        <div
            className={cn(
                "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
                score > 69
                    ? "bg-badge-green"
                    : score > 39
                        ? "bg-badge-yellow"
                        : "bg-badge-red"
            )}
        >
            <img
                src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="score"
                className="size-4"
            />
            <p
                className={cn(
                    "text-sm font-medium",
                    score > 69
                        ? "text-badge-green-text"
                        : score > 39
                            ? "text-badge-yellow-text"
                            : "text-badge-red-text"
                )}
            >
                {score}/100
            </p>
        </div>
    );
};

const CategoryHeader = ({
                            title,
                            categoryScore,
                        }: {
    title: string;
    categoryScore: number;
}) => {
    return (
        <div className="flex flex-row gap-4 items-center py-2">
            <p className="text-2xl font-semibold text-gray-800">{title}</p>
            <ScoreBadge score={categoryScore} />
        </div>
    );
};

const CategoryContent = ({
                             tips = [],
                             feedback,
                         }: {
    tips: { type?: "good" | "improve"; tip: string; explanation?: string }[];
    feedback?: string;
}) => {
    // Handle when AI returns a plain string instead of a tips array
    if ((!tips || tips.length === 0) && feedback) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-yellow-700">{feedback}</p>
            </div>
        );
    }

    if (!tips || tips.length === 0) {
        return <p className="text-gray-500 italic p-4">No specific tips provided.</p>;
    }

    return (
        <div className="flex flex-col gap-4 items-center w-full">
            {/* Top Quick-View Summary Grid */}
            <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                {tips.map((tip, index) => {
                    const isGood = tip.type === "good";
                    return (
                        <div className="flex flex-row gap-2 items-center" key={`summary-${index}`}>
                            <img
                                src={isGood ? "/icons/check.svg" : "/icons/warning.svg"}
                                alt="score"
                                className="size-5"
                            />
                            <p className="text-xl text-gray-600">{tip.tip}</p>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Cards Section */}
            <div className="flex flex-col gap-4 w-full">
                {tips.map((tip, index) => {
                    const isGood = tip.type === "good";
                    return (
                        <div
                            key={`detail-${index}-${tip.tip}`}
                            className={cn(
                                "flex flex-col gap-2 rounded-2xl p-4",
                                isGood
                                    ? "bg-green-50 border border-green-200 text-green-700"
                                    : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                            )}
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <img
                                    src={isGood ? "/icons/check.svg" : "/icons/warning.svg"}
                                    alt="score"
                                    className="size-5"
                                />
                                <p className="text-xl font-semibold">{tip.tip}</p>
                            </div>
                            {tip.explanation && <p className="text-gray-700 mt-1">{tip.explanation}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Details = ({ feedback }: { feedback: any }) => {
    // Dynamically grab all valid section keys returned from your backend payload
    // Exclude 'keyGaps' if it doesn't fit into the structured accordion schema
    const sectionKeys = Object.keys(feedback?.sections || {}).filter(
        (key) => key !== "keyGaps"
    );

    return (
        <div className="flex flex-col gap-4 w-full">
            <Accordion>
                {sectionKeys.map((key) => {
                    const sectionData = feedback.sections[key];
                    const sectionTitle = formatTitle(key);

                    return (
                        <AccordionItem id={key} key={key}>
                            <AccordionHeader itemId={key}>
                                <CategoryHeader
                                    title={sectionTitle}
                                    categoryScore={sectionData?.score ?? 0}
                                />
                            </AccordionHeader>
                            <AccordionContent itemId={key}>
                                <CategoryContent tips={sectionData?.tips ?? []}
                                   feedback ={sectionData?.feedback}/>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default Details;