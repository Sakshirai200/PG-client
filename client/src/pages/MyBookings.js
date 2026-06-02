import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load bookings");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/cancel/${id}`);
      alert("Booking cancelled");
      fetchMyBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="my-bookings-page">
      <h1>My Bookings</h1>

      <div className="booking-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>{booking.hostelId?.name}</h3>

              <p>
                <strong>Room:</strong> {booking.roomId?.type}
              </p>
              <p>
                <strong>Price:</strong> ₹{booking.roomId?.price}/month
              </p>
              <p>
                <strong>Name:</strong> {booking.fullName}
              </p>
              <p>
                <strong>Mobile:</strong> {booking.mobile}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Persons:</strong> {booking.persons}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    booking.status === "booked"
                      ? "status-badge booked"
                      : "status-badge cancelled"
                  }
                >
                  {booking.status}
                </span>
              </p>

              {booking.status === "booked" && (
                <button onClick={() => cancelBooking(booking._id)}>
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="empty-booking-state">
            <h3>No Bookings Yet</h3>
            <p>You have not booked any PG rooms yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
