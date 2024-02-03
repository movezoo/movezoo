// // import { fps, step, width, height, centrifugal, skySpeed, hillSpeed, treeSpeed, skyOffset, hillOffset, treeOffset, segments, cars, stats, canvas, ctx, background, sprites, resolution, roadWidth, segmentLength, rumbleLength, trackLength, lanes, fieldOfView, cameraHeight, cameraDepth, drawDistance, playerX, playerZ, fogDensity, position, speed, maxSpeed, accel, breaking, decel, offRoadDecel, offRoadLimit, totalCars, currentLapTime, lastLapTime, keyLeft, keyRight, keyFaster, keySlower, hud
// // } from '/js/variables.js';

// // 세그먼트 배열이 비어있으면 0을 반환, 그렇지 않으면 마지막 세그먼트의 두 번째 점의 y 좌표 반환
// function lastY() { return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y; }

// function addSegment(curve, y) {
//   // 새로운 세그먼트를 배열에 추가
//   var n = segments.length;
//   segments.push({
//       index: n,
//           p1: { world: { y: lastY(), z:  n   *segmentLength }, camera: {}, screen: {} },
//           p2: { world: { y: y,       z: (n+1)*segmentLength }, camera: {}, screen: {} },
//       curve: curve,
//     sprites: [],
//         cars: [],
//       color: Math.floor(n/rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT
//   });
// }

// // 세그먼트에 스프라이트 추가
// function addSprite(n, sprite, offset) {
//   segments[n].sprites.push({ source: sprite, offset: offset });
// }

// // 도로 추가
// function addRoad(enter, hold, leave, curve, y) {
//   var startY   = lastY();
//   var endY     = startY + (Util.toInt(y, 0) * segmentLength);
//   var n, total = enter + hold + leave;
//   for(n = 0 ; n < enter ; n++)
//     addSegment(Util.easeIn(0, curve, n/enter), Util.easeInOut(startY, endY, n/total));
//   for(n = 0 ; n < hold  ; n++)
//     addSegment(curve, Util.easeInOut(startY, endY, (enter+n)/total));
//   for(n = 0 ; n < leave ; n++)
//     addSegment(Util.easeInOut(curve, 0, n/leave), Util.easeInOut(startY, endY, (enter+hold+n)/total));
// }

// // 도로의 다양한 측면을 정의하는 상수, 길이, 언덕 높이 및 커브 강도 등
// const ROAD = {
//   LENGTH: { NONE: 0, SHORT:  25, MEDIUM:   50, LONG:  100 },
//   HILL:   { NONE: 0, LOW:    20, MEDIUM:   40, HIGH:   60 },
//   CURVE:  { NONE: 0, EASY:    2, MEDIUM:    4, HARD:    6 }
// };

// /**
//  * 지정된 길이의 직선 도로 세그먼트를 추가합니다.
//  * @param {number} num - 직선 도로 세그먼트의 길이.
//  */
// function addStraight(num) {
//   num = num || ROAD.LENGTH.MEDIUM;
//   addRoad(num, num, num, 0, 0);
// }

// /**
//  * 지정된 길이와 높이의 언덕을 추가합니다.
//  * @param {number} num - 언덕의 길이.
//  * @param {number} height - 언덕의 높이.
//  */
// function addHill(num, height) {
//   num    = num    || ROAD.LENGTH.MEDIUM;
//   height = height || ROAD.HILL.MEDIUM;
//   addRoad(num, num, num, 0, height);
// }

// /**
//  * 지정된 길이, 커브 및 높이의 곡선 도로 세그먼트를 추가합니다.
//  * @param {number} num - 곡선 도로 세그먼트의 길이.
//  * @param {number} curve - 커브의 강도.
//  * @param {number} height - 언덕의 높이.
//  */
// function addCurve(num, curve, height) {
//   num    = num    || ROAD.LENGTH.MEDIUM;
//   curve  = curve  || ROAD.CURVE.MEDIUM;
//   height = height || ROAD.HILL.NONE;
//   addRoad(num, num, num, curve, height);
// }
    
// /**
//  * 지정된 길이 및 높이의 저 롤링 언덕 시퀀스를 추가합니다.
//  * @param {number} num - 언덕 시퀀스의 길이.
//  * @param {number} height - 언덕의 높이.
//  */
// function addLowRollingHills(num, height) {
//   num    = num    || ROAD.LENGTH.SHORT;
//   height = height || ROAD.HILL.LOW;
//   addRoad(num, num, num,  0,                height/2);
//   addRoad(num, num, num,  0,               -height);
//   addRoad(num, num, num,  ROAD.CURVE.EASY,  height);
//   addRoad(num, num, num,  0,                0);
//   addRoad(num, num, num, -ROAD.CURVE.EASY,  height/2);
//   addRoad(num, num, num,  0,                0);
// }

// /**
//  * S 모양 곡선의 시퀀스를 추가합니다.
//  */
// function addSCurves() {
//   addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
//   addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
//   addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
//   addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
//   addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
// }

// /**
//  * 도로에 덤핑이 추가된 시퀀스를 추가합니다.
//  */
// function addBumps() {
//   addRoad(10, 10, 10, 0,  5);
//   addRoad(10, 10, 10, 0, -2);
//   addRoad(10, 10, 10, 0, -5);
//   addRoad(10, 10, 10, 0,  8);
//   addRoad(10, 10, 10, 0,  5);
//   addRoad(10, 10, 10, 0, -7);
//   addRoad(10, 10, 10, 0,  5);
//   addRoad(10, 10, 10, 0, -2);
// }

// /**
//  * 지정된 길이의 하강하는 도로 세그먼트를 추가하여 끝까지 이어집니다.
//  * @param {number} num - 하강 도로 세그먼트의 길이.
//  */
// function addDownhillToEnd(num) {
//   num = num || 200;
//   addRoad(num, num, num, -ROAD.CURVE.EASY, -lastY()/segmentLength);
// }