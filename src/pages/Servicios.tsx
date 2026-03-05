import Header from "@/components/Header";
import Services from "@/components/Services";
import Areas from "@/components/Areas";
import BeforeAfter from "@/components/BeforeAfter";
import Footer from "@/components/Footer";

const Servicios = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Services />
        <Areas />
        <BeforeAfter />
      </main>
      <Footer />
    </div>
  );
};

export default Servicios;
