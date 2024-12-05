import { Link } from "react-router-dom";
import { LogOut, PackageSearch, Settings, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="sticky bg-base-100 border-b border-base-300 w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <PackageSearch className="w-11 h-11 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Lost and Found</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/profile"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {authUser && (
              <>
                {/* Hiển thị Dashboard nếu người dùng có role là "admin" */}
                {authUser.role === "admin" && (
                  <Link to="/admin-dashboard" className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
