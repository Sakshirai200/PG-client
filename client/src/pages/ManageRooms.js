import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import "./OwnerDashboard.css";

function ManageRooms() {
  const { hostelId } = useParams();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, [hostelId]);

  const fetchRooms = async () => {
    try {
      const res = await API.get(`/rooms/hostel/${hostelId}`);
      setRooms(res.data);
    } catch (error) {
      alert("Failed to load rooms");
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await API.delete(`/rooms/delete/${roomId}`);
      alert("Room deleted successfully");
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="owner-page">
      <h1>Manage Rooms</h1>

      <div className="owner-actions">
        <Link to={`/owner/add-room/${hostelId}`} className="owner-main-btn">
          + Add Room
        </Link>
      </div>

      <div className="owner-grid">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="owner-card" key={room._id}>
              <div className="owner-card-body">
                <h3>{room.type}</h3>
                <p>Price: ₹{room.price}/month</p>
                <p>Vacancy: {room.vacancy}</p>
                <p>Status: {room.availability ? "Available" : "Not Available"}</p>

                <div className="owner-card-buttons">
                  <Link
                    to={`/owner/edit-room/${room._id}`}
                    className="view-small-btn"
                  >
                    Edit
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => deleteRoom(room._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms added yet</p>
        )}
      </div>
    </div>
  );
}

export default ManageRooms;