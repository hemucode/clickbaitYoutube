//================================================
/*
MIT License

ClickBait YouTube™
Copyright (C) 2023 hemanta gayen
www.downloadhub.cloud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
//================================================

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
  
  document.addEventListener("contextmenu", function (e){
      e.preventDefault();
  }, false);

  document.querySelector('.clickbait').href = `https://addons.opera.com/en/extensions/details/clickbait-youtubetm/`;

   var a = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"enabled": true}, function(options){
            resolve(options.enabled);
        })
    });

  const enabled = await a;
  // console.log(enabled);


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
  // console.log(thumbnail);

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
