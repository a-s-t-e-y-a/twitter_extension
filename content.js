// Function to inject the custom button
const injectCustomButton = () => {
  // Check if the button already exists
  if (document.getElementById("custom-tweet-button")) {
    return;
  }

  // Create a new button element
  const customButton = document.createElement("button");
  customButton.id = "custom-tweet-button";
  customButton.innerText = "Custom Action";
  customButton.style.marginLeft = "10px";
  customButton.style.backgroundColor = "#1DA1F2"; // Twitter blue color
  customButton.style.color = "white";
  customButton.style.border = "none";
  customButton.style.borderRadius = "20px";
  customButton.style.padding = "8px 16px";
  customButton.style.cursor = "pointer";

  // Add a click event listener to the button
  customButton.addEventListener("click", () => {
    const tweetText = document.querySelector("div[data-testid='tweetTextarea_0']")?.innerText;
    if (tweetText) {
      alert(`You are about to post: "${tweetText}"`);
      // You can add your custom logic here, like sending the tweet to an API
    }
  });

  // Find the tweet compose area and append the button
  const tweetComposeArea = document.querySelector("div[data-testid='tweetButtonInline']");
  if (tweetComposeArea) {
    tweetComposeArea.appendChild(customButton);
  }
};

// Check if the current page is the tweet compose page
const isTweetComposePage = () => {
  return window.location.href.includes("https://x.com/compose/tweet");
};

// Run the script when the page loads
if (isTweetComposePage()) {
  injectCustomButton();
}

// Optional: Use MutationObserver to handle dynamic page changes (e.g., SPA navigation)
const observer = new MutationObserver(() => {
  if (isTweetComposePage()) {
    injectCustomButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });