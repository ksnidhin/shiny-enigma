import { WatchProduct } from "./api";

export interface CartItem {
  watch: WatchProduct;
  quantity: number;
}

export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("rtc_cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addToCart = (watch: WatchProduct) => {
  if (typeof window === "undefined") return;
  const items = getCartItems();
  const existingIndex = items.findIndex(item => item.watch.id === watch.id);
  
  if (existingIndex >= 0) {
    items[existingIndex].quantity += 1;
  } else {
    items.push({ watch, quantity: 1 });
  }
  
  localStorage.setItem("rtc_cart", JSON.stringify(items));
};

export const removeFromCart = (watchId: string) => {
  if (typeof window === "undefined") return;
  const items = getCartItems();
  const newItems = items.filter(item => item.watch.id !== watchId);
  localStorage.setItem("rtc_cart", JSON.stringify(newItems));
};

export const updateCartQuantity = (watchId: string, quantity: number) => {
  if (typeof window === "undefined") return;
  const items = getCartItems();
  const existingIndex = items.findIndex(item => item.watch.id === watchId);
  
  if (existingIndex >= 0) {
    if (quantity <= 0) {
      items.splice(existingIndex, 1);
    } else {
      items[existingIndex].quantity = quantity;
    }
    localStorage.setItem("rtc_cart", JSON.stringify(items));
  }
};

export const clearCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rtc_cart");
};
