# Cloudflare Pages Deployment Guide

## 🎯 Current Status

**✅ Your application is ready for deployment!**

- Frontend: Complete with settings page
- Backend: API routes configured
- API Key System: Implemented and documented
- GitHub: Pushed to repository
- Build: Tested and working locally

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

### 1. **Cloudflare Account** ✓
- Sign up at: https://dash.cloudflare.com/sign-up
- Verify your email address

### 2. **Cloudflare API Key** (REQUIRED)
📍 **Action Needed**: Configure your Cloudflare API key first

**How to get your API key:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template OR create custom with these permissions:
   - Account > Cloudflare Pages > Edit
   - Account > Account Settings > Read
4. Copy the generated token

**How to configure in sandbox:**
1. Open the **Deploy** tab in the sidebar
2. Paste your Cloudflare API token
3. Save the configuration

### 3. **API Service Provider Keys** (Required for podcast generation)
You need AT LEAST:
- ONE LLM provider (OpenAI/Anthropic/Google)
- ONE TTS provider (ElevenLabs or free Microsoft Edge TTS)

See **[API_KEYS_SETUP.md](./API_KEYS_SETUP.md)** for details.

## 🚀 Deployment Steps

### Step 1: Configure Cloudflare API Key

```bash
# After setting up in Deploy tab, verify setup:
cd /home/user/webapp
setup_cloudflare_api_key
```

### Step 2: Check Meta Info and Project Name

```bash
# Read current project name (or set if doesn't exist)
meta_info(action="read", key="cloudflare_project_name")
# If not set, it will use default: webapp

# To use a different name:
# meta_info(action="write", key="cloudflare_project_name", value="podcastfy-saas")
```

### Step 3: Build the Project

```bash
cd /home/user/webapp
npm run build
```

This creates the `dist/` folder with:
- `_worker.js` - Compiled Hono application
- `_routes.json` - Routing configuration
- Static assets from `public/`

### Step 4: Create Cloudflare Pages Project

```bash
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2024-01-01
```

**Expected Output:**
```
✨ Successfully created the 'webapp' project.
```

If you get a "project already exists" error, that's fine - proceed to Step 5.

### Step 5: Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name webapp
```

**Expected Output:**
```
✨ Success! Uploaded 15 files
✨ Deployment complete!
🌎 Visit: https://random-id.webapp.pages.dev
🌎 Branch: https://main.webapp.pages.dev
```

### Step 6: Configure API Keys (Production Secrets)

**IMPORTANT**: After deployment, configure your API keys as secrets:

```bash
# Set admin password (REQUIRED for /settings access)
wrangler secret put ADMIN_PASSWORD --project-name webapp

# Set LLM provider (choose at least ONE)
wrangler secret put OPENAI_API_KEY --project-name webapp
wrangler secret put ANTHROPIC_API_KEY --project-name webapp
wrangler secret put GOOGLE_API_KEY --project-name webapp

# Set TTS provider (choose at least ONE, or use free Edge TTS)
wrangler secret put ELEVENLABS_API_KEY --project-name webapp

# Optional: Azure OpenAI (enterprise)
wrangler secret put AZURE_OPENAI_API_KEY --project-name webapp
wrangler secret put AZURE_OPENAI_ENDPOINT --project-name webapp

# Optional: HuggingFace (local LLMs)
wrangler secret put HUGGINGFACE_API_KEY --project-name webapp
```

For each command, you'll be prompted to enter the key value.

### Step 7: Verify Deployment

```bash
# Test the deployed application
curl https://your-deployment.pages.dev

# Check API endpoints
curl https://your-deployment.pages.dev/api/settings/status

