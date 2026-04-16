"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Minimize2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { StaffLocation } from "./types";

const StaffLiveMap = dynamic(() => import("@/components/admin/StaffLiveMap"), { ssr: false });

interface LiveTrackingTabProps {
  staffLocations: StaffLocation[];
  masterVerified: boolean;
  mapExpanded: boolean;
  setMapExpanded: (v: boolean) => void;
  getTimeSince: (ts: number) => string;
}

export default function LiveTrackingTab({ staffLocations, masterVerified, mapExpanded, setMapExpanded, getTimeSince }: LiveTrackingTabProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className={`font-bold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>Live Staff Tracking</h3>
          {staffLocations.length > 0 && (
            <Badge className="bg-emerald-500 text-white text-[10px] animate-pulse gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              {staffLocations.length} Live
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={() => setMapExpanded(!mapExpanded)} className="gap-1">
          {mapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {mapExpanded ? "Minimize" : "Expand"}
        </Button>
      </div>

      {staffLocations.length === 0 ? (
        <div className={`text-center py-16 ${masterVerified ? "text-gray-500" : "text-gray-400"}`}>
          <p className="text-lg font-medium mb-2">No staff currently sharing location</p>
          <p className="text-sm">Staff locations will appear here when they accept service requests</p>
        </div>
      ) : (
        <div className={mapExpanded ? "fixed inset-0 z-50 p-4" : ""}>
          <div className={mapExpanded ? "w-full h-full" : ""}>
            <StaffLiveMap staffLocations={staffLocations} isDark={masterVerified} />
          </div>
        </div>
      )}

      {/* Staff Location Cards */}
      {staffLocations.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {staffLocations.map((loc) => (
            <div key={loc.staffId} className={`p-3 rounded-lg border ${masterVerified ? "" : "bg-gray-50 border-gray-100"}`} style={masterVerified ? { background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.1)" } : {}}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: "linear-gradient(135deg, #00e5ff, #7c3aff)" }}>{loc.staffName.charAt(0).toUpperCase()}</div>
                <div>
                  <div className={`text-sm font-semibold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{loc.staffName}</div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-[10px] text-emerald-500 font-medium">LIVE</span>
                  </div>
                </div>
              </div>
              {loc.activeRequestName && (
                <div className={`text-xs mb-1 ${masterVerified ? "text-cyan-400" : "text-red-600"}`}>
                  Service: {loc.activeRequestName} — {loc.activeRequestService}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] ${masterVerified ? "text-gray-500" : "text-gray-400"}`}>Updated {getTimeSince(loc.lastUpdated)}</span>
                <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline">Google Maps</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
