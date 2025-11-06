import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI, appointmentsAPI } from '../services/api';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'list'

  // Form states
  const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '' });
  const [bookingForm, setBookingForm] = useState({ email: '', note: '' });
  const [bulkSlotForm, setBulkSlotForm] = useState({
    startDate: '',
    endDate: '',
    excludeWeekends: true,
    times: ['09:00-09:30', '10:00-10:30', '11:00-11:30', '14:00-14:30', '15:00-15:30', '16:00-16:30']
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const fetchData = async () => {
    try {
      const [slotsRes, appointmentsRes] = await Promise.all([
        slotsAPI.getAll({}),
        appointmentsAPI.getAll({})
      ]);
      setSlots(slotsRes.data.data);
      setAppointments(appointmentsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
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
      (new Date(apt.appointmentDate).toISOString().split('T')[0] === new Date(slot.date).toISOString().split('T')[0] &&
       apt.startTime === slot.startTime &&
       apt.status !== 'cancelled')
    );
  };

  const getKPIs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekStart = getWeekStart(new Date());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const activeAppointments = appointments.filter(a => a.status !== 'cancelled');
    const todayAppointments = activeAppointments.filter(a => {
      const aptDate = new Date(a.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });
    
    const weekAppointments = activeAppointments.filter(a => {
      const aptDate = new Date(a.appointmentDate);
      return aptDate >= weekStart && aptDate < weekEnd;
    });

    const totalSlots = slots.length;
    const bookedSlots = slots.filter(s => s.isBooked).length;
    const utilizationRate = totalSlots > 0 ? ((bookedSlots / totalSlots) * 100).toFixed(1) : 0;

    return {
      todayAppointments: todayAppointments.length,
      weekAppointments: weekAppointments.length,
      totalAppointments: activeAppointments.length,
      availableSlots: totalSlots - bookedSlots,
      utilizationRate: utilizationRate
    };
  };

  const handleSlotClick = (slot) => {
    const appointment = getAppointmentForSlot(slot);
    
    if (slot.isBooked && appointment) {
      setSelectedAppointment(appointment);
      setSelectedSlot(null);
    } else if (!slot.isBooked) {
      setSelectedSlot(slot);
      setSelectedAppointment(null);
      setShowBooking(true);
      setBookingForm({ email: '', note: '' });
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await slotsAPI.create(slotForm);
      toast.success('Slot created');
      setSlotForm({ date: '', startTime: '', endTime: '' });
      setShowCreateSlot(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentsAPI.create({
        userEmail: bookingForm.email,
        appointmentDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        note: bookingForm.note
      });
      toast.success('Appointment booked');
      setShowBooking(false);
      setBookingForm({ email: '', note: '' });
      setSelectedSlot(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book');
    }
  };

  const handleCancelAppointment = async () => {
    if (window.confirm('Cancel this appointment?')) {
      try {
        await appointmentsAPI.update(selectedAppointment._id, { status: 'cancelled' });
        toast.success('Appointment cancelled');
        setSelectedAppointment(null);
        fetchData();
      } catch (error) {
        toast.error('Failed to cancel');
      }
    }
  };

  const handleBulkCreateSlots = async (e) => {
    e.preventDefault();
    try {
      const timeSlots = bulkSlotForm.times.map(t => {
        const [start, end] = t.split('-');
        return { startTime: start, endTime: end };
      });

      await slotsAPI.createBulk({
        startDate: bulkSlotForm.startDate,
        endDate: bulkSlotForm.endDate,
        excludeWeekends: bulkSlotForm.excludeWeekends,
        timeSlots: timeSlots
      });
      
      toast.success('Bulk slots created');
      setShowCreateSlot(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create slots');
    }
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const weekDays = getWeekDays();
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
                     '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  const kpis = getKPIs();

  if (loading) {
    return <div className="doctor-dashboard loading">Loading...</div>;
  }

  return (
    <div className="doctor-dashboard">
      {/* KPI Section */}
      <div className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-label">Today</div>
          <div className="kpi-value">{kpis.todayAppointments}</div>
          <div className="kpi-sublabel">Appointments</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">This Week</div>
          <div className="kpi-value">{kpis.weekAppointments}</div>
          <div className="kpi-sublabel">Scheduled</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Available Slots</div>
          <div className="kpi-value">{kpis.availableSlots}</div>
          <div className="kpi-sublabel">Open</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Utilization</div>
          <div className="kpi-value">{kpis.utilizationRate}%</div>
          <div className="kpi-sublabel">Booking Rate</div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <div className="controls-left">
          <button onClick={previousWeek} className="control-btn">← Previous Week</button>
          <button onClick={goToToday} className="control-btn primary">Today</button>
          <button onClick={nextWeek} className="control-btn">Next Week →</button>
        </div>
        <div className="controls-right">
          <button onClick={() => setShowCreateSlot(true)} className="control-btn">Create Slots</button>
          <button onClick={fetchData} className="control-btn">Refresh</button>
        </div>
      </div>

      {/* Week Info */}
      <div className="week-banner">
        Week of {currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
        {' '}{new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-grid">
          <div className="time-col header">Time</div>
          {weekDays.map((date, idx) => (
            <div key={idx} className={`day-header ${isPast(date) ? 'past' : ''}`}>
              <div className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="day-date">{date.getDate()}</div>
            </div>
          ))}

          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="time-col">{time}</div>
              {weekDays.map((date, dayIdx) => {
                const daySlots = getSlotsForDate(date);
                const slot = daySlots.find(s => s.startTime === time);
                const appointment = slot ? getAppointmentForSlot(slot) : null;
                const past = isPast(date);

                return (
                  <div
                    key={`${dayIdx}-${time}`}
                    className={`calendar-slot ${slot ? (slot.isBooked ? 'booked' : 'available') : 'empty'} ${past ? 'past' : ''}`}
                    onClick={() => slot && !past && handleSlotClick(slot)}
                  >
                    {slot && slot.isBooked && appointment ? (
                      <div className="slot-booked-content">
                        <div className="patient-email">{appointment.userEmail.split('@')[0]}</div>
                      </div>
                    ) : slot && !slot.isBooked ? (
                      <div className="slot-available-text">Open</div>
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Appointment List View */}
      <div className="appointments-section">
        <h3>Upcoming Appointments ({appointments.filter(a => a.status !== 'cancelled' && new Date(a.appointmentDate) >= new Date()).length})</h3>
        <div className="appointments-list">
          {appointments
            .filter(apt => apt.status !== 'cancelled' && new Date(apt.appointmentDate) >= new Date())
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
            .slice(0, 5)
            .map(apt => (
              <div key={apt._id} className="appointment-item" onClick={() => setSelectedAppointment(apt)}>
                <div className="apt-time-col">
                  <div className="apt-date">{new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="apt-time">{apt.startTime}</div>
                </div>
                <div className="apt-details">
                  <div className="apt-patient">{apt.userEmail}</div>
                  <div className="apt-note">{apt.note || 'No notes'}</div>
                </div>
                <div className="apt-status">
                  <span className={`badge ${apt.status}`}>{apt.status}</span>
                </div>
              </div>
            ))}
          {appointments.filter(a => a.status !== 'cancelled' && new Date(a.appointmentDate) >= new Date()).length === 0 && (
            <div className="empty-appointments">No upcoming appointments</div>
          )}
        </div>
      </div>

      {/* Appointment Details Sidebar */}
      {selectedAppointment && (
        <div className="sidebar-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="details-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} className="close-btn">×</button>
            </div>
            <div className="sidebar-body">
              <div className="detail-section">
                <label>Patient Email</label>
                <div className="detail-value">{selectedAppointment.userEmail}</div>
              </div>
              <div className="detail-section">
                <label>Date & Time</label>
                <div className="detail-value">
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                  <br />
                  {selectedAppointment.startTime} - {selectedAppointment.endTime}
                </div>
              </div>
              {selectedAppointment.note && (
                <div className="detail-section">
                  <label>Notes</label>
                  <div className="detail-value">{selectedAppointment.note}</div>
                </div>
              )}
              {selectedAppointment.googleMeetLink && (
                <div className="detail-section">
                  <label>Video Call</label>
                  <a href={selectedAppointment.googleMeetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                    Join Google Meet →
                  </a>
                </div>
              )}
              <div className="detail-section">
                <label>Status</label>
                <span className={`badge ${selectedAppointment.status}`}>{selectedAppointment.status}</span>
              </div>
              <div className="detail-section">
                <label>Created</label>
                <div className="detail-value text-sm">{new Date(selectedAppointment.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="sidebar-footer">
              <button onClick={handleCancelAppointment} className="action-btn danger">Cancel Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedSlot && (
        <div className="modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Appointment</h3>
              <button onClick={() => setShowBooking(false)} className="close-btn">×</button>
            </div>
            <div className="time-display">
              {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              <br />
              <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
            </div>
            <form onSubmit={handleBookAppointment} className="modal-form">
              <div className="field">
                <label>Patient Email *</label>
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="patient@example.com"
                  required
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Appointment Note</label>
                <textarea
                  value={bookingForm.note}
                  onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                  placeholder="Reason for visit, symptoms, etc."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBooking(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Slot Modal */}
      {showCreateSlot && (
        <div className="modal-overlay" onClick={() => setShowCreateSlot(false)}>
          <div className="modal-box large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Availability Slots</h3>
              <button onClick={() => setShowCreateSlot(false)} className="close-btn">×</button>
            </div>
            
            <div className="modal-tabs">
              <button className="tab active">Bulk Create</button>
            </div>

            <form onSubmit={handleBulkCreateSlots} className="modal-form">
              <div className="field-row">
                <div className="field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={bulkSlotForm.startDate}
                    onChange={(e) => setBulkSlotForm({ ...bulkSlotForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={bulkSlotForm.endDate}
                    onChange={(e) => setBulkSlotForm({ ...bulkSlotForm, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={bulkSlotForm.excludeWeekends}
                    onChange={(e) => setBulkSlotForm({ ...bulkSlotForm, excludeWeekends: e.target.checked })}
                  />
                  <span>Exclude weekends</span>
                </label>
              </div>

              <div className="field">
                <label>Daily Time Slots</label>
                <div className="time-slots-list">
                  {bulkSlotForm.times.map((time, idx) => (
                    <div key={idx} className="time-slot-item">
                      {time}
                    </div>
                  ))}
                </div>
                <p className="field-help">Standard 30-minute slots from 9 AM to 5 PM</p>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateSlot(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Slots</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;

