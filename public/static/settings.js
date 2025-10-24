// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const authSection = document.getElementById('auth-section');
  const settingsForm = document.getElementById('settings-form');
  const authForm = document.getElementById('auth-form');
  const saveButton = document.getElementById('save-settings');

  let isAuthenticated = false;

  // Check API key status on load
  checkApiStatus();

  // Authentication form handler
  if (authForm) {
    authForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const password = document.getElementById('admin-password').value;

      try {
        const response = await axios.post('/api/settings/auth', { password });
        
        if (response.data.success) {
          isAuthenticated = true;
          authSection.classList.add('hidden');
          settingsForm.classList.remove('hidden');
          
          // Load current API key status
          await loadApiKeyStatus();
        } else {
          alert('Authentication failed: ' + response.data.message);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        alert('Authentication failed. Please check your password.');
      }
    });
  }

  // Save settings handler
  if (saveButton) {
    saveButton.addEventListener('click', async function() {
      if (!isAuthenticated) {
        alert('Please authenticate first');
        return;
      }

      const settings = {
        openai_key: document.getElementById('openai-key').value,
        anthropic_key: document.getElementById('anthropic-key').value,
        google_key: document.getElementById('google-key').value,
        elevenlabs_key: document.getElementById('elevenlabs-key').value,
        azure_key: document.getElementById('azure-key').value,
        azure_endpoint: document.getElementById('azure-endpoint').value,
        huggingface_key: document.getElementById('huggingface-key').value
      };

      // Show instructions instead of trying to save directly
      showSaveInstructions(settings);
    });
  }

  async function checkApiStatus() {
    try {
      const response = await axios.get('/api/settings/status');
      const status = response.data.configured;
      
      // You could show status indicators here
      console.log('API Keys Status:', status);
    } catch (error) {
      console.error('Failed to check API status:', error);
    }
  }

  async function loadApiKeyStatus() {
    try {
      const response = await axios.get('/api/settings/status');
      const status = response.data.configured;

      // Update UI to show which keys are configured
      updateKeyStatus('openai-key', status.openai);
      updateKeyStatus('anthropic-key', status.anthropic);
      updateKeyStatus('google-key', status.google);
      updateKeyStatus('elevenlabs-key', status.elevenlabs);
      updateKeyStatus('azure-key', status.azure);
      updateKeyStatus('huggingface-key', status.huggingface);
    } catch (error) {
      console.error('Failed to load API key status:', error);
    }
  }

  function updateKeyStatus(inputId, isConfigured) {
    const input = document.getElementById(inputId);
    if (input && isConfigured) {
      input.placeholder = '••••••••••••••••••••••• (configured)';
      input.parentElement.insertAdjacentHTML('beforeend', 
        '<span class="text-xs text-green-600 mt-1 block"><i class="fas fa-check-circle mr-1"></i>Configured</span>'
      );
    }
  }

  function showSaveInstructions(settings) {
    const instructions = `
To save your API keys securely, you need to use Wrangler CLI to set secrets:

${settings.openai_key ? `wrangler secret put OPENAI_API_KEY
Enter value: ${maskKey(settings.openai_key)}

` : ''}${settings.anthropic_key ? `wrangler secret put ANTHROPIC_API_KEY
Enter value: ${maskKey(settings.anthropic_key)}

` : ''}${settings.google_key ? `wrangler secret put GOOGLE_API_KEY
Enter value: ${maskKey(settings.google_key)}

` : ''}${settings.elevenlabs_key ? `wrangler secret put ELEVENLABS_API_KEY
Enter value: ${maskKey(settings.elevenlabs_key)}

` : ''}${settings.azure_key ? `wrangler secret put AZURE_OPENAI_API_KEY
Enter value: ${maskKey(settings.azure_key)}

wrangler secret put AZURE_OPENAI_ENDPOINT
Enter value: ${settings.azure_endpoint}

` : ''}${settings.huggingface_key ? `wrangler secret put HUGGINGFACE_API_KEY
Enter value: ${maskKey(settings.huggingface_key)}

` : ''}
Don't forget to set the admin password:
wrangler secret put ADMIN_PASSWORD
Enter value: your-secure-password

After setting secrets, redeploy your app:
npm run deploy:prod
    `.trim();

    // Create a modal or alert with instructions
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            <i class="fas fa-terminal mr-2"></i>
            How to Save API Keys
          </h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <p class="text-gray-700 mb-4">
            For security, API keys cannot be saved directly from the browser. Use the Wrangler CLI to set them as environment secrets:
          </p>
          <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">${instructions}</pre>
        </div>
        <div class="flex items-start gap-3 bg-blue-50 p-4 rounded-lg mb-4">
          <i class="fas fa-info-circle text-blue-600 mt-1"></i>
          <div class="text-sm text-blue-900">
            <p class="font-semibold mb-1">Why use Wrangler secrets?</p>
            <p>Wrangler secrets are encrypted and never exposed to the client-side code. This is the secure way to manage API keys in Cloudflare Workers.</p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Close
          </button>
          <button onclick="copyToClipboard(\`${instructions.replace(/`/g, '\\`')}\`)" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <i class="fas fa-copy mr-2"></i>
            Copy Commands
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function maskKey(key) {
    if (!key || key.length < 8) return key;
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
  }

  // Global function for copy to clipboard
  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Commands copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };
});
