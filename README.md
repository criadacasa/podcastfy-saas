# Podcastfy SaaS - AI Podcast Generator

## Project Overview
- **Name**: Podcastfy SaaS
- **Goal**: Transform multimodal content into engaging, multilingual audio podcasts using AI
- **Based on**: [Podcastfy Open Source Project](https://github.com/souzatharsis/podcastfy)
- **Features**: 
  - Multi-input support (URLs, YouTube, PDFs, Images, Topics)
  - Multilingual podcast generation
  - Multiple voice models (OpenAI, ElevenLabs, Google, Microsoft Edge)
  - Customizable conversation styles and lengths
  - Progress tracking and result management

## URLs
- **Production**: https://podcastfy-saas.pages.dev
- **Latest Deployment**: https://42e2fd91.podcastfy-saas.pages.dev
- **Settings Page**: https://podcastfy-saas.pages.dev/settings
- **GitHub**: https://github.com/criadacasa/podcastfy-saas
- **Sandbox Demo**: https://3000-iehn2fxqx1t03hszy8bg3-ad490db5.sandbox.novita.ai

## Currently Completed Features

### ✅ Frontend UI
- **Content Input Types**:
  - 📎 URLs (web pages, articles, news) - **WORKING**
  - 🎬 YouTube videos - **WORKING**
  - 💡 Topics (AI research-based generation) - **WORKING**
  - 📄 PDF documents (file upload) - UI ready, upload pending
  - 🖼️ Images (file upload) - UI ready, upload pending

- **Podcast Configuration**:
  - Length selection (Short 2-5 min, Medium 5-15 min, Long 30+ min)
  - Language selection (English, Spanish, French, German, Portuguese, Chinese, Japanese, Korean)
  - Number of speakers (1-3)
  - Conversation style (Casual, Professional, Educational, Entertaining)
  - Voice model selection (OpenAI TTS - **WORKING**, Google TTS, ElevenLabs, Microsoft Edge)
  - Transcript generation toggle - **WORKING**

- **User Experience**:
  - Beautiful gradient UI with purple/blue theme
  - Interactive content type switcher
  - File upload with preview and removal
  - Progress tracking with visual indicators
  - Audio player for generated podcasts - **WORKING**
  - Download, share, and view transcript buttons - **WORKING**

### ✅ Backend API Implementation - **REAL PODCAST GENERATION!**
- `POST /api/generate` - **WORKING** - Generates real podcasts using OpenAI GPT-4 + TTS
- `GET /api/audio/:filename` - **NEW** - Serves audio files from Cloudflare R2
- `GET /api/status/:jobId` - Status checking (for future async implementation)

### ✅ Real Podcast Generation Engine
- **OpenAI GPT-4** integration for conversation script generation
- **OpenAI TTS** integration for audio synthesis
- **Cloudflare R2** storage for generated audio files
- Support for configurable length, language, speakers, and style
- Transcript generation and viewing
- Working download and share functionality

### ✅ Technical Stack
- **Framework**: Hono (lightweight web framework)
- **Deployment**: Cloudflare Pages (edge-first architecture)
- **Frontend**: TailwindCSS, Font Awesome, Axios
- **Build Tool**: Vite
- **Process Manager**: PM2 (development)
- **Storage**: Cloudflare R2 (audio files)
- **AI/ML**: OpenAI GPT-4 (scripts), OpenAI TTS (audio)

## Functional Entry URIs

### Main Routes
- **GET /** - Main podcast generation page with full UI

### API Endpoints
- **POST /api/generate**
  - Body: `{ contentType, input, config }`
  - Returns: `{ success, message, jobId }`
  
- **GET /api/status/:jobId**
  - Params: `jobId` - Job identifier
  - Returns: `{ jobId, status, progress, step }`

## Data Architecture

### Data Models
Currently using in-memory mock data structure:
```javascript
{
  contentType: 'urls' | 'youtube' | 'pdf' | 'image' | 'topic',
  input: {
    urls?: string[],
    youtube?: string[],
    files?: File[],
    topic?: string
  },
  config: {
    length: 'short' | 'medium' | 'long',
    language: string,
    speakers: number,
    style: string,
    voiceModel: string,
    generateTranscript: boolean
  }
}
```

### Storage Services
**To Be Implemented:**
- Cloudflare D1 Database - Store user accounts, podcast metadata, and generation history
- Cloudflare R2 Storage - Store generated audio files and transcripts
- Cloudflare KV - Cache API responses and temporary data

## 🔑 API Keys Configuration

**IMPORTANT**: Before deploying to production, you need to configure API keys for the podcast generation services.

See **[API_KEYS_SETUP.md](./API_KEYS_SETUP.md)** for detailed instructions on:
- Which API keys you need (OpenAI, Anthropic, Google, ElevenLabs, etc.)
- How to obtain API keys from each provider
- How to configure keys using Wrangler CLI
- Cost estimates and recommended combinations
- Security best practices

**Quick Start**:
1. Visit `/settings` page after deployment
2. Authenticate with admin password
3. Follow the instructions to set API keys using Wrangler CLI

**Required Minimum**:
- At least ONE LLM provider (OpenAI/Anthropic/Google)
- At least ONE TTS provider (ElevenLabs or free Microsoft Edge TTS)
- Admin password for settings page access

## Features Not Yet Implemented

### 🔄 Backend Integration
- [x] ~~Python Podcastfy integration~~ - **Using OpenAI API directly instead**
- [x] ~~Real API endpoint implementation~~ - **COMPLETED! Real generation working**
- [ ] Job queue management (for async long-running podcasts)
- [ ] Status polling mechanism (for async implementation)
- [ ] File upload handling for PDFs and images
- [ ] Additional voice models (Google TTS, ElevenLabs, Edge TTS)

### 🔄 Storage & Database
- [ ] Cloudflare D1 database setup for user data and podcast metadata
- [x] ~~Cloudflare R2 bucket for audio storage~~ - **COMPLETED! R2 configured and working**
- [ ] Cloudflare KV for caching and job status

### 🔄 User Features
- [ ] User authentication and accounts
- [ ] Podcast history/library ("My Podcasts") - UI ready, needs D1 database
- [x] ~~Download functionality~~ - **COMPLETED! Working**
- [x] ~~Transcript viewer~~ - **COMPLETED! Opens in new window**
- [x] ~~Share functionality~~ - **COMPLETED! Copies URL to clipboard**
- [x] ~~Audio player with controls~~ - **COMPLETED! HTML5 audio player working**

### 🔄 Advanced Features
- [ ] Batch podcast generation
- [ ] Custom voice training
- [ ] Podcast editing capabilities
- [ ] Analytics dashboard
- [ ] Webhook notifications

## 🎉 **REAL PODCAST GENERATION IS NOW LIVE!**

The application now generates **real podcasts** using OpenAI GPT-4 and TTS! 

**Try it now**: https://podcastfy-saas.pages.dev

### Quick Start
1. Visit the application
2. Select "Topic" and enter: "Artificial Intelligence trends 2024"
3. Click "Generate Podcast"
4. Wait 10-20 seconds
5. Listen to your AI-generated podcast!

**Cost**: ~$0.02-$0.06 per podcast (very affordable!)

See **[REAL_GENERATION_IMPLEMENTED.md](./REAL_GENERATION_IMPLEMENTED.md)** for complete details on the implementation.

## Recommended Next Steps

### Priority 1: Enhanced Features
1. **Add More Voice Models**
   - Implement Google TTS support (API key already configured)
   - Add ElevenLabs premium voices
   - Add Microsoft Edge TTS (free option)

2. **File Upload Support**
   - Implement PDF upload and processing
   - Implement image upload and processing
   - Handle file storage in R2

### Priority 2: Data Persistence
1. **Set up Cloudflare D1 Database**
   - Create migrations for users, podcasts, jobs tables
   - Implement data models and repositories

2. **Configure Cloudflare R2 Storage**
   - Set up bucket for audio files
   - Implement signed URLs for secure downloads

3. **Set up Cloudflare KV**
   - Cache job statuses
   - Store temporary generation data

### Priority 3: User Management
1. **Implement Authentication**
   - Choose auth provider (Cloudflare Access, Auth0, or custom)
   - Add login/signup flows
   - Protect API routes

2. **Build User Dashboard**
   - "My Podcasts" page with history
   - User settings and preferences
   - Usage analytics

### Priority 4: Production Deployment
1. **Deploy to Cloudflare Pages**
   - Set up production deployment
   - Configure custom domain
   - Set up environment variables and secrets

2. **Testing & Optimization**
   - Load testing
   - Performance optimization
   - Error handling improvements

## User Guide

### How to Generate a Podcast

1. **Select Content Type**
   - Click on one of the five content type buttons (URLs, YouTube, PDF, Images, or Topic)

2. **Provide Content**
   - **URLs**: Paste web page URLs (one per line)
   - **YouTube**: Paste YouTube video URLs
   - **PDF**: Upload PDF files by clicking the upload area
   - **Images**: Upload image files
   - **Topic**: Enter a topic for AI to research

3. **Configure Podcast Settings**
   - Choose desired length
   - Select language
   - Pick number of speakers
   - Set conversation style
   - Choose voice model
   - Toggle transcript generation

4. **Generate**
   - Click "Generate Podcast" button
   - Monitor progress in real-time
   - Wait for completion (currently simulated)

5. **Download & Share**
   - Listen to your podcast in the audio player
   - Download the audio file
   - View the transcript
   - Share with others

## Development

### Local Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# Test the application
curl http://localhost:3000
```

### Deployment Commands
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod
```

## Deployment
- **Platform**: Cloudflare Pages (Worker + Static Assets)
- **Status**: ✅ **Active & Fully Functional** 
- **Production URL**: https://podcastfy-saas.pages.dev
- **Latest Deploy**: https://46b85a36.podcastfy-saas.pages.dev
- **Tech Stack**: Hono + TypeScript + TailwindCSS + Vite
- **Storage**: Cloudflare R2 (webapp-podcasts bucket)
- **AI Services**: OpenAI GPT-4 + TTS
- **Last Updated**: 2025-10-24

## API Integration Notes

To complete the backend integration, you'll need to:

1. **Podcastfy Python Backend**: Deploy the Podcastfy Python application as a separate service (could be AWS Lambda, Google Cloud Functions, or a container service)

2. **API Gateway**: The Hono backend will act as a gateway, receiving requests from the frontend and forwarding them to the Podcastfy Python service

3. **File Handling**: Implement file upload to R2, pass R2 URLs to Podcastfy for processing

4. **Job Queue**: Implement async job processing since podcast generation can take several minutes

## License
Based on Podcastfy (Apache 2.0)

---

**Built with Hono, Cloudflare Pages, and AI** 🎙️✨
