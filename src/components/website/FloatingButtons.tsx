"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ref, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Send,
  X,
  CheckCircle,
  User,
  Phone,
  Wrench,
  Home,
  MapPin,
} from "lucide-react";

// Enquiry categories — Repair Service ke alawa sab
const ENQUIRY_CATEGORIES = [
  "Desktop & Laptops",
  "Printers & Peripherals",
  "Networking Solutions",
  "AMC & Support",
  "Custom PC Build",
  "Software & OS",
  "General Enquiry",
];

const SERVICE_TYPES = [
  "Laptop Repair",
  "Desktop Repair",
  "Software Issue",
  "Hardware Upgrade",
  "Home Installation",
];

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with actual number

export default function FloatingButtons() {
  const { toast } = useToast();
  const { setBookingModalOpen } = useAppStore();

  // WhatsApp button
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  // Enquiry modal
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    category: "",
    message: "",
  });

  // Book Service modal (local)
  const [bookOpen, setBookOpen] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookSubmitted, setBookSubmitted] = useState(false);
  const [bookForm, setBookForm] = useState({
    name: "",
    phone: "",
    address: "",
    serviceType: "",
    problemDescription: "",
  });

  // Send Enquiry to Firebase
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.category) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setEnquiryLoading(true);
    try {
      await push(ref(db, "enquiries"), {
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        category: enquiryForm.category,
        message: enquiryForm.message,
        source: "website_enquiry",
        status: "new",
        createdAt: Date.now(),
      });
      setEnquirySubmitted(true);
      setEnquiryForm({ name: "", phone: "", category: "", message: "" });
      toast({ title: "Enquiry Sent!", description: "We will get back to you soon." });
    } catch {
      toast({ title: "Failed to send", variant: "destructive" });
    }
    setEnquiryLoading(false);
  };

  // Book Service submit
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.name || !bookForm.phone || !bookForm.address || !bookForm.serviceType) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setBookLoading(true);
    try {
      await push(ref(db, "serviceRequests"), {
        name: bookForm.name,
        phone: bookForm.phone,
        address: bookForm.address,
        serviceType: bookForm.serviceType,
        problemDescription: bookForm.problemDescription,
        status: "pending",
        acceptedBy: null,
        acceptedAt: null,
        createdAt: Date.now(),
        completedAt: null,
      });
      setBookSubmitted(true);
      setBookForm({ name: "", phone: "", address: "", serviceType: "", problemDescription: "" });
      toast({ title: "Service request submitted!", description: "Our team will contact you shortly." });
    } catch {
      toast({ title: "Failed to submit", description: "Please try again or call us.", variant: "destructive" });
    }
    setBookLoading(false);
  };

  // WhatsApp chat redirect
  const openWhatsApp = (prefill?: string) => {
    const msg = prefill || "Hi! I have an enquiry about Race Computer services.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setWhatsappOpen(false);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════ */}
      {/* FLOATING BUTTONS — Bottom Right */}
      {/* ═══════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">

        {/* Book Service Floating Quick Button */}
        <button
          onClick={() => { setBookOpen(true); setBookSubmitted(false); }}
          className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 rounded-full pl-4 pr-5 py-3"
        >
          <Wrench className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-semibold">Book Service</span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-red-500 animate-ping opacity-15" />
        </button>

        {/* Send Enquiry Floating Button */}
        <button
          onClick={() => { setEnquiryOpen(true); setEnquirySubmitted(false); }}
          className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 rounded-full pl-4 pr-5 py-3"
        >
          <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          <span className="text-sm font-semibold">Send Enquiry</span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-15" />
        </button>

        {/* WhatsApp Floating Button */}
        <div className="relative">
          <button
            onClick={() => setWhatsappOpen(!whatsappOpen)}
            className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          </button>

          {/* WhatsApp Quick Options Popup */}
          {whatsappOpen && (
            <div className="absolute bottom-16 right-0 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-green-100/50 overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Chat on WhatsApp</span>
                  <button onClick={() => setWhatsappOpen(false)} className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-green-100 mt-0.5">Quick responses, direct connect</p>
              </div>
              <div className="p-3 space-y-2">
                <button
                  onClick={() => openWhatsApp("Hi! I want to know about your products.")}
                  className="w-full text-left p-2.5 rounded-lg bg-green-50/80 hover:bg-green-100/80 transition-colors text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="text-green-500">🛒</span> Product Enquiry
                </button>
                <button
                  onClick={() => openWhatsApp("Hi! I need home service for my device.")}
                  className="w-full text-left p-2.5 rounded-lg bg-blue-50/80 hover:bg-blue-100/80 transition-colors text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="text-blue-500">🔧</span> Book Home Service
                </button>
                <button
                  onClick={() => openWhatsApp("Hi! I have a general enquiry.")}
                  className="w-full text-left p-2.5 rounded-lg bg-purple-50/80 hover:bg-purple-100/80 transition-colors text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="text-purple-500">💬</span> General Chat
                </button>
                <button
                  onClick={() => openWhatsApp("Hi! I need help with my order payment.")}
                  className="w-full text-left p-2.5 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 transition-colors text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="text-amber-500">💳</span> Payment Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* BOOK SERVICE MODAL */}
      {/* ═══════════════════════════════════════════ */}
      {bookOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setBookOpen(false)} />
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/30">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-red-500 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Book Home Service</h3>
                  <p className="text-[10px] text-gray-400">We come to your location!</p>
                </div>
              </div>
              <button onClick={() => setBookOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="p-5">
              {bookSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Request Submitted!</h3>
                  <p className="text-gray-500 text-sm">Our team will contact you shortly.</p>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button onClick={() => setBookOpen(false)} className="bg-gradient-to-r from-blue-600 to-red-500 text-white">
                      Done
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 gap-2"
                      onClick={() => openWhatsApp("Hi! I just booked a home service from the website.")}
                    >
                      <MessageCircle className="w-4 h-4" /> Follow on WhatsApp
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-4">
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
                        value={bookForm.name}
                        onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })}
                        required
                        className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone *</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={bookForm.phone}
                        onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })}
                        required
                        className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Full Address * <span className="text-red-400 text-[9px]">(MANDATORY)</span></Label>
                    <Textarea
                      placeholder="Complete address with landmark"
                      value={bookForm.address}
                      onChange={(e) => setBookForm({ ...bookForm, address: e.target.value })}
                      required
                      rows={2}
                      className="bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Service Type *</Label>
                    <Select value={bookForm.serviceType} onValueChange={(val) => setBookForm({ ...bookForm, serviceType: val })}>
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
                      value={bookForm.problemDescription}
                      onChange={(e) => setBookForm({ ...bookForm, problemDescription: e.target.value })}
                      rows={2}
                      className="bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white h-11 text-sm font-semibold shadow-lg"
                    disabled={bookLoading}
                  >
                    {bookLoading ? "Submitting..." : "Book Home Service Now"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SEND ENQUIRY MODAL */}
      {/* ═══════════════════════════════════════════ */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEnquiryOpen(false)} />

          {/* Modal */}
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/30">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Send Enquiry</h3>
                  <p className="text-[10px] text-gray-400">We&apos;ll get back to you soon!</p>
                </div>
              </div>
              <button onClick={() => setEnquiryOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {enquirySubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Enquiry Sent!</h3>
                  <p className="text-gray-500 text-sm">Our team will contact you shortly.</p>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button onClick={() => setEnquiryOpen(false)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Done
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 gap-2"
                      onClick={() => openWhatsApp("Hi! I just sent an enquiry from the website.")}
                    >
                      <MessageCircle className="w-4 h-4" /> Follow on WhatsApp
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><User className="w-3 h-3" /> Name *</Label>
                      <Input
                        placeholder="Your name"
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        required
                        className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone *</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        required
                        className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown — Repair Service ke alawa sab */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Category *</Label>
                    <Select
                      value={enquiryForm.category}
                      onValueChange={(val) => setEnquiryForm({ ...enquiryForm, category: val })}
                    >
                      <SelectTrigger className="h-9 bg-white/60 backdrop-blur-md border-gray-200/50 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENQUIRY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[9px] text-gray-400 mt-1">
                      For repair/service, use <button type="button" onClick={() => { setEnquiryOpen(false); setTimeout(() => setBookOpen(true), 200); }} className="text-blue-500 hover:underline">Book Service</button> button instead.
                    </p>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Message</Label>
                    <Textarea
                      placeholder="Describe your requirement..."
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      rows={3}
                      className="bg-white/60 backdrop-blur-md border-gray-200/50 text-sm"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-11 text-sm font-semibold shadow-lg"
                    disabled={enquiryLoading}
                  >
                    {enquiryLoading ? "Sending..." : "Send Enquiry"}
                  </Button>

                  {/* Or WhatsApp */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 backdrop-blur-md px-2 text-gray-400">or</span></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50 gap-2 h-11"
                    onClick={() => {
                      const msg = `Hi! Enquiry from ${enquiryForm.name || 'a customer'} — Category: ${enquiryForm.category || 'Not selected'} — Message: ${enquiryForm.message || 'No message'}`;
                      openWhatsApp(msg);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp Instead
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
