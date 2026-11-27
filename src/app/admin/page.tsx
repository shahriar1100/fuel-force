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
  Download,
  Plus,
  MessageSquare,
  AlertTriangle,
  Truck,
  Check,
  X,
  Radio,
  FileSpreadsheet,
} from "lucide-react";
import { BRAND_NAME, PRODUCT_NAME, BANGLADESH_DISTRICTS } from "@/lib/constants";
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

  // Manual Order Modal State
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    name: "",
    phone: "",
    district: "Dhaka",
    fullAddress: "",
    quantity: 1,
    admin_notes: "",
    order_status: "Confirmed",
  });

  // Selected Order Edit States (Notes & Courier Tracking)
  const [orderNotes, setOrderNotes] = useState("");
  const [courierTrackingId, setCourierTrackingId] = useState("");
  const [courierName, setCourierName] = useState("Steadfast");
  const [savingOrderDetails, setSavingOrderDetails] = useState(false);

  // Product State
  const [product, setProduct] = useState<any>({
    name: `${BRAND_NAME} – ${PRODUCT_NAME}`,
    description: "",
    price: 1850,
    regular_price: 2450,
    stock_quantity: 100,
  });
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<any>({
    delivery_charge_inside_dhaka: 70,
    delivery_charge_outside_dhaka: 130,
    contact_phone: "+880 1700-000000",
    whatsapp_number: "+880 1700-000000",
    announcement_text: "আজকের অর্ডারে নিশ্চিত ক্যাশ অন ডেলিভারি ও দ্রুততম সময়ে হোম ডেলিভারি!",
    announcement_enabled: true,
    facebook_pixel_id: "",
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

  const handleSaveOrderDetails = async () => {
    if (!selectedOrder) return;
    setSavingOrderDetails(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          admin_notes: orderNotes,
          courier_tracking_id: courierTrackingId,
          courier_name: courierName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? {
                  ...o,
                  admin_notes: orderNotes,
                  courier_tracking_id: courierTrackingId,
                  courier_name: courierName,
                }
              : o
          )
        );
        setSelectedOrder({
          ...selectedOrder,
          admin_notes: orderNotes,
          courier_tracking_id: courierTrackingId,
          courier_name: courierName,
        });
        alert("অর্ডার নোট ও কুরিয়ার ট্র্যাকিং কোড সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        alert(data.message || "সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error(err);
      alert("সংরক্ষণে সমস্যা হয়েছে");
    } finally {
      setSavingOrderDetails(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই অর্ডারটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।")) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId && o.order_number !== orderId));
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_number === orderId)) {
          setSelectedOrder(null);
        }
      } else {
        alert(data.message || "অর্ডার মুছতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOrder(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderForm),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        setShowNewOrderModal(false);
        setNewOrderForm({
          name: "",
          phone: "",
          district: "Dhaka",
          fullAddress: "",
          quantity: 1,
          admin_notes: "",
          order_status: "Confirmed",
        });
        alert("নতুন ম্যানুয়াল অর্ডার সফলভাবে তৈরি হয়েছে!");
      } else {
        alert(data.message || "অর্ডার তৈরি ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error(err);
      alert("অর্ডার তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = filteredOrders;
    if (dataToExport.length === 0) {
      alert("এক্সপোর্ট করার মতো কোনো অর্ডার পাওয়া যায়নি।");
      return;
    }

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "District",
      "Address",
      "Quantity",
      "Subtotal",
      "Delivery Charge",
      "Total Amount",
      "Order Status",
      "Admin Note",
      "Courier Tracking ID",
    ];

    const csvRows = dataToExport.map((o) => {
      const cust = o.customer || {};
      const item = o.order_items?.[0] || {};
      const dateFormatted = new Date(o.created_at || Date.now()).toLocaleString("en-GB");
      return [
        `"${o.order_number || o.id}"`,
        `"${dateFormatted}"`,
        `"${(cust.name || "").replace(/"/g, '""')}"`,
        `"${(cust.phone || "").replace(/"/g, '""')}"`,
        `"${(cust.district || "").replace(/"/g, '""')}"`,
        `"${(cust.full_address || "").replace(/"/g, '""')}"`,
        item.quantity || 1,
        o.subtotal || 0,
        o.delivery_charge || 0,
        o.total_amount || 0,
        `"${o.order_status || "Pending"}"`,
        `"${(o.admin_notes || "").replace(/"/g, '""')}"`,
        `"${(o.courier_tracking_id || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvString = "\uFEFF" + [headers.join(","), ...csvRows].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `force-fuel-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openWhatsApp = (phone: string, orderNumber: string, totalAmount: number, name: string) => {
    const rawDigits = (phone || "").replace(/[^0-9]/g, "");
    const bdNumber = rawDigits.startsWith("88") ? rawDigits : `88${rawDigits.replace(/^0+/, "0")}`;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${name || "সম্মানিত গ্রাহক"},\n` +
        `FORCE FUEL এ আপনার অর্ডার নং #${orderNumber} সংক্রান্ত বিষয়।\n` +
        `মোট ক্যাশ অন ডেলিভারি মূল্য: ৳${(totalAmount || 0).toLocaleString("bn-BD")}।\n` +
        `আপনার ঠিকানা ও অর্ডারটি দ্রুত কনফার্ম করার জন্য অনুগ্রহ করে এই মেসেজে একটি 'হ্যাঁ' অথবা 'OK' লিখে রিপ্লাই করুন। ধন্যবাদ!`
    );
    window.open(`https://wa.me/${bdNumber}?text=${msg}`, "_blank");
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
        setProductMessage("প্রোডাক্ট তথ্য ও মূল্য সফলভাবে আপডেট হয়েছে!");
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
        setSettingsMessage("ওয়েবসাইট সেটিংস, ফোন নাম্বার ও নোটিশ বার সফলভাবে আপডেট হয়েছে!");
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
    setImageMessage(null);
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
        setImageMessage("নতুন ছবি সফলভাবে আপলোড হয়েছে!");
        setTimeout(() => setImageMessage(null), 3000);
      } else {
        setImageMessage(data.message || "ছবি আপলোড ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setImageMessage("ছবি আপলোড ব্যর্থ হয়েছে");
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
        setImageMessage("মূল ব্যানার ছবি সফলভাবে পরিবর্তন করা হয়েছে!");
        setTimeout(() => setImageMessage(null), 3000);
      } else {
        setImageMessage("ব্যানার পরিবর্তন ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error(err);
      setImageMessage("ব্যানার পরিবর্তন ব্যর্থ হয়েছে");
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
        setImageMessage("ছবি সফলভাবে মুছে ফেলা হয়েছে");
        setTimeout(() => setImageMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setImageMessage("ছবি মুছতে সমস্যা হয়েছে");
    }
  };

  // Essential Production Statistics
  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const totalOrders = orders.length;
  const todayOrders = orders.filter((o) => isToday(o.created_at));
  const todaySales = todayOrders
    .filter((o) => o.order_status !== "Cancelled" && o.order_status !== "Returned")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const pendingOrders = orders.filter((o) => o.order_status === "Pending").length;
  const confirmedOrders = orders.filter(
    (o) => o.order_status === "Confirmed" || o.order_status === "Processing"
  ).length;
  const shippedOrders = orders.filter((o) => o.order_status === "Shipped").length;
  const deliveredOrders = orders.filter((o) => o.order_status === "Delivered").length;
  const cancelledOrders = orders.filter(
    (o) => o.order_status === "Cancelled" || o.order_status === "Returned"
  ).length;

  const totalSales = orders
    .filter((o) => o.order_status !== "Cancelled" && o.order_status !== "Returned")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.order_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.courier_tracking_id || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Processing: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    Shipped: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
    Returned: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Top Navbar */}
      <nav className="bg-brand-surface border-b border-brand-border sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center font-bold text-black text-xs flex-shrink-0 shadow-gold">
                FF
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-sm sm:text-base font-display tracking-wider truncate">
                  {BRAND_NAME}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-brand-gold bg-brand-card px-2 py-0.5 rounded border border-brand-border whitespace-nowrap">
                  প্রোডাকশন অ্যাডমিন
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle />
              <Link
                href="/"
                target="_blank"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-text-muted hover:text-brand-gold px-3 py-1.5 rounded-lg border border-brand-border hover:border-brand-gold/40 transition-colors"
              >
                <span>স্টোর দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {/* Today's Orders */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between shadow-sm">
            <span className="text-[11px] text-brand-text-muted font-medium">আজকের অর্ডার</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-black text-brand-gold font-display">
                {todayOrders.length}
              </span>
              <span className="text-[11px] font-bold text-brand-text-dim">
                ৳{todaySales.toLocaleString("bn-BD")}
              </span>
            </div>
          </div>

          {/* Pending to Call */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface border border-amber-500/30 flex flex-col justify-between shadow-sm">
            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> কল বাকি (পেন্ডিং)
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {pendingOrders}
            </span>
          </div>

          {/* Confirmed / Processing */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface border border-blue-500/30 flex flex-col justify-between shadow-sm">
            <span className="text-[11px] text-blue-400 font-medium">কনফার্মড অর্ডার</span>
            <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
              {confirmedOrders}
            </span>
          </div>

          {/* In Transit / Shipped */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface border border-indigo-500/30 flex flex-col justify-between shadow-sm">
            <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
              <Truck className="w-3 h-3" /> কুরিয়ারে শিপড
            </span>
            <span className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">
              {shippedOrders}
            </span>
          </div>

          {/* Delivered */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface border border-emerald-500/30 flex flex-col justify-between shadow-sm">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ডেলিভার্ড সম্পন্ন
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {deliveredOrders}
            </span>
          </div>

          {/* Total Sales (BDT) */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-borderGold flex flex-col justify-between shadow-luxury">
            <span className="text-[11px] text-brand-text-muted font-medium">মোট আয় (ক্যাশ)</span>
            <span className="text-lg sm:text-xl font-black text-brand-gold font-display mt-1 truncate">
              ৳{totalSales.toLocaleString("bn-BD")}
            </span>
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
            <span>অর্ডার তালিকা ({totalOrders})</span>
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
            <span>প্রোডাক্ট, মূল্য ও ব্যানার ছবি</span>
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
            <span>ফোন, নোটিশ বার ও পিক্সেল</span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search, Filter & Action Toolbar */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
              <div className="relative w-full lg:w-96">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অর্ডার আইডি, ফোন, নাম বা ট্র্যাকিং খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs sm:text-sm text-brand-text placeholder-brand-text-dim focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
                <Search className="w-4 h-4 text-brand-text-dim absolute left-3.5 top-3" />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs">
                  <Filter className="w-3.5 h-3.5 text-brand-text-muted" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs text-brand-text focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">সকল স্ট্যাটাস ({totalOrders})</option>
                    <option value="Pending">পেন্ডিং ({pendingOrders})</option>
                    <option value="Confirmed">কনফার্মড ({confirmedOrders})</option>
                    <option value="Shipped">শিপড ({shippedOrders})</option>
                    <option value="Delivered">ডেলিভার্ড ({deliveredOrders})</option>
                    <option value="Cancelled">ক্যান্সেলড ({cancelledOrders})</option>
                  </select>
                </div>

                {/* CSV Export Button for Steadfast / Pathao / Excel */}
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-brand-cardHover border border-brand-border text-xs font-bold text-brand-text transition-colors"
                  title="Steadfast বা Pathao এর জন্য এক্সেল/CSV ডাউনলোড করুন"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CSV এক্সপোর্ট</span>
                </button>

                {/* Manual Order Creation Button */}
                <button
                  onClick={() => setShowNewOrderModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-gradient text-black text-xs font-extrabold shadow-gold hover:bg-gold-gradient-hover transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ নতুন অর্ডার</span>
                </button>

                {/* Refresh */}
                <button
                  onClick={loadData}
                  className="p-2 sm:p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors"
                  title="রিফ্রেশ করুন"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile View: Order Cards */}
            <div className="block md:hidden space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-brand-text-muted rounded-2xl bg-brand-surface border border-brand-border">
                  কোনো অর্ডার পাওয়া যায়নি।
                </div>
              ) : (
                filteredOrders.map((o) => {
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

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-text text-sm">
                            {o.customer?.name || "Customer"}
                          </span>
                          <span className="font-bold text-brand-gold font-display text-base">
                            ৳{o.total_amount}
                          </span>
                        </div>

                        {o.customer?.phone && (
                          <div className="flex items-center gap-2 text-brand-text-muted pt-0.5">
                            <a
                              href={`tel:${o.customer.phone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card border border-brand-border text-brand-gold font-mono font-bold text-xs"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{o.customer.phone}</span>
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                openWhatsApp(
                                  o.customer.phone,
                                  o.order_number,
                                  o.total_amount,
                                  o.customer.name
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        )}

                        <p className="text-brand-text-dim pt-1 line-clamp-2">
                          {o.customer?.full_address}, {o.customer?.district}
                        </p>

                        {o.admin_notes && (
                          <div className="p-2 rounded-lg bg-brand-card/70 border border-brand-border text-[11px] text-amber-400">
                            <strong>নোট:</strong> {o.admin_notes}
                          </div>
                        )}

                        {o.courier_tracking_id && (
                          <p className="text-[11px] text-indigo-400 font-mono">
                            কুরিয়ার ট্র্যাকিং: {o.courier_tracking_id}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-brand-border/60">
                        <select
                          value={o.order_status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border bg-brand-card cursor-pointer focus:outline-none ${
                            statusColors[o.order_status] || "border-brand-border"
                          }`}
                        >
                          <option value="Pending" className="bg-brand-surface text-brand-text">পেন্ডিং</option>
                          <option value="Confirmed" className="bg-brand-surface text-brand-text">কনফার্মড</option>
                          <option value="Processing" className="bg-brand-surface text-brand-text">প্রসেসিং</option>
                          <option value="Shipped" className="bg-brand-surface text-brand-text">শিপড</option>
                          <option value="Delivered" className="bg-brand-surface text-brand-text">ডেলিভার্ড</option>
                          <option value="Cancelled" className="bg-brand-surface text-brand-text">ক্যান্সেলড</option>
                          <option value="Returned" className="bg-brand-surface text-brand-text">রিটার্নড</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setOrderNotes(o.admin_notes || "");
                              setCourierTrackingId(o.courier_tracking_id || "");
                              setCourierName(o.courier_name || "Steadfast");
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5 text-brand-gold" />
                            <span>ডিটেইলস</span>
                          </button>

                          <Link
                            href={`/admin/invoice/${encodeURIComponent(o.order_number)}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-gold"
                            title="ইনভয়েস প্রিন্ট"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-1.5 rounded-lg bg-brand-card hover:bg-red-500/20 text-brand-text-dim hover:text-red-400"
                            title="অর্ডার মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Orders Table */}
            <div className="hidden md:block rounded-2xl bg-brand-surface border border-brand-border overflow-hidden shadow-luxury">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[850px]">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-card text-xs text-brand-text-muted uppercase font-bold tracking-wider">
                      <th className="p-3.5">অর্ডার আইডি</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">গ্রাহক ও ফোন</th>
                      <th className="p-3.5">জেলা</th>
                      <th className="p-3.5 text-right">মোট টাকা (COD)</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5">নোট / কুরিয়ার</th>
                      <th className="p-3.5 text-center">অ্যাকশন</th>
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
                        const orderDate = new Date(o.created_at || Date.now()).toLocaleDateString(
                          "bn-BD",
                          { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                        );

                        return (
                          <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3.5 font-mono font-bold text-brand-gold text-xs">
                              {o.order_number}
                            </td>
                            <td className="p-3.5 text-xs text-brand-text-muted whitespace-nowrap">
                              {orderDate}
                            </td>
                            <td className="p-3.5">
                              <p className="font-semibold text-brand-text text-xs">
                                {o.customer?.name || "Customer"}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <a
                                  href={`tel:${o.customer?.phone}`}
                                  className="text-xs font-mono text-brand-gold hover:underline"
                                >
                                  {o.customer?.phone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openWhatsApp(
                                      o.customer?.phone,
                                      o.order_number,
                                      o.total_amount,
                                      o.customer?.name
                                    )
                                  }
                                  className="p-0.5 rounded text-emerald-400 hover:text-emerald-300"
                                  title="WhatsApp এ মেসেজ পাঠান"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-3.5 text-xs text-brand-text-muted">
                              {o.customer?.district}
                            </td>
                            <td className="p-3.5 text-right font-bold text-brand-text font-display">
                              ৳{o.total_amount}
                            </td>
                            <td className="p-3.5">
                              <select
                                value={o.order_status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className={`text-xs font-bold px-2 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none ${
                                  statusColors[o.order_status] || "border-brand-border"
                                }`}
                              >
                                <option value="Pending" className="bg-brand-surface text-brand-text">Pending</option>
                                <option value="Confirmed" className="bg-brand-surface text-brand-text">Confirmed</option>
                                <option value="Processing" className="bg-brand-surface text-brand-text">Processing</option>
                                <option value="Shipped" className="bg-brand-surface text-brand-text">Shipped</option>
                                <option value="Delivered" className="bg-brand-surface text-brand-text">Delivered</option>
                                <option value="Cancelled" className="bg-brand-surface text-brand-text">Cancelled</option>
                                <option value="Returned" className="bg-brand-surface text-brand-text">Returned</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-xs">
                              {o.courier_tracking_id ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-mono text-[11px] truncate max-w-[120px]">
                                  {o.courier_tracking_id}
                                </span>
                              ) : o.admin_notes ? (
                                <span className="text-amber-400/90 truncate max-w-[120px] block" title={o.admin_notes}>
                                  {o.admin_notes}
                                </span>
                              ) : (
                                <span className="text-brand-text-dim text-[11px]">—</span>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setOrderNotes(o.admin_notes || "");
                                    setCourierTrackingId(o.courier_tracking_id || "");
                                    setCourierName(o.courier_name || "Steadfast");
                                  }}
                                  className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                                  title="অর্ডার নোট ও বিবরণ দেখুন"
                                >
                                  <Edit className="w-4 h-4 text-brand-gold" />
                                </button>

                                <Link
                                  href={`/admin/invoice/${encodeURIComponent(o.order_number)}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover text-brand-gold transition-colors"
                                  title="ইনভয়েস প্রিন্ট করুন"
                                >
                                  <Printer className="w-4 h-4" />
                                </Link>

                                <button
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="p-1.5 rounded-lg bg-brand-card hover:bg-red-500/20 text-brand-text-dim hover:text-red-400 transition-colors"
                                  title="অর্ডার মুছুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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

        {/* TAB 2: PRODUCT, PRICING & HERO BANNER MANAGEMENT */}
        {activeTab === "product" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Product Details Form */}
            <div className="lg:col-span-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-brand-text">প্রোডাক্ট তথ্য ও অফার মূল্য</h3>
                  <p className="text-xs text-brand-text-muted mt-0.5">এখানে মূল্য পরিবর্তন করলে পুরো ওয়েবসাইটে স্বয়ংক্রিয়ভাবে আপডেট হবে</p>
                </div>
                <span className="text-[11px] sm:text-xs text-brand-gold uppercase font-bold bg-brand-gold/10 px-2.5 py-1 rounded-md">
                  লাইভ সিঙ্ক
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-brand-gold mb-2 uppercase tracking-wider">
                      বর্তমান বিক্রয় মূল্য (টাকা) ★
                    </label>
                    <input
                      type="number"
                      value={product.price || 1850}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-borderGold text-base font-bold text-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold font-display"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider">
                      আগের কাটা রেগুলার মূল্য (টাকা)
                    </label>
                    <input
                      type="number"
                      value={product.regular_price || 2450}
                      onChange={(e) =>
                        setProduct({ ...product, regular_price: parseFloat(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-2 uppercase tracking-wider flex items-center justify-between">
                    <span>স্টক পরিমাণ (ইন-স্টক)</span>
                    {product.stock_quantity < 20 && (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> স্টক কমে এসেছে!
                      </span>
                    )}
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
                    সংক্ষিপ্ত বিবরণ
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
                  <span>{savingProduct ? "সংরক্ষণ হচ্ছে..." : "প্রোডাক্ট ও মূল্য সংরক্ষণ করুন"}</span>
                </button>
              </form>
            </div>

            {/* Product Images Management & Banner Selector */}
            <div className="lg:col-span-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border gap-2">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-brand-text">প্রোডাক্ট ও ব্যানার ছবি</h3>
                  <p className="text-xs text-brand-text-muted mt-0.5">যেকোনো ছবিকে ১-ক্লিকে মূল ব্যানার ছবি হিসেবে সেট করতে পারবেন</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-borderGold text-xs font-bold text-brand-gold transition-colors flex-shrink-0 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "আপলোড হচ্ছে..." : "নতুন ছবি আপলোড"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {imageMessage && (
                <div className="p-3.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-xs text-brand-gold font-medium">
                  {imageMessage}
                </div>
              )}

              {/* Active Banner Indicator Box */}
              <div className="p-3.5 rounded-2xl bg-brand-card border border-brand-borderGold/50 flex items-center gap-3.5">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-brand-gold flex-shrink-0 shadow-gold">
                  <Image
                    src={images.find((i) => i.is_primary)?.image_url || images[0]?.image_url || "/images/bottle-1.png"}
                    alt="Current Banner"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-black bg-gold-gradient px-2.5 py-0.5 rounded-md shadow">
                    <Star className="w-3 h-3 fill-black" /> বর্তমান মূল ব্যানার ছবি
                  </span>
                  <p className="text-xs text-brand-text-muted mt-1.5 leading-relaxed">
                    এই ছবিটি হোমপেজের শীর্ষ হিরো সেকশন এবং চেকআউটে প্রদর্শিত হচ্ছে। নিচে যেকোনো ছবির <span className="text-brand-gold font-bold">"ব্যানার করুন"</span> বাটনে চাপলে ব্যানার পরিবর্তিত হবে।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative rounded-2xl overflow-hidden bg-brand-card group aspect-square flex flex-col justify-end p-2.5 sm:p-3 transition-all ${
                      img.is_primary
                        ? "border-2 border-brand-gold shadow-gold ring-1 ring-brand-gold/50"
                        : "border border-brand-border hover:border-brand-borderGold/50"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt="Product thumbnail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />

                    {img.is_primary && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-gold-gradient text-black text-[10px] font-black shadow-gold uppercase z-10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> মূল ব্যানার
                      </span>
                    )}

                    <div className="relative z-10 flex items-center justify-between bg-black/90 backdrop-blur-md p-1.5 rounded-xl border border-brand-border gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(img.id)}
                        className={`text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 flex-1 justify-center ${
                          img.is_primary
                            ? "text-black bg-gold-gradient shadow"
                            : "text-brand-gold hover:bg-brand-gold/20 border border-brand-gold/40"
                        }`}
                        title="ওয়েবসাইটের ব্যানার ছবি হিসেবে সেট করুন"
                      >
                        <Star className={`w-3.5 h-3.5 flex-shrink-0 ${img.is_primary ? "fill-black" : "text-brand-gold"}`} />
                        <span className="truncate">{img.is_primary ? "সক্রিয় ব্যানার" : "ব্যানার করুন"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 rounded-lg text-brand-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
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

        {/* TAB 3: WEBSITE SETTINGS, PHONE, ANNOUNCEMENT & PIXEL */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-brand-text">ফোন নাম্বার, নোটিশ বার ও সেটিংস</h3>
                <p className="text-xs text-brand-text-muted mt-0.5">হেডার, ফুটার এবং চেকআউটের যোগাযোগ তথ্য এখান থেকে পরিচালনা করুন</p>
              </div>
              <span className="text-xs text-brand-gold uppercase font-bold bg-brand-gold/10 px-2.5 py-1 rounded-md">
                স্টোর কনফিগ
              </span>
            </div>

            {settingsMessage && (
              <div className="p-3.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-xs text-brand-gold font-medium">
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-2 uppercase tracking-wider">
                    হেডার ও কাস্টমার সাপোর্ট ফোন নাম্বার ★
                  </label>
                  <input
                    type="text"
                    value={settings.contact_phone || ""}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-borderGold text-sm font-bold text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    placeholder="+880 1700-000000"
                  />
                  <p className="text-[11px] text-brand-text-dim mt-1">
                    হেডারের কল বাটন এবং ফুটারে এই নাম্বারটি সরাসরি প্রদর্শিত হবে।
                  </p>
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
                    placeholder="+880 1700-000000"
                  />
                  <p className="text-[11px] text-brand-text-dim mt-1">
                    কাস্টমার সরাসরি ক্লিক করে হোয়াটসঅ্যাপে মেসেজ দিতে পারবে।
                  </p>
                </div>
              </div>

              {/* Delivery Charges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border/60">
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
              </div>

              {/* Announcement Bar Settings */}
              <div className="pt-2 border-t border-brand-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-text uppercase tracking-wider">
                    শীর্ষ অফার ও নোটিশ বার (Announcement Bar)
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcement_enabled ?? true}
                      onChange={(e) =>
                        setSettings({ ...settings, announcement_enabled: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-brand-gold accent-amber-500"
                    />
                    <span className="text-xs text-brand-text font-medium">সক্রিয় রাখুন</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={settings.announcement_text || ""}
                  onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  placeholder="আজকের অর্ডারে নিশ্চিত ক্যাশ অন ডেলিভারি ও দ্রুততম সময়ে হোম ডেলিভারি!"
                />
                <p className="text-[11px] text-brand-text-dim">
                  হেডারের একদম শীর্ষে একটি সুন্দর অফার ব্যানার হিসেবে এটি প্রদর্শিত হবে।
                </p>
              </div>

              {/* Facebook Pixel Tracking */}
              <div className="pt-2 border-t border-brand-border/60 space-y-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  Facebook / Meta Pixel ID (বিজ্ঞাপন ট্র্যাকিং)
                </label>
                <input
                  type="text"
                  value={settings.facebook_pixel_id || ""}
                  onChange={(e) => setSettings({ ...settings, facebook_pixel_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border text-sm font-mono text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  placeholder="যেমন: 1234567890123456"
                />
                <p className="text-[11px] text-brand-text-dim">
                  ফেসবুক বিজ্ঞাপনের জন্য পিক্সেল আইডি দিলে পেজভিউ এবং পারচেজ ইভেন্ট অটোম্যাটিক ট্র্যাক হবে।
                </p>
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

      {/* MODAL 1: ORDER DETAILS & CALL NOTE / COURIER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-brand-surface border border-brand-border rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <span className="text-[11px] text-brand-text-muted uppercase tracking-wider font-semibold">
                  অর্ডারের সম্পূর্ণ বিবরণ ও কল রিপোর্ট
                </span>
                <h3 className="text-lg font-bold font-mono text-brand-gold mt-0.5">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text transition-colors"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Customer Info Card */}
              <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-brand-text-muted uppercase font-bold">
                    গ্রাহকের তথ্য
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedOrder.customer?.phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-gold/15 text-brand-gold font-bold text-xs hover:bg-brand-gold/25"
                    >
                      <Phone className="w-3 h-3" />
                      <span>কল করুন</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          selectedOrder.customer?.phone,
                          selectedOrder.order_number,
                          selectedOrder.total_amount,
                          selectedOrder.customer?.name
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-xs hover:bg-emerald-500/25"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                <p className="font-bold text-brand-text text-base">
                  {selectedOrder.customer?.name}
                </p>
                <p className="text-brand-gold font-mono font-bold">
                  {selectedOrder.customer?.phone}
                </p>
                <p className="text-brand-text leading-relaxed">
                  {selectedOrder.customer?.full_address}
                </p>
                <p className="text-brand-text-muted font-medium">
                  জেলা: <strong className="text-brand-text">{selectedOrder.customer?.district}</strong>
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2">
                <div className="flex justify-between text-brand-text-muted">
                  <span>পণ্যের পরিমাণ:</span>
                  <span className="font-bold text-brand-text">
                    {selectedOrder.order_items?.[0]?.quantity || 1} টি বোতল
                  </span>
                </div>
                <div className="flex justify-between text-brand-text-muted">
                  <span>পণ্যের মূল্য:</span>
                  <span className="font-mono text-brand-text">৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-text-muted">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono text-brand-text">৳{selectedOrder.delivery_charge}</span>
                </div>
                <div className="border-t border-brand-border pt-2 flex justify-between font-bold text-base">
                  <span className="text-brand-text">সর্বমোট ক্যাশ আদায়যোগ্য:</span>
                  <span className="text-brand-gold font-display text-lg">
                    ৳{selectedOrder.total_amount}
                  </span>
                </div>
              </div>

              {/* Admin Internal Call Notes (Crucial for BD COD Calling) */}
              <div className="p-4 rounded-xl bg-brand-card border border-amber-500/30 space-y-2">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>অভ্যন্তরীণ মন্তব্য / কল রিপোর্ট (Admin Note)</span>
                  <span className="text-[10px] text-brand-text-dim lowercase">শুধুমাত্র অ্যাডমিন দেখতে পাবে</span>
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="যেমন: গ্রাহক ফোন রিসিভ করেছেন, রবিবার সকাল ১০টায় ডেলিভারি চেয়েছেন..."
                  className="w-full px-3 py-2 rounded-lg bg-brand-surface border border-brand-border text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Courier Tracking ID (Steadfast / Pathao CID) */}
              <div className="p-4 rounded-xl bg-brand-card border border-indigo-500/30 space-y-2">
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  কুরিয়ার কনসাইনমেন্ট / ট্র্যাকিং আইডি
                </label>
                <div className="flex gap-2">
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-brand-surface border border-brand-border text-xs text-brand-text focus:outline-none"
                  >
                    <option value="Steadfast">Steadfast</option>
                    <option value="Pathao">Pathao</option>
                    <option value="RedX">RedX</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="Sundarban">Sundarban</option>
                  </select>
                  <input
                    type="text"
                    value={courierTrackingId}
                    onChange={(e) => setCourierTrackingId(e.target.value)}
                    placeholder="যেমন: SF-12345678"
                    className="flex-1 px-3 py-2 rounded-lg bg-brand-surface border border-brand-border text-xs font-mono text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveOrderDetails}
                  disabled={savingOrderDetails}
                  className="w-full py-2.5 rounded-lg bg-brand-surface hover:bg-brand-cardHover border border-brand-borderGold text-brand-gold font-bold text-xs transition-colors"
                >
                  {savingOrderDetails ? "সংরক্ষণ হচ্ছে..." : "নোট ও কুরিয়ার তথ্য সংরক্ষণ করুন"}
                </button>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-brand-text-muted uppercase">
                  অর্ডার স্ট্যাটাস পরিবর্তন:
                </span>
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-xs font-bold text-brand-gold focus:outline-none cursor-pointer"
                >
                  <option value="Pending">Pending (পেন্ডিং)</option>
                  <option value="Confirmed">Confirmed (কনফার্মড)</option>
                  <option value="Processing">Processing (প্রসেসিং)</option>
                  <option value="Shipped">Shipped (কুরিয়ারে শিপড)</option>
                  <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                  <option value="Cancelled">Cancelled (বাতিলকৃত)</option>
                  <option value="Returned">Returned (রিটার্নড)</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-brand-border">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>অর্ডার মুছুন</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs font-bold hover:bg-brand-cardHover"
                >
                  বন্ধ করুন
                </button>
                <Link
                  href={`/admin/invoice/${encodeURIComponent(selectedOrder.order_number)}`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-extrabold text-xs shadow-gold hover:bg-gold-gradient-hover flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>ইনভয়েস প্রিন্ট</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW MANUAL ORDER CREATION */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-brand-surface border border-brand-border rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <span className="text-[11px] text-brand-gold uppercase tracking-wider font-bold">
                  কল / মেসেঞ্জার অর্ডার
                </span>
                <h3 className="text-lg font-bold text-brand-text mt-0.5">
                  নতুন ম্যানুয়াল অর্ডার যুক্ত করুন
                </h3>
              </div>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-2 rounded-full hover:bg-brand-cardHover text-brand-text-muted hover:text-brand-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-1.5 uppercase">
                  গ্রাহকের পুরো নাম *
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.name}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, name: e.target.value })}
                  placeholder="যেমন: আল শাহরিয়ার"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-1.5 uppercase">
                  মোবাইল নাম্বার *
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.phone}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                  placeholder="যেমন: 01711223344"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text font-mono text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1.5 uppercase">
                    জেলা *
                  </label>
                  <select
                    value={newOrderForm.district}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, district: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs focus:outline-none cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-brand-surface text-brand-text">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1.5 uppercase">
                    পরিমাণ (বোতল) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newOrderForm.quantity}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, quantity: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-1.5 uppercase">
                  সম্পূর্ণ ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newOrderForm.fullAddress}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, fullAddress: e.target.value })}
                  placeholder="বাসা/রোড/এলাকা/থানা..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text-muted mb-1.5 uppercase">
                  অভ্যন্তরীণ নোট / মন্তব্য (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={newOrderForm.admin_notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, admin_notes: e.target.value })}
                  placeholder="যেমন: ফোনে কনফার্মড, দ্রুত পাঠাতে হবে"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-brand-text-muted">
                  হিসাব: ৳{product.price * newOrderForm.quantity} + ডেলিভারি চার্জ
                </span>
                <span className="text-sm font-bold text-brand-gold">ক্যাশ অন ডেলিভারি</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={creatingOrder}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-extrabold text-xs shadow-gold hover:bg-gold-gradient-hover flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{creatingOrder ? "তৈরি হচ্ছে..." : "অর্ডার সেভ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
