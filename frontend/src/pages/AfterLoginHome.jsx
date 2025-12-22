import React from "react";
import "./HomePage.css"; 
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  
  const navigate = useNavigate();
  const joinqueue = () =>{
    console.log("join queue button");
    navigate("/afterhomelogin")
  }

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
         
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Smart Crowd & Queue Management</h2>
        <p>Join queues digitally, reduce waiting stress, and stay updated in real-time.</p>
        <button className="btn btn-login" onClick={joinqueue}>join now</button>
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

      </section>

      {/* Footer */}
      <footer className="footer">
        © 2025 QueueManager. All rights reserved.
      </footer>

    </div>
  );
}
