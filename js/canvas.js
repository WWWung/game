var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mosPos = [0,0];
var bullets = [];
var monsters = [];
var imgObj = {
  heroReady: false,
  bgReady: false,
  monReady: false
};
var moveObj = {
  t: false,
  d: false,
  l: false,
  r: false
}

class Hero {
  constructor (x,y,src){
    this.src = src;
    this.die = false;
    this.w = 20;
    this.h = 24;
    this.posx = x-10;
    this.posy = y-12;
  }
  draw(ctx,ang){
    ctx.save();
    ctx.translate(this.posx,this.posy);
    if(mosPos[0]){
      ctx.rotate(ang-125*Math.PI/180);
    }
    ctx.drawImage(this.src,-10,-12,this.w,this.h);
    ctx.restore();
  }
}

class Monster {
  constructor(src) {
    this.posx = Math.round(Math.random()*canvas.width-156)+96;
    this.posy = Math.round(Math.random()*canvas.height-100)+50;
    this.src = src;
    this.die = false;
    this.w = 94;
    this.h = 28;
    this.vy = -this.w/2;
  }
}

class Bullet {
  constructor (x,y,radius){
    this.die = false;
    this.posx = x;
    this.posy = y;
    this.vy = 0;
    this.radius = radius;
  }
}


document.addEventListener('mousemove',function(e){
  mosPos[0] = e.pageX-canvas.offsetLeft+canvas.width/2;
  mosPos[1] = e.pageY-canvas.offsetTop;
})



var heroImg = new Image();
heroImg.src = './imgs/1.png'
var bgImg = new Image();
bgImg.src = './imgs/map1.png'
var monImg = new Image();
monImg.src = './imgs/mon1.png'

bgImg.onload = function () {
  imgObj.bgReady = true;
}

monImg.onload = function () {
  imgObj.monReady = true;
}

heroImg.onload = function () {
  imgObj.heroReady = true;
}
let hero = new Hero(canvas.width/2,canvas.height/2,heroImg)

start()
canvas.addEventListener('click',function (e) {
  let l = e.pageX-canvas.offsetLeft+canvas.width/2;
  let t = e.pageY-canvas.offsetTop;
  radius = Math.atan(Math.abs(t-hero.posy)/Math.abs(l-hero.posx))
  if(l-hero.posx>0){
    if(t-hero.posy<0){
      radius = -radius-Math.PI/2;
    }else{
      radius = radius-Math.PI/2;
    }
  }else{
    if(t-hero.posy<0){
      radius = radius+Math.PI/2;
    }else{
      radius = Math.PI/2-radius
    }
  }
  bullets.push(new Bullet(hero.posx,hero.posy,radius))
})

function start() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  bg()
  let ang = Math.atan2(mosPos[1]-hero.posy,mosPos[0]-hero.posx)
  if(imgObj.heroReady){
    hero.draw(ctx,ang)
  }
  if(Math.random()>0 && monsters.length<1){
    monsters.push(new Monster(monImg))
  }
  render()
  heroMove()
  for(var i=bullets.length-1;i>=0;i--){
    if(bullets[i].posx>canvas.width || bullets[i].posy>canvas.height || bullets[i].posx<0 || bullets[i].posy<0){
      bullets.splice(i,1)
    }
  }
  window.requestAnimationFrame(start)
}

function bg() {
  if(imgObj.bgReady){
    ctx.drawImage(bgImg,0,0,canvas.width,canvas.height)
  }
}

function render() {
  if(bullets.length){
    bullets.forEach((item)=>{
      item.vy += 10;
      if(item.posy>15){
        ctx.save();
        ctx.translate(item.posx,item.posy);
        ctx.rotate(item.radius)
        ctx.beginPath();
        ctx.fillStyle = '#000'
        ctx.arc(0,item.vy,2,0,2*Math.PI)
        ctx.fill()
        ctx.restore()
      }
    })
  }
  if(!monsters.length) return;
  monsters.forEach((item)=>{
    let radius = Math.atan(Math.abs(item.posy-hero.posy)/Math.abs(item.posx-hero.posx));
    if(item.posx-hero.posx>0){
      if(item.posy-hero.posy<0){
        radius = -radius;
      }else{
        radius = radius;
      }
    }else{
      if(item.posy-hero.posy<0){
        radius = radius+Math.PI;
      }else{
        radius = -radius-Math.PI;
      }
    }
    if(imgObj.monReady){
      ctx.save()
      ctx.translate(item.posx,item.posy)
      ctx.rotate(radius)
      ctx.drawImage(monImg,item.vy,-item.h/2,item.w,item.h)
      ctx.restore()
    }
    item.vy-=0.5
  })
}

window.addEventListener('keydown',function(e){
  let key = e.keyCode;
  switch (key) {
    case 87:
      moveObj.t = true
      break;
    case 83:
      moveObj.d = true
      break;
    case 65:
      moveObj.l = true
      break;
    case 68:
      moveObj.r = true
      break;
  }
})

window.addEventListener('keyup',function(e){
  let key = e.keyCode;
  switch (key) {
    case 87:
      moveObj.t = false
      break;
    case 83:
      moveObj.d = false
      break;
    case 65:
      moveObj.l = false
      break;
    case 68:
      moveObj.r = false
      break;
  }
})
function heroMove(){
  limitMove(true)
  if(moveObj.t){
    hero.posy -= 1;
  }
  if(moveObj.l){
    hero.posx -= 1;
  }
  if(moveObj.d){
    hero.posy += 1;
  }
  if(moveObj.r){
    hero.posx += 1;
  }
}

function limitMove(flag) {
  if(hero.posy<176 || hero.posy>245){
    if(hero.posx<46){
      hero.posx=46
    }
  }else if(!flag){
    hero.posx=46
  }
  if(!(hero.posy<176 || hero.posy>245) && hero.posx<46){
    if(hero.posy<177){
      hero.posy=177
    }else if(hero.posy>235){
      hero.posy=235
    }
  }
  if(hero.posx>canvas.width-10){
    hero.posx=canvas.width-10
  }
  if(hero.posy<12){
    hero.posy=12
  }else if(hero.posy>canvas.height-12){
    hero.posy=canvas.height-12
  }
}
