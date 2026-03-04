import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Areas from "@/components/Areas";
import CTA from "@/components/CTA";
import BeforeAfter from "@/components/BeforeAfter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <Areas />
        <CTA />
        <BeforeAfter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
