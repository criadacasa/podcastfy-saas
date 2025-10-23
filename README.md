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
- **Production**: https://3000-iehn2fxqx1t03hszy8bg3-ad490db5.sandbox.novita.ai
- **GitHub**: https://github.com/criadacasa/podcastfy-saas

## Currently Completed Features

### ✅ Frontend UI
- **Content Input Types**:
  - 📎 URLs (web pages, articles, news)
  - 🎬 YouTube videos
  - 📄 PDF documents (file upload)
  - 🖼️ Images (file upload)
  - 💡 Topics (AI research-based generation)

- **Podcast Configuration**:
  - Length selection (Short 2-5 min, Medium 5-15 min, Long 30+ min)
  - Language selection (English, Spanish, French, German, Portuguese, Chinese, Japanese, Korean)
  - Number of speakers (1-3)
  - Conversation style (Casual, Professional, Educational, Entertaining)
  - Voice model selection (OpenAI TTS, ElevenLabs, Google TTS, Microsoft Edge)
  - Transcript generation toggle

- **User Experience**:
  - Beautiful gradient UI with purple/blue theme
  - Interactive content type switcher
  - File upload with preview and removal
  - Progress tracking with visual indicators
  - Audio player for generated podcasts
  - Download, share, and view transcript buttons

### ✅ Backend API Routes
- `POST /api/generate` - Start podcast generation
- `GET /api/status/:jobId` - Check generation status

### ✅ Technical Stack
- **Framework**: Hono (lightweight web framework)
- **Deployment**: Cloudflare Pages (edge-first architecture)
- **Frontend**: TailwindCSS, Font Awesome, Axios
- **Build Tool**: Vite
- **Process Manager**: PM2 (development)

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

## Features Not Yet Implemented

### 🔄 Backend Integration
- [ ] Python Podcastfy integration (core podcast generation engine)
- [ ] Real API endpoint implementation
- [ ] Job queue management
- [ ] Status polling mechanism
- [ ] File upload handling and processing

### 🔄 Storage & Database
- [ ] Cloudflare D1 database setup for user data
- [ ] Cloudflare R2 bucket for audio storage
- [ ] Cloudflare KV for caching

### 🔄 User Features
- [ ] User authentication and accounts
- [ ] Podcast history/library ("My Podcasts")
- [ ] Download functionality
- [ ] Transcript viewer
- [ ] Share functionality
- [ ] Audio player with advanced controls

### 🔄 Advanced Features
- [ ] Batch podcast generation
- [ ] Custom voice training
- [ ] Podcast editing capabilities
- [ ] Analytics dashboard
- [ ] Webhook notifications

## Recommended Next Steps

### Priority 1: Backend Integration
1. **Set up Python Podcastfy Backend**
   - Deploy Podcastfy as a separate service or serverless function
   - Create FastAPI wrapper for Podcastfy functionality
   - Implement job queue (consider Cloudflare Queues or external service)

2. **Implement Real API Endpoints**
   - Connect `/api/generate` to Podcastfy backend
   - Implement job status tracking
   - Handle file uploads to R2 storage

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
- **Status**: ✅ Active (Development)
- **Tech Stack**: Hono + TypeScript + TailwindCSS + Vite
- **Last Updated**: 2025-10-23

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
