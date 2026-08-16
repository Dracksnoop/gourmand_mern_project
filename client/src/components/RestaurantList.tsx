import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, MapPin, Timer } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Restaurant } from "@/types/restaurantType";

const RestaurantList = () => {
  const { allRestaurants, getAllRestaurants, loading } = useRestaurantStore();

  useEffect(() => {
    getAllRestaurants();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 my-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold">Restaurants near you</h2>
        {!loading && allRestaurants.length > 0 && (
          <span className="text-sm text-gray-500">{allRestaurants.length} places</span>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="shadow-lg rounded-lg overflow-hidden">
              <AspectRatio ratio={16 / 6}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : allRestaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants available right now.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {allRestaurants.map((restaurant: Restaurant) => (
            <Card
              key={restaurant._id}
              className="shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <AspectRatio ratio={16 / 6}>
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.restaurantName}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold">{restaurant.restaurantName}</h3>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>{restaurant.city}</span>
                  <Globe size={16} className="ml-2" />
                  <span>{restaurant.country}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <Timer size={16} />
                  <span>{restaurant.deliveryTime} mins</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {restaurant.cuisines.map((cuisine: string) => (
                    <Badge key={cuisine} className="font-medium px-2 py-1 rounded-full">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t dark:border-t-gray-700">
                <Link to={`/restaurant/${restaurant._id}`} className="w-full">
                  <Button className="w-full bg-orange hover:bg-hoverOrange">
                    View Menu
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
