import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useCartStore = create<CartState>()(persist((set) => ({
    cart: [],
    restaurantId: null,
    addToCart: (item: MenuItem, restaurantId: string) => {
        set((state) => {
            // Checkout prices the order from a single restaurant's menu, so a cart
            // holding items from two restaurants cannot be completed. Ordering from a
            // different restaurant starts the cart over instead of failing at payment.
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                return { cart: [{ ...item, quantity: 1 }], restaurantId };
            }

            const existingItem = state.cart.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                return {
                    cart: state.cart.map((cartItem) => cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                    ),
                    restaurantId
                };
            }

            return {
                cart: [...state.cart, { ...item, quantity: 1 }],
                restaurantId
            };
        })
    },
    clearCart: () => {
        set({ cart: [], restaurantId: null });
    },
    removeFromTheCart: (id: string) => {
        set((state) => {
            const cart = state.cart.filter((item) => item._id !== id);
            return { cart, restaurantId: cart.length > 0 ? state.restaurantId : null };
        })
    },
    incrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
        }))
    },
    decrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
        }))
    }
}),
    {
        name: 'cart-name',
        storage: createJSONStorage(() => localStorage),
        // Carts saved before restaurantId existed cannot be checked out, because there
        // is no way to tell which restaurant they came from. Drop them on upgrade
        // rather than letting the user find out at the payment step.
        version: 1,
        migrate: () => ({ cart: [], restaurantId: null } as any)
    }
))
