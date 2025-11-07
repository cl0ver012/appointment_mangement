# 📮 Postman Collections Guide

## Available Collections

You now have **2 Postman collections** for testing your API:

### 1. **LLM_Simple.postman_collection.json** ⭐
**Best for:** LLM/AI agent development
- **8 simplified endpoints** optimized for AI agents
- All use POST method for consistency
- Minimal parameters
- Easy for LLM function calling

### 2. **Appointment_Management_API.postman_collection.json** 📋
**Best for:** Complete system testing
- **Full REST API** with all CRUD operations
- Includes traditional GET/POST/PUT/DELETE methods
- **Plus** the new LLM API section with all 8 endpoints
- Comprehensive testing scenarios

---

## Quick Start

### Import Both Collections

1. Open Postman
2. Click **"Import"**
3. Select **both** collection files:
   - `LLM_Simple.postman_collection.json`
   - `Appointment_Management_API.postman_collection.json`
4. Click **"Import"**

### Configure Base URL

**For local testing:**
- Base URL is already set to: `http://localhost:5000/api`
- No changes needed!

**For production:**
1. Click on collection name
2. Go to **"Variables"** tab
3. Update `base_url` to your deployed URL:
   - Example: `https://your-app.railway.app/api`

---

## Collection 1: LLM_Simple (For AI Agents)

### Structure
```
LLM_Simple.postman_collection.json
├── 1. Check Available Slots (single day)
├── 1A. Check Availability - Date Range ⚡ NEW
├── 1B. Check Availability - Next N Days ⚡ NEW
├── 1C. Get Next Available ⚡ NEW
├── 2. Book Appointment
├── 3. Get Patient Appointments
├── 4. Cancel Appointment
└── 5. Reschedule Appointment
```

### Quick Test Flow

**Test 1: Check Next Week (NEW!)**
```
1. Open "1B. Check Availability - Next N Days"
2. Body is already set: {"days": 7}
3. Click "Send"
4. See entire week in ONE response! 🚀
```

**Test 2: Next Available (NEW!)**
```
1. Open "1C. Get Next Available"
2. Body: {"limit": 5}
3. Click "Send"
4. Get 5 soonest slots instantly!
```

**Test 3: Book Appointment**
```
1. Open "2. Book Appointment"
2. Update email and date
3. Click "Send"
4. Get appointment with Meet link!
```

---

## Collection 2: Complete API (Full System)

### Structure
```
Appointment_Management_API.postman_collection.json
├── Health Check
├── Appointments (CRUD operations)
├── Slots (Management)
├── Voice AI Examples
└── LLM API - Optimized for AI Agents ⚡ NEW
    ├── Availability Checking (4 Options)
    │   ├── 1. Check Single Day
    │   ├── 1A. Check Next N Days ⚡
    │   ├── 1B. Check Date Range ⚡
    │   └── 1C. Get Next Available ⚡
    ├── Appointment Management
    │   ├── 2. Book Appointment
    │   ├── 3. Get Patient Appointments
    │   ├── 4. Cancel Appointment
    │   └── 5. Reschedule Appointment
    └── Complete User Journey Examples
        ├── Journey 1: Quick Next Week Check
        ├── Journey 2: Find Next Available & Book
        ├── Journey 3: Check Month & Book
        └── Journey 4: Reschedule Existing
```

### Key Features

**New LLM API Section includes:**
- All 8 LLM endpoints with detailed descriptions
- Performance comparison notes (old vs new)
- Complete user journey examples
- When to use which endpoint guide

---

## Testing the New Endpoints

### Scenario 1: Weekly Availability Check

**Using LLM_Simple:**
```
1. Select "1B. Check Availability - Next N Days"
2. Send request with: {"days": 7}
3. Response shows all slots for 7 days grouped by date
```

**Using Complete API:**
```
1. Navigate to: LLM API → Availability Checking → 1A. Check Next N Days
2. Read the detailed description
3. Send request
4. Compare with "Journey 1" example
```

---

### Scenario 2: Find and Book Next Available

**Step-by-step:**
```
1. Use "1C. Get Next Available" with {"limit": 3}
   Response: Next 3 available slots

2. User chooses first slot (e.g., Nov 8 at 10:00)

3. Use "2. Book Appointment":
   {
     "email": "patient@example.com",
     "date": "2025-11-08",
     "time": "10:00",
     "note": "Booked via agent"
   }

4. Response includes Meet link and calendar event!
```

---

### Scenario 3: Complete Booking Flow

**Using Journey Examples (Complete API):**
```
1. Try "Journey 1: Quick Next Week Check"
   See: 85% reduction in API calls!

2. Try "Journey 2: Find Next Available & Book"
   See: Instant results!

3. Try "Journey 3: Check Month & Book"
   See: 96% reduction in API calls!
```

---

## Which Collection Should You Use?

### Use **LLM_Simple** when:
- ✅ Developing AI agents
- ✅ Testing function calling
- ✅ Quick endpoint testing
- ✅ Learning the LLM API

