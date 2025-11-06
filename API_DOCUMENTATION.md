# 📡 API Documentation

Complete API reference for the Appointment Management Platform.

**Base URL**: `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Appointments API](#appointments-api)
- [Slots API](#slots-api)
- [Health Check](#health-check)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

## Authentication

Currently, the API does not require authentication. In a production environment, you should implement:
- JWT tokens
- API keys
- OAuth 2.0

## Appointments API

### Get All Appointments

Retrieve a list of appointments with optional filtering.

```http
GET /api/appointments
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| email | string | Filter by user email |
| date | string | Filter by appointment date (ISO 8601) |
| status | string | Filter by status (scheduled, completed, cancelled, rescheduled) |

**Example Request**:
```bash
curl "http://localhost:5000/api/appointments?email=user@example.com&status=scheduled"
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "653abc123def456789012345",
      "userEmail": "user@example.com",
      "doctorId": "doctor1",
      "appointmentDate": "2025-10-25T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "09:30",
      "note": "Regular checkup",
      "status": "scheduled",
      "createdAt": "2025-10-24T10:30:00.000Z",
      "updatedAt": "2025-10-24T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Get Single Appointment

Retrieve a specific appointment by ID.

```http
GET /api/appointments/:id
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of the appointment |

**Example Request**:
```bash
curl "http://localhost:5000/api/appointments/653abc123def456789012345"
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "653abc123def456789012345",
    "userEmail": "user@example.com",
    "doctorId": "doctor1",
    "appointmentDate": "2025-10-25T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "09:30",
    "note": "Regular checkup",
    "status": "scheduled",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

---

### Create Appointment

Create a new appointment.

```http
POST /api/appointments
```

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "appointmentDate": "2025-10-25",
  "startTime": "09:00",
  "endTime": "09:30",
  "note": "Regular checkup",
  "doctorId": "doctor1"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userEmail | string | Yes | Valid email address |
| appointmentDate | string | Yes | Date in ISO 8601 format |
| startTime | string | Yes | Start time (HH:MM) |
| endTime | string | Yes | End time (HH:MM) |
| note | string | No | Additional notes (max 500 chars) |
| doctorId | string | No | Doctor identifier (default: 'doctor1') |

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "user@example.com",
    "appointmentDate": "2025-10-25",
    "startTime": "09:00",
    "endTime": "09:30",
    "note": "Regular checkup"
  }'
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "653abc123def456789012345",
    "userEmail": "user@example.com",
    "doctorId": "doctor1",
    "appointmentDate": "2025-10-25T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "09:30",
    "note": "Regular checkup",
    "status": "scheduled",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "This time slot is already booked"
}
```

---

### Update Appointment

Update an existing appointment.

