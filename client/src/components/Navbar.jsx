// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useSearch } from "../context/SearchContext";

const Navbar = ({ isAuthenticated, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.blur();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/60 backdrop-blur-md py-3 px-6 rounded-full shadow-md mx-auto my-4 w-fit flex items-center gap-8 text-black border border-gray-200 text-base">
      <div className="flex gap-6 items-center font-semibold">
        <NavItem to="/about" label="About" active={isActive("/about")} />

        {isAuthenticated && userRole === "student" && (
          <>
            <NavItem
              to="/student-dashboard"
              label="Student Dashboard"
              active={isActive("/student-dashboard")}
            />
            <NavItem
              to="/courses"
              label="View Courses"
              active={isActive("/courses")}
            />
          </>
        )}

        {isAuthenticated && userRole === "admin" && (
          <>
            <NavItem to="/admin" label="Admin Dashboard" active={isActive("/admin")} />
            <NavItem
              to="/upload-course"
              label="Upload Course"
              active={isActive("/upload-course")}
            />
            <NavItem
              to="/view-course"
              label="View Courses"
              active={isActive("/view-course")}
            />
            <NavItem
              to="/upload-quiz"
              label="Upload Quiz"
              active={isActive("/upload-quiz")}
            />
          </>
        )}

        {!isAuthenticated && (
          <>
            <NavItem to="/signup" label="Sign Up" active={isActive("/signup")} />
            <NavItem to="/login" label="Login" active={isActive("/login")} />
          </>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#D9D9D9]/30 backdrop-blur-md px-3 py-1 rounded-full border border-gray-300 shadow-inner">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-base text-black placeholder-gray-600 w-32"
          />
          <button
            onClick={() => {}}
            className="text-blue-500 hover:text-blue-600 font-bold text-base"
          >
            🔍
          </button>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <button
            className="bg-[#063442] hover:bg-[#022029] text-white px-3 py-1 rounded-full text-base"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ to, label, active }) => (
  <Link
    to={to}
    className={`text-base px-4 py-2 rounded-full transition-all ${
      active ? "bg-[#AED8D7] font-bold" : "hover:bg-gray-200"
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
