import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import "./HostelDetails.css";

function HostelDetails() {
  const { id } = useParams();

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: "",
    comment: "",
  });

  useEffect(() => {
    fetchHostelDetails();
    fetchRooms();
    fetchReviews();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      const res = await API.get(`/hostels/${id}`);
      setHostel(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load hostel details");
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await API.get(`/rooms/hostel/${id}`);
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!hostel) {
    return <h2 className="loading">Loading...</h2>;
  }

  const handleReviewChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post("/reviews/add", {
        hostelId: id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      alert("Review added successfully");

      setReviewData({
        rating: "",
        comment: "",
      });

      fetchReviews();
      fetchHostelDetails();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <div className="details-page">
      <div className="details-container">
        <img
          className="details-image"
          src={
            hostel.images && hostel.images.length > 0
              ? hostel.images[0]
              : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
          }
          alt={hostel.name}
        />

        <div className="details-info">
          <h1>{hostel.name}</h1>
          <p className="details-location">
            {hostel.location}, {hostel.city}
          </p>
          <p className="details-address">{hostel.address}</p>

          <h3>Facilities</h3>
          <div className="details-facilities">
            {hostel.facilities?.map((facility, index) => (
              <span key={index}>{facility}</span>
            ))}
          </div>

          <h3>Price Range</h3>
          <p className="details-price">₹{hostel.priceRange}/month</p>

          <p className="details-rating">
            ⭐ {hostel.avgRating || "No rating yet"}
          </p>
        </div>
      </div>

      <section className="rooms-section">
        <h2>Available Rooms</h2>

        <div className="rooms-grid">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div className="room-card" key={room._id}>
                <h3>{room.type}</h3>
                <p>Price: ₹{room.price}/month</p>
                <p>
                  Vacancy:{" "}
                  {room.vacancy || room.vacancies || room.availableRooms || 0}
                </p>

                {Number(
                  room.vacancy || room.vacancies || room.availableRooms || 0,
                ) > 0 ? (
                  <Link to={`/booking/${room._id}`} className="book-btn">
                    Book Now
                  </Link>
                ) : (
                  <button className="disabled-btn" disabled>
                    Not Available
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No rooms added yet</p>
          )}
        </div>
      </section>

      <section className="reviews-section">
        <h2>Reviews & Feedback</h2>

        <form className="review-form" onSubmit={submitReview}>
          <label>Rating</label>
          <select
            name="rating"
            value={reviewData.rating}
            onChange={handleReviewChange}
            required
          >
            <option value="">Select Rating</option>
            <option value="1">⭐ 1</option>
            <option value="2">⭐ 2</option>
            <option value="3">⭐ 3</option>
            <option value="4">⭐ 4</option>
            <option value="5">⭐ 5</option>
          </select>

          <label>Comment</label>
          <textarea
            name="comment"
            placeholder="Write your feedback..."
            value={reviewData.comment}
            onChange={handleReviewChange}
            required
          ></textarea>

          <button type="submit">Submit Review</button>
        </form>

        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review-card" key={review._id}>
                <h4>⭐ {review.rating}</h4>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HostelDetails;
