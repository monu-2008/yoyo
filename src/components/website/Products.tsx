"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, MessageCircle, Package, ArrowRight, X, Star, Tag, Layers, Info } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  type?: string;
  variant?: string;
  rating?: number;
}

const DEFAULT_CATEGORIES = ["All", "Accessories", "Components", "Repair Parts"];

export default function Products() {
  const { setView, siteTheme } = useAppStore();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [detailOpen, setDetailOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "" });
  const [orderLoading, setOrderLoading] = useState(false);

  const pc = siteTheme.primaryColor;
  const ac = siteTheme.accentColor;
  const sc = siteTheme.secondaryColor;

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      if (snap.exists()) {
        const prods: Product[] = [];
        snap.forEach((child) => {
          prods.push({ id: child.key || "", ...child.val() });
        });
        prods.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProducts(prods);
      } else {
        setProducts([]);
      }
    });

    // Load categories from Firebase
    const catRef = ref(db, "settings/categories");
    const unsubCat = onValue(catRef, (snap) => {
      if (snap.exists() && Array.isArray(snap.val()) && snap.val().length > 0) {
        setCategories(["All", ...snap.val()]);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    });

    return () => { unsub(); unsubCat(); };
  }, []);

  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);
  const previewProducts = filtered.slice(0, 6);

  const openDetail = (product: Product) => { setSelectedProduct(product); setDetailOpen(true); };
  const openOrder = (product: Product) => { setSelectedProduct(product); setDetailOpen(false); setOrderForm({ name: "", phone: "", address: "" }); setOrderOpen(true); };

  const handleOrder = async () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      toast({ title: "Please fill all fields", variant: "destructive" }); return;
    }
    setOrderLoading(true);
    try {
      await push(ref(db, "productOrders"), {
        productName: selectedProduct?.name, productPrice: selectedProduct?.price,
        customerName: orderForm.name, customerPhone: orderForm.phone,
        customerAddress: orderForm.address, status: "pending", createdAt: Date.now(),
      });
      setOrderOpen(false);
      toast({ title: "Order Placed!", description: "Please complete payment via WhatsApp.", duration: 5000 });
    } catch { toast({ title: "Order failed", variant: "destructive" }); }
    setOrderLoading(false);
  };

  const openWhatsApp = () => {
    const msg = `New Order: ${selectedProduct?.name}, Name: ${orderForm.name}, Address: ${orderForm.address}, Phone: ${orderForm.phone}`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section id="products" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-50/80 backdrop-blur-md border border-purple-200/50 rounded-full px-4 py-2 mb-4">
            <Package className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-semibold text-purple-600 tracking-wider uppercase">// Product Lineup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">Our Products</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">Top brands available — ASUS, HP, Epson, Intel and many more.</p>
          <div className="w-14 h-1 rounded-full mx-auto mt-4" style={{ background: `linear-gradient(to right, ${pc}, ${ac})` }} />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm"
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "text-white shadow-md" : "bg-white/60 backdrop-blur-md border-gray-200/50"}
              style={activeCategory === cat ? { background: `linear-gradient(to right, ${pc}, ${ac})` } : {}}
            >{cat}</Button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Products Coming Soon</h3>
            <p className="text-gray-300 mt-1">We&apos;re adding products. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
            {previewProducts.map((product) => (
              <Card key={product.id} className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white/60 backdrop-blur-lg cursor-pointer" onClick={() => openDetail(product)}>
                <div className="h-36 sm:h-44 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Package className="w-12 h-12 text-blue-300" />
                  )}
                  <Badge className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-blue-600 border-blue-200/50 text-[10px] hover:bg-white/90">{product.category}</Badge>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold" style={{ background: `linear-gradient(to right, ${pc}, ${ac})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{product.price}</span>
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); openOrder(product); }} className="text-white text-xs gap-1 rounded-lg" style={{ background: `linear-gradient(to right, ${pc}, ${pc}dd)` }}>
                      <ShoppingBag className="w-3 h-3" /> Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filtered.length > 6 && (
          <div className="text-center mt-10">
            <Button size="lg" className="bg-white/70 backdrop-blur-lg border-2 shadow-lg rounded-xl px-8 sm:px-10 h-12 sm:h-13 text-sm sm:text-base gap-2" style={{ borderColor: `${pc}40`, color: pc }} onClick={() => setView("fullProducts")}>
              Explore Full Products <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-xs text-gray-400 mt-2">{filtered.length}+ products available</p>
          </div>
        )}
        {filtered.length <= 6 && filtered.length > 0 && (
          <div className="text-center mt-10">
            <Button size="lg" className="bg-white/70 backdrop-blur-lg border-2 shadow-lg rounded-xl px-8 sm:px-10 h-12 sm:h-13 text-sm sm:text-base gap-2" style={{ borderColor: `${pc}40`, color: pc }} onClick={() => setView("fullProducts")}>
              View All Products <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Popup */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg bg-white/80 backdrop-blur-2xl border-white/30 shadow-2xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-lg"><Package className="w-5 h-5" style={{ color: pc }} /> Product Details</DialogTitle></DialogHeader>
          {selectedProduct && (
            <div className="space-y-5">
              <div className="h-48 sm:h-52 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden border border-blue-100/50">
                {selectedProduct.image ? <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" /> : <Package className="w-16 h-16 text-blue-300" />}
              </div>
              <div className="flex items-start justify-between">
                <div><h3 className="text-xl font-extrabold text-gray-900">{selectedProduct.name}</h3><p className="text-sm text-gray-500 mt-1">{selectedProduct.description}</p></div>
                <div className="text-2xl font-extrabold" style={{ background: `linear-gradient(to right, ${pc}, ${ac})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{selectedProduct.price}</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50/60 backdrop-blur-md rounded-xl p-3 border border-blue-100/50 text-center"><Tag className="w-4 h-4 text-blue-500 mx-auto mb-1" /><div className="text-[10px] text-gray-400 uppercase tracking-wider">Category</div><div className="text-xs font-bold text-blue-700 mt-0.5">{selectedProduct.category}</div></div>
                <div className="bg-purple-50/60 backdrop-blur-md rounded-xl p-3 border border-purple-100/50 text-center"><Layers className="w-4 h-4 text-purple-500 mx-auto mb-1" /><div className="text-[10px] text-gray-400 uppercase tracking-wider">Type</div><div className="text-xs font-bold text-purple-700 mt-0.5">{selectedProduct.type || "General"}</div></div>
                <div className="bg-red-50/60 backdrop-blur-md rounded-xl p-3 border border-red-100/50 text-center"><Info className="w-4 h-4 text-red-500 mx-auto mb-1" /><div className="text-[10px] text-gray-400 uppercase tracking-wider">Variant</div><div className="text-xs font-bold text-red-700 mt-0.5">{selectedProduct.variant || "Standard"}</div></div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => openOrder(selectedProduct)} className="flex-1 text-white font-semibold h-12" style={{ background: `linear-gradient(to right, ${pc}, ${ac})` }}><ShoppingBag className="w-4 h-4 mr-2" /> Order Now</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="sm:max-w-md bg-white/80 backdrop-blur-2xl border-white/30 shadow-2xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" style={{ color: pc }} /> Order Product</DialogTitle></DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50/60 backdrop-blur-md rounded-lg border border-blue-100/50">
                <Package className="w-8 h-8 text-blue-400" />
                <div><div className="font-bold text-sm text-gray-900">{selectedProduct.name}</div><div className="text-lg font-extrabold" style={{ color: pc }}>{selectedProduct.price}</div></div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5"><Label>Your Name *</Label><Input placeholder="Enter your name" value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} className="bg-white/60 backdrop-blur-md border-gray-200/50" /></div>
                <div className="space-y-1.5"><Label>Phone Number *</Label><Input type="tel" placeholder="+91 98765 43210" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} className="bg-white/60 backdrop-blur-md border-gray-200/50" /></div>
                <div className="space-y-1.5"><Label>Address *</Label><Input placeholder="Your delivery address" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} className="bg-white/60 backdrop-blur-md border-gray-200/50" /></div>
              </div>
              <Button onClick={handleOrder} className="w-full text-white font-semibold" style={{ background: `linear-gradient(to right, ${pc}, ${ac})` }} disabled={orderLoading}>{orderLoading ? "Placing Order..." : "Place Order"}</Button>
              <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 backdrop-blur-md px-2 text-gray-400">or</span></div></div>
              <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 gap-2" onClick={openWhatsApp}><MessageCircle className="w-4 h-4" /> Pay on WhatsApp</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
