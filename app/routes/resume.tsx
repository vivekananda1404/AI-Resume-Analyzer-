import {Link, useNavigate, useParams} from "react-router";

import {useEffect, useState} from "react";

import {usePuterStore} from "~/lib/puter";

import Summary from "~/components/Summary";

import ATS from "~/components/ATS";

import Details from "~/components/Details";



export const meta = () => ([

    { title: 'Resuming | Review ' },

    { name: 'description', content: 'Detailed overview of your resume' },

])



const Resume = () => {

    const { auth, isLoading, fs, kv } = usePuterStore();

    const { id } = useParams();

    const [imageUrl, setImageUrl] = useState('');

    const [resumeUrl, setResumeUrl] = useState('');

    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const navigate = useNavigate();



    useEffect(() => {

        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);

    }, [isLoading])



    useEffect(() => {

        const loadResume = async () => {

            const resume = await kv.get(`resume:${id}`);



            if(!resume) return;



            const data = JSON.parse(resume);



            const resumeBlob = await fs.read(data.resumePath);

            if(!resumeBlob) return;



            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });

            const resumeUrl = URL.createObjectURL(pdfBlob);

            setResumeUrl(resumeUrl);



            const imageBlob = await fs.read(data.imagePath);

            if(!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);

            setImageUrl(imageUrl);



            setFeedback(data.feedback);

            console.log({resumeUrl, imageUrl, feedback: data.feedback });

        }



        loadResume();

    }, [id]);

    if (feedback) {
        console.log("=== THE REAL ATS CONTENT ===");
        console.log(feedback?.sections?.ats_compatibility);
        console.log("============================");
    }



    // @ts-ignore
    return (

        <main className="pt-0!">

            <nav className="resume-nav">

                <Link to="/" className="back-button">

                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />

                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>

                </Link>

            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">

                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">

                    {imageUrl && resumeUrl && (

                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">

                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">

                                <img

                                    src={imageUrl}

                                    className="w-full h-full object-contain rounded-2xl"

                                    title="resume"

                                />

                            </a>

                        </div>

                    )}

                </section>

                <section className="feedback-section">

                    <h2 className="text-4xl text-black! font-bold">Resume Review</h2>

                    {feedback ? (

                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">

                            <Summary feedback={feedback} />
                            <ATS
                                score={feedback?.sections?.ats_compatibility?.score ?? 0}
                                suggestions={(() => {
                                    const rawFeedback = feedback?.sections?.ats_compatibility?.feedback;

                                    if (!rawFeedback) return [];

                                    // Split by numbered bullets like (1), (2), or 1., 2.
                                    const splitTips = rawFeedback
                                        .split(/\(\d+\)|\d+\./g)
                                        .map((text: string)  => text.trim())
                                        .filter((text: string | any[]) => text.length > 0);

                                    // If the string couldn't be split cleanly, just wrap the whole thing in one bullet
                                    if (splitTips.length === 0) {
                                        return [{ type: "improve" as const, tip: rawFeedback }];
                                    }

                                    // Map the split pieces into the array format your ATS component wants
                                    return splitTips.map((tipText: any) => ({
                                        type: "improve" as const, // Since it's an ATS warning string
                                        tip: tipText
                                    }));
                                })()}
                            />


                            <Details feedback={feedback} />

                        </div>

                    ) : (

                        <img src="/images/resume-scan-2.gif" alt="No image found" className="w-full" />

                    )}

                </section>

            </div>

        </main>



    )

}

export default Resume

