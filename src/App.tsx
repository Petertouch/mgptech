import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Servicios from "./pages/Servicios";
import About from "./pages/About";

import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";
import ChatWidget from "@/components/ChatWidget";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/about" element={<About />} />

              <Route path="/contacto" element={<Contacto />} />

              {/* Login / dashboard de inversionistas y admin viven SOLO en OGF (ogfrealstate.com).
                  Aquí se redirigen a nivel de hosting vía vercel.json. */}

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ChatWidget />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    </LanguageProvider>
  </HelmetProvider>
);

export default App;
