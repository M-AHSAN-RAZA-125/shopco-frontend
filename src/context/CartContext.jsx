import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { apiFetch, getImageUrl } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const GUEST_CART_KEY = "shopping_cart";

const readGuestCart = () => {
  try {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    /* ignore */
  }
};

// Backend cart -> the item shape the UI already uses ({ id, name, price, image, quantity, size, color })
const fromServerCart = (serverCart) =>
  (serverCart?.items || []).map((item) => ({
    id: item.productId, // same id as products in ProductsContext (Mongo _id)
    cartItemId: item.cartItemId,
    name: item.name,
    price: Number(item.price) || 0,
    image: getImageUrl(item.image),
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    stock: item.stock,
  }));

const sameLine = (item, id, size, color) =>
  String(item.id) === String(id) && item.size === size && item.color === color;

export const CartProvider = ({ children }) => {
  const { user, authLoading } = useAuth();
  const [cart, setCart] = useState(readGuestCart);
  const [cartError, setCartError] = useState("");
  const [cartBusy, setCartBusy] = useState(false);
  const syncedUserId = useRef(null);

  // Guest cart is kept in localStorage (exactly like before); a logged-in cart lives on the server.
  useEffect(() => {
    if (authLoading || user) return;
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, user, authLoading]);

  // On login: push the guest cart to the server (merge) and use the server cart from now on.
  // On logout: empty the on-screen cart (the server keeps it for the next login).
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      if (syncedUserId.current) {
        syncedUserId.current = null;
        setCart([]);
      }
      return;
    }

    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    let cancelled = false;
    (async () => {
      try {
        const guestItems = readGuestCart();
        const data = guestItems.length
          ? await apiFetch("/cart/merge", {
              method: "POST",
              body: {
                items: guestItems.map((i) => ({ productId: i.id, quantity: i.quantity, size: i.size, color: i.color })),
              },
            })
          : await apiFetch("/cart");
        if (cancelled) return;
        clearGuestCart();
        setCart(fromServerCart(data.cart));
        setCartError("");
      } catch (error) {
        if (!cancelled) {
          syncedUserId.current = null; // allow a retry
          setCartError(error.message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // Run a cart request on the server and replace the on-screen cart with the answer.
  const serverCall = useCallback(async (path, options) => {
    setCartBusy(true);
    try {
      const data = await apiFetch(path, options);
      setCart(fromServerCart(data.cart));
      setCartError("");
      return { ok: true };
    } catch (error) {
      setCartError(error.message);
      return { ok: false, message: error.message };
    } finally {
      setCartBusy(false);
    }
  }, []);

  const addToCart = useCallback(
    async (product, quantity, size, color) => {
      if (!product) return { ok: false, message: "Product not found." };
      const qty = Number(quantity) || 1;
      const finalSize = size || "Standard";
      const finalColor = color || "Default";

      if (user) {
        return serverCall("/cart/items", {
          method: "POST",
          body: { productId: product.id, quantity: qty, size: finalSize, color: finalColor },
        });
      }

      setCart((prev) => {
        const index = prev.findIndex((item) => sameLine(item, product.id, finalSize, finalColor));
        if (index > -1) {
          return prev.map((item, i) => (i === index ? { ...item, quantity: item.quantity + qty } : item));
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            image: product.image || (product.images && product.images[0]) || "",
            quantity: qty,
            size: finalSize,
            color: finalColor,
            stock: product.stock,
          },
        ];
      });
      return { ok: true };
    },
    [user, serverCall]
  );

  const updateQuantity = useCallback(
    async (id, size, color, type) => {
      const item = cart.find((i) => sameLine(i, id, size, color));
      if (!item) return { ok: false };
      const newQty = Math.max(1, type === "increase" ? item.quantity + 1 : item.quantity - 1);
      if (newQty === item.quantity) return { ok: true };

      if (user) {
        return serverCall(`/cart/items/${item.cartItemId}`, { method: "PATCH", body: { quantity: newQty } });
      }
      if (item.stock !== undefined && item.stock !== null && newQty > item.stock) {
        setCartError("Not enough stock available");
        return { ok: false, message: "Not enough stock available" };
      }
      setCart((prev) => prev.map((i) => (sameLine(i, id, size, color) ? { ...i, quantity: newQty } : i)));
      setCartError("");
      return { ok: true };
    },
    [cart, user, serverCall]
  );

  const removeFromCart = useCallback(
    async (id, size, color) => {
      const item = cart.find((i) => sameLine(i, id, size, color));
      if (!item) return { ok: false };
      if (user) return serverCall(`/cart/items/${item.cartItemId}`, { method: "DELETE" });
      setCart((prev) => prev.filter((i) => !sameLine(i, id, size, color)));
      return { ok: true };
    },
    [cart, user, serverCall]
  );

  // Re-read the cart from the server (used after checkout, which empties it there).
  const refreshCart = useCallback(async () => {
    if (!user) return;
    await serverCall("/cart");
  }, [user, serverCall]);

  return (
    <CartContext.Provider
      value={{ cart, cartError, cartBusy, addToCart, updateQuantity, removeFromCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
