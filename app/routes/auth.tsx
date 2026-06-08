import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Resume | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/Homepage.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark scrim over entire background */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

            {/* Floating centered card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Welcome Back
                        </h1>
                        <p className="text-blue-200 mt-3">
                            Analyze your resume with AI-powered insights
                        </p>
                    </div>

                    {isLoading ? (
                        <button className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold animate-pulse">
                            Signing you in...
                        </button>
                    ) : auth.isAuthenticated ? (
                        <button
                            onClick={auth.signOut}
                            className="w-full h-14 rounded-xl bg-white/15 border border-white/25 text-white font-semibold hover:bg-white/25 transition"
                        >
                            Log Out
                        </button>
                    ) : (
                        <button
                            onClick={auth.signIn}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] transition"
                        >
                            Log In
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Auth