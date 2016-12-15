let UiRange = function(elem, option){
  this.author = 'CodeDreamfy';
  this.version = '0.0.1';
  this.$elem = $(elem);
  this.defaultOption = {
  }
  this.options = $.extend({}, this.defaultOption, option || {})

  //init
  this._init();
}

$.extend(UiRange.prototype, {
  _init: function(){
		
  },
  _render: function(){
    
  },
  _bindEvent: function(){

  }
})

$.fn.UiRange = function(option) {
  return new UiRange(this, option);
}
