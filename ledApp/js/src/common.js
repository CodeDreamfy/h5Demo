var colorRange = function(elem){
  this.$elem = $(elem);
  this._init();
  return this;
}
$.extend(colorRange.prototype, {
  _init: function(){
    this.$elem.data('val', 0);
    this._bindEvent();
    return this;
  },
  _bindEvent: function(){
    //console.log(this.$elem);
    this.rangeW = this.$elem.find('.range').width();
    let rangeRadiusW = this.$elem.find('.range i').width();
    this.w = this.rangeW - rangeRadiusW;
    let offset = this.$elem.find('.range').position(),x;
    let _this = this,
        clearTime;
    //console.log(offset);
    this.$elem.on('touchstart', '.range i', function(e){
      x = e.targetTouches[0].clientX - offset.left;
      if(x >= 0 && x<= _this.w){
        $(this).css({
          left: x,
        });
        $(this).find('em').show(100).text(_this._getVal(x))
      }else{
        return false;
      }
    })
    this.$elem.on('touchmove', '.range i', function(e){
      x = e.targetTouches[0].clientX - offset.left;
      if(x >= 0 && x<= _this.w){
        $(this).css({
          left: x,
        })
        $(this).find('em').text(_this._getVal(x))
      }else{
        return false;
      }
    })
    this.$elem.on('touchend', '.range i', function(e){
      x = e.changedTouches[0].clientX - offset.left;
      if(x >= 0 && x<= _this.w){
        $(this).css({
          left: x,
        })
        $(this).find('em').text(_this._getVal(x));
        let that = $(this);
        if(clearTime){
          clearTimeout(clearTime);
        }
        clearTime = setTimeout(function(){
          that.find('em').hide()
        },1800);
      }else{
        return false;
      }
    })
    this.$elem.on('touchstart', function(e){
      x = e.targetTouches[0].clientX - offset.left;
      if(x >= 0 && x<= _this.rangeW){
        if(x >= _this.w) {
          x = _this.w
        }
        $(this).find('.range i').css({
          left: x,
        })
        let that = $(this);
        $(this).find('.range i em').text(_this._getVal(x));
        $(this).find('.range i em').show(100);

        clearTime = setTimeout(function(){
          that.find('.range i em').hide()
        },1800)

      }else{
        return false;
      }
    })
  },
  _getVal: function(x){
    let val = Math.ceil((x/this.w)*100);
    this.$elem.data('val', val);
    return val
  },
  setVal: function(x){
    let lf = (this.rangeW*x)/100;
    this.$elem.find('.range i').css({left: lf});
    this.$elem.data('val', x);
  }
})
$.fn.colorRange = function(){
  return new colorRange(this);
}
var labelCheck = {
  _init: function(e,flag){
    this.elem = $(e);
    (!!flag) ? this.setOn() : this.setOff();
    this._bindEvent();
    return this;
  },
  _bindEvent: function(){
    let that = this;
    this.elem.on('touchstart', function(){
      if(!$(this).hasClass('checked')){
        that.setOn();
      }else {
        that.setOff();
      }
    })
  },
  setOn: function(){
    this.elem.addClass('checked').find('.val').text('ON');
    this.elem.data('flag', true)
  },
  setOff: function(){
    this.elem.removeClass('checked').find('.val').text('OFF');
    this.elem.data('flag', false)
  }
}
