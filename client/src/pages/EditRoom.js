import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./OwnerDashboard.css";

function EditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [hostelId, setHostelId] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    price: "",
    vacancy: "",
  });

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const res = await API.get(`/rooms/${roomId}`);

      setHostelId(res.data.hostelId);

      setFormData({
        type: res.data.type || "",
        price: res.data.price || "",
        vacancy: res.data.vacancy || "",
      });
    } catch (error) {
      alert("Failed to load room");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateRoom = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/rooms/update/${roomId}`, {
        ...formData,
        availability: Number(formData.vacancy) > 0,
      });

      alert("Room updated successfully");
      navigate(`/owner/manage-rooms/${hostelId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="owner-page">
      <form className="owner-form" onSubmit={updateRoom}>
        <h2>Edit Room</h2>

        <label>Room Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Vacancy</label>
        <input
          type="number"
          name="vacancy"
          value={formData.vacancy}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Room</button>
      </form>
    </div>
  );
}

export default EditRoom;