### Use **Complete API** when:
- ✅ Full system testing
- ✅ Testing all REST operations
- ✅ Viewing journey examples
- ✅ Production testing
- ✅ Comprehensive API exploration

### Use **Both** when:
- ✅ Complete development workflow
- ✅ Comparing approaches
- ✅ Training team members

---

## Request Examples

### Example 1: Check Next 7 Days (NEW!)

**Endpoint:** `POST /api/llm/check-availability-next-days`

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

---

### Example 2: Get Next Available (NEW!)

**Endpoint:** `POST /api/llm/get-next-available`

**Request:**
```json
{
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
    }
  ],
  "count": 2,
  "message": "Found 2 upcoming available slots"
}
```

---

### Example 3: Date Range (NEW!)

**Endpoint:** `POST /api/llm/check-availability-range`

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
  "totalAvailableSlots": 24,
  "datesWithAvailability": 6,
  "slotsByDate": {
    "2025-11-10": [...],
    "2025-11-12": [...],
    "2025-11-15": [...]
  },
  "message": "Found 24 available slots across 6 dates"
}
```

---

## Performance Testing in Postman

### Test Old vs New Approach

**Old Way (for comparison):**
```
You would need to call check-availability 7 times:
1. POST /api/llm/check-availability {"date": "2025-11-07"}
2. POST /api/llm/check-availability {"date": "2025-11-08"}
3. POST /api/llm/check-availability {"date": "2025-11-09"}
... (repeat 4 more times)

Total: 7 API calls, ~2-3 seconds
```

**New Way (efficient!):**
```
Single call:
POST /api/llm/check-availability-next-days {"days": 7}

Total: 1 API call, ~300ms ⚡
```

**How to measure in Postman:**
1. Look at response time in bottom right
2. Compare single-day vs multi-day calls
3. See the dramatic difference!

---

## Tips & Best Practices

### 1. Use Environment Variables
```
1. Create environment: "Development"
2. Add variable: base_url = http://localhost:5000/api
3. Create environment: "Production"
4. Add variable: base_url = https://your-app.railway.app/api
5. Switch between them easily!
```

### 2. Save Example Responses
```
1. After successful request, click "Save Response"
2. Click "Save as Example"
3. Now you have reference examples!
```

### 3. Organize Tests
```
1. Use folders to group related tests
2. Add descriptions to each request
3. Use test scripts for validation
```

### 4. Test Error Cases
```
Try invalid inputs to test error handling:
- {"days": 100}  // Should fail (max 90)
- {"startDate": "2025-12-31", "endDate": "2025-01-01"}  // Should fail
- {"limit": -5}  // Should fail
```

---

## Common Issues & Solutions

### Issue: "Connection Refused"
**Solution:** 
```bash
# Make sure server is running:
cd backend
npm start

# Should see: "Server is running on port 5000"
```

### Issue: "No slots returned"
**Solution:** 
```bash
# Add demo data:
cd backend
node add-demo-data.js
```

### Issue: "Base URL wrong"
**Solution:**
```
1. Click collection name
2. Variables tab
3. Check base_url value
4. For local: http://localhost:5000/api
5. No trailing slash!
```

---

## Quick Reference

### Availability Endpoints (Choose Based on Need)

| User Query | Endpoint | Body |
|------------|----------|------|
| "What's tomorrow?" | `/check-availability` | `{"date": "2025-11-08"}` |
| "Show next week" | `/check-availability-next-days` ⚡ | `{"days": 7}` |
| "Nov 10-20?" | `/check-availability-range` ⚡ | `{"startDate": "...", "endDate": "..."}` |
| "Next available?" | `/get-next-available` ⚡ | `{"limit": 5}` |

⚡ = New efficient endpoints!

### Management Endpoints

| Action | Endpoint | Required Fields |
|--------|----------|-----------------|
| Book | `/book-appointment` | email, date, time |
| View | `/get-appointments` | email |
| Cancel | `/cancel-appointment` | email, date |
| Reschedule | `/reschedule-appointment` | email, currentDate, newDate, newTime |

---

## Next Steps

1. ✅ Import both collections
2. ✅ Test the 3 new endpoints (1A, 1B, 1C)
3. ✅ Try the journey examples
4. ✅ Compare old vs new performance
5. ✅ Integrate into your LLM agent

---

## Summary

You now have:
- ✅ **2 comprehensive Postman collections**
- ✅ **8 LLM API endpoints** (5 original + 3 new)
- ✅ **Complete user journey examples**
- ✅ **Performance comparison demonstrations**
- ✅ **Detailed documentation in each request**

**Start testing your 90% faster API now!** 🚀

---

**Need more help?** Check:
- `LLM_API_SIMPLE_GUIDE.md` - Complete API documentation
- `TEST_NEW_ENDPOINTS.md` - cURL testing examples
- `BEFORE_AFTER_COMPARISON.md` - Performance analysis

