document.addEventListener('DOMContentLoaded', () => {
    // --- Button to open settings ---
    document.getElementById('open-settings').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    // --- Demo Page Checker Logic ---
    
    // This is our hard-coded demo list of "bad" sites.
    // In a real app, this list would be much longer.
    const demoBlocklist = [
        "harmfulsite.example",
        "bad-search.example",
        "fakesite.org"
    ];

    const statusBox = document.getElementById('status-box');
    const currentSiteElement = document.getElementById('current-site');

    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
            statusBox.textContent = 'Error';
            statusBox.className = 'status-warning';
            currentSiteElement.textContent = 'Could not get current tab.';
            return;
        }

        const currentTab = tabs[0];
        
        // Check if the tab has a URL (e.g., not a new tab page)
        if (!currentTab.url) {
            statusBox.textContent = 'No URL';
            statusBox.className = 'status-info';
            currentSiteElement.textContent = 'This page has no URL (e.g., New Tab page).';
            return;
        }

        let isSafe = true;
        let siteHost;

        try {
            // Get the "hostname" (e.g., "google.com") from the full URL
            siteHost = new URL(currentTab.url).hostname;
        } catch (e) {
            statusBox.textContent = 'Invalid URL';
            statusBox.className = 'status-warning';
            currentSiteElement.textContent = 'Could not read this URL.';
            return;
        }
        
        // Check if the site's host is in our blocklist
        for (const blockedSite of demoBlocklist) {
            if (siteHost.includes(blockedSite)) {
                isSafe = false;
                break;
            }
        }

        // Update the popup UI
        if (isSafe) {
            statusBox.textContent = 'This Page is SAFE';
            statusBox.className = 'status-safe';
        } else {
            statusBox.textContent = 'WARNING (Demo)';
            statusBox.className = 'status-warning';
        }

        currentSiteElement.textContent = `Current site: ${siteHost}`;
    });
});
