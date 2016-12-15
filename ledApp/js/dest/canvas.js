/*
$(function(){

  var canvas1 = document.getElementById('c1');
  var ctx = canvas1.getContext('2d');
  var cx = canvas1.width/2,
  		cy = canvas1.height/2,
      ox = cx,
      oy = cy;
  for(var i=0; i<360; i+=0.1){
  	var rad = i*(Math.PI/180);
    ctx.strokeStyle = "hsla("+i+", 100%, 50%, 1)";
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+ox*Math.cos(rad),cy+oy*Math.sin(rad))
    ctx.stroke()
  }
  var cp = ctx.getImageData(0,0,canvas1.width,canvas1.height);

  ctx.fillStyle = '#fff';
  var omin = new Path2D();
  omin.arc(cx,cy,cy-100,0,2*Math.PI);
  ctx.fill(omin)

  var omx = cy-100;
  mouse(ox,cy-omx-10);

  var maxR = ox,minR = (ox-100),x,y;
  canvas1.addEventListener('touchstart', function(event){
    event.stopPropagation();
  	x = event.touches[0].clientX;
    y = event.touches[0].clientY;
    var o = ptq(x,y,ox,oy,maxR,minR);
    if(o.code){
      initDraw(x,y);
    }
    return false;
  })
  canvas1.addEventListener('touchmove', function(event){
    event.stopPropagation();
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
    var o = ptq(x,y,ox,oy,maxR,minR);
    if(o.code){
      initDraw(x,y);
    }
    return false;
  })
  canvas1.addEventListener('touchend', function(event){
    event.stopPropagation();
    x = event.changedTouches[0].clientX;
    y = event.changedTouches[0].clientY;
    var o = ptq(x,y,ox,oy,maxR,minR);
    if(o.code){
      initDraw(x,y);
    }
    return false;
  })
  function ptq(x,y,rx,ry,maxR,minR){
    var d = Math.sqrt(Math.pow((x-rx),2)+Math.pow((y-ry),2));
    var o = {};
    if(d>=minR && d<=maxR){
      o.code = true;
    }else {
      o.code = false;
    }
    return o;
  }
  function initDraw(){
    ctx.clearRect(0,0,canvas1.width,canvas1.height);
    ctx.putImageData(cp,0,0);
    ctx.fillStyle = '#fff';
    ctx.fill(omin);
    mouse(x,y)
  }
  function mouse(x,y){
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(x,y,20,0,Math.PI*2);
    ctx.stroke()
  }
})
*/
"use strict";