import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./QueuePos.css";

const QueuePos = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [queueData, setQueueData] = useState(null);

  // Extract values safely
  const entry = state?.entry;
  const position = state?.position;
  const estimatedTime = state?.estimatedTime;
  const queue = state?.queue;

  // ✅ Always call useEffect
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        if (!queue && entry?.queue) {
          const res = await axios.get(`http://localhost:5000/queue/${entry.queue}`);
          setQueueData(res.data);
        } else if (queue) {
          setQueueData(queue);
        }
      } catch (err) {
        console.error("Error fetching queue details:", err);
      }
    };

    fetchQueue();
  }, [queue, entry]);

  // Early return for missing state
  if (!entry) {
    return <h2>No queue data found</h2>;
  }

  if (!queueData) {
    return <p>Loading queue details...</p>;
  }

  return (
    <div className="queue-pos-container">
      <div className="queue-pos-card">
        <h2>Queue Position</h2>

        <p><strong>Name:</strong> {entry.name}</p>
        <p><strong>Phone:</strong> {entry.phone}</p>

        <hr />

        <p><strong>Organisation:</strong> {queueData.organisationName || "N/A"}</p>
        <p><strong>Purpose:</strong> {queueData.purpose || "N/A"}</p>

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
