"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import type { AdminUser } from "./types";

interface AdminHeaderProps {
  masterVerified: boolean;
  adminUser: AdminUser | null;
  onLogout: () => void;
}

export default function AdminHeader({ masterVerified, adminUser, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40" style={{ background: masterVerified ? "rgba(10,10,30,0.9)" : "rgba(10,10,30,0.85)", backdropFilter: "blur(20px)", borderBottom: masterVerified ? "1px solid rgba(0,229,255,0.1)" : "1px solid rgba(0,229,255,0.08)", boxShadow: masterVerified ? "none" : "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div className="aqerionx-bar" />
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <a href="/">
            <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-cyan-400">
              <ArrowLeft className="w-4 h-4" /> Back to Site
            </Button>
          </a>
          <div className="h-6 w-px" style={{ background: "rgba(0,229,255,0.2)" }} />
          <span className="font-bold text-sm aqerionx-text">
            {masterVerified ? "Master Admin Panel" : "Admin Panel"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {adminUser && (
            <div className="flex items-center gap-2 mr-2">
              {adminUser.photoURL ? (
                <img src={adminUser.photoURL} alt="" className="w-7 h-7 rounded-full" style={{ border: "2px solid rgba(0,229,255,0.3)" }} />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "rgba(0,229,255,0.15)", color: "#00e5ff" }}>{adminUser.email?.charAt(0).toUpperCase()}</div>
              )}
              <span className="text-xs hidden sm:block text-gray-400">{adminUser.email}</span>
              {masterVerified && <Badge className="text-[9px]" style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,255,0.2))", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.3)" }}>Master</Badge>}
            </div>
          )}
          {!masterVerified && (
            <a href="/racemaster">
              <Button variant="outline" size="sm" className="gap-1 text-xs border-purple-200 text-purple-600 hover:bg-purple-50">
                <Shield className="w-3.5 h-3.5" /> Master Admin
              </Button>
            </a>
          )}
          <Button variant="ghost" size="sm" onClick={onLogout} className="gap-1 text-red-400 hover:text-red-300 hover:bg-red-900/20">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
