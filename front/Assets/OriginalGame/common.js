import Stats from './stats.js';

//=========================================================================
// 미니멀리스트 DOM 도우미
//=========================================================================
const Dom = {
  // 요소 가져오기
  get:  function(id)                     { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); },
  // 내용 설정
  set:  function(id, html)               { Dom.get(id).innerHTML = html;                        },
  // 이벤트 등록
  on:   function(ele, type, fn, capture) { Dom.get(ele).addEventListener(type, fn, capture);    },
  // 이벤트 해제
  un:   function(ele, type, fn, capture) { Dom.get(ele).removeEventListener(type, fn, capture); },
  // 요소 표시
  show: function(ele, type)              { Dom.get(ele).style.display = (type || 'block');      },
  // 포커스 해제
  blur: function(ev)                     { ev.target.blur();                                    },
  // 클래스 이름 추가
  addClassName:    function(ele, name)     { Dom.toggleClassName(ele, name, true);  },
  // 클래스 이름 제거
  removeClassName: function(ele, name)     { Dom.toggleClassName(ele, name, false); },
  // 클래스 이름 토글
  toggleClassName: function(ele, name, on) {
    ele = Dom.get(ele);
    let classes = ele.className.split(' ');
    let n = classes.indexOf(name);
    on = (typeof on == 'undefined') ? (n < 0) : on;
    if (on && (n < 0))
      classes.push(name);
    else if (!on && (n >= 0))
      classes.splice(n, 1);
    ele.className = classes.join(' ');
  },
  // 로컬 스토리지
  storage: window.localStorage || {}
}

//=========================================================================
// general purpose helpers (mostly math) 범용 도우미(mostly수학)
//=========================================================================

const Util = {
  // 현재 타임스탬프 가져오기
  timestamp:        function()                  { return new Date().getTime();                                    },
  // 정수로 변환 (기본값 설정 가능)
  toInt:            function(obj, def)          { if (obj !== null) { let x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.toInt(def, 0); },
  // 부동 소수점 수로 변환 (기본값 설정 가능)
  toFloat:          function(obj, def)          { if (obj !== null) { let x = parseFloat(obj);   if (!isNaN(x)) return x; } return Util.toFloat(def, 0.0); },
  // 값을 최소값과 최대값 사이로 제한
  limit:            function(value, min, max)   { return Math.max(min, Math.min(value, max));                     },
  // 두 값 사이의 무작위 정수 생성
  randomInt:        function(min, max)          { return Math.round(Util.interpolate(min, max, Math.random()));   },
  // 주어진 옵션 중에서 무작위 선택
  randomChoice:     function(options)           { return options[Util.randomInt(0, options.length-1)];            },
  // 퍼센트 남은 값 계산
  percentRemaining: function(n, total)          { return (n%total)/total;                                         },
  // 가속도에 따른 속도 계산
  accelerate:       function(v, accel, dt)      { return v + (accel * dt);                                        },
  // 두 값 사이를 보간
  interpolate:      function(a,b,percent)       { return a + (b-a)*percent                                        },
  // 이징 함수 (easeIn)
  easeIn:           function(a,b,percent)       { return a + (b-a)*Math.pow(percent,2);                           },
  // 이징 함수 (easeOut)
  easeOut:          function(a,b,percent)       { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
  // 이징 함수 (easeInOut)
  easeInOut:        function(a,b,percent)       { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
  // 지수 포그 함수
  exponentialFog:   function(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); },

  // 값 증가 (루핑 가능)
  increase:  (start, increment, max) => { // with looping
    let result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
  },

  // 3D 좌표를 2D 화면 좌표로 변환
  project: (p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) => {
    p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
  },

  // 두 영역이 겹치는지 확인
  overlap: (x1, w1, x2, w2, percent) => {
    let half = (percent || 1)/2;
    
    let min1 = x1 - (w1*half);
    let max1 = x1 + (w1*half);
    let min2 = x2 - (w2*half);
    let max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));
  }

}

//=========================================================================
// 애니메이션 프레임 요청을 위한 POLYFILL
//=========================================================================
if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame    || 
                                 window.oRequestAnimationFrame      || 
                                 window.msRequestAnimationFrame     || 
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}

//=========================================================================
// GAME LOOP helpers
//=========================================================================
/*
 * 게임 실행을 담당하는 객체입니다.
 * 게임 초기화, 이미지 로딩, 게임 루프 실행, 통계 생성, 음악 재생 등의 역할을 합니다.
 */
