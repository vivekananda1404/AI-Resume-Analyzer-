import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {resumes} from "../../constants";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analysis" },
    { name: "description", content: "AI score & feedback of Resumes !" },
  ];
}

export default function Home() {
  return <main
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/bg-main.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
  >

      <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>AI Powered Resume Analysis</h1>
        <h2>AI insights that take one step closer to your dream Job </h2>
      </div>

      {resumes.length > 0 && (

          <div>
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume ={resume} />
              ))}
          </div>
      )}
    </section>
  </main>;
}
