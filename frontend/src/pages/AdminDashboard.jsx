import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // State for queues
  const [queues, setQueues] = useState([]);
  const [filteredQueues, setFilteredQueues] = useState([]);
  
  // State for new queue form
  const [newQueue, setNewQueue] = useState({
    organisationName: '',
    locationName: '',
    pinCode: '',
    avgTimePerPerson: 5 // Default value
  });
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter queues when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredQueues(queues);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = queues.filter(queue => 
      queue.organisationName.toLowerCase().includes(term) ||
      queue.locationName.toLowerCase().includes(term) ||
      queue.pinCode.toString().includes(term)
    );
    
    setFilteredQueues(filtered);
  }, [searchTerm, queues]);
  
  // Initialize filteredQueues when queues change
  useEffect(() => {
    setFilteredQueues(queues);
  }, [queues]);
  
  // Generate a unique queue ID (backend will handle this in production)
  const generateQueueId = () => {
    return 'Q' + Date.now() + Math.floor(Math.random() * 1000);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQueue(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle creating a new queue
  const handleCreateQueue = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newQueue.organisationName.trim() || !newQueue.locationName.trim() || !newQueue.pinCode) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create new queue object
    const queue = {
      id: generateQueueId(),
      organisationName: newQueue.organisationName.trim(),
      locationName: newQueue.locationName.trim(),
      pinCode: newQueue.pinCode,
      avgTimePerPerson: parseInt(newQueue.avgTimePerPerson) || 5,
      usersJoined: 0,
      createdAt: new Date().toISOString()
    };
    
    // Add to state (in production, this would be an API call)
    setQueues(prev => [...prev, queue]);
    
    // Reset form
    setNewQueue({
      organisationName: '',
      locationName: '',
      pinCode: '',
      avgTimePerPerson: 5
    });
  };
  
  // Handle editing average time per person
  const handleEditAvgTime = (queueId, newTime) => {
    // Validate time
    const time = parseInt(newTime);
    if (isNaN(time) || time < 1 || time > 60) {
      alert('Please enter a valid time between 1 and 60 minutes');
      return;
    }
    
    // Update state (in production, this would be an API call)
    setQueues(prev => prev.map(queue => 
      queue.id === queueId 
        ? { ...queue, avgTimePerPerson: time }
        : queue
    ));
  };
  
  // Handle viewing queue details
  const handleViewQueue = (queueId) => {
    navigate(`/queue/${queueId}`);
  };
  
  // Handle logout
  const handleLogout = () => {
    // In production, this would clear auth tokens and redirect to login
    navigate('/login');
  };
  
  return (
    <div className="admin-dashboard">
      {/* Top Header */}
      <header className="dashboard-header">
        <h1>Queue Control System – Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">
        {/* Create New Queue Section */}
        <section className="create-queue-section">
          <h2>Create New Queue</h2>
          <form onSubmit={handleCreateQueue} className="queue-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organisationName">Organisation Name *</label>
                <input
                  type="text"
                  id="organisationName"
                  name="organisationName"
                  value={newQueue.organisationName}
                  onChange={handleInputChange}
                  placeholder="Enter organisation name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="locationName">Location Name *</label>
                <input
                  type="text"
                  id="locationName"
                  name="locationName"
                  value={newQueue.locationName}
                  onChange={handleInputChange}
                  placeholder="Enter location name"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pinCode">Pin Code *</label>
                <input
                  type="number"
                  id="pinCode"
                  name="pinCode"
                  value={newQueue.pinCode}
                  onChange={handleInputChange}
                  placeholder="Enter pin code"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="avgTimePerPerson">Avg. Time Per Person (minutes) *</label>
                <input
                  type="number"
                  id="avgTimePerPerson"
                  name="avgTimePerPerson"
                  value={newQueue.avgTimePerPerson}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="create-btn">
              Create Queue
            </button>
          </form>
        </section>
        
        {/* Search Queues Section */}
        <section className="search-queues-section">
          <h2>Search Queues</h2>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by organisation name, location, or pin code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-count">
              {filteredQueues.length} queue{filteredQueues.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </section>
        
        {/* Available Queues Section */}
        <section className="available-queues-section">
          <h2>Available Queues</h2>
          
          {filteredQueues.length === 0 ? (
            <div className="no-queues">
              <p>No queues found. Create your first queue above.</p>
            </div>
          ) : (
            <div className="queues-table-container">
              <table className="queues-table">
                <thead>
                  <tr>
                    <th>Queue ID</th>
                    <th>Organisation Name</th>
                    <th>Location Name</th>
                    <th>Pin Code</th>
                    <th>Avg. Time (min)</th>
                    <th>Users Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueues.map(queue => (
                    <tr key={queue.id}>
                      <td className="queue-id">{queue.id}</td>
                      <td>{queue.organisationName}</td>
                      <td>{queue.locationName}</td>
                      <td>{queue.pinCode}</td>
                      <td>
                        <input
                          type="number"
                          className="time-input"
                          value={queue.avgTimePerPerson}
                          onChange={(e) => handleEditAvgTime(queue.id, e.target.value)}
                          min="1"
                          max="60"
                        />
                      </td>
                      <td className="users-count">{queue.usersJoined}</td>
                      <td>
                        <button 
                          className="view-btn"
                          onClick={() => handleViewQueue(queue.id)}
                        >
                          View Queue
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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