chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the URL exists and the page has completed loading
  if (changeInfo.status === 'complete' && tab.url && 
    (tab.url.includes("twitter.com") || tab.url.includes("x.com"))) {
    
    // Add a small delay to ensure content script is loaded
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { 
        action: "getTitle",
        tabId: tabId 
      }).catch(err => {
        console.debug("Error sending message:", err);
      });
    }, 500);
  }
});