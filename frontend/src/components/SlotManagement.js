import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI } from '../services/api';
import './SlotManagement.css';

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  
  // Single slot creation
  const [singleSlot, setSingleSlot] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  // Bulk slot creation
  const [bulkSlots, setBulkSlots] = useState({
    startDate: '',
    endDate: '',
    excludeWeekends: true,
    timeSlots: [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' },
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
    ]
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await slotsAPI.getAll({});
      setSlots(response.data.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSingleSlot = async (e) => {
    e.preventDefault();
    try {
      await slotsAPI.create(singleSlot);
      toast.success('Slot created successfully');
      setSingleSlot({ date: '', startTime: '', endTime: '' });
      fetchSlots();
    } catch (error) {
      console.error('Error creating slot:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create slot';
      toast.error(errorMessage);
    }
  };

  const handleCreateBulkSlots = async (e) => {
    e.preventDefault();
    try {
      const response = await slotsAPI.createBulk(bulkSlots);
      toast.success(response.data.message);
      setShowBulkCreate(false);
      fetchSlots();
    } catch (error) {
      console.error('Error creating bulk slots:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create bulk slots';
      toast.error(errorMessage);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await slotsAPI.delete(slotId);
        toast.success('Slot deleted successfully');
        fetchSlots();
      } catch (error) {
        console.error('Error deleting slot:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete slot';
        toast.error(errorMessage);
      }
    }
  };

  const addTimeSlot = () => {
    setBulkSlots({
      ...bulkSlots,
      timeSlots: [...bulkSlots.timeSlots, { startTime: '', endTime: '' }]
    });
  };

  const removeTimeSlot = (index) => {
    const newTimeSlots = bulkSlots.timeSlots.filter((_, i) => i !== index);
    setBulkSlots({ ...bulkSlots, timeSlots: newTimeSlots });
  };

  const updateTimeSlot = (index, field, value) => {
    const newTimeSlots = [...bulkSlots.timeSlots];
    newTimeSlots[index][field] = value;
    setBulkSlots({ ...bulkSlots, timeSlots: newTimeSlots });
  };

  return (
    <div className="slot-management">
      <h2>⚙️ Manage Available Slots</h2>
      <p className="subtitle">Create and manage appointment time slots</p>

      <div className="creation-options">
        <button
          className={`btn ${!showBulkCreate ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowBulkCreate(false)}
        >
          Single Slot
        </button>
        <button
          className={`btn ${showBulkCreate ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowBulkCreate(true)}
        >
          Bulk Create
        </button>
      </div>

      {!showBulkCreate ? (
        <div className="create-slot-form">
          <h3>Create Single Slot</h3>
          <form onSubmit={handleCreateSingleSlot}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={singleSlot.date}
                  onChange={(e) => setSingleSlot({ ...singleSlot, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  value={singleSlot.startTime}
                  onChange={(e) => setSingleSlot({ ...singleSlot, startTime: e.target.value })}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  value={singleSlot.endTime}
                  onChange={(e) => setSingleSlot({ ...singleSlot, endTime: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-create">
              ✓ Create Slot
            </button>
          </form>
        </div>
      ) : (
        <div className="bulk-create-form">
          <h3>Bulk Create Slots</h3>
          <form onSubmit={handleCreateBulkSlots}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={bulkSlots.startDate}
                  onChange={(e) => setBulkSlots({ ...bulkSlots, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={bulkSlots.endDate}
                  onChange={(e) => setBulkSlots({ ...bulkSlots, endDate: e.target.value })}
                  min={bulkSlots.startDate || new Date().toISOString().split('T')[0]}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={bulkSlots.excludeWeekends}
                  onChange={(e) => setBulkSlots({ ...bulkSlots, excludeWeekends: e.target.checked })}
                />
                <span>Exclude Weekends</span>
              </label>
            </div>

            <div className="time-slots-section">
              <h4>Daily Time Slots</h4>
              {bulkSlots.timeSlots.map((slot, index) => (
                <div key={index} className="time-slot-row">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                    required
                    className="form-control"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                    required
                    className="form-control"
                  />
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="btn btn-remove"
                    disabled={bulkSlots.timeSlots.length === 1}
                  >
                    ✗
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTimeSlot} className="btn btn-add">
                + Add Time Slot
              </button>
            </div>

            <button type="submit" className="btn btn-create">
              ✓ Create Bulk Slots
            </button>
          </form>
        </div>
      )}

      <div className="slots-list">
        <div className="list-header">
          <h3>Existing Slots</h3>
          <button onClick={fetchSlots} className="btn btn-refresh">
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading slots...</div>
        ) : slots.length === 0 ? (
          <div className="no-slots">
            <p>No slots created yet</p>
            <small>Create your first slot above</small>
          </div>
        ) : (
          <div className="slots-table-container">
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot._id} className={slot.isBooked ? 'booked' : ''}>
                    <td>{new Date(slot.date).toLocaleDateString()}</td>
                    <td>{slot.startTime}</td>
                    <td>{slot.endTime}</td>
                    <td>
                      <span className={`status-badge ${slot.isBooked ? 'booked' : 'available'}`}>
                        {slot.isBooked ? '🔒 Booked' : '✓ Available'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="btn btn-delete-small"
                        disabled={slot.isBooked}
                        title={slot.isBooked ? 'Cannot delete booked slot' : 'Delete slot'}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotManagement;

