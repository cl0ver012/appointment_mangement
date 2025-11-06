import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { slotsAPI, appointmentsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalAppointmentsToday: 0,
    totalAppointmentsWeek: 0,
    availableSlotsToday: 0,
    totalSlotsToday: 0,
    upcomingAppointments: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 10 seconds to show real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [slotsRes, appointmentsRes] = await Promise.all([
        slotsAPI.getAll({}),
        appointmentsAPI.getAll({})
      ]);

      const slots = slotsRes.data.data;
      const appointments = appointmentsRes.data.data;

      // Calculate metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Today's metrics
      const todaySlots = slots.filter(slot => {
        const slotDate = new Date(slot.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === today.getTime();
      });

      const availableToday = todaySlots.filter(slot => !slot.isBooked).length;
      
      const todayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime() && apt.status !== 'cancelled';
      });

      // This week's appointments
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= weekStart && aptDate < weekEnd && apt.status !== 'cancelled';
      });

      // Upcoming appointments (next 5)
      const upcoming = appointments
        .filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && apt.status === 'scheduled';
        })
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 5);

      // Recent activity (last 5 appointments or updates)
      const recent = appointments
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

      setMetrics({
        totalAppointmentsToday: todayAppointments.length,
        totalAppointmentsWeek: weekAppointments.length,
        availableSlotsToday: availableToday,
        totalSlotsToday: todaySlots.length,
        upcomingAppointments: upcoming,
        recentActivity: recent
      });

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#2196F3',
      completed: '#4CAF50',
      cancelled: '#F44336',
      rescheduled: '#FF9800'
    };
    return colors[status] || '#757575';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );
  }

  const utilizationRate = metrics.totalSlotsToday > 0 
    ? ((metrics.totalSlotsToday - metrics.availableSlotsToday) / metrics.totalSlotsToday * 100).toFixed(1)
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Appointment Management Dashboard</h1>
          <p className="subtitle">Real-time healthcare scheduling overview</p>
        </div>
        <div className="last-update">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Today's Appointments</div>
          <div className="kpi-value">{metrics.totalAppointmentsToday}</div>
          <div className="kpi-subtitle">Active bookings</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">This Week</div>
          <div className="kpi-value">{metrics.totalAppointmentsWeek}</div>
          <div className="kpi-subtitle">Total scheduled</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Available Today</div>
          <div className="kpi-value">{metrics.availableSlotsToday}</div>
          <div className="kpi-subtitle">of {metrics.totalSlotsToday} slots</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Utilization Rate</div>
          <div className="kpi-value">{utilizationRate}%</div>
          <div className="kpi-subtitle">Booking efficiency</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Upcoming Appointments */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <span className="section-badge">{metrics.upcomingAppointments.length}</span>
          </div>
          
          {metrics.upcomingAppointments.length === 0 ? (
            <div className="empty-state">No upcoming appointments</div>
          ) : (
            <div className="appointments-list">
              {metrics.upcomingAppointments.map((apt) => (
                <div key={apt._id} className="appointment-row">
                  <div className="appointment-time">
                    <div className="time-main">{apt.startTime}</div>
                    <div className="time-date">{formatDate(apt.appointmentDate)}</div>
                  </div>
                  <div className="appointment-details">
                    <div className="patient-email">{apt.userEmail}</div>
                    {apt.note && <div className="appointment-note">{apt.note}</div>}
                  </div>
                  <div className="appointment-status" style={{ borderLeftColor: getStatusColor(apt.status) }}>
                    {apt.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <span className="activity-indicator">● Live</span>
          </div>
          
          {metrics.recentActivity.length === 0 ? (
            <div className="empty-state">No recent activity</div>
          ) : (
            <div className="activity-list">
              {metrics.recentActivity.map((apt) => (
                <div key={apt._id} className="activity-row">
                  <div className="activity-icon" style={{ backgroundColor: getStatusColor(apt.status) }}>
                    {apt.status === 'scheduled' ? '✓' : apt.status === 'cancelled' ? '✗' : '↻'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      {apt.status === 'scheduled' && 'Appointment scheduled'}
                      {apt.status === 'cancelled' && 'Appointment cancelled'}
                      {apt.status === 'rescheduled' && 'Appointment rescheduled'}
                      {apt.status === 'completed' && 'Appointment completed'}
                    </div>
                    <div className="activity-details">
                      {apt.userEmail} • {formatDate(apt.appointmentDate)} at {apt.startTime}
                    </div>
                  </div>
                  <div className="activity-time">
                    {formatTime(apt.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voice AI Integration Info */}
      <div className="integration-banner">
        <div className="banner-icon">🎤</div>
        <div className="banner-content">
          <div className="banner-title">Voice AI Agent Ready</div>
          <div className="banner-description">
            This dashboard updates in real-time as your AI agent schedules and manages appointments via API
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

