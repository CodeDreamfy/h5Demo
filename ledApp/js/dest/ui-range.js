'use strict';

var UiRange = function UiRange(elem, option) {
  this.author = 'CodeDreamfy';
  this.version = '0.0.1';
  this.$elem = $(elem);
  this.defaultOption = {};
  this.options = $.extend({}, this.defaultOption, option || {});

  //init
  this._init();
};

$.extend(UiRange.prototype, {
  _init: function _init() {},
  _render: function _render() {},
  _bindEvent: function _bindEvent() {}
});

$.fn.UiRange = function (option) {
  return new UiRange(this, option);
};