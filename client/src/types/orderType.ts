export type CheckoutSessionRequest = {
    cartItems:{
        menuId:string;
        name:string;
        image:string;
        price:string;
        quantity:string;
    }[];
    deliveryDetails:{
        name:string;
        email:string;
        contact:string;
        address:string;
        city:string;
        country:string
    },
    restaurantId:string;
}
export type OrderRestaurant = {
    _id:string;
    restaurantName:string;
    imageUrl:string;
    city:string;
    deliveryTime:number;
}

export interface Orders extends CheckoutSessionRequest {
    _id:string;
    status:string;
    totalAmount:number;
    createdAt:string;
    cancellationReason?:string;
    cancelledAt?:string;
    restaurant?:OrderRestaurant;
}
export type OrderState = {
    loading:boolean;
    orders:Orders[];
    createCheckoutSession: (checkoutSessionRequest:CheckoutSessionRequest) => Promise<void>;
    getOrderDetails: () => Promise<void>;
    cancelOrder: (orderId:string, reason:string) => Promise<void>;
}