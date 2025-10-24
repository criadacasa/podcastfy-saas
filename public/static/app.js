// Podcast Generation SaaS - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize state
  let currentContentType = 'urls';
  let uploadedFiles = {
    pdf: [],
    image: []
  };

  // Content Type Switching
  const contentTypeBtns = document.querySelectorAll('.content-type-btn');
  const contentSections = document.querySelectorAll('.content-section');

  contentTypeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      
      // Update active button
      contentTypeBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update active section
      contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.getAttribute('data-section') === type) {
          section.classList.add('active');
        }
      });
      
      currentContentType = type;
    });
  });

  // File Upload Handlers
  const pdfInput = document.getElementById('pdf-input');
  const imageInput = document.getElementById('image-input');
  const pdfList = document.getElementById('pdf-list');
  const imageList = document.getElementById('image-list');

  if (pdfInput) {
    pdfInput.addEventListener('change', function(e) {
      handleFileUpload(e.target.files, 'pdf', pdfList);
    });
  }

  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      handleFileUpload(e.target.files, 'image', imageList);
    });
  }

  function handleFileUpload(files, type, listElement) {
    Array.from(files).forEach(file => {
      uploadedFiles[type].push(file);
      
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <div class="file-item-name">
          <i class="fas fa-file${type === 'pdf' ? '-pdf' : '-image'} text-${type === 'pdf' ? 'red' : 'blue'}-500"></i>
          <span>${file.name}</span>
          <span class="text-gray-400 text-xs ml-2">(${formatFileSize(file.size)})</span>
        </div>
        <div class="file-item-remove" data-filename="${file.name}" data-type="${type}">
          <i class="fas fa-times-circle"></i>
        </div>
      `;
      
      listElement.appendChild(fileItem);
      
      // Add remove handler
      fileItem.querySelector('.file-item-remove').addEventListener('click', function() {
        const filename = this.getAttribute('data-filename');
        const type = this.getAttribute('data-type');
        removeFile(filename, type, fileItem);
      });
    });
  }

  function removeFile(filename, type, element) {
    uploadedFiles[type] = uploadedFiles[type].filter(f => f.name !== filename);
    element.remove();
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Generate Podcast Button
  const generateBtn = document.getElementById('generate-btn');
  const progressSection = document.getElementById('progress-section');
  const resultSection = document.getElementById('result-section');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  if (generateBtn) {
    generateBtn.addEventListener('click', async function() {
      // Collect input data based on content type
      const inputData = collectInputData();
      
      if (!validateInput(inputData)) {
        alert('Please provide content to generate a podcast!');
        return;
      }

      // Collect configuration
      const config = collectConfiguration();

      // Hide generate button, show progress
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
      progressSection.classList.remove('hidden');
      resultSection.classList.add('hidden');

      try {
        // Update progress: Processing
        progressBar.style.width = '30%';
        progressText.textContent = '30%';

        // Call API to generate podcast (REAL IMPLEMENTATION)
        const response = await axios.post('/api/generate', {
          contentType: currentContentType,
          input: inputData,
          config: config
        });

        if (response.data.success) {
          // Update progress: Complete
          progressBar.style.width = '100%';
          progressText.textContent = '100%';

          // Show result with actual audio
          setTimeout(() => {
            showResult(response.data.audioUrl, response.data.transcript);
          }, 500);
        } else {
          throw new Error(response.data.error || 'Generation failed');
        }
      } catch (error) {
        console.error('Error generating podcast:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
        alert('Failed to generate podcast: ' + errorMessage);
        resetUI();
      }
    });
  }

  function collectInputData() {
    const data = {};
    
    switch(currentContentType) {
      case 'urls':
        const urlsInput = document.getElementById('urls-input');
        data.urls = urlsInput.value.split('\n').filter(u => u.trim());
        break;
      case 'youtube':
        const youtubeInput = document.getElementById('youtube-input');
        data.youtube = youtubeInput.value.split('\n').filter(u => u.trim());
        break;
      case 'pdf':
        data.files = uploadedFiles.pdf;
        break;
      case 'image':
        data.files = uploadedFiles.image;
        break;
      case 'topic':
        const topicInput = document.getElementById('topic-input');
        data.topic = topicInput.value.trim();
        break;
    }
    
    return data;
  }

  function validateInput(data) {
    if (currentContentType === 'urls' && (!data.urls || data.urls.length === 0)) {
      return false;
    }
    if (currentContentType === 'youtube' && (!data.youtube || data.youtube.length === 0)) {
      return false;
    }
    if (currentContentType === 'pdf' && (!data.files || data.files.length === 0)) {
      return false;
    }
    if (currentContentType === 'image' && (!data.files || data.files.length === 0)) {
      return false;
    }
    if (currentContentType === 'topic' && !data.topic) {
      return false;
    }
    return true;
  }

  function collectConfiguration() {
    const selects = document.querySelectorAll('select');
    const checkbox = document.querySelector('input[type="checkbox"]');
    
    return {
      length: selects[0].value,
      language: selects[1].value,
      speakers: parseInt(selects[2].value),
      style: selects[3].value,
      voiceModel: selects[4].value,
      generateTranscript: checkbox.checked
    };
  }

  function showResult(audioUrl, transcript) {
    progressSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // Set the podcast title
    const title = document.getElementById('podcast-title');
    if (title) {
      title.textContent = 'Generated Podcast - ' + new Date().toLocaleString();
    }

    // Set the actual audio source
    const audioSource = document.getElementById('audio-source');
    const audioPlayer = audioSource.parentElement;
    if (audioSource && audioUrl) {
      audioSource.src = audioUrl;
      audioPlayer.load(); // Reload the audio player with new source
      console.log('Audio loaded:', audioUrl);
    }

    // Store transcript for later viewing
    if (transcript) {
      window.currentTranscript = transcript;
    }
    
    resetUI();
  }

  function resetUI() {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-magic mr-2"></i>Generate Podcast';
  }

  // Handle "Generate Another" button
  document.addEventListener('click', function(e) {
    if (e.target.closest('button')?.textContent.includes('Generate Another')) {
      resultSection.classList.add('hidden');
      progressSection.classList.add('hidden');
      
      // Clear inputs
      document.querySelectorAll('textarea').forEach(ta => ta.value = '');
      uploadedFiles = { pdf: [], image: [] };
      pdfList.innerHTML = '';
      imageList.innerHTML = '';
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Download, Transcript, and Share handlers
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.textContent.includes('Download Audio')) {
      const audioSource = document.getElementById('audio-source');
      if (audioSource && audioSource.src) {
        // Create download link
        const a = document.createElement('a');
        a.href = audioSource.src;
        a.download = 'podcast-' + Date.now() + '.mp3';
        a.click();
      } else {
        alert('No audio available to download');
      }
    } else if (btn.textContent.includes('View Transcript')) {
      if (window.currentTranscript) {
        // Show transcript in a modal/alert (can be enhanced with a proper modal later)
        const transcriptWindow = window.open('', 'Transcript', 'width=600,height=400');
        transcriptWindow.document.write(`
          <html>
            <head>
              <title>Podcast Transcript</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                h1 { color: #6b46c1; }
                pre { white-space: pre-wrap; background: #f7fafc; padding: 15px; border-radius: 5px; }
              </style>
            </head>
            <body>
              <h1>Podcast Transcript</h1>
              <pre>${window.currentTranscript}</pre>
            </body>
          </html>
        `);
      } else {
        alert('No transcript available. Enable "Generate Transcript" option when creating podcasts.');
      }
    } else if (btn.textContent.includes('Share')) {
      const audioSource = document.getElementById('audio-source');
      if (audioSource && audioSource.src) {
        // Copy audio URL to clipboard
        navigator.clipboard.writeText(window.location.origin + audioSource.src).then(() => {
          alert('Audio URL copied to clipboard!');
        }).catch(() => {
          alert('Audio URL: ' + window.location.origin + audioSource.src);
        });
      } else {
        alert('No audio available to share');
      }
    }
  });

  console.log('Podcastfy SaaS initialized successfully!');
});
