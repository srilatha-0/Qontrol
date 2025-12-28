import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QueuePos.css";  // ✅ Corrected import

const QueuePos = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return <h2>No queue data found</h2>;
    }

    const { user, queue, position, estimatedTime } = state;

    return (
        <div className="queue-pos-container">
            <div className="queue-pos-card">
                <h2>Queue Position</h2>

                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phone}</p>

                <hr />

                <p><strong>Organisation:</strong> {queue.organisationName}</p>
                <p><strong>Purpose:</strong> {queue.purpose}</p>

                <h3>Your Position: {position}</h3>
                <h3>Estimated Time: {estimatedTime} mins</h3>

                <button onClick={() => navigate("/userjoin")}>
                    Back to Queues
                </button>
            </div>
        </div>
    );
};

export default QueuePos;
