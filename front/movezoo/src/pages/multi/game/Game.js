import "./Game.css";
import Main from "../../../components/play/Main";
import MyVideoComponent from "../../../components/play/MyVideoComponent.js";
import UserVideoComponent from "../../../components/play/UserVideoComponent.js";

import '@mediapipe/face_detection';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";

import { Util } from '../../../components/play/common.js';
import { data } from "../../../components/play/data.js";

import {
  gameCurrentTimeState,
  gameMyItemLeftState,
  gameMyItemRightState,
  gameStartCountState,
  gameEndCountState,
  isMultiGameStartState,
  playGameModeState
} from '../../../components/state/gameState.js'

function Game(props) {
  const { setPage, isPlayingGame, session, mainStreamManager, subscribers, leaveSession } = props;
  const [testCurrentLapTime] = useRecoilState(gameCurrentTimeState);
  const [gameMyItemLeft] = useRecoilState(gameMyItemLeftState);
  const [gameMyItemRight] = useRecoilState(gameMyItemRightState);
  const [gameStartCount] = useRecoilState(gameStartCountState);
  const [gameEndCount] = useRecoilState(gameEndCountState);
  const [isMultiGameStart] = useRecoilState(isMultiGameStartState);
  const [playGameMode] = useRecoilState(playGameModeState);
  const [isTimeVisible, setIsTimeVisible] = useState(true);

  // **************************************************
  // if(playGameMode === 'multi' && isMultiGameStart) 
  //     위 조건이 참이되면 카운트다운이 시작된다.
  // **************************************************

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const videoRef = useRef(null);
  const detector = useRef(null);
  const handDetector = useRef(null);

  useEffect((() => {
    // 전체 화면으로 전환
    document.documentElement.requestFullscreen();
  }), [])

  useEffect(() => {
    // 게임 종료 시 current-time 숨기기
    if (gameEndCount === 10) {
      setIsTimeVisible(false);
    }
  }, [gameEndCount])

  useEffect(() => {
    setIsLoading(true); // 로딩 시작

    const initializeFaceDetector = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const handModel = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: 'tfjs' // or 'tfjs'
      };
      const handDetectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
        modelType: 'lite'
      };
      detector.current = await faceDetection.createDetector(model, detectorConfig);
      handDetector.current = await handPoseDetection.createDetector(handModel, handDetectorConfig);
    };
    initializeFaceDetector();


    const detect = async () => {
      // 게임 종료 로직(초기화)
      if (data.isGameEnd) {
        data.centerDistance = 0;
        data.sensitivity = 0;
        data.isLeftKeyPressed = false;
        data.isRightKeyPressed = false;
        data.isBreak = false;
        data.isRun = false;
        data.isLeftItemUse = false;
        data.isRightItemUse = false;
        data.isGameStart = false;
        data.isGameEnd = false;
        return;
      }
      const estimationConfig = { flipHorizontal: false };

      // VideoRef가 null이 아닐때 실행
      if (!!videoRef.current) {
        const video = videoRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        video.width = videoWidth;
        video.height = videoHeight;
        // 손 디텍트 Start ***********
        if (!!handDetector.current) {
          try {
            const hands = await handDetector.current.estimateHands(video, estimationConfig);
            const centerX = videoWidth / 2;
            const leftX = videoWidth;
            const rightX = 0;

            // 손을 인식 성공했다면
            if (!!hands) {
              let isLeftTouch = false;
              let isRightTouch = false;
              hands.forEach(hand => {
                hand.keypoints.forEach(point => {
                  // 왼쪽              
                  if (point.x > leftX - centerX / 2) {
                    isLeftTouch = true;
                    // 오른쪽
                  } else if (point.x < rightX + centerX / 2) {
                    isRightTouch = true;
                  }
                })
                // console.log(hand.keypoints[0].x)
                // console.log(hands)
              })


              if (isLeftTouch) {
                data.isLeftItemUse = true;
                // console.log(`왼쪽 아이템 사용`)
              } else if (isRightTouch) {
                data.isRightItemUse = true;
                // console.log(`오른쪽 아이템 사용`)
              } else {
                data.isLeftItemUse = false;
                data.isRightItemUse = false;
              }
            }

          } catch (error) {
            // console.log(error);
          }
        }
        // 손 디텍트 End ***********

        // 얼굴 디텍트 Start ***********
        if (!!detector.current) {
          try {
            const faces = await detector.current.estimateFaces(video, estimationConfig);

            if (faces.length === 0) console.log(`no face`);
            // console.log(faces);
            // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
            const centerX = videoWidth / 2;

            let noseX, noseY, rightEarTragionX, rightEarTragionY,
              leftEarTragionX, leftEarTragionY, leftEyeX, rightEyeX,
              mouthCenterY;

            faces[0]?.keypoints.forEach((obj) => {
              if (obj.name === 'noseTip') {
                noseX = obj.x;
                noseY = obj.y;
                // 캠 반전때문에 방향을 반대로 값을 넣어줌
              } else if (obj.name === 'rightEarTragion') {
                leftEarTragionX = obj.x;
                leftEarTragionY = obj.y;
              } else if (obj.name === 'leftEarTragion') {
                rightEarTragionX = obj.x
                rightEarTragionY = obj.y;
              } else if (obj.name === 'rightEye') {
                leftEyeX = obj.x;
              } else if (obj.name === 'leftEye') {
                rightEyeX = obj.x;
              } else if (obj.name === 'mouthCenter') {
                mouthCenterY = obj.y;
              }


              // noseTip
              // rightEarTragion
              // leftEarTragion
              // leftEye
              // rightEye
              // mouthCenter
            })

            let sensitivity = Math.abs(noseY - mouthCenterY) * 1.3; // 민감도

            // noseX: 269.99345779418945, centerX: 320, sensitivity: 32.98797607421875
            if (data.isGameStart) {
              data.centerDistance = Math.abs(centerX - noseX);
              data.sensitivity = Math.abs(noseY - mouthCenterY); // 얼굴을 움직일 때 가장 값이 변하지 않는 거리
              // 좌우 이동 detect
              if (noseX < centerX - sensitivity) {
                data.isLeftKeyPressed = false;
                data.isRightKeyPressed = true;
                // console.log("Right");
              } else if (noseX > centerX + sensitivity) {
                data.isRightKeyPressed = false;
                data.isLeftKeyPressed = true;
                // console.log("Left");
              } else {
                data.isRightKeyPressed = false;
                data.isLeftKeyPressed = false;
              }

              // 고개들기(뒤로젖히기) detect
              if (rightEarTragionY > noseY && leftEarTragionY > noseY) {
                data.isRun = false;
                data.isBreak = true;
                // console.log(`break!!!`)
              } else {
                data.isRun = true;
                data.isBreak = false;
              }

            }
          } catch (error) {
            // console.error('Error detecting faces:', error);
          }
        }
        // 얼굴 디텍트 End ***********
      }


    };


    const runFaceDetection = () => {
      detect();
      requestAnimationFrame(runFaceDetection)
    };

    const gameStart = () => {
      setTimeout(() => {
        setIsLoading(false); // 3초 후에 로딩 종료 및 게임 시작
        runFaceDetection();
      }, 2000);
    }
    gameStart();


    const handleMouseMove = () => {
      document.body.style.cursor = 'auto'; // 마우스 포인터 보이기
      clearTimeout(cursorTimeout); // 이전에 설정한 숨기기 타이머 제거
      cursorTimeout = setTimeout(() => { // 일정 시간이 지난 후에 다시 숨기기
        document.body.style.cursor = 'none';
      }, 3000);
    };

    // 마우스 이동 이벤트에 핸들러 연결
    document.addEventListener('mousemove', handleMouseMove);

    let cursorTimeout; // 마우스 커서 숨기기를 위한 타이머

    // 컴포넌트가 unmount될 때 이벤트 핸들러 제거
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(cursorTimeout);
    };

  }, [videoRef]);



  let itemImage = null;
  if (gameMyItemLeft === "speedup") {
    itemImage = <img src="/images/itemImg/itemBox_speedup.png" alt="speed up item" />;
  }
  let itemImage2 = null;
  if (gameMyItemRight === "speedup") {
    itemImage2 = <img src="/images/itemImg/itemBox_speedup.png" alt="speed up item" />;
  }


  return (
    <div className="singlegame-container">


      <div className="game">
        <Main width={1536} height={864} setPage={setPage} />
      </div>

      {
        (playGameMode === 'multi' && isMultiGameStart) ? null :
          <div className="body-waviy">
            <div className="waviy">
              <span style={{ '--i': 4 }}>l</span>
              <span style={{ '--i': 5 }}>o</span>
              <span style={{ '--i': 6 }}>a</span>
              <span style={{ '--i': 7 }}>d</span>
              <span style={{ '--i': 8 }}>i</span>
              <span style={{ '--i': 9 }}>n</span>
              <span style={{ '--i': 10 }}>g</span>
              <span style={{ '--i': 11 }}>.</span>
              <span style={{ '--i': 12 }}>.</span>
              <span style={{ '--i': 13 }}>.</span>
            </div>
          </div>
      }

      <div className={gameStartCount !== 0 ? "start-time" : "start-time hidden"}>
        {gameStartCount === 4 ? "READY" : gameStartCount}
      </div>
      {/* <div className="start-time">시작카운트다운 : {gameStartCount}</div> */}
      <div className={gameEndCount !== 11 ? "end-time" : "end-time hidden"}>
        {gameEndCount}
      </div>
      {/* <div className="end-time">{gameEndCount}</div> */}
      {/* <div className="current-time">{Util.formatTime(testCurrentLapTime)}</div> */}
      <div className={isTimeVisible ? "current-time" : "current-time hidden"}>
        {Util.formatTime(testCurrentLapTime)}
      </div>
      <div className="over-contents">
        <div className="webcam-box">
          <div className="single-webCam">
            {mainStreamManager !== undefined ? (
              <div id="main-video">
                <MyVideoComponent
                  streamManager={mainStreamManager}
                  mySession={session}
                  isPlayingGame={isPlayingGame}
                />
              </div>
            ) : "asdf"}
          </div>
        </div>
        <div className="multi-webCam-box">
          {subscribers.map((sub, i) => (
            <div key={sub.id} className="multi-webCam">
              <span>{sub.id}</span>
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
        </div>
        <div className="my-item-list">
          <div className="my-item">{itemImage}</div>
          <div className="my-item">{itemImage2}</div>
        </div>
      </div>
    </div >
  );
}
export default Game;
