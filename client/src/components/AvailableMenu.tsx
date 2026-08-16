import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AvailableMenu = ({ menus, restaurantId }: { menus: MenuItem[]; restaurantId: string }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = (menu: MenuItem) => {
    addToCart(menu, restaurantId);
    toast.success(`${menu.name} added to your cart`);
    navigate("/cart");
  };

  return (
    <div className="md:p-4">
      <h2 className="text-xl md:text-2xl font-extrabold mb-6">Available menus</h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu._id}
            className="flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-44 object-cover"
            />
            <CardContent className="flex-1 p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {menu.description}
              </p>
              <p className="text-lg font-bold mt-3 text-[#D19254]">₹{menu.price}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(menu)}
                className="w-full bg-orange hover:bg-hoverOrange"
              >
                Add to cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
