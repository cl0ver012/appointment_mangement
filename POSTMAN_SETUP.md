# 📮 Postman Collection Setup Guide

## Import the Collection

### Method 1: Import from File

1. **Open Postman**

2. **Click "Import"** (top left)

3. **Select File:**
   - Browse to: `/home/ilya/Desktop/appointment_mangement/Appointment_Management_API.postman_collection.json`
   - Click "Open"

4. **Done!** The collection will appear in your Collections sidebar

### Method 2: Drag and Drop

1. Open Postman
2. Drag the `Appointment_Management_API.postman_collection.json` file
3. Drop it into Postman window
4. Collection imported!

## Collection Structure

```
Appointment Management API
├── Health Check
│   └── Check API Health
├── Appointments
│   ├── Get All Appointments
│   ├── Get Appointments by Email
│   ├── Get Appointments by Date
│   ├── Get Appointments by Status
│   ├── Get Single Appointment
│   ├── Create Appointment
│   ├── Create Appointment (Voice AI Example)
│   ├── Update Appointment
│   ├── Cancel Appointment
│   └── Delete Appointment
├── Slots
│   ├── Get All Slots
│   ├── Get Available Slots
│   ├── Get Slots by Date
│   ├── Create Single Slot
│   ├── Create Bulk Slots
│   └── Delete Slot
└── Voice AI Examples
    ├── 1. Check Available Slots for Tomorrow
    ├── 2. Book Appointment for Patient
    ├── 3. Get Patient Appointments
    ├── 4. Reschedule Appointment
    └── 5. Cancel Appointment
```

## Configuration

### Base URL Variable

The collection uses a variable for the base URL:
- Variable: `{{base_url}}`
- Default: `http://localhost:5000/api`

**To change it:**
1. Click on the collection name
2. Go to "Variables" tab
3. Update the `base_url` value
4. Save

## Testing the API

### 1. Health Check

Start by testing the health endpoint:
```
GET {{base_url}}/health
```

Expected response:
```json
{
  "success": true,
  "message": "Appointment Management API is running",
  "timestamp": "2025-11-02T17:30:00.000Z"
}
```

### 2. Get Available Slots

Check what slots are available:
```
GET {{base_url}}/slots?available=true
```

### 3. Create an Appointment

Use the "Create Appointment" request with body:
```json
{
  "userEmail": "test@example.com",
  "appointmentDate": "2025-11-05",
  "startTime": "10:00",
  "endTime": "10:30",
  "note": "Test appointment"
}
```

### 4. View Your Appointments

```
GET {{base_url}}/appointments?email=test@example.com
```

## Voice AI Integration Examples

The collection includes a special folder with **Voice AI Examples** showing typical use cases:

### Example 1: Patient Asks About Availability
```
"What time slots are available tomorrow?"
→ GET /slots?date=2025-11-03&available=true
```

### Example 2: Patient Books Appointment
```
"Book me for tomorrow at 10 AM"
→ POST /appointments
Body: {userEmail, appointmentDate, startTime, endTime, note}
```

### Example 3: Patient Checks Their Appointments
```
"What are my upcoming appointments?"
→ GET /appointments?email=patient@email.com&status=scheduled
```

### Example 4: Patient Reschedules
```
"Can you reschedule to tomorrow at 2 PM?"
→ PUT /appointments/:id
Body: {appointmentDate, startTime, endTime, status: "rescheduled"}
```

### Example 5: Patient Cancels
```
"I need to cancel my appointment"
→ PUT /appointments/:id
Body: {status: "cancelled"}
```

## Tips for Testing

### 1. Save Response Data

When you create an appointment, save the `_id` from the response:
```json
{
  "success": true,
  "data": {
    "_id": "673abc123def456789012345",  ← Copy this
    ...
  }
}
```

Use it in subsequent requests (Update, Delete).

### 2. Use Environment Variables

Create a Postman environment with:
- `appointment_id` - Last created appointment ID
- `slot_id` - Last created slot ID
- `test_email` - Your test email

### 3. Check Dashboard Updates

After creating/updating appointments via Postman:
1. Go to http://localhost:3000
2. Dashboard updates every 10 seconds
3. See your changes in real-time!

### 4. Test Error Cases

Try invalid data to test validation:
```json
{
  "userEmail": "invalid-email",  // Missing @
  "appointmentDate": "2025-11-05",
  "startTime": "10:00"
  // Missing endTime - should fail
}
```

## Common Use Cases

### For Developers:
1. Test API endpoints during development
2. Debug voice AI integration
3. Verify response formats
4. Test error handling

### For Voice AI Integration:
1. Map voice commands to API calls
2. Test typical conversation flows
3. Validate data formats
4. Simulate user interactions

### For Demos:
1. Show healthcare companies API capabilities
2. Demonstrate real-time updates
3. Test voice AI scenarios
4. Verify calendar integration

## Response Examples

### Successful Appointment Creation:
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "673abc123def456789012345",
    "userEmail": "patient@email.com",
    "appointmentDate": "2025-11-05T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "note": "Annual checkup",
    "status": "scheduled",
    "googleEventId": "abc123...",
    "googleEventLink": "https://calendar.google.com/...",
    "googleMeetLink": "https://meet.google.com/...",
    "createdAt": "2025-11-02T17:30:00.000Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "This time slot is already booked"
}
```

## Advanced: Run Collection

You can run the entire collection or folder:

1. Click on collection/folder
2. Click "Run"
3. Select requests to run
4. Click "Run Appointment Management API"

This is useful for:
- Testing all endpoints at once
- Integration testing
- Regression testing

## Environment Setup (Optional)

Create environments for different stages:

### Development
```
base_url: http://localhost:5000/api
```

### Staging
```
base_url: https://staging-api.yourdomain.com/api
```

### Production
```
base_url: https://api.yourdomain.com/api
```

## Integration with Voice AI

Use Postman to:
1. Test API calls before implementing in voice AI
2. Generate code snippets (click "Code" button)
3. Copy cURL commands for your AI agent
4. Export as code in various languages

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "patient@email.com",
    "appointmentDate": "2025-11-05",
    "startTime": "10:00",
    "endTime": "10:30",
    "note": "Scheduled by voice AI"
  }'
```

## Need Help?

- API Documentation: `API_DOCUMENTATION.md`
- Backend code: `backend/routes/appointments.js`
- Test from browser: http://localhost:5000/api/health

---

**Happy Testing!** 🚀

