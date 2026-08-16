import { Bike, ChefHat, CheckCircle2, PackageCheck, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "pending", label: "Placed", icon: Receipt },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "outfordelivery", label: "On the way", icon: Bike },
  { key: "delivered", label: "Delivered", icon: PackageCheck },
];

const OrderStatusTimeline = ({ status }: { status: string }) => {
  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex items-start justify-between w-full">
      {STEPS.map((step, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            {/* Connector to the previous step, drawn behind the marker. */}
            {index > 0 && (
              <span
                className={cn(
                  "absolute top-4 right-1/2 w-full h-0.5 -z-10",
                  reached ? "bg-orange" : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                reached
                  ? "bg-orange border-orange text-white"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400",
                isCurrent && "ring-4 ring-orange/20"
              )}
            >
              <Icon size={16} />
            </span>
            <span
              className={cn(
                "mt-2 text-[11px] md:text-xs text-center leading-tight",
                reached ? "font-medium text-gray-800 dark:text-gray-200" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTimeline;
