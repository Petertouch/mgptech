import logoIcon from "@/assets/logo-icon.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-10 sm:py-16 bg-navy-light border-t border-white/5" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Logo + Copyright */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="MGP Capital Group LLC" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0" />
            <div className="text-left">
              <span className="text-white font-bold text-sm sm:text-base tracking-wide">MGP CAPITAL</span>
              <span className="block text-[9px] sm:text-[10px] text-gray-400 tracking-widest uppercase">Group LLC</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <span>© {new Date().getFullYear()} MGP Capital Group LLC.</span>
            <a href="#" className="hover:text-foreground transition-colors duration-300">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
