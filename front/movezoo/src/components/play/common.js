import Stats from './stats.js';
import { PLAYER_SPRITE, KEY, COLORS, BACKGROUND, SPRITES, MAX_FRAME_COUNT, BACKGROUND_SPRITE_FILE_NAME, MAP_SPRITE, EFFECT } from './gameConstants.js';
import { gameStartData } from './data.js';


// 이미지 불러오기
// import background from './images/background.png';
// import mute from './images/mute.png';
// import sprites from './images/sprites.png';

const selectAction = "run";


const frameIndex = {}
// frameIndex 초기화
Object.keys(MAX_FRAME_COUNT).forEach(character => {
  frameIndex[character] = {};
  Object.keys(MAX_FRAME_COUNT[character]).forEach(action => {
    frameIndex[character][action] = 0;
  })
})

// 프레임 업데이트
// 현재프레임 = (현재프레임+1) % 최대프레임
const updateFrameIndex = () => {
  frameIndex[gameStartData.selectCharacter][selectAction] =
    (frameIndex[gameStartData.selectCharacter][selectAction] + 1)
    % MAX_FRAME_COUNT[gameStartData.selectCharacter][selectAction];
}

let checkGameFrameCount = 0;
let frameInterval = 1; // 프레임 간격(default: 1, 2: 게임2프레임 마다 애니메이션프레임증가)

// const totalsFrames = {
//   run: 21
// }

// const images = {
//   background: background, 
//   mute: mute, 
//   sprites: sprites
// };

