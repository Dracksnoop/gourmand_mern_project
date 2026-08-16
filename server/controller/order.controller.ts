import { Request, Response } from "express";
import mongoose from "mongoose";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";

// Once the kitchen has started cooking, cancelling is a conversation with the
// restaurant rather than something the customer can do on their own.
const CANCELLABLE_STATUSES = ["pending", "confirmed"];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number
    }[],
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string
    },
    restaurantId: string
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.id })
            .sort({ createdAt: -1 })
            .populate('user')
            .populate('restaurant');
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Scoped to the person who placed it, so knowing an order id is not enough to
        // cancel somebody else's dinner.
        if (order.user.toString() !== req.id) {
            return res.status(403).json({ success: false, message: "This is not your order" });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({ success: false, message: "This order is already cancelled" });
        }

        if (!CANCELLABLE_STATUSES.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: "This order has already been prepared and can no longer be cancelled"
            });
        }

        order.status = "cancelled";
        order.cancellationReason = (reason || "").trim() || "No reason given";
        order.cancelledAt = new Date();
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled",
            order
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        // Stripe rejects a session whose redirect targets are not absolute URLs, and an
        // unset FRONTEND_URL turns them into "undefined/order/status". Saying so plainly
        // beats a generic 500 from the Stripe client.
        if (!process.env.FRONTEND_URL) {
            console.error("FRONTEND_URL is not set; checkout cannot build its redirect URLs.");
            return res.status(500).json({
                success: false,
                message: "Checkout is not configured on the server."
            });
        }

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            })
        };
        const order: any = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending"
        });

        // line items
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item: any) => item.image))
            }
        });
        if (!session.url) {
            return res.status(400).json({ success: false, message: "Error while creating session" });
        }
        await order.save();
        return res.status(200).json({
            session
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const stripeWebhook = async (req: Request, res: Response) => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];
        if (!signature) {
            return res.status(400).send("Missing stripe-signature header");
        }

        // req.body is the raw Buffer here (see the parser mounted in server/index.ts).
        // Verifying against the signature Stripe actually sent is the whole point: the
        // secret proves the call came from Stripe and the body has not been altered.
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.WEBHOOK_ENDPOINT_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";

            await order.save();
        } catch (error) {
            console.error('Error handling event:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    // 1. create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item id not found`);

        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        }
    })
    // 2. return lineItems
    return lineItems;
}