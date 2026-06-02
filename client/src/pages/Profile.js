import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "Not available";
  const role = localStorage.getItem("role") || "user";

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>

        <h2>{name}</h2>
        <p className="profile-role">{role}</p>

        <div className="profile-info">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
        </div>

        <button onClick={handleLogout} className="logout-profile-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;