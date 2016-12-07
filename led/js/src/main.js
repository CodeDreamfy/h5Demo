$(function(){
  let $downBtn = $('.work-status .downBtn');

  //bind-Event
  //横排模组开关
  $('body').on('click', '.work-status .downBtn a', function(){
    $(this).toggleClass('active');
  })

  var Process1 = $('.place-canvas.blue').checkboxFun({
    nowVal: 50
  });
  var Process2 = $('.place-canvas.red').checkboxFun({
    style:'red',
    nowVal: 90
  });
  //app ready -- ojsready
})
