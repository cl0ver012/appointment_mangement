import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI, appointmentsAPI } from '../services/api';
import './CalendlyStyle.css';

const CalendlyStyle = () => {
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ email: '', note: '' });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
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
      console.error('Error fetching data:', error);
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
      apt._id === slot.appointmentId || 
      (new Date(apt.appointmentDate).toISOString().split('T')[0] === new Date(slot.date).toISOString().split('T')[0] &&
       apt.startTime === slot.startTime &&
       apt.status !== 'cancelled')
    );
  };

  const handleSlotClick = (slot) => {
    const appointment = getAppointmentForSlot(slot);
    
    if (slot.isBooked && appointment) {
      setSelectedAppointment(appointment);
      setSelectedSlot(null);
    } else if (!slot.isBooked) {
      setSelectedSlot(slot);
      setSelectedAppointment(null);
      setShowBookingForm(true);
      setBookingData({ 
        email: '', 
        note: '',
        date: new Date(slot.date).toISOString().split('T')[0],
        time: slot.startTime
      });
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const endTime = calculateEndTime(selectedSlot.startTime);
      await appointmentsAPI.create({
        userEmail: bookingData.email,
        appointmentDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: endTime,
        note: bookingData.note
      });
      toast.success('Appointment booked successfully');
      setShowBookingForm(false);
      setSelectedSlot(null);
      setBookingData({ email: '', note: '' });
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

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':');
    const endMinutes = parseInt(minutes) + 30;
    if (endMinutes >= 60) {
      return `${String(parseInt(hours) + 1).padStart(2, '0')}:${String(endMinutes - 60).padStart(2, '0')}`;
    }
    return `${hours}:${String(endMinutes).padStart(2, '0')}`;
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
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  if (loading) {
    return <div className="calendly-style loading">Loading...</div>;
  }

  return (
    <div className="calendly-style">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-left">
          <h2>Appointment Schedule</h2>
        </div>
        <div className="header-controls">
          <button onClick={previousWeek} className="nav-btn">← Previous</button>
          <button onClick={goToToday} className="today-btn">Today</button>
          <button onClick={nextWeek} className="nav-btn">Next →</button>
          <button onClick={fetchData} className="refresh-btn">Refresh</button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="week-info">
        {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Header Row - Days */}
        <div className="time-column header">Time</div>
        {weekDays.map((date, index) => (
          <div key={index} className={`day-header ${isPast(date) ? 'past' : ''}`}>
            <div className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className="day-date">{date.getDate()}</div>
          </div>
        ))}

        {/* Time Slots Grid */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="time-column">{time}</div>
            {weekDays.map((date, dayIndex) => {
              const daySlots = getSlotsForDate(date);
              const slot = daySlots.find(s => s.startTime === time);
              const appointment = slot ? getAppointmentForSlot(slot) : null;
              const past = isPast(date);

              return (
                <div
                  key={`${dayIndex}-${time}`}
                  className={`time-slot ${slot ? (slot.isBooked ? 'booked' : 'available') : 'no-slot'} ${past ? 'past' : ''}`}
                  onClick={() => slot && !past && handleSlotClick(slot)}
                  style={{ cursor: slot && !past ? 'pointer' : 'default' }}
                >
                  {slot && slot.isBooked && appointment ? (
                    <div className="slot-content">
                      <div className="patient-name">{appointment.userEmail.split('@')[0]}</div>
                    </div>
                  ) : slot && !slot.isBooked ? (
                    <div className="slot-available">Available</div>
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Appointment Details Sidebar */}
      {selectedAppointment && (
        <div className="details-sidebar">
          <div className="sidebar-header">
            <h3>Appointment Details</h3>
            <button onClick={() => setSelectedAppointment(null)} className="close-sidebar">×</button>
          </div>
          <div className="sidebar-content">
            <div className="detail-row">
              <label>Patient</label>
              <div>{selectedAppointment.userEmail}</div>
            </div>
            <div className="detail-row">
              <label>Date</label>
              <div>{new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
              })}</div>
            </div>
            <div className="detail-row">
              <label>Time</label>
              <div>{selectedAppointment.startTime} - {selectedAppointment.endTime}</div>
            </div>
            {selectedAppointment.note && (
              <div className="detail-row">
                <label>Note</label>
                <div>{selectedAppointment.note}</div>
              </div>
            )}
            {selectedAppointment.googleMeetLink && (
              <div className="detail-row">
                <label>Video Call</label>
                <a href={selectedAppointment.googleMeetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                  Join Google Meet
                </a>
              </div>
            )}
            <div className="detail-row">
              <label>Status</label>
              <span className={`status-badge ${selectedAppointment.status}`}>
                {selectedAppointment.status}
              </span>
            </div>
          </div>
          <div className="sidebar-actions">
            <button onClick={handleCancelAppointment} className="cancel-apt-btn">
              Cancel Appointment
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingForm && selectedSlot && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Appointment</h3>
              <button onClick={() => setShowBookingForm(false)} className="close-btn">×</button>
            </div>
            <div className="selected-time-info">
              <div className="info-row">
                <span className="info-label">Date:</span>
                <span>{new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Time:</span>
                <span>{selectedSlot.startTime} - {selectedSlot.endTime}</span>
              </div>
            </div>
            <form onSubmit={handleBookAppointment}>
              <div className="form-field">
                <label>Patient Email *</label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  placeholder="patient@example.com"
                  required
                  autoFocus
                />
              </div>
              <div className="form-field">
                <label>Note (Optional)</label>
                <textarea
                  value={bookingData.note}
                  onChange={(e) => setBookingData({ ...bookingData, note: e.target.value })}
                  placeholder="Reason for appointment"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendlyStyle;

