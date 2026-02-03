# 📞 Twilio Setup Guide - Quick Start

## 🎯 Goal
Connect your AI receptionist to real phone calls, SMS, and WhatsApp within 15 minutes.

---

## Step 1: Get Your Backend Publicly Accessible

Since Twilio needs to send webhooks to your backend, you need a public URL.

### Option A: Using ngrok (Recommended for Testing)

```bash
# 1. Download ngrok from https://ngrok.com/download
# 2. Install and authenticate

# 3. Run your backend
cd backend
venv\Scripts\activate
python main.py

# 4. In a NEW terminal, run ngrok
ngrok http 8000

# 5. Copy the HTTPS URL shown (e.g., https://abc123.ngrok-free.app)
```

### Option B: Deploy to Production

Deploy your backend to:
- **Railway**: https://railway.app (Easy, 1-click deploy)
- **Render**: https://render.com (Free tier available)
- **Heroku**: https://heroku.com
- **AWS/GCP/Azure**: (More complex, more control)

---

## Step 2: Update Environment Variables

Edit `backend/.env`:

```bash
# Replace with your ngrok or production URL
BACKEND_URL=https://abc123.ngrok-free.app
```

**Restart your backend** after changing this.

---

## Step 3: Configure Twilio Phone Number

1. **Login to Twilio**: https://console.twilio.com

2. **Go to Phone Numbers**:
   - Click **Phone Numbers** in left menu
   - Click **Manage** → **Active Numbers**
   - Click on your number: `+918801260321`

3. **Configure Voice Settings**:
   - Scroll to **Voice & Fax** section
   - **A CALL COMES IN**: Select "Webhook"
   - **URL**: `https://your-backend-url/api/twilio/voice-inbound`
   - **HTTP Method**: `POST`
   - Click **Save**

4. **Configure Messaging Settings**:
   - Scroll to **Messaging** section
   - **A MESSAGE COMES IN**: Select "Webhook"
   - **URL**: `https://your-backend-url/api/twilio/sms-inbound`
   - **HTTP Method**: `POST`
   - Click **Save**

**Example URLs** (replace with yours):
```
https://abc123.ngrok-free.app/api/twilio/voice-inbound
https://abc123.ngrok-free.app/api/twilio/sms-inbound
```

---

## Step 4: Test with a Phone Call

1. **Call your Twilio number**: `+918801260321`

2. **You should hear**: "Hello! Thank you for calling. Please describe your service request after the beep."

3. **Speak your request**: 
   - "My AC is broken and not cooling"
   - "I need a plumber urgently"
   - "Electrical issue in my bedroom"

4. **Press #** to finish

5. **Check backend terminal**: Should show:
   ```
   📞 Incoming call from: +919XXXXXXXXX
   🎙️ Processing recording from +919XXXXXXXXX: RE...
   ✅ Transcribed (en): My AC is broken and not cooling...
   📱 NOTIFICATION: New high task created
   ```

6. **Check dashboard**: New task should appear at http://localhost:3000/dashboard

7. **Check your phone**: Should receive SMS confirmation

---

## Step 5: Test with SMS

1. **Send SMS** to `+918801260321`

2. **Message**: "Need plumber for bathroom leak urgently"

3. **Check backend logs**: Should process and create task

4. **Receive confirmation SMS**

---

## Step 6: Configure WhatsApp (Optional)

### Enable WhatsApp Sandbox (Testing)

1. **Go to Twilio Console** → **Messaging** → **Try it out** → **Send a WhatsApp message**

2. **Join Sandbox**:
   - Send WhatsApp message to number shown
   - Format: "join [sandbox-code]"

3. **Configure Webhook**:
   - In sandbox settings, set webhook URL to:
   - `https://your-backend-url/api/twilio/whatsapp-inbound`
   - HTTP Method: `POST`

4. **Test**: Send voice note or text to WhatsApp number

### Enable WhatsApp Business API (Production)

For production WhatsApp:
1. Apply for WhatsApp Business API access
2. Facebook Business verification required
3. Can take 1-2 weeks for approval
4. Follow: https://www.twilio.com/docs/whatsapp/api

---

