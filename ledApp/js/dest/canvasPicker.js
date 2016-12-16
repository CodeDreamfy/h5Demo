'use strict';

var _$$extend;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ColorPicker = function ColorPicker(elem, option) {
  this.author = 'CodeDreamfy';
  this.version = '0.0.1';
  this.$wrap = $(elem);
  this.defaultOption = {
    placeWrap: '.c-place',
    fonts: null
  };
  this.options = $.extend({}, this.defaultOption, option || {});

  //init
  this._init();
  return this;
};
$.extend(ColorPicker.prototype, (_$$extend = {
  _init: function _init() {
    this.canvasElem = $('<canvas>').get(0);
    this.canvasElem.id = 'canvasPick';
    this.context = this.canvasElem.getContext('2d');
    this.canvas = {
      WIDTH: this.$wrap.width(),
      HEIGHT: this.$wrap.height()
    };
    this.canvas.RadiusX = this.canvas.WIDTH / 2;
    this.canvas.RadiusY = this.canvas.HEIGHT / 2;
    this.canvas.MaxRadius = this.canvas.RadiusX;
    this.canvas.MinRadius = this.$wrap.find(this.options.placeWrap).width() / 2;
    /**设置canvas元素宽高 */
    this.canvasElem.width = this.canvas.WIDTH;
    this.canvasElem.height = this.canvas.HEIGHT;
    /**小圆 */
    this.canvas.mouseR = (this.canvas.MaxRadius - this.canvas.MinRadius) / 2;
    this.canvas.mouseC = (this.canvas.MaxRadius + this.canvas.MinRadius) / 2;
    this.canvas.mouseLx = this.canvas.MaxRadius;

    this._render();
    this.$wrap.data('color', this.turnHsl());
    this.$wrap.data('colorHsl', this.nowColor);
    this._bindEvent();
    // this.getRgba(this.canvas.MaxRadius,this.canvas.MaxRadius-this.canvas.MinRadius-20);
    this.$wrap.append(this.canvasElem);
    this.canvas.offset = this.$wrap.offset();
  },
  _render: function _render() {
    this._roundbg();
    this._mousePick();
  },
  _roundbg: function _roundbg() {
    this.context.save();
    var alpha = 0,
        i = 0.2,
        rad = i * Math.PI / 180,
        k = 0;
    this.context.translate(this.canvas.RadiusX, this.canvas.RadiusY);
    for (; alpha < 720; alpha += i) {
      k += 1;
      if (k <= 14) {
        this.context.strokeStyle = 'hsla(' + alpha + ', 100%, 50%, 0)';
      } else {
        this.context.strokeStyle = 'hsla(' + alpha + ', 100%, 50%, 1.0)';
        if (k == 120) k = 0;
      }
      this.context.rotate(rad);
      this.context.beginPath();
      this.context.moveTo(this.canvas.MinRadius + 6, 0);
      this.context.lineTo(this.canvas.MaxRadius - 6, 0);
      this.context.stroke();
    }
    this.cpRound = this.context.getImageData(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
    this.context.restore();
    this.context.translate(this.canvas.RadiusX, this.canvas.RadiusY);
  },
  _mousePick: function _mousePick(x, y) {
    this.context.save();
    var color = void 0,
        k = void 0,
        beta = void 0,
        seta = void 0;
    if (arguments.length == 0) {
      seta = 0;
    } else {
      beta = Math.atan2(y - this.canvas.RadiusY, x - this.canvas.RadiusX);
      this.context.rotate(beta);
      this.context.beginPath();
      beta < 0 && (beta += 2 * Math.PI);
      seta = beta * 360 / (2 * Math.PI);
    }
    this.context.fillStyle = this.context.strokeStyle = 'hsla(' + seta + ', 100%, 50%, 1.0)';
    this.nowColor = this.context.strokeStyle = 'hsla(' + seta + ', 100%, 50%, 1.0)';
    this.context.strokeStyle = "#fff";
    this.context.lineWidth = 2;
    this.context.lineJoin = 'round';
    this.context.arc(this.canvas.mouseC, 0, this.canvas.mouseR - 1, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.fill();
    this.context.restore();
  },
  _redrew: function _redrew(x, y) {
    this.context.clearRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
    this.context.putImageData(this.cpRound, 0, 0);
    this.context.save();
    this._mousePick(x, y);
    this.context.restore();
  },
  _bindEvent: function _bindEvent() {
    var that = this,
        x = void 0,
        y = void 0;
    // console.log(that.canvas.offset)
    this.canvasElem.addEventListener('touchstart', function (event) {
      event.stopPropagation();
      x = event.touches[0].clientX - that.canvas.offset.left;
      y = event.touches[0].clientY - that.canvas.offset.top;
      that._redrew(x, y);
      // return false;
    });
    this.canvasElem.addEventListener('touchmove', function (event) {
      event.stopPropagation();
      x = event.touches[0].clientX - that.canvas.offset.left;
      y = event.touches[0].clientY - that.canvas.offset.top;
      that._redrew(x, y);
      // return false;
    });
    this.canvasElem.addEventListener('touchend', function (event) {
      x = event.changedTouches[0].clientX - that.canvas.offset.left;
      y = event.changedTouches[0].clientY - that.canvas.offset.top;
      that._redrew(x, y);
      that.$wrap.data('color', that.turnHsl());
      that.$wrap.data('colorHsl', that.nowColor);

      setLight($('.mingdu').val(), that.nowColor, '#fff');
      send({
        'saturation': { float: parseInt($('.baohe').val()) },
        'brightness': { float: parseInt($('.mingdu').val()) },
        'hues': { float: parseInt(that.turnHsl()) }
      });
      // console.log('colorP',that.turnHsl())
      event.stopPropagation();
      // return false;
    });
  },
  getRgba: function getRgba(x, y) {
    var rgb = this.context.getImageData(x, y, 1, 1);
    var data = rgb.data;
    return 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',1)';
  },
  getHsl: function getHsl(r, g, b) {
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h = void 0;
    if (max == min) {
      h = 0; // achromatic
    } else {
      var d = max - min;
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);break;
        case g:
          h = (b - r) / d + 2;break;
        case b:
          h = (r - g) / d + 4;break;
      }
      h /= 6;
    }

    return h;
  }
}, _defineProperty(_$$extend, 'getRgba', function getRgba() {
  var r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}), _defineProperty(_$$extend, 'turnHsl', function turnHsl() {
  var m = this.nowColor;
  m = m.slice(5).split(',')[0];
  return (+m).toFixed(2);
}), _$$extend));

$.fn.ColorPicker = function (option) {
  return new ColorPicker(this, option);
};