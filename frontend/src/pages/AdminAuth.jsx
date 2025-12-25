// src/pages/AdminAuth.jsx
import React, { useState } from "react";
import axios from "axios";
import "./AdminAuth.css";
import { useNavigate } from "react-router-dom";

export default function AdminAuth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "",
    repeatPassword: "",
    email: "",
    adminCode: "",
  });

  const navigate = useNavigate();

  const admindash = () => {
    navigate("/AdminDashboard");
  };

  const handleSignInClick = () => setIsSignIn(true);
  const handleSignUpClick = () => setIsSignIn(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, phone, password, repeatPassword, email, adminCode } = formData;

    // Validation
    if (!username || username.trim().length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (!adminCode || adminCode.trim() === "") {
      alert("Admin code is required");
      return;
    }

    if (!isSignIn) {
      if (password !== repeatPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid email");
        return;
      }
      if (!phone || !/^\d{10}$/.test(phone)) {
        alert("Enter a valid 10-digit phone number");
        return;
      }
    }

    try {
      if (isSignIn) {
        // Admin login API call
        const response = await axios.post("http://localhost:5000/admin/login", {
          username,
          password,
          adminCode,
        });
        // Login successful → navigate silently
        admindash();
      } else {
        // Admin signup API call
        const response = await axios.post("http://localhost:5000/admin/signup", {
          username,
          phone,
          email,
          password,
          adminCode,
        });
        alert(response.data.message); // Only alert for signup success
        setIsSignIn(true); // Switch to sign-in after signup
      }
    } catch (error) {
      console.error(error);
      // Show alert only for login or signup failure
      alert(error.response?.data?.message || "Something went wrong");
    }

    // Clear form silently
    setFormData({
      username: "",
      phone: "",
      password: "",
      repeatPassword: "",
      email: "",
      adminCode: "",
    });
  };

  return (
    <div className="login-wrap">
      <div className="login-html">
        <div>
          <span
            className={`tab ${isSignIn ? "sign-in-tab" : ""}`}
            onClick={handleSignInClick}
          >
            Sign In
          </span>
          <span
            className={`tab ${!isSignIn ? "sign-in-tab" : ""}`}
            onClick={handleSignUpClick}
          >
            Sign Up
          </span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignIn ? (
            <div className="sign-in-htm">
              <div className="group">
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Admin Code</label>
                <input
                  type="text"
                  className="input"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <input type="submit" className="button" value="Sign In" />
              </div>
            </div>
          ) : (
            <div className="sign-up-htm">
              <div className="group">
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Phone No</label>
                <input
                  type="number"
                  className="input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Repeat Password</label>
                <input
                  type="password"
                  className="input"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="label">Admin Code</label>
                <input
                  type="text"
                  className="input"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <input type="submit" className="button" value="Sign Up" />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
