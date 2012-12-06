var del = document.getElementById('delegate');
$lim.event.delegate(del,'click','.item',function() {});
var cli = document.getElementById('single');
$lim.event.bind(cli,'click',function() {});

JSLitmus.test("Delegate bind",function() {
  eventFire(document.querySelector('#delegate .item a'),'click');
});

JSLitmus.test("Single bind",function() {
  eventFire(document.querySelector('#single a'),'click');
});