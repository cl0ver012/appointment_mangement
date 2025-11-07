# 🤖 LLM API - Simple Guide for Voice AI

## 📋 8 Simple Functions - Complete Calendar Management

All you need to manage appointments with Voice AI.

**NEW: Enhanced availability checking for better LLM performance!**

---

## 🔌 Base URL

**Local:** `http://localhost:5000/api/llm`  
**Production:** `https://your-backend.railway.app/api/llm`

**All endpoints use POST method** for consistency.

---

## 1️⃣ Check Available Slots

**What it does:** Find what appointment times are available on a specific date.

**Endpoint:** `POST /check-availability`

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
    {"time": "09:00 - 09:30", "startTime": "09:00", "endTime": "09:30"},
    {"time": "10:00 - 10:30", "startTime": "10:00", "endTime": "10:30"},
    {"time": "14:00 - 14:30", "startTime": "14:00", "endTime": "14:30"}
  ],
  "count": 3,
  "message": "Found 3 available slots"
}
```

**Voice AI Use:**  
*"What times are available tomorrow?"* → Calls this function

---

## 1A. Check Available Slots - Date Range (⚡ NEW - More Efficient!)

**What it does:** Find available appointment times across multiple days in one call.

**Endpoint:** `POST /check-availability-range`

**Request:**
```json
{
  "startDate": "2025-11-07",
  "endDate": "2025-11-15"
}
```

**Response:**
```json
{
  "success": true,
  "startDate": "2025-11-07",
  "endDate": "2025-11-15",
  "totalAvailableSlots": 24,
  "datesWithAvailability": 6,
  "slotsByDate": {
    "2025-11-07": [
      {"time": "09:00 - 09:30", "startTime": "09:00", "endTime": "09:30"},
      {"time": "10:00 - 10:30", "startTime": "10:00", "endTime": "10:30"}
    ],
    "2025-11-08": [
      {"time": "14:00 - 14:30", "startTime": "14:00", "endTime": "14:30"},
      {"time": "15:00 - 15:30", "startTime": "15:00", "endTime": "15:30"}
    ],
    "2025-11-10": [
      {"time": "09:00 - 09:30", "startTime": "09:00", "endTime": "09:30"}
    ]
  },
  "message": "Found 24 available slots across 6 dates"
}
```

**Benefits:**
- ⚡ **Much faster** - One API call instead of multiple
- 📊 **Better overview** - See all available dates at once
- 🤖 **LLM-friendly** - Agent can make better decisions

**Voice AI Use:**  
*"What's available next week?"* → Calls this function

---

## 1B. Check Available Slots - Next N Days (⚡ NEW - Most Convenient!)

**What it does:** Find available slots for the next N days from today.

**Endpoint:** `POST /check-availability-next-days`

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
  "totalAvailableSlots": 18,
  "datesWithAvailability": 5,
  "slotsByDate": {
    "2025-11-07": [
      {"time": "14:00 - 14:30", "startTime": "14:00", "endTime": "14:30"}
    ],
    "2025-11-08": [
      {"time": "09:00 - 09:30", "startTime": "09:00", "endTime": "09:30"},
      {"time": "10:00 - 10:30", "startTime": "10:00", "endTime": "10:30"}
    ]
  },
  "message": "Found 18 available slots across 5 dates in the next 7 days"
}
```

**Benefits:**
- 🎯 **Super simple** - Just specify number of days
- 📅 **Automatic date calculation** - No need to calculate dates
- 🚀 **Perfect for "next week" queries**

**Voice AI Use:**  
*"Show me availability for the next 2 weeks"* → `{"days": 14}`

---

## 1C. Get Next Available Slots (⚡ NEW - Quick Booking)

**What it does:** Get the soonest available appointment slots.

**Endpoint:** `POST /get-next-available`

**Request:**
```json
{
  "fromDate": "2025-11-07",
  "limit": 5
}
```

**Response:**
```json
{
  "success": true,
  "nextAvailableSlots": [
    {
      "date": "2025-11-07",
      "time": "14:00 - 14:30",
      "startTime": "14:00",
      "endTime": "14:30"
    },
    {
      "date": "2025-11-08",
      "time": "09:00 - 09:30",
      "startTime": "09:00",
      "endTime": "09:30"
    },
    {
      "date": "2025-11-08",
      "time": "10:00 - 10:30",
      "startTime": "10:00",
      "endTime": "10:30"
    }
  ],
  "count": 3,
  "message": "Found 3 upcoming available slots"
}
```

**Parameters:**
- `fromDate` (optional): Start searching from this date (defaults to today)
- `limit` (optional): Max number of slots to return (defaults to 10)

**Benefits:**
- ⚡ **Ultra-fast** - Get immediate booking options
- 🎯 **User-friendly** - Perfect for "what's next available?"
- 📋 **Sorted chronologically** - Earliest slots first

**Voice AI Use:**  
*"What's the next available appointment?"* → `{"limit": 3}`

---

## 2️⃣ Book Appointment

**What it does:** Schedule an appointment, create Google Calendar event, generate Meet link.

