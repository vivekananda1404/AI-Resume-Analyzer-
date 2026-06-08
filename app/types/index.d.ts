interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}



interface Feedback {
    overallScore: number;
    overallSummary?: string;    // Seen in console log
    improvements?: any[];// Seen in console log (array of 12 things)
    sections?: {
        [key: string]:{
            score: number;
            feedback?:string;
            tips?: Array<{
                type : "good" | "improve";
                tip : string;
                explanation? : string;
            }>;
        }
    }

    // Make these optional since the live payload currently lacks them
    ATS?: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle?: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
    };
    content?: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
    };
    structure?: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
    };
    skills?: {
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string; }[];
    };
}