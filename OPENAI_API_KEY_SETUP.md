# OpenAI API Key Setup Guide

## 🚨 Error: "OpenAI ERROR 401 Invalid API Key"

This error occurs because the OpenAI API key is not configured or is invalid.

## ✅ Solution

### Step 1: Get Your OpenAI API Key

1. Visit: **https://platform.openai.com/api-keys**
2. Sign in to your OpenAI account (or create a free account)
3. Click the **"Create new secret key"** button
4. Give it a name (e.g., "Podcastfy SaaS Development")
5. **Copy the key immediately** (you won't be able to see it again!)
   - The key format is: `sk-proj-...` or `sk-...`

### Step 2: Add API Key to `.dev.vars` File

**Option A: Using a Text Editor**
```bash
cd /home/user/webapp
nano .dev.vars
```

Then replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key.

**Option B: Using sed Command**
```bash
cd /home/user/webapp
sed -i 's/YOUR_OPENAI_API_KEY_HERE/sk-proj-YOUR_ACTUAL_KEY/' .dev.vars
```
(Replace `sk-proj-YOUR_ACTUAL_KEY` with your real key)

**Option C: Manually Edit**
Open `/home/user/webapp/.dev.vars` and change:
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
```
To:
```
OPENAI_API_KEY=sk-proj-abcd1234efgh5678...
```

### Step 3: Verify the Configuration

Check that your key is set correctly:
```bash
cd /home/user/webapp
cat .dev.vars | grep OPENAI_API_KEY
```

You should see:
```
OPENAI_API_KEY=sk-proj-...
```
(Your actual key, NOT "YOUR_OPENAI_API_KEY_HERE")

### Step 4: Restart the Application

If you're running the app locally:
```bash
cd /home/user/webapp
pm2 restart all
```

Or if using wrangler dev:
```bash
cd /home/user/webapp
npm run dev
```

### Step 5: Test Podcast Generation

1. Visit your application URL
2. Select "Topic" as content type
3. Enter: "Artificial Intelligence trends"
4. Click "Generate Podcast"
5. Wait 10-20 seconds

If configured correctly, you should get a real podcast!

## 🔐 Security Notes

- ✅ `.dev.vars` is already in `.gitignore` (won't be committed)
- ✅ Never share your API key publicly
- ✅ Never commit `.dev.vars` to Git
- ⚠️ For production, use: `wrangler secret put OPENAI_API_KEY`

## 💰 Cost Information

- **Free Tier**: OpenAI gives you $5 in free credits for new accounts
- **Per Podcast Cost**: Approximately $0.02-$0.06 per podcast
  - Script generation (GPT-4): ~$0.01-$0.03
  - Audio synthesis (TTS): ~$0.01-$0.03
- **100 podcasts**: ~$2-$6

## 🆘 Troubleshooting

### Error: "Invalid API Key"
- Check that you copied the entire key (starts with `sk-`)
- Verify no extra spaces or quotes
- Make sure you're using the correct key from OpenAI dashboard

### Error: "Insufficient quota"
- Your OpenAI account may be out of credits
- Add credits: https://platform.openai.com/account/billing
- Check usage: https://platform.openai.com/usage

### Key Still Not Working
1. Regenerate the API key in OpenAI dashboard
2. Copy the new key
3. Update `.dev.vars` with the new key
4. Restart the application

## 📚 Additional Resources

- **OpenAI Platform**: https://platform.openai.com/
- **API Keys Dashboard**: https://platform.openai.com/api-keys
- **Usage Dashboard**: https://platform.openai.com/usage
- **Pricing**: https://openai.com/pricing
- **Documentation**: https://platform.openai.com/docs

## 🚀 For Production Deployment

When deploying to Cloudflare Pages, use Wrangler secrets instead of `.dev.vars`:

```bash
cd /home/user/webapp
wrangler secret put OPENAI_API_KEY
# Enter your key when prompted
```

Then deploy:
```bash
npm run deploy:prod
```

---

**Created**: 2025-10-24  
**Last Updated**: 2025-10-24  
**Status**: ✅ `.dev.vars` file created, waiting for API key configuration
