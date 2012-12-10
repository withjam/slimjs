goog.provide('$lim');

  /** @type {Document} **/
  var $doc = document;
  /** @type {Window} **/
  var $win = window;
  
goog.provide('$lim.core');
  
  /** @type {boolean} **/
  var debugging = $win['_slimdebug'] || 0;
  
  /**
    * Logs a message to the console if console and debugging is enabled.  Note that console logging hinders performance.
    * @param {string} msg the message to log
  **/
  var debug = function(msg) {
    if (debugging && window['console']) {
      window['console'].log(msg);
    }
  };
  
goog.exportSymbol('$lim.core.debug',debug);

  /**
    * Switches or sets the debugging flag.
    * @param {boolean=} flag to specifically set the debugging flag, otherwise it will toggle the value
    * @return {boolean} the value of the debugging flag after toggling
  **/
goog.exportSymbol('$lim.core.toggleDebug', function(flag) {
      if (typeof flag !== 'undefined') {
        debugging = flag;
      } else {
        debugging = !debugging;
      }
      return debugging;
    });
  
goog.provide('$lim.util');
  
  /**
    * Trim function idea inspired by High Powered JavaScript.  Used based on tests from http://jsperf.com/mega-trim-test/22
    * @param {string} str the string to trim
    * @return {string} the trimmed version of the string
  **/
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

goog.exportSymbol('$lim.util.trim', (!String.prototype.trim || "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF".trim() || navigator.userAgent.toString().toLowerCase().indexOf("chrome") != -1) ?
    $lim.util.trim = _trim : function(str) { return str.trim(); }); // use native trim when available except on chrome - Consider replacing String.prototype.trim since the wrapper function is slightly slower than using the prototype function (I currently hesitate to modify the prototype of a base object)

  
goog.provide('$lim.dom');
          
  /**
   *  Constructs an entire DOM tree based on the data provided.
   *  @param{Object|string} elements the dom data in JSON notation
   *  @return {DocumentFragment} documentFragment containing the elements created
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
    } else if (Object['toString'].call(elements) === '[object Array]') {
      var len = elements.length
      for (var i=0;i < len;i++) {
        var ele = elements[i];
        frag.appendChild(construct(ele));
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
  
  /**
   *  Creates a single HTML element based on the tagname and optional options.
   *  @param {string} tagname the name of the HTML tag to create
   *  @param {Object=} opts hash of additional properties to set on the element, special handling for 'children' as a property
   *  @return {Element} the HTML element that was created
   **/
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
  
goog.exportSymbol('$lim.dom.createElement',createElement);
goog.exportSymbol('$lim.dom.construct',construct);
  
goog.provide('$lim.event');
  
  /**
   *  Binds an event to a given element
   *  @param {Element} ele an HTML element to which an event will be bound
   *  @param {string} eventName the name of the event to bind
   *  @param {Function} handler the handler that should be called when the event fires
   **/
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
   *  @param {Element} rootEle the root element that should be using event delegation
   *  @param {string} eventName the name of the event to delegate
   *  @param {string} selectorString the CSS selector string used to match delegated elements that receive an event
   *  @param {Function} handler the handler function that will be invoked on a matching delegate event.  The Event object passed to the handler will contain an 'actor' proprety that is the matched element
   **/
  var delegate = function(rootEle,eventName,selectorString,handler) {
    bind(rootEle,eventName,function(e) {
      var matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
      e = e || window.event;
      var target = e.target || e.srcElement || rootEle;
      while (target !== rootEle) {
        debug('delegate: '+target.tagName);
        if (matches.indexOf(target) > -1) {
          e['actor'] = target;
          handler(e);
          return;
        }
        target = target.parentNode;
      }
    });
  }
  
goog.exportSymbol('$lim.event.bind',bind);
goog.exportSymbol('$lim.event.delegate',delegate);