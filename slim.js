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
  
  $lim.util = {};
  
  // custom trim function that will be used if a faster native trim is not available
  var _trim = function(str) {
      var c;
      for (var i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c < 8192) {
          if (c < 256 && (c == 32 || (c >= 9 && c <= 13) || c == 160)) continue;
          else if (c == 5760 || c == 6158) continue;
          break;
        } else if (c <= 8202 || c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288) continue;
        break;
      }
      for (var j = str.length - 1; j >= i; j--) {
        c = str.charCodeAt(j);
        if (c < 8192) {
          if (c < 256 && (c == 32 || (c >= 9 && c <= 13) || c == 160)) continue;
          else if (c == 5760 || c == 6158) continue;
          break;
        } else if (c <= 8202 || c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288) continue;
        break;
      }
      return str.substring(i, j + 1);
      };
  /**
    * Trim function idea inspired by High Powered JavaScript.  Used based on tests from http://jsperf.com/mega-trim-test/22
    * @param {string} str the string to trim
    * @return {string} the trimmed version of the string
  **/
  if (!String.prototype.trim || "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF".trim() || navigator.userAgent.toString().toLowerCase().indexOf("chrome") != -1) {
    $lim.util.trim = _trim;
  } else {
    $lim.util.trim = function(str) { return str.trim(); };
  }; // use native trim when available except on chrome - Consider replacing String.prototype.trim since the wrapper function is slightly slower than using the prototype function (I currently hesitate to modify the prototype of a base object)

  
  $lim.dom = {};
          
  /**
   *  Constructs an entire DOM tree based on the data provided.
   *  @param{object|string} elements the dom data in JSON notation
   *  @return documentFragment containing the elements created
   **/
  var construct = function(elements) {
    var frag = $doc.createDocumentFragment();
    var eleType = toString.call(elements);
    if (typeof elements === 'string') {
      var div = $doc.createElement('DIV');
      div.innerHTML = elements;
      var child = div.firstElementChild;
      while (child) {
        frag.appendChild(child);
        child = div.firstElementChild;
      }
      delete div;
    } else if (toString.call(elements) === '[object Array]') {
      var ele = elements.shift();
      while (ele) {
        frag.appendChild(construct(ele));
        ele = elements.shift();
      }
    } else {
      for (var tagname in elements) {
        var data = elements.hasOwnProperty(tagname) && elements[tagname];
        if (data) {
          var ele = createElement(tagname,data);
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
            ele.appendChild(construct(opts[key]));
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