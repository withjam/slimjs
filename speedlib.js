(function() {
  var $outer,$doc = document,$win = window;
  
  var createElement = function(tagname,opts) {
    var ele = $doc.createElement(tagname);
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        switch(key) {
          case 'html':
            ele.innerHTML = opts[key];
            break;
          default:
            ele.setAttribute(key,opts[key]);
        }
      }
    }
    return ele
  };
  
  var bind = function(ele,eventName,handler) {
    if (ele.addEventListener) {
      ele.addEventListener(eventName,handler,false);
    } else {
      ele.attachEvent(eventName,handler);
    }
  };
  
  /**
   *  Event delegation using the Element as the root and matches any
   *  children
   **/
  var delegate = function(rootEle,eventName,selectorString,callback) {
    console.log(rootEle);
    bind(rootEle,eventName,function(e) {
      //var matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
      e = e || window.event;
      var target = e.target || e.srcElement;
    });
  }
  
  var core = {
    init: function() {
      $outer = document.getElementById('outer');
      delegate($outer,'click','.item',function(target) {
        console.log(target.className);
      });;
    },
    bind: bind,
    delegate: delegate
  };
  
  window.$peed = core;
})();