```http
PUT /api/appointments/:id
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of the appointment |

**Request Body** (all fields optional):
```json
{
  "userEmail": "newemail@example.com",
  "appointmentDate": "2025-10-26",
  "startTime": "10:00",
  "endTime": "10:30",
  "note": "Updated note",
  "status": "rescheduled"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userEmail | string | No | Valid email address |
| appointmentDate | string | No | Date in ISO 8601 format |
| startTime | string | No | Start time (HH:MM) |
| endTime | string | No | End time (HH:MM) |
| note | string | No | Additional notes (max 500 chars) |
| status | string | No | scheduled, completed, cancelled, rescheduled |

**Example Request**:
```bash
curl -X PUT http://localhost:5000/api/appointments/653abc123def456789012345 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "note": "Visit completed successfully"
  }'
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "_id": "653abc123def456789012345",
    "userEmail": "user@example.com",
    "doctorId": "doctor1",
    "appointmentDate": "2025-10-25T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "09:30",
    "note": "Visit completed successfully",
    "status": "completed",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T15:45:00.000Z"
  }
}
```

---

### Delete Appointment

Delete an appointment and release the associated slot.

```http
DELETE /api/appointments/:id
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of the appointment |

**Example Request**:
```bash
curl -X DELETE http://localhost:5000/api/appointments/653abc123def456789012345
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

## Slots API

### Get All Slots

Retrieve available time slots with optional filtering.

```http
GET /api/slots
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| date | string | Filter by date (ISO 8601) |
| doctorId | string | Filter by doctor ID |
| available | boolean | Filter by availability (true for available only) |

**Example Request**:
```bash
curl "http://localhost:5000/api/slots?date=2025-10-25&available=true"
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "653abc123def456789012346",
      "doctorId": "doctor1",
      "date": "2025-10-25T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "09:30",
      "isBooked": false,
      "appointmentId": null,
      "createdAt": "2025-10-24T08:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Create Single Slot

Create a single available time slot.

```http
POST /api/slots
```

**Request Body**:
```json
{
  "date": "2025-10-25",
  "startTime": "09:00",
  "endTime": "09:30",
  "doctorId": "doctor1"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| date | string | Yes | Date in ISO 8601 format |
| startTime | string | Yes | Start time (HH:MM) |
| endTime | string | Yes | End time (HH:MM) |
| doctorId | string | No | Doctor identifier (default: 'doctor1') |

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/slots \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-25",
    "startTime": "09:00",
    "endTime": "09:30"
  }'
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Slot created successfully",
  "data": {
    "_id": "653abc123def456789012346",
    "doctorId": "doctor1",
    "date": "2025-10-25T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "09:30",
    "isBooked": false,
    "appointmentId": null,
    "createdAt": "2025-10-24T08:00:00.000Z"
  }
}
```

---

### Create Bulk Slots

Create multiple slots across a date range.

```http
POST /api/slots/bulk
```

**Request Body**:
```json
{
  "startDate": "2025-10-25",
  "endDate": "2025-10-31",
  "excludeWeekends": true,
  "timeSlots": [
    { "startTime": "09:00", "endTime": "09:30" },
    { "startTime": "09:30", "endTime": "10:00" },
    { "startTime": "10:00", "endTime": "10:30" }
  ],
  "doctorId": "doctor1"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date in ISO 8601 format |
| endDate | string | Yes | End date in ISO 8601 format |
| timeSlots | array | Yes | Array of time slot objects |
| excludeWeekends | boolean | No | Skip Saturdays and Sundays |
| doctorId | string | No | Doctor identifier (default: 'doctor1') |

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/slots/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-10-25",
    "endDate": "2025-10-31",
    "excludeWeekends": true,
    "timeSlots": [
      { "startTime": "09:00", "endTime": "09:30" },
      { "startTime": "09:30", "endTime": "10:00" }
    ]
  }'
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "15 slots created successfully",
  "data": {
    "created": 15
  }
}
```

---

### Delete Slot

Delete an available slot (only if not booked).

```http
DELETE /api/slots/:id
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of the slot |

**Example Request**:
```bash
curl -X DELETE http://localhost:5000/api/slots/653abc123def456789012346
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Slot deleted successfully"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Cannot delete a booked slot. Cancel the appointment first."
}
```

---

## Health Check

Check if the API is running and accessible.

```http
GET /api/health
```

**Example Request**:
```bash
curl http://localhost:5000/api/health
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Appointment Management API is running",
  "timestamp": "2025-10-24T10:30:00.000Z"
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "This time slot is already booked" | Attempting to book an occupied slot | Choose a different time slot |
| "Appointment not found" | Invalid appointment ID | Verify the appointment ID |
| "Valid email is required" | Invalid email format | Provide a valid email address |
| "Cannot delete a booked slot" | Trying to delete a booked slot | Cancel the appointment first |
| "The new time slot is already booked" | Rescheduling to an occupied slot | Choose a different time slot |

---

## Data Models

### Appointment

```typescript
{
  _id: ObjectId,
  userEmail: string,           // Valid email address
  doctorId: string,            // Default: "doctor1"
  appointmentDate: Date,       // Date of appointment
  startTime: string,           // Format: "HH:MM"
  endTime: string,             // Format: "HH:MM"
  note: string,                // Optional, max 500 characters
  status: string,              // "scheduled" | "completed" | "cancelled" | "rescheduled"
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-updated
}
```

### Available Slot

```typescript
{
  _id: ObjectId,
  doctorId: string,            // Default: "doctor1"
  date: Date,                  // Date of slot
  startTime: string,           // Format: "HH:MM"
  endTime: string,             // Format: "HH:MM"
  isBooked: boolean,           // Default: false
  appointmentId: ObjectId,     // Reference to Appointment (null if available)
  createdAt: Date              // Auto-generated
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production:
- Implement rate limiting middleware
- Recommended: 100 requests per 15 minutes per IP

## CORS

CORS is enabled for all origins in development. For production:
- Restrict origins to your frontend domain
- Configure allowed methods and headers

---

## Examples

### Complete Booking Flow

1. **Get available slots**:
```bash
curl "http://localhost:5000/api/slots?date=2025-10-25&available=true"
```

2. **Create appointment**:
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "patient@example.com",
    "appointmentDate": "2025-10-25",
    "startTime": "09:00",
    "endTime": "09:30",
    "note": "First visit"
  }'
```

3. **View appointments**:
```bash
curl "http://localhost:5000/api/appointments?email=patient@example.com"
```

4. **Update appointment status**:
```bash
curl -X PUT http://localhost:5000/api/appointments/[APPOINTMENT_ID] \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

---

**For questions or support, please refer to the main README.md**

