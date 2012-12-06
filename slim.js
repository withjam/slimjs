(function() {
  var $doc = document,$win = window;
  
  var $lim = {};
  $lim.core = {};
  $lim.dom = {};
  $lim.event = {};
  
  var debugging = 0;
  var debug = function(msg) {
    if (debugging && window.console) {
      console.log(msg);
    }
  };
  
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
  var delegate = function(rootEle,eventName,selectorString,handler) {
    bind(rootEle,eventName,function(e) {
      var matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
      e = e || window.event;
      var target = e.target || e.srcElement || rootEle;
      while (target !== rootEle) {
        debug('delegate: '+target.tagName);
        if (matches.indexOf(target) > -1) {
          e.actor = target;
          handler(e);
          return;
        }
        target = target.parentNode;
      }
    });
  }
  
  $lim.core = {
    debug: debug,
    toggleDebug: function(flag) {
      if (typeof flag !== 'undefined') {
        debugging = flag;
      } else {
        debugging = !debugging;
      }
      return debugging;
    }
  };
  $lim.event = {
    bind: bind,
    delegate: delegate
  };
  $lim.dom = {
    createElement: createElement
  };
  
  window.$lim = $lim;
})();