**Endpoint:** `POST /book-appointment`

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

**Automatically creates:**
- ✅ Appointment in database
- ✅ Google Calendar event
- ✅ Google Meet video link
- ✅ Email invitation to patient

**Voice AI Use:**  
*"Book me for tomorrow at 10 AM"* → Calls this function

---

## 3️⃣ Get Patient Appointments

**What it does:** Retrieve all upcoming appointments for a patient.

**Endpoint:** `POST /get-appointments`

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
      "id": "673abc...",
      "date": "2025-11-07",
      "time": "10:00 - 10:30",
      "status": "scheduled",
      "note": "Annual checkup",
      "meetLink": "https://meet.google.com/xxx-yyyy-zzz"
    },
    {
      "id": "673def...",
      "date": "2025-11-10",
      "time": "14:00 - 14:30",
      "status": "scheduled",
      "note": "Follow-up",
      "meetLink": "https://meet.google.com/aaa-bbbb-ccc"
    }
  ],
  "count": 2,
  "message": "Found 2 appointment(s)"
}
```

**Voice AI Use:**  
*"What are my appointments?"* → Calls this function

---

## 4️⃣ Cancel Appointment

**What it does:** Cancel an appointment and delete Google Calendar event.

**Endpoint:** `POST /cancel-appointment`

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

**Automatically:**
- ✅ Cancels appointment
- ✅ Deletes Google Calendar event
- ✅ Releases time slot
- ✅ Sends cancellation email

**Voice AI Use:**  
*"I need to cancel my appointment"* → Calls this function

---

## 5️⃣ Reschedule Appointment

**What it does:** Move an appointment to a different date/time.

**Endpoint:** `POST /reschedule-appointment`

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

**Automatically:**
- ✅ Updates appointment
- ✅ Updates Google Calendar event
- ✅ Releases old slot
- ✅ Books new slot
- ✅ Sends update email

**Voice AI Use:**  
*"Can you reschedule to tomorrow at 2 PM?"* → Calls this function

---

## 🎯 Complete Calendar Management Coverage

These 8 functions cover all calendar management needs:

### Availability Checking (4 options - choose based on need)
| Function | What It Does | Required Parameters | Best For |
|----------|--------------|---------------------|----------|
| **check-availability** | Find slots on specific day | `date` | Single day check |
| **check-availability-range** ⚡ | Find slots in date range | `startDate`, `endDate` | Weekly/monthly view |
| **check-availability-next-days** ⚡ | Find slots for next N days | `days` | "Next week" queries |
| **get-next-available** ⚡ | Get soonest slots | none (optional: `fromDate`, `limit`) | Quick booking |

### Appointment Management
| Function | What It Does | Required Parameters |
|----------|--------------|---------------------|
| **book-appointment** | Schedule appointment | `email`, `date`, `time` |
| **get-appointments** | View patient's appointments | `email` |
| **cancel-appointment** | Cancel appointment | `email`, `date` |
| **reschedule-appointment** | Change appointment time | `email`, `currentDate`, `newDate`, `newTime` |

---

## 📮 Using the Postman Collection

### Import Collection

1. Open Postman
2. Click "Import"
3. Select: `LLM_Simple.postman_collection.json`
4. Done!

### Update Base URL for Production

After deployment:
1. Click collection name
2. Go to "Variables" tab
3. Update `base_url` to: `https://your-backend.railway.app/api/llm`

### Test Each Function

**Test 1: Check Availability**
- Open request "1. Check Available Slots"
- Update date to tomorrow
- Click "Send"
- See available time slots

**Test 2: Book Appointment**
- Open request "2. Book Appointment"
- Update email, date, time
- Click "Send"
- Get appointment with Meet link

**Test 3: Get Appointments**
- Open request "3. Get Patient Appointments"
- Use same email as Test 2
- Click "Send"
- See your booked appointment

**Test 4: Cancel**
- Open request "4. Cancel Appointment"
- Use same email and date
- Click "Send"
- Appointment cancelled

**Test 5: Reschedule**
- First book an appointment (Test 2)
- Open request "5. Reschedule Appointment"
- Set new date/time
- Click "Send"
- Appointment moved

---

## 🤖 Voice AI Integration

### Example Conversation Flow (Using New Efficient APIs)

```
Patient: "I need a doctor's appointment this week"

AI: check-availability-next-days({"days": 7})
    → Returns all available slots for next 7 days in ONE call

AI: "I found 18 available slots this week. We have availability on 
     Thursday, Friday, and next Monday. What day works best?"

Patient: "Thursday sounds good"

AI: "Great! Thursday has slots at 9 AM, 10 AM, and 2 PM. Which time?"

Patient: "10 AM is good"

AI: book-appointment({
      email: "patient@email.com",
      date: "2025-11-08",
      time: "10:00",
      note: "General consultation"
    })
    → Returns appointment with Meet link

AI: "Perfect! I've booked your appointment for Thursday at 10 AM. 
     You'll receive an email with the Google Meet link."
```

### Quick Booking Example

