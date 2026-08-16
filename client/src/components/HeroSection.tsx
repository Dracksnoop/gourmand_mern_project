import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const POPULAR_CITIES = ["Jaipur", "Mumbai", "Delhi", "Bengaluru", "Hyderabad"];

const HeroSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  // An empty term used to navigate to "/search/", which matched no route and left the
  // user on a blank screen. With nothing typed, show everything instead.
  const handleSearch = () => {
    const term = searchText.trim();
    navigate(term ? `/search/${encodeURIComponent(term)}` : "/search");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
          alt="A table of freshly served dishes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darkened from the left so the copy stays readable over a busy photo. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

        <div className="relative px-6 py-16 md:px-14 md:py-24 max-w-2xl">
          <span className="inline-block text-xs font-medium tracking-wide uppercase text-orange">
            Now delivering across India
          </span>

          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Good food, from kitchens near you
          </h1>

          <p className="mt-4 text-gray-200 text-sm md:text-base leading-relaxed">
            Search by dish, restaurant or city. Order in a few taps and follow it all
            the way to your door.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                value={searchText}
                placeholder="Try biryani, Jaipur or Forno Nero"
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 bg-white text-gray-900 border-0"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-8 bg-orange hover:bg-hoverOrange"
            >
              Search
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-300">Popular:</span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/search/${city}`)}
                className="text-xs px-3 py-1 rounded-full border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
