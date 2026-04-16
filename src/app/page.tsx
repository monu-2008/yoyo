"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import Navbar from "@/components/website/Navbar";
import ServiceBooking from "@/components/website/ServiceBooking";
import Services from "@/components/website/Services";
import Products from "@/components/website/Products";
import Gallery from "@/components/website/Gallery";
import About from "@/components/website/About";
import Contact from "@/components/website/Contact";
import Footer from "@/components/website/Footer";
import FloatingButtons from "@/components/website/FloatingButtons";
import TickerBar from "@/components/website/TickerBar";
import FullProducts from "@/components/website/FullProducts";
import IntroSplash from "@/components/website/IntroSplash";

const BackgroundAnimation = dynamic(() => import("@/components/website/BackgroundAnimation"), { ssr: false });
const Hero = dynamic(() => import("@/components/website/Hero"), { ssr: false });

export default function Home() {
  const { view, bookingModalOpen, siteTheme, setSiteTheme } = useAppStore();
  const [introComplete, setIntroComplete] = useState(false);
  const [bgTransition, setBgTransition] = useState(false);

  // Load theme from Firebase on mount
  useEffect(() => {
    const themeRef = ref(db, "settings/theme");
    const unsub = onValue(themeRef, (snap) => {
      if (snap.exists()) {
        const theme = snap.val();
        setSiteTheme({
          primaryColor: theme.primaryColor || "#0055ff",
          backgroundColor: theme.backgroundColor || "#ffffff",
          accentColor: theme.accentColor || "#ff3d00",
          secondaryColor: theme.secondaryColor || "#7c3aff",
        });
      }
    });
    return () => { unsub(); };
  }, [setSiteTheme]);

  // Background color transition animation
  useEffect(() => {
    setBgTransition(true);
    const timer = setTimeout(() => setBgTransition(false), 600);
    return () => clearTimeout(timer);
  }, [siteTheme.backgroundColor]);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  if (view === "fullProducts") {
    return <FullProducts />;
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundColor: siteTheme.backgroundColor,
        transition: "background-color 0.6s ease-in-out",
      }}
    >
      {/* Background transition overlay */}
      {bgTransition && (
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${siteTheme.primaryColor}08 0%, transparent 70%)`,
            animation: "fadeOut 0.6s ease-out forwards",
          }}
        />
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {!introComplete && <IntroSplash onComplete={handleIntroComplete} />}
      <div className="race-color-bar" />
      {introComplete && <BackgroundAnimation />}
      <Navbar />
      <main className="flex-1 relative z-10">
        <div className="pt-16">
          {introComplete && <Hero />}
          <TickerBar />
        </div>
        <Services />
        <Products />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
      {bookingModalOpen && <ServiceBooking />}
    </div>
  );
}
