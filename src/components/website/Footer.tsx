"use client";

import { useRef } from "react";

export default function Footer() {
  // 5-tap detection for Master Admin — redirects to /racemaster
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = () => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2000); // Reset after 2 seconds of no taps

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      // Redirect to Master Admin page
      window.location.href = "/racemaster";
    }
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #080f2e 0%, #0a1540 50%, #0d0a2e 100%)" }}>
      {/* Color-shifting top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, #0055ff, #7c3aff, #ff3d00, #0055ff)",
          backgroundSize: "200% 100%",
          animation: "raceSlide 3s linear infinite",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* RACE COMPUTER text — 5-tap for Master Admin */}
          <button
            onClick={handleTap}
            className="flex items-center gap-3 cursor-pointer select-none active:scale-95 transition-transform"
            aria-label="Race Computer"
          >
            <span
              className="font-extrabold text-lg tracking-wide"
              style={{
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(135deg, #0055ff, #7c3aff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              RACE COMPUTER
            </span>
          </button>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#hero" className="hover:text-white transition">Home</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#products" className="hover:text-white transition">Products</a>
            <a href="#gallery" className="hover:text-white transition">Gallery</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2025 RACE COMPUTER &middot; SANGANER, JAIPUR &middot; ALL RIGHTS RESERVED</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ boxShadow: "0 0 8px rgba(0,85,255,0.5)" }} />
              <span>AUTHORIZED ASUS PARTNER</span>
            </div>
          </div>
        </div>

        {/* Powered by AQERIONX — color-changing gradient */}
        <div className="mt-6 pt-4 border-t border-gray-800/50 text-center">
          <p className="text-xs tracking-widest uppercase font-medium">
            Powered by{" "}
            <span className="aqerionx-powered font-extrabold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              AQERIONX
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
