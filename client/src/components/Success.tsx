import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleSlash, Clock, IndianRupee, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import OrderStatusTimeline from "./OrderStatusTimeline";
import CancelOrderDialog from "./CancelOrderDialog";
import { useOrderStore } from "@/store/useOrderStore";
import { Orders } from "@/types/orderType";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  preparing: "Being prepared",
  outfordelivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  preparing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  outfordelivery: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const CANCELLABLE = ["pending", "confirmed"];

// The stored totalAmount comes back from Stripe in paise and is only written once the
// webhook lands, so the line items are the dependable source for what to show.
const orderTotal = (order: Orders) =>
  order.cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const Success = () => {
  const { orders, getOrderDetails, cancelOrder, loading } = useOrderStore();
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-10 px-4 space-y-4">
        {[1, 2].map((n) => (
          <Skeleton key={n} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <ShoppingBag size={48} className="text-gray-300" />
        <h1 className="font-bold text-xl text-gray-700 dark:text-gray-300">
          You have not ordered anything yet
        </h1>
        <p className="text-gray-500 text-sm">Your orders will show up here.</p>
        <Link to="/">
          <Button className="bg-orange hover:bg-hoverOrange">Browse restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">Your orders</h1>

      <div className="space-y-5">
        {orders.map((order: Orders) => {
          const status = order.status;
          const isCancelled = status === "cancelled";
          const canCancel = CANCELLABLE.includes(status);

          return (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  {order.restaurant?.imageUrl && (
                    <img
                      src={order.restaurant.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-semibold truncate">
                      {order.restaurant?.restaurantName || "Restaurant"}
                    </h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(order.createdAt)}
                      <span className="mx-1">·</span>#{order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap",
                    STATUS_STYLES[status] || STATUS_STYLES.pending
                  )}
                >
                  {STATUS_LABELS[status] || status}
                </span>
              </div>

              <Separator />

              <div className="p-4">
                {isCancelled ? (
                  <div className="flex items-start gap-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg p-3">
                    <CircleSlash size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">This order was cancelled</p>
                      {order.cancellationReason && (
                        <p className="text-xs mt-0.5 opacity-90">
                          Reason: {order.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <OrderStatusTimeline status={status} />
                )}
              </div>

              <Separator />

              <div className="p-4 space-y-3">
                {order.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-md object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium shrink-0">
                      ₹{Number(item.price) * Number(item.quantity)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg flex items-center">
                    <IndianRupee size={16} />
                    {orderTotal(order)}
                  </span>
                </div>
              </div>

              {canCancel && (
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    onClick={() => setCancelling(order._id)}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                  >
                    Cancel order
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link to="/">
          <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md">
            Continue shopping
          </Button>
        </Link>
      </div>

      <CancelOrderDialog
        open={cancelling !== null}
        setOpen={(open) => setCancelling(open ? cancelling : null)}
        loading={loading}
        onConfirm={async (reason) => {
          if (cancelling) await cancelOrder(cancelling, reason);
        }}
      />
    </div>
  );
};

export default Success;
