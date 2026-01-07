import { create } from 'zustand';
import { Product } from '@/types/product';

// Extend the Product type to include quantity for the cart
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  
  addToCart: (product, qty) => set((state) => {
    const existingItem = state.cart.find((item) => item.id === product.id);
    if (existingItem) {
      // Edge Case: Handling duplicate items by increasing quantity
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity: qty }] };
  }),

  removeFromCart: (id) => set((state) => ({
    // Edge Case: Logic ensures only existing items are filtered out
    cart: state.cart.filter((item) => item.id !== id),
  })),

  updateQuantity: (id, qty) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    ),
  })),

  clearCart: () => set({ cart: [] }),
}));