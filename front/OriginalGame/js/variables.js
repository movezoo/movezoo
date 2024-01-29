// import { Dom, Util, Game, Render, KEY, COLORS, BACKGROUND, SPRITES } from '../common.js';
// var fps            = 60;                      // 초당 'update' 프레임 수
// var step           = 1/fps;                   // 각 프레임의 지속 시간 (초)
// var width          = 1024;                    // 논리적 캔버스 너비
// var height         = 768;                     // 논리적 캔버스 높이
// var centrifugal    = 0.3;                     // 커브를 돌 때 원심 힘의 배율
// var skySpeed       = 0.001;                   // 커브를 돌거나 오르막길을 올라갈 때 배경 하늘 레이어 스크롤 속도
// var hillSpeed      = 0.002;                   // 커브를 돌거나 오르막길을 올라갈 때 배경 언덕 레이어 스크롤 속도
// var treeSpeed      = 0.003;                   // 커브를 돌거나 오르막길을 올라갈 때 배경 나무 레이어 스크롤 속도
// var skyOffset      = 0;                       // 현재 하늘 스크롤 오프셋
// var hillOffset     = 0;                       // 현재 언덕 스크롤 오프셋
// var treeOffset     = 0;                       // 현재 나무 스크롤 오프셋
// var segments       = [];                      // 도로 세그먼트 배열
// var cars           = [];                      // 도로 상의 자동차 배열
// var stats          = Game.stats('fps');       // mr.doobs FPS 카운터
// var canvas         = Dom.get('canvas');       // 우리의 캔버스...
// var ctx            = canvas.getContext('2d'); // ...그리고 그림 컨텍스트
// var background     = null;                    // 배경 이미지 (아래에서 로드됨)
// var sprites        = null;                    // 스프라이트 시트 (아래에서 로드됨)
// var resolution     = null;                    // 해상도 독립성을 제공하기 위한 스케일링 팩터 (계산됨)
// var roadWidth      = 2000;                    // 사실상 도로의 반폭, 도로가 -roadWidth에서 +roadWidth로 이어지면 수학이 더 간단해짐
// var segmentLength  = 200;                     // 단일 세그먼트의 길이
// var rumbleLength   = 3;                       // 붉은색/흰색 럼블 스트립 당 세그먼트 수
// var trackLength    = null;                    // 전체 트랙의 z 길이 (계산됨)
// var lanes          = 3;                       // 차선 수
// var fieldOfView    = 100;                     // 시야각 (도)
// var cameraHeight   = 1000;                    // 카메라의 z 높이
// var cameraDepth    = null;                    // 화면으로부터 카메라까지의 z 거리 (계산됨)
// var drawDistance   = 300;                     // 그릴 세그먼트 수
// var playerX        = 0;                       // 도로 중심에서 플레이어 x 오프셋 (-1에서 1까지로 설정하여 roadWidth에 독립적으로 유지)
// var playerZ        = null;                    // 카메라로부터 플레이어의 상대적인 z 거리 (계산됨)
// var fogDensity     = 5;                       // 지수적 안개 밀도
// var position       = 0;                       // 현재 카메라 Z 위치 (playerZ를 더하여 플레이어의 절대 Z 위치를 얻음)
// var speed          = 0;                       // 현재 속도
// var maxSpeed       = segmentLength/step;      // 최대 속도 (충돌 감지를 쉽게 하기 위해 한 번에 1 세그먼트 이상 이동하지 않도록 함)
// var accel          =  maxSpeed/5;             // 가속률 - '그냥' 올바르게 느껴질 때까지 튜닝됨
// var breaking       = -maxSpeed;               // 감속률 (브레이킹할 때)
// var decel          = -maxSpeed/5;             // 가속 및 감속하지 않을 때 '자연스러운' 감속률
// var offRoadDecel   = -maxSpeed/2;             // 도로를 벗어났을 때의 감속률은 중간 정도
// var offRoadLimit   =  maxSpeed/4;             // 도로를 벗어났을 때의 감속률이 더 이상 적용되지 않는 한계 (예: 도로를 벗어나도 항상 이 속도 이상으로 이동할 수 있음)
// var totalCars      = 4;                     // 도로 상의 총 자동차 수
// var currentLapTime = 0;                       // 현재 랩 타임
// var lastLapTime    = null;                    // 마지막 랩 타임

// var keyLeft        = false;
// var keyRight       = false;
// var keyFaster      = false;
// var keySlower      = false;

// var hud = {
//   speed:            { value: null, dom: Dom.get('speed_value')            },
//   current_lap_time: { value: null, dom: Dom.get('current_lap_time_value') },
//   last_lap_time:    { value: null, dom: Dom.get('last_lap_time_value')    },
//   fast_lap_time:    { value: null, dom: Dom.get('fast_lap_time_value')    }
// }

// export {
//   fps,
//   step,
//   width,
//   height,
//   centrifugal,
//   skySpeed,
//   hillSpeed,
//   treeSpeed,
//   skyOffset,
//   hillOffset,
//   treeOffset,
//   segments,
//   cars,
//   stats,
//   canvas,
//   ctx,
//   background,
//   sprites,
//   resolution,
//   roadWidth,
//   segmentLength,
//   rumbleLength,
//   trackLength,
//   lanes,
//   fieldOfView,
//   cameraHeight,
//   cameraDepth,
//   drawDistance,
//   playerX,
//   playerZ,
//   fogDensity,
//   position,
//   speed,
//   maxSpeed,
//   accel,
//   breaking,
//   decel,
//   offRoadDecel,
//   offRoadLimit,
//   totalCars,
//   currentLapTime,
//   lastLapTime,
//   keyLeft,
//   keyRight,
//   keyFaster,
//   keySlower,
//   hud
// }