//=========================================================================
// 미니멀리스트 DOM 도우미
//=========================================================================
const Dom = {
  // 요소 가져오기
  get: (id) => { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); },
  // 내용 설정
  set: (id, html) => { Dom.get(id).innerHTML = html; },
  // 이벤트 등록
  on: (ele, type, fn, capture) => { Dom.get(ele).addEventListener(type, fn, capture); },
  // 이벤트 해제
  un: (ele, type, fn, capture) => { Dom.get(ele).removeEventListener(type, fn, capture); },
  // 요소 표시
  show: (ele, type) => { Dom.get(ele).style.display = (type || 'block'); },
  // 포커스 해제
  blur: (ev) => { ev.target.blur(); },
  // 클래스 이름 추가
  addClassName: (ele, name) => { Dom.toggleClassName(ele, name, true); },
  // 클래스 이름 제거
  removeClassName: (ele, name) => { Dom.toggleClassName(ele, name, false); },
  // 클래스 이름 토글
  toggleClassName: (ele, name, on) => {
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
// 범용 도우미(mostly수학)
//=========================================================================

const Util = {
  // 현재 타임스탬프 가져오기
  timestamp: () => { return new Date().getTime(); },
  // 정수로 변환 (기본값 설정 가능)
  toInt: (obj, def) => { if (obj !== null) { let x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.toInt(def, 0); },
  // 부동 소수점 수로 변환 (기본값 설정 가능)
  toFloat: (obj, def) => { if (obj !== null) { let x = parseFloat(obj); if (!isNaN(x)) return x; } return Util.toFloat(def, 0.0); },
  // 값을 최소값과 최대값 사이로 제한
  limit: (value, min, max) => { return Math.max(min, Math.min(value, max)); },
  // 두 값 사이의 무작위 정수 생성
  randomInt: (min, max) => { return Math.round(Util.interpolate(min, max, Math.random())); },
  // 주어진 옵션 중에서 무작위 선택
  randomChoice: (options) => { return options[Util.randomInt(0, options.length - 1)]; },
  // 퍼센트 남은 값 계산
  percentRemaining: (n, total) => { return (n % total) / total; },
  // 가속도에 따른 속도 계산
  accelerate: (v, accel, dt) => { return v + (accel * dt); },
  // 두 값 사이를 보간
  interpolate: (a, b, percent) => { return a + (b - a) * percent },
  // 이징 함수 (easeIn)
  easeIn: (a, b, percent) => { return a + (b - a) * Math.pow(percent, 2); },
  // 이징 함수 (easeOut)
  easeOut: (a, b, percent) => { return a + (b - a) * (1 - Math.pow(1 - percent, 2)); },
  // 이징 함수 (easeInOut)
  easeInOut: (a, b, percent) => { return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5); },
  // 지수 포그 함수
  exponentialFog: (distance, density) => { return 1 / (Math.pow(Math.E, (distance * distance * density))); },

  // 값 증가 (루핑 가능)
  increase: (start, increment, max) => { // with looping
    let result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
  },

  // 3D 좌표를 2D 화면 좌표로 변환하는 함수
  // Parameters:
  //   p: 3D 좌표를 나타내는 객체
  //   cameraX, cameraY, cameraZ: 카메라의 위치 좌표
  //   cameraDepth: 카메라의 깊이(depth)
  //   width, height: 화면의 너비와 높이
  //   roadWidth: 도로의 너비
  project: (p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) => {
    // 3D 좌표를 카메라 위치에서의 상대적인 좌표로 변환
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    // 카메라 깊이에 대한 화면 스케일 계산
    p.screen.scale = cameraDepth / p.camera.z;
    // 2D 화면 좌표 계산
    p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
    // 도로의 너비에 대한 2D 화면 너비 계산
    p.screen.w = Math.round((p.screen.scale * roadWidth * width / 2));
  },

  // 두 영역이 겹치는지 확인하는 함수
  // Parameters:
  //   x1, w1: 첫 번째 영역의 중심 좌표(x1)와 너비(w1)
  //   x2, w2: 두 번째 영역의 중심 좌표(x2)와 너비(w2)
  //   percent: 겹침을 판단할 때 고려할 백분율 (기본값: 1)
  overlap: (x1, w1, x2, w2, percent) => {
    // 백분율의 반을 계산하여 half 변수에 할당
    let half = (percent || 1) / 2;
    // 각 영역의 최소 및 최대 좌표 계산
    let min1 = x1 - (w1 * half);
    let max1 = x1 + (w1 * half);
    let min2 = x2 - (w2 * half);
    let max2 = x2 + (w2 * half);
    // 영역이 겹치지 않는 경우 true를 반환, 겹치면 false를 반환
    return !((max1 < min2) || (min1 > max2));
  },

  formatTime: (dt) => {
    let minutes = Math.floor(dt / 60);
    let seconds = Math.floor(dt - (minutes * 60));
    let tenths = Math.floor(10 * (dt - Math.floor(dt)));

    // 분, 초, 십분의 일초를 두 자리 숫자로 표시하여 문자열로 반환
    return (minutes < 10 ? "0" + minutes : minutes) + ":" +
      (seconds < 10 ? "0" + seconds : seconds) + ":" +
      (tenths < 10 ? "0" + tenths : tenths);
  }
}

//=========================================================================
// 애니메이션 프레임 요청을 위한 POLYFILL
//=========================================================================
if (!window.requestAnimationFrame) { // 만약 window.requestAnimationFrame이 정의되지 않았다면 대체 함수 설정
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
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
    // options.images => ["background", "sprites", "playerStraight", "playerLeft", "playerRight", "playerUphillStraight", "playerUphillLeft", "playerUphillRight"],
    Game.loadImages(options.images, images => {
      options.ready(images); // 이미지가 로드되었으므로 호출자에게 초기화하도록 알립니다

      Game.setKeyListener(options.keys);

      let update = options.update,    // 게임 로직을 업데이트하는 메서드는 호출자에서 제공됩니다
        render = options.render,    // 게임을 렌더링하는 메서드는 호출자에서 제공됩니다
        step = options.step,      // 고정 프레임 스텝 (1/fps)은 호출자에서 지정됩니다
        // stats  = options.stats,     // stats 인스턴스는 호출자에서 제공됩니다
        now = null,
        last = Util.timestamp(),
        dt = 0,
        gdt = 0;

      const frame = () => {
        now = Util.timestamp();
        dt = Math.min(1, (now - last) / 1000); // requestAnimationFrame을 사용하면 '휴면'상태로 들어갈 때 발생하는 큰 델타를 처리할 수 있어야 합니다
        gdt = gdt + dt;
        while (gdt > step) {
          gdt = gdt - step;
          update(step);
        }
        render();
        // stats.update();
        last = now;

        // setTimeout(() => {
        requestAnimationFrame(frame);
        // }, 1000 / 70);

      }
      frame(); // 파티 시작!
      // Game.playMusic();
    });
  },

  //---------------------------------------------------------------------------
  // 여러 이미지를 로드하고 모든 이미지가 로드된 경우 콜백하는 메서드
  loadImages: (names, callback) => {
    // 게임 초기화할 때 이미지를 로드하는 과정이 필요하다.
    // 이미지의 총 개수를 계산하고
    // 모든 이미지의 로드가 끝나면 모든 이미지를 담은 객체를 리턴한다.
    // 백그라운드와 스프라이트는 초기 선택한 맵에 따라서 로딩한다.


    const result = {}; // 이미지 엘리먼트를 저장할 배열

    // let count = names.length + 3;



    const setCount = () => {
      const getPlayerSpritesCount = () => {
        let tempCount = 0;
        PLAYER_SPRITE.NAMES.forEach(spriteName => {                    // 이미지 개수에 포함됨 
          PLAYER_SPRITE.ACTIONS.forEach(action => {                    // 이미지 개수에 포함됨
            const maxFrameCount = MAX_FRAME_COUNT[spriteName][action.name];
            tempCount += (maxFrameCount * 6) // 6 : PLAYER_SPRITE.DIRECTIONS.length
          })
        })
        return tempCount;
      }
      const getSpritesCount = () => {
        let tempCount = 0;
        console.log(gameStartData);
        Object.keys(MAP_SPRITE[gameStartData.selectMap]).forEach(spriteGroup => {
          tempCount += Object.keys(MAP_SPRITE[gameStartData.selectMap][spriteGroup]).length;
        })
        return tempCount;
      }
      const backgroundCount = Object.keys(BACKGROUND_SPRITE_FILE_NAME).length
      const spritesCount = getSpritesCount();
      const playerSpritesCount = getPlayerSpritesCount();
      const itemSpriteCount = 1

      return backgroundCount + spritesCount + playerSpritesCount + itemSpriteCount;
    }
    // 게임에 사용되는 이미지 개수 count
    let count = setCount() + 2; // 이펙트 테스트 이미지 2개


    // names => ["background", "sprites", "playerSpriteNames"]
    // const PLAYER_SPRITE.NAMES = [ "pug", "sheep", "pig", "cow", "llama", "horse", "zebra"]
    // 로드할 이미지의 총 개수
    // count += 3 // background
    // count += PLAYER_SPRITE.NAMES.length * PLAYER_SPRITE.ACTIONS.length * PLAYER_SPRITE.DIRECTIONS.length;       
    // SPRITES["pug"]["run"]["straight"].push({x,y,w,h});

    // 각 이미지가 로드될 때 실행될 콜백 함수
    const onload = () => {
      // console.log(count)
      if (--count === 0) {
        console.log(`모든 이미지 로드 완료!!`)
        callback(result); // 이미지 로드 카운트를 감소시키고, 모든 이미지가 로드되었을 때 콜백 함수 호출
      }
    };





    // 플레이어 스프라이트에 대한 정보를 가져와서 SPRITE객체에 이미지에 대한 정보를 저장하는 함수
    const setPlayerSprite = () => {
      // 모든 객체 in 객체 초기화 진행
      PLAYER_SPRITE.NAMES.forEach(spriteName => {
        SPRITES[spriteName] = {}
        result[spriteName] = {}
        PLAYER_SPRITE.ACTIONS.forEach(action => {
          SPRITES[spriteName][action.name] = {}
          result[spriteName][action.name] = {}
          PLAYER_SPRITE.DIRECTIONS.forEach(direction => {
            SPRITES[spriteName][action.name][direction] = []
          })
        })
      })
      // 이미지 객체 생성 및 저장
      PLAYER_SPRITE.NAMES.forEach(spriteName => {                    // 이미지 개수에 포함됨 
        PLAYER_SPRITE.ACTIONS.forEach(action => {                    // 이미지 개수에 포함됨
          PLAYER_SPRITE.DIRECTIONS.forEach(direction => {            // 이미지 개수에 포함됨
            const frameSize = 300; // 300px X 300px 고정사이즈로 정함
            // const totalFrames = action.frames;
            const maxFrameCount = MAX_FRAME_COUNT[spriteName][action.name];             // 이미지 개수에 포함됨
            for (let frameIndex = 0; frameIndex < maxFrameCount; frameIndex++) {
              // SPRITES.동물이름.액션[이름].방향 : [{x, y, w, h}, {x, y, w, h}, {x, y, w, h}]
              // SPRITES.spriteName[action.name].direction: [{x, y, w, h}, {x, y, w, h}, {x, y, w, h}]
              SPRITES[spriteName][action.name][direction].push({
                x: frameIndex * frameSize,
                y: 0, w: frameSize, h: frameSize
              });

              result[spriteName][action.name][direction] = document.createElement('img');

              if (result[spriteName][action.name][direction] !== null) {
                Dom.on(result[spriteName][action.name][direction], 'load', onload);
                result[spriteName][action.name][direction].src =
                  `/images/sheets/character/${spriteName}/${spriteName}_${action.name}_${direction}.png`;
              }
            }
          })
        })
      })
    }

    const setBackground = () => {
      const backgroundSprites = ['hills', 'sky', 'faraway'];
      backgroundSprites.forEach(name => {
        const fileName = BACKGROUND_SPRITE_FILE_NAME[name];   // 이미지 개수에 포함됨 
        result[name] = document.createElement('img');
        if (result[name] !== null) {
          Dom.on(result[name], 'load', onload);
          result[name].src = `/images/sheets/${gameStartData.selectMap}/background/${fileName}.png`
        }
      })
    }

    const setSprites = () => {
      // 객체 초기화
      Object.keys(MAP_SPRITE[gameStartData.selectMap]).forEach(spriteGroup => {
        // map은 한 게임에 무조건 1개이므로 굳이 구분하지 않는다.
        result[spriteGroup] = {};
      })
      // gameStartData.selectMap === 'map1'
      Object.keys(MAP_SPRITE[gameStartData.selectMap]).forEach(spriteGroup => {
        Object.keys(MAP_SPRITE[gameStartData.selectMap][spriteGroup]).forEach(spriteName => {
          result[spriteGroup][spriteName] = document.createElement('img');
          if (result[spriteGroup][spriteName] !== null) {
            Dom.on(result[spriteGroup][spriteName], 'load', onload);
            result[spriteGroup][spriteName].src = `/images/sheets/${gameStartData.selectMap}/sprites/${spriteName}.png`
          }
        })
      })
      // result[name] = document.createElement('img'); // 이미지 엘리먼트 생성 및 배열에 저장
      // Dom.on(result[name], 'load', onload); // 이미지 로드 이벤트에 onload 콜백 등록
      // // Dom.on(result[name], 'onerror', console.log(`error`));
      // // result[name].src = "/images/" + name + ".png"; // 이미지의 소스 경로 설정

      // result[name].src = images[`${name}`]; // important!!!! : react는 빌드 후 src내의 경로가 변경된다!!! 이미지 같은거 import 해서 사용하면 빌드된 경로를 알 수 있다. (onerror 이벤트리스너로 찾았음)



      // 아이템 스프라이트 로딩
      result['item'] = document.createElement('img');
      Dom.on(result['item'], 'load', onload);
      result['item'].src = `/images/itemImg/itemBox.png`

      // effect Imgae 로딩
      result['effect'] = [];
      result['effect'].push(document.createElement('img'));
      Dom.on(result['effect'][0], 'load', onload);
      result['effect'][0].src = `/images/sheets/speed_effect_1.png`

      result['effect'].push(document.createElement('img'));
      Dom.on(result['effect'][1], 'load', onload);
      result['effect'][1].src = `/images/sheets/speed_effect_2.png`
      console.log(result['effect']);
    }





    // 주어진 이미지 이름에 대해 이미지 엘리먼트를 생성하고 이벤트를 등록하는 루프
    for (let n = 0; n < names.length; n++) {
      // names <-- option.images: ["background", "sprites", "playerSpriteNames"],
      let name = names[n]; // 현재 이미지의 이름

      // 플레이어들에 대한 이미지 생성하기
      if (name === "playerSpriteNames") {
        setPlayerSprite();
      } else if (name === "background") {
        setBackground();
      } else if (name === "sprites") { // sprites
        setSprites();
      } else { console.log(`load images error: ${name}???`) }
    }
  },

  //---------------------------------------------------------------------------
  // 키 이벤트 리스너 설정
  setKeyListener: keys => {
    let onkey = (keyCode, mode) => {
      for (let n = 0; n < keys.length; n++) {
        let k = keys[n];
        k.mode = k.mode || 'up';
        if ((k.key === keyCode) || (k.keys && (k.keys.indexOf(keyCode) >= 0))) {
          if (k.mode === mode) {
            k.action.call();
          }
        }
      }
    };
    Dom.on(document, 'keydown', (ev) => { onkey(ev.keyCode, 'down'); });
    Dom.on(document, 'keyup', (ev) => { onkey(ev.keyCode, 'up'); });
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

    setInterval(() => {
      let fps = result.current();
      let ok = (fps > 50) ? 'good' : (fps < 30) ? 'bad' : 'ok';
      let color = (fps > 50) ? 'green' : (fps < 30) ? 'red' : 'gray';
      value.innerHTML = ok;
      value.style.color = color;
      msg.style.borderColor = color;
    }, 5000);
    return result;
  },

  //---------------------------------------------------------------------------

  // 음악 재생 메서드
  // playMusic: () => {
  //   let music = Dom.get('music');
  //   music.loop = true;
  //   music.volume = 0.05; // 소음을 줄이기 위해 볼륨을 낮춤
  //   music.muted = (Dom.storage.muted === "true");
  //   music.play();
  //   Dom.toggleClassName('mute', 'on', music.muted);
  //   Dom.on('mute', 'click', function() {
  //     Dom.storage.muted = music.muted = !music.muted;
  //     Dom.toggleClassName('mute', 'on', music.muted);
  //   });
  // }

}

