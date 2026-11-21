"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Printer,
  Edit,
  Trash2,
  Upload,
  Star,
  Settings,
  ShoppingBag,
  LogOut,
  RefreshCw,
  ExternalLink,
  Save,
  Phone,
} from "lucide-react";
import { BRAND_NAME, PRODUCT_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Tab State: 'orders' | 'product' | 'settings'
  const [activeTab, setActiveTab] = useState<"orders" | "product" | "settings">("orders");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Product State
  const [product, setProduct] = useState<any>({
    name: `${BRAND_NAME} – ${PRODUCT_NAME}`,
    description: "",
    price: 1850,
    stock_quantity: 100,
  });
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<any>({
    delivery_charge_inside_dhaka: 70,
    delivery_charge_outside_dhaka: 130,
    contact_phone: "+880 1700-000000",
    whatsapp_number: "+880 1700-000000",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Check auth cookie
  useEffect(() => {
    const isAuthed = document.cookie.includes("ff_admin_auth=true");
    if (!isAuthed) {
      router.push("/admin/login");
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const orderRes = await fetch("/api/admin/orders");
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrders(orderData.orders || []);
      }

      // Fetch product
      const prodRes = await fetch("/api/admin/products");
      const prodData = await prodRes.json();
      if (prodData.success && prodData.product) {
        setProduct(prodData.product);
      }

      // Fetch images
      const imgRes = await fetch("/api/admin/images");
      const imgData = await imgRes.json();
      if (imgData.success) {
        setImages(imgData.images || []);
      }

      // Fetch settings
      const setRes = await fetch("/api/admin/settings");
      const setData = await setRes.json();
      if (setData.success && setData.settings) {
        setSettings(setData.settings);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "ff_admin_auth=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, order_status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setProductMessage(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.success) {
        setProductMessage("প্রোডাক্ট তথ্য সফলভাবে আপডেট হয়েছে!");
        setTimeout(() => setProductMessage(null), 3000);
      } else {
        setProductMessage(data.message || "আপডেট ব্যর্থ হয়েছে");
      }
    } catch {
      setProductMessage("আপডেট ব্যর্থ হয়েছে");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage("ওয়েবসাইট সেটিংস সফলভাবে আপডেট হয়েছে!");
        setTimeout(() => setSettingsMessage(null), 3000);
      } else {
        setSettingsMessage(data.message || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch {
      setSettingsMessage("সেটিংস সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.image) {
        setImages((prev) => [...prev, data.image]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      const res = await fetch("/api/admin/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, action: "set_primary" }),
      });
      if (res.ok) {
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            is_primary: img.id === imageId,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ছবিটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/images?id=${encodeURIComponent(imageId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Essential Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.order_status === "Delivered").length;
  const totalSales = orders
    .filter((o) => o.order_status !== "Cancelled" && o.order_status !== "Returned")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.order_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Top Navbar */}
      <nav className="bg-brand-surface border-b border-brand-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center font-bold text-black text-xs flex-shrink-0">
                FF
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-sm sm:text-base font-display tracking-wider truncate">
                  {BRAND_NAME}
                </span>
                <span className="hidden xs:inline-block sm:inline-block text-[9px] sm:text-[10px] uppercase font-bold text-brand-gold bg-brand-card px-1.5 sm:px-2 py-0.5 rounded border border-brand-border whitespace-nowrap">
                  অ্যাডমিন
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle />
              <Link
                href="/"
                target="_blank"
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-gold px-3 py-1.5 rounded-lg border border-brand-border"
              >
                <span>স্টোর দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* ESSENTIAL STATS DASHBOARD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-border flex items-center gap-2.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-brand-text-muted font-medium truncate">মোট অর্ডার</p>
              <p className="text-lg sm:text-2xl font-black text-brand-text mt-0.5">{totalOrders}</p>
            </div>
          </div>

          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-border flex items-center gap-2.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-brand-text-muted font-medium truncate">পেন্ডিং অর্ডার</p>
              <p className="text-lg sm:text-2xl font-black text-amber-400 mt-0.5">{pendingOrders}</p>
            </div>
          </div>

          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-border flex items-center gap-2.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-brand-text-muted font-medium truncate">ডেলিভার্ড অর্ডার</p>
              <p className="text-lg sm:text-2xl font-black text-emerald-400 mt-0.5">{deliveredOrders}</p>
            </div>
          </div>

          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-borderGold flex items-center gap-2.5 sm:gap-4 shadow-luxury">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-brand-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-brand-text-muted font-medium truncate">মোট বিক্রি</p>
              <p className="text-base sm:text-2xl font-black text-brand-gold font-display mt-0.5 truncate">
                ৳{totalSales.toLocaleString("bn-BD")}
              </p>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-brand-border pb-2 overflow-x-auto no-scrollbar scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === "orders"
                ? "bg-gold-gradient text-black shadow-gold"
                : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface"
            }`}
          >
            <Package className="w-4 h-4 flex-shrink-0" />
            <span>অর্ডার ব্যবস্থাপনা ({totalOrders})</span>
          </button>

          <button
            onClick={() => setActiveTab("product")}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === "product"
                ? "bg-gold-gradient text-black shadow-gold"
                : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface"
            }`}
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span>প্রোডাক্ট ও ছবি</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === "settings"
                ? "bg-gold-gradient text-black shadow-gold"
                : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface"
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>ওয়েবসাইট সেটিংস</span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অর্ডার আইডি, ফোন বা নাম খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs sm:text-sm text-brand-text placeholder-brand-text-dim focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <Search className="w-4 h-4 text-brand-text-dim absolute left-3.5 top-3" />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <Filter className="w-4 h-4 text-brand-text-muted flex-shrink-0" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  >
                    <option value="ALL">সকল স্ট্যাটাস</option>
                    <option value="Pending">পেন্ডিং (Pending)</option>
                    <option value="Confirmed">কনফার্মড (Confirmed)</option>
                    <option value="Processing">প্রসেসিং (Processing)</option>
                    <option value="Shipped">শিপড (Shipped)</option>
                    <option value="Delivered">ডেলিভার্ড (Delivered)</option>
                    <option value="Cancelled">ক্যান্সেলড (Cancelled)</option>
                    <option value="Returned">রিটার্নড (Returned)</option>
                  </select>
                </div>

                <button
                  onClick={loadData}
                  className="p-2 sm:p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors flex-shrink-0"
                  title="রিফ্রেশ করুন"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile View: Order Cards (Visible on screens < md) */}
            <div className="block md:hidden space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-brand-text-muted rounded-2xl bg-brand-surface border border-brand-border">
                  কোনো অর্ডার পাওয়া যায়নি।
                </div>
              ) : (
                filteredOrders.map((o) => {
                  const statusColors: Record<string, string> = {
                    Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                    Confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
                    Processing: "bg-purple-500/15 text-purple-400 border-purple-500/30",
                    Shipped: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
                    Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                    Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
                    Returned: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
                  };

                  const orderDate = new Date(o.created_at || Date.now()).toLocaleDateString(
                    "bn-BD",
                    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                  );

                  return (
                    <div
                      key={o.id}
                      className="p-4 rounded-2xl bg-brand-surface border border-brand-border space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-2.5">
                        <div>
                          <span className="font-mono font-bold text-brand-gold text-sm">
                            {o.order_number}
                          </span>
                          <p className="text-[11px] text-brand-text-dim mt-0.5">{orderDate}</p>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            statusColors[o.order_status] || "border-brand-border"
                          }`}
                        >
                          {o.order_status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-text text-sm">
                            {o.customer?.name || "Customer"}
                          </span>
                          <span className="font-bold text-brand-gold font-display text-base">
                            ৳{o.total_amount}
                          </span>
                        </div>

                        {o.customer?.phone && (
                          <div className="flex items-center gap-1.5 text-brand-text-muted">
                            <Phone className="w-3.5 h-3.5 text-brand-gold" />
                            <a
                              href={`tel:${o.customer.phone}`}
                              className="font-mono text-brand-text hover:text-brand-gold underline"
                            >
                              {o.customer.phone}
                            </a>
                          </div>
                        )}

                        <p className="text-brand-text-dim pt-1 line-clamp-2">
                          {o.customer?.full_address}, {o.customer?.district}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-brand-border/60">
                        <select
                          value={o.order_status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border bg-brand-card cursor-pointer focus:outline-none ${
                            statusColors[o.order_status] || "border-brand-border"
                          }`}
                        >
                          <option value="Pending" className="bg-brand-surface text-brand-text">পেন্ডিং (Pending)</option>
                          <option value="Confirmed" className="bg-brand-surface text-brand-text">কনফার্মড (Confirmed)</option>
                          <option value="Processing" className="bg-brand-surface text-brand-text">প্রসেসিং (Processing)</option>
                          <option value="Shipped" className="bg-brand-surface text-brand-text">শিপড (Shipped)</option>
                          <option value="Delivered" className="bg-brand-surface text-brand-text">ডেলিভার্ড (Delivered)</option>
                          <option value="Cancelled" className="bg-brand-surface text-brand-text">ক্যান্সেলড (Cancelled)</option>
                          <option value="Returned" className="bg-brand-surface text-brand-text">রিটার্নড (Returned)</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-2.5 py-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-brand-gold" />
                            <span>বিবরণ</span>
                          </button>

                          <Link
                            href={`/admin/invoice/${encodeURIComponent(o.order_number)}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-gold transition-colors"
                            title="ইনভয়েস প্রিন্ট"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Orders Table (Visible on md and above) */}
            <div className="hidden md:block rounded-2xl bg-brand-surface border border-brand-border overflow-hidden shadow-luxury">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-card text-xs text-brand-text-muted uppercase font-bold tracking-wider">
                      <th className="p-4">অর্ডার আইডি</th>
                      <th className="p-4">তারিখ</th>
                      <th className="p-4">গ্রাহকের নাম</th>
                      <th className="p-4">মোবাইল নাম্বার</th>
                      <th className="p-4">জেলা</th>
                      <th className="p-4 text-right">মোট টাকা (COD)</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-brand-text-muted">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const statusColors: Record<string, string> = {
                          Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                          Confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
                          Processing: "bg-purple-500/15 text-purple-400 border-purple-500/30",
                          Shipped: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
                          Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                          Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
                          Returned: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
                        };

                        const orderDate = new Date(o.created_at || Date.now()).toLocaleDateString(
                          "bn-BD",
                          { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                        );

                        return (
                          <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono font-bold text-brand-gold">
                              {o.order_number}
                            </td>
                            <td className="p-4 text-xs text-brand-text-muted whitespace-nowrap">
                              {orderDate}
                            </td>
                            <td className="p-4 font-semibold text-brand-text">
                              {o.customer?.name || "Customer"}
                            </td>
                            <td className="p-4 text-xs font-mono text-brand-text-muted">
                              {o.customer?.phone}
                            </td>
                            <td className="p-4 text-xs text-brand-text-muted">
                              {o.customer?.district}
                            </td>
                            <td className="p-4 text-right font-bold text-brand-text">
                              ৳{o.total_amount}
                            </td>
                            <td className="p-4">
                              <select
                                value={o.order_status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none ${
                                  statusColors[o.order_status] || "border-brand-border"
                                }`}
                              >
                                <option value="Pending" className="bg-brand-surface text-brand-text">Pending (পেন্ডিং)</option>
                                <option value="Confirmed" className="bg-brand-surface text-brand-text">Confirmed (কনফার্মড)</option>
                                <option value="Processing" className="bg-brand-surface text-brand-text">Processing (প্রসেসিং)</option>
                                <option value="Shipped" className="bg-brand-surface text-brand-text">Shipped (শিপড)</option>
                                <option value="Delivered" className="bg-brand-surface text-brand-text">Delivered (ডেলিভার্ড)</option>
                                <option value="Cancelled" className="bg-brand-surface text-brand-text">Cancelled (ক্যান্সেলড)</option>
                                <option value="Returned" className="bg-brand-surface text-brand-text">Returned (রিটার্নড)</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedOrder(o)}
                                  className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                                  title="অর্ডার বিবরণ দেখুন"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <Link
                                  href={`/admin/invoice/${encodeURIComponent(o.order_number)}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover text-brand-gold transition-colors"
                                  title="ইনভয়েস প্রিন্ট করুন"
                                >
                                  <Printer className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === "product" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Product Details Form */}
            <div className="lg:col-span-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <h3 className="font-bold text-base sm:text-lg text-brand-text">প্রোডাক্ট তথ্য সম্পাদনা</h3>
                <span className="text-[11px] sm:text-xs text-brand-gold uppercase font-semibold">
                  সিঙ্গেল প্রোডাক্ট স্টোর
                </span>
              </div>

              {productMessage && (
                <div className="p-3.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-xs text-brand-gold font-medium">
                  {productMessage}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    প্রোডাক্টের নাম
                  </label>
                  <input
                    type="text"
                    value={product.name || ""}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    মূল্য (টাকা)
                  </label>
                  <input
                    type="number"
                    value={product.price || 1850}
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    value={product.stock_quantity ?? 100}
                    onChange={(e) =>
                      setProduct({ ...product, stock_quantity: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                    বিবরণ
                  </label>
                  <textarea
                    rows={4}
                    value={product.description || ""}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-extrabold text-sm shadow-gold hover:bg-gold-gradient-hover transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProduct ? "সংরক্ষণ হচ্ছে..." : "প্রোডাক্ট তথ্য সংরক্ষণ করুন"}</span>
                </button>
              </form>
            </div>

            {/* Product Images Management */}
            <div className="lg:col-span-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border gap-2">
                <h3 className="font-bold text-base sm:text-lg text-brand-text">প্রোডাক্ট ছবি গ্যালারি</h3>
                <label className="cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-bold text-brand-gold transition-colors flex-shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "আপলোড হচ্ছে..." : "নতুন ছবি"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative rounded-2xl overflow-hidden border border-brand-border bg-brand-card group aspect-square flex flex-col justify-end p-2.5 sm:p-3"
                  >
                    <Image
                      src={img.image_url}
                      alt="Product thumbnail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />

                    {img.is_primary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gold-gradient text-black text-[10px] font-black shadow uppercase z-10">
                        মূল ছবি
                      </span>
                    )}

                    <div className="relative z-10 flex items-center justify-between bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-brand-border gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(img.id)}
                        className={`text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                          img.is_primary
                            ? "text-brand-gold bg-brand-gold/15"
                            : "text-brand-text-muted hover:text-white"
                        }`}
                        title="মূল ছবি হিসেবে নির্বাচন করুন"
                      >
                        <Star className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{img.is_primary ? "প্রাইমারি" : "প্রাইমারি করুন"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 rounded-lg text-brand-text-muted hover:text-red-400 transition-colors flex-shrink-0"
                        title="ছবি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WEBSITE SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <h3 className="font-bold text-base sm:text-lg text-brand-text">ওয়েবসাইট ও ডেলিভারি সেটিংস</h3>
              <span className="text-xs text-brand-gold uppercase font-semibold">স্টোর কনফিগ</span>
            </div>

            {settingsMessage && (
              <div className="p-3.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-xs text-brand-gold font-medium">
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                  ঢাকার ভেতরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  type="number"
                  value={settings.delivery_charge_inside_dhaka || 70}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      delivery_charge_inside_dhaka: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                  ঢাকার বাইরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  type="number"
                  value={settings.delivery_charge_outside_dhaka || 130}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      delivery_charge_outside_dhaka: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                  কাস্টমার সাপোর্ট ফোন নাম্বার
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ""}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                  হোয়াটসঅ্যাপ কন্টাক্ট নাম্বার
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number || ""}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-extrabold text-sm shadow-gold hover:bg-gold-gradient-hover transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? "সংরক্ষণ হচ্ছে..." : "ওয়েবসাইট সেটিংস সংরক্ষণ করুন"}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-brand-surface border border-brand-border rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-brand-border">
              <div>
                <span className="text-[11px] sm:text-xs text-brand-text-muted uppercase tracking-wider">
                  অর্ডারের সম্পূর্ণ বিবরণ
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-mono text-brand-gold mt-0.5">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                aria-label="বন্ধ করুন"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 sm:p-4 rounded-xl bg-brand-card border border-brand-border">
                <p className="text-[11px] sm:text-xs text-brand-text-muted mb-1 uppercase font-semibold">
                  গ্রাহকের তথ্য
                </p>
                <p className="font-bold text-brand-text text-sm sm:text-base">
                  {selectedOrder.customer?.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 text-brand-gold" />
                  <a
                    href={`tel:${selectedOrder.customer?.phone}`}
                    className="text-brand-gold font-mono hover:underline"
                  >
                    {selectedOrder.customer?.phone}
                  </a>
                </div>
                <p className="text-brand-text mt-2 font-medium">
                  {selectedOrder.customer?.full_address}
                </p>
                <p className="text-brand-gold text-xs font-semibold mt-0.5">
                  জেলা: {selectedOrder.customer?.district}
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-brand-card border border-brand-border space-y-2">
                <div className="flex justify-between text-brand-text-muted">
                  <span>পণ্যের মূল্য:</span>
                  <span className="font-mono text-brand-text">৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-text-muted">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono text-brand-text">৳{selectedOrder.delivery_charge}</span>
                </div>
                <div className="border-t border-brand-border pt-2 flex justify-between font-bold text-sm sm:text-base">
                  <span className="text-brand-text">সর্বমোট ক্যাশ আদায়যোগ্য:</span>
                  <span className="text-brand-gold font-display text-base sm:text-lg">
                    ৳{selectedOrder.total_amount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                <span className="text-xs font-semibold text-brand-text-muted uppercase">
                  স্ট্যাটাস পরিবর্তন:
                </span>
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-xs font-bold text-brand-gold focus:outline-none"
                >
                  <option value="Pending">Pending (পেন্ডিং)</option>
                  <option value="Confirmed">Confirmed (কনফার্মড)</option>
                  <option value="Processing">Processing (প্রসেসিং)</option>
                  <option value="Shipped">Shipped (শিপড)</option>
                  <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                  <option value="Cancelled">Cancelled (ক্যান্সেলড)</option>
                  <option value="Returned">Returned (রিটার্নড)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-brand-border">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs font-bold hover:bg-brand-cardHover transition-colors text-center"
              >
                বন্ধ করুন
              </button>
              <Link
                href={`/admin/invoice/${encodeURIComponent(selectedOrder.order_number)}`}
                target="_blank"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs shadow-gold hover:bg-gold-gradient-hover transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>ইনভয়েস প্রিন্ট</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
