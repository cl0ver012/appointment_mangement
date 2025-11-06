# 🤖 LLM Function Calling - Quick Start

## ✨ Simplified API for Voice AI / LLM Integration

I've created **5 super simple endpoints** with minimal parameters that LLMs can easily use.

## 📋 The 5 Functions

### 1. **check_availability** - What times are available?

**Endpoint:** `POST /api/llm/check-availability`

**Parameters:**
- `date` - Date to check (YYYY-MM-DD)

**Example:**
```json
{
  "date": "2025-11-07"
}
```

**Response:**
```json
{
  "success": true,
  "availableSlots": [
    {"time": "09:00 - 09:30", "startTime": "09:00", "endTime": "09:30"},
    {"time": "10:00 - 10:30", "startTime": "10:00", "endTime": "10:30"}
  ],
  "count": 12,
  "message": "Found 12 available slots"
}
```

---

### 2. **book_appointment** - Book a meeting

**Endpoint:** `POST /api/llm/book-appointment`

**Parameters:**
- `email` - Patient email
- `date` - Appointment date (YYYY-MM-DD)
- `time` - Start time (HH:MM)
- `note` - Optional reason/note

**Example:**
```json
{
  "email": "patient@example.com",
  "date": "2025-11-07",
  "time": "10:00",
  "note": "Annual checkup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "673abc...",
    "email": "patient@example.com",
    "date": "2025-11-07",
    "time": "10:00 - 10:30",
    "meetLink": "https://meet.google.com/xxx-yyyy-zzz",
    "calendarLink": "https://calendar.google.com/..."
  }
}
```

**Automatically creates:**
- ✅ Google Calendar event
- ✅ Google Meet video link
- ✅ Email invitation to patient

---

### 3. **get_patient_appointments** - What are my appointments?

**Endpoint:** `POST /api/llm/get-appointments`

**Parameters:**
- `email` - Patient email

**Example:**
```json
{
  "email": "patient@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "id": "673abc...",
      "date": "2025-11-07",
      "time": "10:00 - 10:30",
      "status": "scheduled",
      "note": "Annual checkup",
      "meetLink": "https://meet.google.com/xxx-yyyy-zzz"
    }
  ],
  "count": 1
}
```

---

### 4. **cancel_appointment** - Cancel my appointment

**Endpoint:** `POST /api/llm/cancel-appointment`

**Parameters:**
- `email` - Patient email
- `date` - Appointment date to cancel (YYYY-MM-DD)

**Example:**
```json
{
  "email": "patient@example.com",
  "date": "2025-11-07"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "cancelled": {
    "date": "2025-11-07",
    "time": "10:00 - 10:30"
  }
}
```

---

### 5. **reschedule_appointment** - Change my appointment

**Endpoint:** `POST /api/llm/reschedule-appointment`

**Parameters:**
- `email` - Patient email
- `currentDate` - Current appointment date (YYYY-MM-DD)
- `newDate` - New date (YYYY-MM-DD)
- `newTime` - New start time (HH:MM)

**Example:**
```json
{
  "email": "patient@example.com",
  "currentDate": "2025-11-07",
  "newDate": "2025-11-08",
  "newTime": "14:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment rescheduled successfully",
  "rescheduled": {
    "from": {"date": "2025-11-07", "time": "10:00 - 10:30"},
    "to": {"date": "2025-11-08", "time": "14:00 - 14:30", "meetLink": "https://..."}
  }
}
```

---

## 🎯 Use with OpenAI Function Calling

```python
import openai

functions = [
    {
        "name": "book_appointment",
        "description": "Book an appointment for a patient",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {"type": "string"},
                "date": {"type": "string"},
                "time": {"type": "string"},
                "note": {"type": "string"}
            },
            "required": ["email", "date", "time"]
        }
    }
]

# LLM conversation
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Book me for tomorrow at 10 AM"}],
    functions=functions
)

# Call your API with LLM's parameters
# Returns: appointment with Google Meet link
```

---

## 📄 Files Created

1. **`LLM_FUNCTION_CALLING.json`** - Complete OpenAI function schemas
2. **`LLM_API.postman_collection.json`** - Postman collection for testing
3. **`LLM_INTEGRATION_GUIDE.md`** - Detailed integration guide
4. **`LLM_QUICK_START.md`** - This file

---

## 🧪 Test with Postman

**Import:** `LLM_API.postman_collection.json`

**Try:**
1. Check Availability → See available slots
2. Book Appointment → Get Meet link in response
3. Get Appointments → See all bookings
4. Cancel/Reschedule → Update bookings

---

## 🎤 Example Voice Conversations

**Patient:** "I need an appointment tomorrow"

```
LLM → check_availability(date: "2025-11-07")
LLM → "We have 10 AM, 2 PM, 3 PM available"
Patient → "10 AM works"
LLM → book_appointment(email, date: "2025-11-07", time: "10:00")
LLM → "Booked! You'll get an email with the Google Meet link"
```

**Patient:** "What are my appointments?"

```
LLM → get_patient_appointments(email: "patient@example.com")
LLM → "You have 1 appointment: Nov 7 at 10 AM. Here's your Meet link: [link]"
```

---

## ✅ Why These APIs are Better for LLMs

- ✅ **Only 1-4 parameters** (not 10+)
- ✅ **Clear, simple names** 
- ✅ **One endpoint per action**
- ✅ **Minimal required fields**
- ✅ **Smart defaults** (auto-fills 30-min duration)
- ✅ **Simple responses** (no nested complex objects)
- ✅ **All POST** (consistent method)

---

**Your API is now LLM-ready!** 🚀

