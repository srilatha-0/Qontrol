import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ViewQueue.css";

const ViewQueue = () => {
  const { queueId } = useParams();
  const [queueUsers, setQueueUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueueUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user-join/admin/queue/${queueId}/users`
      );
      setQueueUsers(res.data);
    } catch (err) {
      console.error("Error fetching queue users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queueId) fetchQueueUsers();
  }, [queueId]);

  const handleComplete = async (entryId) => {
    try {
      await axios.delete(
        `http://localhost:5000/user-join/admin/queue/${queueId}/remove/${entryId}`
      );
      fetchQueueUsers();
    } catch (err) {
      console.error("Error completing queue user", err);
    }
  };

  if (loading) return <p>Loading queue...</p>;

  return (
    <div className="view-queue-container">
      <h2>People in Queue</h2>

      {queueUsers.length === 0 ? (
        <p className="empty">No people in queue</p>
      ) : (
        <div className="queue-table">
          {queueUsers.map(({ position, user }) => (
            <div key={user._id} className="queue-row">
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>

              <div className="position">#{position}</div>

              <button
                className="complete-btn"
                onClick={() => handleComplete(user._id)}
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
