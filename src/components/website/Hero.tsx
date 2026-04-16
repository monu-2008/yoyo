"use client";

import dynamic from "next/dynamic";
import { Suspense, Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Users, Wrench, ArrowRight, Building2, Award, Headphones, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";

const Race3DObject = dynamic(() => import("@/components/website/Race3DObject"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-32 h-24 rounded-lg border-2 border-blue-400/50 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="text-blue-400 font-mono text-xs tracking-widest">RACE</div>
        </div>
        <div className="w-8 h-1 bg-blue-400/30 mx-auto" />
        <div className="w-16 h-1 bg-blue-400/20 mx-auto rounded" />
        <div className="absolute inset-0 -m-8 border border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: "8s" }} />
        <div className="absolute inset-0 -m-14 border border-purple-400/10 rounded-full animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
      </div>
    </div>
  ),
});

class ThreeJSErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("Three.js component error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            <div className="w-40 h-28 rounded-xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <div className="text-center"><div className="text-blue-400 font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>RACE</div><div className="text-purple-400/60 font-mono text-[8px] tracking-widest">COMPUTER</div></div>
            </div>
            <div className="w-10 h-1 bg-blue-400/30 mx-auto" />
            <div className="w-20 h-1.5 bg-blue-400/20 mx-auto rounded" />
            <div className="absolute inset-0 -m-10 border border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: "6s" }} />
            <div className="absolute inset-0 -m-16 border border-purple-400/15 rounded-full animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Hero() {
  const { setView, setBookingModalOpen, siteTheme } = useAppStore();
  const pc = siteTheme.primaryColor;
  const ac = siteTheme.accentColor;
  const sc = siteTheme.secondaryColor;

  return (
    <section id="hero" className="relative min-h-[85vh] sm:min-h-screen flex items-center overflow-hidden">
      {/* Animated background blobs using theme colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl animate-pulse" style={{ background: `${pc}20` }} />
        <div className="absolute -bottom-40 -left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl animate-pulse" style={{ background: `${sc}15`, animationDelay: "1s" }} />
        <div className="absolute top-1/3 left-1/3 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full blur-3xl animate-pulse" style={{ background: `${ac}10`, animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${pc}06 1px, transparent 1px), linear-gradient(90deg, ${pc}06 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-4 sm:space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm" style={{ borderColor: `${pc}30`, animation: "fadeUp 0.7s 0.2s both" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: pc, boxShadow: `0 0 8px ${pc}80` }} />
              <span className="text-[10px] sm:text-xs font-medium tracking-wider uppercase font-mono" style={{ color: `${pc}` }}>Sanganer, Jaipur · Est. 2001</span>
            </div>

            {/* Title */}
            <div className="space-y-1 sm:space-y-2" style={{ animation: "fadeUp 0.8s 0.3s both" }}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight race-title-gradient" style={{ fontFamily: "'Syne', sans-serif", lineHeight: 0.9, letterSpacing: "-1.5px" }}>
                RACE
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "'Syne', sans-serif", lineHeight: 0.9, letterSpacing: "-1.5px" }}>
                COMPUTER
              </h1>
              <div className="font-mono text-[9px] sm:text-[clamp(0.48rem,1.1vw,0.68rem)] tracking-[3px] sm:tracking-[6px] text-gray-400 mt-2 sm:mt-3 uppercase">
                Next-Gen Tech Hub, Jaipur
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-lg text-gray-600 max-w-lg leading-relaxed border-l-2 pl-4 sm:pl-5" style={{ animation: "fadeUp 0.7s 0.5s both", borderColor: pc }}>
              Jaipur&apos;s most trusted tech destination since 2001. <strong style={{ color: pc }}>Laptops, PCs, printers</strong> and expert home repair service — all under one roof.
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2" style={{ animation: "fadeUp 0.7s 0.6s both" }}>
              {[
                { label: "Since 2001", dotColor: pc },
                { label: "4★ Rating", dotColor: "#f5a623" },
                { label: "ASUS Partner", dotColor: "#00d68f" },
                { label: "Home Service", dotColor: ac },
                { label: "9000+ Customers", dotColor: sc },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <span className="w-[4px] sm:w-[5px] h-[4px] sm:h-[5px] rounded-full shrink-0" style={{ background: stat.dotColor, boxShadow: `0 0 6px ${stat.dotColor}40` }} />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700 tracking-wide">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" style={{ animation: "fadeUp 0.7s 0.88s both" }}>
              <Button size="lg" className="text-white shadow-lg rounded-xl px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base relative overflow-hidden group" style={{ background: `linear-gradient(to right, ${pc}, ${sc})`, boxShadow: `0 10px 25px ${pc}30` }} onClick={() => setBookingModalOpen(true)}>
                <Wrench className="w-4 sm:w-5 h-4 sm:h-5 mr-2" /> Book Home Service
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:border-blue-400 text-gray-700 rounded-xl px-6 sm:px-8 h-12 sm:h-13 text-sm sm:text-base bg-white/50 backdrop-blur-md" style={{ borderColor: `${pc}40` }} onClick={() => setView("fullProducts")}>
                Explore Products <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500" style={{ animation: "fadeUp 0.7s 1.05s both" }}>
              <div className="flex text-yellow-400">★★★★☆</div>
              <span className="w-px h-3 sm:h-4 bg-gray-300" />
              <span>213+ Google Reviews</span>
              <span className="w-px h-3 sm:h-4 bg-gray-300" />
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sanganer Bazar, Jaipur</span>
            </div>
          </div>

          {/* Right visual — 3D Tech Showcase - Hidden on mobile/tablet */}
          <div className="hidden lg:flex flex-col items-center justify-center relative" style={{ animation: "fadeUp 1s 0.4s both" }}>
            <div className="w-[480px] h-[420px] relative">
              <ThreeJSErrorBoundary>
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative">
                      <div className="w-32 h-24 rounded-lg border-2 border-blue-400/50 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center shadow-lg shadow-blue-500/20"><div className="text-blue-400 font-mono text-xs tracking-widest">RACE</div></div>
                      <div className="w-8 h-1 bg-blue-400/30 mx-auto" />
                      <div className="w-16 h-1 bg-blue-400/20 mx-auto rounded" />
                      <div className="absolute inset-0 -m-8 border border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: "8s" }} />
                      <div className="absolute inset-0 -m-14 border border-purple-400/10 rounded-full animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }} />
                    </div>
                  </div>
                }>
                  <Race3DObject />
                </Suspense>
              </ThreeJSErrorBoundary>
            </div>

            {/* Floating service chips */}
            {[
              { top: "2%", right: "-2%", icon: Award, text: "ASUS AUTHORIZED", color: pc },
              { top: "32%", left: "-6%", icon: Wrench, text: "HOME SERVICE", color: ac },
              { bottom: "22%", right: "-1%", icon: Building2, text: "2+ BRANCHES", color: "#00d68f" },
              { bottom: "2%", left: "6%", icon: Headphones, text: "EXPERT SUPPORT", color: sc },
            ].map((chip, i) => (
              <div key={i} className="absolute bg-white/92 backdrop-blur-md border rounded-xl px-3 py-2 shadow-lg" style={{ top: chip.top, right: chip.right, left: chip.left, animation: "fadeUp 3s ease-in-out infinite", animationDelay: `${i * 0.5}s`, borderColor: `${chip.color}20` }}>
                <div className="flex items-center gap-2"><chip.icon className="w-3.5 h-3.5" style={{ color: chip.color }} /><span className="text-[10px] font-bold tracking-wider" style={{ color: chip.color }}>{chip.text}</span></div>
              </div>
            ))}

            {/* Vertical Stats */}
            <div className="mt-8 flex gap-0 border border-gray-200/60 bg-white rounded-xl overflow-hidden shadow-sm" style={{ animation: "fadeUp 0.7s 0.72s both" }}>
              {[
                { num: "25+", label: "YEARS", icon: Clock },
                { num: "213+", label: "REVIEWS", icon: Star },
                { num: "4★", label: "RATING", icon: Award },
                { num: "9K+", label: "CUSTOMERS", icon: Users },
              ].map((stat, i) => (
                <div key={stat.label} className={`px-5 py-3.5 text-center relative ${i < 3 ? 'border-r border-gray-200/60' : ''} hover:bg-blue-50/50 transition-colors`}>
                  <stat.icon className="w-3.5 h-3.5 mx-auto mb-1 text-gray-300" />
                  <div className="text-lg font-extrabold race-title-gradient" style={{ fontFamily: "'Syne', sans-serif" }}>{stat.num}</div>
                  <div className="text-[10px] text-gray-400 tracking-[2px] uppercase font-mono mt-0.5">{stat.label}</div>
                </div>
              ))}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${pc}, ${sc}, ${pc})`, backgroundSize: "200% 100%", animation: "raceSlide 2s linear infinite" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
