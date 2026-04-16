"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import type { ServiceRequest, ProductOrder, StaffMember, Product, StaffLocation } from "./adminTypes";

export interface SiteSettings {
  hero: { title: string; subtitle: string; tagline: string };
  about: { text: string };
  ticker: string[];
  contact: { phone: string; email: string; address: string; whatsapp: string };
  categories: string[];
  serviceTypes: string[];
  services: { id: string; icon: string; title: string; desc: string; color: string }[];
  branches: { id: string; name: string; address: string; phone: string }[];
  gallery: string[];
  theme: { primaryColor: string; backgroundColor: string; accentColor: string; secondaryColor: string };
}

const DEFAULT_SETTINGS: SiteSettings = {
  hero: { title: "RACE COMPUTER", subtitle: "COMPUTER", tagline: "Next-Gen Tech Hub, Jaipur" },
  about: { text: "" },
  ticker: [],
  contact: { phone: "", email: "", address: "", whatsapp: "" },
  categories: ["Accessories", "Components", "Repair Parts"],
  serviceTypes: ["Laptop Repair", "Desktop Repair", "Software Issue", "Hardware Upgrade", "Home Installation"],
  services: [],
  branches: [],
  gallery: [],
  theme: { primaryColor: "#0055ff", backgroundColor: "#ffffff", accentColor: "#ff3d00", secondaryColor: "#7c3aff" },
};

export interface AdminData {
  serviceRequests: ServiceRequest[];
  productOrders: ProductOrder[];
  staff: StaffMember[];
  products: Product[];
  staffLocations: StaffLocation[];
  adminSettings: { email: string; password: string };
  pendingRequests: ServiceRequest[];
  acceptedRequests: ServiceRequest[];
  completedRequests: ServiceRequest[];
  siteSettings: SiteSettings;
}

export function useAdminData(): AdminData {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staffLocations, setStaffLocations] = useState<StaffLocation[]>([]);
  const [adminSettings, setAdminSettings] = useState({ email: "admin@racecomputer.in", password: "admin123" });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsub1 = onValue(ref(db, "serviceRequests"), (snap) => {
      if (snap.exists()) {
        const reqs: ServiceRequest[] = [];
        snap.forEach((child) => reqs.push({ id: child.key || "", ...child.val() }));
        reqs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setServiceRequests(reqs);
      } else setServiceRequests([]);
    });

    const unsub2 = onValue(ref(db, "productOrders"), (snap) => {
      if (snap.exists()) {
        const ords: ProductOrder[] = [];
        snap.forEach((child) => ords.push({ id: child.key || "", ...child.val() }));
        ords.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProductOrders(ords);
      } else setProductOrders([]);
    });

    const unsub3 = onValue(ref(db, "staff"), (snap) => {
      if (snap.exists()) {
        const s: StaffMember[] = [];
        snap.forEach((child) => s.push({ id: child.key || "", ...child.val() }));
        setStaff(s);
      } else setStaff([]);
    });

    const unsub4 = onValue(ref(db, "products"), (snap) => {
      if (snap.exists()) {
        const p: Product[] = [];
        snap.forEach((child) => p.push({ id: child.key || "", ...child.val() }));
        setProducts(p);
      } else setProducts([]);
    });

    const unsub5 = onValue(ref(db, "settings/admin"), (snap) => {
      if (snap.exists()) setAdminSettings(snap.val());
    });

    const unsub6 = onValue(ref(db, "staffLocations"), (snap) => {
      if (snap.exists()) {
        const locs: StaffLocation[] = [];
        snap.forEach((child) => {
          const data = child.val();
          if (data) {
            locs.push({
              staffId: child.key || "",
              staffName: data.staffName || "Unknown",
              lat: data.lat || 0,
              lng: data.lng || 0,
              lastUpdated: data.lastUpdated || 0,
              activeRequestId: data.activeRequestId || "",
              activeRequestName: data.activeRequestName || "",
              activeRequestService: data.activeRequestService || "",
            });
          }
        });
        setStaffLocations(locs);
      } else setStaffLocations([]);
    });

    // Site settings listeners
    const unsub7 = onValue(ref(db, "settings/hero"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, hero: snap.val() }));
      }
    });
    const unsub8 = onValue(ref(db, "settings/about"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, about: snap.val() }));
      }
    });
    const unsub9 = onValue(ref(db, "settings/ticker"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, ticker: snap.val() }));
      }
    });
    const unsub10 = onValue(ref(db, "settings/contact"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, contact: snap.val() }));
      }
    });
    const unsub11 = onValue(ref(db, "settings/categories"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, categories: snap.val() }));
      }
    });
    const unsub12 = onValue(ref(db, "settings/serviceTypes"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, serviceTypes: snap.val() }));
      }
    });
    const unsub13 = onValue(ref(db, "settings/theme"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, theme: snap.val() }));
      }
    });
    const unsub14 = onValue(ref(db, "settings/services"), (snap) => {
      if (snap.exists()) {
        const svcs: { id: string; icon: string; title: string; desc: string; color: string }[] = [];
        snap.forEach((child) => svcs.push({ id: child.key || "", ...child.val() }));
        setSiteSettings(prev => ({ ...prev, services: svcs }));
      }
    });
    const unsub15 = onValue(ref(db, "settings/branches"), (snap) => {
      if (snap.exists()) {
        const br: { id: string; name: string; address: string; phone: string }[] = [];
        snap.forEach((child) => br.push({ id: child.key || "", ...child.val() }));
        setSiteSettings(prev => ({ ...prev, branches: br }));
      }
    });
    const unsub16 = onValue(ref(db, "settings/gallery"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(prev => ({ ...prev, gallery: snap.val() }));
      }
    });

    return () => {
      unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6();
      unsub7(); unsub8(); unsub9(); unsub10(); unsub11(); unsub12();
      unsub13(); unsub14(); unsub15(); unsub16();
    };
  }, []);

  const pendingRequests = serviceRequests.filter((r) => r.status === "pending");
  const acceptedRequests = serviceRequests.filter((r) => r.status === "accepted");
  const completedRequests = serviceRequests.filter((r) => r.status === "completed");

  return {
    serviceRequests,
    productOrders,
    staff,
    products,
    staffLocations,
    adminSettings,
    pendingRequests,
    acceptedRequests,
    completedRequests,
    siteSettings,
  };
}
