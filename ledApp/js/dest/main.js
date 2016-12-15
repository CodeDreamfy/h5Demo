'use strict';

$(function () {

  var initFlag = false;
  //ojs ready
  $('.lcd-wrap .colorpicker-wrapper').ColorPicker({
    bgChange: function bgChange() {}
  });
  $('.saturation .range-item').colorRange();
  $('.brightness .range-item').colorRange();
  //init
  var motor = void 0;
  //Event
  function EventBind() {
    $('.motor').on('click', '.label-check', function (e) {
      var flag = $(this).data('flag');
      send({ 'DcMotor': { boolean: flag } });
      return false;
    });
    $('.index').on('touchstart', '.lcd-wrap .submit', function () {
      var brightness = OJS.device.getSensorData('brightness');
      send(getLcd());
      // $('.lcd-wrap').hide();
    });
    $('.index').on('touchstart', '.colorpicker-wrapper .startBtn', function (e) {
      var brightness = OJS.device.getSensorData('brightness');
      $(this).toggleClass('on');
      if ($(this).hasClass('on')) {
        send(getLcd(0));
      } else {
        send(getLcd(50));
      }
      // $('.lcd-wrap').hide();
    });
  }

  //data
  //app ready
  OJS.bindAppReady(function () {
    notNetwork();
    OJS.bindReady(function () {
      EventBind();
      var initData = OJS.device.getSensorData();
      var brightness = initData.brightness;
      motor = labelCheck._init('.motor-check', initData.DcMotor);

      OJS.device.bindPushData({
        'deviceStatusChange': function deviceStatusChange(data) {
          if (OJS.device.onlineStatus == 1) {
            $('.device-name').find('.item-val i').removeClass('offline').addClass('online');
            setStauts(data);
            brightness > 1 ? $('.index .colorpicker-wrapper .startBtn').addClass('on') : $('.index .colorpicker-wrapper .startBtn').removeClass('on');
          } else {
            OJS.app.toast("设备不在线，无法更新数据！");
            $('.device-name').find('.item-val i').removeClass('online').addClass('offline');
          }
        }
      });
    });
  });
  //send
  function send(o) {
    var ops = {};
    var defaults = {
      'hues': null,
      'saturation': null,
      'brightness': null,
      'DcMotor': null
    };
    ops = $.extend({}, defaults, o);
    var result = OJS.device.sendNotify(ops, function () {
      OJS.app.toast('命令已经下发');
    }, function () {
      OJS.app.toast('设备已经收到命令！');
    });
    if (!result) {
      OJS.app.toast('命令发送失败，无法连接到服务器');
    }
  }
  //get val
  function setStauts(data) {
    var $devicename = $('.device-name'),
        $temp = $('.temp'),
        $humidity = $('.humidity'),
        $intensity = $('.intensity'),
        $distance = $('.distance'),
        $motorBtn = $('.motor .label-check');
    //$devicename.find('.item-val value').text(data['mac']);
    $temp.find('.item-val .value').text(data.temperature);
    $humidity.find('.item-val .value').text(data.humidity);
    $intensity.find('.item-val .value').text(data.LightSensor);
    $distance.find('.item-val .value').text(data.infrared);
    if (data.DcMotor) {
      motor.setOn();
    } else {
      motor.setOff();
    }
  }
  function getLcd() {
    var $lcd = $('.lcd'),
        o = {};
    o.hues = $lcd.find('.colorpicker-wrapper').data('hsl');
    o.saturation = $lcd.find('.saturation .range-item').data('val');
    o.brightness = arguments.length !== 0 ? arguments[0] : $lcd.find('.brightness .range-item').data('val');

    return {
      'hues': { float: o.hues },
      'saturation': { float: o.saturation },
      'brightness': { float: o.brightness }
    };
  }
  //无网络判断
  function notNetwork() {
    setInterval(function () {
      OJS.app.hasNetWork(function (data) {
        if (data) {
          OJS.ui.hideOfflineMask();
          // OJS.app.toast(data+'有网络');
        } else {
          OJS.ui.showOfflineMask();
          // OJS.app.toast(data+'无网络');
        }
      });
    }, 5000);
  }
});