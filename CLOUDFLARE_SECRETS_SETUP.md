# 🔐 Cloudflare Pages Secrets Setup Guide

## Current Situation

You need to configure the following secrets for production:
- `OPENAI_API_KEY` - Your OpenAI API key: `sk-p...VCkA`
- `ADMIN_PASSWORD` - Your admin password for settings page

## ⚠️ Important Note

For **Cloudflare Pages**, secrets must be configured via:
1. **Cloudflare Dashboard** (Recommended - Easy GUI)
2. **Wrangler CLI with API Token** (Requires Cloudflare API token)

## 🎯 Method 1: Cloudflare Dashboard (Recommended)

This is the **easiest and most reliable** method.

### Step-by-Step Instructions

#### 1. Login to Cloudflare Dashboard
Visit: **https://dash.cloudflare.com/**

#### 2. Navigate to Your Pages Project
1. Click on **"Workers & Pages"** in the left sidebar
2. Find and click on **"podcastfy-saas"** project

#### 3. Open Settings
1. Click on the **"Settings"** tab
2. Scroll down to **"Environment variables"** section

#### 4. Add Production Secrets

**Add OPENAI_API_KEY:**
1. Click **"Add variable"** button
2. **Variable name**: `OPENAI_API_KEY`
3. **Value**: `sk-p...VCkA` (your full OpenAI API key)
4. **Environment**: Select **"Production"** (and "Preview" if you want)
5. Click **"Save"**

**Add ADMIN_PASSWORD:**
1. Click **"Add variable"** button again
2. **Variable name**: `ADMIN_PASSWORD`
3. **Value**: Your secure admin password
4. **Environment**: Select **"Production"** (and "Preview" if you want)
5. Click **"Save"**

#### 5. Trigger Redeployment
After adding the secrets, you need to redeploy:

**Option A: Via Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"⋮"** (three dots) → **"Retry deployment"**

**Option B: Via Git Push**
```bash
cd /home/user/webapp
git commit --allow-empty -m "trigger: Redeploy with secrets configured"
git push origin main
```

---

## 🔧 Method 2: Wrangler CLI (Requires API Token)

If you prefer CLI or need automation, you can use Wrangler with a Cloudflare API token.

### Prerequisites

#### Get Cloudflare API Token
1. Visit: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template
4. **OR** create custom token with these permissions:
   - Account → Cloudflare Pages → Edit
   - Zone → Workers Scripts → Edit
5. Copy the generated token (starts with something like: `abc123...`)

#### Set Token as Environment Variable
```bash
# Set temporarily (for current session)
export CLOUDFLARE_API_TOKEN="your-token-here"

# Or permanently add to ~/.bashrc
echo 'export CLOUDFLARE_API_TOKEN="your-token-here"' >> ~/.bashrc
source ~/.bashrc
```

### Set Secrets Using Wrangler

Once you have the API token configured:

```bash
cd /home/user/webapp

# Set OpenAI API Key
echo "sk-p...VCkA" | wrangler pages secret put OPENAI_API_KEY --project-name podcastfy-saas

# Set Admin Password
echo "your-secure-password" | wrangler pages secret put ADMIN_PASSWORD --project-name podcastfy-saas
```

**Interactive mode** (if you prefer):
```bash
cd /home/user/webapp

# You'll be prompted to enter the value
wrangler pages secret put OPENAI_API_KEY --project-name podcastfy-saas
wrangler pages secret put ADMIN_PASSWORD --project-name podcastfy-saas
```

### Verify Secrets
```bash
cd /home/user/webapp
wrangler pages secret list --project-name podcastfy-saas
```

### Deploy with Secrets
```bash
cd /home/user/webapp
npm run deploy:prod
```

---

## 🔍 Verification Steps

After configuring secrets and redeploying:

### 1. Check Deployment Status
Visit: https://dash.cloudflare.com/
- Navigate to **Workers & Pages** → **podcastfy-saas**
- Check **Deployments** tab for successful deployment
- Note the new deployment URL