## Step 7: Configure Notifications

Edit `backend/.env` to set who receives notifications:

```bash
# Phone number to receive task notifications
ESCALATION_PHONE=+918801260321

# WhatsApp number to receive notifications (same or different)
ESCALATION_WHATSAPP=+918801260321
```

**Restart backend** after changes.

Now when tasks are created:
- Operations team gets WhatsApp/SMS alert
- Customer gets confirmation
- Task appears in dashboard

---

## 🧪 Quick Test Checklist

- [ ] Backend running locally or on cloud
- [ ] ngrok running (if local) with HTTPS URL
- [ ] `BACKEND_URL` updated in `.env`
- [ ] Twilio phone number configured with webhook URLs
- [ ] Call Twilio number and speak request
- [ ] Recording processed and task created
- [ ] SMS confirmation received
- [ ] Send SMS and receive confirmation
- [ ] Dashboard shows tasks
- [ ] Notifications working

---

## 🚨 Troubleshooting

### "The number you are calling is not available"
- Check Twilio account has credit/balance
- Verify phone number is active in Twilio console

### No response when calling
- Check webhook URL is correct
- Verify backend is running and accessible
- Check Twilio debugger: https://console.twilio.com/debugger
- Look for webhook errors

### Recording not processing
- Check backend logs for errors
- Verify Groq API key is valid
- Check recording URL is accessible
- View Twilio debugger for webhook failures

### SMS not sending
- Verify Twilio credentials in `.env`
- Check phone numbers are in E.164 format (+919XXXXXXXXX)
- Ensure Twilio account has SMS enabled
- Check backend logs for Twilio errors

### ngrok URL not working
- Make sure ngrok is running
- Use HTTPS URL (not HTTP)
- Update Twilio webhooks when ngrok URL changes
- ngrok URLs change on restart (use paid plan for static URLs)

---

## 💡 Pro Tips

1. **Use ngrok's web interface**: http://127.0.0.1:4040
   - See all webhook requests
   - Inspect request/response
   - Replay requests for debugging

2. **Monitor Twilio Console**:
   - Go to **Monitor** → **Logs** → **Debugger**
   - See all calls, SMS, WhatsApp messages
   - View webhook errors in real-time

3. **Test in this order**:
   - First get phone calls working
   - Then enable SMS
   - Finally configure WhatsApp
   - One channel at a time is easier to debug

4. **Save your ngrok URL**:
   - ngrok free tier changes URL on restart
   - Save it and update Twilio webhooks each time
   - Or use ngrok paid plan for static URLs

5. **Use Twilio Console Phone**:
   - Test calls directly from console
   - Go to **Phone Numbers** → click number → **Make a Test Call**

---

## 📊 Verification Steps

Once everything works, you should see this flow:

```
1. Customer calls +918801260321
     ↓
2. Twilio answers, plays greeting
     ↓
3. Customer speaks request, presses #
     ↓
4. Twilio sends recording to your backend
     ↓
5. Backend transcribes with Groq Whisper
     ↓
6. Backend extracts intent with Groq AI
     ↓
7. Backend creates task in database
     ↓
8. Customer receives SMS confirmation
     ↓
9. Operations team gets WhatsApp/SMS alert
     ↓
10. Task appears in dashboard
     ↓
11. Success! ✅
```

---

## 🎉 Success!

If you can:
1. ✅ Call your number and speak
2. ✅ See task created in dashboard
3. ✅ Receive SMS confirmation
4. ✅ Get notifications

**You're ready for production!** 🚀

---

## 🔗 Helpful Links

- **Twilio Console**: https://console.twilio.com
- **Twilio Debugger**: https://console.twilio.com/debugger
- **ngrok Dashboard**: https://dashboard.ngrok.com
- **Groq Console**: https://console.groq.com
- **Your Dashboard**: http://localhost:3000/dashboard

---

## 📞 Need Help?

1. Check Twilio debugger for webhook errors
2. Check backend logs for processing errors
3. Verify all URLs are correct (HTTPS, no typos)
4. Test with sample curl requests first
5. Review documentation in `PHASE_2_COMPLETE.md`

**Happy calling!** 📞✨
