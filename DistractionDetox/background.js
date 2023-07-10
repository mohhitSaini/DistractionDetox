


let time = 5;
let saved = null;

chrome.runtime.onMessage.addListener(function (message) {
  if (message.time) {
    saved = message.time;
    console.log(saved);
  }
});

// Check for bad sites when the extension is first activated
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentTab = tabs[0];
  checkForBadSite(currentTab);
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    checkForBadSite(tab);
  }
});

function checkForBadSite(tab) {
  chrome.storage.sync.get(['badSites'], function (result) {
    const badSites = result.badSites || [];
    for (const site of badSites) {
      if (tab.url.includes(site)) {
        const intervalId = setInterval(() => {
          time--;
          if (time === 0) {
            clearInterval(intervalId);
            chrome.tabs.remove(tab.id);
          }
        }, 1000);
        time = saved;
        break;
      }
    }
  });
}








