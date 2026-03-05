import Header from "@/components/Header";
import Areas from "@/components/Areas";
import Footer from "@/components/Footer";

const AreasPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Areas />
      </main>
      <Footer />
    </div>
  );
};

export default AreasPage;
