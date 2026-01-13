"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function StickyHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't show header on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Desktop Navigation - Handwritten Style */}
          <nav className="hidden md:block border-2 border-black px-8 py-4">
            <div className="flex items-center justify-around gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-handwriting text-2xl transition-all hover:scale-110 ${
                    isActive(link.href) ? "text-black font-bold" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "'Cedarville Cursive', cursive" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center justify-between">
            <Link href="/" className="font-mono font-bold text-xl">
              <span className="text-black">HRIDEY</span>
              <span className="text-gray-400">.DEV</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 border-2 border-black bg-white">
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-6 py-4 border-b last:border-b-0 border-black font-handwriting text-xl transition-colors ${
                      isActive(link.href)
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    style={{ fontFamily: "'Cedarville Cursive', cursive" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer */}
      <div className="h-24 md:h-28" />
    </>
  );
}

