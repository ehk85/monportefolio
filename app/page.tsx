import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Education } from "@/components/Education";
import { LanguagesInterests } from "@/components/LanguagesInterests";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ContractProvider } from "@/components/ContractGate";

export default function Home() {
  return (
    <ContractProvider>
      <main className="min-h-screen bg-bg-primary">
        <Header />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <LanguagesInterests />
        <Contact />
        <Footer />
      </main>
    </ContractProvider>
  );
}
