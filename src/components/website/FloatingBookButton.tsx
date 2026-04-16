"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ref, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Wrench, X, Home, CheckCircle, User, Phone, MapPin } from "lucide-react";

const SERVICE_TYPES = [
  "Laptop Repair",
  "Desktop Repair",
  "Software Issue",
  "Hardware Upgrade",
  "Home Installation",
];

export default function FloatingBookButton() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    serviceType: "",
    problemDescription: "",
  });

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
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => { setOpen(true); setSubmitted(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-red-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <Wrench className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-red-500 animate-ping opacity-20" />
      </button>

      {/* Tooltip */}
      <div className="fixed bottom-8 right-22 z-50 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Book Home Service
      </div>

      {/* Booking Modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/30">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-red-500 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Book Home Service</h3>
                  <p className="text-[10px] text-gray-400">We come to your location!</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
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
                  <Button onClick={() => setOpen(false)} className="bg-gradient-to-r from-blue-600 to-red-500 text-white">
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Label className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Full Address * <span className="text-red-400 text-[9px]">(MANDATORY)</span></Label>
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
                        {SERVICE_TYPES.map((type) => (
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
                    className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white h-11 text-sm font-semibold shadow-lg"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Book Home Service Now"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
