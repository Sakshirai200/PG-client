import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    fetchMyHostels();
  }, []);

  const fetchMyHostels = async () => {
    try {
      const res = await API.get("/hostels/my");
      setHostels(res.data);
    } catch (error) {
      console.log("ERROR STATUS:", error.response?.status);
      console.log("ERROR DATA:", error.response?.data);
      console.log("TOKEN:", localStorage.getItem("token"));

      alert(error.response?.data?.message || "Failed to load your hostels");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PG?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/hostels/delete/${id}`);
      alert("PG deleted successfully");
      fetchMyHostels();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="owner-page">
      <h1>Owner Dashboard</h1>
      <p className="owner-subtitle">Manage your PG listings and rooms</p>

      <div className="owner-actions">
        <Link to="/owner/add-hostel" className="owner-main-btn">
          Add New PG
        </Link>
      </div>

      <div className="owner-grid">
        {hostels.length > 0 ? (
          hostels.map((hostel) => (
            <div className="owner-card" key={hostel._id}>
              <img
                src={
                  hostel.images && hostel.images.length > 0
                    ? hostel.images[0]
                    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
                }
                alt={hostel.name}
              />

              <div className="owner-card-body">
                <h3>{hostel.name}</h3>
                <p>
                  {hostel.location}, {hostel.city}
                </p>
                <p>₹{hostel.priceRange}/month</p>

                <div className="owner-card-buttons">
                  <Link
                    to={`/owner/add-room/${hostel._id}`}
                    className="small-btn"
                  >
                    Add Room
                  </Link>

                  <Link
                    to={`/owner/edit-hostel/${hostel._id}`}
                    className="view-small-btn"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/owner/manage-rooms/${hostel._id}`}
                    className="view-small-btn"
                  >
                    Manage
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(hostel._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hostels added yet</p>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