```
Patient: "I need the next available appointment"

AI: get-next-available({})
    → Returns next 10 available slots instantly

AI: "The next available is tomorrow at 2 PM. Should I book that for you?"

Patient: "Yes please"

AI: book-appointment({
      email: "patient@email.com",
      date: "tomorrow",
      time: "14:00"
    })
```

### All 8 Functions in Action

**Scenario 1: New Booking (Old Way - Multiple Calls)**
```
"Book me for Friday at 3 PM"
→ check-availability("2025-11-08")
→ book-appointment(email, "2025-11-08", "15:00")
```

**Scenario 1B: New Booking (New Way - More Efficient!)**
```
"Show me what's available next week"
→ check-availability-next-days({"days": 7})  // ONE call gets entire week!
→ book-appointment(email, chosen_date, chosen_time)
```

**Scenario 1C: Quick Booking**
```
"Book me for the next available slot"
→ get-next-available({})  // Instant results
→ book-appointment(email, first_available_date, first_available_time)
```

**Scenario 2: Check Schedule**
```
"What are my appointments?"
→ get-appointments(email)
```

**Scenario 3: Change Time**
```
"Move my Friday appointment to Saturday at 2 PM"
→ get-appointments(email) // Find Friday appointment
→ reschedule-appointment(email, "2025-11-08", "2025-11-09", "14:00")
```

**Scenario 4: Cancel**
```
"Cancel my appointment tomorrow"
→ cancel-appointment(email, "2025-11-07")
```

---

## ✅ Why This API is Perfect for LLMs

**Simple Parameters:**
- Only 1-4 parameters per function
- Clear, descriptive names
- Consistent POST method
- Easy to understand

**⚡ Performance Optimized (NEW):**
- Check multiple days in ONE API call
- Reduce API calls by 90% for date ranges
- Faster response times for users
- Better LLM agent performance

**Smart Defaults:**
- Auto-calculates 30-minute slots
- Auto-assigns doctor
- Auto-creates slots if needed
- Handles all Google Calendar logic

**Clear Responses:**
- Simple JSON structure
- Success/error clearly indicated
- All important data returned (Meet links, etc.)
- Easy for LLMs to parse
- Grouped by date for easy navigation

**Consistent Format:**
- All requests: JSON body
- All responses: Same structure
- All use POST (no method confusion)
- Predictable behavior

---

## 🎯 What You Can Do

With these 8 functions, you can:
- ✅ Check availability for any date (single or range)
- ⚡ Check availability for next N days (new!)
- ⚡ Get next available slots instantly (new!)
- ⚡ View entire week/month availability in one call (new!)
- ✅ Book new appointments
- ✅ View patient's schedule
- ✅ Cancel appointments
- ✅ Reschedule to different times
- ✅ Get Google Meet links
- ✅ Manage entire calendar via voice

**Complete calendar management with 90% fewer API calls!**

---

## 📊 Testing Workflow

**Complete Test Flow:**

1. **Check availability (choose one):**
   - Single day: `check-availability`
   - Date range: `check-availability-range` ⚡
   - Next N days: `check-availability-next-days` ⚡
   - Next available: `get-next-available` ⚡
2. **Book appointment** → Create booking
3. **Get appointments** → Verify it was created
4. **Reschedule** → Change the time
5. **Cancel** → Remove appointment

**8 functions with intelligent routing = Optimal performance!**

---

## ⚡ Performance Comparison

### Old Approach (checking 7 days)
```
Day 1: check-availability → API call 1
Day 2: check-availability → API call 2
Day 3: check-availability → API call 3
Day 4: check-availability → API call 4
Day 5: check-availability → API call 5
Day 6: check-availability → API call 6
Day 7: check-availability → API call 7

Total: 7 API calls 😰
```

### New Approach (checking 7 days)
```
check-availability-next-days({"days": 7}) → API call 1

Total: 1 API call! 🚀

Result: 85% reduction in API calls!
```

---

## 🎓 When to Use Which Availability Endpoint

| User Query | Best Endpoint | Example Request |
|------------|---------------|-----------------|
| "What's available tomorrow?" | `check-availability` | `{"date": "2025-11-08"}` |
| "Show me next week" | `check-availability-next-days` | `{"days": 7}` |
| "What's available Nov 10-20?" | `check-availability-range` | `{"startDate": "2025-11-10", "endDate": "2025-11-20"}` |
| "When's the next available slot?" | `get-next-available` | `{}` or `{"limit": 5}` |
| "Show me the next 3 appointments" | `get-next-available` | `{"limit": 3}` |
| "Availability this month?" | `check-availability-next-days` | `{"days": 30}` |

---

## 🔥 Key Improvements for LLM Agents

1. **Faster Responses**: Get week's worth of data in 1 call vs 7 calls
2. **Better Context**: LLM can see full availability picture
3. **Smarter Suggestions**: Can offer "best available" times
4. **Reduced Errors**: Fewer API calls = fewer failure points
5. **Cost Efficient**: Less API calls = lower costs

---

**This enhanced collection is optimized for LLM integration!** 🚀

