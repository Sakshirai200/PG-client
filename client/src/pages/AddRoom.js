import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./OwnerDashboard.css";

function AddRoom() {
  const { hostelId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    price: "",
    vacancy: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      await API.post("/rooms/add", {
        hostelId,
        ...formData,
      });

      alert("Room added successfully");
      navigate(`/hostel/${hostelId}`);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add room");
    }
  };

  return (
    <div className="owner-page">
      <form className="owner-form" onSubmit={handleAddRoom}>
        <h2>Add Room Availability</h2>

        <label>Room Type</label>
        <input
          type="text"
          name="type"
          placeholder="Single / Double / Triple Sharing"
          value={formData.type}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          placeholder="Enter room price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Vacancy</label>
        <input
          type="number"
          name="vacancy"
          placeholder="Enter vacancy"
          value={formData.vacancy}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoom;