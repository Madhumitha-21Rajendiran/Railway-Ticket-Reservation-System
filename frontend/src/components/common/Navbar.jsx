import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const linkClass = ({ isActive }) =>
  isActive
    ? "px-2 text-cyan-300 font-semibold"
    : "px-2 text-white/80 hover:text-white";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        
        <NavLink to="/" className="text-xl font-bold tracking-wide text-cyan-300">
          RailReserve
        </NavLink>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          
          <NavLink to="/search" className={linkClass}>
            Search
          </NavLink>

          <NavLink to="/pnr-status" className={linkClass}>
            PNR
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-bookings" className={linkClass}>
                My Bookings
              </NavLink>

              {user.role === "admin" && (
                <>
                  <NavLink to="/admin/dashboard" className={linkClass}>
                    Admin
                  </NavLink>
                  <NavLink to="/admin/trains" className={linkClass}>
                    Trains
                  </NavLink>
                  <NavLink to="/admin/users" className={linkClass}>
                    Users
                  </NavLink>
                  <NavLink to="/admin/bookings" className={linkClass}>
                    Bookings
                  </NavLink>
                </>
              )}

              {(user.role === "clerk" || user.role === "admin") && (
                <>
                  <NavLink to="/clerk/dashboard" className={linkClass}>
                    Clerk
                  </NavLink>
                  <NavLink to="/clerk/book-ticket" className={linkClass}>
                    Clerk Book
                  </NavLink>
                  <NavLink to="/clerk/cancel-ticket" className={linkClass}>
                    Clerk Cancel
                  </NavLink>
                </>
              )}

              {/* ❌ REMOVED USER NAME DISPLAY */}

              <button
                onClick={handleLogout}
                className="glow-btn rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <NavLink
              to="/login"
              className="glow-btn rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950"
            >
              Login
            </NavLink>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;