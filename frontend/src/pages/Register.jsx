// src/pages/Register.jsx
import axios from "axios";
import React, { useState } from "react";
import "./registration.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sign-up submit
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Correct user signup route
      const response = await axios.post(
        "http://localhost:5000/user/signup",
        {
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(response.data.message); // Show only for signup
      setFormData({
        username: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsSignIn(true); // Switch to sign-in after successful registration
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error signing up");
    }
  };

  // Sign-in submit
  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        username: formData.username,
        password: formData.password,
      });

      // Success: navigate silently
      navigate("/afterhomelogin");
    } catch (err) {
      console.error(err);
      // Alert only when credentials are wrong
      alert(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div id="container" className={`container ${isSignIn ? "sign-in" : "sign-up"}`}>
      <div className="row">
        {/* Sign-up form */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <form className="form sign-up" onSubmit={handleSubmitSignUp}>
              <div className="input-group">
                <i className="bx bxs-user"></i>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-phone"></i>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <i className="bx bx-mail-send"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Sign up</button>
              <p>
                <span>Already have an account?</span>
                <b className="pointer" onClick={handleToggle}>
                  Sign in here
                </b>
              </p>
            </form>
          </div>
        </div>

        {/* Sign-in form */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <form className="form sign-in" onSubmit={handleSubmitSignIn}>
              <div className="input-group">
                <i className="bx bxs-user"></i>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Sign in</button>
              <p>
                <span>Don't have an account?</span>
                <b className="pointer" onClick={handleToggle}>
                  Sign up here
                </b>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
