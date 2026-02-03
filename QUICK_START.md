# ⚡ QUICK START GUIDE

## 🎯 Get Running in 3 Steps

### Step 1: Setup (First Time Only)
```bash
setup.bat
```
This will:
- Create Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies  
- Create .env file

### Step 2: Add Groq API Key (FREE!)
1. Get FREE API key at: **https://console.groq.com/keys**
2. Open `backend\.env` in any text editor
3. Find line: `GROQ_API_KEY=gsk-your-key-here`
4. Replace with your actual Groq API key
5. Save the file

> **Why Groq?** 5-6x faster than OpenAI + FREE tier!

### Step 3: Start Servers
```bash
start.bat
```
This will:
- Start backend on http://localhost:8000
- Start frontend on http://localhost:3000
- Open two terminal windows

---

## 🌐 Access Your Platform

| Page | URL | Purpose |
|------|-----|---------|
| **Landing** | http://localhost:3000 | Marketing site |
| **Dashboard** | http://localhost:3000/dashboard | Admin interface |
| **Test** | http://localhost:3000/test | Demo voice calls |
| **API Docs** | http://localhost:8000/docs | Swagger UI |

---

## 🧪 Test It Out

### Option 1: Visual Interface (Easiest)
1. Go to http://localhost:3000/test
2. Click "AC Repair - Urgent" sample
3. Click "Process Call"
4. View results (⚡ notice the speed!)
5. Click "View in Dashboard"

### Option 2: API Testing
1. Go to http://localhost:8000/docs
2. Try POST `/api/voice/inbound`
3. Use sample JSON from docs
4. Check dashboard for new task

---

## ✅ Success Checklist

Your platform is working if you can:

- [ ] See landing page at localhost:3000
- [ ] Navigate to dashboard  
- [ ] Submit a test request
- [ ] See task appear in dashboard (< 1 second!)
- [ ] Update task status
- [ ] View stats updating

---

## 🚨 Troubleshooting

**Backend won't start?**
- Check if Python 3.9+ is installed: `python --version`
- Make sure you added Groq API key in `backend\.env`
- Get FREE key at: https://console.groq.com/keys
- Try: `cd backend && venv\Scripts\activate && pip install -r requirements.txt`

**Frontend won't start?**
- Check if Node.js 18+ is installed: `node --version`
- Try: `cd frontend && npm install`
- Delete `.next` folder and restart

**API calls failing?**
- Make sure backend is running on port 8000
- Check `backend\.env` has valid GROQ_API_KEY
- Check browser console for errors (F12)

**"API key not configured" error?**
- You need to add your Groq API key to `backend\.env`
- Get one FREE at: https://console.groq.com/keys
- Backend will show a warning if key is missing

**No tasks showing?**
- Backend must be running
- Try submitting a test request first
- Click "Refresh" button in dashboard

---

## 📚 Documentation

- **README.md** - Complete setup guide
- **GROQ_SETUP.md** - Groq migration guide
- **PROJECT_COMPLETE.md** - Full feature list
- **PRD_COMPLIANCE_REPORT.md** - Feature compliance
- **prd.md** - Original requirements

---

## 🎯 What's Next?

1. **Test thoroughly** with all sample requests
2. **Customize** intents for your business
3. **Integrate Twilio** for real phone calls
4. **Deploy** to production
5. **Find customers** and charge money

---

## 💡 Pro Tips

- Use **sample requests** to quickly test
- **Groq is FAST** - notice sub-second responses!
- **Refresh dashboard** to see latest tasks
- Check **API docs** for all endpoints
- Monitor **backend terminal** for logs
- Use **filters** to organize tasks

---

## ⚡ Performance Expectations

With Groq API, you should see:
- **Intent extraction**: ~0.3-0.5 seconds
- **Total response**: ~0.5-1 second
- **Much faster** than OpenAI!

---

## 🆘 Need Help?

1. Check error messages in terminals
2. Review documentation files
3. Check API docs at /docs
4. Look at backend logs
5. Verify environment variables
6. Get Groq API key at: https://console.groq.com/keys

---

**Ready? Run `setup.bat` then `start.bat`!** 🚀

**Don't forget to get your FREE Groq API key:** https://console.groq.com/keys
