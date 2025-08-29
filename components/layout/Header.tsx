"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Heart, GitCompare, BarChart3, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Launches", icon: Rocket },
    {
      href: "/favorites",
      label: "Favorites",
      icon: Heart,
    },
    { href: "/compare", label: "Compare", icon: GitCompare },
    { href: "/stats", label: "Stats", icon: BarChart3 },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "glass-card shadow-xl" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl gradient-text-hover">
              SpaceX Explorer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur"></div>
                    )}
                    <div
                      className={clsx(
                        "relative flex items-center gap-2",
                        isActive && "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
