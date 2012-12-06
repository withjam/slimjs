(function() {
  var $doc = document,$win = window;
  
  var $lim = {};
  $lim.core = {};
  $lim.dom = {};
  $lim.event = {};
  
  var debugging = 0;
  
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
  var handleDocEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement || $doc;
    var handlers = docHandlers[e.type];
    if (handlers) {
      var i = 0;
      var len = handlers.length;
      var handler = handlers[i];
      var selectorString = null,rootEle = null;
      while (handler) {
        rootEle = handler.rootEle;
        if (handler.hasOwnProperty('selectorString') ) {
          selectorString = handler.selectorString;
          debug('handleDocEvent, selectorString: '+selectorString);
          var matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
          e = e || window.event;
          var target = e.target || e.srcElement || rootEle;
          while (target !== rootEle) {
            debug('delegate: '+target.tagName);
            if (matches.indexOf(target) > -1) {
              e.actor = target;
              debug('set actor: '+target.tagName);
              handler(e);
              break;
            }
            debug('checking target parent');
            target = target.parentNode;
          }
        } else if (handler.rootEle && handler.rootEle === target) {
          e.target = target;
          handler(e);
          return;
        }
        handler = handlers[++i];
      }
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
    // TODO: use this to bind to the document
    //addEvent(ele,eventName,handler);
    docBind(ele,eventType,handler);
  };
  
  /**
   *  Event delegation using the Element as the root and matches any
   *  children
   **/
  var delegate = function(rootEle,eventType,selectorString,callback) {
    /*bind(rootEle,eventType,function(e) {
      var matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
      e = e || window.event;
      var target = e.target || e.srcElement || rootEle;
      while (target !== rootEle) {
        debug('delegate: '+target.tagName);
        if (matches.indexOf(target) > -1) {
          callback(target,event);
          return;
        }
        target = target.parentNode;
      }
    });*/
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