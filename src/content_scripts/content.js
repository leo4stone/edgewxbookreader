;(async function(){
  var {ruleIsEnable}= await chrome.storage.local.get(["ruleIsEnable"])
  function uaInit(){
    var uaScript = document.createElement("script");
    uaScript.type = "text/javascript";
    // uaScript.setAttribute("id", config.script.id);
    uaScript.src = chrome.runtime.getURL("content_scripts/inject.js");
    document.documentElement.appendChild(uaScript);
    uaScript.onload = function () { uaScript.remove() };
  }
  function styleInit(){
    var $dom=document.createElement("style");
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
    $dom.innerHTML=styleText
    document.documentElement.appendChild($dom);
  }
  function keyupInit(){
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
  function themeInit(){
    var $dom=document.createElement("style");
    var update= async function(){
      var styleText=`
      .readerPage#readerPage .wr_abs::selection{
        background-color: #bbb;
      }`
      var {bodyTheme}= await chrome.storage.local.get(["bodyTheme"])
      if(bodyTheme==='black'){
        styleText+=`
        html{
          transition: all .5s;
          filter: invert(100%) hue-rotate(180deg);
        }
        img,
        video,
        code {
          transition: all .5s;
          filter: invert(100%) hue-rotate(180deg) contrast(100%);
        }
        `
      }else{
        styleText+=`
        html{
          transition: all 2s;
          filter: none;
        }
        img,
        video,
        code {
          transition: all 2s;
          filter: none;
        }
        `
      }
      $dom.innerHTML=styleText
    }
    update();
    document.documentElement.appendChild($dom);
    return update
  }
  async function textSelectInit(){
    var $dom=document.createElement("style");
    var textSelectStatus=false;
    var {textSelectIsEnable}= await chrome.storage.local.get(["textSelectIsEnable"]);
    textSelectStatus=textSelectIsEnable;
    var update = async function(showAnimation,disableTips){
      // debugger
      var {textSelectIsEnable}= await chrome.storage.local.get(["textSelectIsEnable"])
      textSelectStatus=textSelectIsEnable;
      var styleText=``
      if(textSelectIsEnable){
        styleText+=`
        .readerPage#readerPage{
          user-select: text;
        }
        `
      }
      var animationClearTime=0;
      if(showAnimation===true){
        if(textSelectIsEnable){
          var jumpKind= 10; //Math.floor(Math.random()*10);
          styleText+=`
          @keyframes readerPageTextJump{
            0%{
              transform: translate(0, 0) scale(1);
            }
            50%{
              transform: translate(0, -${disableTips?0:20}%) scale(0.9);
              opacity: 0.7;
            }
            75%{
              transform: translate(0, ${disableTips?0:20}%) scale(1);
              opacity: 0.7;
            }
            100%{
              transform: translate(0, 0) scale(1);
            }
          }
          `
          for(var j=0;j<jumpKind;j++){
            styleText+=`
            .readerPage#readerPage .wr_abs:nth-child(${jumpKind}n+${j}){
              animation: readerPageTextJump 0.3s ${disableTips?0:j/(jumpKind*2)}s;
            }
            `
          }
          animationClearTime=(j/(jumpKind*2)+0.3)*1000
        }else{
          styleText+=`
          @keyframes readerPageTextAlign{
            0%{
              transform: translate(0, 0) scale(1);
            }
            50%{
              transform: translate(0, -50%) scale(0.9);
              opacity: 1;
            }
            75%{
              transform: translate(0, 25%) scale(1);
              opacity: 0.7;
            }
            100%{
              transform: translate(0, 0) scale(1);
            }
          }
          `
          styleText+=`
          .readerPage#readerPage .wr_abs{
            animation: readerPageTextAlign 0.5s;
          }
          `
          animationClearTime=500
        }
      }
      $dom.innerHTML=styleText;
      if(showAnimation===true){
        setTimeout(()=>{
          update(false);
        },animationClearTime)
      }
    }
    update();
    document.documentElement.appendChild($dom);
    
    setTimeout(()=>{
      var $readerPage_InShelf=this.document.getElementById('readerPage_InShelf')
      $readerPage_InShelf && $readerPage_InShelf.addEventListener('click',function(e){
        if(textSelectStatus){
          e.stopPropagation();
          update(true,true);
        }
      });
    },10);
    return update
    
  }

  async function pageInit(){
    uaInit();
    styleInit();
    keyupInit();
    var themeUpdate=themeInit();
    var textSelectUpdate=await textSelectInit();

    // debugger
    chrome.runtime.onMessage.addListener(function (request , sender , sendResponse) {
      // const { action, payload } = request;
      const action = request;
      // debugger
      switch(action){
        case 'themeUpdate':
          themeUpdate();
          break;
        case 'textSelectUpdate':
          textSelectUpdate(true);
          break;
      }
      sendResponse(true)
    });
  }
  if(location.hostname==='weread.qq.com' && ruleIsEnable){
    pageInit();
  }
})();