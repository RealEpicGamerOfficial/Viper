// background.js

// Listen for the extension being installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('VIPER Demo extension installed.');
  
  // Set default settings on installation
  chrome.storage.sync.set({
    enableAI: false,
    aiModel: 'gemini',
    securityCode: ''
  }, () => {
    console.log('Default settings saved.');
  });
});

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  // Open the options page when the icon is clicked
  chrome.runtime.openOptionsPage();
});
