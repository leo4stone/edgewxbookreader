;navigator.__defineGetter__("userAgent", function () {
  console.log("UA set success")
  return 'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+';
});
{
  
//   function autoHideDom(targetId){
//     function removeTools() {
//       var toolBar = window.document.getElementById(targetId)
//       if (toolBar) {
//         toolBar.style.userSelect = "none"
//         toolBar.style.opacity = "0";
//         // toolBar.style.pointerEvents = "none";
//         toolBar.addEventListener('mouseenter',function(){
//           toolBar.style.opacity="1";
//           // toolBar.style.visibility="visible";
//         })
//         toolBar.addEventListener('mouseleave',function(){
//           toolBar.style.opacity="0";
//           // toolBar.style.visibility = "hidden";
//         })
//         return true
//       } else {
//         return false
//       }
//     }
//     var autoTime = 0
//     function autoRemove() {
//       console.log('autoTime:', autoTime,targetId);
//       autoTime++;
//       if (autoTime < 10) {
//         setTimeout(function () {
//           if (removeTools() === false) {
//             autoRemove();
//           }
//         }, 200)
//       } else {
//         console.log('toolBar load error')
//       }

//     }
//     autoRemove();
    
//   }
//   window.addEventListener('load',function () {
//     var $readerToolBar= window.document.getElementById('readerToolBar')
//     var $readerContent= window.document.getElementById('readerContent')
//     if($readerToolBar && $readerContent){
//       var $parent=$readerContent.parentNode
//       $parent.insertBefore($readerContent,$readerToolBar);
//     }
//     autoHideDom('readerToolBar');
//     autoHideDom('shelfToolBar');
//   },false)
}