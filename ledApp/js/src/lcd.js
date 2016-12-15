$(function(){
  $('.colorpicker-wrapper').ColorPicker({
    bgChange: function(){}
  });
  colorRange._init('.saturation .range-item');
  colorRange._init('.brightness .range-item');

  //data
  //app ready
  OJS.bindAppReady(function(){
    //ojs ready
    OJS.bindReady(function(){
      notNetwork();
      OJS.device.bindPushData({
         'deviceStatusChange': function(data){
           if(OJS.device.onlineStatus == 1){
             console.log(data)
             $('.device-name').find('.item-val i').removeClass('offline').addClass('online');
           }else {
             OJS.app.toast("设备不在线，无法更新数据！");
             $('.device-name').find('.item-val i').removeClass('online').addClass('offline');
           }
         }
      })
    })
  })

  //get val
  function setStauts(data){
    let $devicename = $('.device-name'),
        $temp = $('.temp'),
        $humidity = $('.humidity'),
        $intensity = $('.intensity'),
        $distance = $('.distance');
    $devicename.find('.item-val value').text(data['mac']);
    $temp.find('.item-val value').text(data['temperature']);
    $humidity.find('.item-val value').text(data['humidity']);
    $intensity.find('.item-val value').text(data['LightSensor']);
    $intensity.find('.item-val value').text(data['infrared']);
  }
  //put val
  function putStauts(){

  }

  //无网络判断
  function notNetwork(){
    setInterval(function(){
      OJS.app.hasNetWork(function(data){
        if(data){
          OJS.ui.hideOfflineMask();
          // OJS.app.toast(data+'有网络');
        }else {
          OJS.ui.showOfflineMask();
          // OJS.app.toast(data+'无网络');
        }
      })
    }, 5000)
  }
})
var colorRange = {
  _init: function(elem){
    this.$elem = $(elem);
    this._bindEvent(this.$elem);
    return this;
  },
  _bindEvent: function(){
    //console.log(this.$elem);
    let rangeW = this.$elem.find('.range').width(),
        rangeRadiusW = this.$elem.find('.range i').width();
    let w = rangeW - rangeRadiusW;
    let offset = this.$elem.find('.range').position(),x;
    console.log(offset);
    this.$elem.on('touchstart', '.range i', function(e){
      x = e.targetTouches[0].clientX - offset.left;
      if(x >= 0 && x<= w){
        $(this).css({
          left: x,
        })
      }else{
        return false;
      }
    })
    this.$elem.on('touchmove', '.range i', function(e){
      x = e.targetTouches[0].clientX - offset.left;
      if(x >= 0 && x<= w){
        $(this).css({
          left: x,
        })
      }else{
        return false;
      }
    })
    this.$elem.on('touchend', '.range i', function(e){
      x = e.changedTouches[0].clientX - offset.left;
      if(x >= 0 && x<= w){
        $(this).css({
          left: x,
        })
      }else{
        return false;
      }
    })
    this.$elem.on('touchstart', function(e){
      x = e.targetTouches[0].clientX - offset.left;
      if(x >= 0 && x<= rangeW){
        if(x >= w) {
          x = w
        }
        $(this).find('.range i').css({
          left: x,
        })
      }else{
        return false;
      }
    })
  }
}
