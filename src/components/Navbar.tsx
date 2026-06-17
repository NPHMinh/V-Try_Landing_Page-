import { Link, useLocation } from "react-router-dom";
import { Shirt } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-[var(--color-primary)] rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Shirt className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                V-Try
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-[var(--color-primary)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <a
              href="/#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="/#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-[var(--color-primary)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About Team
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              to="/demo"
              className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[0_4px_14px_0_rgba(255,111,97,0.39)] hover:shadow-[0_6px_20px_rgba(255,111,97,0.23)] hover:bg-[#fa5c4d] transition-all duration-200"
            >
              Try Demo Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
