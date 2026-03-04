const Footer = () => {
  return (
    <footer className="py-20 bg-navy-light border-t border-white/5">
      <div className="container mx-auto px-6">
        {/* Tagline */}
        <div className="mb-14">
          <p className="text-xl md:text-2xl font-display text-foreground/80">
            Transformamos casas con historia en inversiones con futuro.
          </p>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Empty spacer */}
          <div className="hidden md:block" />

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-5">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">About Us</a></li>
              <li><a href="#servicios" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Services</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Pricing</a></li>
              <li><a href="#contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-5">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Latest News</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Community</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Terms & Conditions</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-5">Quick links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">My account</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Affiliates</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">Support</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-5">Follow us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/25 hover:bg-white/5 transition-all duration-300"
                title="Follow on Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/25 hover:bg-white/5 transition-all duration-300"
                title="Follow on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-muted-foreground/60 text-center tracking-wide">
            © {new Date().getFullYear()} OGF Real Estate Group LLC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
