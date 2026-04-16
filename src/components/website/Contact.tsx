"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ref, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Clock, Phone, Mail, Send, CheckCircle, Navigation } from "lucide-react";

// Contact info cards — uniform size, icon+gradient bg, no Location/WhatsApp
const CONTACT_CARDS = [
  {
    icon: Clock,
    title: "Business Hours",
    text: "Mon – Sat: 10:00 AM – 8:00 PM\nSunday: Closed",
    href: null,
    gradient: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-200",
  },
  {
    icon: Phone,
    title: "Phone",
    text: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    gradient: "from-green-500 to-emerald-600",
    bgLight: "bg-green-50",
    borderLight: "border-green-200",
  },
  {
    icon: Mail,
    title: "Email",
    text: "racecomputer16000@gmail.com",
    href: "mailto:racecomputer16000@gmail.com",
    gradient: "from-red-500 to-rose-600",
    bgLight: "bg-red-50",
    borderLight: "border-red-200",
  },
];

// Enquiry categories
const ENQUIRY_CATEGORIES = [
  "Desktop & Laptops",
  "Printers & Peripherals",
  "Networking Solutions",
  "AMC & Support",
  "Custom PC Build",
  "Software & OS",
  "General Enquiry",
];

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.category) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await push(ref(db, "enquiries"), {
        name: form.name,
        phone: form.phone,
        category: form.category,
        message: form.message,
        source: "contact_form",
        status: "new",
        createdAt: Date.now(),
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", category: "", message: "" });
      toast({ title: "Enquiry Sent!", description: "We will contact you soon." });
    } catch {
      toast({ title: "Failed to send enquiry", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-blue-50/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-4">
            <Send className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-red-600 tracking-wider uppercase">&#47;&#47; Send Enquiry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Get In Touch</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Have a query? Send an enquiry, call us, or visit our store.</p>
          <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-red-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Enquiry form — takes 3 cols */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl shadow-blue-100/50 h-full">
              <CardContent className="p-6">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Enquiry Sent!</h3>
                    <p className="text-gray-500 text-sm">Our team will contact you shortly.</p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-blue-600 to-red-500 text-white"
                    >
                      Send Another Enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Your Name *</Label>
                        <Input
                          placeholder="Rahul Sharma"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          className="bg-white/60 backdrop-blur-md border-gray-200/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Phone Number *</Label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required
                          className="bg-white/60 backdrop-blur-md border-gray-200/50"
                        />
                      </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-1.5">
                      <Label>Category *</Label>
                      <Select
                        value={form.category}
                        onValueChange={(val) => setForm({ ...form, category: val })}
                      >
                        <SelectTrigger className="bg-white/60 backdrop-blur-md border-gray-200/50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ENQUIRY_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        For repair/service requests, please use the &quot;Book Service&quot; button instead.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Message</Label>
                      <Textarea
                        placeholder="Describe your requirement..."
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="bg-white/60 backdrop-blur-md border-gray-200/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white h-11 font-semibold"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Enquiry →"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact info — takes 2 cols, uniform card sizes */}
          <div className="lg:col-span-2 space-y-3">
            {CONTACT_CARDS.map((info) => (
              <a
                key={info.title}
                href={info.href || undefined}
                target={info.href?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl ${info.bgLight} border ${info.borderLight} hover:shadow-md transition-all group`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                  <info.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">{info.title}</h4>
                  <p className="text-sm text-gray-500 whitespace-pre-line group-hover:text-gray-700 transition-colors truncate">{info.text}</p>
                </div>
              </a>
            ))}

            {/* Get Directions CTA — same size as above cards */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Race+Computer+Sanganer+Jaipur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">Get Directions</h4>
                <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Navigate to our store →</p>
              </div>
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="mt-10 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.073!2d75.8035382!3d26.8108296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc98d0fb7d66f%3A0x6c20f5cebf1e71da!2sRace%20Computer!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Race Computer Location"
          />
        </div>
      </div>
    </section>
  );
}
