import React, { useState, useEffect } from "react";
import { Menu, X, Instagram } from "lucide-react";
import { cn } from "../../lib/utils";
import logoImg from "@/assets/Official Logo.jpeg";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

const NAV_ITEMS = ["Home", "Showreel", "Services", "Projects", "About", "Contact"];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = React.useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      // Smart header logic: hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-[160] w-full transform-gpu transition-all duration-500 ease-in-out",
          scrolled 
            ? "bg-black/90 border-b border-[#8C0B0C]/20 shadow-[0_10px_40px_rgba(140,11,12,0.15)] py-4 backdrop-blur-md" 
            : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-6 sm:py-8 border-b border-transparent",
          !isVisible && !isMenuOpen ? "-translate-y-[150%]" : "translate-y-0"
        )}
      >
        <div className="w-full px-4 md:px-[5%] flex items-center justify-between">
          <Link 
            to="/" 
            onClick={(e) => {
              e.preventDefault();
              navigate("/", { state: { scrollTo: "home", _nonce: Date.now() }, replace: false });
            }}
            className="flex items-center gap-3 z-50 group"
          >
            <div className="relative flex items-center justify-center h-12 md:h-16 w-auto overflow-hidden transition-all duration-500">
              <img src={logoImg} alt="Phase One VFX Logo" className="h-full w-auto object-contain" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase transition-colors duration-500">
              <span className="text-[#8C0B0C] font-bold tracking-[0.2em] uppercase">Phase One</span>
              <span className="ml-2 text-white group-hover:text-neutral-300 font-bold tracking-[0.2em] uppercase">VFX</span>
            </span>
          </Link>

          <button
            className="relative z-[160] flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-white transition-all hover:border-[#8C0B0C]/50 hover:bg-[#8C0B0C]/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* Side Panel Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-0 z-[150] bg-black/60 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[155] w-full max-w-[320px] md:max-w-[400px] xl:max-w-[500px] bg-black/95 border-l border-[#8C0B0C]/20 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] flex flex-col justify-center px-8 md:px-12"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right_center,rgba(140,11,12,0.15)_0%,transparent_70%)] opacity-50 pointer-events-none" />
              
              <nav className="flex flex-col items-start gap-8 md:gap-10 relative z-10 w-full mt-10">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <Link
                      to="/"
                      className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-[300] tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 transition-all hover:to-[#8C0B0C] hover:translate-x-3 block leading-none"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/", { state: { scrollTo: item.toLowerCase(), _nonce: Date.now() }, replace: false });
                        setIsMenuOpen(false);
                      }}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Instagram icon at bottom of panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: NAV_ITEMS.length * 0.08 + 0.3, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute bottom-10 left-8 md:left-12 z-10"
              >
                <a
                  href="https://www.instagram.com/phaseonevfx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group flex items-center gap-3"
                >
                  <div
                    className="h-12 w-12 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center transition-all duration-300 group-hover:border-pink-500/50 group-hover:bg-pink-500/10"
                    style={{ boxShadow: "0 0 14px rgba(225,48,108,0.35)" }}
                  >
                    <Instagram className="w-5 h-5 text-pink-400 transition-colors group-hover:text-pink-300" />
                  </div>
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
