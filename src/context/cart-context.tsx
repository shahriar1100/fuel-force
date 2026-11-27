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
  addToCart: (quantity?: number, customPrice?: number, customImage?: string) => void;
  updateQuantity: (quantity: number) => void;
  removeFromCart: () => void;
  buyNow: (quantity?: number, customPrice?: number, customImage?: string) => void;
  subtotal: number;
  livePrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "force_fuel_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [item, setItem] = useState<CartItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [livePrice, setLivePrice] = useState<number>(PRODUCT_PRICE);
  const [liveImage, setLiveImage] = useState<string>(INITIAL_PRODUCT_IMAGES[0].url);

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

  // Sync with live product data on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          const fetchedPrice = Number(data.product.price) || PRODUCT_PRICE;
          const fetchedImg = data.bannerImage?.url || INITIAL_PRODUCT_IMAGES[0].url;
          setLivePrice(fetchedPrice);
          setLiveImage(fetchedImg);

          // Update cached item's price and image if already loaded
          setItem((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              price: fetchedPrice,
              image: fetchedImg,
            };
          });
        }
      })
      .catch(() => {});
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

  const addToCart = (quantity = 1, customPrice?: number, customImage?: string) => {
    const finalPrice = typeof customPrice === "number" ? customPrice : livePrice;
    const finalImage = customImage || liveImage;

    setItem((prev) => {
      const newQty = prev ? prev.quantity + quantity : quantity;
      return {
        productId: "eagle-endurance-for-men",
        name: `${BRAND_NAME} – ${PRODUCT_NAME}`,
        price: finalPrice,
        quantity: Math.max(1, Math.min(20, newQty)),
        image: finalImage,
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

  const buyNow = (quantity = 1, customPrice?: number, customImage?: string) => {
    const validQty = Math.max(1, Math.min(20, quantity));
    addToCart(validQty, customPrice, customImage);
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
        livePrice,
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
