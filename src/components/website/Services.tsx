"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Printer, Wrench, Wifi, Shield, Cpu } from "lucide-react";
import { useAppStore } from "@/lib/store";

const SERVICES = [
  { icon: Monitor, title: "Desktop & Laptops", desc: "Latest PCs, gaming rigs and laptops from top brands. Custom assembled systems tailored to your budget.", color: "blue" },
  { icon: Cpu, title: "Custom PC Build", desc: "Dream rig, built your way. Handpicked components, expert assembly, and benchmarked perfection.", color: "purple" },
  { icon: Printer, title: "Printers & Peripherals", desc: "Inkjet, laser, multifunction printers. Keyboards, mice, headphones — all in one place.", color: "green" },
  { icon: Wrench, title: "Repair & Service", desc: "Expert hardware & software repair for laptops & PCs. Home service available across Jaipur.", color: "red" },
  { icon: Wifi, title: "Networking Solutions", desc: "WiFi routers, switches, LAN cables and complete network setup for homes & businesses.", color: "cyan" },
  { icon: Shield, title: "AMC & Support", desc: "Annual Maintenance Contracts for offices. On-site & remote support to keep systems running.", color: "indigo" },
];

export default function Services() {
  const { siteTheme } = useAppStore();
  const pc = siteTheme.primaryColor;
  const ac = siteTheme.accentColor;

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">&#47;&#47; What We Offer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Our Services</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Sanganer&apos;s most complete tech service hub — hardware to software, purchase to repair.
          </p>
          <div className="w-14 h-1 rounded-full mx-auto mt-4" style={{ background: `linear-gradient(to right, ${pc}, ${ac})` }} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, idx) => (
            <Card
              key={idx}
              className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-default"
            >
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"
                  style={{ background: service.color === "blue" ? "#2563eb" : service.color === "red" ? "#ef4444" : service.color === "green" ? "#16a34a" : service.color === "purple" ? "#7c3aed" : service.color === "cyan" ? "#06b6d4" : "#4f46e5" }}
                />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  service.color === "blue" ? "bg-blue-100 text-blue-600" :
                  service.color === "red" ? "bg-red-100 text-red-500" :
                  service.color === "green" ? "bg-green-100 text-green-600" :
                  service.color === "purple" ? "bg-purple-100 text-purple-600" :
                  service.color === "cyan" ? "bg-cyan-100 text-cyan-600" :
                  "bg-indigo-100 text-indigo-600"
                }`} style={service.color === "purple" ? { background: "linear-gradient(135deg, rgba(124,58,255,0.1), rgba(0,229,255,0.1))" } : {}}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-gray-300 tracking-widest mb-2">0{idx + 1}</div>
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
