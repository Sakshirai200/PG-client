import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Hostels.css";

function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    facility: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, hostels]);

  const fetchHostels = async () => {
    try {
      const res = await API.get("/hostels");
      setHostels(res.data);
      setFilteredHostels(res.data);
    } catch (error) {
      alert("Failed to load PGs");
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    let updated = [...hostels];

    // Search by name / city / location
    if (filters.search) {
      updated = updated.filter((hostel) =>
        hostel.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        hostel.city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        hostel.location?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Facility filter
    if (filters.facility) {
      updated = updated.filter((hostel) =>
        hostel.facilities?.includes(filters.facility)
      );
    }

    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      updated = updated.filter((hostel) => {
        const priceParts = hostel.priceRange?.split("-");
        const min = Number(priceParts?.[0] || 0);
        const max = Number(priceParts?.[1] || 0);

        return (
          (!filters.minPrice || max >= Number(filters.minPrice)) &&
          (!filters.maxPrice || min <= Number(filters.maxPrice))
        );
      });
    }

    setFilteredHostels(updated);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      facility: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="hostels-page">
      <h1>Find Your Perfect PG</h1>

      {/* FILTER SECTION */}
      <div className="filter-box">
        <input
          type="text"
          name="search"
          placeholder="Search by PG name, city, or area"
          value={filters.search}
          onChange={handleChange}
        />

        <select
          name="facility"
          value={filters.facility}
          onChange={handleChange}
        >
          <option value="">All Facilities</option>
          <option value="WiFi">WiFi</option>
          <option value="Food">Food</option>
          <option value="Parking">Parking</option>
          <option value="Security">Security</option>
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
        />

        <button onClick={clearFilters} className="clear-btn">
          Clear Filters
        </button>
      </div>

      {/* HOSTEL LIST */}
      <div className="hostels-grid">
        {filteredHostels.length > 0 ? (
          filteredHostels.map((hostel) => (
            <div className="hostel-card" key={hostel._id}>
              <img
                src={
                  hostel.images?.[0] ||
                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
                }
                alt={hostel.name}
              />

              <div className="hostel-card-body">
                <h3>{hostel.name}</h3>
                <p>{hostel.location}, {hostel.city}</p>
                <p>Facilities: {hostel.facilities?.join(", ")}</p>
                <p>Price: ₹{hostel.priceRange}</p>

                <Link
                  to={`/hostel/${hostel._id}`}
                  className="view-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-booking-state">
            <h3>No PG Found</h3>
            <p>Try changing your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hostels;