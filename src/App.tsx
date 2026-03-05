import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardProject from "./pages/DashboardProject";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectEdit from "./pages/admin/AdminProjectEdit";
import AdminInvestors from "./pages/admin/AdminInvestors";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import Servicios from "./pages/Servicios";

import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/servicios" element={<Servicios />} />

              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />

              {/* Investor routes */}
              <Route path="/dashboard" element={<ProtectedRoute requiredRole="investor"><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/project/:id" element={<ProtectedRoute requiredRole="investor"><DashboardProject /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="super_admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/:id" element={<AdminProjectEdit />} />
                <Route path="investors" element={<AdminInvestors />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/:id" element={<AdminBlogEdit />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
