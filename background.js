  
// async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }
async function activeTabReload(){
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  tab && (new URL(tab.url).hostname==='weread.qq.com') && chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : function(){
      location.reload()
    },
  });
}
async function activeTabDiscard(){
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  tab && (new URL(tab.url).hostname==='weread.qq.com') && chrome.tabs.remove(tab.id);
}


chrome.runtime.onMessage.addListener((request , sender , sendResponse) => {
  const { action, payload } = request;
  // console.log(action, payload,"background got!");
  // debugger
  
  switch(action){
    case 'declarativeNetRequestUpdateRules':
      var addRules=payload
      chrome.declarativeNetRequest.updateDynamicRules(addRules, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
         else {
          sendResponse("updateDynamicRulesSuccess")
        }
      })
      break;
    case 'activeTabReload'://刷新当前标签
      console.log('bg activeTabReload')
      activeTabReload();
      break;
    case 'activeTabDiscard'://关闭当前标签
      console.log('bg activeTabDiscard')
      activeTabDiscard();
      break;
  }
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (res) {
    // console.log(JSON.stringify(res))
    console.log(res.request.url)
  })
  // console.log("modifyHeaders")
})