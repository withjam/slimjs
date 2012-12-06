(function() {
  var $doc = document,$win = window;
  
  var $lim = {};
  $lim.core = {};
  $lim.dom = {};
  $lim.event = {};
  
  var debugging = 1;
  
  debug = function(msg) {
    if (debugging && window.console && console.log) {
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
  
  var docHandlers = {};
  /**
   *  Uber event delegation by binding ALL event handlers to the document itself.  Even single-element events will
   *  instead bind to the document and delegation will invoke them.  All handler functions will receive the original
   *  event object with an added property, actor, that holds the matching event element.
   **/
  var handleDocEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement || $doc;
    var handlers = docHandlers[e.type];
    if (handlers) {
      var i = handlers.length-1;
      var match,matches,handler,selectorString = null,rootEle = null;
      do {
        debug('getting handler '+i);
        handler = handlers[i];
        rootEle = handler.rootEle;
        selectorString = handler.selectorString;
        if (selectorString) {
          console.log('using selector string: '+selectorString);
          matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
        }
        // work our way up the DOM until we reach the root element, if there is a selector stop if it matches the selector
        while (!match && target !== rootEle && target !== $doc) {
            if (matches) {
              debug('delegate: '+target.tagName);
              if (matches.indexOf(target) > -1) {
                match = target;
              }
           }
          debug('checking target parent');
          target = target.parentNode;        
        }
        debug('docEvent match: '+match);
        if (match || target === rootEle) {
          e.actor = match || target;
          handler(e);
          break;
        }
        --i;
      } while (i >= 0)
    }
  };
  // Bind ALL event handlers to the document, use event delegation from the document to minimize bound handlers
  var docBind = function(rootEle,eventType,handler,selectorString) {
    debug('binding '+eventType+' to document with selectorString: '+selectorString);
    if (!docHandlers.hasOwnProperty(eventType)) {
      addEvent($doc,eventType,handleDocEvent);
      docHandlers[eventType] = [];
    }
    handler.selectorString = selectorString;
    handler.rootEle = rootEle;
    docHandlers[eventType].push(handler);
  };
  
  var addEvent = function(ele,eventType,handler) {
    if (ele.addEventListener) {
      ele.addEventListener(eventType,handler,false);
    } else {
      ele.attachEvent(eventType,handler);
    }
  };
  
  var bind = function(ele,eventType,handler) {
    docBind(ele,eventType,handler);
  };
  
  /**
   *  Event delegation using the Element as the root and matches any
   *  children
   **/
  var delegate = function(rootEle,eventType,selectorString,callback) {
    docBind(rootEle,eventType,callback,selectorString);
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