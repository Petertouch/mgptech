import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl sm:text-8xl font-bold text-primary/20">404</h1>
        <p className="mb-6 text-lg sm:text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#A88C2C] transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
