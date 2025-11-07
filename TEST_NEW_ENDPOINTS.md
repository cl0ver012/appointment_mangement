# 🧪 Quick Test Guide - New LLM API Endpoints

## Prerequisites

1. Backend server running: `cd backend && npm start`
2. Database has some available slots (use `add-demo-data.js` if needed)

---

## Quick Test with cURL

### 1. Test "Next 7 Days" Endpoint ⭐ (Most Popular)

```bash
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

**Expected Result:**
- Shows all available slots for next 7 days
- Grouped by date
- Total count of slots

---

### 2. Test "Date Range" Endpoint

```bash
curl -X POST http://localhost:5000/api/llm/check-availability-range \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-11-07",
    "endDate": "2025-11-15"
  }'
```

**Expected Result:**
- Shows slots between the two dates
- Grouped by date
- Summary statistics

---

### 3. Test "Next Available" Endpoint

```bash
curl -X POST http://localhost:5000/api/llm/get-next-available \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

**Expected Result:**
- Shows next 5 available slots
- Sorted chronologically
- Includes dates and times

---

## Test with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Select: `LLM_Simple.postman_collection.json`
4. Done! All 8 endpoints ready to test

### Test the New Endpoints

**Test 1: Next 7 Days**
- Open: "1B. Check Availability - Next N Days"
- Click "Send"
- See all slots for next week in one response!

**Test 2: Date Range**
- Open: "1A. Check Availability - Date Range"
- Modify dates if needed
- Click "Send"

**Test 3: Next Available**
- Open: "1C. Get Next Available"
- Change limit if desired
- Click "Send"

---

## Test Scenarios

### Scenario 1: User Wants "Next Week"

**Old Way (7 API calls):**
```bash
# Would need to call this 7 times with different dates
curl -X POST http://localhost:5000/api/llm/check-availability \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-07"}'
  
curl -X POST http://localhost:5000/api/llm/check-availability \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-08"}'
  
# ... 5 more times
```

**New Way (1 API call):**
```bash
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

✅ **Result: 85% fewer API calls!**

---

### Scenario 2: User Wants "Next Available"

**New Way (Instant):**
```bash
curl -X POST http://localhost:5000/api/llm/get-next-available \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response in < 300ms with next 10 available slots!

---

### Scenario 3: User Wants Specific Date Range

```bash
curl -X POST http://localhost:5000/api/llm/check-availability-range \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-12-01",
    "endDate": "2025-12-31"
  }'
```

Get entire month's availability in one call!

---

## Performance Testing

### Compare Old vs New

**Test Setup:**
```bash
# Start timing
time curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

**Expected Results:**
- Response time: < 500ms
- Single HTTP request
- All data in one response

**Compare to Old Way:**
- Would need 7 sequential calls
- Total time: ~2-3 seconds
- 7x network overhead

---

## Response Examples

### Next N Days Response

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
      },
      {
        "time": "10:00 - 10:30",
        "startTime": "10:00",
        "endTime": "10:30"
      }
    ]
  },
  "message": "Found 18 available slots across 5 dates in the next 7 days"
}
```

### Next Available Response

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

## Error Cases to Test

### Test 1: Invalid Range (Too Large)
```bash
curl -X POST http://localhost:5000/api/llm/check-availability-range \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-11-07",
    "endDate": "2026-03-15"
  }'
```

**Expected:**
```json
{
  "success": false,
  "message": "Date range cannot exceed 90 days"
}
```

### Test 2: Invalid Days
```bash
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 100}'
```

**Expected:**
```json
{
  "success": false,
  "message": "Days must be a number between 1 and 90"
}
```

---

## Integration Test

### Full Booking Flow with New API

```bash
# Step 1: Check availability (NEW - efficient!)
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'

# Step 2: Book selected slot
curl -X POST http://localhost:5000/api/llm/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "date": "2025-11-08",
    "time": "10:00",
    "note": "Testing new API"
  }'

# Step 3: Verify booking
curl -X POST http://localhost:5000/api/llm/get-appointments \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## Checklist

Test each endpoint:
- [ ] ✅ check-availability-next-days
- [ ] ✅ check-availability-range  
- [ ] ✅ get-next-available
- [ ] ✅ Error handling (invalid range)
- [ ] ✅ Error handling (invalid days)
- [ ] ✅ Full booking flow
- [ ] ✅ Performance comparison

---

## Troubleshooting

### No Slots Returned

**Solution:** Add demo data
```bash
cd backend
node add-demo-data.js
```

### Server Not Running

**Solution:** Start the server
```bash
cd backend
npm start
```

### Connection Refused

**Check:**
- Server is running on port 5000
- MongoDB is connected
- Check console for errors

---

## Success Criteria

✅ **All tests pass if:**

1. Next 7 days endpoint returns slots grouped by date
2. Date range endpoint handles custom ranges
3. Next available returns sorted slots
4. Error handling works for invalid inputs
5. Response time < 500ms for all endpoints
6. All responses follow consistent JSON structure

---

## 🎉 You're Done!

Your new efficient LLM API endpoints are working!

**Next Steps:**
1. Update your LLM agent to use these new endpoints
2. Enjoy 85-90% reduction in API calls
3. See much faster response times

---

**For detailed documentation, see: `LLM_API_SIMPLE_GUIDE.md`**

