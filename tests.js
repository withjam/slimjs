var anchors = document.querySelectorAll('li');

JSLitmus.test("Nocache test",function() {
  var alen = anchors.length - 1;
  var handler = function(e) {};
  do {
    $peed.bindnocache(anchors[alen], 'click', handler);
  } while (alen--)
});

JSLitmus.test("Cache test",function() {
  var alen = anchors.length - 1;
  var handler = function(e) {};
  do {
    $peed.bind(anchors[alen], 'click', handler);
  } while (alen--)
});