"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Award, Users, Building2, Navigation, Phone } from "lucide-react";

const STATS = [
  { icon: Clock, label: "Years Active", value: "25+", color: "blue" },
  { icon: Users, label: "Customers", value: "9000+", color: "green" },
  { icon: Award, label: "Rating", value: "4★", color: "yellow" },
  { icon: MapPin, label: "Branches", value: "2+", color: "red" },
];

const BRANCHES = [
  {
    name: "Race Computer",
    type: "Retail Store",
    address: "S. No 1, Opposite Gosala, Sheopur Road, Pratapnagar, Sanganer Bazar, Jaipur — 302029",
    phone: "+91 XXXXX XXXXX",
    since: "2010",
    isMain: false,
    badge: "RETAIL STORE",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Race+Computer+Sanganer+Jaipur",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.073!2d75.8035382!3d26.8108296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc98d0fb7d66f%3A0x6c20f5cebf1e71da!2sRace%20Computer!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
  },
  {
    name: "Race Computer Services",
    type: "Headquarters / Main Branch",
    address: "Race Computer Services Head Office, Jaipur, Rajasthan",
    phone: "+91 XXXXX XXXXX",
    since: "2001",
    isMain: true,
    badge: "MAIN BRANCH",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Race+Computer+Services+Jaipur",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.85!3d26.91!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db1e9e7a0d2c3%3A0x1234567890abcdef!2sRace%20Computer%20Services!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4">
            <span className="text-xs font-semibold text-green-600 tracking-wider uppercase">&#47;&#47; Who We Are</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>About RACE COMPUTER</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Since 2001, thousands of satisfied customers, and Jaipur&apos;s most trusted tech partner.
          </p>
          <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-red-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {STATS.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-shadow text-center group hover:-translate-y-1 transition-transform">
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                  stat.color === "blue" ? "bg-blue-100" : stat.color === "green" ? "bg-green-100" : stat.color === "yellow" ? "bg-yellow-100" : "bg-red-100"
                }`}>
                  <stat.icon className={`w-5 h-5 ${stat.color === "blue" ? "text-blue-600" : stat.color === "green" ? "text-green-600" : stat.color === "yellow" ? "text-yellow-600" : "text-red-500"}`} />
                </div>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium tracking-wider uppercase mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story + Journey */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-blue-600">Race Computer Services</strong> was founded in 2001 with a vision to provide quality technology solutions in Jaipur. What started as a small service center has now grown into one of Rajasthan&apos;s most trusted technology brands.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In 2010, we opened our <strong className="text-red-500">Race Computer Retail Store at Sanganer Bazar</strong>, which became our main customer-facing hub. As an <strong className="text-blue-600">authorized ASUS dealer</strong>, we guarantee genuine products with full manufacturer warranty. Our certified technicians provide expert repair for all major brands — now available as home service!
            </p>
            <p className="text-gray-600 leading-relaxed">
              From a single shop to <strong className="text-red-500">multiple branches across Jaipur</strong>, with 9000+ happy customers and counting. Today we are <strong className="text-red-500">Jaipur&apos;s No.1 tech destination</strong> with home service, product delivery, and staff management.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Our Journey</h3>
            {[
              { year: "2001", title: "Race Computer Services Founded", desc: "Started our journey in Jaipur" },
              { year: "2010", title: "Sanganer Retail Store Opened", desc: "Race Computer retail store at Sanganer Bazar" },
              { year: "2014", title: "ASUS Authorization", desc: "Official ASUS authorized dealer" },
              { year: "2019", title: "Service Center Launch", desc: "Dedicated repair & AMC services" },
              { year: "2025", title: "Home Service Platform", desc: "Online booking & staff management system" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${item.year === "2001" ? "bg-red-500 border-red-200" : item.year === "2010" ? "bg-blue-500 border-blue-200" : "bg-blue-500 border-blue-200"}`} />
                  {idx < 4 && <div className="w-0.5 h-full bg-blue-200 mt-1" />}
                </div>
                <div className="pb-4">
                  <div className={`text-xs font-mono tracking-wider ${item.year === "2001" ? "text-red-500" : "text-blue-500"}`}>{item.year}</div>
                  <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branches Section */}
        <div className="mb-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">&#47;&#47; Our Branches</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Visit Us</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">Multiple locations to serve you better across Jaipur</p>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-red-500 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BRANCHES.map((branch, idx) => (
              <Card key={idx} className={`border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden ${branch.isMain ? "ring-2 ring-blue-500/30" : "ring-2 ring-purple-500/20"}`}>
                <CardContent className="p-0">
                  {/* Branch header */}
                  <div className={`p-5 ${branch.isMain ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-red-500 to-orange-500"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-white" />
                          <h4 className="font-bold text-white text-lg">{branch.name}</h4>
                        </div>
                        <span className="inline-block mt-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                          {branch.badge}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-[10px] font-mono tracking-wider uppercase">Since</div>
                        <div className="text-white font-extrabold text-xl">{branch.since}</div>
                      </div>
                    </div>
                  </div>

                  {/* Branch details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">{branch.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-green-500 shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="text-sm text-gray-600 hover:text-blue-600 transition">{branch.phone}</a>
                    </div>

                    {/* Mini Map */}
                    <div className="rounded-lg overflow-hidden border border-gray-200 mt-3">
                      <iframe
                        src={branch.mapEmbedUrl}
                        width="100%"
                        height="140"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={branch.name}
                      />
                    </div>

                    {/* Get Directions Button */}
                    <a
                      href={branch.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
