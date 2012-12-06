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
  
  // cache the result so we don't have to inspect every single time
  var binder = (function() {
    return Element.prototype.addEventListener || Element.prototype.attachEvent;
  })();
  
  /**
   *  Bind an event to an element
   *  @param{Element} ele the Element to be bound to an event
   *  @param{String} eventName the name of the event to bind
   *  @param{function} handler the event handler function
   **/
  var bind = function(ele,eventName,handler) {
    binder.call(ele,eventName,handler);
  };
  
  var bindNoCache = function(ele,eventName,handler) {
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
  var delegate = function(eventName,selectorString,callback) {
  }
  
  var core = {
    init: function() {
      var frag = $doc.createDocumentFragment();
      var div = createElement('div',{id:'outer'});
      var a = createElement('a',{'className':'myclass',html:'Test'})
      var p = createElement('p',{'id':'p'});
      p.appendChild(a);
      div.appendChild(p);
      frag.appendChild(div);
      $doc.body.appendChild(frag);
      $outer = $doc.getElementById('outer');
      bind($outer,'click',function(e) {
        e = e || $win.event;
        var target = e.target || e.srcElement;
        
        console.log(target.tagName);
      });;
    },
    bind: bind,
    bindnocache: bindNoCache
  };
  
  window.$peed = core;
})();