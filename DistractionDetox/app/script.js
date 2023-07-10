


function renderBadSites(badSites) {
  const badSitesList = document.getElementById('badSitesList');
  badSitesList.innerHTML = ''; // Clear the list

  for (const site of badSites) {
    const listItem = document.createElement('li');
    listItem.textContent = site;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      chrome.storage.sync.get(['badSites'], function (result) {
        const badSites = result.badSites || [];
        const updatedBadSites = badSites.filter((siteItem) => siteItem !== site);
        chrome.storage.sync.set({ badSites: updatedBadSites }, function () {
          renderBadSites(updatedBadSites);
        });
      });
    });

    listItem.appendChild(deleteButton);
    badSitesList.appendChild(listItem);
  }
}

// Load and render the bad sites from storage
chrome.storage.sync.get(['badSites'], function (result) {
  const badSites = result.badSites || [];
  renderBadSites(badSites);
});

document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const timeInput = document.getElementById('time');
  const time = timeInput.value;

  // Send message to background.js
  chrome.runtime.sendMessage({ time: time });
});

document.getElementById('addSite').addEventListener('click', function () {
  const newSiteInput = document.getElementById('newSite');
  const newSite = newSiteInput.value;

  chrome.storage.sync.get(['badSites'], function (result) {
    const badSites = result.badSites || [];
    badSites.push(newSite);
    chrome.storage.sync.set({ badSites: badSites }, function () {
      renderBadSites(badSites);
      newSiteInput.value = ''; // Clear the input field
    });
  });
});
