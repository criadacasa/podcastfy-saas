# 🚀 Quick Fix Guide - OpenAI 401 Error

## ⚡ The Fastest Way to Fix This

### 1️⃣ Get Your OpenAI API Key (2 minutes)
Visit: https://platform.openai.com/api-keys
- Login or create account
- Click "Create new secret key"
- **COPY THE KEY** (starts with `sk-` or `sk-proj-`)

### 2️⃣ Add It to Your Local Config (30 seconds)

**Option A: Quick Command** (Replace `YOUR_KEY` with actual key)
```bash
cd /home/user/webapp
echo 'OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE' > .dev.vars
echo 'ADMIN_PASSWORD=admin123' >> .dev.vars
```

**Option B: Edit File**
```bash
cd /home/user/webapp
nano .dev.vars
```
Then paste:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
ADMIN_PASSWORD=admin123
```

### 3️⃣ Restart Your App (10 seconds)
```bash
cd /home/user/webapp
pm2 restart all
# OR
npm run dev
```

### 4️⃣ Test It! (20 seconds)
1. Open your app
2. Select "Topic"
3. Type: "AI trends"
4. Click "Generate Podcast"
5. Wait 10-20 seconds
6. 🎉 Enjoy your podcast!

---

## 📱 Quick Verification

Check if your key is set:
```bash
cd /home/user/webapp && cat .dev.vars | grep OPENAI
```

Should show: `OPENAI_API_KEY=sk-proj-...` (NOT "YOUR_OPENAI_API_KEY_HERE")

---

## 🆘 Still Not Working?

1. **Check your key is valid**: https://platform.openai.com/api-keys
2. **Make sure you copied the ENTIRE key** (they're very long!)
3. **Check for extra spaces** before or after the key
4. **Verify you have credits**: https://platform.openai.com/usage

---

## 💡 Tips

- New OpenAI accounts get **$5 free credits**
- Each podcast costs **~$0.02-0.06**
- Your key is **already secured** in `.gitignore`
- For production, use: `wrangler secret put OPENAI_API_KEY`

---

## 📚 Need More Help?

- **Detailed Guide**: See `OPENAI_API_KEY_SETUP.md`
- **General API Setup**: See `API_KEYS_SETUP.md`
- **Pull Request**: https://github.com/criadacasa/podcastfy-saas/pull/1

**Total Time: 3 minutes** ⏱️
