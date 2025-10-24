# API Keys Setup Guide for Podcastfy SaaS

This guide explains which API keys you need and how to configure them for your Podcastfy SaaS deployment.

## 📋 Required API Keys Overview

### Core Services (At least ONE required)

#### 1. **OpenAI** (Recommended)
- **Purpose**: GPT models for transcript generation + OpenAI TTS for voice synthesis
- **Cost**: Pay-as-you-go, ~$0.02-0.06 per podcast depending on length
- **Required For**: LLM-based transcript generation and text-to-speech
- **Get API Key**: https://platform.openai.com/api-keys

#### 2. **Anthropic Claude**
- **Purpose**: Claude models for high-quality transcript generation
- **Cost**: Pay-as-you-go, competitive with OpenAI
- **Required For**: Alternative LLM for transcript generation
- **Get API Key**: https://console.anthropic.com/

#### 3. **Google Gemini**
- **Purpose**: Gemini models for transcripts + Google Cloud TTS
- **Cost**: Generous free tier, then pay-as-you-go
- **Required For**: Alternative LLM and TTS option
- **Get API Key**: https://makersuite.google.com/app/apikey

### Voice Synthesis Services (At least ONE required)

#### 4. **ElevenLabs** (Best Voice Quality)
- **Purpose**: Premium voice synthesis with realistic voices
- **Cost**: Subscription-based, starts at $5/month
- **Required For**: High-quality, natural-sounding podcast voices
- **Get API Key**: https://elevenlabs.io/api
- **Recommendation**: ⭐ Best for production podcasts

#### 5. **Microsoft Edge TTS** (Free Option)
- **Purpose**: Free text-to-speech service
- **Cost**: FREE
- **Required For**: Budget-friendly voice synthesis
- **Setup**: No API key required, works out of the box

### Optional Services

#### 6. **Azure OpenAI** (Enterprise)
- **Purpose**: Enterprise-grade OpenAI deployment with data residency
- **Cost**: Same as OpenAI, but requires Azure subscription
- **Required For**: Companies requiring data compliance/residency
- **Get Started**: https://azure.microsoft.com/en-us/products/ai-services/openai-service

#### 7. **HuggingFace** (Privacy-focused)
- **Purpose**: Access to local/open-source LLM models
- **Cost**: Free for public models, paid for inference API
- **Required For**: Running models locally or on Hugging Face infrastructure
- **Get Token**: https://huggingface.co/settings/tokens

## 🎯 Recommended Combinations

### Budget-Friendly Setup ($0-5/month)
```
LLM: Google Gemini (free tier)
TTS: Microsoft Edge TTS (free)
Total: $0/month
```

### Balanced Quality Setup (~$20/month)
```
LLM: OpenAI GPT-4
TTS: ElevenLabs Starter ($5/month) + OpenAI TTS
Total: ~$20/month
```

### Premium Setup (~$50/month)
```
LLM: OpenAI GPT-4 + Anthropic Claude
TTS: ElevenLabs Professional ($22/month)
Total: ~$50/month
```

### Enterprise Setup (Custom pricing)
```
LLM: Azure OpenAI
TTS: ElevenLabs Enterprise
Additional: HuggingFace for custom models
```

## 🔧 How to Configure API Keys

### Method 1: Using Wrangler CLI (Production - Recommended)

This is the secure way to set API keys for production deployment:

```bash
# Navigate to your project directory
cd /home/user/webapp

# Set each API key as a secret
wrangler secret put OPENAI_API_KEY
# Enter your key when prompted: sk-...

wrangler secret put ANTHROPIC_API_KEY
# Enter your key when prompted: sk-ant-...

wrangler secret put GOOGLE_API_KEY
# Enter your key when prompted: AIza...

wrangler secret put ELEVENLABS_API_KEY
# Enter your key when prompted

# Optional: Azure OpenAI
wrangler secret put AZURE_OPENAI_API_KEY
wrangler secret put AZURE_OPENAI_ENDPOINT
# Enter: https://your-resource.openai.azure.com/

# Optional: HuggingFace
wrangler secret put HUGGINGFACE_API_KEY

# IMPORTANT: Set admin password for settings page
wrangler secret put ADMIN_PASSWORD
# Enter a strong password
```

### Method 2: Local Development (.dev.vars file)

For local testing, create a `.dev.vars` file:

```bash
# Copy the example file
cp .dev.vars.example .dev.vars

# Edit with your actual API keys
nano .dev.vars  # or use your preferred editor
```

**Example `.dev.vars` file:**
```env
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
ELEVENLABS_API_KEY=...
ADMIN_PASSWORD=your-secure-password
```

