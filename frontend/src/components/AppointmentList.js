import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { appointmentsAPI } from '../services/api';
import './AppointmentList.css';

const AppointmentList = ({ onUpdate }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, [filterEmail, filterStatus]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterEmail) params.email = filterEmail;
      if (filterStatus) params.status = filterStatus;

      const response = await appointmentsAPI.getAll(params);
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment._id);
    setUpdateData({
      userEmail: appointment.userEmail,
      appointmentDate: new Date(appointment.appointmentDate).toISOString().split('T')[0],
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      note: appointment.note || '',
      status: appointment.status
    });
  };

  const handleUpdate = async (appointmentId) => {
    try {
      await appointmentsAPI.update(appointmentId, updateData);
      toast.success('Appointment updated successfully');
      setEditingAppointment(null);
      fetchAppointments();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update appointment';
      toast.error(errorMessage);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsAPI.update(appointmentId, { status: 'cancelled' });
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        await appointmentsAPI.delete(appointmentId);
        toast.success('Appointment deleted successfully');
        fetchAppointments();
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      rescheduled: 'status-rescheduled'
    };
    return classes[status] || '';
  };

  return (
    <div className="appointment-list">
      <h2>📋 My Appointments</h2>
      <p className="subtitle">View and manage your scheduled appointments</p>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="filter-email">Filter by Email</label>
          <input
            type="email"
            id="filter-email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="Enter email to filter"
            className="form-control"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-status">Filter by Status</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-control"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>

        <button onClick={fetchAppointments} className="btn btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="no-appointments">
          <p>No appointments found</p>
          <small>Book your first appointment in the "Book Appointment" tab</small>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              {editingAppointment === appointment._id ? (
                <div className="edit-form">
                  <h3>Edit Appointment</h3>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={updateData.userEmail}
                      onChange={(e) => setUpdateData({ ...updateData, userEmail: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={updateData.appointmentDate}
                      onChange={(e) => setUpdateData({ ...updateData, appointmentDate: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={updateData.startTime}
                        onChange={(e) => setUpdateData({ ...updateData, startTime: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={updateData.endTime}
                        onChange={(e) => setUpdateData({ ...updateData, endTime: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={updateData.status}
                      onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                      className="form-control"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={updateData.note}
                      onChange={(e) => setUpdateData({ ...updateData, note: e.target.value })}
                      className="form-control"
                      rows="3"
                    />
                  </div>

                  <div className="action-buttons">
                    <button
                      onClick={() => handleUpdate(appointment._id)}
                      className="btn btn-save"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={() => setEditingAppointment(null)}
                      className="btn btn-cancel"
                    >
                      ✗ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="appointment-header">
                    <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="appointment-body">
                    <p className="appointment-email">
                      <strong>📧</strong> {appointment.userEmail}
                    </p>
                    <p className="appointment-date">
                      <strong>📅</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                    <p className="appointment-time">
                      <strong>🕐</strong> {appointment.startTime} - {appointment.endTime}
                    </p>
                    {appointment.note && (
                      <p className="appointment-note">
                        <strong>📝</strong> {appointment.note}
                      </p>
                    )}
                    <p className="appointment-created">
                      <small>Created: {new Date(appointment.createdAt).toLocaleString()}</small>
                    </p>
                  </div>

                  <div className="appointment-actions">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="btn btn-edit"
                      disabled={appointment.status === 'cancelled'}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="btn btn-cancel"
                      disabled={appointment.status === 'cancelled'}
                    >
                      ✗ Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                      className="btn btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;