const Game = {
  run: options => {

    Game.loadImages(options.images, images => {

      options.ready(images); // 이미지가 로드되었으므로 호출자에게 초기화하도록 알립니다

      Game.setKeyListener(options.keys);

      let canvas = options.canvas,    // 캔버스 렌더 타겟은 호출자에서 제공됩니다
          update = options.update,    // 게임 로직을 업데이트하는 메서드는 호출자에서 제공됩니다
          render = options.render,    // 게임을 렌더링하는 메서드는 호출자에서 제공됩니다
          step   = options.step,      // 고정 프레임 스텝 (1/fps)은 호출자에서 지정됩니다
          stats  = options.stats,     // stats 인스턴스는 호출자에서 제공됩니다
          now    = null,
          last   = Util.timestamp(),
          dt     = 0,
          gdt    = 0;

      function frame() {
        now = Util.timestamp();
        dt  = Math.min(1, (now - last) / 1000); // requestAnimationFrame을 사용하면 '휴면'상태로 들어갈 때 발생하는 큰 델타를 처리할 수 있어야 합니다
        gdt = gdt + dt;
        while (gdt > step) {
          gdt = gdt - step;
          update(step);
        }
        render();
        stats.update();
        last = now;
        requestAnimationFrame(frame, canvas);
      }
      frame(); // 파티 시작!
      Game.playMusic();
    });
  },

  //---------------------------------------------------------------------------
  // 여러 이미지를 로드하고 모든 이미지가 로드된 경우 콜백하는 메서드
  loadImages: (names, callback) => {
    let result = [];
    let count  = names.length;

    let onload = () => {
      if (--count == 0)
        callback(result);
    };

    for(let n = 0 ; n < names.length ; n++) {
      let name = names[n];
      result[n] = document.createElement('img');
      Dom.on(result[n], 'load', onload);
      result[n].src = "images/" + name + ".png";
    }
  },

  //---------------------------------------------------------------------------
  // 키 이벤트 리스너 설정
  setKeyListener: keys => {
    let onkey = (keyCode, mode) => {
      for(let n = 0 ; n < keys.length ; n++) {
        let k = keys[n];
        k.mode = k.mode || 'up';
        if ((k.key == keyCode) || (k.keys && (k.keys.indexOf(keyCode) >= 0))) {
          if (k.mode == mode) {
            k.action.call();
          }
        }
      }
    };
    Dom.on(document, 'keydown', function(ev) { onkey(ev.keyCode, 'down'); } );
    Dom.on(document, 'keyup',   function(ev) { onkey(ev.keyCode, 'up');   } );
  },

  //---------------------------------------------------------------------------
  // 통계 생성 메서드 mr.doobs FPS 카운터 구성 - 친절한 좋음/나쁨/보통 메시지 박스와 함께
  stats: (parentId, id) => {
    let result = new Stats();
    result.domElement.id = id || 'stats';
    Dom.get(parentId).appendChild(result.domElement);

    let msg = document.createElement('div');
    msg.style.cssText = "border: 2px solid gray; padding: 5px; margin-top: 5px; text-align: left; font-size: 1.15em; text-align: right;";
    msg.innerHTML = "Your canvas performance is ";
    Dom.get(parentId).appendChild(msg);

    let value = document.createElement('span');
    value.innerHTML = "...";
    msg.appendChild(value);

    setInterval( ()=> {
      let fps   = result.current();
      let ok    = (fps > 50) ? 'good'  : (fps < 30) ? 'bad' : 'ok';
      let color = (fps > 50) ? 'green' : (fps < 30) ? 'red' : 'gray';
      value.innerHTML       = ok;
      value.style.color     = color;
      msg.style.borderColor = color;
    }, 5000);
    return result;
  },

  //---------------------------------------------------------------------------

  // 음악 재생 메서드
  playMusic: () => {
    let music = Dom.get('music');
    music.loop = true;
    music.volume = 0.05; // 소음을 줄이기 위해 볼륨을 낮춤
    music.muted = (Dom.storage.muted === "true");
    music.play();
    Dom.toggleClassName('mute', 'on', music.muted);
    Dom.on('mute', 'click', function() {
      Dom.storage.muted = music.muted = !music.muted;
      Dom.toggleClassName('mute', 'on', music.muted);
    });
  }

}

//=========================================================================
// canvas rendering helpers
//=========================================================================
/*
 * 렌더링을 담당하는 객체입니다.
 * 도로, 차량, 배경, 안개 등의 렌더링 기능이 구현되어 있습니다.
 */
