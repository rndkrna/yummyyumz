import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useSmoothScroll } from "./smoothScrollContext";

export default function Navbar() {
  const lenis = useSmoothScroll();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobilePanelRef = useRef(null);
  const menuLinksRef = useRef([]);

  const links = [
    { label: "HOME", to: "/" },
    { label: "CATALOG", to: "/catalog" },
    { label: "ABOUT", to: "/about" },
    { label: "CONTACT", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobilePanelRef.current, {
        y: "0%",
        duration: 0.8,
        ease: "expo.inOut",
      });
      gsap.fromTo(
        menuLinksRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.4,
          ease: "expo.out",
        },
      );
    } else {
      gsap.to(mobilePanelRef.current, {
        y: "-100%",
        duration: 0.7,
        ease: "expo.inOut",
      });
    }
  }, [isMobileMenuOpen]);

  const handleNavigate = (path) => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setTimeout(() => {
      navigate(path);
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
    }, 700);
  };

  const addToRefs = (el) => {
    if (el && !menuLinksRef.current.includes(el)) {
      menuLinksRef.current.push(el);
    }
  };

  return (
    <>
      {/* Dim overlay when menu is open */}
      <div
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-md transition-opacity duration-700 ease-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-16 py-4 md:py-6 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-between items-start">
          {/* Brutalist Logo - Enhanced */}
          <div
            className="font-display font-extrabold text-white text-2xl md:text-3xl tracking-tighter uppercase pointer-events-auto cursor-pointer bg-gradient-to-r from-bakeryBerry to-bakeryPeach bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 ease-out"
            data-cursor-hover
            onClick={() => handleNavigate("/")}
          >
            Yummy
            <br />
            Yumz
          </div>

          {/* Hamburger (Always visible on desktop and mobile) */}
          <div className="flex space-x-2 md:space-x-4 pointer-events-auto mix-blend-normal">
            <button className="bg-gradient-to-br from-bakeryBerry to-bakeryPeach border-3 border-white w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out">
              <span className="font-display font-bold text-white text-sm md:text-base">
                0
              </span>
            </button>
            <button className="hidden md:flex bg-gradient-to-br from-bakeryBerry to-bakeryPeach border-3 border-white px-6 h-12 items-center justify-center rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out">
              <span className="font-body font-bold text-sm text-white uppercase">
                Bahasa
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              data-cursor-hover
              className="bg-gradient-to-br from-bakeryBerry to-bakeryPeach border-3 border-white px-3 md:px-6 h-10 md:h-12 flex items-center justify-center rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <span className="font-display font-bold text-xs md:text-sm text-white uppercase mr-2">
                Menu
              </span>
              <div className="flex flex-col space-y-1.5 w-3 md:w-4">
                <div className="h-[2.5px] bg-white w-full rounded-full"></div>
                <div className="h-[2.5px] bg-white w-full rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Drop-down Panel - Enhanced */}
      <div
        ref={mobilePanelRef}
        className="fixed top-0 left-0 w-full h-auto pb-20 z-[60] bg-gradient-to-br from-bakeryBerry via-bakeryBerry to-bakeryPeach text-white transform -translate-y-full shadow-2xl"
      >
        {/* Menu Header */}
        <div className="relative pt-8 px-8 flex justify-between items-start z-10 max-w-[1400px] mx-auto w-full md:px-16">
          {/* Language Switcher */}
          <div className="flex border-3 border-white/40 bg-white/10 shadow-lg rounded-lg backdrop-blur-sm">
            <button className="px-5 py-2 font-display text-sm font-bold text-white bg-transparent transition-colors hover:bg-white/20">
              ua
            </button>
            <button className="px-5 py-2 font-display text-sm font-bold text-white bg-white/10 transition-colors hover:bg-white/20 border-l-3 border-white/20">
              en
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-12 h-12 flex items-center justify-center border-3 border-white text-white hover:bg-white/20 transition-all rounded-lg shadow-lg"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="w-full flex flex-col justify-center px-10 md:px-24 mt-16 relative max-w-[1400px] mx-auto">
          <div className="flex flex-col space-y-4">
            {links.map((link, idx) => (
              <div key={idx} className="overflow-hidden">
                <button
                  ref={addToRefs}
                  onClick={() => handleNavigate(link.to)}
                  data-cursor-hover
                  className="font-display font-bold text-[2.8rem] md:text-7xl uppercase text-left text-white hover:text-bakeryBg transition-all duration-500 ease-out leading-[1.1] tracking-tight hover:scale-105 transform origin-left"
                >
                  {link.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
