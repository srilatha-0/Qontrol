import React from "react";
import "./HomePage.css"; 
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  
  const navigate = useNavigate();
  const UserLogin = () => {
    console.log("user login works");
    navigate("/userregister");
  };

  const AdminLogin = () => {
    console.log("admin login works");
    navigate("/AdminAuth");
  };

  return (
    <div>

      {/* Header */}
      <header className="header">
        <h1>QueueManager</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>Features</li>
            <li>Dashboard</li>
            <li>Contact</li>
          </ul>
          <div className="auth-buttons">
            <button className="btn btn-login" onClick={UserLogin}>User Login</button>
            <button className="btn btn-register" onClick={AdminLogin}>Admin Login</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Smart Crowd & Queue Management</h2>
        <p>Join queues digitally, reduce waiting stress, and stay updated in real-time.</p>
        
        {/* Replace <a> inside button */}
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>📱 Easy Queue Join</h3>
          <p>Scan a QR or click a button to join without hassle.</p>
        </div>

        <div className="feature-card">
          <h3>⏱ Live Updates</h3>
          <p>Know your exact wait time and position in line.</p>
        </div>

        <div className="feature-card">
          <h3>📊 Manager Dashboard</h3>
          <p>Track performance, reduce delays, and plan better staffing.</p>
        </div>

        {/* <div className="feature-card">
          <h3>🔔 Notifications</h3>
          <p>Get SMS or push alerts when your turn is near.</p>
        </div> */}
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2025 QueueManager. All rights reserved.
      </footer>

    </div>
  );
}
