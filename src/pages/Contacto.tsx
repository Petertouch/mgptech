import Header from "@/components/Header";
import CTA from "@/components/CTA";
import BeforeAfter from "@/components/BeforeAfter";
import Footer from "@/components/Footer";

const Contacto = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <CTA />
        <BeforeAfter />
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
