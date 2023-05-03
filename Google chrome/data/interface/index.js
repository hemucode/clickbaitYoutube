async function init() {
  return Promise.all([translate(), hydrate()]);
}

function translate() {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll("[data-message]");
    for (const element of elements) {
      const key = element.dataset.message;
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      } else {
        console.error("Missing chrome.i18n message:", key);
      }
    }
    resolve();
  });
}

/**
 * @returns Promise
 */
async function hydrate() {
   var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
        })
    });

  const enabled = await a;
  console.log(enabled);


  // Hydrate Checkbox Label
  const $checkboxLabel = document.querySelector("[data-message=enabled]");
  $checkboxLabel.textContent = chrome.i18n.getMessage(
    enabled ? "enabled" : "disabled"
  );

  // Hydrate Checkbox Label
  const $enabledCheckbox = document.querySelector("input[name=enabled]");
  $enabledCheckbox.checked = enabled;
  $enabledCheckbox.addEventListener("change", async (event) => {
    const enabled = event.currentTarget.checked;

    // Persist
    await chrome.storage.sync.set({ enabled });

    // Update Checkbox Label
    $checkboxLabel.textContent = chrome.i18n.getMessage(
      enabled ? "enabled" : "disabled"
    );

  });


  var b = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"thumbnail": "hq1"}, function(options){
            resolve(options.thumbnail);
      })
  });

  const thumbnail = await b;

  const $thumbnailselect = document.querySelector("#changeThumbnail");
  $thumbnailselect.value = thumbnail;
  $thumbnailselect.addEventListener("change", async (event) => {

    const thumbnail = event.currentTarget.value;

    // Persist
    await chrome.storage.sync.set({ "thumbnail":thumbnail });
  });


  var c = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"changeTitle": "3"}, function(options){
            resolve(options.changeTitle);
      })
  });

  const changeTitle = await c;

  const $Titleselect = document.querySelector("#changeTitle");
  $Titleselect.value = changeTitle;
  $Titleselect.addEventListener("change", async (event) => {
    const changeTitle = event.currentTarget.value;
    
    // Persist
    await chrome.storage.sync.set({ "changeTitle":changeTitle });
  });
  
}

init();
