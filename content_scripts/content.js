
// debugger
// console.log(chrome.declarativeNetRequest)
;(async function(){
  function uaScriptInit(){
    var uaScript = document.createElement("script");
    uaScript.type = "text/javascript";
    // uaScript.setAttribute("id", config.script.id);
    uaScript.src = chrome.runtime.getURL("content_scripts/inject.js");
    document.documentElement.appendChild(uaScript);
    uaScript.onload = function () { uaScript.remove() };
  }
  function toolStyleInit(){
    var importantStyle=document.createElement("style");
    importantStyle.innerHTML=`
    .readerPage .readerToolBar,
    .shelfContentContainer .shelfToolBar{
      transition: all .5s;
      transform: translate(0, 100%);
      opacity:0;
      margin-bottom: 40px;
    }
    .readerPage .readerToolBar:hover,
    .shelfContentContainer .shelfToolBar:hover{
      opacity:1;
    }
    .readerPage .readerToolBar *{
      visibility: hidden;
    }
    .readerPage .readerToolBar:hover *{
      visibility: visible;
    }
    /*
    .readerContentRenderContainer .wr_abs{
      user-select: all;
    }
    */
    `
    document.documentElement.appendChild(importantStyle);
  }


  if(location.hostname==='weread.qq.com'){
    uaScriptInit()
    toolStyleInit()    
    window.addEventListener('keyup',function(e){
      switch(e.key){
        case 'PageUp':
        case 'ArrowLeft':
          document.getElementById('readerToolBar_prevPage').click()
          break;
        case 'PageDown':
        case 'ArrowRight':
          document.getElementById('readerToolBar_nextPage').click()
          break;
        case 'Delete':
          chrome.runtime.sendMessage({
            action: 'activeTabDiscard',
            payload: {}
          }).then((res)=>{
            //
          })
      }
    })
    // debugger
  }
})();

/*
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting === "getWxBookContent") {
      var strs = document.getElementById('readerContentRenderContainer').innerText.replace(/\n/g, '');
      sendResponse({ farewell: strs });
    }
  }
);
*/