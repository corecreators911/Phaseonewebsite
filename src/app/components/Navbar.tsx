import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import logoImg from "@/assets/a2e2c8a6ed7fae1fb56e5aa4277b6dad6f92533f.png";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = ["Home", "Showreel", "Departments", "Projects", "About", "Contact"];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-[160] w-full transform-gpu transition-all duration-300 ease-in-out",
          scrolled 
            ? "bg-black/90 border-b border-[#8C0B0C]/20 shadow-[0_10px_40px_rgba(140,11,12,0.15)] py-4 backdrop-blur-lg" 
            : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-6 sm:py-8 border-b border-transparent"
        )}
      >
        <div className="w-full px-4 md:px-[5%] flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 z-50 group">
            <div className="relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 group-hover:border-[#8C0B0C]/50 group-hover:shadow-[0_0_15px_rgba(140,11,12,0.4)]">
              <img src={logoImg} alt="Phase One Logo" className="h-5 w-5 object-contain" />
            </div>
            <span className="text-lg font-bold tracking-[0.2em] uppercase text-white transition-colors duration-500 group-hover:text-neutral-300">
              Phase <span className="text-[#8C0B0C]">One</span>
            </span>
          </a>

          {/* Desktop Tube-Light Navigation */}
          <nav
            className="hidden lg:flex items-center p-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-lg shadow-inner relative z-50 transition-all duration-500 hover:border-white/20"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {NAV_ITEMS.map((item, i) => {
              const isContact = item === "Contact";

              return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onMouseEnter={() => setHoveredIndex(i)}
                className={cn(
                  "relative px-4 xl:px-6 py-2 xl:py-2.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                  isContact ? "text-white bg-[#8C0B0C]/20 border border-[#8C0B0C]/50 rounded-full shadow-[0_0_15px_rgba(140,11,12,0.3)] hover:bg-[#8C0B0C]/40 hover:shadow-[0_0_20px_rgba(140,11,12,0.5)]" : "text-neutral-400 hover:text-white"
                )}
              >
                {!isContact && hoveredIndex === i && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 z-0 rounded-full border border-[#8C0B0C]/40 bg-gradient-to-r from-[#8C0B0C]/30 via-[#8C0B0C]/10 to-transparent shadow-[0_0_20px_rgba(140,11,12,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10 mix-blend-plus-lighter">{item}</span>
              </a>
              );
            })}
          </nav>

          <button
            className="lg:hidden relative z-[160] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-white transition-all hover:border-[#8C0B0C]/50 hover:bg-[#8C0B0C]/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[155] flex flex-col items-center justify-center bg-black/95"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,11,12,0.15)_0%,transparent_70%)] opacity-50 pointer-events-none" />
            
            <nav className="flex flex-col items-center gap-8 relative z-10">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 transition-all hover:to-[#8C0B0C] hover:scale-110 hover:tracking-[0.05em]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
