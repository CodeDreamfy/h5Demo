'use strict';

$(function () {
  uiRange.init();
  var shadowVal = 10;

  $('.led-wrapper').on('touchstart', '.conent-main .ledwrap', function (e) {
    e.preventDefault();
    setLedShadow(shadowVal);
    $('.nav-wrap').toggleClass('active');
    $('.conent-main .sensor-wrapper').toggleClass('hide');
  });

  $('.led-wrapper').on('touchstart', '.nav-wrap .nav-inner .nav-item', function (e) {
    e.preventDefault();
    if ($(this).index() == 3) return false;
    $(this).addClass('active').siblings().removeClass('active');
    $('.control').addClass('show');
  });

  $('.led-wrapper').on('touchstart', '.control .arrow', function (e) {
    e.preventDefault();
    $('.control').toggleClass('show');
  });
});

function setLedShadow(val, color) {
  console.log("sasa");
  var $round = $('.conent-main .ledwrap');
  var defaultColor = !!color ? color : '#fff';
  var opacity = val / 100;
  $round.find('.r1').css({
    'box-shadow': '0 0 ' + val * 0.55 + 'px 0 ' + defaultColor,
    'background': defaultColor
  });
  $('.r2,.r3', $round).css({
    'box-shadow': '0 0 ' + val * 0.6 + 'px 0 ' + defaultColor,
    'background': defaultColor
  });
}

var uiRange = {
  init: function init() {
    $('.ui-range').forEach(function (elem, index) {
      var $input = $(elem).find('input[type=range]');
      var min = $input.attr('min');
      var max = $input.attr('max');
      var now = $input.val();
      var val = (now - min) / (max - min) * 100;
      $(elem).find('.progress').css({
        width: val + '%'
      });
      $input.on('input change', function () {
        var n = $(this).val();
        $(this).siblings('.progress').css({
          width: n + '%'
        });
        setLedShadow(n);
      });
    });
  }
};