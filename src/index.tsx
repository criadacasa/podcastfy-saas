import { Hono } from 'hono'
import { renderer } from './renderer'
import { cors } from 'hono/cors'
import settings from './routes/settings'
import { generateScript, generateAudio, storeAudio } from './lib/podcast-generator'

type Bindings = {
  OPENAI_API_KEY?: string
  GOOGLE_API_KEY?: string
  PODCAST_STORAGE: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Mount settings routes
app.route('/', settings)

// Apply renderer to HTML routes
app.use(renderer)

// Main podcast generation page
app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <i class="fas fa-podcast text-white text-xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Podcastfy SaaS</h1>
                <p class="text-sm text-gray-500">Transform Content into Engaging Podcasts</p>
              </div>
            </div>
            <div class="flex gap-3">
              <a href="/settings" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                <i class="fas fa-cog mr-2"></i>Settings
              </a>
              <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <i class="fas fa-history mr-2"></i>My Podcasts
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Create Your AI Podcast
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform URLs, PDFs, images, YouTube videos, or any content into captivating multilingual audio conversations
          </p>
        </div>

        {/* Input Type Selector */}
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Select Content Type</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <button class="content-type-btn active" data-type="urls">
              <i class="fas fa-link text-2xl mb-2"></i>
              <span>URLs</span>
            </button>
            <button class="content-type-btn" data-type="youtube">
              <i class="fab fa-youtube text-2xl mb-2"></i>
              <span>YouTube</span>
            </button>
            <button class="content-type-btn" data-type="pdf">
              <i class="fas fa-file-pdf text-2xl mb-2"></i>
              <span>PDF</span>
            </button>
            <button class="content-type-btn" data-type="image">
              <i class="fas fa-image text-2xl mb-2"></i>
              <span>Images</span>
            </button>
            <button class="content-type-btn" data-type="topic">
              <i class="fas fa-lightbulb text-2xl mb-2"></i>
              <span>Topic</span>
            </button>
          </div>

          {/* Content Input Sections */}
          <div id="content-sections">
            {/* URLs Section */}
            <div class="content-section active" data-section="urls">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-link mr-2"></i>Enter URLs (one per line)
              </label>
              <textarea
                id="urls-input"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/article1&#10;https://example.com/article2"
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Add web pages, articles, or news URLs to convert into podcast
              </p>
            </div>

            {/* YouTube Section */}
            <div class="content-section" data-section="youtube">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fab fa-youtube mr-2"></i>YouTube Video URLs
              </label>
              <textarea
                id="youtube-input"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=...&#10;https://youtu.be/..."
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Convert YouTube video content into audio podcast
              </p>
            </div>

            {/* PDF Section */}
            <div class="content-section" data-section="pdf">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-file-pdf mr-2"></i>Upload PDF Files
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
                <input type="file" id="pdf-input" accept=".pdf" multiple class="hidden" />
                <label for="pdf-input" class="cursor-pointer">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                  <p class="text-gray-600">Click to upload or drag and drop</p>
                  <p class="text-sm text-gray-500 mt-2">PDF files up to 50MB</p>
                </label>
              </div>
              <div id="pdf-list" class="mt-4"></div>
            </div>

            {/* Images Section */}
            <div class="content-section" data-section="image">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-image mr-2"></i>Upload Images
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
                <input type="file" id="image-input" accept="image/*" multiple class="hidden" />
                <label for="image-input" class="cursor-pointer">
                  <i class="fas fa-images text-4xl text-gray-400 mb-3"></i>
                  <p class="text-gray-600">Click to upload or drag and drop</p>
                  <p class="text-sm text-gray-500 mt-2">JPG, PNG, GIF up to 10MB</p>
                </label>
              </div>
              <div id="image-list" class="mt-4"></div>
            </div>

            {/* Topic Section */}
            <div class="content-section" data-section="topic">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-lightbulb mr-2"></i>Enter Topic or Subject
              </label>
              <textarea
                id="topic-input"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Latest developments in AI and machine learning"
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                AI will research this topic and generate a grounded podcast with web search
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">
            <i class="fas fa-cog mr-2"></i>Podcast Configuration
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Length */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Podcast Length
              </label>
              <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="short">Short (2-5 minutes)</option>
                <option value="medium" selected>Medium (5-15 minutes)</option>
                <option value="long">Long (30+ minutes)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </div>

            {/* Number of Speakers */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Number of Speakers
              </label>
              <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="1">1 Speaker</option>
                <option value="2" selected>2 Speakers (Dialogue)</option>
                <option value="3">3 Speakers</option>
              </select>
            </div>

            {/* Conversation Style */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Conversation Style
              </label>
              <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="casual">Casual & Friendly</option>
                <option value="professional">Professional</option>
                <option value="educational">Educational</option>
                <option value="entertaining">Entertaining</option>
              </select>
            </div>

            {/* Voice Model */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Voice Model
              </label>
              <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="openai">OpenAI TTS</option>
                <option value="elevenlabs">ElevenLabs</option>
                <option value="google">Google TTS</option>
                <option value="edge">Microsoft Edge</option>
              </select>
            </div>

            {/* Generate Transcript */}
            <div class="flex items-center">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                <span class="text-sm font-medium text-gray-700">Generate Transcript</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div class="text-center">
          <button id="generate-btn" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <i class="fas fa-magic mr-2"></i>
            Generate Podcast
          </button>
        </div>

        {/* Progress Section (Hidden by default) */}
        <div id="progress-section" class="hidden mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Generating Your Podcast...
          </h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <i class="fas fa-check text-white text-sm"></i>
              </div>
              <span class="text-gray-700">Processing content...</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <i class="fas fa-hourglass-half text-gray-600 text-sm"></i>
              </div>
              <span class="text-gray-500">Generating transcript...</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <i class="fas fa-hourglass-half text-gray-600 text-sm"></i>
              </div>
              <span class="text-gray-500">Creating audio...</span>
            </div>
          </div>
          <div class="mt-6">
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div id="progress-bar" class="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all" style="width: 0%"></div>
            </div>
            <p class="text-center text-sm text-gray-500 mt-2">
              <span id="progress-text">0%</span> complete
            </p>
          </div>
        </div>

        {/* Result Section (Hidden by default) */}
        <div id="result-section" class="hidden mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            Your Podcast is Ready!
          </h3>
          
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas fa-podcast text-white text-3xl"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-2" id="podcast-title">My Generated Podcast</h4>
                <audio controls class="w-full">
                  <source id="audio-source" src="" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <i class="fas fa-download mr-2"></i>Download Audio
            </button>
            <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <i class="fas fa-file-alt mr-2"></i>View Transcript
            </button>
            <button class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
              <i class="fas fa-share-alt mr-2"></i>Share
            </button>
            <button class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-redo mr-2"></i>Generate Another
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="text-center text-gray-500 text-sm">
            <p>Powered by Podcastfy · Transform any content into engaging podcasts</p>
          </div>
        </div>
      </footer>
    </div>
  )
})

// API Routes - Real Implementation
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { contentType, input, config } = body
    
    // Validate API key
    const openaiKey = c.env.OPENAI_API_KEY
    if (!openaiKey) {
      return c.json({ 
        success: false, 
        error: 'OpenAI API key not configured. Please configure it in Settings.' 
      }, 500)
    }

    // Validate input
    if (!input || !config) {
      return c.json({ 
        success: false, 
        error: 'Invalid request: missing input or configuration' 
      }, 400)
    }

    // Generate unique job ID
    const jobId = 'podcast_' + Date.now()

    // Start generation (this will be synchronous for MVP, but can be made async later)
    try {
      console.log('Starting podcast generation:', { contentType, config })

      // Step 1: Generate script using GPT-4
      console.log('Generating script with GPT-4...')
      const script = await generateScript(
        { contentType, input },
        config,
        openaiKey
      )

      if (!script) {
        throw new Error('Failed to generate script')
      }

      console.log('Script generated, length:', script.length)

      // Step 2: Convert script to audio using TTS
      console.log('Converting script to audio with TTS...')
      const audioBuffer = await generateAudio(script, config, openaiKey)

      if (!audioBuffer) {
        throw new Error('Failed to generate audio')
      }

      console.log('Audio generated, size:', audioBuffer.byteLength)

      // Step 3: Store audio in R2
      console.log('Storing audio in R2...')
      const filename = await storeAudio(audioBuffer, jobId, c.env.PODCAST_STORAGE)

      console.log('Audio stored:', filename)

      // Return success with audio URL
      return c.json({
        success: true,
        message: 'Podcast generated successfully',
        jobId,
        audioUrl: `/api/audio/${filename}`,
        transcript: config.generateTranscript ? script : undefined,
        duration: Math.round(audioBuffer.byteLength / 16000) // Rough estimate
      })

    } catch (error: any) {
      console.error('Generation error:', error)
      return c.json({ 
        success: false, 
        error: `Generation failed: ${error.message}`,
        jobId 
      }, 500)
    }

  } catch (error: any) {
    console.error('API error:', error)
    return c.json({ 
      success: false, 
      error: error.message || 'Failed to start generation' 
    }, 500)
  }
})

// Serve audio files from R2
app.get('/api/audio/:filename', async (c) => {
  try {
    const filename = c.req.param('filename')
    
    // Validate filename format
    if (!filename.match(/^podcast-podcast_\d+\.mp3$/)) {
      return c.json({ error: 'Invalid filename' }, 400)
    }

    const object = await c.env.PODCAST_STORAGE.get(filename)
    
    if (!object) {
      return c.json({ error: 'Audio file not found' }, 404)
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    })
  } catch (error: any) {
    console.error('Error serving audio:', error)
    return c.json({ error: 'Failed to serve audio file' }, 500)
  }
})

// Status endpoint (for future async implementation)
app.get('/api/status/:jobId', async (c) => {
  const jobId = c.req.param('jobId')
  
  // For now, this is not used since generation is synchronous
  // In future, implement job queue and track status
  return c.json({
    jobId,
    status: 'completed',
    progress: 100,
    step: 'Complete'
  })
})

export default app
