import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./OwnerDashboard.css";

function AddHostel() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();

    try {
      await API.post("/hostels/add", {
        ...formData,
        facilities: formData.facilities.split(",").map((item) => item.trim()),
        images: formData.images ? [formData.images] : [],
      });

      alert("PG added successfully");
      navigate("/owner");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add PG");
    }
  };

  return (
    <div className="owner-page">
      <form className="owner-form" onSubmit={handleAddHostel}>
        <h2>Add New PG</h2>

        <label>PG Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter PG name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Mobile Number</label>
        <input
          type="text"
          name="mobile"
          placeholder="Enter mobile number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        <label>Location / Area</label>
        <input
          type="text"
          name="location"
          placeholder="Example: Kankanady"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Full Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter full address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          placeholder="Example: Mangalore"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <label>Facilities</label>
        <input
          type="text"
          name="facilities"
          placeholder="WiFi, Food, Parking, Security"
          value={formData.facilities}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="text"
          name="images"
          placeholder="Paste image URL"
          value={formData.images}
          onChange={handleChange}
        />

        <label>Price Range</label>
        <input
          type="text"
          name="priceRange"
          placeholder="Example: 5000-9000"
          value={formData.priceRange}
          onChange={handleChange}
          required
        />

        <button type="submit">Add PG</button>
      </form>
    </div>
  );
}

export default AddHostel;