"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Menu, X, Package } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { view, setView, siteTheme } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (view !== "main") {
      setView("main");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (view !== "main") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b shadow-sm" style={{ borderColor: `${siteTheme.primaryColor}30` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Image + Text */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Image
              src="/race-logo.jpg"
              alt="Race Computer"
              width={36}
              height={36}
              className="rounded-lg shadow-sm"
              priority
            />
            <span className="font-extrabold text-lg tracking-wide race-title-gradient" style={{ fontFamily: "'Syne', sans-serif" }}>
              RACE COMPUTER
            </span>
          </button>

          {/* Desktop Nav — No Admin/Staff buttons for customer site */}
          <div className="hidden md:flex items-center gap-5">
            <button onClick={() => scrollTo("hero")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Home</button>
            <button onClick={() => scrollTo("services")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Services</button>
            <button onClick={() => setView("fullProducts")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> Products
            </button>
            <button onClick={() => { useAppStore.getState().setBookingModalOpen(true); }} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Book Service</button>
            <button onClick={() => scrollTo("gallery")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Gallery</button>
            <button onClick={() => scrollTo("about")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">About</button>
            <button onClick={() => scrollTo("contact")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Contact</button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — No Admin/Staff buttons */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-blue-100/50 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <button onClick={() => scrollTo("hero")} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Home</button>
            <button onClick={() => scrollTo("services")} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Services</button>
            <button onClick={() => { setMobileOpen(false); setView("fullProducts"); }} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Products
            </button>
            <button onClick={() => { setMobileOpen(false); useAppStore.getState().setBookingModalOpen(true); }} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Book Service</button>
            <button onClick={() => scrollTo("gallery")} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Gallery</button>
            <button onClick={() => scrollTo("about")} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">About</button>
            <button onClick={() => scrollTo("contact")} className="block w-full text-left py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Contact</button>
          </div>
        </div>
      )}
    </nav>
  );
}
