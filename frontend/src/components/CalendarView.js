import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI, appointmentsAPI } from '../services/api';
import './CalendarView.css';

const CalendarView = ({ onBookingSuccess }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // Fetch slots and appointments for the current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const [slotsRes, appointmentsRes] = await Promise.all([
        slotsAPI.getAll({}),
        appointmentsAPI.getAll({})
      ]);

      setSlots(slotsRes.data.data);
      setAppointments(appointmentsRes.data.data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSlotsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === dateStr;
    });
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
      return aptDate === dateStr && apt.status !== 'cancelled';
    });
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      toast.info('Cannot select past dates');
      return;
    }
    
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot) => {
    if (slot.isBooked) {
      toast.info('This slot is already booked');
      return;
    }
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot || !email) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        userEmail: email,
        appointmentDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        note: note,
        doctorId: selectedSlot.doctorId
      };

      await appointmentsAPI.create(bookingData);
      toast.success('Appointment booked successfully!');
      
      setShowBookingForm(false);
      setSelectedSlot(null);
      setEmail('');
      setNote('');
      setSelectedDate(null);
      
      fetchCalendarData();
      if (onBookingSuccess) onBookingSuccess();
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="nav-button" onClick={previousMonth}>‹</button>
        <h2>{formatMonthYear()}</h2>
        <button className="nav-button" onClick={nextMonth}>›</button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          const daySlots = getSlotsForDate(date);
          const dayAppointments = getAppointmentsForDate(date);
          const availableCount = daySlots.filter(s => !s.isBooked).length;
          const bookedCount = daySlots.filter(s => s.isBooked).length;
          const isSelected = selectedDate && date && selectedDate.toDateString() === date.toDateString();
          
          return (
            <div
              key={index}
              className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isPast(date) ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date && (
                <>
                  <div className="day-number">{date.getDate()}</div>
                  {daySlots.length > 0 && (
                    <div className="day-info">
                      {availableCount > 0 && (
                        <div className="slot-indicator available">
                          {availableCount} available
                        </div>
                      )}
                      {bookedCount > 0 && (
                        <div className="slot-indicator booked">
                          {bookedCount} booked
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="time-slots-panel">
          <h3>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {loading ? (
            <div className="loading">Loading slots...</div>
          ) : (
            <>
              {getSlotsForDate(selectedDate).length === 0 ? (
                <div className="no-slots">No slots available for this date</div>
              ) : (
                <div className="time-slots-grid">
                  {getSlotsForDate(selectedDate).map(slot => (
                    <button
                      key={slot._id}
                      className={`time-slot-button ${slot.isBooked ? 'booked' : 'available'} ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={slot.isBooked}
                    >
                      <div className="time-slot-time">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="time-slot-status">
                        {slot.isBooked ? '🔒 Booked' : '✓ Available'}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {getAppointmentsForDate(selectedDate).length > 0 && (
                <div className="appointments-list">
                  <h4>Existing Appointments</h4>
                  {getAppointmentsForDate(selectedDate).map(apt => (
                    <div key={apt._id} className="appointment-item">
                      <div className="apt-time">
                        🕐 {apt.startTime} - {apt.endTime}
                      </div>
                      <div className="apt-email">📧 {apt.userEmail}</div>
                      {apt.note && <div className="apt-note">📝 {apt.note}</div>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showBookingForm && selectedSlot && (
        <div className="booking-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowBookingForm(false)}>×</button>
            
            <h3>Book Appointment</h3>
            
            <div className="booking-details">
              <p><strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
            </div>

            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="note">Notes (Optional)</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Brief description..."
                  rows="3"
                  maxLength="500"
                  className="form-control"
                />
                <small>{note.length}/500 characters</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;

