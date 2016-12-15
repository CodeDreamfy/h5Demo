'use strict';

$(function () {
		uiRange.init();
		var shadowVal = 10;
		var itemW = void 0,
		    $sceneList = void 0;

		$('.led-wrapper').on('touchstart', '.conent-main .ledwrap', function (e) {
				var flag = $(this).data('flag');
				if (!flag) {
						setLedShadow(shadowVal);
						$(this).data('flag', true);
				} else {
						setLedShadow(shadowVal, '#10042e');
						$(this).data('flag', false);
				}
				console.log($(this).data('flag'));
				$('.nav-wrap').toggleClass('active');
				$('.conent-main .sensor-wrapper').toggleClass('hide');
				e.preventDefault();
		});

		$('.led-wrapper').on('touchstart', '.nav-wrap .nav-inner .nav-item', function (e) {
				e.preventDefault();
				if ($(this).index() == 3) return false;
				if ($(this).index() == 2) {
						$('.control .scene-wrap').show();
						$('.control').removeClass('show').addClass('show-scene');
						if (!itemW) {
								itemW = $('.control .scene-compute .scene-item').width();
								$sceneList = $('.control .scene-wrap .scene-list');
						}
				} else {
						$('.control .scene-wrap').hide();
						$('.control .content').removeClass('hide');
				};

				$(this).addClass('active').siblings().removeClass('active');
				$('.control').addClass('show');
		});

		$('.led-wrapper').on('touchstart', '.control .arrow', function (e) {
				e.preventDefault();
				$('.control').toggleClass('show');
		});

		$('.led-wrapper').on('touchstart', '.control .scene-wrap .scene-item', function (e) {
				$(this).addClass('active').siblings().removeClass('active');
				$('.control').removeClass("show-scene");
				e.preventDefault();
		});
		$('.led-wrapper').on('touchstart', '.control .scene-wrap .prev', function (e) {
				var l = $sceneList.position().left;
				console.log(Math.abs(l));
				if (Math.abs(l) <= itemW * 3) {
						var c = l + itemW;
						$sceneList.css('left', c);
						console.log(Math.abs($sceneList.position().left));
						$(this).siblings('.next').show();
				}
				if ($sceneList.position().left >= 0) $(this).hide();
		});
		$('.led-wrapper').on('touchstart', '.control .scene-wrap .next', function (e) {
				var l = $sceneList.position().left;
				if (Math.abs(l) < itemW * 3) {
						var c = l - itemW;
						$sceneList.css('left', c);
						$(this).siblings('.prev').show();
				}
				if (Math.abs($sceneList.position().left) >= itemW * 3) $(this).hide();
		});
});

function setLedShadow(val, color) {
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