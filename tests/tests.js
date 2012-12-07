var clicked = function(e) {
  e = e || window.event;
  var t = e.actor || e.target || e.srcElement;
  t.firstElementChild.firstElementChild.innerHTML = 'Clicked Upon';
}

var del = document.getElementById('delegate');
$lim.event.delegate(del,'click','.item',clicked);
var cli = document.querySelector('#single');
$lim.event.bind(cli,'click',clicked);

JSLitmus.test("Delegate bind",function() {
  eventFire(document.querySelector('#delegate .item a span'),'click');
});

JSLitmus.test("Single bind",function() {
  eventFire(document.querySelector('#single'),'click');
});