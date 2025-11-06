# 🤖 LLM Function Calling Integration Guide

This guide shows how to integrate the appointment management API with LLMs (OpenAI, Claude, etc.) for voice AI agents.

## 🎯 Simplified API for LLMs

I've created **5 simple endpoints** specifically designed for LLM function calling:

| Function | Endpoint | Parameters | Use Case |
|----------|----------|------------|----------|
| `check_availability` | `/api/llm/check-availability` | `date` | "What times are available?" |
| `book_appointment` | `/api/llm/book-appointment` | `email, date, time` | "Book me for 10 AM" |
| `get_patient_appointments` | `/api/llm/get-appointments` | `email` | "What are my appointments?" |
| `cancel_appointment` | `/api/llm/cancel-appointment` | `email, date` | "Cancel my appointment" |
| `reschedule_appointment` | `/api/llm/reschedule-appointment` | `email, currentDate, newDate, newTime` | "Reschedule to tomorrow" |

## 📋 Function Definitions for OpenAI

Use this JSON schema for OpenAI function calling:

```json
{
  "name": "check_availability",
  "description": "Check available appointment slots for a specific date",
  "parameters": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format (e.g., 2025-11-07)"
      }
    },
    "required": ["date"]
  }
}
```

```json
{
  "name": "book_appointment",
  "description": "Book an appointment for a patient. Creates Google Calendar event with Meet link.",
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
        "description": "Start time in HH:MM format (e.g., 10:00)"
      },
      "note": {
        "type": "string",
        "description": "Optional note about appointment reason"
      }
    },
    "required": ["email", "date", "time"]
  }
}
```

**Complete schema:** See `LLM_FUNCTION_CALLING.json`

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api/llm`

All endpoints use **POST** method for consistency.

### 1. Check Availability

**Endpoint:** `POST /api/llm/check-availability`

**Request:**
```json
{
  "date": "2025-11-07"
}
```

**Response:**
```json
{
  "success": true,
  "date": "2025-11-07",
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
  "count": 12,
  "message": "Found 12 available slots"
}
```

**When to use:** Patient asks "What times are available tomorrow?"

---

### 2. Book Appointment

**Endpoint:** `POST /api/llm/book-appointment`

**Request:**
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
    "id": "673abc123...",
    "email": "patient@example.com",
    "date": "2025-11-07",
    "time": "10:00 - 10:30",
    "meetLink": "https://meet.google.com/xxx-yyyy-zzz",
    "calendarLink": "https://calendar.google.com/..."
  }
}
```

**When to use:** Patient says "Book me for tomorrow at 10 AM"

**What happens automatically:**
- ✅ Creates appointment
- ✅ Adds to Google Calendar
- ✅ Generates Google Meet link
- ✅ Sends email invitation
- ✅ Sets reminders

---

### 3. Get Patient Appointments

**Endpoint:** `POST /api/llm/get-appointments`

**Request:**
```json
{
  "email": "patient@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "email": "patient@example.com",
  "appointments": [
    {
      "id": "673abc123...",
      "date": "2025-11-07",
      "time": "10:00 - 10:30",
      "status": "scheduled",
      "note": "Annual checkup",
      "meetLink": "https://meet.google.com/xxx-yyyy-zzz"
    }
  ],
  "count": 1,
  "message": "Found 1 appointment(s)"
}
```

**When to use:** Patient asks "What are my appointments?" or "Do I have any appointments?"

---

### 4. Cancel Appointment

**Endpoint:** `POST /api/llm/cancel-appointment`

**Request:**
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

**When to use:** Patient says "I need to cancel my appointment"

**What happens automatically:**
- ✅ Cancels appointment
- ✅ Deletes Google Calendar event
- ✅ Releases time slot
- ✅ Sends cancellation email

---

### 5. Reschedule Appointment

**Endpoint:** `POST /api/llm/reschedule-appointment`

**Request:**
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
    "from": {
      "date": "2025-11-07",
      "time": "10:00 - 10:30"
    },
    "to": {
      "date": "2025-11-08",
      "time": "14:00 - 14:30",
      "meetLink": "https://meet.google.com/xxx-yyyy-zzz"
    }
  }
}
```

**When to use:** Patient says "Can you reschedule to tomorrow at 2 PM?"

---

## 🎤 Example Voice AI Conversations

### Conversation 1: Booking

```
Patient: "I need to see the doctor tomorrow"

LLM: Calls check_availability("2025-11-07")
Response: Shows available times

LLM: "We have slots available at 9 AM, 10 AM, 2 PM, and 3 PM. What works for you?"

