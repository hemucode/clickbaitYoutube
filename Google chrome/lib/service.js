chrome.runtime.onStartup.addListener(async () => {
  var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
      })
  });

  const enabled = await a;
  console.log(enabled);
  if (enabled) {
    await enable();
  } else {
    await disable();
  }
});

chrome.runtime.onInstalled.addListener(async (details) => {
  switch (details.reason) {
    case chrome.runtime.OnInstalledReason.INSTALL:
      return chrome.storage.sync.set({
        installDate: Date.now(),
        installVersion: chrome.runtime.getManifest().version,
      });
    case chrome.runtime.OnInstalledReason.UPDATE:
      return chrome.storage.sync.set({
        updateDate: Date.now(),
      });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  switch (request.action) {
    case "INSERT_CSS_RULE": {
      return chrome.scripting.insertCSS({
        target: { tabId: sender.tab.id },
        files: [`content-style.css`],
      });
    }
    default:
      throw new Error(`Unknown Action: ${request.action}`);
  }
});


chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== "sync") return;

  if (changes.enabled) {
    if (changes.enabled.newValue) {
      await enable();
    } else {
      await disable();
    }
  }
  if (changes.thumbnail) {
    if (changes.thumbnail.newValue) {
      setupThumbnailRedirectListeners();
    }
  }

  if (changes.displayActionCountAsBadgeText) {
    await chrome.declarativeNetRequest.setExtensionActionOptions({
      displayActionCountAsBadgeText:
        changes.displayActionCountAsBadgeText.newValue,
    });
  }
});


/**
 * Enables this extension core
 * @returns Promise
 */

async function setupThumbnailRedirectListeners(){
  var b = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"thumbnail": "hq1"}, function(options){
            resolve(options.thumbnail);
      })
  });

  const preferredThumbnailFile = await b;

  if (preferredThumbnailFile === 'hqdefault') {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1]
        })
    } else {
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    "id": 1,
                    "priority": 1,
                    "action": {
                        "type": "redirect",
                        "redirect": {
                            "regexSubstitution": `https://i.ytimg.com/\\1/\\2/${preferredThumbnailFile}.jpg\\4`
                        }
                    },
                    "condition": {
                        "regexFilter": "^https://i.ytimg.com/(vi|vi_webp)/(.*)/(default|hqdefault|mqdefault|sddefault|hq720).jpg(.*)",
                        "resourceTypes": [
                            "image"
                        ]
                    }
                }
            ],
            removeRuleIds: [1]
        })
    }
}


async function enable() {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ["youtube"],
  });
  await reloadAffectedTab();
}

/**
 * @returns Promise
 */
async function disable() {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: ["youtube"],
  });
  await reloadAffectedTab();
}

/**
 * @returns Promise
 */
async function reloadAffectedTab() {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    url: "*://*.youtube.com/*",
  });
  const isTabAffected = Boolean(currentTab?.url);
  if (isTabAffected) {
    return chrome.tabs.reload();
  }
}
