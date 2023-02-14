var $btnEnable=document.getElementById('btn_enable'),$btnDisable=document.getElementById('btn_disable');
function ruleStatusCheck(reloadTab){
  chrome.declarativeNetRequest.getDynamicRules(rules => {
    var ruleIds=rules.map((v)=>{
      return v.id
    });
    if(ruleIds.indexOf(1)>=0){
      // $btnEnable.style.display="none"
      // $btnDisable.style.display="inline"
      $btnEnable.className="active"
      $btnDisable.className=""
      // consoleStatus.innerHTML="📖"
    }else{
      // $btnEnable.style.display="inline"
      // $btnDisable.style.display="none"
      // consoleStatus.innerHTML="📱"
      $btnEnable.className=""
      $btnDisable.className="active"
    }
    console.log("getDynamicRules", rules)
    reloadTab && chrome.runtime.sendMessage({action:'activeTabReload'})
  });
}
ruleStatusCheck()
$btnEnable.onclick = function () {
  chrome.runtime.sendMessage({
    action: 'declarativeNetRequestUpdateRules',
    payload: {
      "removeRuleIds": [1],
      "addRules": [{
        "id": 1,
        "priority": 9999999,
        "action": {
          "type": "modifyHeaders",
          "requestHeaders": [
            {
              "operation": "set",
              "header": "user-agent",
              "value": 'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+',
              // "value": '123123',
            }
          ]
        },
        "condition": {
          //默认生效组
          //"urlFilter": '*',
          //添加domain组
          "urlFilter": '*',
          // "domains":["*"],//无效
          "domains":["weread.qq.com"],
          "resourceTypes": [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "object",
            "xmlhttprequest",
            "ping",
            "csp_report",
            "media",
            "websocket",
            "webtransport",
            "webbundle",
            "other"
          ]
        }
      }]
    }
  }).then((res)=>{
    ruleStatusCheck(true)
  })
}
$btnDisable.onclick = function () {
  chrome.runtime.sendMessage({
    action: 'declarativeNetRequestUpdateRules',
    payload: {
      "removeRuleIds": [1],
    }
  }).then((res)=>{
    ruleStatusCheck(true)
  })
}