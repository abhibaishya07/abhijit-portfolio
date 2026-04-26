"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";

const LINKS = [
  { label: "HOME", id: "home" },
  { label: "ABOUT", id: "about" },
  { label: "PROJECTS", id: "projects" },
  { label: "SKILLS", id: "skills" },
  { label: "EXPERIENCE", id: "experience" },
  { label: "CONTACT", id: "contact" }
];

export default function Navigation() {
  const isMobile = useIsMobile();
  const activeSection = usePortfolioStore((state) => state.activeSection);
  const mobileMenuOpen = usePortfolioStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = usePortfolioStore((state) => state.setMobileMenuOpen);

  const navigateTo = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState({}, "", `#${id}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="nav-shell px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="font-headline text-lg text-cyan [text-shadow:0_0_20px_rgba(0,240,255,0.7)] animate-pulse"
          >
            [AB]
          </button>

          {!isMobile ? (
            <div className="hidden items-center gap-5 md:flex">
              {LINKS.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`hud-link font-mono text-[0.68rem] tracking-[0.18em] ${
                    activeSection === link.id ? "active text-cyan" : "text-muted"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-rose md:flex">
              <span className="availability-dot">●</span>
              <span>Available for hire</span>
            </div>
            <div className="hidden border border-gold/70 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-gold [text-shadow:0_0_10px_rgba(245,158,11,0.35)] md:block">
              [GATE CS 2026]
            </div>
            {isMobile ? (
              <button
                type="button"
                className="font-mono text-xs uppercase tracking-[0.16em] text-cyan"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? "[Close]" : "[Menu]"}
              </button>
            ) : null}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobile && mobileMenuOpen ? (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-[#02050abf] backdrop-blur-md"
          >
            <div className="flex h-full flex-col justify-center px-10">
              {LINKS.map((link, index) => (
                <motion.button
                  key={link.id}
                  type="button"
                  onClick={() => navigateTo(link.id)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.06 }}
                  className="py-3 text-left font-headline text-[clamp(1.2rem,6vw,2rem)] tracking-tight text-cyan"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
