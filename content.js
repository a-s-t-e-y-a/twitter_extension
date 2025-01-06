const GEMINI_API_KEY = "AIzaSyBhZUYUSUEVfD_5YbqkXTPGQvH8iSFfEgI";

async function fixGrammar(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Please fix any grammar issues in this text and return only the corrected version without any explanations: "${text}"`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}

function replaceTweetText(newText) {
  const editorElement = document.querySelector('[data-testid="tweetTextarea_0"]');
  if (editorElement) {
    // Find the span with data-text="true"
    const textSpan = editorElement.querySelector('span[data-text="true"]');
    
    if (textSpan) {
      // Update the existing span
      textSpan.textContent = newText;
    } else {
      // If no span exists (empty editor), create the structure
      const firstDiv = editorElement.querySelector('.public-DraftStyleDefault-block');
      if (firstDiv) {
        const span = document.createElement('span');
        const textSpan = document.createElement('span');
        span.setAttribute('data-offset-key', firstDiv.getAttribute('data-offset-key'));
        textSpan.setAttribute('data-text', 'true');
        textSpan.textContent = newText;
        span.appendChild(textSpan);
        firstDiv.innerHTML = '';
        firstDiv.appendChild(span);
      }
    }

    // Dispatch input event to update DraftJS internal state
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: newText
    });
    editorElement.dispatchEvent(inputEvent);
    
    // Focus the editor
    editorElement.focus();
  }
}

async function generateTweet(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Generate a tweet from this statement. Make it engaging and Twitter-friendly. Keep it concise. Only return the tweet, no explanations, also dont add any emoji to it, also don't add any hashtags in it: "${prompt}"`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}

function addCustomButton() {
  const postButton = document.querySelector('[data-testid="tweetButton"]');
  
  if (postButton && !document.querySelector('.custom-twitter-buttons')) {
    const parentElement = postButton.parentElement;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'custom-twitter-buttons';
    
    // Grammar fix button
    const grammarButton = document.createElement('button');
    grammarButton.className = 'custom-button';
    grammarButton.innerHTML = '✍️';
    grammarButton.title = 'Fix grammar with Gemini AI';
    
    // Generate tweet button
    const generateButton = document.createElement('button');
    generateButton.className = 'custom-button';
    generateButton.innerHTML = '🪄';
    generateButton.title = 'Generate tweet from prompt';
    
    // Grammar button click handler
    grammarButton.addEventListener('click', async () => {
      grammarButton.innerHTML = '⌛';
      const tweetText = document.querySelector('[data-testid="tweetTextarea_0"]')?.textContent || '';
      
      try {
        const correctedText = await fixGrammar(tweetText);
        if (correctedText) {
          replaceTweetText(correctedText);
          grammarButton.innerHTML = '✓';
        } else {
          throw new Error('No correction received');
        }
      } catch (error) {
        console.error('Error during grammar correction:', error);
        grammarButton.innerHTML = '❌';
      }
      
      setTimeout(() => {
        grammarButton.innerHTML = '✍️';
      }, 1000);
    });
    
    // Generate button click handler
    generateButton.addEventListener('click', async () => {
      generateButton.innerHTML = '⌛';
      const prompt = document.querySelector('[data-testid="tweetTextarea_0"]')?.textContent || '';
      
      try {
        const generatedTweet = await generateTweet(prompt);
        if (generatedTweet) {
          replaceTweetText(generatedTweet);
          generateButton.innerHTML = '✓';
        } else {
          throw new Error('No tweet generated');
        }
      } catch (error) {
        console.error('Error generating tweet:', error);
        generateButton.innerHTML = '❌';
      }
      
      setTimeout(() => {
        generateButton.innerHTML = '🪄';
      }, 1000);
    });
    
    buttonContainer.appendChild(grammarButton);
    buttonContainer.appendChild(generateButton);
    parentElement.insertBefore(buttonContainer, postButton);
  }
}

// Observer to watch for dynamic content loading
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      addCustomButton();
    }
  });
});

// Start observing the document
observer.observe(document.body, {
  childList: true,
  subtree: true
});