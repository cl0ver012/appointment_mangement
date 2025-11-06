import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI, appointmentsAPI } from '../services/api';
import './AppointmentBooking.css';

const AppointmentBooking = ({ onBookingSuccess }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setFetchingSlots(true);
    try {
      const response = await slotsAPI.getAll({ date: selectedDate, available: true });
      setAvailableSlots(response.data.data);
      if (response.data.data.length === 0) {
        toast.info('No available slots for this date');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch available slots');
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      toast.warning('Please select a time slot');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.warning('Please enter a valid email');
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
      
      // Reset form
      setSelectedSlot(null);
      setEmail('');
      setNote('');
      fetchAvailableSlots();
      
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatTime = (time) => {
    return time;
  };

  return (
    <div className="appointment-booking">
      <h2>📅 Book Your Appointment</h2>
      <p className="subtitle">Select a date and available time slot to book your appointment</p>

      <form onSubmit={handleBooking} className="booking-form">
        <div className="form-group">
          <label htmlFor="date">Select Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getMinDate()}
            required
            className="form-control"
          />
        </div>

        {selectedDate && (
          <div className="slots-section">
            <h3>Available Time Slots</h3>
            {fetchingSlots ? (
              <div className="loading">Loading slots...</div>
            ) : availableSlots.length > 0 ? (
              <div className="slots-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot._id}
                    type="button"
                    className={`slot-button ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <span className="slot-time">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="no-slots">
                <p>No available slots for this date</p>
                <small>Please select another date</small>
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <div className="booking-details">
            <h3>Your Details</h3>
            
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
                placeholder="Brief description of your concern..."
                rows="4"
                maxLength="500"
                className="form-control"
              />
              <small>{note.length}/500 characters</small>
            </div>

            <div className="selected-slot-info">
              <h4>Selected Appointment</h4>
              <p><strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Booking...' : '✓ Confirm Booking'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentBooking;

