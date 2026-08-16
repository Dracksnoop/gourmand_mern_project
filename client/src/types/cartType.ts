import { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem { 
    quantity:number;
}
export type CartState = {
    cart:CartItem[];
    // Which restaurant the current cart belongs to. Checkout needs it, and it is what
    // lets us notice the user has started ordering somewhere else.
    restaurantId: string | null;
    addToCart:(item:MenuItem, restaurantId:string) => void;
    clearCart: () => void;
    removeFromTheCart: (id:string) => void;
    incrementQuantity: (id:string) => void;
    decrementQuantity: (id:string) => void;
}