Patient: "10 AM works"

LLM: Calls book_appointment({
  email: "patient@example.com",
  date: "2025-11-07", 
  time: "10:00",
  note: "General consultation"
})

LLM: "Perfect! I've booked your appointment for tomorrow at 10 AM. 
      You'll receive an email with a Google Meet link for the video call."
```

### Conversation 2: Checking Appointments

```
Patient: "What appointments do I have?"

LLM: Calls get_patient_appointments({email: "patient@example.com"})

LLM: "You have 1 appointment scheduled:
      - November 7, 2025 at 10:00 AM
      Here's your Google Meet link: [link]"
```

### Conversation 3: Rescheduling

```
Patient: "I need to reschedule my appointment to the next day at 2 PM"

LLM: Calls reschedule_appointment({
  email: "patient@example.com",
  currentDate: "2025-11-07",
  newDate: "2025-11-08",
  newTime: "14:00"
})

LLM: "Done! I've rescheduled your appointment from November 7 at 10 AM 
      to November 8 at 2 PM. You'll receive an updated calendar invitation."
```

### Conversation 4: Cancellation

```
Patient: "I need to cancel my appointment tomorrow"

LLM: Calls cancel_appointment({
  email: "patient@example.com",
  date: "2025-11-07"
})

LLM: "Your appointment for November 7 at 10 AM has been cancelled. 
      The calendar event has been removed."
```

---

## 🔧 Integration Examples

### OpenAI GPT (Python)

```python
import openai
import requests

# Define functions for OpenAI
functions = [
    {
        "name": "book_appointment",
        "description": "Book an appointment for a patient",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Patient email"},
                "date": {"type": "string", "description": "Date (YYYY-MM-DD)"},
                "time": {"type": "string", "description": "Time (HH:MM)"},
                "note": {"type": "string", "description": "Optional note"}
            },
            "required": ["email", "date", "time"]
        }
    }
]

# Make LLM call
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Book me for tomorrow at 10 AM"}],
    functions=functions,
    function_call="auto"
)

# If LLM wants to call function
if response.choices[0].message.get("function_call"):
    function_call = response.choices[0].message.function_call
    args = json.loads(function_call.arguments)
    
    # Call your API
    result = requests.post(
        "http://localhost:5000/api/llm/book-appointment",
        json=args
    )
    
    print(result.json())
    # Returns: appointment with Google Meet link
```

### Anthropic Claude (Python)

```python
import anthropic
import requests

client = anthropic.Anthropic(api_key="your-key")

tools = [
    {
        "name": "book_appointment",
        "description": "Book an appointment with automatic Google Calendar and Meet link",
        "input_schema": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Patient email"},
                "date": {"type": "string", "description": "Date YYYY-MM-DD"},
                "time": {"type": "string", "description": "Time HH:MM"},
                "note": {"type": "string", "description": "Optional note"}
            },
            "required": ["email", "date", "time"]
        }
    }
]

response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "Book me for tomorrow at 10 AM"}]
)

# If Claude wants to use tool
if response.stop_reason == "tool_use":
    tool_use = next(block for block in response.content if block.type == "tool_use")
    
    # Call your API
    result = requests.post(
        "http://localhost:5000/api/llm/book-appointment",
        json=tool_use.input
    )
```

---

## 📦 Complete Function Schema

See `LLM_FUNCTION_CALLING.json` for complete OpenAI-compatible function definitions.

## 🚀 Quick Start

1. **Use the simplified endpoints** at `/api/llm/*`
2. **Load function definitions** from `LLM_FUNCTION_CALLING.json`
3. **Let LLM decide** when to call functions based on user input
4. **Call the API** with LLM-generated parameters
5. **Return results** to user

## 💡 Why These APIs are LLM-Friendly

✅ **Minimal parameters** - Only essential fields required  
✅ **Clear naming** - Intuitive function names  
✅ **Simple responses** - Easy for LLMs to parse  
✅ **Consistent structure** - All POST, all JSON  
✅ **Smart defaults** - Auto-fills missing details  
✅ **Error messages** - Clear, actionable errors  

## 🧪 Test with Postman

I'll create a Postman collection for these simplified endpoints too!

---

## 🎯 Production Considerations

### Add Authentication
```javascript
// Add API key middleware
app.use('/api/llm', apiKeyAuth);
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
app.use('/api/llm', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

### Logging
```javascript
// Log all LLM API calls for monitoring
app.use('/api/llm', requestLogger);
```

---

**Your API is now optimized for LLM function calling!** 🤖

