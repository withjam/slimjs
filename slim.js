(function() {
  var $doc = document,$win = window;
  
  var $lim = {};
  $lim.core = {};
  
  var debugging = window._slimdebug || 0;
  var debug = function(msg) {
    if (debugging && window.console) {
      console.log(msg);
    }
  };
  
  $lim.dom = {};
          
  /**
   *  Constructs an entire DOM tree based on the data provided.
   *  @param{object|string} elements the dom data in JSON notation
   *  @return documentFragment containing the elements created
   **/
  var construct = function(elements) {
    var frag = $doc.createDocumentFragment();
    if (typeof elements === 'string') {
      var div = $doc.createElement('DIV');
      div.innerHTML = elements;
      var child = div.firstElementChild;
      while (child) {
        frag.appendChild(child);
        child = div.firstElementChild;
      }
      delete div;
    } else {
      for (var tagname in elements) {
        var data = elements.hasOwnProperty(tagname) && elements[tagname];
        if (data) {
          var ele = createElement(tagname,data);
          if (data.hasOwnProperty('children')) {
            ele.appendChild(construct(data.children).cloneNode(true));
          }
          frag.appendChild(ele);
        }
      }
    }
    return frag;
  };
  
  var createElement = function(tagname,opts) {
    var ele = $doc.createElement(tagname);
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        switch(key) {
          case 'html':
            ele.innerHTML = opts[key];
            break;
          case 'children':
            break;
          default:
            ele.setAttribute(key,opts[key]);
        }
      }
    }
    return ele
  };
  
  $lim.event = {};
  
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
  $lim.util = {
  };
  $lim.event = {
    bind: bind,
    delegate: delegate
  };
  $lim.dom = {
    createElement: createElement,
    construct: construct
  };
  
  window.$lim = $lim;
})();