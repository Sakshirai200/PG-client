import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      console.log("LOGIN RESPONSE:", res.data);

      const token =
        res.data.token ||
        res.data.accessToken ||
        res.data.jwt ||
        res.data.data?.token;

      const user = res.data.user || res.data.data?.user || res.data.loggedUser;

      if (!token) {
        alert(
          "Token not received from backend. Please update backend login response.",
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", user?.role || res.data.role);
      localStorage.setItem("userId", user?._id || user?.id || res.data.id);
      localStorage.setItem("name", user?.name || "");
      localStorage.setItem("email", user?.email || "");

      alert("Login successful");

      const role = user?.role || res.data.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner") {
        navigate("/owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome Back!</h1>
        <p>
          Login to continue finding comfortable, safe, and affordable PG stays.
        </p>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Login</h2>
          <p className="auth-subtitle">Enter your details to continue</p>

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Login
          </button>

          <p className="auth-link">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