const Render = {
  // 다각형 그리기
  polygon: (ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },

  //---------------------------------------------------------------------------

  // 도로 세그먼트 렌더링
  segment: (ctx, width, lanes, x1, y1, w1, x2, y2, w2, fog, color) => {

    let r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;

    // 잔디 영역 그리기
    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);
    
    // 도로 럼블 스트립 그리기
    Render.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
    Render.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
    // 도로 표시 영역 그리기
    Render.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);
    
    // 차선 표시 그리기
    if (color.lane) {
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(let lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }
    
    // 안개 그리기
    Render.fog(ctx, 0, y1, width, y2-y1, fog);
  },

  //---------------------------------------------------------------------------

  // 배경 그리기
  background: (ctx, background, width, height, layer, rotation, offset) => {

    rotation = rotation || 0;
    offset   = offset   || 0;

    let imageW = layer.w/2;
    let imageH = layer.h;

    let sourceX = layer.x + Math.floor(layer.w * rotation);
    let sourceY = layer.y
    let sourceW = Math.min(imageW, layer.x+layer.w-sourceX);
    let sourceH = imageH;
    
    let destX = 0;
    let destY = offset;
    let destW = Math.floor(width * (sourceW/imageW));
    let destH = height;

    ctx.drawImage(background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
    if (sourceW < imageW)
      ctx.drawImage(background, layer.x, sourceY, imageW-sourceW, sourceH, destW-1, destY, width-destW, destH);
  },

  //---------------------------------------------------------------------------
  // 스프라이트 그리기
  sprite: (ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY) => {

    // 프로젝션에 상대적인 크기 및 roadWidth에 상대적인 크기 (토크 UI를 위해) 스케일 조정
    let destW  = (sprite.w * scale * width/2) * (SPRITES.SCALE * roadWidth);
    let destH  = (sprite.h * scale * width/2) * (SPRITES.SCALE * roadWidth);

    // offsetX 및 offsetY를 곱하여 위치 조정
    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));

    // clipY가 지정된 경우 적용하여 스프라이트를 잘라낸다
    let clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    if (clipH < destH)
      ctx.drawImage(
        sprites,             // 이미지 소스
        sprite.x, sprite.y,  // 소스 이미지의 위치
        sprite.w, sprite.h - (sprite.h * clipH / destH),  // 잘라낼 영역 크기
        destX, destY,        // 대상 캔버스에서의 위치
        destW, destH - clipH // 대상 캔버스에 그릴 크기 (잘라진 부분 제외)
      );
  },

  //---------------------------------------------------------------------------
  // 플레이어 차량 그리기
  player: (ctx, width, height, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown) => {

    // 플레이어 차량이 움직일 때 바운스 효과 추가
    let bounce = (1.5 * Math.random() * speedPercent * resolution) * Util.randomChoice([-1,1]);
    let sprite;

    // 조향에 따라 적절한 스프라이트 선택
    if (steer < 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_LEFT : SPRITES.PLAYER_LEFT;
    else if (steer > 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_RIGHT : SPRITES.PLAYER_RIGHT;
    else
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_STRAIGHT : SPRITES.PLAYER_STRAIGHT;

    // 스프라이트 렌더링
    Render.sprite(ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY + bounce, -0.5, -1);
  },

  //---------------------------------------------------------------------------

  // 안개 그리기
  fog: (ctx, x, y, width, height, fog) => {
    if (fog < 1) {
      ctx.globalAlpha = (1-fog)
      ctx.fillStyle = COLORS.FOG;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
    }
  },

  // 럼블 스트립 너비 계산
  rumbleWidth:     (projectedRoadWidth, lanes) => { return projectedRoadWidth/Math.max(6,  2*lanes); },
  // 차선 마커 너비 계산
  laneMarkerWidth: (projectedRoadWidth, lanes) => { return projectedRoadWidth/Math.max(32, 8*lanes); }

}

//=============================================================================
// 레이싱 게임 상수
//=============================================================================

// 키보드 입력 상수
const KEY = {
  LEFT:  37,
  UP:    38,
  RIGHT: 39,
  DOWN:  40,
  A:     65,
  D:     68,
  S:     83,
  W:     87
};

// 게임에서 사용되는 색깔 상수
const COLORS = {
  SKY:  '#72D7EE',
  TREE: '#005108',
  FOG:  '#005108',
  LIGHT:  { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC'  },
  DARK:   { road: '#696969', grass: '#009A00', rumble: '#BBBBBB'                   },
  START:  { road: 'white',   grass: 'white',   rumble: 'white'                     },
  FINISH: { road: 'black',   grass: 'black',   rumble: 'black'                     }
};

// 게임 배경 이미지 위치 및 크기
const BACKGROUND = {
  HILLS: { x:   5, y:   5, w: 1280, h: 480 },
  SKY:   { x:   5, y: 495, w: 1280, h: 480 },
  TREES: { x:   5, y: 985, w: 1280, h: 480 }
};

// 게임 스프라이트 정보
const SPRITES = {
  PALM_TREE:              { x:    5, y:    5, w:  215, h:  540 },
  BILLBOARD08:            { x:  230, y:    5, w:  385, h:  265 },
  TREE1:                  { x:  625, y:    5, w:  360, h:  360 },
  DEAD_TREE1:             { x:    5, y:  555, w:  135, h:  332 },
  BILLBOARD09:            { x:  150, y:  555, w:  328, h:  282 },
  BOULDER3:               { x:  230, y:  280, w:  320, h:  220 },
  COLUMN:                 { x:  995, y:    5, w:  200, h:  315 },
  BILLBOARD01:            { x:  625, y:  375, w:  300, h:  170 },
  BILLBOARD06:            { x:  488, y:  555, w:  298, h:  190 },
  BILLBOARD05:            { x:    5, y:  897, w:  298, h:  190 },
  BILLBOARD07:            { x:  313, y:  897, w:  298, h:  190 },
  BOULDER2:               { x:  621, y:  897, w:  298, h:  140 },
  TREE2:                  { x: 1205, y:    5, w:  282, h:  295 },
  BILLBOARD04:            { x: 1205, y:  310, w:  268, h:  170 },
  DEAD_TREE2:             { x: 1205, y:  490, w:  150, h:  260 },
  BOULDER1:               { x: 1205, y:  760, w:  168, h:  248 },
  BUSH1:                  { x:    5, y: 1097, w:  240, h:  155 },
  CACTUS:                 { x:  929, y:  897, w:  235, h:  118 },
  BUSH2:                  { x:  255, y: 1097, w:  232, h:  152 },
  BILLBOARD03:            { x:    5, y: 1262, w:  230, h:  220 },
  BILLBOARD02:            { x:  245, y: 1262, w:  215, h:  220 },
  STUMP:                  { x:  995, y:  330, w:  195, h:  140 },
  SEMI:                   { x: 1365, y:  490, w:  122, h:  144 },
  TRUCK:                  { x: 1365, y:  644, w:  100, h:   78 },
  CAR03:                  { x: 1383, y:  760, w:   88, h:   55 },
  CAR02:                  { x: 1383, y:  825, w:   80, h:   59 },
  CAR04:                  { x: 1383, y:  894, w:   80, h:   57 },
  CAR01:                  { x: 1205, y: 1018, w:   80, h:   56 },
  PLAYER_UPHILL_LEFT:     { x: 1383, y:  961, w:   80, h:   45 },
  PLAYER_UPHILL_STRAIGHT: { x: 1295, y: 1018, w:   80, h:   45 },
  PLAYER_UPHILL_RIGHT:    { x: 1385, y: 1018, w:   80, h:   45 },
  PLAYER_LEFT:            { x:  995, y:  480, w:   80, h:   41 },
  PLAYER_STRAIGHT:        { x: 1085, y:  480, w:   80, h:   41 },
  PLAYER_RIGHT:           { x:  995, y:  531, w:   80, h:   41 }
};

// SPRITES.SCALE은 참조 스프라이트 폭이 (반쪽) 도로 폭의 1/3이어야 하므로 설정
SPRITES.SCALE = 0.3* (1/SPRITES.PLAYER_STRAIGHT.w) // the reference sprite width should be 1/3rd the (half-)roadWidth (기준 스프라이트 폭은 (반쪽) 도로 폭의 1/3이어야 합니다)

// 스프라이트 카테고리
SPRITES.BILLBOARDS = [SPRITES.BILLBOARD01, SPRITES.BILLBOARD02, SPRITES.BILLBOARD03, SPRITES.BILLBOARD04, SPRITES.BILLBOARD05, SPRITES.BILLBOARD06, SPRITES.BILLBOARD07, SPRITES.BILLBOARD08, SPRITES.BILLBOARD09];
SPRITES.PLANTS     = [SPRITES.TREE1, SPRITES.TREE2, SPRITES.DEAD_TREE1, SPRITES.DEAD_TREE2, SPRITES.PALM_TREE, SPRITES.BUSH1, SPRITES.BUSH2, SPRITES.CACTUS, SPRITES.STUMP, SPRITES.BOULDER1, SPRITES.BOULDER2, SPRITES.BOULDER3];
SPRITES.CARS       = [SPRITES.CAR01, SPRITES.CAR02, SPRITES.CAR03, SPRITES.CAR04, SPRITES.SEMI, SPRITES.TRUCK];

export { Dom, Util, Game, Render, KEY, COLORS, BACKGROUND, SPRITES };