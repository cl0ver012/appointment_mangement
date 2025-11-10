const { google } = require('googleapis');

/**
 * Google Calendar Integration Service
 * Creates calendar events when appointments are scheduled
 */

class GoogleCalendarService {
  constructor() {
    this.calendar = null;
    this.auth = null;
  }

  /**
   * Initialize Google Calendar API with credentials
   */
  async initialize() {
    try {
      // Check if credentials are configured
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
        console.log('⚠️  Google Calendar integration not configured. Appointments will be created without calendar events.');
        return false;
      }

      // Create OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
      );

      // Set credentials
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });

      this.auth = oauth2Client;
      this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      console.log('✅ Google Calendar integration initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Calendar:', error.message);
      return false;
    }
  }

  /**
   * Create a calendar event for an appointment
   */
  async createCalendarEvent(appointment) {
    try {
      if (!this.calendar) {
        console.log('Google Calendar not initialized, skipping event creation');
        return null;
      }

      // Parse date and time
      const appointmentDate = new Date(appointment.appointmentDate);
      const [startHour, startMinute] = appointment.startTime.split(':');
      const [endHour, endMinute] = appointment.endTime.split(':');

      // Create start and end datetime
      const startDateTime = new Date(appointmentDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(appointmentDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      // Prepare attendees list
      const attendees = [
        { email: appointment.userEmail, responseStatus: 'needsAction' } // Patient
      ];
      
      // Add doctor email if configured
      const doctorEmail = process.env.DOCTOR_EMAIL;
      if (doctorEmail) {
        attendees.push({ email: doctorEmail, responseStatus: 'accepted', organizer: true }); // Doctor
      }

      // Create event object
      const event = {
        summary: `Doctor Appointment - ${appointment.userEmail}`,
        description: appointment.note || 'Healthcare appointment',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        attendees: attendees,
        conferenceData: {
          createRequest: {
            requestId: `appointment-${appointment._id}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }       // 30 minutes before
          ]
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true
      };

      // Create the event
      const response = await this.calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all' // Send email to attendees
      });

      console.log(`✅ Created Google Calendar event: ${response.data.htmlLink}`);
      
      return {
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri
      };

    } catch (error) {
      console.error('❌ Error creating calendar event:', error.message);
      return null;
    }
  }

  /**
   * Update a calendar event
   */
  async updateCalendarEvent(eventId, appointment) {
    try {
      if (!this.calendar || !eventId) {
        return null;
      }

      const appointmentDate = new Date(appointment.appointmentDate);
      const [startHour, startMinute] = appointment.startTime.split(':');
      const [endHour, endMinute] = appointment.endTime.split(':');

      const startDateTime = new Date(appointmentDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(appointmentDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      // Prepare attendees list
      const attendees = [
        { email: appointment.userEmail, responseStatus: 'needsAction' } // Patient
      ];
      
      // Add doctor email if configured
      const doctorEmail = process.env.DOCTOR_EMAIL;
      if (doctorEmail) {
        attendees.push({ email: doctorEmail, responseStatus: 'accepted', organizer: true }); // Doctor
      }

      const event = {
        summary: `Doctor Appointment - ${appointment.userEmail}`,
        description: appointment.note || 'Healthcare appointment',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        attendees: attendees,
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true
      };

      const response = await this.calendar.events.update({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        resource: event,
        sendUpdates: 'all'
      });

      console.log(`✅ Updated Google Calendar event: ${response.data.htmlLink}`);
      return response.data;

    } catch (error) {
      console.error('❌ Error updating calendar event:', error.message);
      return null;
    }
  }

  /**
   * Cancel a calendar event
   */
  async cancelCalendarEvent(eventId) {
    try {
      if (!this.calendar || !eventId) {
        return false;
      }

      await this.calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        sendUpdates: 'all'
      });

      console.log(`✅ Deleted Google Calendar event: ${eventId}`);
      return true;

    } catch (error) {
      console.error('❌ Error deleting calendar event:', error.message);
      return false;
    }
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
    );

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokenFromCode(code) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }
}

// Export singleton instance
module.exports = new GoogleCalendarService();