//===============================================wl==========================
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
      lanew1, lanew2, lanex1, lanex2;

    // 잔디 영역 그리기
    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);

    // 도로 럼블 스트립 그리기
    Render.polygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    Render.polygon(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);
    // 도로 표시 영역 그리기
    Render.polygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    // 차선 표시 그리기
    if (color.lane) {
      lanew1 = w1 * 2 / lanes;
      lanew2 = w2 * 2 / lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for (let lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1 / 2, y1, lanex1 + l1 / 2, y1, lanex2 + l2 / 2, y2, lanex2 - l2 / 2, y2, color.lane);
    }

    // 안개 그리기
    Render.fog(ctx, 0, y1, width, y2 - y1, fog);
  },

  //---------------------------------------------------------------------------

  // 배경 그리기
  background: (ctx, background, width, height, layer, rotation, offset) => {
    // console.log(ctx, background, width, height, layer, rotation, offset)
    rotation = rotation || 0;
    offset = offset || 0;

    let imageW = layer.w / 2;
    let imageH = layer.h;

    let sourceX = layer.x + Math.floor(layer.w * rotation);
    let sourceY = layer.y
    let sourceW = Math.min(imageW, layer.x + layer.w - sourceX);
    let sourceH = imageH;

    let destX = 0;
    let destY = offset;
    let destW = Math.floor(width * (sourceW / imageW));
    let destH = height;

    ctx.drawImage(background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
    if (sourceW < imageW)
      ctx.drawImage(background, layer.x, sourceY, imageW - sourceW, sourceH, destW - 1, destY, width - destW, destH);
  },

  //---------------------------------------------------------------------------
  // 스프라이트 그리기
  sprite: (ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY) => {
    // 프로젝션에 상대적인 크기 및 roadWidth에 상대적인 크기 (토크 UI를 위해) 스케일 조정
    let destW = (sprite.w * scale * width / 2) * (SPRITES.SCALE * roadWidth);
    let destH = (sprite.h * scale * width / 2) * (SPRITES.SCALE * roadWidth);

    // offsetX 및 offsetY를 곱하여 위치 조정
    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));

    // clipY가 지정된 경우 적용하여 스프라이트를 잘라낸다
    let clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;
    if (clipH < destH)
      ctx.drawImage(
        sprites,             // 이미지 객체<img>~~~s<img>
        sprite.x, sprite.y,  // 소스 이미지의 위치
        sprite.w, sprite.h - (sprite.h * clipH / destH),  // 잘라낼 영역 크기
        destX, destY,        // 대상 캔버스에서의 위치
        destW, destH - clipH // 대상 캔버스에 그릴 크기 (잘라진 부분 제외)
      );
  },

  //---------------------------------------------------------------------------
  // 플레이어 차량 그리기 (단일 이미지 사용 가능하게 변경했음)
  player: (ctx, width, height, resolution, roadWidth, playerSprites, speedPercent, scale, destX, destY, steer, updown) => {
    // playerSprites[gameStartData.selectCharacter][action.name][direction] === <img></img>
    // 플레이어 차량이 움직일 때 바운스 효과 추가
    // let bounce = (1.5 * Math.random() * speedPercent * resolution) * Util.randomChoice([-1,1]);
    let bounce = 0;
    let imageObj = null
    let direction;
    let sprite;


    // SPRITES.동물이름.액션이름.방향 : [{x, y, w, h}, {x, y, w, h}, {x, y, w, h}]
    // SPRITES.spriteName[action.name].direction: [{x, y, w, h}, {x, y, w, h}, {x, y, w, h}]

    // playerSprites[gameStartData.selectCharacter][action.name][direction] === <img></img>

    // frameIndex[selectAction] = (frameIndex[selectAction] + 1) % totalsFrames[selectAction]; // 프레임idx 증가(최대 값 넘으면 0으로)

    // speedPercent에 따라 멈추기 걷기 달리기
    // if(speedPercent === 0) {
    //   selectAction = 'stop' 
    // } else if(speedPercent < 30 && speedPercent < 80) {
    //   selectAction = 'walk'
    // } else {
    //   selectAction = 'run' 
    // }

    // 프레임 업데이트(프레임 간격조정포함)
    // 현재프레임 = (현재프레임+1) % 최대프레임
    checkGameFrameCount %= frameInterval;
    if (checkGameFrameCount++ === 0)
      updateFrameIndex();






    // 조향에 따라 적절한 스프라이트 선택
    if (steer < 0) {          // 왼쪽
      if (updown > 0) direction = "uphill_left"
      else direction = "left"
    } else if (steer > 0) {   // 오른쪽
      if (updown > 0) direction = "uphill_right"
      else direction = "right"
    } else {                  // 가운데
      if (updown > 0) direction = "uphill_straight"
      else direction = "straight"
    }
    imageObj = playerSprites[gameStartData.selectCharacter][selectAction][direction]; // 이미지객체
    sprite = SPRITES[gameStartData.selectCharacter][selectAction][direction][frameIndex[gameStartData.selectCharacter][selectAction]] // 좌표 정보(잘라내기정보)
    // console.log(imageObj)
    // console.log(sprite)
    // 스프라이트 렌더링
    Render.sprite(ctx, width, height, resolution, roadWidth, imageObj, sprite, scale, destX, destY + bounce, -0.5, -1);
  },

  //---------------------------------------------------------------------------

  // 안개 그리기
  fog: (ctx, x, y, width, height, fog) => {
    if (fog < 1) {
      ctx.globalAlpha = (1 - fog)
      ctx.fillStyle = COLORS.FOG;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
    }
  },

  // 이펙트 그리기
  effect: (ctx, image, x, y, width, height) => {
    ctx.drawImage(image, x, y, width, height);
  },

  // 럼블 스트립 너비 계산
  rumbleWidth: (projectedRoadWidth, lanes) => { return projectedRoadWidth / Math.max(6, 2 * lanes); },
  // 차선 마커 너비 계산
  laneMarkerWidth: (projectedRoadWidth, lanes) => { return projectedRoadWidth / Math.max(32, 8 * lanes); }

}



export { Dom, Util, Game, Render, KEY, COLORS, BACKGROUND, SPRITES };