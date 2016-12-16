let swiper,COLOR="#fff",Light=50,ColorPick, swIndex;



  //app ready
OJS.bindAppReady(function(){
  notNetwork();
  OJS.bindReady(function(){
    bindEvent();
    var initData = OJS.device.getSensorData();
    if(OJS.device.onlineStatus == 1){
      $('.device-status em').addClass('online');
    }else {
      $('.device-status em').addClass('offline');
    } 
    OJS.device.bindPushData({
        'deviceStatusChange': function(data){
          if(OJS.device.onlineStatus == 1){
            setScene(data)
          }else {
            OJS.app.toast("设备不在线，无法更新数据！");
          }
        }
    })
  })
})
//send
function send(o){
  let ops = {};
  let defaults = {
    'hues': null,
    'saturation': null,
    'brightness': null,
    'DcMotor': null
  };
  ops = $.extend({}, defaults, o);
  let result = OJS.device.sendNotify(ops, function(){
    OJS.app.toast('命令已经下发');
  }, function(){
    OJS.app.toast('设备已经收到命令！');
  });
  if(!result){
    OJS.app.toast('命令发送失败，无法连接到服务器');
  }
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

//set index data
function setScene(data){
  let $sensorWrapper = $('.sensor-wrapper');
  $sensorWrapper.find('.temp .val em').text(data.temperature);
  $sensorWrapper.find('.humidity .val em').text(data.humidity);
  $sensorWrapper.find('.intensity .val em').text(data.LightSensor);
  $sensorWrapper.find('.distance .val em').text(data.infrared);

  //电机开关
  if(data.DcMotor){
    if(!$('[for="label-led1"]').prev().prop('checked')){
      $('[for="label-led1"]').click()
    }
  }else {
    if($('[for="label-led1"]').prev().prop('checked')){
      $('[for="label-led1"]').click()
    }
  }
  
}


function bindEvent(){
  $('.led-wrapper').on('touchstart', '.dianji', function(e){
    let flag;
    if($('[for="label-led1"]').prev().prop('checked')){
      flag = false;
    }else {
      flag = true;
    }
    send({'DcMotor':{boolean : flag}})
  })

  $('.led-wrapper').on('touchstart', '.conent-main .ledwrap', function(e){
    let flag = $(this).data('flag');
    if(!flag){
      setLight(50,'#fff','#fff');
      $(this).data('flag', true);
      send({'brightness':{float: 50}});
      $('.nav-wrap').addClass('active');
    }else {
      setLight(0,'#10042e','#10042e');
      $(this).data('flag', false);
      $('.control').removeClass('show-scene show');
      $('.nav-inner .nav-item').removeClass('active');
      $('.led-canvas').hide();
      // console.log("off")
      send({'brightness':{float: 0}})
      $('.nav-wrap').removeClass('active');
    }
    
    $('.conent-main .sensor-wrapper').toggleClass('hide');
    e.preventDefault();
  });

  $('.led-wrapper').on('touchstart', '.nav-wrap .nav-inner .nav-item', function(e){
    e.preventDefault();
    e.stopPropagation();
    let oData = OJS.device.getSensorData();
    let index = $(this).index();
    $('.mingdu').val(50).prev().css('width','50%');
    $('.baohe').val(50).prev().css('width','50%');
    if( index == 3) return false;
    if( index == 0) {
      send({'brightness': {float: 50}})
      setLight(50,'#fff','#fff');
    }
    if(index == 1){
      $('.led-canvas').show();
      if(!ColorPick) ColorPick = $('.led-canvas').ColorPicker();
      //console.log($('.led-canvas').data('colorHsl'))
      setLight(50,$('.led-canvas').data('colorHsl'),'#fff');
    }else {
      $('.led-canvas').hide();
    }
    if(index == 2){
      $('.control .scene-wrap').show();
      $('.control').removeClass('show').addClass('show-scene');
      setLight(50,'#fff','#fff');
      if(!swiper){
        swiper =  new Swiper ('.swiper-container', {
          slidesPerView: 5,
          setWrapperSize: true,
          prevButton:'.swiper-button-prev',
          nextButton:'.swiper-button-next',
          onTap: function(sw){
            console.log(sw.clickedIndex)
            if($(sw.clickedSlide).hasClass('active')){
              $(sw.clickedSlide).removeClass('active');
              $('.control').addClass("show-scene");
              send({
                'hues': {float:0}
              })
            }else {
              $('.swiper-wrapper .swiper-slide').eq(sw.clickedIndex).addClass('active').siblings().removeClass('active');
              swIndex = $('.swiper-wrapper .swiper-slide').eq(sw.clickedIndex);
              $('.control').removeClass("show-scene");
              send({
                'saturation': {float: parseInt($('.baohe').val())},
                'brightness': {float: parseInt($('.mingdu').val())},
                'hues': {float: parseInt(swIndex.data('hsl'))}
              })
              //console.log(swIndex.data('hsl'), $('.mingdu').val(), $('.baohe').val())
            }
            $('.mingdu').val(50).prev().css('width','50%');
            $('.baohe').val(50).prev().css('width','50%');
          }
        })
      }
    }else {
      $('.control .scene-wrap').hide();
      $('.control .content').removeClass('hide');
    };
    $(this).addClass('active').siblings().removeClass('active');
    $('.control').addClass('show');
    $('.nav-wrap').removeClass('active');
  })

  $('.led-wrapper').on('touchstart', '.control .arrow', function(e){
    $('.control').removeClass('show');
    if( $('.control').hasClass('show-scene')) $('.control').removeClass("show-scene");
    $('.nav-wrap').addClass('active');
    e.preventDefault();
  });

  $('.led-wrapper').on('touchend', '.control .scene-wrap .scene-item', function(e){
    e.stopPropagation();
    //console.log(e.target.className)
    $(this).addClass('active').siblings().removeClass('active');
    $('.control').removeClass("show-scene");
    e.preventDefault();
    return false;
  });
}
  
  

function setLight(val,color,bg){
  let $round = $('.conent-main .ledwrap');
  if(val==0) bg='#10042e'
  $round.find('.r1').css({
    'box-shadow': '0 0 '+ val*0.75 + 'px 0 '+ color,
    'background': bg
  })
  $('.r2,.r3', $round).css({
    'box-shadow': '0 0 '+ val*0.6 + 'px 0 '+ color,
    'background': bg
  })
  
}


var uiRange = {
  init () {
    $('.ui-range').forEach((elem,index)=>{
      let $input = $(elem).find('input[type=range]');
      let min = $input.attr('min');
      let max = $input.attr('max');
      let now = $input.val();
      let val = (now-min)/(max-min)*100;
      $(elem).find('.progress').css({
        width: val+'%'
      });
      $input.on('input change', function(e){
        e.preventDefault();
        e.stopPropagation();
        let n = $(this).val();
        $(this).siblings('.progress').css({
          width: n+'%'
        })
        
        let index = $('.nav-inner').children('.active').index();
        if(index == 0){
          if($(this).hasClass('mingdu')){
            setLight(n,'#fff','#fff');
          }
          send({
            'saturation': {float: parseInt($('.baohe').val())},
            'brightness': {float: parseInt($('.mingdu').val())}
          })
          // console.log("index:",index,':',$('.baohe').val(), $('.mingdu').val())
        }else if( index == 1){
          if($(this).hasClass('mingdu')){
            setLight(n,$('.led-canvas').data('colorHsl'),'#fff');
          }
          send({
            'saturation': {float: parseInt($('.baohe').val())},
            'brightness': {float: parseInt($('.mingdu').val())},
            'hues': {float: $('.led-canvas').data('color')}
          })
          // console.log("index:",index,':',$('.led-canvas').data('color'),$('.baohe').val(), $('.mingdu').val())
        }else if( index == 2){
          if($(this).hasClass('mingdu')){
            setLight(n,'#fff','#fff');
          }
          send({
            'saturation': {float: parseInt($('.baohe').val())},
            'brightness': {float: parseInt($('.mingdu').val())},
            'hues': {float: swIndex.data('hsl')}
          })
          // console.log("index:",index,':',swIndex.data('hsl'),$('.baohe').val(), $('.mingdu').val())
        }
      })
    })
  }
}

uiRange.init();