"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND_NAME, PRODUCT_NAME, PRODUCT_PRICE, INITIAL_PRODUCT_IMAGES } from "@/lib/constants";
import { CartItem } from "@/types";

interface CartContextType {
  item: CartItem | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (quantity?: number) => void;
  updateQuantity: (quantity: number) => void;
  removeFromCart: () => void;
  buyNow: (quantity?: number) => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "force_fuel_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [item, setItem] = useState<CartItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItem(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (item) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(item));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [item, isLoaded]);

  const addToCart = (quantity = 1) => {
    setItem((prev) => {
      const newQty = prev ? prev.quantity + quantity : quantity;
      return {
        productId: "eagle-endurance-for-men",
        name: `${BRAND_NAME} – ${PRODUCT_NAME}`,
        price: PRODUCT_PRICE,
        quantity: Math.max(1, Math.min(20, newQty)),
        image: INITIAL_PRODUCT_IMAGES[0].url,
      };
    });
    setIsOpen(true);
  };

  const updateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      removeFromCart();
      return;
    }
    setItem((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        quantity: Math.min(20, quantity),
      };
    });
  };

  const removeFromCart = () => {
    setItem(null);
  };

  const buyNow = (quantity = 1) => {
    const validQty = Math.max(1, Math.min(20, quantity));
    addToCart(validQty);
    setIsOpen(false);
    router.push(`/checkout?qty=${validQty}`);
  };

  const subtotal = item ? item.price * item.quantity : 0;

  return (
    <CartContext.Provider
      value={{
        item,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        buyNow,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
