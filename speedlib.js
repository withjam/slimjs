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
    bind(rootEle,eventName,function(e) {
      var matches = Array.prototype.slice.call(rootEle.querySelectorAll(selectorString));
      e = e || window.event;
      var target = e.target || e.srcElement;
      do {
        if (matches.indexOf(target)) {
          console.log('true');
          callback(target);
        } else {
          console.log('false');
        }
        target = target.parentNode;
      } while (target !== rootEle)
    });
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
      delegate($outer,'click','a',function(target) {
        console.log(target.tagName);
      });;
    },
    bind: bind,
    delegate: delegate
  };
  
  window.$peed = core;
})();