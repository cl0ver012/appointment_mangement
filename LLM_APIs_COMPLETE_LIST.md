# 🤖 Complete LLM API Reference

## Base URL

**Production:** `https://appointmentmangement-production.up.railway.app/api/llm`

**Local:** `http://localhost:5000/api/llm`

---

## 📋 All 8 LLM Endpoints

### Availability Checking (4 Endpoints)

#### 1️⃣ Check Single Day Availability
```
POST /api/llm/check-availability
```

**Use Case:** "What's available tomorrow?" or "Show me slots on Friday"

**Request:**
```json
{
  "date": "2025-11-12"
}
```

**Response:**
```json
{
  "success": true,
  "date": "2025-11-12",
  "availableSlots": [
    {
      "time": "09:00 - 09:30",
      "startTime": "09:00",
      "endTime": "09:30"
    },
    {
      "time": "10:00 - 10:30",
      "startTime": "10:00",
      "endTime": "10:30"
    }
  ],
  "count": 2,
  "message": "Found 2 available slots"
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/check-availability \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-12"}'
```

---

#### 2️⃣ Check Next N Days ⚡ NEW
```
POST /api/llm/check-availability-next-days
```

**Use Case:** "Show me availability next week" or "What's available this month?"

**Request:**
```json
{
  "days": 7
}
```

