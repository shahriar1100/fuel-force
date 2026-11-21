"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import { BRAND_NAME, PRODUCT_NAME, PRODUCT_NAME_BN, DEFAULT_SETTINGS } from "@/lib/constants";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          // Try fetching from admin orders list if passed id
          const adminRes = await fetch("/api/admin/orders");
          const adminData = await adminRes.json();
          if (adminData.success) {
            const found = adminData.orders.find(
              (o: any) => o.id === orderId || o.order_number === orderId
            );
            if (found) setOrder(found);
          }
        }
      } catch (err) {
        console.error("Failed to load invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-sans">
        ইনভয়েস লোড হচ্ছে...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white text-black p-8 font-sans">
        <p className="text-red-600 mb-4">অর্ডার ইনভয়েস পাওয়া যায়নি: {orderId}</p>
        <Link href="/admin" className="text-blue-600 underline">
          ← অ্যাডমিন ড্যাশবোর্ডে ফিরে যান
        </Link>
      </div>
    );
  }

  const customer = order.customer || {};
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-neutral-100 py-8 print:py-0 print:bg-white text-neutral-900 font-sans">
      <div className="max-w-3xl mx-auto px-4 print:px-0">
        {/* Screen-only Print Bar */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-black font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>অ্যাডমিনে ফিরে যান</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-bold shadow hover:bg-neutral-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>ইনভয়েস প্রিন্ট করুন</span>
          </button>
        </div>

        {/* Invoice Paper Canvas */}
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg print:shadow-none border border-neutral-200 print:border-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-300 pb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{BRAND_NAME}</h1>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-0.5">
                {PRODUCT_NAME} ({PRODUCT_NAME_BN})
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                হটলাইন: {DEFAULT_SETTINGS.contact_phone}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 font-bold text-xs uppercase tracking-wider rounded border border-neutral-300">
                ক্যাশ অন ডেলিভারি (COD)
              </span>
              <p className="text-lg font-mono font-bold mt-2">{order.order_number}</p>
              <p className="text-xs text-neutral-500 mt-0.5">তারিখ: {orderDate}</p>
            </div>
          </div>

          {/* Customer / Shipping Info */}
          <div className="grid grid-cols-2 gap-8 py-6 border-b border-neutral-300 text-sm">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                গ্রাহকের নাম ও মোবাইল
              </p>
              <p className="font-bold text-neutral-900 text-base">{customer.name || "Customer"}</p>
              <p className="text-neutral-700 mt-0.5 font-mono">{customer.phone}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                ডেলিভারি ঠিকানা
              </p>
              <p className="text-neutral-800 font-medium">{customer.full_address}</p>
              <p className="text-neutral-600 font-semibold mt-0.5">জেলা: {customer.district}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-300 text-xs uppercase font-bold text-neutral-500">
                  <th className="py-2">পণ্যের বিবরণ</th>
                  <th className="py-2 text-center">পরিমাণ</th>
                  <th className="py-2 text-right">একক মূল্য</th>
                  <th className="py-2 text-right">মোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-neutral-900">{BRAND_NAME} – {PRODUCT_NAME_BN}</p>
                    <p className="text-xs text-neutral-500">৬০ ডোজ পুষ্টিকর ডায়েটারি সাপ্লিমেন্ট</p>
                  </td>
                  <td className="py-3 text-center font-bold">
                    {order.order_items?.[0]?.quantity || 1}
                  </td>
                  <td className="py-3 text-right font-mono">
                    ৳{order.order_items?.[0]?.unit_price || (order.subtotal / (order.order_items?.[0]?.quantity || 1))}
                  </td>
                  <td className="py-3 text-right font-mono font-bold">
                    ৳{order.subtotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-neutral-300 pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>পণ্যের মূল্য (সাবটোটাল):</span>
                <span className="font-mono">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-mono">৳{order.delivery_charge}</span>
              </div>
              <div className="border-t border-neutral-300 pt-2 flex justify-between font-bold text-base text-neutral-900">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="font-mono text-lg">৳{order.total_amount}</span>
              </div>
              <div className="pt-1 text-right">
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  নগদ আদায়যোগ্য: ৳{order.total_amount}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-400">
            {BRAND_NAME} বেছে নেওয়ার জন্য ধন্যবাদ। যেকোনো প্রয়োজনে কল করুন: {DEFAULT_SETTINGS.contact_phone}
          </div>
        </div>
      </div>
    </div>
  );
}
