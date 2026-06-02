import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LEFT - LOGO */}
      <div className="logo">
        <div className="logo-icon">🏠</div>
        <div>
          <h2>PG Finder</h2>
          <p>Find. Book. Stay.</p>
        </div>
      </div>

      {/* CENTER - NAV LINKS */}
      <div className="nav-links">
        <Link to="/" className="active">Home</Link>
        <Link to="/hostels">Find PG</Link>

        {/* User */}
        {token && role === "user" && (
          <Link to="/my-bookings">My Bookings</Link>
        )}

        {/* Owner */}
        {token && role === "owner" && (
          <Link to="/owner">For Owners</Link>
        )}

        {/* Admin (optional) */}
        {token && role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {/* Common */}
        {token && (
          <Link to="/profile">Profile</Link>
        )}
      </div>

      {/* RIGHT - AUTH */}
      <div className="auth-buttons">
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;