import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ViewQueue.css";

const ViewQueue = () => {
    const { queueId } = useParams();
    const [queueUsers, setQueueUsers] = useState([]);

    const fetchQueueUsers = useCallback(async () => {
        const res = await axios.get(
            `http://localhost:5000/queue-pos/admin/queue/${queueId}/users`
        );
        setQueueUsers(res.data);
    }, [queueId]);

    useEffect(() => {
        fetchQueueUsers();
    }, [fetchQueueUsers]);

    const handleComplete = async (entryId) => {
        await axios.delete(
            `http://localhost:5000/queue-pos/admin/queue/${queueId}/remove/${entryId}`
        );
        fetchQueueUsers();
    };

    return (
        <div className="view-queue-container">
            <h2>People in Queue</h2>

            {queueUsers.length === 0 ? (
                <p className="empty">No people in queue</p>
            ) : (
                <div className="queue-table">
                    {queueUsers.map(({ position, entry }) => (
                        <div key={entry._id} className="queue-row">
                            <div>
                                <p><strong>Name:</strong> {entry.name}</p>
                                <p><strong>Phone:</strong> {entry.phone}</p>
                            </div>

                            <div className="position">#{position}</div>

                            <button
                                className="complete-btn"
                                onClick={() => handleComplete(entry._id)}
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
