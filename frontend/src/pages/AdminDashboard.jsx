import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [newQueue, setNewQueue] = useState({
    organisationName: '',
    locationName: '',
    pinCode: '',
    avgTimePerPerson: 5,
    purpose: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const backendURL = 'http://localhost:5000/queue';

  // Fetch all queues from backend
  const fetchQueues = async () => {
    try {
      const res = await axios.get(backendURL);
      // res.data should already include users if backend populate('users') is done
      setQueues(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching queues');
    }
  };


  useEffect(() => {
    fetchQueues();
  }, []);

  // Filter queues for search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredQueues(queues);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredQueues(
      queues.filter(
        (q) =>
          q.organisationName.toLowerCase().includes(term) ||
          q.locationName.toLowerCase().includes(term) ||
          q.pinCode.toString().includes(term)
      )
    );
  }, [searchTerm, queues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQueue((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQueue = async (e) => {
    e.preventDefault();
    if (!newQueue.organisationName.trim() || !newQueue.locationName.trim() || !newQueue.pinCode || !newQueue.purpose.trim()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await axios.post(backendURL, newQueue);
      setQueues((prev) => [...prev, res.data]);
      setNewQueue({ organisationName: '', locationName: '', pinCode: '', avgTimePerPerson: 5, purpose: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating queue');
    }
  };

  const handleEditAvgTime = async (queueId, newTime) => {
    const time = parseInt(newTime);
    if (isNaN(time) || time < 1 || time > 60) {
      alert('Time must be 1-60 minutes');
      return;
    }

    try {
      const res = await axios.put(`${backendURL}/${queueId}/avgTime`, { avgTimePerPerson: time });
      setQueues((prev) => prev.map((q) => (q._id === queueId ? res.data : q)));
    } catch (err) {
      console.error(err);
      alert('Error updating average time');
    }
  };

  const handleDelete = async (queueId) => {
    if (!window.confirm('Are you sure you want to delete this queue?')) return;

    try {
      await axios.delete(`${backendURL}/${queueId}`);
      setQueues((prev) => prev.filter((q) => q._id !== queueId));
    } catch (err) {
      console.error(err);
      alert('Error deleting queue');
    }
  };

  const handleViewQueue = async (queueId) => {
    try {
      const res = await axios.get(`${backendURL}/${queueId}/users`);
      if (res.data.length === 0) {
        alert('No users joined yet');
      } else {
        const usersList = res.data.map((u) => `${u.name} - ${u.phone}`).join('\n');
        alert(`Users joined:\n${usersList}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching users');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Queue Control System – Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        {/* Create Queue */}
        <section className="create-queue-section">
          <h2>Create New Queue</h2>
          <form className="queue-form" onSubmit={handleCreateQueue}>
            <div className="form-row">
              <div className="form-group">
                <label>Organisation Name *</label>
                <input type="text" name="organisationName" value={newQueue.organisationName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Location Name *</label>
                <input type="text" name="locationName" value={newQueue.locationName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pin Code *</label>
                <input type="number" name="pinCode" value={newQueue.pinCode} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Avg. Time Per Person *</label>
                <input type="number" name="avgTimePerPerson" value={newQueue.avgTimePerPerson} onChange={handleInputChange} min="1" max="60" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Purpose *</label>
                <input type="text"
                  name="purpose"
                  value={newQueue.purpose}
                  onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row center-btn">
              <button type="submit">Create Queue</button>
            </div>
          </form>
        </section>

        {/* Search */}
        <section className="search-queues-section">
          <h2>Search Queues</h2>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <p>{filteredQueues.length} queue{filteredQueues.length !== 1 ? 's' : ''} found</p>
        </section>

        {/* Queues Table */}
        <section className="available-queues-section">
          <h2>Available Queues</h2>
          {filteredQueues.length === 0 ? (
            <p>No queues found</p>
          ) : (
            <table className="queues-table">
              <thead>
                <tr>
                  <th>Queue Code</th> {/* moved first */}
                  <th>Organisation Name</th>
                  <th>Location Name</th>
                  <th>Pin Code</th>
                  <th>Avg. Time (min)</th>
                  <th>Purpose</th>
                  <th>Users Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueues.map(queue => (
                  <tr key={queue._id}>
                    <td>{queue.queueCode}</td> {/* display queueCode first */}
                    <td>{queue.organisationName}</td>
                    <td>{queue.locationName}</td>
                    <td>{queue.pinCode}</td>
                    <td>
                      <input
                        type="number"
                        value={queue.avgTimePerPerson}
                        onChange={(e) => handleEditAvgTime(queue._id, e.target.value)}
                        min="1"
                        max="60"
                      />
                    </td>
                    <td>{queue.purpose}</td>
                    <td>{queue.users ? queue.users.length : 0}</td>
                    <td>
                      <button className='view-btn' onClick={() => handleViewQueue(queue._id)}>View Queue</button>
                      <button className='delete-btn' onClick={() => handleDelete(queue._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>


            </table>
          )}
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>Queue Control System v1.0 • Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