**Response:**
```json
{
  "success": true,
  "searchPeriod": "Next 7 days",
  "startDate": "2025-11-07",
  "endDate": "2025-11-14",
  "totalAvailableSlots": 34,
  "datesWithAvailability": 5,
  "slotsByDate": {
    "2025-11-07": [
      {
        "time": "14:00 - 14:30",
        "startTime": "14:00",
        "endTime": "14:30"
      }
    ],
    "2025-11-08": [
      {
        "time": "09:00 - 09:30",
        "startTime": "09:00",
        "endTime": "09:30"
      }
    ]
  },
  "message": "Found 34 available slots across 5 dates in the next 7 days"
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

**Performance:** 85% fewer API calls (1 call vs 7)

---

#### 3️⃣ Check Date Range ⚡ NEW
```
POST /api/llm/check-availability-range
```

**Use Case:** "What's available between Nov 10 and Nov 20?"

**Request:**
```json
{
  "startDate": "2025-11-10",
  "endDate": "2025-11-20"
}
```

**Response:**
```json
{
  "success": true,
  "startDate": "2025-11-10",
  "endDate": "2025-11-20",
  "totalAvailableSlots": 60,
  "datesWithAvailability": 9,
  "slotsByDate": {
    "2025-11-10": [...],
    "2025-11-12": [...],
    "2025-11-15": [...]
  },
  "message": "Found 60 available slots across 9 dates"
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/check-availability-range \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2025-11-10", "endDate": "2025-11-20"}'
```

---

#### 4️⃣ Get Next Available ⚡ NEW
```
POST /api/llm/get-next-available
```

**Use Case:** "When's the next available appointment?"

**Request:**
```json
{
  "limit": 5
}
```

**Optional Parameters:**
- `fromDate` - Start from specific date (default: today)
- `limit` - Number of slots to return (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "nextAvailableSlots": [
    {
      "date": "2025-11-12",
      "time": "09:00 - 09:30",
      "startTime": "09:00",
      "endTime": "09:30"
    },
    {
      "date": "2025-11-12",
      "time": "09:30 - 10:00",
      "startTime": "09:30",
      "endTime": "10:00"
    }
  ],
  "count": 2,
  "message": "Found 2 upcoming available slots"
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/get-next-available \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

---

### Appointment Management (4 Endpoints)

#### 5️⃣ Book Appointment
```
POST /api/llm/book-appointment
```

**Use Case:** "Book me for tomorrow at 10 AM"

**Request:**
```json
{
  "email": "james@example.com",
  "date": "2025-11-12",
  "time": "09:00",
  "note": "Annual checkup"
}
```

**Required Fields:**
- `email` - Patient email address
- `date` - Appointment date (YYYY-MM-DD)
- `time` - Start time (HH:MM)

**Optional Fields:**
- `note` - Reason for appointment

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "691454153951b385b4624cbf",
    "email": "james@example.com",
    "date": "2025-11-12",
    "time": "09:00 - 09:30",
    "meetLink": "https://meet.google.com/abc-defg-hij",
    "calendarLink": "https://calendar.google.com/..."
  }
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "james@example.com",
    "date": "2025-11-12",
    "time": "09:00",
    "note": "Annual checkup"
  }'
```

**What Happens:**
- ✅ Creates appointment in database
- ✅ Creates Google Calendar event
- ✅ Generates Google Meet link
- ✅ Sends email to patient
- ✅ Sends email to doctor (if configured)
- ✅ Marks slot as booked

---

#### 6️⃣ Get Patient Appointments
```
POST /api/llm/get-appointments
```

**Use Case:** "What are my upcoming appointments?"

**Request:**
```json
{
  "email": "james@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "email": "james@example.com",
  "appointments": [
    {
      "id": "691454153951b385b4624cbf",
      "date": "2025-11-12",
      "time": "09:00 - 09:30",
      "status": "scheduled",
      "note": "Annual checkup",
      "meetLink": "https://meet.google.com/abc-defg-hij"
    }
  ],
  "count": 1,
  "message": "Found 1 appointment(s)"
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/get-appointments \
  -H "Content-Type: application/json" \
  -d '{"email": "james@example.com"}'
```

---

#### 7️⃣ Cancel Appointment
```
POST /api/llm/cancel-appointment
```

**Use Case:** "I need to cancel my appointment"

**Request:**
```json
{
  "email": "james@example.com",
  "date": "2025-11-12"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "cancelled": {
    "date": "2025-11-12",
    "time": "09:00 - 09:30"
  }
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/cancel-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "james@example.com",
    "date": "2025-11-12"
  }'
```

**What Happens:**
- ✅ Cancels appointment in database
- ✅ Deletes Google Calendar event
- ✅ Sends cancellation email to both
- ✅ Releases the time slot

---

#### 8️⃣ Reschedule Appointment
```
POST /api/llm/reschedule-appointment
```

**Use Case:** "Move my appointment to next week"

**Request:**
```json
{
  "email": "james@example.com",
  "currentDate": "2025-11-12",
  "newDate": "2025-11-19",
  "newTime": "14:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment rescheduled successfully",
  "rescheduled": {
    "from": {
      "date": "2025-11-12",
      "time": "09:00 - 09:30"
    },
    "to": {
      "date": "2025-11-19",
      "time": "14:00 - 14:30",
      "meetLink": "https://meet.google.com/abc-defg-hij"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST https://appointmentmangement-production.up.railway.app/api/llm/reschedule-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "james@example.com",
    "currentDate": "2025-11-12",
    "newDate": "2025-11-19",
    "newTime": "14:00"
  }'
```

**What Happens:**
- ✅ Updates appointment in database
- ✅ Updates Google Calendar event
- ✅ Sends update email to both
- ✅ Releases old slot
- ✅ Books new slot

---

## 📊 Quick Comparison Table

| Endpoint | Method | Use Case | Parameters | New? |
|----------|--------|----------|------------|------|
| `/check-availability` | POST | Single day | `date` | ✅ Original |
| `/check-availability-next-days` | POST | Next N days | `days` | ⚡ NEW |
| `/check-availability-range` | POST | Date range | `startDate`, `endDate` | ⚡ NEW |
| `/get-next-available` | POST | Soonest slots | `limit`, `fromDate` | ⚡ NEW |
| `/book-appointment` | POST | Book | `email`, `date`, `time` | ✅ Original |
| `/get-appointments` | POST | View | `email` | ✅ Original |
| `/cancel-appointment` | POST | Cancel | `email`, `date` | ✅ Original |
| `/reschedule-appointment` | POST | Reschedule | `email`, `currentDate`, `newDate`, `newTime` | ✅ Original |

---

## 🎯 Decision Tree: Which API to Use?

```
User says: "What's available tomorrow?"
→ Use: /check-availability

User says: "Show me next week"
→ Use: /check-availability-next-days (⚡ Much faster!)

User says: "What's available Nov 10-20?"
→ Use: /check-availability-range

User says: "When's the next available?"
→ Use: /get-next-available

User says: "Book me for Friday at 2pm"
→ First: /check-availability (verify slot)
→ Then: /book-appointment

User says: "What are my appointments?"
→ Use: /get-appointments

User says: "Cancel my appointment"
→ Use: /cancel-appointment

User says: "Move my appointment to next week"
→ First: /get-appointments (find current)
→ Then: /check-availability-next-days (find new slot)
→ Finally: /reschedule-appointment
```

---

## 🤖 LLM Function Calling Examples

### OpenAI Format

```python
functions = [
    {
        "name": "check_availability_next_days",
        "description": "Check available appointment slots for the next N days. More efficient than checking individual days.",
        "parameters": {
            "type": "object",
            "properties": {
                "days": {
                    "type": "integer",
                    "description": "Number of days to check (1-90). Example: 7 for next week"
                }
            },
            "required": ["days"]
        }
    },
    {
        "name": "get_next_available",
        "description": "Get the next available appointment slots sorted chronologically. Perfect for 'when's the next available?' queries.",
        "parameters": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "description": "Number of slots to return (1-50, default 10)"
                }
            }
        }
    },
    {
        "name": "book_appointment",
        "description": "Book an appointment for a patient. Creates calendar event with Google Meet link.",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string",
                    "description": "Patient's email address"
                },
                "date": {
                    "type": "string",
                    "description": "Appointment date in YYYY-MM-DD format"
                },
                "time": {
                    "type": "string",
                    "description": "Start time in HH:MM format (24-hour)"
                },
                "note": {
                    "type": "string",
                    "description": "Optional reason for appointment"
                }
            },
            "required": ["email", "date", "time"]
        }
    }
    # ... add other functions
]
```

### Python Implementation

```python
import requests
import json

BASE_URL = "https://appointmentmangement-production.up.railway.app/api/llm"

def check_next_week():
    """Check availability for next 7 days"""
    response = requests.post(
        f"{BASE_URL}/check-availability-next-days",
        json={"days": 7}
    )
    return response.json()

def get_next_available(limit=5):
    """Get next available slots"""
    response = requests.post(
        f"{BASE_URL}/get-next-available",
        json={"limit": limit}
    )
    return response.json()

def book_appointment(email, date, time, note=""):
    """Book an appointment"""
    response = requests.post(
        f"{BASE_URL}/book-appointment",
        json={
            "email": email,
            "date": date,
            "time": time,
            "note": note
        }
    )
    return response.json()

# Example Usage
availability = check_next_week()
print(f"Found {availability['totalAvailableSlots']} slots!")

next_slots = get_next_available(3)
print(f"Next available: {next_slots['nextAvailableSlots'][0]['date']}")

booking = book_appointment(
    email="james@example.com",
    date="2025-11-12",
    time="09:00",
    note="Consultation"
)
print(f"Booked! Meeting link: {booking['appointment']['meetLink']}")
```

---

## 📈 Performance Metrics

### Old Way (Multiple API Calls)

```
User: "Show me next week"

Agent:
  check_availability("2025-11-07") → 250ms
  check_availability("2025-11-08") → 250ms
  check_availability("2025-11-09") → 250ms
  check_availability("2025-11-10") → 250ms
  check_availability("2025-11-11") → 250ms
  check_availability("2025-11-12") → 250ms
  check_availability("2025-11-13") → 250ms

Total: 7 API calls, ~2-3 seconds
```

### New Way (Single API Call) ⚡

```
User: "Show me next week"

Agent:
  check_availability_next_days({"days": 7}) → 300ms

Total: 1 API call, ~300ms

Result: 85% faster, 85% fewer API calls!
```

---

## 🔐 Authentication & Security

Currently, these endpoints are **public** (no authentication required). 

For production with sensitive data, consider adding:
- API keys
- Rate limiting
- IP whitelisting
- OAuth authentication

---

## 💡 Best Practices

### 1. **Use Efficient Endpoints**
```python
# ❌ Inefficient
for day in range(7):
    check_availability(date)

# ✅ Efficient
check_availability_next_days(days=7)
```

### 2. **Handle Errors Gracefully**
```python
response = check_next_week()
if response['success']:
    slots = response['totalAvailableSlots']
else:
    # Handle error
    error_message = response['message']
```

### 3. **Validate Before Booking**
```python
# First check availability
availability = check_availability(date)
if availability['count'] > 0:
    # Then book
    book_appointment(email, date, time)
```

### 4. **Provide Context in Notes**
```python
book_appointment(
    email="james@example.com",
    date="2025-11-12",
    time="09:00",
    note="Follow-up consultation - Previous visit on Oct 15"
)
```

---

## 🎯 Complete Workflow Example

```python
# User: "I need an appointment next week"

# Step 1: Check availability
availability = check_availability_next_days(days=7)
available_dates = list(availability['slotsByDate'].keys())

# AI: "I found slots on Monday, Wednesday, and Friday. Which works?"
# User: "Friday afternoon"

# Step 2: Show Friday slots
friday_slots = availability['slotsByDate']['2025-11-15']
afternoon_slots = [s for s in friday_slots if int(s['startTime'].split(':')[0]) >= 12]

# AI: "Friday afternoon I have 2pm and 3pm available"
# User: "2pm works"

# Step 3: Book it
booking = book_appointment(
    email="james@example.com",
    date="2025-11-15",
    time="14:00",
    note="Afternoon appointment requested by patient"
)

# AI: "Perfect! Your appointment is booked for Friday at 2pm. 
#      I've sent a calendar invitation to james@example.com with 
#      a Google Meet link: {meeting_link}"
```

---

## 📚 Related Files

- `LLM_API_SIMPLE_GUIDE.md` - Complete usage guide
- `LLM_FUNCTION_SCHEMAS_NEW.json` - Function schemas
- `backend/routes/llm-api.js` - Source code
- `LLM_Simple.postman_collection.json` - Postman tests

---

## 🎉 Summary

**8 APIs for Complete Appointment Management:**
- ✅ 4 ways to check availability (1 original + 3 new efficient ones)
- ✅ 4 appointment operations (book, view, cancel, reschedule)
- ✅ All optimized for LLM function calling
- ✅ Minimal parameters, clear responses
- ✅ Production-ready and tested

**Your LLM agent has everything it needs!** 🤖✨

