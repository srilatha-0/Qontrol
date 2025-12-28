import React, { useState } from "react";
import "./ViewQueue.css";

const ViewQueue = () => {
    const [queueUsers, setQueueUsers] = useState([
        { id: 1, name: "Srilatha", phone: "9392848370", position: 1 },
        { id: 2, name: "Anusha", phone: "9876543210", position: 2 },
        { id: 3, name: "Ravi", phone: "9123456789", position: 3 },
        { id: 4, name: "Kiran", phone: "9988776655", position: 4 },
    ]);

    const handleComplete = (id) => {
        const updatedQueue = queueUsers
            .filter(user => user.id !== id)
            .map((user, index) => ({
                ...user,
                position: index + 1,
            }));

        setQueueUsers(updatedQueue);
    };

    return (
        <div className="view-queue-container">
            <h2>People in Queue</h2>

            {queueUsers.length === 0 ? (
                <p className="empty">No people in queue</p>
            ) : (
                <div className="queue-table">
                    {queueUsers.map(user => (
                        <div key={user.id} className="queue-row">
                            <div>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                            </div>

                            <div className="position">
                                #{user.position}
                            </div>

                            <button
                                className="complete-btn"
                                onClick={() => handleComplete(user.id)}
                            >
                                Complete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewQueue;
