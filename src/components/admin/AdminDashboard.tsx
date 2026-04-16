"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ref, update, remove, push, set, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { seedDatabase } from "@/lib/seedData";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, Wrench, ShoppingBag, Users, Package,
  LogOut, Plus, Trash2, CheckCircle, Clock, AlertCircle,
  ArrowLeft, TrendingUp, Phone, MapPin, User, Shield,
  Upload, Settings, BarChart3, Activity, Navigation, ExternalLink,
  Map, Maximize2, Minimize2, Palette, Type, MessageSquare,
  Building2, Image, ChevronRight, Edit, Save, X, Globe,
  Tag, List
} from "lucide-react";
import dynamic from "next/dynamic";

const StaffLiveMap = dynamic(() => import("@/components/admin/StaffLiveMap"), { ssr: false });

import type { ServiceRequest, ProductOrder, StaffMember, Product, StaffLocation } from "@/lib/adminTypes";
import { formatDate, getTimeSince } from "@/lib/adminTypes";
import { useAdminData } from "@/lib/useAdminData";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminDashboard() {
  const { adminLogout, setView, adminType, adminUser, siteTheme, setSiteTheme } = useAppStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [requestFilter, setRequestFilter] = useState("all");
  const [mapExpanded, setMapExpanded] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const masterVerified = adminType === "master";
  const [adminSettings, setAdminSettings] = useState({ email: "admin@racecomputer.in", password: "admin123" });

  const {
    serviceRequests, productOrders, staff, products, staffLocations,
    adminSettings: firebaseAdminSettings, siteSettings,
    pendingRequests, acceptedRequests, completedRequests,
  } = useAdminData();

  // Staff form
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Product form
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", price: "", category: "Accessories", image: "", description: "", type: "", variant: "" });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings form states
  const [heroForm, setHeroForm] = useState(siteSettings.hero);
  const [aboutForm, setAboutForm] = useState(siteSettings.about);
  const [tickerForm, setTickerForm] = useState<string[]>(siteSettings.ticker);
  const [tickerInput, setTickerInput] = useState("");
  const [contactForm, setContactForm] = useState(siteSettings.contact);
  const [categoryForm, setCategoryForm] = useState<string[]>(siteSettings.categories);
  const [categoryInput, setCategoryInput] = useState("");
  const [serviceTypeForm, setServiceTypeForm] = useState<string[]>(siteSettings.serviceTypes);
  const [serviceTypeInput, setServiceTypeInput] = useState("");
  const [themeForm, setThemeForm] = useState(siteSettings.theme);
  const [saving, setSaving] = useState(false);

  // Sync settings forms when siteSettings changes
  useEffect(() => { setHeroForm(siteSettings.hero); }, [siteSettings.hero]);
  useEffect(() => { setAboutForm(siteSettings.about); }, [siteSettings.about]);
  useEffect(() => { setTickerForm(siteSettings.ticker.length > 0 ? siteSettings.ticker : []); }, [siteSettings.ticker]);
  useEffect(() => { setContactForm(siteSettings.contact); }, [siteSettings.contact]);
  useEffect(() => { setCategoryForm(siteSettings.categories); }, [siteSettings.categories]);
  useEffect(() => { setServiceTypeForm(siteSettings.serviceTypes); }, [siteSettings.serviceTypes]);
  useEffect(() => { setThemeForm(siteSettings.theme); }, [siteSettings.theme]);

  // Update admin settings from firebase
  useEffect(() => {
    if (firebaseAdminSettings) setAdminSettings(firebaseAdminSettings);
  }, [firebaseAdminSettings]);

  const filteredRequests = requestFilter === "all"
    ? serviceRequests
    : serviceRequests.filter((r) => r.status === requestFilter);

  // Actions
  const markCompleted = async (id: string) => {
    await update(ref(db, `serviceRequests/${id}`), { status: "completed", completedAt: Date.now() });
    toast({ title: "Marked as completed" });
  };
  const deleteRequest = async (id: string) => {
    await remove(ref(db, `serviceRequests/${id}`));
    toast({ title: "Request deleted" });
  };
  const confirmOrder = async (id: string) => {
    await update(ref(db, `productOrders/${id}`), { status: "confirmed" });
    toast({ title: "Order confirmed" });
  };
  const deleteOrder = async (id: string) => {
    await remove(ref(db, `productOrders/${id}`));
    toast({ title: "Order deleted" });
  };

  // Staff CRUD
  const saveStaff = async () => {
    if (!staffForm.name || !staffForm.email || !staffForm.password) {
      toast({ title: "Fill all required fields", variant: "destructive" }); return;
    }
    if (editingStaffId) {
      await update(ref(db, `staff/${editingStaffId}`), staffForm);
      toast({ title: "Staff updated" });
    } else {
      await push(ref(db, "staff"), { ...staffForm, active: true, createdAt: Date.now() });
      toast({ title: "Staff added" });
    }
    setStaffFormOpen(false);
    setStaffForm({ name: "", email: "", password: "", phone: "" });
    setEditingStaffId(null);
  };
  const editStaff = (s: StaffMember) => {
    setStaffForm({ name: s.name, email: s.email, password: s.password, phone: s.phone || "" });
    setEditingStaffId(s.id); setStaffFormOpen(true);
  };
  const deleteStaff = async (id: string) => {
    await remove(ref(db, `staff/${id}`)); toast({ title: "Staff removed" });
  };
  const toggleStaffActive = async (s: StaffMember) => {
    await update(ref(db, `staff/${s.id}`), { active: !s.active });
  };

  // Product CRUD
  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 600;
          let w = img.width; let h = img.height;
          if (w > maxSize || h > maxSize) {
            if (w > h) { h = (h / w) * maxSize; w = maxSize; }
            else { w = (w / h) * maxSize; h = maxSize; }
          }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setProductForm((prev) => ({ ...prev, image: dataUrl }));
          setImageUploading(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch { toast({ title: "Image upload failed", variant: "destructive" }); setImageUploading(false); }
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      toast({ title: "Fill all required fields", variant: "destructive" }); return;
    }
    if (editingProductId) {
      await update(ref(db, `products/${editingProductId}`), productForm);
      toast({ title: "Product updated" });
    } else {
      await push(ref(db, "products"), { ...productForm, order: products.length });
      toast({ title: "Product added" });
    }
    setProductFormOpen(false);
    setProductForm({ name: "", price: "", category: "Accessories", image: "", description: "", type: "", variant: "" });
    setEditingProductId(null);
  };
  const editProduct = (p: Product) => {
    setProductForm({ name: p.name, price: p.price, category: p.category, image: p.image || "", description: p.description || "", type: p.type || "", variant: p.variant || "" });
    setEditingProductId(p.id); setProductFormOpen(true);
  };
  const deleteProduct = async (id: string) => {
    await remove(ref(db, `products/${id}`)); toast({ title: "Product deleted" });
  };

  const updateAdminCredentials = async () => {
    await set(ref(db, "settings/admin"), adminSettings);
    toast({ title: "Admin credentials updated!" });
  };
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      toast({ title: "Database seeded successfully!", description: "All sample data has been added." });
    } catch (err) {
      console.error("Seed error:", err);
      toast({ title: "Seed failed", description: "Check Firebase rules or try again.", variant: "destructive" });
    }
    setSeeding(false);
  };
  const getStaffStats = (staffName: string) => {
    const completed = serviceRequests.filter(r => r.acceptedBy === staffName && r.status === "completed").length;
    const active = serviceRequests.filter(r => r.acceptedBy === staffName && r.status === "accepted").length;
    return { completed, active };
  };

  // Settings save functions
  const saveToFirebase = async (path: string, data: unknown) => {
    setSaving(true);
    try {
      await set(ref(db, path), data);
      toast({ title: "Settings saved!" });
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    setSaving(false);
  };

  const saveHeroSettings = () => saveToFirebase("settings/hero", heroForm);
  const saveAboutSettings = () => saveToFirebase("settings/about", aboutForm);
  const saveTickerSettings = () => saveToFirebase("settings/ticker", tickerForm);
  const saveContactSettings = () => saveToFirebase("settings/contact", contactForm);
  const saveCategorySettings = () => saveToFirebase("settings/categories", categoryForm);
  const saveServiceTypeSettings = () => saveToFirebase("settings/serviceTypes", serviceTypeForm);
  const saveThemeSettings = async () => {
    setSaving(true);
    try {
      await set(ref(db, "settings/theme"), themeForm);
      setSiteTheme(themeForm);
      toast({ title: "Theme saved! Website colors updated." });
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    setSaving(false);
  };

  // Theme colors for master vs admin
  const isAdmin = !masterVerified;
  const headerBg = masterVerified ? "rgba(10,10,30,0.9)" : "rgba(255,255,255,0.9)";
  const headerBorder = masterVerified ? "1px solid rgba(0,229,255,0.1)" : "1px solid rgba(0,0,0,0.06)";
  const headerShadow = masterVerified ? "none" : "0 1px 3px rgba(0,0,0,0.05)";
  const textPrimary = masterVerified ? "text-white" : "text-gray-900";
  const textSecondary = masterVerified ? "text-gray-400" : "text-gray-500";
  const cardClass = masterVerified ? "aqerionx-card border-0 shadow-md" : "border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow";
  const tabsBg = masterVerified ? "rgba(15,15,40,0.7)" : "#fff";
  const tabsBorder = masterVerified ? "rgba(0,229,255,0.15)" : "rgba(0,0,0,0.08)";
  const tabTextColor = masterVerified ? "#94a3b8" : "#6b7280";
  const activeTabClass = masterVerified ? "data-[state=active]:text-white" : "data-[state=active]:text-red-600";

  return (
    <div className="min-h-screen" style={{ background: masterVerified ? "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 30%, #1a0a2e 60%, #0a0a1a 100%)" : "linear-gradient(135deg, #fff5f5 0%, #ffe4e6 50%, #fff1f2 100%)" }}>
      {/* Admin header */}
      <header className="sticky top-0 z-40" style={{ background: headerBg, backdropFilter: "blur(20px)", borderBottom: headerBorder, boxShadow: headerShadow }}>
        {masterVerified && <div className="aqerionx-bar" />}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/">
              <Button variant="ghost" size="sm" className={`gap-1 ${masterVerified ? "text-gray-400 hover:text-cyan-400" : "text-gray-500 hover:text-red-600"}`}>
                <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Site</span>
              </Button>
            </a>
            <div className="h-6 w-px" style={{ background: masterVerified ? "rgba(0,229,255,0.2)" : "rgba(0,0,0,0.1)" }} />
            <span className={`font-bold text-xs sm:text-sm ${masterVerified ? "aqerionx-text" : "text-gray-800"}`}>
              {masterVerified ? "Master Admin Panel" : "Admin Panel"}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {adminUser && (
              <div className="flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-2">
                {adminUser.photoURL ? (
                  <img src={adminUser.photoURL} alt="" className="w-7 h-7 rounded-full" style={{ border: `2px solid ${masterVerified ? "rgba(0,229,255,0.3)" : "#fecaca"}` }} />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: masterVerified ? "rgba(0,229,255,0.15)" : "#fef2f2", color: masterVerified ? "#00e5ff" : "#dc2626" }}>{adminUser.email?.charAt(0).toUpperCase()}</div>
                )}
                <span className={`text-xs hidden md:block ${masterVerified ? "text-gray-400" : "text-gray-500"}`}>{adminUser.email}</span>
                {masterVerified && <Badge className="text-[9px]" style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,255,0.2))", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.3)" }}>Master</Badge>}
              </div>
            )}
            {!masterVerified && (
              <a href="/racemaster">
                <Button variant="outline" size="sm" className={`gap-1 text-xs ${masterVerified ? "" : "border-purple-200 text-purple-600 hover:bg-purple-50"}`}>
                  <Shield className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Master</span>
                </Button>
              </a>
            )}
            <Button variant="ghost" size="sm" onClick={() => { adminLogout(); window.location.href = '/'; }} className={`gap-1 ${masterVerified ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" : "text-red-500 hover:text-red-700 hover:bg-red-50"}`}>
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="border shadow-sm mb-4 sm:mb-6 flex-nowrap h-auto gap-0.5 sm:gap-1 p-1 w-max sm:w-full" style={{ background: tabsBg, borderColor: tabsBorder }}>
              <TabsTrigger value="overview" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><LayoutDashboard className="w-3.5 h-3.5" /> Overview</TabsTrigger>
              <TabsTrigger value="requests" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><Wrench className="w-3.5 h-3.5" /> Requests {pendingRequests.length > 0 && <Badge className="bg-red-500 text-white text-[8px] sm:text-[9px] ml-0.5 sm:ml-1 px-1 sm:px-1.5">{pendingRequests.length}</Badge>}</TabsTrigger>
              <TabsTrigger value="orders" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><ShoppingBag className="w-3.5 h-3.5" /> Orders</TabsTrigger>
              <TabsTrigger value="staff" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><Users className="w-3.5 h-3.5" /> Staff</TabsTrigger>
              <TabsTrigger value="tracking" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><Navigation className="w-3.5 h-3.5" /> Tracking</TabsTrigger>
              <TabsTrigger value="products" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><Package className="w-3.5 h-3.5" /> Products</TabsTrigger>
              <TabsTrigger value="settings" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><Settings className="w-3.5 h-3.5" /> Settings</TabsTrigger>
              {masterVerified && (
                <TabsTrigger value="master" className={`gap-1 sm:gap-1.5 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3 ${activeTabClass}`} style={{ color: tabTextColor }}><Shield className="w-3.5 h-3.5" /> Master</TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: "Total Requests", value: serviceRequests.length, icon: Wrench, bg: "bg-red-50", text: "text-red-600" },
                { label: "Pending", value: pendingRequests.length, icon: Clock, bg: "bg-yellow-50", text: "text-yellow-600" },
                { label: "Accepted", value: acceptedRequests.length, icon: AlertCircle, bg: "bg-purple-50", text: "text-purple-600" },
                { label: "Completed", value: completedRequests.length, icon: CheckCircle, bg: "bg-green-50", text: "text-green-600" },
              ].map((stat) => (
                <Card key={stat.label} className={cardClass}>
                  <CardContent className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${masterVerified ? "" : stat.bg}`} style={masterVerified ? { background: "rgba(0,229,255,0.15)" } : {}}>
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${masterVerified ? "text-cyan-400" : stat.text}`} />
                    </div>
                    <div>
                      <div className={`text-xl sm:text-2xl font-extrabold ${masterVerified ? "text-white" : "text-gray-900"}`}>{stat.value}</div>
                      <div className={`text-[10px] sm:text-xs font-medium ${masterVerified ? "text-gray-500" : "text-gray-400"}`}>{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: "Product Orders", value: productOrders.length, icon: ShoppingBag, bg: "bg-red-50", text: "text-red-500" },
                { label: "Staff Members", value: staff.length, icon: Users, bg: "bg-red-50", text: "text-red-600" },
                { label: "Products", value: products.length, icon: Package, bg: "bg-purple-50", text: "text-purple-600" },
                { label: "Revenue", value: `₹${completedRequests.length * 500 + productOrders.filter(o => o.status === "confirmed").length * 2000}`, icon: TrendingUp, bg: "bg-green-50", text: "text-green-600" },
              ].map((stat) => (
                <Card key={stat.label} className={cardClass}>
                  <CardContent className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${masterVerified ? "" : stat.bg}`} style={masterVerified ? { background: "rgba(124,58,255,0.15)" } : {}}>
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${masterVerified ? "text-purple-400" : stat.text}`} />
                    </div>
                    <div>
                      <div className={`text-xl sm:text-2xl font-extrabold ${masterVerified ? "text-white" : "text-gray-900"}`}>{stat.value}</div>
                      <div className={`text-[10px] sm:text-xs font-medium ${masterVerified ? "text-gray-500" : "text-gray-400"}`}>{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {serviceRequests.length === 0 && productOrders.length === 0 && staff.length === 0 && (
              <Card className={masterVerified ? "aqerionx-card border-0" : "border-2 border-dashed border-gray-200 shadow-sm bg-white"}>
                <CardContent className="py-10 text-center space-y-4">
                  <Package className={`w-12 h-12 mx-auto ${masterVerified ? "text-cyan-400" : "text-gray-300"}`} />
                  <h3 className={`font-bold text-lg ${masterVerified ? "text-gray-200" : "text-gray-700"}`}>No data yet</h3>
                  <p className={`text-sm ${masterVerified ? "text-gray-500" : "text-gray-400"}`}>Seed the database with sample data to see how everything works.</p>
                  <Button onClick={handleSeedDatabase} disabled={seeding} className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    {seeding ? <><div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white" /> Seeding...</> : <><Package className="w-4 h-4" /> Seed Sample Data</>}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className={cardClass}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-yellow-400" : ""}`}><Clock className={`w-4 h-4 ${masterVerified ? "text-yellow-400" : "text-yellow-500"}`} /> Recent Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length === 0 ? (
                    <p className={`text-sm text-center py-6 ${textSecondary}`}>No pending requests</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {pendingRequests.slice(0, 5).map((r) => (
                        <div key={r.id} className={`flex items-center justify-between p-3 rounded-lg border ${masterVerified ? "" : "bg-yellow-50/60 border-yellow-100"}`} style={masterVerified ? { background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.15)" } : {}}>
                          <div>
                            <div className={`text-sm font-semibold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{r.name}</div>
                            <div className={`text-xs ${textSecondary}`}>{r.serviceType} · {formatDate(r.createdAt)}</div>
                          </div>
                          <StatusBadge status="pending" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className={cardClass}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}><ShoppingBag className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {productOrders.length === 0 ? (
                    <p className={`text-sm text-center py-6 ${textSecondary}`}>No orders yet</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {productOrders.slice(0, 5).map((o) => (
                        <div key={o.id} className={`flex items-center justify-between p-3 rounded-lg border ${masterVerified ? "" : "bg-red-50/60 border-red-100"}`} style={masterVerified ? { background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.15)" } : {}}>
                          <div>
                            <div className={`text-sm font-semibold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{o.productName}</div>
                            <div className={`text-xs ${textSecondary}`}>{o.customerName} · {formatDate(o.createdAt)}</div>
                          </div>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {staff.length > 0 && (
              <Card className={`${cardClass} mt-6`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-purple-400" : ""}`}><BarChart3 className={`w-4 h-4 ${masterVerified ? "text-purple-400" : "text-purple-500"}`} /> Staff Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {staff.filter(s => s.active !== false).map((s) => {
                      const stats = getStaffStats(s.name);
                      return (
                        <div key={s.id} className={`flex items-center justify-between p-3 rounded-lg border ${masterVerified ? "" : "bg-gray-50/60 border-gray-100"}`} style={masterVerified ? { background: "rgba(124,58,255,0.08)", border: "1px solid rgba(124,58,255,0.15)" } : {}}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${masterVerified ? "" : "bg-red-100 text-red-600"}`} style={masterVerified ? { background: "rgba(0,229,255,0.15)", color: "#00e5ff" } : {}}>{s.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className={`text-sm font-semibold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{s.name}</div>
                              <div className={`text-xs ${textSecondary}`}>{s.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Badge className={`${masterVerified ? "text-[10px]" : "bg-red-50 text-red-600 border-red-200 text-[10px]"}`} style={masterVerified ? { background: "rgba(0,229,255,0.15)", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.2)" } : {}}>{stats.active} Active</Badge>
                            <Badge className={`${masterVerified ? "text-[10px]" : "bg-green-50 text-green-600 border-green-200 text-[10px]"}`} style={masterVerified ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" } : {}}>{stats.completed} Done</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SERVICE REQUESTS */}
          <TabsContent value="requests">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {["all", "pending", "accepted", "completed"].map((f) => (
                <Button key={f} variant={requestFilter === f ? "default" : "outline"} size="sm" onClick={() => setRequestFilter(f)} className={requestFilter === f ? "bg-red-600" : ""}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
              <span className={`text-xs ${textSecondary} ml-2`}>{filteredRequests.length} results</span>
            </div>
            <Card className={cardClass}>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={masterVerified ? "" : "bg-gray-50/50"} style={masterVerified ? { background: "rgba(15,15,40,0.5)" } : {}}>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Phone</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Address</TableHead>
                        <TableHead className="text-xs">Service</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Accepted By</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow><TableCell colSpan={8} className={`text-center ${textSecondary} py-8`}>No requests found</TableCell></TableRow>
                      ) : (
                        filteredRequests.map((r) => (
                          <TableRow key={r.id} className={`hover:${masterVerified ? "" : "bg-red-50/30"}`}>
                            <TableCell className="text-sm font-medium">{r.name}</TableCell>
                            <TableCell className="text-sm">{r.phone}</TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate hidden sm:table-cell">{r.address}</TableCell>
                            <TableCell className="text-sm">{r.serviceType}</TableCell>
                            <TableCell><StatusBadge status={r.status} /></TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{r.acceptedBy || "—"}</TableCell>
                            <TableCell className="text-xs text-gray-400 hidden md:table-cell">{formatDate(r.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {r.status !== "completed" && <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 text-[10px] h-7" onClick={() => markCompleted(r.id)}><CheckCircle className="w-3 h-3" /></Button>}
                                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 text-[10px] h-7" onClick={() => deleteRequest(r.id)}><Trash2 className="w-3 h-3" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRODUCT ORDERS */}
          <TabsContent value="orders">
            <Card className={cardClass}>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={masterVerified ? "" : "bg-gray-50/50"} style={masterVerified ? { background: "rgba(15,15,40,0.5)" } : {}}>
                        <TableHead className="text-xs">Product</TableHead>
                        <TableHead className="text-xs">Price</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Customer</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Phone</TableHead>
                        <TableHead className="text-xs hidden lg:table-cell">Address</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productOrders.length === 0 ? (
                        <TableRow><TableCell colSpan={8} className={`text-center ${textSecondary} py-8`}>No orders yet</TableCell></TableRow>
                      ) : (
                        productOrders.map((o) => (
                          <TableRow key={o.id} className={`hover:${masterVerified ? "" : "bg-red-50/30"}`}>
                            <TableCell className="text-sm font-medium">{o.productName}</TableCell>
                            <TableCell className="text-sm font-bold text-red-600">{o.productPrice}</TableCell>
                            <TableCell className="text-sm hidden sm:table-cell">{o.customerName}</TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{o.customerPhone}</TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate hidden lg:table-cell">{o.customerAddress}</TableCell>
                            <TableCell><StatusBadge status={o.status} /></TableCell>
                            <TableCell className="text-xs text-gray-400 hidden md:table-cell">{formatDate(o.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {o.status !== "confirmed" && <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 text-[10px] h-7" onClick={() => confirmOrder(o.id)}><CheckCircle className="w-3 h-3" /></Button>}
                                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 text-[10px] h-7" onClick={() => deleteOrder(o.id)}><Trash2 className="w-3 h-3" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STAFF MANAGEMENT */}
          <TabsContent value="staff">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>Staff Members ({staff.length})</h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1" onClick={() => { setStaffForm({ name: "", email: "", password: "", phone: "" }); setEditingStaffId(null); setStaffFormOpen(true); }}>
                <Plus className="w-4 h-4" /> Add Staff
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {staff.map((s) => {
                const stats = getStaffStats(s.name);
                return (
                  <Card key={s.id} className={cardClass}>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${s.active !== false ? (masterVerified ? "" : "bg-red-600") : "bg-gray-400"}`} style={masterVerified && s.active !== false ? { background: "linear-gradient(135deg, #00e5ff, #7c3aff)" } : {}}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={`font-semibold text-sm ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{s.name}</div>
                            <div className={`text-xs ${textSecondary}`}>{s.email}</div>
                          </div>
                        </div>
                        <Badge className={s.active !== false ? (masterVerified ? "" : "bg-green-50 text-green-700 border-green-200") : (masterVerified ? "" : "bg-red-50 text-red-600 border-red-200")} variant="outline" style={masterVerified ? s.active !== false ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" } : { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" } : {}}>
                          {s.active !== false ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      {s.phone && <div className={`text-xs mb-2 flex items-center gap-1 ${textSecondary}`}><Phone className="w-3 h-3" />{s.phone}</div>}
                      <div className="flex gap-2 mb-3">
                        <Badge className={`${masterVerified ? "text-[9px]" : "bg-red-50 text-red-600 border-red-200 text-[9px]"}`} style={masterVerified ? { background: "rgba(0,229,255,0.15)", color: "#00e5ff", border: "1px solid rgba(0,229,255,0.2)" } : {}}>{stats.active} Active</Badge>
                        <Badge className={`${masterVerified ? "text-[9px]" : "bg-green-50 text-green-600 border-green-200 text-[9px]"}`} style={masterVerified ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" } : {}}>{stats.completed} Completed</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-[10px] h-7 flex-1" onClick={() => editStaff(s)}>Edit</Button>
                        <Button size="sm" variant="outline" className="text-[10px] h-7 flex-1" onClick={() => toggleStaffActive(s)}>{s.active !== false ? "Disable" : "Enable"}</Button>
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 text-[10px] h-7" onClick={() => deleteStaff(s.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {staff.length === 0 && <div className={`col-span-full text-center py-12 ${textSecondary}`}>No staff members yet. Add one!</div>}
            </div>
          </TabsContent>

          {/* LIVE TRACKING */}
          <TabsContent value="tracking">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${masterVerified ? "" : "bg-emerald-50"}`} style={masterVerified ? { background: "rgba(16,185,129,0.15)" } : {}}>
                  <Map className={`w-5 h-5 ${masterVerified ? "text-emerald-400" : "text-emerald-600"}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>Live Staff Tracking</h3>
                  <p className={`text-xs ${textSecondary}`}>Real-time GPS map</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${masterVerified ? "" : "bg-emerald-50 text-emerald-700 border-emerald-200"} border text-[10px]`} style={masterVerified ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" } : {}}>
                  <span className="relative flex h-2 w-2 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                  {staffLocations.length} Active
                </Badge>
                {staffLocations.length > 0 && (
                  <Button size="sm" variant="outline" className={`gap-1 text-xs ${masterVerified ? "border-cyan-800/50 text-cyan-400 hover:bg-cyan-900/20" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`} onClick={() => setMapExpanded(!mapExpanded)}>
                    {mapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    {mapExpanded ? "Collapse" : "Expand"}
                  </Button>
                )}
              </div>
            </div>
            <Card className={`${cardClass} overflow-hidden mb-6`}>
              <CardContent className="p-0">
                {staffLocations.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${masterVerified ? "" : "bg-gray-100"}`} style={masterVerified ? { background: "rgba(0,229,255,0.1)" } : {}}>
                      <Map className={`w-8 h-8 ${masterVerified ? "text-gray-600" : "text-gray-400"}`} />
                    </div>
                    <h3 className={`font-semibold mb-1 ${masterVerified ? "text-gray-300" : "text-gray-700"}`}>No staff being tracked right now</h3>
                    <p className={`text-sm ${textSecondary}`}>When staff accept a service request, their live location will appear on the map.</p>
                  </div>
                ) : (
                  <div style={{ height: mapExpanded ? "700px" : "450px", transition: "height 0.3s ease" }}>
                    <StaffLiveMap staffLocations={staffLocations} isDark={masterVerified} />
                  </div>
                )}
              </CardContent>
            </Card>
            {staffLocations.length > 0 && (
              <div className="space-y-3 mb-6">
                <h4 className={`text-sm font-semibold ${textSecondary}`}>Active Staff Details</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {staffLocations.map((loc) => (
                    <Card key={loc.staffId} className={cardClass}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${masterVerified ? "" : "bg-emerald-600"}`} style={masterVerified ? { background: "linear-gradient(135deg, #00e5ff, #7c3aff)" } : {}}>
                                {loc.staffName.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5">
                                <span className="relative flex h-3.5 w-3.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2" style={masterVerified ? { borderColor: "rgba(15,15,40,1)" } : { borderColor: "white" }}></span>
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className={`font-bold text-sm ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{loc.staffName}</div>
                              <Badge className={`${masterVerified ? "" : "bg-emerald-50 text-emerald-700 border-emerald-200"} border text-[8px] px-1.5 py-0`} style={masterVerified ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" } : {}}>LIVE</Badge>
                            </div>
                          </div>
                          <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className={`gap-1 text-[10px] h-7 shrink-0 ${masterVerified ? "border-cyan-800/50 text-cyan-400 hover:bg-cyan-900/20" : "border-red-200 text-red-600 hover:bg-red-50"}`}>
                              <ExternalLink className="w-3 h-3" /> Maps
                            </Button>
                          </a>
                        </div>
                        {loc.activeRequestName && (
                          <div className={`mt-2 p-2 rounded-lg text-xs ${masterVerified ? "" : "bg-red-50"}`} style={masterVerified ? { background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.1)" } : {}}>
                            <div className="flex items-center gap-1.5">
                              <Wrench className={`w-3 h-3 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} />
                              <span className={masterVerified ? "text-gray-300" : "text-gray-700"}>{loc.activeRequestName}</span>
                              <span style={{ color: masterVerified ? "#00e5ff" : "#dc2626" }}>{loc.activeRequestService}</span>
                            </div>
                          </div>
                        )}
                        <div className={`flex items-center gap-3 mt-2 text-[10px] ${textSecondary}`}>
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{getTimeSince(loc.lastUpdated)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {staff.length > 0 && (
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Offline Staff</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {staff.filter(s => s.active !== false && !staffLocations.some(loc => loc.staffId === s.id)).map((s) => (
                    <Card key={s.id} className={masterVerified ? "border-0 opacity-60" : "border border-gray-100 shadow-sm bg-white opacity-60"}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${masterVerified ? "" : "bg-gray-400"}`} style={masterVerified ? { background: "rgba(100,100,120,0.3)" } : {}}>{s.name.charAt(0).toUpperCase()}</div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${masterVerified ? "text-gray-400" : "text-gray-600"}`}>{s.name}</div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${masterVerified ? "bg-gray-600" : "bg-gray-300"}`}></span>
                            <span className={`text-[10px] ${textSecondary}`}>No active job</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* PRODUCT MANAGEMENT */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>Products ({products.length})</h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white gap-1" onClick={() => { setProductForm({ name: "", price: "", category: categoryForm[0] || "Accessories", image: "", description: "", type: "", variant: "" }); setEditingProductId(null); setProductFormOpen(true); }}>
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {products.map((p) => (
                <Card key={p.id} className={`${cardClass} group`}>
                  <div className={`h-28 sm:h-32 flex items-center justify-center relative overflow-hidden ${masterVerified ? "" : "bg-gradient-to-br from-red-50 to-red-100"}`} style={masterVerified ? { background: "rgba(15,15,40,0.5)" } : {}}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className={`w-8 h-8 ${masterVerified ? "text-gray-600" : "text-red-300"}`} />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => editProduct(p)}>Edit</Button>
                        <Button size="sm" variant="destructive" className="h-7 text-[10px]" onClick={() => deleteProduct(p.id)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-2.5 sm:p-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-bold text-xs truncate ${masterVerified ? "text-gray-200" : "text-gray-900"}`}>{p.name}</h4>
                        <p className={`text-[10px] ${textSecondary}`}>{p.category} {p.type ? `· ${p.type}` : ''}</p>
                      </div>
                      <span className={`text-sm font-extrabold shrink-0 ml-1 ${masterVerified ? "text-cyan-400" : "text-red-600"}`}>{p.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {products.length === 0 && <div className={`col-span-full text-center py-12 ${textSecondary}`}>No products yet. Add one from Settings or here!</div>}
            </div>
          </TabsContent>

          {/* ========== SETTINGS TAB ========== */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${masterVerified ? "" : "bg-red-50"}`} style={masterVerified ? { background: "rgba(0,229,255,0.15)" } : {}}>
                  <Settings className={`w-5 h-5 ${masterVerified ? "text-cyan-400" : "text-red-600"}`} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${masterVerified ? "text-white" : "text-gray-900"}`}>Website Settings</h2>
                  <p className={`text-xs ${textSecondary}`}>Manage your website content, theme, and features</p>
                </div>
              </div>

              {/* THEME / COLOR MANAGEMENT */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <Palette className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Theme & Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-xs ${textSecondary}`}>Change website colors - these will update the live website immediately!</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={themeForm.primaryColor} onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg border cursor-pointer" />
                        <Input value={themeForm.primaryColor} onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })} className={`flex-1 ${masterVerified ? "bg-white/5 text-white border-gray-700" : ""}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Background Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={themeForm.backgroundColor} onChange={(e) => setThemeForm({ ...themeForm, backgroundColor: e.target.value })} className="w-10 h-10 rounded-lg border cursor-pointer" />
                        <Input value={themeForm.backgroundColor} onChange={(e) => setThemeForm({ ...themeForm, backgroundColor: e.target.value })} className={`flex-1 ${masterVerified ? "bg-white/5 text-white border-gray-700" : ""}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Accent Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={themeForm.accentColor} onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })} className="w-10 h-10 rounded-lg border cursor-pointer" />
                        <Input value={themeForm.accentColor} onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })} className={`flex-1 ${masterVerified ? "bg-white/5 text-white border-gray-700" : ""}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={themeForm.secondaryColor} onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })} className="w-10 h-10 rounded-lg border cursor-pointer" />
                        <Input value={themeForm.secondaryColor} onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })} className={`flex-1 ${masterVerified ? "bg-white/5 text-white border-gray-700" : ""}`} />
                      </div>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="rounded-xl p-4 border" style={{ background: themeForm.backgroundColor, borderColor: `${themeForm.primaryColor}30` }}>
                    <p className="text-xs font-medium mb-2" style={{ color: themeForm.primaryColor }}>Preview</p>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-lg text-white text-xs font-medium" style={{ background: themeForm.primaryColor }}>Primary</div>
                      <div className="px-3 py-1.5 rounded-lg text-white text-xs font-medium" style={{ background: themeForm.accentColor }}>Accent</div>
                      <div className="px-3 py-1.5 rounded-lg text-white text-xs font-medium" style={{ background: themeForm.secondaryColor }}>Secondary</div>
                    </div>
                  </div>
                  <Button onClick={saveThemeSettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Theme & Update Website"}
                  </Button>
                </CardContent>
              </Card>

              {/* HERO SECTION */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <Type className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Hero Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Title (e.g. RACE)</Label>
                      <Input value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Subtitle (e.g. COMPUTER)</Label>
                      <Input value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Tagline</Label>
                      <Input value={heroForm.tagline} onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })} className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                  </div>
                  <Button onClick={saveHeroSettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Hero"}</Button>
                </CardContent>
              </Card>

              {/* PRODUCT CATEGORIES */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <Tag className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Product Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-xs ${textSecondary}`}>Manage categories for products. These show up on the website product filter.</p>
                  <div className="flex flex-wrap gap-2">
                    {categoryForm.map((cat, i) => (
                      <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${masterVerified ? "border-cyan-800/50 text-cyan-400" : "border-red-200 bg-red-50 text-red-700"}`}>
                        <span className="text-xs font-medium">{cat}</span>
                        <button onClick={() => setCategoryForm(categoryForm.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="New category name" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} onKeyDown={(e) => {
                      if (e.key === "Enter" && categoryInput.trim()) { setCategoryForm([...categoryForm, categoryInput.trim()]); setCategoryInput(""); }
                    }} />
                    <Button onClick={() => { if (categoryInput.trim()) { setCategoryForm([...categoryForm, categoryInput.trim()]); setCategoryInput(""); } }} className="bg-red-600 hover:bg-red-700 text-white shrink-0"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <Button onClick={saveCategorySettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Categories"}</Button>
                </CardContent>
              </Card>

              {/* SERVICE TYPES */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <Wrench className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Service Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-xs ${textSecondary}`}>Manage service types shown in the booking form.</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypeForm.map((type, i) => (
                      <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${masterVerified ? "border-cyan-800/50 text-cyan-400" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
                        <span className="text-xs font-medium">{type}</span>
                        <button onClick={() => setServiceTypeForm(serviceTypeForm.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="New service type" value={serviceTypeInput} onChange={(e) => setServiceTypeInput(e.target.value)} className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} onKeyDown={(e) => {
                      if (e.key === "Enter" && serviceTypeInput.trim()) { setServiceTypeForm([...serviceTypeForm, serviceTypeInput.trim()]); setServiceTypeInput(""); }
                    }} />
                    <Button onClick={() => { if (serviceTypeInput.trim()) { setServiceTypeForm([...serviceTypeForm, serviceTypeInput.trim()]); setServiceTypeInput(""); } }} className="bg-red-600 hover:bg-red-700 text-white shrink-0"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <Button onClick={saveServiceTypeSettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Service Types"}</Button>
                </CardContent>
              </Card>

              {/* TICKER BAR */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <MessageSquare className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Ticker Bar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className={`text-xs ${textSecondary}`}>Manage the scrolling text items at the top of the website.</p>
                  <div className="flex flex-wrap gap-2">
                    {tickerForm.map((item, i) => (
                      <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${masterVerified ? "border-cyan-800/50 text-cyan-400" : "border-purple-200 bg-purple-50 text-purple-700"}`}>
                        <span className="text-xs font-medium">{item}</span>
                        <button onClick={() => setTickerForm(tickerForm.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="New ticker item" value={tickerInput} onChange={(e) => setTickerInput(e.target.value)} className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} onKeyDown={(e) => {
                      if (e.key === "Enter" && tickerInput.trim()) { setTickerForm([...tickerForm, tickerInput.trim()]); setTickerInput(""); }
                    }} />
                    <Button onClick={() => { if (tickerInput.trim()) { setTickerForm([...tickerForm, tickerInput.trim()]); setTickerInput(""); } }} className="bg-red-600 hover:bg-red-700 text-white shrink-0"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <Button onClick={saveTickerSettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Ticker"}</Button>
                </CardContent>
              </Card>

              {/* CONTACT INFO */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <Phone className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Phone Number</Label>
                      <Input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Email</Label>
                      <Input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="info@racecomputer.in" className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>Address</Label>
                      <Input value={contactForm.address} onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })} placeholder="Sanganer Bazar, Jaipur" className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>WhatsApp Number</Label>
                      <Input value={contactForm.whatsapp} onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })} placeholder="91XXXXXXXXXX" className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                    </div>
                  </div>
                  <Button onClick={saveContactSettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Contact"}</Button>
                </CardContent>
              </Card>

              {/* ABOUT SECTION */}
              <Card className={masterVerified ? "aqerionx-card border-0" : "border border-gray-100 shadow-sm bg-white"}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${masterVerified ? "text-cyan-400" : ""}`}>
                    <Globe className={`w-4 h-4 ${masterVerified ? "text-cyan-400" : "text-red-500"}`} /> About Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className={`text-xs ${masterVerified ? "text-gray-300" : ""}`}>About Text</Label>
                    <Textarea value={aboutForm.text} onChange={(e) => setAboutForm({ ...aboutForm, text: e.target.value })} rows={4} placeholder="Write about your business..." className={masterVerified ? "bg-white/5 text-white border-gray-700" : ""} />
                  </div>
                  <Button onClick={saveAboutSettings} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save About"}</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MASTER ADMIN TAB */}
          {masterVerified && (
            <TabsContent value="master">
              <Card className="border-2 border-purple-200 shadow-md bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700"><Shield className="w-5 h-5" /> Master Admin Control Panel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Settings className="w-4 h-4" /> Admin Credentials</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label>Admin Email</Label><Input value={adminSettings.email} onChange={(e) => setAdminSettings({ ...adminSettings, email: e.target.value })} className="bg-white" /></div>
                      <div className="space-y-1.5"><Label>Admin Password</Label><Input value={adminSettings.password} onChange={(e) => setAdminSettings({ ...adminSettings, password: e.target.value })} className="bg-white" /></div>
                    </div>
                    <Button onClick={updateAdminCredentials} className="bg-purple-600 hover:bg-purple-700 text-white gap-1"><Settings className="w-4 h-4" /> Update Credentials</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Activity className="w-4 h-4" /> System Statistics</h4>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-red-50/60 rounded-xl p-3 sm:p-4 border border-red-100"><div className="text-xl sm:text-2xl font-extrabold text-red-600">{serviceRequests.length}</div><div className="text-[10px] sm:text-xs text-gray-500">Total Requests</div></div>
                      <div className="bg-green-50/60 rounded-xl p-3 sm:p-4 border border-green-100"><div className="text-xl sm:text-2xl font-extrabold text-green-600">{productOrders.length}</div><div className="text-[10px] sm:text-xs text-gray-500">Total Orders</div></div>
                      <div className="bg-purple-50/60 rounded-xl p-3 sm:p-4 border border-purple-100"><div className="text-xl sm:text-2xl font-extrabold text-purple-600">{staff.length}</div><div className="text-[10px] sm:text-xs text-gray-500">Staff</div></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Package className="w-4 h-4" /> Seed Database</h4>
                    <p className="text-sm text-gray-500">Populate Firebase with sample data.</p>
                    <Button onClick={handleSeedDatabase} disabled={seeding} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white gap-2">
                      {seeding ? <><div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white" /> Seeding...</> : <><Package className="w-4 h-4" /> Seed Sample Data</>}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Activity Log</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {serviceRequests.map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.status === "completed" ? "bg-green-100" : r.status === "accepted" ? "bg-red-100" : "bg-yellow-100"}`}><Wrench className={`w-4 h-4 ${r.status === "completed" ? "text-green-600" : r.status === "accepted" ? "text-red-600" : "text-yellow-600"}`} /></div>
                            <div><div className="text-xs font-semibold text-gray-900">{r.name} · {r.serviceType}</div><div className="text-[10px] text-gray-400">{r.acceptedBy ? `Accepted by ${r.acceptedBy}` : "Pending"} · {formatDate(r.createdAt)}</div></div>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                      ))}
                      {productOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${o.status === "confirmed" ? "bg-green-100" : "bg-red-100"}`}><ShoppingBag className={`w-4 h-4 ${o.status === "confirmed" ? "text-green-600" : "text-red-600"}`} /></div>
                            <div><div className="text-xs font-semibold text-gray-900">{o.customerName} ordered {o.productName}</div><div className="text-[10px] text-gray-400">{o.customerPhone} · {formatDate(o.createdAt)}</div></div>
                          </div>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                      {serviceRequests.length === 0 && productOrders.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No activity yet</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Staff Form Dialog */}
      <Dialog open={staffFormOpen} onOpenChange={setStaffFormOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader><DialogTitle>{editingStaffId ? "Edit Staff" : "Add Staff Member"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Full Name *</Label><Input placeholder="Staff name" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} className="bg-white" /></div>
            <div className="space-y-1.5"><Label>Email *</Label><Input type="email" placeholder="staff@racecomputer.in" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} className="bg-white" /></div>
            <div className="space-y-1.5"><Label>Password *</Label><Input type="password" placeholder="••••••" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} className="bg-white" /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input type="tel" placeholder="+91 XXXXX XXXXX" value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} className="bg-white" /></div>
            <Button onClick={saveStaff} className="w-full bg-red-600 hover:bg-red-700 text-white">{editingStaffId ? "Update Staff" : "Add Staff"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Form Dialog */}
      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProductId ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Product Name *</Label><Input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="bg-white" /></div>
            <div className="space-y-1.5"><Label>Price *</Label><Input placeholder="₹1,999" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="bg-white" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={productForm.category} onValueChange={(val) => setProductForm({ ...productForm, category: val })}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoryForm.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Type</Label><Input placeholder="e.g. Laptop, Keyboard" value={productForm.type} onChange={(e) => setProductForm({ ...productForm, type: e.target.value })} className="bg-white" /></div>
            </div>
            <div className="space-y-1.5"><Label>Variant</Label><Input placeholder="e.g. i5/8GB/512GB" value={productForm.variant} onChange={(e) => setProductForm({ ...productForm, variant: e.target.value })} className="bg-white" /></div>
            <div className="space-y-1.5">
              <Label>Product Image</Label>
              <div className="flex gap-2">
                <Input placeholder="Image URL (https://...)" value={productForm.image && !productForm.image.startsWith("data:") ? productForm.image : ""} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="bg-white flex-1" />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }} />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={imageUploading} className="gap-1 shrink-0">
                  {imageUploading ? <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                </Button>
              </div>
              {productForm.image && (
                <div className="mt-2 relative inline-block">
                  <img src={productForm.image} alt="Preview" className="h-20 w-20 object-cover rounded-lg border" />
                  <button onClick={() => setProductForm({ ...productForm, image: "" })} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">×</button>
                </div>
              )}
            </div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Product description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={2} className="bg-white" /></div>
            <Button onClick={saveProduct} className="w-full bg-red-600 hover:bg-red-700 text-white">{editingProductId ? "Update Product" : "Add Product"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