### 2. Test Production
Visit your production URL: https://podcastfy-saas.pages.dev

1. Select **"Topic"** as content type
2. Enter: `"Artificial Intelligence trends"`
3. Click **"Generate Podcast"**
4. Wait 10-20 seconds

**Expected Result:** ✅ Podcast generates successfully without 401 error

### 3. Verify Settings Page
Visit: https://podcastfy-saas.pages.dev/settings
- Should be able to login with your ADMIN_PASSWORD
- Should see API configuration status

---

## 📋 Troubleshooting

### Error: "Environment variable not found"
**Solution:** Make sure you selected **"Production"** environment when adding the variable in the dashboard.

### Error: "Still getting 401 Invalid API Key"
**Solutions:**
1. Verify the API key is correct in Cloudflare Dashboard
2. Check for extra spaces or newlines in the key value
3. Redeploy the application after adding secrets
4. Clear browser cache and try again

### Wrangler CLI Error: "API token required"
**Solution:** Use Method 1 (Cloudflare Dashboard) or follow the API token setup instructions in Method 2.

### Secrets Not Loading in Production
**Solutions:**
1. Make sure you selected **"Production"** environment (not just "Preview")
2. Trigger a new deployment after adding secrets
3. Wait 1-2 minutes for Cloudflare to propagate changes

---

## 🔐 Security Best Practices

### ✅ DO:
- Use the Cloudflare Dashboard for sensitive secrets (most secure)
- Use strong, unique passwords for ADMIN_PASSWORD
- Rotate API keys periodically
- Set different values for Production and Preview environments
- Monitor API usage in OpenAI dashboard

### ❌ DON'T:
- Don't commit secrets to Git
- Don't share API keys in public channels
- Don't use the same password across environments
- Don't expose secrets in client-side code
- Don't forget to redeploy after adding secrets

---

## 💡 Quick Command Reference

### Check Current Secrets
```bash
# Via Wrangler (requires API token)
wrangler pages secret list --project-name podcastfy-saas
```

### Delete a Secret
```bash
# Via Wrangler (requires API token)
wrangler pages secret delete OPENAI_API_KEY --project-name podcastfy-saas
```

### Trigger Redeployment
```bash
# Via Git
cd /home/user/webapp
git commit --allow-empty -m "trigger: Redeploy"
git push origin main
```

---

## 📊 Current Configuration Status

### Your OpenAI API Key
```
OPENAI_API_KEY=sk-p...VCkA
```
✅ Ready to be configured in Cloudflare

### Required Admin Password
```
ADMIN_PASSWORD=your-secure-password
```
⚠️ Choose a strong password and configure it

### Project Information
- **Project Name**: `podcastfy-saas`
- **Production URL**: https://podcastfy-saas.pages.dev
- **Cloudflare Dashboard**: https://dash.cloudflare.com/

---

## 🚀 Recommended Workflow

**For fastest setup, follow this order:**

1. ✅ Login to Cloudflare Dashboard
2. ✅ Add OPENAI_API_KEY in Environment Variables
3. ✅ Add ADMIN_PASSWORD in Environment Variables
4. ✅ Click "Save"
5. ✅ Go to Deployments → Retry latest deployment
6. ✅ Wait 1-2 minutes for deployment
7. ✅ Test podcast generation at production URL
8. ✅ Verify settings page authentication

**Total Time: 3-5 minutes** ⏱️

---

## 📚 Additional Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Environment Variables Guide**: https://developers.cloudflare.com/pages/configuration/bindings/
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler/
- **API Token Creation**: https://dash.cloudflare.com/profile/api-tokens
- **OpenAI API Keys**: https://platform.openai.com/api-keys

---

**Last Updated**: 2025-10-24  
**Status**: 📋 Awaiting secrets configuration in Cloudflare Dashboard  
**Next Step**: Configure secrets via Cloudflare Dashboard (Method 1)
