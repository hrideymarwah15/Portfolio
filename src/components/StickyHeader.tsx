"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  sectionId?: string;
}

export default function StickyHeader() {
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Don't show header on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navLinks: NavLink[] = [
    { href: "/", label: "HOME" },
    { href: "/#about", label: "ABOUT", sectionId: "about" },
    { href: "/#projects", label: "WORK", sectionId: "projects" },
    { href: "/blog", label: "BLOG" },
    { href: "/#contact", label: "CONTACT", sectionId: "contact" },
  ];

  // Hide/show navbar on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsMobileMenuOpen(false);
    } else {
      setHidden(false);
    }
  });

  // Active section detection
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const handleScroll = () => {
      const sections = ["about", "projects", "contact"];
      let currentSection: string | null = null;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = sectionId;
            break;
          }
        }
      }

      // If at hero (top), set null to highlight HOME
      if (window.scrollY < 300) {
        currentSection = null;
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (link: NavLink) => {
    if (pathname !== "/" && link.href === "/") return false;
    if (link.href === "/" && pathname === "/" && !activeSection) return true;
    if (link.sectionId && activeSection === link.sectionId) return true;
    if (!link.sectionId && link.href !== "/" && pathname?.startsWith(link.href)) return true;
    return false;
  };

  return (
    <>
      {/* Floating Navbar */}
      <motion.nav
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Desktop Navigation */}
        <div
          className="hidden md:flex pointer-events-auto bg-white/95 backdrop-blur-sm border-2 border-black px-6 py-3 items-center gap-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-mono font-bold text-lg mr-4 flex items-center gap-1"
            style={{ borderRadius: "2px 8px 3px 8px / 8px 3px 8px 2px" }}
          >
            <span className="text-black">Hridey</span>
          </Link>

          {/* Nav Links */}
          {navLinks.map((link) => (
            <NavLinkItem
              key={link.href}
              link={link}
              isActive={isActive(link)}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div
          className="md:hidden pointer-events-auto w-full bg-white/95 backdrop-blur-sm border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ borderRadius: "15px 15px 15px 15px" }}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="font-mono font-bold text-lg">
              <span className="text-black">Hridey</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 border-t-2 border-dashed border-gray-300 pt-4"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 font-mono font-bold text-sm border-2 border-black transition-all ${isActive(link)
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                      } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}

// Nav Link with Sketch Underline
function NavLinkItem({ link, isActive }: { link: NavLink; isActive: boolean }) {
  return (
    <Link
      href={link.href}
      className="relative group py-1 cursor-pointer font-mono font-bold text-sm"
    >
      <span
        className={`relative z-10 transition-colors ${isActive ? "text-black" : "text-gray-500 group-hover:text-black"
          }`}
      >
        {link.label}
      </span>

      {/* Yellow highlight layer (always visible when active, on hover otherwise) */}
      <svg
        className={`absolute -bottom-1 left-0 w-full h-2 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        viewBox="0 0 60 8"
        preserveAspectRatio="none"
      >
        <path
          d="M2 5 Q 15 2 30 5 T 58 4"
          stroke="#ffeb3b"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Black outline layer */}
      <svg
        className={`absolute -bottom-1 left-0 w-full h-2 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        viewBox="0 0 60 8"
        preserveAspectRatio="none"
      >
        <path
          d="M2 5 Q 15 2 30 5 T 58 4"
          stroke="black"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
