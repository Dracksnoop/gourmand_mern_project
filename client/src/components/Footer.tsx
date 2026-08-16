import { Link } from "react-router-dom";
import { Instagram, Twitter, Utensils } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Utensils size={20} className="text-orange" />
            <span className="font-extrabold text-xl">Gourmand</span>
          </div>
          <p className="text-sm mt-3 max-w-xs leading-relaxed">
            Order from restaurants near you and follow your food from the kitchen to
            your door.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-orange transition-colors">
                All restaurants
              </Link>
            </li>
            <li>
              <Link to="/order/status" className="hover:text-orange transition-colors">
                Your orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-orange transition-colors">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Follow</h3>
          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-gray-800 hover:bg-orange transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-full bg-gray-800 hover:bg-orange transition-colors"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <p className="max-w-7xl mx-auto px-4 py-5 text-sm text-center text-gray-400">
          &copy; {new Date().getFullYear()} Gourmand. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
