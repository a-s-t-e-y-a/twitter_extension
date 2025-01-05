// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL is Twitter
  if (tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com"))) {
    // Send message to content script
    chrome.tabs.sendMessage(tabId, { action: "getTitle" })
      .then(response => {
        if (response && response.title) {
          console.log(`Tab ${tabId} title:`, response.title);
        }
      })
      .catch(err => console.log("Error getting title:", err));
  }
});