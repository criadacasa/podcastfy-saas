import { Hono } from 'hono'
import { renderer } from '../renderer'

type Bindings = {
  OPENAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  GOOGLE_API_KEY?: string
  ELEVENLABS_API_KEY?: string
  AZURE_OPENAI_API_KEY?: string
  AZURE_OPENAI_ENDPOINT?: string
  HUGGINGFACE_API_KEY?: string
  ADMIN_PASSWORD?: string
}

const settings = new Hono<{ Bindings: Bindings }>()

// Apply renderer
settings.use(renderer)

// Settings page (protected by password)
settings.get('/settings', (c) => {
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            <i class="fas fa-cog mr-2"></i>
            API Settings
          </h1>
          <p class="text-gray-600">Configure API keys for podcast generation services</p>
        </div>

        {/* Authentication Section */}
        <div id="auth-section" class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div class="max-w-md mx-auto">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              <i class="fas fa-lock mr-2"></i>
              Admin Authentication
            </h2>
            <p class="text-sm text-gray-600 mb-4">
              Enter the admin password to configure API keys
            </p>
            <form id="auth-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>
                Authenticate
              </button>
            </form>
          </div>
        </div>

        {/* Settings Form (Hidden until authenticated) */}
        <div id="settings-form" class="hidden">
          {/* OpenAI Configuration */}
          <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-brain text-green-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">OpenAI</h2>
                <p class="text-sm text-gray-500">GPT models and OpenAI TTS</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="openai-key"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="sk-..."
                  value=""
                />
                <p class="mt-1 text-xs text-gray-500">
                  Get your API key from: <a href="https://platform.openai.com/api-keys" target="_blank" class="text-purple-600 hover:underline">platform.openai.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Anthropic Configuration */}
          <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-robot text-orange-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Anthropic</h2>
                <p class="text-sm text-gray-500">Claude models for transcript generation</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key
              </label>
              <input
                type="password"
                id="anthropic-key"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="sk-ant-..."
                value=""
              />
              <p class="mt-1 text-xs text-gray-500">
                Get your API key from: <a href="https://console.anthropic.com/" target="_blank" class="text-purple-600 hover:underline">console.anthropic.com</a>
              </p>
            </div>
          </div>

          {/* Google Gemini Configuration */}
          <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fab fa-google text-blue-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Google Gemini</h2>
                <p class="text-sm text-gray-500">Gemini models and Google TTS</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Google API Key
              </label>
              <input
                type="password"
                id="google-key"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="AIza..."
                value=""
              />
              <p class="mt-1 text-xs text-gray-500">
                Get your API key from: <a href="https://makersuite.google.com/app/apikey" target="_blank" class="text-purple-600 hover:underline">Google AI Studio</a>
              </p>
            </div>
          </div>

          {/* ElevenLabs Configuration */}
          <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-microphone text-purple-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">ElevenLabs</h2>
                <p class="text-sm text-gray-500">Premium voice synthesis</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ElevenLabs API Key
              </label>
              <input
                type="password"
                id="elevenlabs-key"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="..."
                value=""
              />
              <p class="mt-1 text-xs text-gray-500">
                Get your API key from: <a href="https://elevenlabs.io/api" target="_blank" class="text-purple-600 hover:underline">elevenlabs.io</a>
              </p>
            </div>
          </div>

          {/* Azure OpenAI Configuration */}
          <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fab fa-microsoft text-cyan-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Azure OpenAI</h2>
                <p class="text-sm text-gray-500">Enterprise OpenAI deployment (optional)</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Azure OpenAI API Key
                </label>
                <input
                  type="password"
                  id="azure-key"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="..."
                  value=""
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Azure Endpoint
                </label>
                <input
                  type="url"
                  id="azure-endpoint"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="https://your-resource.openai.azure.com/"
                  value=""
                />
              </div>
            </div>
          </div>

          {/* HuggingFace Configuration */}
          <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-face-smile text-yellow-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">HuggingFace</h2>
                <p class="text-sm text-gray-500">Local LLM models (optional)</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                HuggingFace API Token
              </label>
              <input
                type="password"
                id="huggingface-key"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="hf_..."
                value=""
              />
              <p class="mt-1 text-xs text-gray-500">
                Get your token from: <a href="https://huggingface.co/settings/tokens" target="_blank" class="text-purple-600 hover:underline">huggingface.co</a>
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div class="bg-white rounded-xl shadow-lg p-8">
            <button
              id="save-settings"
              class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              <i class="fas fa-save mr-2"></i>
              Save API Configuration
            </button>
            <p class="mt-4 text-sm text-gray-500 text-center">
              <i class="fas fa-info-circle mr-1"></i>
              API keys are securely stored as environment variables and never exposed to the client
            </p>
          </div>

          {/* Back to Home */}
          <div class="text-center mt-6">
            <a href="/" class="text-purple-600 hover:underline">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
})

// API endpoint to check if API keys are configured
settings.get('/api/settings/status', (c) => {
  const env = c.env as Bindings
  
  const status = {
    openai: !!env.OPENAI_API_KEY,
    anthropic: !!env.ANTHROPIC_API_KEY,
    google: !!env.GOOGLE_API_KEY,
    elevenlabs: !!env.ELEVENLABS_API_KEY,
    azure: !!env.AZURE_OPENAI_API_KEY,
    huggingface: !!env.HUGGINGFACE_API_KEY
  }
  
  return c.json({ configured: status })
})

// API endpoint to verify admin password
settings.post('/api/settings/auth', async (c) => {
  try {
    const { password } = await c.req.json()
    const env = c.env as Bindings
    
    if (!env.ADMIN_PASSWORD) {
      return c.json({ success: false, message: 'Admin password not configured' }, 500)
    }
    
    if (password === env.ADMIN_PASSWORD) {
      // In production, use proper session management
      return c.json({ success: true, message: 'Authentication successful' })
    } else {
      return c.json({ success: false, message: 'Invalid password' }, 401)
    }
  } catch (error) {
    return c.json({ success: false, message: 'Authentication failed' }, 500)
  }
})

// Note: API keys should be set using Wrangler secrets
// wrangler secret put OPENAI_API_KEY
// wrangler secret put ANTHROPIC_API_KEY
// etc.

export default settings