# Visit settings page
# https://your-deployment.pages.dev/settings
```

### Step 8: Update Meta Info with Final Project Name

```bash
# After successful deployment
meta_info(action="write", key="cloudflare_project_name", value="webapp")
```

## 🌐 Custom Domain Setup (Optional)

### Add Custom Domain:

1. **Via Wrangler CLI:**
```bash
wrangler pages domain add example.com --project-name webapp
```

2. **Via Cloudflare Dashboard:**
   - Go to: https://dash.cloudflare.com/
   - Select your account → Pages → webapp
   - Click "Custom domains" → "Set up a custom domain"
   - Follow the DNS configuration instructions

### DNS Configuration:
Add a CNAME record pointing to your Pages domain:
```
Type: CNAME
Name: @ (or subdomain like 'podcast')
Target: webapp.pages.dev
```

## 🔐 Environment Variables Management

### View Configured Secrets:
```bash
wrangler secret list --project-name webapp
```

Note: This only shows secret names, not values (for security).

### Update a Secret:
```bash
wrangler secret put SECRET_NAME --project-name webapp
```

### Delete a Secret:
```bash
wrangler secret delete SECRET_NAME --project-name webapp
```

## 📊 Monitoring & Logs

### View Deployment Logs:
```bash
wrangler pages deployment list --project-name webapp
```

### View Real-time Logs:
```bash
wrangler tail --project-name webapp
```

### View Metrics:
Visit: https://dash.cloudflare.com/ → Pages → webapp → Analytics

## 🔄 Redeployment

### For Code Changes:
```bash
# 1. Make your changes
# 2. Commit to git
git add .
git commit -m "Your changes"
git push origin main

# 3. Rebuild
npm run build

# 4. Redeploy
npm run deploy:prod
```

### For Secret Changes:
```bash
# Just update the secret - no redeployment needed
wrangler secret put SECRET_NAME --project-name webapp
```

## 🆘 Troubleshooting

### Error: "Authentication failed"
**Solution**: Run `setup_cloudflare_api_key` again or configure in Deploy tab

### Error: "Project already exists"
**Solution**: 
- This is fine if you've deployed before
- Just proceed with `npx wrangler pages deploy`
- Or use a different project name

### Error: "Invalid API key"
**Solution**:
1. Check the key in your provider dashboard
2. Verify no extra spaces
3. Use `wrangler secret put` to update
4. Check key permissions/quotas

### Error: "Build failed"
**Solution**:
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Settings Page Won't Load
**Solution**:
1. Verify deployment was successful
2. Check `dist/_worker.js` exists
3. Check routes in browser DevTools
4. View logs: `wrangler tail --project-name webapp`

### API Keys Not Working
**Solution**:
1. Verify secrets are set: `wrangler secret list`
2. Check spelling of secret names (case-sensitive)
3. Redeploy if needed: `npm run deploy:prod`
4. Test via `/api/settings/status` endpoint

## 📈 Production Checklist

After deployment, verify:

- [ ] Application loads at production URL
- [ ] Homepage displays correctly
- [ ] Settings page accessible at `/settings`
- [ ] Admin password authentication works
- [ ] API keys configured via Wrangler
- [ ] API status endpoint returns correct values
- [ ] Custom domain configured (if applicable)
- [ ] GitHub repository updated
- [ ] README updated with production URL
- [ ] Monitoring/analytics set up

## 🔗 Important URLs

After deployment, you'll have:

- **Production**: `https://webapp.pages.dev`
- **Branch Preview**: `https://main.webapp.pages.dev`
- **Settings Page**: `https://webapp.pages.dev/settings`
- **API Status**: `https://webapp.pages.dev/api/settings/status`
- **Dashboard**: https://dash.cloudflare.com/

## 💰 Cost Estimates

### Cloudflare Pages (Hosting)
- **Free Plan**: 
  - Unlimited requests
  - 500 builds/month
  - 100GB bandwidth/month
  - Perfect for starting out

- **Paid Plans**: Starting at $20/month for teams

### API Services
See **[API_KEYS_SETUP.md](./API_KEYS_SETUP.md)** for detailed cost estimates:
- Budget: $1-5/month (100 podcasts)
- Standard: $8-15/month
- Premium: $20-50/month

## 📚 Additional Resources

- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Hono Docs**: https://hono.dev/
- **API Keys Setup**: [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)
- **GitHub Repo**: https://github.com/criadacasa/podcastfy-saas

## 🎉 Next Steps After Deployment

1. **Test Podcast Generation**: Create a test podcast with a simple URL
2. **Monitor Usage**: Check API provider dashboards for usage
3. **Set Up Alerts**: Configure spending alerts in API dashboards
4. **Gather Feedback**: Share with users and collect feedback
5. **Iterate**: Make improvements based on usage patterns

---

**Need Help?**
- Open an issue: https://github.com/criadacasa/podcastfy-saas/issues
- Check documentation: [README.md](./README.md)
- Review API setup: [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)

**Ready to Deploy?** Follow Step 1 above to configure your Cloudflare API key!
