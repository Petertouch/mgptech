import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
      <button
        onClick={() => setLang("es")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
          lang === "es" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
        }`}
        aria-label="Español"
      >
        <svg className="w-4 h-3 rounded-sm overflow-hidden" viewBox="0 0 640 480">
          <rect width="640" height="480" fill="#c60b1e"/>
          <rect width="640" height="160" fill="#c60b1e"/>
          <rect y="160" width="640" height="160" fill="#ffc400"/>
          <rect y="320" width="640" height="160" fill="#c60b1e"/>
        </svg>
        ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
          lang === "en" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
        }`}
        aria-label="English"
      >
        <svg className="w-4 h-3 rounded-sm overflow-hidden" viewBox="0 0 640 480">
          <rect width="640" height="480" fill="#012169"/>
          <path d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" fill="#fff"/>
          <path d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#c8102e"/>
          <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#fff"/>
          <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#c8102e"/>
        </svg>
        EN
      </button>
    </div>
  );
}
