$(function(){
  uiRange.init()
  let shadowVal = 10;

  $('.led-wrapper').on('touchstart', '.conent-main .ledwrap', function(e){
    e.preventDefault();
    setLedShadow(shadowVal)
    $('.nav-wrap').toggleClass('active');
    $('.conent-main .sensor-wrapper').toggleClass('hide');
  });

  $('.led-wrapper').on('touchstart', '.nav-wrap .nav-inner .nav-item', function(e){
    e.preventDefault();
    if($(this).index() == 3 ) return false;
    $(this).addClass('active').siblings().removeClass('active');
    $('.control').addClass('show');
  })

  $('.led-wrapper').on('touchstart', '.control .arrow', function(e){
    e.preventDefault();
    $('.control').toggleClass('show');
  })
})

function setLedShadow(val,color){
  console.log("sasa")
  let $round = $('.conent-main .ledwrap');
  let defaultColor = !!color ? color : '#fff';
  let opacity = val/100;
  $round.find('.r1').css({
    'box-shadow': '0 0 '+ val*0.55 + 'px 0 '+ defaultColor,
    'background': defaultColor
  })
  $('.r2,.r3', $round).css({
    'box-shadow': '0 0 '+ val*0.6 + 'px 0 '+ defaultColor,
    'background': defaultColor
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
      $input.on('input change', function(){
        let n = $(this).val();
        $(this).siblings('.progress').css({
          width: n+'%'
        })
        setLedShadow(n)
      })
    })
  }
}