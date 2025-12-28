import React, { useEffect, useState } from "react";
import axios from "axios";

import "./userJoin.css"
import { useNavigate } from "react-router-dom";

const JoinQueuePage = () => {
    const [user, setUser] = useState({ name: "", phone: "" });
    const [queues, setQueues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000/user/profile")
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Error fetching user:", err));

        axios
            .get("http://localhost:5000/queue")
            .then((res) => setQueues(res.data))
            .catch((err) => console.error("Error fetching queues:", err));
    }, []);
    const navigate = useNavigate();

const handleJoinQueue = (queue) => {
    console.log("clicked on join queue");

    navigate("/queuepos", {
        state: {
            user,
            queue,
            position: queue.users?.length + 1 || 1,
            estimatedTime: (queue.users?.length + 1) * (queue.avgTimePerPerson || 1),
        },
    });
};



    return (
        <>
            <div className="join-queue-page">
                {/* Left Column */}
                <div className="left-column">
                    <div className="profile-card">
                        <h2>User Profile</h2>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Gmail:</strong> {user.email}</p>
                    </div>
                </div>

                {/* Center Column */}
                <div className="right-column">
                    <div className="queue-search">
                        <input
                            type="text"
                            placeholder="Search Queue by Name or ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

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
                                        <p><strong>Estimated Time:</strong> {queue.avgTimePerPerson || 0} mins</p>
                                    </div>
                                    <button className="join-btn" onClick={() => handleJoinQueue(queue)}>

                                        Join Queue
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* ✅ Chatbot FLOATING (moved outside layout) */}
            <div className="chatbot">
                <h4>Support Bot</h4>
                <div className="chat-messages">
                    <p>Hello! How can I help you with queues today?</p>
                </div>
                <input type="text" placeholder="Type your message..." />
                <button className="send-btn">Send</button>
            </div>
        </>
    );
};

export default JoinQueuePage;