⚠️ **Important**: `.dev.vars` is in `.gitignore` and should NEVER be committed to Git!

### Method 3: Via Settings Page (GUI)

1. Visit: `https://your-domain.com/settings`
2. Enter admin password (set via Wrangler)
3. Configure each API key through the UI
4. Follow the CLI instructions provided

## 🔐 Security Best Practices

### ✅ DO:
- Use Wrangler secrets for production (`wrangler secret put`)
- Use `.dev.vars` for local development only
- Keep `.dev.vars` in `.gitignore`
- Use strong, unique admin passwords
- Rotate API keys periodically
- Monitor API usage for unusual activity
- Set spending limits on API providers

### ❌ DON'T:
- Commit API keys to Git repositories
- Share API keys in public channels
- Use production keys in development
- Hard-code keys in source files
- Use the same admin password across environments

## 📊 API Key Status Check

To verify which API keys are configured:

```bash
# View configured secrets (doesn't show values)
wrangler secret list

# Check status via API
curl https://your-domain.com/api/settings/status
```

## 🧪 Testing API Keys

After configuration, test your setup:

1. **Generate a test podcast** with a simple URL
2. **Check logs** for any API errors:
   ```bash
   wrangler tail
   ```
3. **Monitor costs** in each provider's dashboard

## 💰 Cost Estimation

### Per Podcast Costs (Approximate)

| Component | Budget | Standard | Premium |
|-----------|--------|----------|---------|
| LLM (Transcript) | $0.01 | $0.03 | $0.05 |
| TTS (Audio) | $0 | $0.05 | $0.15 |
| **Total per podcast** | **$0.01** | **$0.08** | **$0.20** |

### Monthly Costs (100 podcasts/month)

| Setup | Monthly Cost |
|-------|-------------|
| Budget | $1-5 |
| Standard | $8-15 |
| Premium | $20-50 |
| Enterprise | Custom |

## 🆘 Troubleshooting

### Error: "API key not configured"
**Solution**: Run `wrangler secret put KEY_NAME` to set the missing key

### Error: "Invalid API key"
**Solution**: 
1. Verify the key is correct in your provider's dashboard
2. Check for extra spaces or characters
3. Regenerate the key if needed

### Error: "Quota exceeded"
**Solution**: 
1. Check usage in provider dashboard
2. Upgrade your plan or add credits
3. Implement rate limiting in your app

### Settings page won't authenticate
**Solution**:
1. Ensure `ADMIN_PASSWORD` is set: `wrangler secret put ADMIN_PASSWORD`
2. Check password is correct
3. Clear browser cache/cookies

## 📚 Additional Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **Anthropic Docs**: https://docs.anthropic.com/
- **Google AI Docs**: https://ai.google.dev/docs
- **ElevenLabs Docs**: https://docs.elevenlabs.io/
- **Wrangler Secrets**: https://developers.cloudflare.com/workers/wrangler/commands/#secret
- **Podcastfy Docs**: https://github.com/souzatharsis/podcastfy

## 🚀 Quick Start Checklist

- [ ] Sign up for at least one LLM provider (OpenAI/Anthropic/Google)
- [ ] Sign up for at least one TTS provider (ElevenLabs or use free Edge TTS)
- [ ] Obtain API keys from each provider
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Set secrets using `wrangler secret put`
- [ ] Set admin password for settings page
- [ ] Test locally with `.dev.vars`
- [ ] Deploy to production: `npm run deploy:prod`
- [ ] Verify keys at `/settings` page
- [ ] Generate test podcast

## 📝 API Key Template

Copy this template and fill in your keys:

```bash
# Core LLM (Pick one or more)
wrangler secret put OPENAI_API_KEY        # sk-...
wrangler secret put ANTHROPIC_API_KEY     # sk-ant-...
wrangler secret put GOOGLE_API_KEY        # AIza...

# Voice Synthesis (Pick one or more)
wrangler secret put ELEVENLABS_API_KEY    # ...

# Optional Enterprise
wrangler secret put AZURE_OPENAI_API_KEY      # ...
wrangler secret put AZURE_OPENAI_ENDPOINT     # https://...

# Optional Privacy/Local
wrangler secret put HUGGINGFACE_API_KEY   # hf_...

# Admin Access (REQUIRED)
wrangler secret put ADMIN_PASSWORD        # your-secure-password
```

---

**Last Updated**: October 23, 2025  
**Version**: 1.0  
**Support**: Open an issue at https://github.com/criadacasa/podcastfy-saas/issues
