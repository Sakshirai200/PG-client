import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Hostels from "./pages/Hostels";
import HostelDetails from "./pages/HostelDetails";
import BookingPage from "./pages/BookingPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddRoom from "./pages/AddRoom";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AddHostel from "./pages/AddHostel";
import EditHostel from "./pages/EditHostel";
import ManageRooms from "./pages/ManageRooms";
import EditRoom from "./pages/EditRoom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hostels" element={<Hostels />} />
        <Route path="/hostel/:id" element={<HostelDetails />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-room/:hostelId"
          element={
            <ProtectedRoute allowedRole="owner">
              <AddRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRole="user">
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-hostel"
          element={
            <ProtectedRoute allowedRole="owner">
              <AddHostel />
            </ProtectedRoute>
          }
        />
        <Route path="/owner/edit-hostel/:id" element={<EditHostel />} />
        <Route path="/owner/manage-rooms/:hostelId" element={<ManageRooms />} />
        <Route path="/owner/edit-room/:roomId" element={<EditRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
