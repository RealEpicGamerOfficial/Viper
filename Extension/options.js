document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');
    const saveIndicator = document.getElementById('save-indicator');

    // Find all elements that have a 'data-setting' attribute
    const settingElements = document.querySelectorAll('[data-setting]');

    // Function to load settings from chrome.storage
    function loadSettings() {
        // Get all setting keys
        const keys = Array.from(settingElements).map(el => el.dataset.setting);
        
        chrome.storage.sync.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                console.error("Error loading settings:", chrome.runtime.lastError);
                return;
            }

            settingElements.forEach(el => {
                const key = el.dataset.setting;
                const value = items[key];

                if (value === undefined) {
                    return; // No setting saved for this element yet
                }

                if (el.type === 'checkbox') {
                    el.checked = value;
                } else if (el.tagName.toLowerCase() === 'select') {
                    el.value = value;
                } else if (el.type === 'text') {
                    el.value = value;
                }
            });
        });
    }

    // Function to save settings to chrome.storage
    function saveSettings() {
        let settingsToSave = {};

        settingElements.forEach(el => {
            const key = el.dataset.setting;
            let value;

            if (el.type === 'checkbox') {
                value = el.checked;
            } else if (el.tagName.toLowerCase() === 'select') {
                value = el.value;
            } else if (el.type === 'text') {
                value = el.value;
            }
            settingsToSave[key] = value;
        });

        chrome.storage.sync.set(settingsToSave, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving settings:", chrome.runtime.lastError);
                saveIndicator.textContent = 'Error saving!';
                saveIndicator.classList.remove('text-green-400');
                saveIndicator.classList.add('text-red-400');
            } else {
                // Show a success message for 2 seconds
                saveIndicator.textContent = 'Settings saved successfully!';
                saveIndicator.classList.add('text-green-400');
                saveIndicator.classList.remove('text-red-400');
                
                setTimeout(() => {
                    saveIndicator.textContent = '';
                }, 2000);
            }
        });
    }

    // --- Event Listeners ---

    // Save button click
    saveButton.addEventListener('click', saveSettings);

    // Handle navigation clicks (for demo)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active styles from all links
            navLinks.forEach(l => {
                l.classList.remove('bg-gray-800', 'text-white');
                l.classList.add('text-gray-400', 'hover:bg-gray-800', 'hover:text-white');
            });
            
            // Add active styles to clicked link
            e.currentTarget.classList.add('bg-gray-800', 'text-white');
            e.currentTarget.classList.remove('text-gray-400');
        });
    });

    // Load settings when the page is opened
    loadSettings();
});
