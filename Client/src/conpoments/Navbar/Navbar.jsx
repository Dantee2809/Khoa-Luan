import { Link } from "react-router-dom";
import { LogOut, PackageSearch, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { RiAdminLine } from "react-icons/ri";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="sticky top-0 w-full z-40 bg-base-100/80 backdrop-blur-lg border-b border-base-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300"
          >
            <div className="rounded-lg bg-primary/10 p-3 flex items-center justify-center">
              <PackageSearch className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              Lost and Found
            </h1>
          </Link>
        </div>

        {/* Navigation and User Actions */}
        <div className="flex items-center gap-4">
          {authUser && (
            <>
              {/* Admin Dashboard Link */}
              {authUser.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="btn btn-sm gap-2 text-gray-800 hover:bg-primary/20 transition-colors duration-200"
                >
                  <RiAdminLine className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {/* User Profile Link */}
              <Link
                to="/profile"
                className="btn btn-sm gap-2 text-gray-800 hover:bg-primary/20 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                className="flex gap-2 items-center text-gray-800 hover:bg-primary/20 transition-colors duration-200"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
