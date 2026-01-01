import React, { useEffect, useState } from "react";
import axios from "axios";
import "./userJoin.css";
import { useNavigate } from "react-router-dom";

const JoinQueuePage = () => {
    const [user, setUser] = useState({ name: "", phone: "" });
    const [queues, setQueues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let currentQueue = null;

        // Fetch user profile first (to get phone)
        axios
            .get("http://localhost:5000/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data);

                // Then fetch current queue using phone
                return axios.get("http://localhost:5000/user-join/current-queue", {
                    params: { phone: res.data.phone },
                });
            })
            .then((res) => {
                if (res.data.inQueue) {
                    currentQueue = res.data; // { queueId, position }
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                // Fetch all queues AFTER currentQueue is known
                axios
                    .get("http://localhost:5000/queue")
                    .then((res) => {
                        const updatedQueues = res.data.map((q) =>
                            currentQueue && q._id === currentQueue.queueId
                                ? { ...q, joined: true, position: currentQueue.position }
                                : q
                        );
                        setQueues(updatedQueues);
                    })
                    .catch((err) => console.error(err));
            });
    }, []);



    const handleJoinQueue = async (queue) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/user-join/queue/${queue._id}/join`,
                {
                    name: user.name,
                    phone: user.phone,
                }
            );

            if (res.data.alreadyInOtherQueue) {
                alert(res.data.message);
                return;
            }

            if (res.data.alreadyInQueue) {
                alert(`You are already in this queue. Your position is ${res.data.position}`);
                return;
            }

            alert(`Joined queue! Your position is ${res.data.position}`);

            // Update queue state with joined info
            setQueues((prev) =>
                prev.map((q) =>
                    q._id === queue._id
                        ? { ...q, joined: true, position: res.data.position }
                        : q
                )
            );
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Unable to join queue. Please try again.");
        }
    };

    return (
        <>
            <div className="join-queue-page">
                <div className="left-column">
                    <div className="profile-card">
                        <h2>User Profile</h2>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Gmail:</strong> {user.email}</p>
                    </div>
                </div>

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
                                    queue.organisationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    queue._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

                                    <button
                                        className={`join-btn ${queue.joined ? "view-btn" : ""}`}
                                        style={{ backgroundColor: queue.joined ? "green" : "#007bff" }}
                                        onClick={() =>
                                            queue.joined
                                                ? navigate("/queuepos", {
                                                    state: {
                                                        entry: { name: user.name, phone: user.phone },
                                                        position: queue.position,
                                                        queue,
                                                    },
                                                })
                                                : handleJoinQueue(queue)
                                        }
                                    >
                                        {queue.joined ? "View Position" : "Join Queue"}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

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
