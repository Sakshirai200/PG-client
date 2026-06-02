import React from "react";
import "./Home.css";

function Home() {
  return (
    <div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find Your Perfect <span>PG Stay</span>
          </h1>

          <p>Discover comfortable, safe and affordable PGs near you.</p>

          <div className="search-box">
            <input type="text" placeholder="Search by city, area or locality..." />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* FEATURED PG */}
      <section className="featured">
        <div className="section-header">
          <h2>Featured PGs</h2>
        </div>

        <div className="pg-cards">

          <div className="pg-card">
            <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" />
            <div className="pg-info">
              <h3>Comfort Living PG</h3>
              <p>Bangalore</p>
              <span>₹7,500 / month</span>
            </div>
          </div>

          <div className="pg-card">
            <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" />
            <div className="pg-info">
              <h3>Green View PG</h3>
              <p>Mangalore</p>
              <span>₹6,000 / month</span>
            </div>
          </div>

          <div className="pg-card">
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" />
            <div className="pg-info">
              <h3>Happy Stay PG</h3>
              <p>Mysore</p>
              <span>₹5,000 / month</span>
            </div>
          </div>

        </div>
      </section>

      {/* WHY */}
      <section className="why">
        <h2>Why Choose PG Finder?</h2>

        <div className="why-container">
          <div className="why-box">
            <h3>Verified Listings</h3>
            <p>All PGs are verified for your safety and comfort.</p>
          </div>

          <div className="why-box">
            <h3>Easy Booking</h3>
            <p>Simple and quick booking process.</p>
          </div>

          <div className="why-box">
            <h3>24/7 Support</h3>
            <p>We are here anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* OWNER SECTION */}
      <section className="owner">
        <div>
          <h2>Are you a PG Owner?</h2>
          <p>List your PG and reach thousands of users.</p>
          <button>List Your PG</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 PG Finder. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;