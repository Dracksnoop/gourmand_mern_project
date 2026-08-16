import { useRestaurantStore } from "@/store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { MapPin, Timer, UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant, loading } = useRestaurantStore();

  useEffect(() => {
    getSingleRestaurant(params.id!);
  }, [params.id]);

  if (loading || !singleRestaurant) {
    return (
      <div className="max-w-6xl mx-auto my-10 px-4 space-y-4">
        <Skeleton className="w-full h-48 md:h-72 rounded-xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <div className="relative w-full h-48 md:h-72">
        <img
          src={singleRestaurant.imageUrl}
          alt={singleRestaurant.restaurantName}
          className="object-cover w-full h-full rounded-xl shadow-lg"
        />
        {/* Gradient keeps the name legible whatever the photo behind it looks like. */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h1 className="font-extrabold text-2xl md:text-4xl drop-shadow">
            {singleRestaurant.restaurantName}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {singleRestaurant.city}, {singleRestaurant.country}
            </span>
            <span className="flex items-center gap-1">
              <Timer size={14} />
              {singleRestaurant.deliveryTime} mins
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-5">
        {singleRestaurant.cuisines.map((cuisine: string) => (
          <Badge key={cuisine} variant="outline" className="rounded-full px-3 py-1">
            {cuisine}
          </Badge>
        ))}
      </div>

      {singleRestaurant.menus?.length ? (
        <AvailableMenu
          menus={singleRestaurant.menus}
          restaurantId={singleRestaurant._id}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
          <UtensilsCrossed size={40} className="text-gray-300" />
          <p>This restaurant has not added any dishes yet.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
