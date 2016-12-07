//checkbox
var checkboxFun = function(elem, opts){
  //默认参数
  var defaults = {
    valElemL: '.place-val',
    turnStatus: false,
    onSuccess: null,
    onError: null,
    onInit: null,
    setVal: null,
    style: '',
    minVal: 1,
    maxVal: 100,
    nowVal: 0
  }
  this.option = $.extend({}, defaults, opts || {});
  this.$elem = $(elem);
  console.log(this.option)
  if(this.option.minVal == 1||this.option.minVal == 0) {
    this.option.minVal = 1;
    if(this.option.nowVal == 0)this.option.nowVal = 1;
  }
  switch(this.option.style){
    case 'red' : this.option.lineColor = '#ff3c00'; this.option.bgColor='#ffd8cc'; break;
    default: this.option.lineColor = '#099bff'; this.option.bgColor='#ceebff';
  }

  this._init();
  return this;
}
//继承事件
$.extend(checkboxFun.prototype, {
  _init : function() {
    this.offset = this.$elem.offset();
    //debugger
    //console.log(this.offset)
    this.offset.centerX = this.offset.width/2;
    this.offset.centerY = this.offset.height/2;
    this.offset.R = (this.offset.width/2)-12;
    this.nowval = this.option.nowVal;
    this.rad = Math.PI*2/360; //360度分成360份，每一份是rad
    this.easing = 0.06; this.speed = 0;
    this.$canvas = $('<canvas width='+ this.offset.width +' height='+ this.offset.height +'/>');
    this.ctx = this.$canvas.get(0).getContext('2d');
    this.ctx.save();
    this.rectangle = new Path2D();
    // this.roundBorder(30)
    this.$elem.append(this.$canvas);
    this._render();
  },
  _render: function(){
    let speed = 0, end = this.option.nowVal, _this = this;
    (function rafsAnimate(){
      let raf = window.requestAnimationFrame(rafsAnimate);
      _this.nowval = speed;
      _this.ctx.clearRect(0,0,_this.offset.width,_this.offset.height)
      _this.roundBorder()
      _this.roundProcess()
      if(speed > end){
        window.cancelAnimationFrame(raf)
      }
      let av = (end-speed)/end + _this.easing;
      speed += av;
    }())
  },
  roundBorder: function () {
    this.ctx.beginPath();
    this.ctx.lineWidth = 15;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.option.bgColor;
    this.ctx.arc(this.offset.centerX,this.offset.centerY,this.offset.R,0,2*Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
  },
  roundProcess: function(){
    this.vm = (this.nowval-this.option.minVal)*360/(this.option.maxVal-this.option.minVal);
    // console.log(this.vm)
    this.ctx.beginPath();
    this.ctx.lineWidth = 16;
    this.ctx.strokeStyle = this.option.lineColor;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.arc(this.offset.centerX, this.offset.centerY, this.offset.R, -Math.PI/2, this.vm*this.rad-Math.PI/2);
    this.ctx.stroke();
    this.ctx.restore();
  },
  setVal: function(){
    let v = !!arguments[0] ? this.nowval = arguments[0] : this.option.nowVal;
    this._render();
  }
})
//注册全局
$.fn.checkboxFun = function(opts){
  var elem = this;
  return new checkboxFun(elem,opts)
}
