import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./BookingPage.css";

function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    checkInDate: "",
    persons: 1,
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      const res = await API.get(`/rooms/${roomId}`);
      setRoom(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load room details");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      await API.post("/bookings/create", {
        roomId,
        ...formData,
      });

      alert("Booking successful");
      navigate("/my-bookings");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (!room) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-summary">
          <h2>Booking Summary</h2>

          <div className="summary-box">
            <h3>{room.type}</h3>
            <p>Price: ₹{room.price}/month</p>
            <p>Vacancy: {room.vacancy}</p>
            <p>Status: {room.vacancy > 0 ? "Available" : "Full"}</p>
          </div>
        </div>

        <div className="booking-form-section">
          <form className="booking-form" onSubmit={handleBooking}>
            <h2>Confirm Your Booking</h2>

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
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

            <label>Check-in Date</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
            />

            <label>Number of Persons</label>
            <input
              type="number"
              name="persons"
              min="1"
              value={formData.persons}
              onChange={handleChange}
              required
            />

            <button type="submit" className="book-submit-btn">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
