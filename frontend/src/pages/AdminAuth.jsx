import React, { useState } from "react";
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
  const admindash = () =>{
    console.log("admin dashboard after the login worked");
    navigate("/AdminDashBoard");
  }
  const handleSignInClick = () => setIsSignIn(true);
  const handleSignUpClick = () => setIsSignIn(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, phone, password, repeatPassword, email, adminCode } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let messages = [];

    if (username.trim().length < 3) messages.push("Username must be at least 3 characters.");
    if (password.length < 6) messages.push("Password must be at least 6 characters.");
    if (adminCode !== "ADMIN2025") messages.push("Admin Code must be ADMIN2025.")
    if(!isSignIn){
    if (password !== repeatPassword) messages.push("Passwords do not match.");
    if (!emailRegex.test(email)) messages.push("Invalid email address.");
    if (!/^\d{10}$/.test(phone)) messages.push("Phone number must be 10 digits.");
    }
    if (messages.length > 0) {
      alert(messages.join("\n"));
    } else {
      if(isSignIn){
        console.log("admin logged in");
        admindash();
      }
      else{
        alert("admin registered successfully");
      }
      setFormData({
        username: "",
        phone: "",
        password: "",
        repeatPassword: "",
        email: "",
        adminCode: "",
      });
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-html">
        <div>
          <span className={`tab ${isSignIn ? "sign-in-tab" : ""}`} onClick={handleSignInClick}>
            Sign In
          </span>
          <span className={`tab ${!isSignIn ? "sign-in-tab" : ""}`} onClick={handleSignUpClick}>
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
