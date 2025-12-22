// src/pages/Register.js
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

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/signup", formData);
            alert(res.data.message); // shows "User registered!"
            setFormData({
                username: "",
                phone: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error signing up");
        }
    };

    const handleSubmitSignIn = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/login", {
                username: formData.username,
                password: formData.password,
            });
            navigate("/afterhomelogin");
        } catch (err) {
            console.error(err);
            alert("Invalid username or password");
        }
    };

    return (
        <div
            id="container"
            className={`container ${isSignIn ? "sign-in" : "sign-up"}`}
        >
            <div className="row">
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
                                <b>Forgot password?</b>
                            </p>
                            <p>
                                <span>Don't have an account?</span>
                                <b className="pointer" onClick={handleToggle}>
                                    Sign up here
                                </b>
                            </p>
                            <button
                                type="button"
                                className="admin-btn"
                                onClick={() => (window.location.href = "/admin_reg.html")}
                            >
                                Login / Register as Admin
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="row content-row">
                <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                        <h2>Welcome</h2>
                    </div>
                    <div className="img sign-in"></div>
                </div>

                <div className="col align-items-center flex-col">
                    <div className="img sign-up"></div>
                    <div className="text sign-up">
                        <h2>Join with us</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
