# 🏥 Setup Realistic Doctor Schedule

## Quick Start

### Create 3 Months of Realistic Slots

```bash
cd backend
npm run create-slots
```

That's it! Your doctor now has a realistic schedule for the next 3 months.

---

## What Gets Created

### Schedule Details

**Time Period:** Next 3 months (90 days)

**Working Days:** Weekdays only (Monday - Friday)
- Weekends automatically excluded
- ~10% random days off (vacation/conferences)

**Daily Schedule Variations:**
- 🌅 **Morning Clinic** (9:00 - 12:00): 6 slots
- 🌆 **Afternoon Clinic** (14:00 - 17:00): 6 slots  
- 📅 **Full Day** (9:00-12:00 & 14:00-16:00): 10 slots
- ⏰ **Short Morning** (10:00 - 12:00): 4 slots
- ⏰ **Short Afternoon** (15:00 - 17:00): 4 slots

**All slots are 30 minutes each**

---

## Realistic Features

### 1. **Varies by Day of Week**
- **Monday, Wednesday, Friday:** More morning clinics
- **Tuesday, Thursday:** More variety (short sessions, afternoon focus)

### 2. **Random Variations**
- ~10% days off for vacation/conferences/meetings
- Different schedule templates each day
- Mimics real doctor availability patterns

### 3. **Professional Schedule**
- Lunch break (12:00 - 14:00) included
- No early morning or late evening slots
- Realistic 2-3 hour clinic sessions
- Weekends completely free

---

## Expected Output

```
🏥 Creating realistic doctor schedule for next 3 months...

📋 Clearing existing slots...
✅ Existing slots cleared

  2025-11-07 (Thu): Afternoon Clinic - 6 slots
  2025-11-08 (Fri): Morning Clinic - 6 slots
  2025-11-11 (Mon): Full Day - 10 slots
  2025-11-12 (Tue): Short Morning - 4 slots
  2025-11-13 (Wed): No clinic (day off)
  2025-11-14 (Thu): Short Afternoon - 4 slots
  ...

✅ Realistic schedule created successfully!

📊 Summary:
   Total days: 90
   Weekdays: 64
   Working days: 58 (approx.)
   Total available slots: 348
   Average slots per working day: 5.4
   Date range: 2025-11-07 to 2026-02-05

📅 Sample schedule for first week:
   2025-11-07 (Thu):
      14:00 - 14:30
      14:30 - 15:00
      15:00 - 15:30
      ...

🎉 Done! Your doctor now has a realistic schedule for the next 3 months!
```

---

## Testing the Schedule

### Test 1: Check Next Week
```bash
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

### Test 2: Check Next Month
```bash
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

### Test 3: Get Next Available
```bash
curl -X POST http://localhost:5000/api/llm/get-next-available \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'
```

### Test 4: Use Postman
1. Open Postman
2. Import `LLM_Simple.postman_collection.json`
3. Try "1B. Check Availability - Next N Days"
4. See realistic schedule!

---

## Sample Weekly Schedule

### Typical Week (Example)

**Monday**
```
Full Day Clinic
├── 09:00 - 09:30
├── 09:30 - 10:00
├── 10:00 - 10:30
├── 10:30 - 11:00
├── 11:00 - 11:30
├── 11:30 - 12:00
├── [Lunch Break]
├── 14:00 - 14:30
├── 14:30 - 15:00
├── 15:00 - 15:30
└── 15:30 - 16:00
Total: 10 slots
```

**Tuesday**
```
Short Afternoon
├── 15:00 - 15:30
├── 15:30 - 16:00
├── 16:00 - 16:30
└── 16:30 - 17:00
Total: 4 slots
```

**Wednesday**
```
Morning Clinic
├── 09:00 - 09:30
├── 09:30 - 10:00
├── 10:00 - 10:30
├── 10:30 - 11:00
├── 11:00 - 11:30
└── 11:30 - 12:00
Total: 6 slots
```

**Thursday**
```
Afternoon Clinic
├── 14:00 - 14:30
├── 14:30 - 15:00
├── 15:00 - 15:30
├── 15:30 - 16:00
├── 16:00 - 16:30
└── 16:30 - 17:00
Total: 6 slots
```

**Friday**
```
Morning Clinic
├── 09:00 - 09:30
├── 09:30 - 10:00
├── 10:00 - 10:30
├── 10:30 - 11:00
├── 11:00 - 11:30
└── 11:30 - 12:00
Total: 6 slots
```

