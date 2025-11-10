import { Link, useLocation } from "react-router-dom";

export default function Navbar({ cartCount = 0 }) {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/cart", label: "Cart" },
    { path: "/checkout", label: "Checkout" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-gray-950/80 border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-2 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="sm:text-3xl text-2xl pr-1 pl-0 font-light  uppercase tracking-wider text-white hover:text-gray-200 transition-all duration-300"
        >
          <i>ShopVop</i>
        </Link>

        <div className="flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-md font-light uppercase tracking-wide transition-all duration-300 ${
                location.pathname === link.path
                  ? "text-white after:w-full"
                  : "text-gray-400 hover:text-white after:w-0"
              } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[0.5px] after:bg-amber-200 after:transition-all after:duration-300`}
            >
              {link.label}
              {link.path === "/cart" && cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
