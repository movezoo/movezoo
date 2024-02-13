import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Main from "../../../components/play/Main";
import "./Game.css";
import { data } from "../../../components/play/data.js";


import '@mediapipe/face_detection';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

import { Util } from '../../../components/play/common.js';
import { useRecoilState } from 'recoil';
import {
  gameCurrentTimeState,
  gameMyItemLeftState,
  gameMyItemRightState,
  gameStartCountState,
  gameEndCountState
} from '../../../components/state/gameState.js'


function Game() {
  const [testCurrentLapTime] = useRecoilState(gameCurrentTimeState);
  const [gameMyItemLeft] = useRecoilState(gameMyItemLeftState);
  const [gameMyItemRight] = useRecoilState(gameMyItemRightState);
  const [gameStartCount] = useRecoilState(gameStartCountState);
  const [gameEndCount] = useRecoilState(gameEndCountState);

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const videoRef = useRef(null);
  const detector = useRef(null);
  const handDetector = useRef(null);

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
      // 게임 종료 로직
      if (data.isGameEnd) {
        data.data = {
          centerDistance: 0,
          sensitivity: 0,
          isLeftKeyPressed: false,
          isRightKeyPressed: false,
          isBreak: false,
          isRun: false, // Test중... false로 바꿔야됨
          isLeftItemUse: false,
          isRightItemUse: false,
          isGameStart: false,
          isGameEnd: false
        };
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
        // runFaceDetection();
      }, 2000);
    }
    gameStart();

  }, [videoRef]);

  // 로딩 중일 때 보여줄 뷰
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-body">
          로딩 중...
        </div>
      </div>
    );
  }


  return (
    <div className="singlegame-container">


      <div className="game">
        <Main width={1920} height={1080} />
      </div>

      <div className={gameStartCount !== 0 ? "start-time" : "start-time hidden"}>
        {gameStartCount}
      </div>
      {/* <div className="start-time">시작카운트다운 : {gameStartCount}</div> */}
      <div className={gameEndCount !== 11 ? "end-time" : "end-time hidden"}>
        {gameEndCount}
      </div>
      <div className="end-time">{gameEndCount}</div>
      <div className="current-time">{Util.formatTime(testCurrentLapTime)}</div>
      <div className="over-contents">
        <div className="webcam-box">
          <Webcam
            className="single-webCam"
            mirrored={true}
            ref={videoRef}
            videoConstraints={{ //비디오 품질 해상도
              width: 640,
              height: 480
            }}
          />
        </div>
        <div className="my-item-list">
          <div className="my-item">{gameMyItemLeft}</div>
          <div className="my-item">{gameMyItemRight}</div>
        </div>
      </div>


      {/*왼쪽 화면, 게임 화면*/}
      {/* <div className="singlegame-body"> */}




      {/* <p style={{ textAlign: "center" }}>
          <strong>게임 화면</strong>
        </p> */}
      {/* <div className="game">
          <Main width={1920} height={1080} />
        </div>
      </div>
      
      <div className="singlegame-cam-card">
        <div className="singlegame-cam">
          <Webcam
            className="single-webCam"
            mirrored={true}
            ref={videoRef}
            videoConstraints={{ //비디오 품질 해상도
              width: 200,
              height: 160
            }}
          />
        </div> */}





      {/* </div> */}

      {/*오른쪽 화면*/}
      {/* <div className="singlegame-select">
        <div>
          <Link to="/Result">넘어가기</Link>
        </div>
      </div> */}

    </div >
  );
}
export default Game;
