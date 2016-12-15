'use strict';

var ColorPicker = function ColorPicker(elem, option) {
  this.author = 'CodeDreamfy';
  this.version = '0.0.1';
  this.$wrap = $(elem);
  this.defaultOption = {
    elem: '.canvas-place',
    innerBtnBg: '#fff',
    canvasid: 'colorpicker'
  };
  this.options = $.extend({}, this.defaultOption, option || {});

  //init
  this._init();
};

$.extend(ColorPicker.prototype, {
  _init: function _init() {
    this.canvasElem = $('<canvas>').get(0);
    this.canvasElem.id = this.options.canvasid;
    this.context = this.canvasElem.getContext('2d');
    this.canvas = {
      WIDTH: this.$wrap.find('.canvas-place').width(),
      HEIGHT: this.$wrap.find('.canvas-place').height()
    };
    this.canvas.RadiusX = this.canvas.WIDTH / 2;
    this.canvas.RadiusY = this.canvas.HEIGHT / 2;
    this.canvas.MaxRadius = this.canvas.RadiusX;
    this.canvas.MinRadius = this.$wrap.find('.canvas-place .btn').width() / 2;
    this.canvasElem.width = this.canvas.WIDTH;
    this.canvasElem.height = this.canvas.HEIGHT;
    this._render();
    this.colorRound();
    this.mousePick();
    this.getRgba(this.canvas.MaxRadius, this.canvas.MaxRadius - this.canvas.MinRadius - 20);
    this.$wrap.find(this.options.elem).append(this.canvasElem);
    this.canvas.offset = this.$wrap.find(this.options.elem).offset();
    this._bindEvent();
  },
  _render: function _render() {
    this.colorRound = function () {
      this.context.save();
      var alpha = 0,
          i = 0.02,
          rad = i * Math.PI / 180;
      this.context.translate(this.canvas.RadiusX, this.canvas.RadiusY);
      for (; alpha < 360; alpha += i) {
        this.context.strokeStyle = 'hsla(' + alpha + ', 100%, 50%, 1.0)';
        this.context.rotate(rad);
        this.context.beginPath();
        this.context.moveTo(this.canvas.MinRadius, 0);
        this.context.lineTo(this.canvas.MaxRadius, 0);
        this.context.stroke();
      }
      /*
      let cx = this.canvas.RadiusX,
          cy = this.canvas.RadiusY,
          ox = cx,
          oy = cy;
      for(let i=0; i<360; i+=0.1){
      	let rad = i*(Math.PI/180);
        this.context.strokeStyle = "hsla("+i+", 100%, 50%, 1)";
        this.context.beginPath();
        this.context.moveTo(cx,cy);
        this.context.lineTo(cx+ox*Math.cos(rad),cy+oy*Math.sin(rad))
        this.context.stroke()
      }
      */
      this.context.restore();
      this.context.fillStyle = this.options.innerBtnBg;
      this.context.beginPath();
      this.context.arc(this.canvas.RadiusX, this.canvas.RadiusY, this.canvas.MinRadius, 0, 2 * Math.PI);
      this.context.fill();
      this.cpRound = this.context.getImageData(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
      this.context.save();
      // this.context.resetTransform();
    };
    this.mousePick = function (x, y) {
      this.context.beginPath();
      this.context.strokeStyle = 'rgba(255,255,255,.7)';
      this.context.lineWidth = 6;
      this.context.lineJoin = 'round';
      this.mouseRound = (this.canvas.MaxRadius - this.canvas.MinRadius) / 2;
      var mx = !!x ? x : this.canvas.MaxRadius;
      var my = !!y ? y : this.mouseRound;
      this.context.arc(mx, my, this.mouseRound, 0, 2 * Math.PI);
      this.context.stroke();
    };
    this.initDraw = function (x, y) {
      this.context.clearRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
      this.context.putImageData(this.cpRound, 0, 0);
      this.mousePick(x, y);
    };
  },
  _bindEvent: function _bindEvent() {
    var that = this,
        x = void 0,
        y = void 0;
    // console.log(that.canvas.offset)
    this.canvasElem.addEventListener('touchstart', function (event) {
      var o = that.outBorder(x, y);
      if (o.code) {
        that.initDraw(x, y);
        that.getRgba(x, y);
        that.options.bgChange();
      }
      return false;
    });
    this.canvasElem.addEventListener('touchmove', function (event) {
      x = event.touches[0].clientX - that.canvas.offset.left;
      y = event.touches[0].clientY - that.canvas.offset.top;
      var o = that.outBorder(x, y);
      if (o.code) {
        that.initDraw(x, y);
        that.getRgba(x, y);
        that.options.bgChange();
      }
      return false;
    });
    this.canvasElem.addEventListener('touchend', function (event) {
      x = event.changedTouches[0].clientX - that.canvas.offset.left;
      y = event.changedTouches[0].clientY - that.canvas.offset.top;
      var o = that.outBorder(x, y);
      if (o.code) {
        that.initDraw(x, y);
        that.getRgba(x, y);
        that.options.bgChange();
      }
      return false;
    });
  },
  outBorder: function outBorder(x, y) {
    var o = { code: true },
        rx = this.canvas.RadiusX,
        ry = this.canvas.RadiusY,
        minR = this.canvas.MinRadius,
        maxR = this.canvas.MaxRadius;
    var d = Math.sqrt(Math.pow(x - rx, 2) + Math.pow(y - ry, 2));
    if (d >= minR && d <= maxR) {
      o.code = true;
    } else {
      o.code = false;
    }
    return o;
  },
  getRgba: function getRgba(x, y) {
    var rgb = this.context.getImageData(x, y, 1, 1);
    var data = rgb.data;
    this.$wrap.data('rgb', data[0] + ',' + data[1] + ',' + data[2]);
    var hsl = this.getHsl(data[0], data[1], data[2]);
    this.$wrap.data('hsl', (hsl * 360).toFixed(2));
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
});

$.fn.ColorPicker = function (option) {
  return new ColorPicker(this, option);
};