**Weekend:** Off

**Weekly Total:** ~30-35 slots

---

## Customization Options

### Change Time Period

Edit `create-realistic-slots.js`:

```javascript
// For 6 months instead of 3:
const endDate = addDays(startDate, 180);

// For 1 month:
const endDate = addDays(startDate, 30);
```

### Change Working Hours

Edit the `scheduleTemplates` array:

```javascript
// Example: Add evening clinic
{
  name: 'Evening Clinic',
  slots: [
    { startTime: '17:00', endTime: '17:30' },
    { startTime: '17:30', endTime: '18:00' },
    { startTime: '18:00', endTime: '18:30' },
    { startTime: '18:30', endTime: '19:00' }
  ]
}
```

### Change Slot Duration

Modify the time intervals in slots:

```javascript
// For 15-minute slots:
{ startTime: '09:00', endTime: '09:15' },
{ startTime: '09:15', endTime: '09:30' },

// For 1-hour slots:
{ startTime: '09:00', endTime: '10:00' },
{ startTime: '10:00', endTime: '11:00' }
```

---

## Troubleshooting

### Issue: "MongoDB connection failed"
```bash
# Make sure MongoDB is running
# For Docker:
docker ps  # Check if MongoDB container is running

# For local MongoDB:
sudo systemctl status mongodb
```

### Issue: "No slots created"
```bash
# Check your .env file has correct MongoDB URI
cat .env | grep MONGODB_URI

# Try connecting manually:
mongo mongodb://localhost:27017/appointment_management
```

### Issue: "Want to start over"
```bash
# Just run the script again - it clears old data first
npm run create-slots
```

---

## Comparison with Old Demo Data

### Old Demo Script (`add-demo-data.js`)
- ❌ Limited to specific dates
- ❌ Fixed schedule (same every day)
- ❌ Manual date updates needed
- ❌ Not realistic

### New Realistic Script (`create-realistic-slots.js`)
- ✅ Automatic 3-month generation
- ✅ Varied realistic schedules
- ✅ Always uses current date as start
- ✅ Mimics real doctor patterns
- ✅ Includes days off
- ✅ Different schedule per day

---

## Usage in LLM Agent

Your AI agent will now see realistic availability:

```javascript
// Agent query: "Show me availability this month"
const response = await fetch('/api/llm/check-availability-next-days', {
  method: 'POST',
  body: JSON.stringify({ days: 30 })
});

// Response shows realistic doctor schedule:
// - Some days with morning clinics
// - Some days with afternoon clinics
// - Some days with no availability
// - Weekends always free
// - Natural variations
```

---

## Statistics

Based on typical run:

| Metric | Value |
|--------|-------|
| Total days | 90 |
| Weekdays | ~64 |
| Working days | ~58 (90% of weekdays) |
| Total slots | ~350-400 |
| Avg slots/day | 5-6 |
| Morning slots | ~40% |
| Afternoon slots | ~35% |
| Full day | ~25% |

---

## Running Regularly

### Update Schedule Monthly

```bash
# Add to cron job (optional)
0 0 1 * * cd /path/to/backend && npm run create-slots
```

Or manually run it:

```bash
# Every month or when slots run out
cd backend
npm run create-slots
```

---

## Benefits

### For Testing
- ✅ Always have 3 months of data
- ✅ Realistic user testing scenarios
- ✅ Don't need to manually update dates

### For LLM Agents
- ✅ See realistic availability patterns
- ✅ Better training data
- ✅ Test edge cases (no availability days)

### For Demos
- ✅ Professional-looking schedule
- ✅ Mimics real doctor availability
- ✅ Impressive to stakeholders

---

## Quick Commands Reference

```bash
# Create realistic schedule (recommended)
npm run create-slots

# Alternative: Old demo data
npm run add-demo

# Start server
npm start

# Test availability
curl -X POST http://localhost:5000/api/llm/check-availability-next-days \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

---

## 🎉 You're All Set!

Your appointment system now has a **realistic 3-month doctor schedule**!

**Next steps:**
1. ✅ Run `npm run create-slots`
2. ✅ Test with Postman or cURL
3. ✅ Integrate with your LLM agent
4. ✅ Enjoy realistic data for demos!

---

**Need help?** Check the generated output from the script for statistics and sample schedules.

