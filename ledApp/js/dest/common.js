'use strict';

var colorRange = function colorRange(elem) {
  this.$elem = $(elem);
  this._init();
  return this;
};
$.extend(colorRange.prototype, {
  _init: function _init() {
    this.$elem.data('val', 0);
    this._bindEvent();
    return this;
  },
  _bindEvent: function _bindEvent() {
    //console.log(this.$elem);
    this.rangeW = this.$elem.find('.range').width();
    var rangeRadiusW = this.$elem.find('.range i').width();
    this.w = this.rangeW - rangeRadiusW;
    var offset = this.$elem.find('.range').position(),
        x = void 0;
    var _this = this,
        clearTime = void 0;
    //console.log(offset);
    this.$elem.on('touchstart', '.range i', function (e) {
      x = e.targetTouches[0].clientX - offset.left;
      if (x >= 0 && x <= _this.w) {
        $(this).css({
          left: x
        });
        $(this).find('em').show(100).text(_this._getVal(x));
      } else {
        return false;
      }
    });
    this.$elem.on('touchmove', '.range i', function (e) {
      x = e.targetTouches[0].clientX - offset.left;
      if (x >= 0 && x <= _this.w) {
        $(this).css({
          left: x
        });
        $(this).find('em').text(_this._getVal(x));
      } else {
        return false;
      }
    });
    this.$elem.on('touchend', '.range i', function (e) {
      var _this2 = this;

      x = e.changedTouches[0].clientX - offset.left;
      if (x >= 0 && x <= _this.w) {
        (function () {
          $(_this2).css({
            left: x
          });
          $(_this2).find('em').text(_this._getVal(x));
          var that = $(_this2);
          if (clearTime) {
            clearTimeout(clearTime);
          }
          clearTime = setTimeout(function () {
            that.find('em').hide();
          }, 1800);
        })();
      } else {
        return false;
      }
    });
    this.$elem.on('touchstart', function (e) {
      var _this3 = this;

      x = e.targetTouches[0].clientX - offset.left;
      if (x >= 0 && x <= _this.rangeW) {
        (function () {
          if (x >= _this.w) {
            x = _this.w;
          }
          $(_this3).find('.range i').css({
            left: x
          });
          var that = $(_this3);
          $(_this3).find('.range i em').text(_this._getVal(x));
          $(_this3).find('.range i em').show(100);

          clearTime = setTimeout(function () {
            that.find('.range i em').hide();
          }, 1800);
        })();
      } else {
        return false;
      }
    });
  },
  _getVal: function _getVal(x) {
    var val = Math.ceil(x / this.w * 100);
    this.$elem.data('val', val);
    return val;
  },
  setVal: function setVal(x) {
    var lf = this.rangeW * x / 100;
    this.$elem.find('.range i').css({ left: lf });
    this.$elem.data('val', x);
  }
});
$.fn.colorRange = function () {
  return new colorRange(this);
};
var labelCheck = {
  _init: function _init(e, flag) {
    this.elem = $(e);
    !!flag ? this.setOn() : this.setOff();
    this._bindEvent();
    return this;
  },
  _bindEvent: function _bindEvent() {
    var that = this;
    this.elem.on('touchstart', function () {
      if (!$(this).hasClass('checked')) {
        that.setOn();
      } else {
        that.setOff();
      }
    });
  },
  setOn: function setOn() {
    this.elem.addClass('checked').find('.val').text('ON');
    this.elem.data('flag', true);
  },
  setOff: function setOff() {
    this.elem.removeClass('checked').find('.val').text('OFF');
    this.elem.data('flag', false);
  }
};