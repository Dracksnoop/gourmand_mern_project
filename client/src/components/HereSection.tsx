import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HereImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const POPULAR_CITIES = ["Jaipur", "Mumbai", "Delhi", "Bengaluru"];

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  // An empty term used to navigate to "/search/", which matched no route and left the
  // user on a blank screen. With nothing typed, show everything instead.
  const handleSearch = () => {
    const term = searchText.trim();
    navigate(term ? `/search/${encodeURIComponent(term)}` : "/search");
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-10 md:gap-20">
      <div className="flex flex-col gap-8 md:w-[45%]">
        <div className="flex flex-col gap-4">
          {/* The theme's orange is a raw CSS variable, so Tailwind cannot derive a
              translucent version of it. Amber is the closest palette tint. */}
          <span className="w-fit text-xs font-medium px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-orange">
            Delivering in 30 minutes
          </span>
          <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl leading-tight">
            Order food anytime & anywhere
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Browse restaurants near you, build your order and track it from the kitchen
            to your door.
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <Input
            type="text"
            value={searchText}
            placeholder="Search by name, city or country"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-12 shadow-lg"
          />
          <Search className="text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          <Button
            onClick={handleSearch}
            className="h-12 px-6 bg-orange hover:bg-hoverOrange"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Popular:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => navigate(`/search/${city}`)}
              className="text-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-orange hover:text-orange transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="md:w-[45%]">
        <img
          src={HereImage}
          alt="A freshly made pizza"
          className="object-contain w-full max-h-[420px] drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default HereSection;
