import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Education } from "@/components/Education";
import { LanguagesInterests } from "@/components/LanguagesInterests";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ContractProvider } from "@/components/ContractGate";

// Revalide la page régulièrement pour que les nouveaux avis approuvés
// (via /admin) apparaissent sans avoir besoin d'un redéploiement.
export const revalidate = 120;

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
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </ContractProvider>
  );
}
