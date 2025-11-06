import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI, appointmentsAPI } from '../services/api';
import './SimpleSlotManager.css';

const SimpleSlotManager = () => {
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [selectedDate]);

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slotsRes, appointmentsRes] = await Promise.all([
        slotsAPI.getAll({}),
        appointmentsAPI.getAll({})
      ]);
      setSlots(slotsRes.data.data);
      setAppointments(appointmentsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getSlotsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === dateStr;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getAppointmentForSlot = (slot) => {
    if (!slot.isBooked) return null;
    return appointments.find(apt => 
      apt._id === slot.appointmentId || 
      (new Date(apt.appointmentDate).toISOString().split('T')[0] === new Date(slot.date).toISOString().split('T')[0] &&
       apt.startTime === slot.startTime)
    );
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySlots = slots.filter(s => new Date(s.date).toISOString().split('T')[0] === today);
    const todayAppointments = appointments.filter(a => 
      new Date(a.appointmentDate).toISOString().split('T')[0] === today && 
      a.status !== 'cancelled'
    );
    
    return {
      totalSlots: slots.length,
      availableSlots: slots.filter(s => !s.isBooked).length,
      todaySlots: todaySlots.length,
      todayBooked: todaySlots.filter(s => s.isBooked).length,
      totalAppointments: appointments.filter(a => a.status !== 'cancelled').length,
      todayAppointments: todayAppointments.length
    };
  };

  const stats = getStats();
  const weekDays = getNext7Days();

  if (loading) {
    return <div className="simple-manager loading">Loading...</div>;
  }

  return (
    <div className="simple-manager">
      <div className="manager-header">
        <div className="header-left">
          <h2>Appointment Schedule</h2>
          <p className="last-update">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="header-right">
          <button onClick={fetchData} className="refresh-btn">Refresh</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">Total Slots</div>
          <div className="stat-value">{stats.totalSlots}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Available</div>
          <div className="stat-value">{stats.availableSlots}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Today's Appointments</div>
          <div className="stat-value">{stats.todayAppointments}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Today's Slots</div>
          <div className="stat-value">{stats.todaySlots}</div>
        </div>
      </div>

      {/* Week View */}
      <div className="schedule-container">
        <div className="schedule-header">
          <h3>Weekly Schedule</h3>
        </div>

        <div className="week-grid">
          {weekDays.map((date, index) => {
            const daySlots = getSlotsForDate(date);
            const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
            
            return (
              <div key={index} className={`day-column ${isToday ? 'today' : ''}`}>
                <div className="day-header">
                  <div className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="day-date">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>

                <div className="slots-list">
                  {daySlots.length === 0 ? (
                    <div className="no-slots">No slots</div>
                  ) : (
                    daySlots.map(slot => {
                      const appointment = getAppointmentForSlot(slot);
                      return (
                        <div key={slot._id} className={`slot-item ${slot.isBooked ? 'booked' : 'available'}`}>
                          <div className="slot-time">{slot.startTime}</div>
                          {slot.isBooked && appointment ? (
                            <div className="slot-info">
                              <div className="patient-name">{appointment.userEmail.split('@')[0]}</div>
                              {appointment.note && (
                                <div className="slot-note">{appointment.note.substring(0, 30)}...</div>
                              )}
                            </div>
                          ) : (
                            <div className="slot-status">Available</div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-section">
        <h3>Upcoming Appointments</h3>
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Note</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter(apt => apt.status !== 'cancelled' && new Date(apt.appointmentDate) >= new Date())
                .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                .slice(0, 10)
                .map(apt => (
                  <tr key={apt._id}>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>{apt.startTime}</td>
                    <td>{apt.userEmail}</td>
                    <td>{apt.note || '-'}</td>
                    <td>
                      <span className={`status-badge ${apt.status}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {appointments.filter(apt => apt.status !== 'cancelled').length === 0 && (
            <div className="empty-state">No upcoming appointments</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSlotManager;

