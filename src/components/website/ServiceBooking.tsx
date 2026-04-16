"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ref, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Home, CheckCircle, MapPin, Phone, User, X } from "lucide-react";

const DEFAULT_SERVICE_TYPES = [
  "Laptop Repair",
  "Desktop Repair",
  "Software Issue",
  "Hardware Upgrade",
  "Home Installation",
];

export default function ServiceBooking() {
  const { setBookingModalOpen, siteTheme } = useAppStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<string[]>(DEFAULT_SERVICE_TYPES);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    serviceType: "",
    problemDescription: "",
  });

  // Load service types from Firebase
  useEffect(() => {
    const typesRef = ref(db, "settings/serviceTypes");
    const unsub = onValue(typesRef, (snap) => {
      if (snap.exists() && Array.isArray(snap.val()) && snap.val().length > 0) {
        setServiceTypes(snap.val());
      } else {
        setServiceTypes(DEFAULT_SERVICE_TYPES);
      }
    });
    return () => { unsub(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.serviceType) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await push(ref(db, "serviceRequests"), {
        name: form.name,
        phone: form.phone,
        address: form.address,
        serviceType: form.serviceType,
        problemDescription: form.problemDescription,
        status: "pending",
        acceptedBy: null,
        acceptedAt: null,
        createdAt: Date.now(),
        completedAt: null,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", address: "", serviceType: "", problemDescription: "" });
      toast({ title: "Service request submitted!", description: "Our team will contact you shortly." });
    } catch {
      toast({ title: "Failed to submit", description: "Please try again or call us.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setBookingModalOpen(false)} />

      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/30">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${siteTheme.primaryColor}, ${siteTheme.accentColor})` }}>
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Book Home Service</h3>
              <p className="text-[10px] text-gray-400">We come to your location!</p>
            </div>
          </div>
          <button onClick={() => setBookingModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Request Submitted!</h3>
              <p className="text-gray-500 text-sm">Our team will contact you shortly.</p>
              <Button onClick={() => setBookingModalOpen(false)} className="text-white" style={{ background: `linear-gradient(to right, ${siteTheme.primaryColor}, ${siteTheme.accentColor})` }}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="flex items-center gap-2 bg-blue-50/60 backdrop-blur-md rounded-lg p-2.5 border border-blue-100/50">
                  <Home className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-[10px] text-blue-700 font-medium">We Come to You</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50/60 backdrop-blur-md rounded-lg p-2.5 border border-green-100/50">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-[10px] text-green-700 font-medium">Quick Response</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1"><User className="w-3 h-3" /> Name *</Label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone *</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Full Address * <span className="text-red-400 text-[9px]">(MANDATORY - staff visits your location)</span></Label>
                <Textarea
                  placeholder="Complete address with landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  rows={2}
                  className="bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Service Type *</Label>
                <Select value={form.serviceType} onValueChange={(val) => setForm({ ...form, serviceType: val })}>
                  <SelectTrigger className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Problem Description</Label>
                <Textarea
                  placeholder="Describe your problem..."
                  value={form.problemDescription}
                  onChange={(e) => setForm({ ...form, problemDescription: e.target.value })}
                  rows={2}
                  className="bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-white h-11 text-sm font-semibold shadow-lg"
                style={{ background: `linear-gradient(to right, ${siteTheme.primaryColor}, ${siteTheme.accentColor})` }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Book Home Service Now"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
