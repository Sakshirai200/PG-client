import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./OwnerDashboard.css";

function EditHostel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    location: "",
    address: "",
    city: "",
    facilities: "",
    images: "",
    priceRange: "",
  });

  useEffect(() => {
    fetchHostel();
  }, [id]);

  const fetchHostel = async () => {
    try {
      const res = await API.get(`/hostels/${id}`);

      setFormData({
        name: res.data.name || "",
        mobile: res.data.mobile || "",
        location: res.data.location || "",
        address: res.data.address || "",
        city: res.data.city || "",
        facilities: res.data.facilities?.join(", ") || "",
        images: res.data.images?.[0] || "",
        priceRange: res.data.priceRange || "",
      });
    } catch (error) {
      alert("Failed to load hostel details");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/hostels/update/${id}`, {
        ...formData,
        facilities: formData.facilities
          .split(",")
          .map((item) => item.trim()),
        images: formData.images ? [formData.images] : [],
      });

      alert("PG updated successfully");
      navigate("/owner");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="owner-page">
      <form className="owner-form" onSubmit={handleUpdate}>
        <h2>Edit PG</h2>

        <label>PG Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Mobile Number</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Facilities</label>
        <input
          type="text"
          name="facilities"
          value={formData.facilities}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="text"
          name="images"
          value={formData.images}
          onChange={handleChange}
        />

        <label>Price Range</label>
        <input
          type="text"
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          required
        />

        <button type="submit">Update PG</button>
      </form>
    </div>
  );
}

export default EditHostel;