import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

const API_END_POINT: string = `${API_BASE_URL}/order`;
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],
    createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.href = response.data.session.url;
            set({ loading: false });
        } catch (error: any) {
            // Swallowing this left the checkout button looking like it did nothing at
            // all when the request failed.
            toast.error(error?.response?.data?.message || "Could not start checkout. Please try again.");
            set({ loading: false });
        }
    },
    getOrderDetails: async () => {
        try {
            set({loading:true});
            const response = await axios.get(`${API_END_POINT}/`);
          
            set({loading:false, orders:response.data.orders});
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Could not load your orders.");
            set({loading:false});
        }
    },
    cancelOrder: async (orderId: string, reason: string) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/${orderId}/cancel`, { reason });
            if (response.data.success) {
                toast.success(response.data.message);
                // Merged rather than replaced: the cancel response is not populated with
                // the restaurant, and dropping it would blank out the card.
                set((state) => ({
                    loading: false,
                    orders: state.orders.map((order) =>
                        order._id === orderId ? { ...order, ...response.data.order } : order
                    )
                }));
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Could not cancel this order.");
            set({ loading: false });
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))