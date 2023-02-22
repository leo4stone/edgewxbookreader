;(async function(){

  var {ruleIsEnable}= await chrome.storage.local.get(["ruleIsEnable"])
  var {textSelectIsEnable}= await chrome.storage.local.get(["textSelectIsEnable"])
  var {bodyTheme}= await chrome.storage.local.get(["bodyTheme"])

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
    var styleText=`
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
    .readerContentRenderContainer img {
      max-height: 100%;
      object-fit: contain;
    }
    `
    if(textSelectIsEnable){
      styleText+=`
      .readerPage#readerPage{
        user-select: text;
      }
      `
    }
    if(bodyTheme==='black'){
      styleText+=`
      html{
        filter: invert(100%) hue-rotate(180deg);
      }
      img,
      video,
      code {
        filter: invert(100%) hue-rotate(180deg) contrast(100%);
      }
      `
    }
    

    importantStyle.innerHTML=styleText
    document.documentElement.appendChild(importantStyle);
  }
  function pageClickEventStopPropagation(){
    if(textSelectIsEnable){
      setTimeout(()=>{
        var $readerPage_InShelf=this.document.getElementById('readerPage_InShelf')
        $readerPage_InShelf && $readerPage_InShelf.addEventListener('click',function(e){
          e.stopPropagation();
        })
      },10);
    }
  }
  console.log('ruleIsEnable1',ruleIsEnable)
  if(location.hostname==='weread.qq.com' && ruleIsEnable){
    uaScriptInit()
    toolStyleInit()
    pageClickEventStopPropagation()
    
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
  }
})();