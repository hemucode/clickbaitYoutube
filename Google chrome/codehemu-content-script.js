/**
 * By @Codehemu - https://www.downloadhub.cloud ( JS: MIT License)
 * License - https://github.com/hemucode/LICENSE ( CSS: MIT License)
 */
console.log(`[`+chrome.i18n.getMessage("extensionName")+` v${chrome.runtime.getManifest().version} Enabled]`);
console.log(chrome.i18n.getMessage("official") +` https://chrome.google.com/webstore/detail/${chrome.runtime.id}`)


async function changeTitles(){
  var c = new Promise(function(resolve, reject){
        chrome.storage.sync.get({"changeTitle": "3"}, function(options){
            resolve(options.changeTitle);
      })
  });

  const changeTitle = await c;

  $codehemuStyle = document.querySelector(".codehemu_codehemu");
  if ($codehemuStyle) {
      $codehemuStyle.parentNode.removeChild($codehemuStyle);
  }
  var css = document.createElement("style");
  css.classList.add("codehemu_codehemu")
  var head = document.head;
  head.appendChild(css);
  css.type = 'text/css';

  if (changeTitle=="0") {
      css.innerText = `#video-title, .ytp-videowall-still-info-title, .large-media-item-metadata > a > h3 > span, .media-item-metadata > a > h3 > span, .compact-media-item-headline > span { text-transform: lowercase; }`;
  }
  if (changeTitle=="1") {
      css.innerText = `#video-title, .ytp-videowall-still-info-title, .large-media-item-metadata > a > h3 > span, .media-item-metadata > a > h3 > span, .compact-media-item-headline > span { text-transform: lowercase; display: block !important; } #video-title::first-letter, .ytp-videowall-still-info-title::first-letter, .large-media-item-metadata > a > h3 > span::first-letter, .media-item-metadata > a > h3 > span::first-letter, .compact-media-item-headline > span::first-letter { text-transform: uppercase; }`;
  }
  if (changeTitle=="2") {
      css.innerText = `#video-title, .ytp-videowall-still-info-title, .large-media-item-metadata > a > h3 > span, .media-item-metadata > a > h3 > span, .compact-media-item-headline > span { text-transform: lowercase; display: block !important; } #video-title::first-line, .ytp-videowall-still-info-title::first-line, .large-media-item-metadata > a > h3 > span::first-line, .media-item-metadata > a > h3 > span::first-line, .compact-media-item-headline > span::first-line { text-transform: capitalize; }`;
  }
  if (changeTitle=="3") {
      css.innerText = ``;
  }
}
changeTitles();

async function thumbnails(){
    var b = new Promise(function(resolve, reject){
          chrome.storage.sync.get({"thumbnail": "hq1"}, function(options){
              resolve(options.thumbnail);
        })
    });

    const thumbnail = await b;


    let imgElements = document.getElementsByTagName('img');

    for (let i = 0; i < imgElements.length; i++) {
        if (imgElements[i].src.match('https://i.ytimg.com/vi/.*/(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg?.*')) {

            let url = imgElements[i].src.replace(/(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg/, `${thumbnail}.jpg`);

            if (!url.match('.*stringtokillcache')) {
                url += '?stringtokillcache'
            }

            imgElements[i].src = url;
        }
    }

    let backgroundImgElements = document.querySelectorAll('.ytp-videowall-still-image, .iv-card-image');

      for (let i = 0; i < backgroundImgElements.length; i++) {
          let styleAttribute = backgroundImgElements[i].getAttribute('style');

          if (styleAttribute.match('.*https://i.ytimg.com/vi/.*/(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg?.*')) {

              let newStyleAttribute = styleAttribute.replace(/(hq1|hq2|hq3|hqdefault|mqdefault|hq720).jpg/, `${thumbnail}.jpg`);

              if (!newStyleAttribute.match('.*stringtokillcache.*')) {
                  newStyleAttribute = newStyleAttribute.replace(/"\);$/, '?stringtokillcache");')
              }

              backgroundImgElements[i].style = newStyleAttribute;
          }
      }
}

async function init() {
  try {
    chrome.storage.onChanged.addListener(async (changes, namespace) => {
      if (namespace !== "sync") return;

      if (changes.thumbnail) {
        if (changes.thumbnail.newValue) {
          await thumbnails();
        }
      }if (changes.changeTitle) {
        if (changes.changeTitle.newValue) {
          await changeTitles();
        }
      }

    });


    var a = new Promise(function(resolve, reject){
          chrome.storage.sync.get({"enabled": true}, function(options){
              resolve(options.enabled);
          })
      });

    const enabled = await a;

    //console.log(thumbnail);
  

    setInterval(()=>{
      imgElements = document.getElementsByTagName('img');

      if (imgElements) {
        

      }

      if (enabled) {
        const btn=document.querySelector(".ytp-ad-skip-button");
        if( ! document.querySelector('.ad-showing') ) return
              const video=document.querySelector('video')
              if( ! video)  return
              if( btn) {
                btn.click();
              } else {
                video.currentTime = isNaN(video.duration) ? 0 : video.duration
              }
      }

    },300);

    await Promise.all([injectStyles()]);

    /**
    * @returns Promise
    */

  }
  catch(err) {
    console.log(err.message);
  }
 
}
init();

/**
 * @returns Promise
 */
function injectStyles() {
  return chrome.runtime.sendMessage({
    action: "INSERT_CSS_RULE",
    rule: "content-style",
  });
}
