import React, { useEffect, useState } from "react";
import axios from "axios";
import "./userJoin.css";

const JoinQueuePage = () => {
    // User info will be fetched from backend
    const [user, setUser] = useState({ name: "", phone: "" });

    // Queues fetched from backend
    const [queues, setQueues] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ initialize as empty string

    // Fetch user info & queues on component mount
    useEffect(() => {
        // 1️⃣ Fetch logged-in user details
        axios
            .get("http://localhost:5000/user/profile")
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Error fetching user:", err));

        // 2️⃣ Fetch all queues
        axios
            .get("http://localhost:5000/queue")
            .then((res) => setQueues(res.data))
            .catch((err) => console.error("Error fetching queues:", err));
    }, []);

    // Handle user joining a queue
    const handleJoinQueue = (queue) => {
        if (!user.name || !user.phone) {
            alert("User info not loaded yet!");
            return;
        }

        axios
            .post(`http://localhost:5000/user-join/${queue._id}/join`, {
                name: user.name,
                phone: user.phone,
            })
            .then((res) => {
                alert(
                    `You joined queue "${queue.name}". Your position is ${res.data.position}`
                );
                // Refresh queues to update user count
                return axios.get("http://localhost:5000/user-join");
            })
            .then((res) => setQueues(res.data))
            .catch((err) => console.error("Error joining queue:", err));
    };

    return (
        <div className="join-queue-page">
            {/* Left Column: User Profile */}
            <div className="left-column">
                <div className="profile-card">
                    <h2>User Profile</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </div>
            </div>

            {/* Chatbot under profile card */}
            <div className="chatbot">
                <h4>Support Bot</h4>
                <div className="chat-messages">
                    <p>Hello! How can I help you with queues today?</p>
                </div>
                <input type="text" placeholder="Type your message..." />
                <button className="send-btn">Send</button>
            </div>

            {/* Center Column: Queue Section */}
            <div className="right-column">
                {/* Search */}
                <div className="queue-search">
                    <input
                        type="text"
                        placeholder="Search Queue by Name or ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Queue List */}
                <div className="queue-list">
                    {queues
                        .filter(
                            (queue) =>
                                queue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                queue._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                queue.organisationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                queue.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((queue) => (
                            <div key={queue._id} className="queue-card">
                                <div>
                                    <h3>Queue Details</h3>
                                    <p><strong>Organisation:</strong> {queue.organisationName}</p>
                                    <p><strong>Purpose:</strong> {queue.purpose}</p>
                                    <p><strong>People in Queue:</strong> {queue.users?.length || 0}</p>
                                    <p><strong>Estimated Time:</strong> {queue.estimatedTime || 0} mins</p>
                                </div>
                                <button className="join-btn" onClick={() => handleJoinQueue(queue)}>
                                    Join Queue
                                </button>
                            </div>
                        ))}

                </div>
            </div>
        </div>
    );
};

export default JoinQueuePage;
