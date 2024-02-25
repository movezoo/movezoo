/* eslint-disable */
// import io from "socket.io-client";
import { useRef, useEffect, useState } from 'react'
import { Util, Game, Render, KEY, COLORS, BACKGROUND, SPRITES } from './common.js';
import { MAX_FRAME_COUNT, PLAYER_SPRITE, MAP_SPRITE, ITEM_SPRITE, EFFECT, ITEM } from './gameConstants.js';
import { data, myGameData, playerGameDataList, playerCount, gameStartData } from './data.js';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

import {
  gameCurrentTimeState, 
  gameMyItemLeftState, 
  gameMyItemRightState, 
  gameStartCountState, 
  gameEndCountState, 
  singleResultState,
  isLoadGameState,
  isLoadDetectState,
  isGameEndState,
  isMultiGameStartState,
  playGameModeState
} from '../state/gameState.js'
import { selectCharacterState } from '../state/state.js'

const localStorage = window.localStorage || {};

const Main = (props) => {
  const { setPage } = props;
  // useState
  const [testSpeed, setTestSpeed] = useState(0);
  const [testLastLapTime, setTestLastLapTime] = useState(0);


  // useRecoilState
  const [testCurrentLapTime, setTestCurrentLapTime] = useRecoilState(gameCurrentTimeState);
  const [gameMyItemLeft, setGameMyItemLeft] = useRecoilState(gameMyItemLeftState);
  const [gameMyItemRight, setGameMyItemRight] = useRecoilState(gameMyItemRightState);
  const [gameStartCount, setGameStartCount] = useRecoilState(gameStartCountState);
  const [gameEndCount, setGameEndCount] = useRecoilState(gameEndCountState);
  const [singleResult, setSingleResult] = useRecoilState(singleResultState);
  const [selectCharacter] = useRecoilState(selectCharacterState);
  const [isLoadGame, setIsLoadGame] = useRecoilState(isLoadGameState);
  const [isLoadDetect, setIsLoadDetect] = useRecoilState(isLoadDetectState);
  const [isGameEnd, setIsGameEnd] = useRecoilState(isGameEndState);
  const [isMultiGameStart, setIsMultiGameStart] = useRecoilState(isMultiGameStartState);
  const [playGameMode, setPlayGameMode] = useRecoilState(playGameModeState);

  const navigate = useNavigate();
  const canvasRef = useRef(null)


  // 멀티에서 나의 게임 로딩 여부 전달하기 위한 데이터 저장
  useEffect(() => {
    if(isLoadGame && isLoadDetect) myGameData.loadSuccess = true;
  }, [isLoadGame, isLoadDetect])



  // 게임 시작신호
  useEffect(() => {
    if(playGameMode === 'single' && isLoadGame && isLoadDetect) {
      let count = 4; // 실제로 3초부터 출력함
      const playCount = setInterval(() => {
        count-=1;
        setGameStartCount(count);
        if(count === 0) {
          clearInterval(playCount)
          data.isGameStart = true;    
        }
      }, 1000);
    } else if(playGameMode === 'multi' && isMultiGameStart) {
      let count = 4; // 실제로 3초부터 출력함
      setTimeout(() => {
        const playCount = setInterval(() => {
          count-=1;
          setGameStartCount(count);
          if(count === 0) {
            clearInterval(playCount)
            data.isGameStart = true;    
          }
        }, 1000);
      }, 2000); // 3초 뒤에 시작
    }
  },[isLoadGame, isLoadDetect, isMultiGameStart])

  useEffect(() => {
    // 선택된 캐릭터
    
    console.log(`loading 초기화`)
    const selectMap = gameStartData.selectMap;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let checkGameFrameCount = 0;

    // 이펙트를 위한 애니메이션 프레임 인덱스 초기화
    const effectFrameIndex = {}
    // effectFrameIndex 초기화
    Object.keys(EFFECT).forEach(effectName => {
      effectFrameIndex[effectName] = 0;
    })
    // 이펙트를 위한 애니메이션 프레임 증가 함수
    const updateEffectFrameIndex = (effectName, frameInterval = 1) => {
      if(checkGameFrameCount % frameInterval === 0)
        effectFrameIndex[effectName] = (effectFrameIndex[effectName] + 1) % EFFECT[effectName].frameCount;
    }

    
    let itemLeft = '';
    let itemRight = '';
    let isStopControl = false;

    // View 관련 설정 변수
    let roadWidth      = 2000;                    // 사실상 도로의 반폭, 도로가 -roadWidth에서 +roadWidth로 이어지면 수학이 더 간단해짐
    let cameraHeight   = 1000;                    // 카메라의 z 높이
    let drawDistance   = 300;                     // 그릴 세그먼트 수
    let fieldOfView    = 100;                     // 시야각 (도)
    let fogDensity     = 5;                       // 지수적 안개 밀도


    let fps            = 60;                      // 초당 'update' 프레임 수
    let step           = 1/fps;                   // 각 프레임의 지속 시간 (초)
    let width          = props.width;                    // 논리적 캔버스 너비
    let height         = props.height;                     // 논리적 캔버스 높이
    let centrifugal    = 0.3;                     // 커브를 돌 때 원심 힘의 배율
    // let offRoadDecel   = 0.99;                    // 도로를 벗어났을 때의 속도 배율 (예: 각 업데이트 프레임마다 속도가 2% 감소)
    let skySpeed       = 0.001;                   // 커브를 돌거나 오르막길을 올라갈 때 배경 하늘 레이어 스크롤 속도
    let hillSpeed      = 0.002;                   // 커브를 돌거나 오르막길을 올라갈 때 배경 언덕 레이어 스크롤 속도
    let treeSpeed      = 0.003;                   // 커브를 돌거나 오르막길을 올라갈 때 배경 나무 레이어 스크롤 속도
    let skyOffset      = 0;                       // 현재 하늘 스크롤 오프셋
    let hillOffset     = 0;                       // 현재 언덕 스크롤 오프셋
    let treeOffset     = 0;                       // 현재 나무 스크롤 오프셋
    let segments       = [];                      // 도로 세그먼트 배열
    let cars           = [];                      // 도로 상의 자동차 배열
    // let stats          = Game.stats('fps');       // mr.doobs FPS 카운터
    // let canvas         = Dom.get('canvas');       // 우리의 캔버스...
    // let ctx            = canvas.getContext('2d'); // ...그리고 그림 컨텍스트
    let background     = {};                      // 배경 이미지 (아래에서 로드됨)
    let effect = {};
    let sprites        = null;                    // 스프라이트 시트 loadImages 객체
    let playerSprites  = {};

    let resolution     = null;                    // 해상도 독립성을 제공하기 위한 스케일링 팩터 (계산됨)
    let segmentLength  = 200;                     // 단일 세그먼트의 길이
    let rumbleLength   = 3;                       // 붉은색/흰색 럼블 스트립 당 세그먼트 수
    let trackLength    = null;                    // 전체 트랙의 z 길이 (계산됨)
    let lanes          = 4;                       // 차선 수
    let cameraDepth    = null;                    // 화면으로부터 카메라까지의 z 거리 (계산됨)
    let playerX        = 0;                       // 도로 중심에서 플레이어 x 오프셋 (-1에서 1까지로 설정하여 roadWidth에 독립적으로 유지)
    let playerZ        = null;                    // 카메라로부터 플레이어의 상대적인 z 거리 (계산됨)
    let position       = 0;                       // 현재 카메라 Z 위치 (playerZ를 더하여 플레이어의 절대 Z 위치를 얻음)
    let speed          = 0;                       // 현재 속도
    // let maxSpeed       = segmentLength/step - 4000;      // 최대 속도 (충돌 감지를 쉽게 하기 위해 한 번에 1 세그먼트 이상 이동하지 않도록 함) 200 / ( 1/60 ) = 12000
    let maxSpeed       = 8000;
    let accel          =  maxSpeed/5;             // 가속률 - '그냥' 올바르게 느껴질 때까지 튜닝됨
    let breaking       = -maxSpeed;               // 감속률 (브레이킹할 때)
    let decel          = -maxSpeed/5;             // 가속 및 감속하지 않을 때 '자연스러운' 감속률
    let offRoadDecel   = -maxSpeed/2;             // 도로를 벗어났을 때의 감속률은 중간 정도
    let offRoadLimit   =  maxSpeed/4;             // 도로를 벗어났을 때의 감속률이 더 이상 적용되지 않는 한계 (예: 도로를 벗어나도 항상 이 속도 이상으로 이동할 수 있음)
    // let totalCars      = 2;                       // 도로 상의 총 자동차 수, 플레이어의 수
    let currentLapTime = 0;                       // 현재 랩 타임
    let lastLapTime    = null;                    // 마지막 랩 타임
    
    let keyLeft        = data.isLeftKeyPressed;
    let keyRight       = data.isRightKeyPressed;
    // let keyFaster      = data.isRun;
    // let keySlower      = data.isBreak;
    
    const hud = {
      speed: null,
      current_lap_time: null,
      last_lap_time: null,
      fast_lap_time: null
    }


    let isMultiGameEndCountStart = false;
    // =========================================================================
    // UPDATE THE GAME WORLD
    // =========================================================================
    const update = (dt) => {

      // gameStartData.mode = playGameMode; // 게임모드 세팅
      // gameStartData.selectMap = JSON.parse(localStorage.getItem('userData'))?.selectedMapName;
      // gameStartData.selectCharacter = JSON.parse(localStorage.getItem('userData'))?.selectedCharacterName;

      // 멀티 게임이 시작되지 않았다면?
      if(!isMultiGameStart && gameStartData.mode === 'multi' ) {
        let readyAll = true;
        playerGameDataList.forEach(userData => {
          readyAll = readyAll && userData.loadSuccess;
        });
        if(readyAll) setIsMultiGameStart(true);
      }
      

      // 카운트를 시작한적이 없고, 멀티게임 누군가 통과했다면(계속확인함)
      if(!isMultiGameEndCountStart) {
        if(playerGameDataList.length !== 0) {
          playerGameDataList.forEach(userData => {
            if(userData.lapTime !== '') {
              multiGameEndCount();
              isMultiGameEndCountStart = true;
              return false;
            }
          })
        }
      }




      // dt === step(1/60)
      keyLeft        = data.isLeftKeyPressed;
      keyRight       = data.isRightKeyPressed;

      myGameData.userX = playerX;
      myGameData.userZ = position + playerZ;

      // 플레이어 캐릭터 애니메이션 프레임 업데이트
      updatePlayerFrame();

      
      for (let i = 0; i < playerGameDataList.length; i++) {
        const playerGameData = playerGameDataList[i];
        // 나의 데이터는 정확한 데이터가 아니므로 receive 할 필요 없다.
        if(!playerGameData || myGameData.playerId === playerGameData.playerId) continue;
        
        // 갱신
        playerGameDataList[i] = playerGameData;
        // console.log(`${i}번의 데이터 갱신!!`)
      }
    
      let car, carW, sprite, spriteW, item, itemW;
      let playerSegment = findSegment(position+playerZ);
      let playerW       = SPRITES.PLAYER_STRAIGHT.w * SPRITES.SCALE;
      let speedPercent  = speed/maxSpeed;
      let dx            = dt * 2 * speedPercent; // 최고 속도의 경우, 1초 안에 왼쪽에서 오른쪽으로 (-1 ~ 1) 횡단할 수 있어야 합니다.
      let startPosition = position;
    
      updateCars(dt, playerSegment, playerW);
      position = Util.increase(position, dt * speed, trackLength);
      
      // 키 조작에 따른 플레이어 위치 업데이트
      // dx *= (data.centerDistance/5000 * data.sensitivity);
      // dx = dx < 0.05 ? dx : 0.05;
    
      // 게임이 끝나면 조향이 되지 않는다.
      if (!isStopControl) {
        if (keyLeft)
          playerX = playerX - dx;
        else if (keyRight)
          playerX = playerX + dx; 

        playerX = playerX - (dx * speedPercent * playerSegment.curve * centrifugal);
      }
      
      // 가속, 감속 및 정지 등 속도 관리
      // if (keyFaster) {
      if (data.isRun) {
        speed = Util.accelerate(speed, accel, dt);
        setTestSpeed(Util.accelerate(testSpeed, accel, dt));
      }
      // else if (keySlower) {
      else if (data.isBreak) {
        speed = Util.accelerate(speed, breaking, dt);
        setTestSpeed(Util.accelerate(testSpeed, breaking, dt));
      }
      else {
        speed = Util.accelerate(speed, decel, dt);
        setTestSpeed(Util.accelerate(testSpeed, decel, dt));
      }
    
      // 플레이어 위치가 경계를 벗어나면 처리
      if ((playerX < -1) || (playerX > 1)) {
    
        if (speed > offRoadLimit) {
          speed = Util.accelerate(speed, offRoadDecel, dt);
          setTestSpeed(Util.accelerate(testSpeed, offRoadDecel, dt));
        }
    
        // 스프라이트와의 충돌 확인
        for(let n = 0 ; n < playerSegment.sprites.length ; n++) {
          sprite  = playerSegment.sprites[n];      // 현재 선택된 스프라이트
          spriteW = sprite.size.w * SPRITES.SCALE; // 스프라이트의 너비 계산

          // 겹치는지 확인
          if (Util.overlap(playerX, playerW, sprite.offset + spriteW/2 * (sprite.offset > 0 ? 1 : -1), spriteW)) {
            speed = maxSpeed/5; // 플레이어의 속도를 최대 속도/5로 조정
            setTestSpeed(maxSpeed/5)
            position = Util.increase(playerSegment.p1.world.z, -playerZ, trackLength); // 스프라이트 앞(세그먼트 앞)에서 멈춥니다
            break;
          }
        }
      }
    
      // 앞에 있는 차량과의 충돌 확인
      for(let n = 0 ; n < playerSegment.cars.length ; n++) {
        car  = playerSegment.cars[n];
        carW = car.sprite.w * SPRITES.SCALE;
        if (speed > car.speed) {
          if (Util.overlap(playerX, playerW, car.offset, carW, 0.8)) {
            speed    = car.speed * (car.speed/speed);
            setTestSpeed(car.speed * (car.speed/testSpeed))
            position = Util.increase(car.z, -playerZ, trackLength);
            break;
          }
        }
      }


      // segments[n].items.push({
      //   size: ITEM_SPRITE,
      //   offset: offset
      // });
      // 아이템과 충돌시
      for(let n = 0; n < playerSegment.items.length; n++) {
        item = playerSegment.items[n];
        itemW = item.size.w * SPRITES.SCALE;
        // 겹치는지 확인
        if (Util.overlap(playerX, playerW, item.offset, itemW, 1)) {
          // 아이템 제거
          let z = playerSegment.index;
          segments[z].items.splice(n, 1); // n번째 아이템 제거
          
          // 아이템칸이 비어있을 때 랜덤 아이템 획득
          if(itemLeft === '') {
            itemLeft = Util.randomChoice(Object.keys(ITEM));
            setGameMyItemLeft(itemLeft)
          } else {
            if(itemRight === '') {
              itemRight = Util.randomChoice(Object.keys(ITEM));
              setGameMyItemRight(itemRight)
            }
          }

          break;
        }
      }
      
      
      
      



    
      // 플레이어 위치와 속도 제한
      playerX = Util.limit(playerX, -3, 3);     // 너무 멀리 나가지 않도록
      speed   = Util.limit(speed, 0, maxSpeed); // maxSpeed를 초과하지 않도록
      setTestSpeed(Util.limit(speed, 0, maxSpeed));
    
      // 화면 스크롤 오프셋 조절
      skyOffset  = Util.increase(skyOffset,  skySpeed  * playerSegment.curve * (position-startPosition)/segmentLength, 1);
      hillOffset = Util.increase(hillOffset, hillSpeed * playerSegment.curve * (position-startPosition)/segmentLength, 1);
      treeOffset = Util.increase(treeOffset, treeSpeed * playerSegment.curve * (position-startPosition)/segmentLength, 1);
    
      // 게임 종료
      // 현재 랩 타임 업데이트 및 최고 랩 타임 확인
      if (position > playerZ) {
        if (currentLapTime && (startPosition < playerZ)) {
          // useState로 변경
          setTestLastLapTime(currentLapTime);
          setTestCurrentLapTime(0);
          lastLapTime    = currentLapTime;
          currentLapTime = 0;
          gameEnd(); // 게임종료 로직실행

          if (lastLapTime <= Util.toFloat(localStorage.fast_lap_time)) {
            localStorage.fast_lap_time = lastLapTime;
            updateHud('fast_lap_time', formatTime(lastLapTime));
          }
          else {
          }
          updateHud('last_lap_time', formatTime(lastLapTime));
          // Dom.show('last_lap_time');
        }
        else {
          currentLapTime += dt;
          setTestCurrentLapTime(currentLapTime);
        }
      }
    
      // HUD 업데이트
      updateHud('speed',            5 * Math.round(speed/500));
      updateHud('current_lap_time', formatTime(currentLapTime));
      // Test


      updateUseItem();
    }

    const gameEnd = () => {
      isStopControl = true; // 일단 통과하면 컨트롤은 중지된다.

      if(gameStartData.mode === 'single') {
        let count = 4; // 실제로 3초부터 출력함
        setGameEndCount(count);
        const playCount = setInterval(() => {
          count-=1;
          setGameEndCount(count);
          if(count === 0) {
            // 여기서 게임을 완전 종료 시켜줘야 함
            clearInterval(playCount)
            data.isGameEnd = true;
            setIsGameEnd(true); // 재렌더링을 위한 state 변경
            goResult();
          }
        }, 1000);
      } else if(gameStartData.mode === 'multi') {
        // 해당 로직은 유저가 골라인을 통과했을 때 실행된다.
        // 따라서 아래와 같이 조건에 따라 다르게 처리해줘야 한다.

        // 1. 가장먼저 골인한 사람인지? -> 카운트를 실행시킨다.
        // 2. 카운트다운 중에 들어갔는지? -> 카운트를 실행시키지 않는다. 

        // 일단 골인했으니 기록을 저장한다. (계속 공유함)
        // myGameData.lapTime = formatTime(lastLapTime);
        myGameData.lapTime = lastLapTime;

        // playerGameDataList.forEach(gameData => {
        //   // 나를 제외한 사람이 랩타임이 없는지 확인
        //   if(myGameData.playerId !== gameData.playerId && gameData.lapTime === '') {
        //     isFirstGoal = true;
        //   }
        // })
        // if(isFirstGoal) {

        // } 
      }

    }


    // 멀티게임은 동시에 카운트를 위해 조건부 호출로 따로 실행한다.
    const multiGameEndCount = () => {
      let count = 10; // 실제로 3초부터 출력함
      setGameEndCount(count);
      const playCount = setInterval(() => {
        count-=1;
        setGameEndCount(count);
        // console.log(count);
        if(count === 0) {
          // 여기서 게임을 완전 종료 시켜줘야 함
          clearInterval(playCount)
          data.isGameEnd = true;
          setIsGameEnd(true);
          goResult();
        }
      }, 1000);
    }

    const goResult = () => {
      setSingleResult({
        // time: formatTime(lastLapTime)
        time: lastLapTime
      })
      if (gameStartData.mode === 'single') {
        navigate('/single/result');
      } else if(gameStartData.mode === 'multi') {
        setPage(4); // multi result 화면으로 이동
      }
    }
    


    const updateUseItem = () => {
      // 왼쪽 아이템 사용
      if (data.isLeftItemUse) {
        // console.log(`useItem Left`);
        useItem(itemLeft);
        itemLeft = ''
        setGameMyItemLeft(itemLeft);
      // 오른쪽 아이템 사용
      } else if(data.isRightItemUse) {
        // console.log(`useItem Right`);
        useItem(itemRight);
        itemRight = ''
        setGameMyItemRight(itemRight);
      }
    }

    const useItem = item => {

      // 아이템1. 속도 증가 아이템!!
      if(item === 'speedup') {
        // maxSpeed를 12000으로 증가 후
        maxSpeed = 12000;
        // console.log(`maxSpeed : ${maxSpeed}`)
        // 5초 뒤에 서서히 8000으로 줄어 들게 한다.
        setTimeout(() => {
          const returnSpeed = setInterval(() => {
            maxSpeed -= 500;
            // console.log(`maxSpeed : ${maxSpeed}`)
            if(maxSpeed <= 8000) {
              maxSpeed = 8000; // 혹시몰라서 8000으로 다시 설정
              clearInterval(returnSpeed);
            }
          }, 500);
        }, 5000);
      }

      // 아이템2. 
      else {

      }

    }





    //-------------------------------------------------------------------------
    
    const updateCars = (dt, playerSegment, playerW) => {
      let car, oldSegment, newSegment;
      for(let n = 0 ; n < cars.length ; n++) {
        const playerData = playerGameDataList[n];
        // console.log(`playerGameData`);
        // console.log(playerGameData);
        if (!playerData || myGameData.playerId === playerData.playerId) continue; // 나의 플레이어 번호이면?

        
        // car = { offset, z, sprite, speed, playerId, character };
        car         = cars[n]; // 
        oldSegment  = findSegment(car.z);
        // car.offset  = car.offset + updateCarOffset(car, oldSegment, playerSegment, playerW); // playerW를 피해서 가도록 offset
        car.offset  = playerData.userX
        // car.z       = Util.increase(car.z, dt * car.speed, trackLength);
        car.z       = playerData.userZ;
        car.percent = Util.percentRemaining(car.z, segmentLength); // 세그먼트 길이에 따른 자동차의 퍼센트 업데이트 (렌더링 단계에서 보간에 유용)
        newSegment  = findSegment(car.z);
        

        // if(playerGameData.playerId === undefined) console.log(`playerGameData.playerId : ${playerGameData.playerId}`)
        car.playerId = playerGameDataList[n].playerId
        car.playerCharacter = playerGameDataList[n].playerCharacter;


        // console.log(car);
        // console.log(`newSegment : ${newSegment}`)
        if (oldSegment !== newSegment) {
          // 이전 세그먼트에서 자동차 제거
          let index = oldSegment.cars.indexOf(car);
          oldSegment.cars.splice(index, 1);
          // 새로운 세그먼트에 자동차 추가
          newSegment.cars.push(car);
        }
      }
      // 출력
      // console.log("cars[0].z : " + (cars[0].z / 1000).toFixed(1) + "m");
      // console.log("cars[0].offset : " + cars[0].offset);
    
    }
    
    // const updateCarOffset = (car, carSegment, playerSegment, playerW) => {
    //   let dir, segment, otherCar, otherCarW, lookahead = 20, carW = car.sprite.w * SPRITES.SCALE;
    
    //   // 최적화, 플레이어가 '보이지 않을 때' 다른 차를 운전하는 데 신경 쓰지 마십시오
    //   if ((carSegment.index - playerSegment.index) > drawDistance)
    //     return 0;
    
    //   for(let i = 1 ; i < lookahead ; i++) {
    //     segment = segments[(carSegment.index+i)%segments.length];
    
    //     // 만약 다가오는 세그먼트가 플레이어의 현재 세그먼트이고, 차의 속도가 플레이어의 속도보다 높고, 차와 플레이어가 서로 겹칠 경우
    //     if ((segment === playerSegment) && (car.speed > speed) && (Util.overlap(playerX, playerW, car.offset, carW, 1.2))) {
    //       // 플레이어의 위치에 따라 방향 결정
    //       if (playerX > 0.5)
    //         dir = -1;
    //       else if (playerX < -0.5)
    //         dir = 1;
    //       else
    //         dir = (car.offset > playerX) ? 1 : -1;
    
    //       // 차의 위치 조절을 위한 값을 반환
    //       return dir * 1/i * (car.speed-speed)/maxSpeed; // 차가 가까울수록(smaller i) 속도비가 증가할수록 오프셋이 커집니다
    //     }
    
    //     for(let j = 0 ; j < segment.cars.length ; j++) {
    //       otherCar  = segment.cars[j];
    //       otherCarW = otherCar.sprite.w * SPRITES.SCALE;
    
    //       // 만약 차의 속도가 다가오는 다른 차의 속도보다 높고, 두 차가 서로 겹칠 경우
    //       if ((car.speed > otherCar.speed) && Util.overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
    
    //         // 다른 차의 위치에 따라 방향 결정
    //         if (otherCar.offset > 0.5)
    //           dir = -1;
    //         else if (otherCar.offset < -0.5)
    //           dir = 1;
    //         else
    //           dir = (car.offset > otherCar.offset) ? 1 : -1;
    
    //         // 차의 위치 조절을 위한 값을 반환
    //         return dir * 1/i * (car.speed-otherCar.speed)/maxSpeed;
    //       }
    //     }
    //   }
    
    //   // 만약 앞에 차가 없지만 어떻게든 도로를 벗어났다면 다시 돌아가도록 합니다.
    //   if (car.offset < -0.9)
    //     return 0.1;
    //   else if (car.offset > 0.9)
    //     return -0.1;
    //   else
    //     return 0;
    // }
    
    // -------------------------------------------------------------------------
    




    const updateHud = (key, value) => {
      // DOM 접근은 느릴 수 있으므로 값이 변경되었을 때만 수행합니다.
      if (hud[key] !== value) {
        hud[key] = value;
        // Dom.set(hud[key].dom, value);
      }
    }
    







    const updatePlayerFrame = () => {
      playerGameDataList.forEach((data) => {
        // console.log(`${data.playerCharacter}'s frame : ${data.frameIndex}`)
        const maxFrame = MAX_FRAME_COUNT[data.playerCharacter]['run'] // 프레임 개수
        // index는 항상 프레임 개수보다 작아야 함(최대 maxFrame-1)
        data.frameIndex = data.frameIndex + 1 < maxFrame ? data.frameIndex + 1 : 0;
      })
    }
    








    //=========================================================================
    // RENDER THE GAME WORLD
    //=========================================================================
    const render = () => {
      checkGameFrameCount++;
      checkGameFrameCount %= fps;
      // 초기화
      let baseSegment   = findSegment(position);
      let basePercent   = Util.percentRemaining(position, segmentLength);
      let playerSegment = findSegment(position+playerZ);
      let playerPercent = Util.percentRemaining(position+playerZ, segmentLength);
      let playerY       = Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
      let maxy          = height;
    
      let x  = 0;
      let dx = - (baseSegment.curve * basePercent);
    
      // 캔버스 클리어
      ctx.clearRect(0, 0, width, height);
    
      // 배경 렌더링
      Render.background(ctx, background.sky, width, height, BACKGROUND.SKY,   skyOffset,  resolution * skySpeed  * playerY);
      Render.background(ctx, background.hills, width, height, BACKGROUND.HILLS, hillOffset, resolution * hillSpeed * playerY);
      Render.background(ctx, background.faraway, width, height, BACKGROUND.FARAWAY, treeOffset, resolution * treeSpeed * playerY);

      
    
      let segment, car, sprite, spriteScale, spriteX, spriteY, item, itemScale, itemX, itemY;
      
      // 루프를 통해 화면에 그려질 세그먼트 수만큼 반복
      for(let n = 0 ; n < drawDistance ; n++) {
        segment        = segments[(baseSegment.index + n) % segments.length];
        segment.looped = segment.index < baseSegment.index;
        segment.fog    = Util.exponentialFog(n/drawDistance, fogDensity);
        segment.clip   = maxy;
    
        // 3D 좌표를 화면 좌표로 변환
        Util.project(segment.p1, (playerX * roadWidth) - x,      playerY + cameraHeight, position - (segment.looped ? trackLength : 0), cameraDepth, width, height, roadWidth);
        Util.project(segment.p2, (playerX * roadWidth) - x - dx, playerY + cameraHeight, position - (segment.looped ? trackLength : 0), cameraDepth, width, height, roadWidth);
    
        x  = x + dx;
        dx = dx + segment.curve;
    
        // 화면에 그려질 세그먼트 영역을 벗어나는 경우 skip
        if ((segment.p1.camera.z <= cameraDepth)         || // 화면 뒤에 있는 경우
            (segment.p2.screen.y >= segment.p1.screen.y) || // 뒷면 가림
            (segment.p2.screen.y >= maxy))                  // 이미 렌더링된 언덕에 의해 클립되는 경우
          continue;
    
        // 세그먼트 렌더링
        Render.segment(ctx, width, lanes,
                        segment.p1.screen.x,
                        segment.p1.screen.y,
                        segment.p1.screen.w,
                        segment.p2.screen.x,
                        segment.p2.screen.y,
                        segment.p2.screen.w,
                        segment.fog,
                        segment.color);
    
        maxy = segment.p1.screen.y;
      }
    

      // segments 데이터 참고용 주석
      //   segments.push({
      //     index: n,
      //         p1: { world: { y: lastY(), z:  n   *segmentLength }, camera: {}, screen: {} },
      //         p2: { world: { y: y,       z: (n+1)*segmentLength }, camera: {}, screen: {} },
      //     curve: curve,
      //   sprites: [],
      //       cars: [],
      //     color: Math.floor(n/rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT
      // });
      









      // 세그먼트 데이터 렌더링
      for(let n = (drawDistance-1) ; n > 0 ; n--) {
        segment = segments[(baseSegment.index + n) % segments.length];
      


        // 세그먼트에 있는 차량 렌더링
        for(let i = 0 ; i < segment.cars.length ; i++) {
          // car = { offset, z, sprite, speed, playerId, character };
          car         = segment.cars[i];
          // sprite      = car.sprite;
          if(car.playerId === '') continue; // playerId가 아직 갱신이 되지 않았다면 continue
          // console.log(sprites);
          let playerFrameIndex = getPlayerFrameIndex(car.playerId);
          // console.log(`${car.playerCharacter}'s Frame : ${playerFrameIndex}`)
          // try {
            sprite      = SPRITES[car.playerCharacter]['run']['straight'][playerFrameIndex] // x, y, h, w
          // } catch {
            // console.log(`${car.playerCharacter}'s frame : ${playerFrameIndex}`);
            // console.log(segment);
          // }
          // if (!sprite) {
            // console.log(`${car.playerCharacter}'s frame : ${playerFrameIndex}`);
            // continue;
          // }
          let curSpriteObj = sprites[car.playerCharacter]['run']['straight'] // 이미지객체
          spriteScale = Util.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
          spriteX     = Util.interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (spriteScale * car.offset * roadWidth * width/2);
          spriteY     = Util.interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
                                                                
          // 참고용 주석 // curSpriteObj : 이미지 , sprite : 이미지크기
          // sprites[spriteName][action.name][direction] <== <img></img>
          // Render.sprite(ctx, width, height, resolution, roadWidth, sprites, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
          Render.sprite(ctx, width, height, resolution, roadWidth, curSpriteObj, sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
        }
    


        // 세그먼트에 있는 스프라이트 렌더링 
        for(let i = 0 ; i < segment.sprites.length ; i++) {
          sprite      = segment.sprites[i];
          spriteScale = segment.p1.screen.scale;
          spriteX     = segment.p1.screen.x + (spriteScale * sprite.offset * roadWidth * width/2);
          spriteY     = segment.p1.screen.y;
          let curSpriteObj = sprites[sprite.spriteGroup][sprite.spriteName];
          // console.log(sprite);
          Render.sprite(ctx, width, height, resolution, roadWidth, curSpriteObj, sprite.size, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
        }
        
    

        // 플레이어가 속한 세그먼트인 경우 플레이어 렌더링 
        if (segment === playerSegment) {
          Render.player(ctx, width, height, resolution, roadWidth, playerSprites, speed/maxSpeed,
                        cameraDepth/playerZ,
                        width/2,
                        (height/2) - (cameraDepth/playerZ * Util.interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * height/2),
                        speed * (keyLeft ? -1 : keyRight ? 1 : 0),
                        playerSegment.p2.world.y - playerSegment.p1.world.y);
        }



        // 세그먼트에 있는 아이템 렌더링
        for(let i = 0 ; i < segment.items.length ; i++) {
          item      = segment.items[i];
          itemScale = segment.p1.screen.scale;
          itemX     = segment.p1.screen.x + (itemScale * item.offset * roadWidth * width/2);
          itemY     = segment.p1.screen.y;
          let curItemObj = sprites['item'];
          // console.log(sprite);
          Render.sprite(ctx, width, height, resolution, roadWidth, curItemObj, item.size, itemScale, itemX, itemY, -0.5, -1, segment.clip);
        }
        
      }


      // 이펙트 렌더링
      if(speed > 8000) {
        updateEffectFrameIndex('speedup', 15);
        let speedupIndex = effectFrameIndex['speedup'];
        // console.log(speedupIndex);
        Render.effect(ctx, effect.speedup[speedupIndex], 0, 0, width, height)
      }


    }
    





    const findSegment = z => {
      // 현재 위치 z에 해당하는 세그먼트 반환
      return segments[Math.floor(z/segmentLength) % segments.length]; 
    }
    





    //=========================================================================
    // 도로 지오메트리 구축
    //=========================================================================
    const lastY = () => { return (segments.length === 0) ? 0 : segments[segments.length-1].p2.world.y; }
    
    const addSegment = (curve, y) => {
      // 새로운 세그먼트를 배열에 추가
      let n = segments.length;
      segments.push({
          index: n,
             p1: { world: { y: lastY(), z:  n   * segmentLength }, camera: {}, screen: {} },
             p2: { world: { y: y,       z: (n+1)* segmentLength }, camera: {}, screen: {} },
          curve: curve,
        sprites: [],
           cars: [],
          color: Math.floor(n/rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT,
           items: []
      });
    }
    

    /**
     * 세그먼트에 아이템 추가
     * @param {number} n - 세그먼트번호(z축위치)
     * @param {number} offset - 가로축(-1, 1)
     */
    const addItem = (n, offset) => {
      segments[n].items.push({
        size: ITEM_SPRITE,
        offset: offset
      });
    }


    // 
    /**
     * 세그먼트에 스프라이트 추가
     * @param {number} n - 세그먼트번호(z축위치)
     * @param {string} spriteGroup - 스프라이트 그룹이름
     * @param {string} spriteName - 스프라이트 이름
     * @param {number} offset - 가로축(-1, 1)
     */
    const addSprite = (n, spriteGroup, spriteName, offset) => {
      // addSprite(20,  SPRITES.BILLBOARD07, -1);
      let size = MAP_SPRITE[selectMap][spriteGroup][spriteName];
      segments[n].sprites.push({
        spriteGroup: spriteGroup,
         spriteName: spriteName,
               size: size,
             offset: offset
      });
    }
    
    // 도로 추가
    const addRoad = (enter, hold, leave, curve, y) => {
      let startY   = lastY(); // 현재 위치
      let endY     = startY + (Util.toInt(y, 0) * segmentLength); // segmentLength를 기반으로 입력 'y'와 종료 Y 위치를 계산합니다.
      let total = enter + hold + leave; // 세그먼트의 총 개수를 계산합니다 (enter + hold + leave).
      // 'enter' 단계를 위한 세그먼트를 추가하고, 곡선 및 Y 위치에 이징을 적용합니다.
      for(let n = 0 ; n < enter ; n++)
        addSegment(Util.easeIn(0, curve, n/enter), Util.easeInOut(startY, endY, n/total));
      // 'hold' 단계를 위한 세그먼트를 추가하고, 고정된 곡선과 Y 위치에 이징을 적용합니다.
      for(let n = 0 ; n < hold  ; n++)
        addSegment(curve, Util.easeInOut(startY, endY, (enter+n)/total));
      // 'leave' 단계를 위한 세그먼트를 추가하고, 곡선을 이용하여 Y 위치에 이징을 적용합니다.
      for(let n = 0 ; n < leave ; n++)
        addSegment(Util.easeInOut(curve, 0, n/leave), Util.easeInOut(startY, endY, (enter+hold+n)/total));
    }
    
    // 도로의 다양한 측면을 정의하는 상수, 길이, 언덕 높이 및 커브 강도 등
    const ROAD = {
      LENGTH: { NONE: 0, SHORT:  25, MEDIUM:   50, LONG:  100 },  // 길이 0~100
      HILL:   { NONE: 0, LOW:    20, MEDIUM:   40, HIGH:   60 },  // 언덕높이 0~60
      CURVE:  { NONE: 0, EASY:    2, MEDIUM:    4, HARD:    6 }   // 커브강도 0~6
    };
    
    /**
     * 지정된 길이의 직선 도로 세그먼트를 추가합니다.
     * @param {number} num - 직선 도로 세그먼트의 길이.
     */
    const addStraight = num => {
      num = num || ROAD.LENGTH.MEDIUM; // default를 Medium으로 설정
      addRoad(num, num, num, 0, 0);
    }
    
    /**
     * 지정된 길이와 높이의 언덕을 추가합니다.
     * @param {number} num - 언덕의 길이.
     * @param {number} height - 언덕의 높이.
     */
    const addHill = (num, height) => {
      num    = num    || ROAD.LENGTH.MEDIUM; 
      height = height || ROAD.HILL.MEDIUM;
      addRoad(num, num, num, 0, height);
    }
    
    /**
     * 지정된 길이, 커브 및 높이의 곡선 도로 세그먼트를 추가합니다.
     * @param {number} num - 곡선 도로 세그먼트의 길이.
     * @param {number} curve - 커브의 강도.
     * @param {number} height - 언덕의 높이.
     */
    const addCurve = (num, curve, height) => {
      num    = num    || ROAD.LENGTH.MEDIUM;
      curve  = curve  || ROAD.CURVE.MEDIUM;
      height = height || ROAD.HILL.NONE;
      addRoad(num, num, num, curve, height);
    }
        
    /**
     * 지정된 길이 및 높이의 저 롤링 언덕 시퀀스를 추가합니다.
     * @param {number} num - 언덕 시퀀스의 길이.
     * @param {number} height - 언덕의 높이.
     * 450
     */
    const addLowRollingHills = (num, height) => {
      num    = num    || ROAD.LENGTH.SHORT;
      height = height || ROAD.HILL.LOW;
      addRoad(num, num, num,  0,                height/2);
      addRoad(num, num, num,  0,               -height);
      addRoad(num, num, num,  ROAD.CURVE.EASY,  height);
      addRoad(num, num, num,  0,                0);
      addRoad(num, num, num, -ROAD.CURVE.EASY,  height/2);
      addRoad(num, num, num,  0,                0);
    }
    
    /**
     * S 모양 곡선의 시퀀스를 추가합니다.
     */
    const addSCurves = () => {
      addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
      addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
      addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
      addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
      addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
    }
    
    /**
     * 도로에 덤핑이 추가된 시퀀스를 추가합니다.
     */
    const addBumps = () => {
      addRoad(10, 10, 10, 0,  5);
      addRoad(10, 10, 10, 0, -2);
      addRoad(10, 10, 10, 0, -5);
      addRoad(10, 10, 10, 0,  8);
      addRoad(10, 10, 10, 0,  5);
      addRoad(10, 10, 10, 0, -7);
      addRoad(10, 10, 10, 0,  5);
      addRoad(10, 10, 10, 0, -2);
    }
    
    /**
     * 지정된 길이의 하강하는 도로 세그먼트를 추가하여 끝까지 이어집니다.
     * @param {number} num - 하강 도로 세그먼트의 길이.
     */
    const addDownhillToEnd = num => {
      num = num || 200;
      addRoad(num, num, num, -ROAD.CURVE.EASY, -lastY()/segmentLength);
    }
    
    

    const resetMap = () => {
      segments = [];
      MapData[selectMap]();
      resetCars();
    
      // 플레이어 현재 위치 + 2 세그먼트의 색을 START 색으로 설정
      segments[findSegment(playerZ).index + 2].color = COLORS.START;
      // 플레이어 현재 위치 + 3 세그먼트의 색을 START 색으로 설정
      segments[findSegment(playerZ).index + 3].color = COLORS.START;
      // 룸블 길이만큼의 마지막 세그먼트부터 거꾸로 루프하며 색을 FINISH 색으로 설정
      for(let n = 0 ; n < rumbleLength ; n++)
        segments[segments.length-1-n].color = COLORS.FINISH;
      // 각 세그먼트의 길이를 곱하여 전체 트랙 길이 계산
      trackLength = segments.length * segmentLength;
    }



    const MapData = {
      // *************************************** map 1 *************************************** 
      map1: () => {
        // 길 세팅 Start ******************************************************************
        addStraight(ROAD.LENGTH.SHORT);
        addSCurves();
        addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
        addBumps();
        
        addStraight(ROAD.LENGTH.MEDIUM);
        addHill(ROAD.LENGTH.SHORT, -ROAD.HILL.MEDIUM);
        addDownhillToEnd();

        console.log("map1 총 길이: ",segments.length);
        // 길 세팅 End ******************************************************************


        // 스프라이트 세팅 Start ********************************************************************
        // func: addSprite(z축위치, 스프라이트그룹, 스프라이트이름, x축위치)
        
        // 고정된 위치에 각종 스프라이트 추가
        // addSprite(20, 'BILLBOARD', 'billboard_ssafy', -1);
        // // addSprite(40, 'BILLBOARD', 'billboard_ssafy', -1);
        // addSprite(60, 'BILLBOARD', 'billboard', -1);
        // // addSprite(80, 'BILLBOARD', 'billboard_ssafy', -1);
        // addSprite(100, 'BILLBOARD', 'billboard_ssafy', -1);
        // // addSprite(120, 'BILLBOARD', 'billboard_ssafy', -1);
        // addSprite(140, 'BILLBOARD', 'billboard', -1);
        // addSprite(160, 'BILLBOARD', 'billboard_ssafy', -1);

        // 반복문으로 생성
        // for(let n = 10; n < 200; n += 4 + Math.floor(n/100)) {
        //   addSprite(n, 'TREE', 'tree1', 0.8 + Math.random()*0.5);
        //   addSprite(n, 'TREE', 'tree1',   1.3 + Math.random()*2);
        // }
        // for(let n = 250; n < 1000; n += 5) {
        //   addSprite(n + Util.randomInt(0,5), 'TREE', 'tree2', -1 - (Math.random() * 2));
        //   addSprite(n + Util.randomInt(0,5), 'TREE', 'tree2', -1 - (Math.random() * 2));
        // }

        // 다양한 위치에 랜덤하게 식물 스프라이트 추가
        // for(let n = 200; n < segments.length; n += 3) {
        //   addSprite(
        //     n,
        //     'TREE',
        //     Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
        //     Util.randomChoice([1,-1]) * (2 + Math.random() * 5)
        //   );
        // }
      
        // 일정한 간격으로 랜덤한 방향으로 빌보드 및 식물 스프라이트 추가
        // let side, sprite, offset;
        // for(let n = 1000; n < (segments.length-50); n += 100) {
        //   side = Util.randomChoice([1, -1]);
        //   addSprite(
        //     n + Util.randomInt(0, 50),
        //     'BILLBOARD',
        //     Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].BILLBOARD)),
        //     -side
        //   );
        //   for(let i = 0; i < 20; i++) {
        //     sprite = Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE));
        //     offset = side * (1.5 + Math.random());
        //     addSprite(n + Util.randomInt(0, 50), 'TREE', sprite, offset);
        //   }
        // }

        // ===============================================================================
        
        // 나무 랜덤 추가
        for(let n = 10; n < (segments.length-50); n += 2) {
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(1, 5) + Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(1, 5) + Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1])
          );
        }


        for(let n = 10; n < 200; n += 20) {
          addSprite(n, 'BILLBOARD', 'billboard_ssafy10', -1.2);
          addSprite(n, 'BILLBOARD', 'billboard_ssafy10', 1.2);
        }

        for(let n = 20; n < 200; n += 20) {
          addSprite(n, 'BILLBOARD', 'billboard_ssafy11', -1.2);
          addSprite(n, 'BILLBOARD', 'billboard_ssafy11', 1.2);
        }


        for(let n = 230; n < (segments.length-50); n += 10 + Math.floor(n/100)) {
          addSprite(n + Util.randomInt(0,5), 'BILLBOARD',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].BILLBOARD)),
            Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'BILLBOARD',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].BILLBOARD)),
            Util.randomInt(1, 5) + Util.randomChoice([0.2, 1])
          );
        }

        // 집&우물 추가
        for(let n = 10; n < (segments.length-50); n += 10 + Math.floor(n/100)) {
          addSprite(n + Util.randomInt(0,5), 'STUFF',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].STUFF)),
            Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'STUFF',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].STUFF)),
            Util.randomInt(1, 5) + Util.randomChoice([0.2, 1])
          );
        }


        // 스프라이트 세팅 End ********************************************************************************************************


        // 아이템 세팅 Start *******************************************************************************
        addItem(50, 0.75);
        addItem(50, 0.25);
        addItem(50, -0.25);
        addItem(50, -0.75);

        for(let n = 250; n < (segments.length-450); n += 300) {
          addItem(n, 0.25 + Util.randomInt(0, 1) * 0.5);
          addItem(n, -0.25 - Util.randomInt(0, 1) * 0.5);
        }

        // 아이템 세팅 End *******************************************************************************
      },



      


      // *************************************** map 2 *************************************** 
      map2: () => {
        // 길 세팅 Start ******************************************************************
        // addLowRollingHills();
        addStraight(ROAD.LENGTH.LONG);
        addStraight(ROAD.LENGTH.LONG);
        addStraight(ROAD.LENGTH.LONG);
        // addCurve(ROAD.LENGTH.LONG*2, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
        // addSCurves();
        // 이까지 대충 1분
        addDownhillToEnd();

        console.log("map2 총 길이: ",segments.length);
        // 길 세팅 End ******************************************************************


        // 스프라이트 세팅 Start ********************************************************************
        // func: addSprite(z축위치, 스프라이트그룹, 스프라이트이름, x축위치)
        
        // 랜덤 캐릭터 추가

        for(let n = 10; n < (segments.length-50); n += 10 + Math.floor(n/100)) {
          addSprite(n + Util.randomInt(0, 50), 'CHARACTER', 'ghost', Util.randomInt(1, 5) + Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'CHARACTER', 'ghost', Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'CHARACTER', 'vampire', Util.randomInt(1, 5) + Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'CHARACTER', 'vampire', Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'CHARACTER', 'zombie', Util.randomInt(1, 5) + Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'CHARACTER', 'zombie', Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1]));
        }

        // 랜덤 나무 추가
        for(let n = 10; n < (segments.length-50); n ++) {
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(1, 5) + Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(1, 5) + Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(-1, -5) - Util.randomChoice([0.2, 1])
          );
        }

        // 사이드 먼 곳 나무 추가
        for(let n = 10; n < (segments.length-50); n += 3) {
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(-5, -10) - Util.randomChoice([0, 1])
          );
          addSprite(n + Util.randomInt(0,5), 'TREE',
            Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].TREE)),
            Util.randomInt(5, 10) - Util.randomChoice([0, 1])
          );
        }

        // 다양한 위치에 랜덤하게 스프라이트(무덤, 전등, 호박등) 추가
        for(let n = 0; n < (segments.length-50); n += 5) {
          addSprite(n + Util.randomInt(0, 50), 'GRAVE', Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].GRAVE)), Util.randomInt(-1, -7) - Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'GRAVE', Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].GRAVE)), Util.randomInt(1, 7) + Util.randomChoice([0.2, 1]));
        }

        for(let n = 0; n < (segments.length-50); n += 10) {
          addSprite(n + Util.randomInt(0, 50), 'LIGHTPOST', Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].LIGHTPOST)), Util.randomInt(-1, -7) - Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'LIGHTPOST', Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].LIGHTPOST)), Util.randomInt(1, 7) + Util.randomChoice([0.2, 1]));
        }

        for(let n = 0; n < (segments.length-50); n += 3) {  
          addSprite(n + Util.randomInt(0, 50), 'STUFF', Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].STUFF)), Util.randomInt(-1, -7) -Util.randomChoice([0.2, 1]));
          addSprite(n + Util.randomInt(0, 50), 'STUFF', Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].STUFF)), Util.randomInt(1, 7) + Util.randomChoice([0.2, 1]));
        }
      
        // 일정한 간격으로 랜덤한 방향으로 물건 및 전등 스프라이트 추가
        // let side, sprite, offset;
        // for(let n = 10; n < (segments.length-50); n += 20) {
        //   side = Util.randomChoice([1, -1]);
        //   addSprite(
        //     n + Util.randomInt(0, 50),
        //     'STUFF',
        //     Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].STUFF)),
        //     -side
        //   );
        //   for(let i = 0; i < 20; i++) {
        //     sprite = Util.randomChoice(Object.keys(MAP_SPRITE[selectMap].LIGHTPOST));
        //     offset = side * (1.5 + Math.random());
        //     addSprite(n + Util.randomInt(0, 50), 'LIGHTPOST', sprite, offset);
        //   }
        // }
        // 스프라이트 세팅 End ********************************************************************************************************


        // 아이템 세팅 Start *******************************************************************************

        for(let n = 800; n < (segments.length-300); n += 200) {
          addItem(n, 0.75);
          addItem(n, 0.25);
          addItem(n, -0.25);
          addItem(n, -0.75);
        }

        // 아이템 세팅 End *******************************************************************************
      }
    }

    
    // const resetSprites = () => {
      


    //   // *************Legacy function**************
    //   // addSprite(20,  SPRITES.BILLBOARD05, -1);
    //   // addSprite(40,  SPRITES.BILLBOARD06, -1);
    //   // addSprite(60,  SPRITES.BILLBOARD08, -1);
    //   // addSprite(80,  SPRITES.BILLBOARD09, -1);
    //   // addSprite(100, SPRITES.BILLBOARD01, -1);
    //   // addSprite(120, SPRITES.BILLBOARD02, -1);
    //   // addSprite(140, SPRITES.BILLBOARD03, -1);
    //   // addSprite(160, SPRITES.BILLBOARD04, -1);
    //   // addSprite(180, SPRITES.BILLBOARD05, -1);
    
    //   // addSprite(240,                  SPRITES.BILLBOARD07, -1.2);
    //   // addSprite(240,                  SPRITES.BILLBOARD06,  1.2);
    //   // addSprite(segments.length - 25, SPRITES.BILLBOARD07, -1.2);
    //   // addSprite(segments.length - 25, SPRITES.BILLBOARD06,  1.2);
    
    //   // // 팜 트리 및 기둥, 나무 등 다양한 스프라이트를 추가
    //   // for(let n = 10 ; n < 200 ; n += 4 + Math.floor(n/100)) {
    //   //   addSprite(n, SPRITES.PALM_TREE, 0.5 + Math.random()*0.5);
    //   //   addSprite(n, SPRITES.PALM_TREE,   1 + Math.random()*2);
    //   // }
    
    //   // for(let n = 250 ; n < 1000 ; n += 5) {
    //   //   addSprite(n,     SPRITES.COLUMN, 1.1);
    //   //   addSprite(n + Util.randomInt(0,5), SPRITES.TREE1, -1 - (Math.random() * 2));
    //   //   addSprite(n + Util.randomInt(0,5), SPRITES.TREE2, -1 - (Math.random() * 2));
    //   // }
    
    //   // // 다양한 위치에 랜덤하게 식물 스프라이트 추가
    //   // for(let n = 200 ; n < segments.length ; n += 3) {
    //   //   addSprite(n, Util.randomChoice(SPRITES.PLANTS), Util.randomChoice([1,-1]) * (2 + Math.random() * 5));
    //   // }
    
    //   // // 일정한 간격으로 랜덤한 방향으로 빌보드 및 식물 스프라이트 추가
    //   // let side, sprite, offset;
    //   // for(let n = 1000 ; n < (segments.length-50) ; n += 100) {
    //   //   side      = Util.randomChoice([1, -1]);
    //   //   addSprite(n + Util.randomInt(0, 50), Util.randomChoice(SPRITES.BILLBOARDS), -side);
    //   //   for(let i = 0 ; i < 20 ; i++) {
    //   //     sprite = Util.randomChoice(SPRITES.PLANTS);
    //   //     offset = side * (1.5 + Math.random());
    //   //     addSprite(n + Util.randomInt(0, 50), sprite, offset);
    //   //   }
          
    //   // }
    
    // }

    
    

    const getPlayerFrameIndex = (playerId) => {
      for (let data of playerGameDataList) {
        // console.log(`playerId : ${playerId}`)
        // console.log(`data.playerId : ${data.playerId}`)
        if (data.playerId === playerId) {
          // console.log(`findSameId!!! ${data.frameIndex}`)
          return data.frameIndex;
        }
      }
    }


    const resetCars = () => {
      cars = []; // 빈 배열로 초기화
      let car, segment, offset, z, sprite, speed;
      for (let n = 0 ; n < playerGameDataList.length ; n++) {
        offset = Math.random() * Util.randomChoice([-0.8, 0.8]);
        // z      = Math.floor(Math.random() * segments.length) * segmentLength;
        z      = 0;
        // const PLAYER_SPRITE = {
        //   NAMES: [ "pug", "sheep", "pig", "cow", "llama", "horse", "zebra"],
        //   ACTIONS: [ {name: "run", frames: 21} ],
        //   DIRECTIONS: [ "uphill_left", "uphill_straight", "uphill_right", "left", "straight", "right" ]
        // }
        
        sprite = {x: 0, y: 0, w: 300, h: 300}; // 스프라이트 X, Y, H, W 정보
        // sprite = Util.randomChoice(SPRITES.CARS); 
        speed  = maxSpeed/4 + Math.random() * maxSpeed/(sprite === SPRITES.SEMI ? 4 : 2);
        // speed  = maxSpeed;
        // playerGameDataList 배열인데 지금까지 playerGameDataList.playerId, 이렇게 참조하고 있었다..
        car = {
          offset: offset, z: z, 
          sprite: sprite, speed: speed, 
          playerId: playerGameDataList[n].playerId, 
          playerCharacter: playerGameDataList[n].playerCharacter
        };
        // if( playerGameDataList.playerId === undefined ) console.log(playerGameDataList); // 출력됨!! 
        segment = findSegment(car.z);
        segment.cars.push(car);
        cars.push(car); // cars 배열에 담기
      }
    }
    
    //=========================================================================
    // THE GAME LOOP
    //=========================================================================
    
    // 게임 실행 및 초기화
    Game.run({
      // canvas: canvas, render: render, update: update, stats: stats, step: step,
      canvas: canvas, render: render, update: update, step: step,
      images: ["background", "sprites", "playerSpriteNames"],
      keys: [
        // { keys: [KEY.LEFT,  KEY.A], mode: 'down', action: function() { keyLeft   = true;  } },
        // { keys: [KEY.RIGHT, KEY.D], mode: 'down', action: function() { keyRight  = true;  } },
        // { keys: [KEY.UP,    KEY.W], mode: 'down', action: function() { keyFaster = true;  } },
        // { keys: [KEY.DOWN,  KEY.S], mode: 'down', action: function() { keySlower = true;  } },
        // { keys: [KEY.SPACEBAR],     mode: 'down', action: () => { keyFaster = false; keySlower = true }},
        // { keys: [KEY.LEFT,  KEY.A], mode: 'up',   action: function() { keyLeft   = false; } },
        // { keys: [KEY.RIGHT, KEY.D], mode: 'up',   action: function() { keyRight  = false; } },
        // { keys: [KEY.UP,    KEY.W], mode: 'up',   action: function() { keyFaster = false; } },
        // { keys: [KEY.DOWN,  KEY.S], mode: 'up',   action: function() { keySlower = false; } },
        // { keys: [KEY.SPACEBAR],     mode: 'up',   action: () => { keyFaster = true; keySlower = false }}
      ],
      ready: images => { // images === loadImages의 result
        // ==> images[spriteName][action.name][direction] === <img>
        // images 에 모든 이미지가 담겨있음

        background.hills = images.hills;
        background.sky = images.sky;
        background.faraway = images.faraway;

        // 스피드 효과 이미지 추가
        effect.speedup = [...images.effect]; // 2개

        // console.log(`Game.ready() -> background : ${background}`)
        // console.log(background.sky.src)
        // 
        // const PLAYER_SPRITE = {
        //   NAMES: [ "pug", "sheep", "pig", "cow", "llama", "horse", "zebra"],
        //   ACTIONS: [ {name: "run", frames: 21} ],
        //   DIRECTIONS: [ "uphill_left", "uphill_straight", "uphill_right", "left", "straight", "right" ]
        // }
        PLAYER_SPRITE.NAMES.forEach(name => {
          playerSprites[name] = images[name];
        })
        sprites    = {...images}; // loadImage에서 불러온 객체
        console.log(sprites);
        reset();
        localStorage.fast_lap_time = localStorage.fast_lap_time || 180;
        updateHud('fast_lap_time', formatTime(Util.toFloat(localStorage.fast_lap_time)));
        setIsLoadGame(true);
        console.log(`게임로딩완료`);
      }
    });
    
    /**
     * 게임 초기화 함수. 옵션에 따라 게임의 초기 상태를 설정합니다.
     * @param {Object} options - 게임 초기화 옵션.
     */
    const reset = options => {
      options       = options || {};
      canvas.width  = width  = Util.toInt(options.width,          width);
      canvas.height = height = Util.toInt(options.height,         height);
      lanes                  = Util.toInt(options.lanes,          lanes);
      roadWidth              = Util.toInt(options.roadWidth,      roadWidth);
      cameraHeight           = Util.toInt(options.cameraHeight,   cameraHeight);
      drawDistance           = Util.toInt(options.drawDistance,   drawDistance);
      fogDensity             = Util.toInt(options.fogDensity,     fogDensity);
      fieldOfView            = Util.toInt(options.fieldOfView,    fieldOfView);
      segmentLength          = Util.toInt(options.segmentLength,  segmentLength);
      rumbleLength           = Util.toInt(options.rumbleLength,   rumbleLength);
      cameraDepth            = 1 / Math.tan((fieldOfView/2) * Math.PI/180);
      playerZ                = (cameraHeight * cameraDepth);
      resolution             = height/1080;
      // refreshTweakUI();
    
      if ((segments.length === 0) || (options.segmentLength) || (options.rumbleLength))
        resetMap(); // 필요할 때만 도로를 다시 만듭니다.
    }
    
    //=========================================================================
    // TWEAK UI HANDLERS
    //=========================================================================
    
    // 해상도 설정 변경 시 이벤트 핸들러
    // Dom.on('resolution', 'change', function(ev) {
    //   let w, h;
    //   switch(ev.target.options[ev.target.selectedIndex].value) {
    //     case 'fine':   w = 1280; h = 960; break;
    //     case 'high':   w = 1024; h = 768; break;
    //     case 'medium': w = 640;  h = 480; break;
    //     case 'low':    w = 480;  h = 360; break;
    //     default :
    //   }
    //   reset({ width: w, height: h })
    //   Dom.blur(ev);
    // });
    
    // // 차선 수 변경 시 이벤트 핸들러
    // Dom.on('lanes',          'change', function(ev) { Dom.blur(ev); reset({ lanes:         ev.target.options[ev.target.selectedIndex].value }); });
    // // 도로 폭 변경 시 이벤트 핸들러
    // Dom.on('roadWidth',      'change', function(ev) { Dom.blur(ev); reset({ roadWidth:     Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
    // // 카메라 높이 변경 시 이벤트 핸들러
    // Dom.on('cameraHeight',   'change', function(ev) { Dom.blur(ev); reset({ cameraHeight:  Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
    // // 랜더링 거리 변경 시 이벤트 핸들러
    // Dom.on('drawDistance',   'change', function(ev) { Dom.blur(ev); reset({ drawDistance:  Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
    // // 시야각 변경 시 이벤트 핸들러
    // Dom.on('fieldOfView',    'change', function(ev) { Dom.blur(ev); reset({ fieldOfView:   Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
    // // 안개 밀도 변경 시 이벤트 핸들러
    // Dom.on('fogDensity',     'change', function(ev) { Dom.blur(ev); reset({ fogDensity:    Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
    
    // UI 업데이트 함수
    // const refreshTweakUI = () => {
    //   Dom.get('lanes').selectedIndex = lanes-1;
    //   Dom.get('currentRoadWidth').innerHTML      = Dom.get('roadWidth').value      = roadWidth;
    //   Dom.get('currentCameraHeight').innerHTML   = Dom.get('cameraHeight').value   = cameraHeight;
    //   Dom.get('currentDrawDistance').innerHTML   = Dom.get('drawDistance').value   = drawDistance;
    //   Dom.get('currentFieldOfView').innerHTML    = Dom.get('fieldOfView').value    = fieldOfView;
    //   Dom.get('currentFogDensity').innerHTML     = Dom.get('fogDensity').value     = fogDensity;
    // }
    
    //=========================================================================
    
    //=========================================================================
    
    console.log(`loading 완료`)
  }, [isGameEnd])




  const formatTime = (dt) => {
    let minutes = Math.floor(dt/60);
    let seconds = Math.floor(dt - (minutes * 60));
    let tenths  = Math.floor(10 * (dt - Math.floor(dt)));
  
    // 분이 0보다 크면 분, 초 및 십분의 일초를 반환
    if (minutes > 0)
      return minutes + "." + (seconds < 10 ? "0" : "") + seconds + "." + tenths;
    // 그렇지 않으면 초 및 십분의 일초만 반환
    else
      return seconds + "." + tenths;
  }

  
  
  return (
    <div>

      <div id="racer">
        <canvas id="canvas" ref={canvasRef} {...props}>Loading...</canvas>
      </div>

      <div>
        {/* 속도 : {5 * Math.round(testSpeed/500)} <br/>
        시간 : {Util.formatTime(testCurrentLapTime)} <br/>
        방금기록 : { Util.formatTime(testLastLapTime) } { } <br/>
        최고기록 : { Util.formatTime(Util.toFloat(localStorage.fast_lap_time)) } <br/> */}
      </div>

    </div>
  )
}

export default Main;
