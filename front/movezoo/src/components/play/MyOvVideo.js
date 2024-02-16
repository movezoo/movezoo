import { useRef, useEffect } from "react";

import '@mediapipe/face_detection';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

import { data, myGameData, playerGameDataList } from "./data.js";
import { useRecoilState } from 'recoil';
import {
  gameCurrentTimeState,
  gameMyItemLeftState,
  gameMyItemRightState,
  gameStartCountState,
  gameEndCountState,
  isLoadGameState,
  isLoadDetectState
} from '../state/gameState.js'

let isPlayingGame = false;

const MyOvVideo = (props) => {
  const { streamManager, mySession } = props;

  const [testCurrentLapTime] = useRecoilState(gameCurrentTimeState);
  const [gameMyItemLeft] = useRecoilState(gameMyItemLeftState);
  const [gameMyItemRight] = useRecoilState(gameMyItemRightState);
  const [gameStartCount] = useRecoilState(gameStartCountState);
  const [gameEndCount] = useRecoilState(gameEndCountState);
  const [isLoadGame, setIsLoadGame] = useRecoilState(isLoadGameState);
  const [isLoadDetect, setIsLoadDetect] = useRecoilState(isLoadDetectState);

  const videoRef = useRef(null);
  const detector = useRef(null);
  const handDetector = useRef(null);
  

  useEffect(() => {
    // 로딩 초기화
    setIsLoadGame(false); // 로딩 안됨
    setIsLoadDetect(false); // 로딩 안됨

    if (!!videoRef.current) streamManager.addVideoElement(videoRef.current);

    const initializeFaceDetector = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const handModel = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = { runtime: 'tfjs' };
      const handDetectorConfig = { runtime: 'tfjs', modelType: 'lite' };
      detector.current = await faceDetection.createDetector(model, detectorConfig);
      handDetector.current = await handPoseDetection.createDetector(handModel, handDetectorConfig);
    };
    initializeFaceDetector();

    const detect = async () => {
      let readyFace = false;
      let readyHand = false;
      // 게임 종료 로직
      if (data.isGameEnd) {
        data.data = {
          centerDistance: 0,
          sensitivity: 0,
          isLeftKeyPressed: false,
          isRightKeyPressed: false,
          isBreak : false,
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
      if(!!videoRef.current) {
        const video = videoRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        video.width = videoWidth;
        video.height = videoHeight;
        // 손 디텍트 Start ***********
        if(!!handDetector.current) {
          readyHand = true;
          try {
            const hands = await handDetector.current.estimateHands(video, estimationConfig);
            const centerX = videoWidth / 2;
            const leftX = videoWidth; 
            const rightX = 0;

            // 손을 인식 성공했다면
            if(!!hands) {
              let isLeftTouch = false;
              let isRightTouch = false;
              hands.forEach(hand => {
                hand.keypoints.forEach(point => {
                  // 왼쪽              
                  if (point.x > leftX - centerX/2) isLeftTouch = true;
                  // 오른쪽
                  else if(point.x < rightX + centerX/2) isRightTouch = true;
                })
              })
              

              // 아이템 사용
              if (isLeftTouch) data.isLeftItemUse = true;
              else if(isRightTouch) data.isRightItemUse = true;
              else {
                data.isLeftItemUse = false;
                data.isRightItemUse = false;
              }
            }

          } catch(error) {
            // console.log(error);
          }
        }
        // 손 디텍트 End ***********

        // 얼굴 디텍트 Start ***********
        if (!!detector.current) {
          try {
            const faces = await detector.current.estimateFaces(video, estimationConfig);
            // if( faces.length === 0 ) console.log(`no face`);
            // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
            const centerX = videoWidth / 2;
            if(!!faces) readyFace = true
            let noseX, noseY, rightEarTragionX, rightEarTragionY,
              leftEarTragionX, leftEarTragionY, leftEyeX, rightEyeX,
              mouthCenterY;

            faces[0]?.keypoints.forEach(obj => {
              if(obj.name === 'noseTip') {
                noseX = obj.x;
                noseY = obj.y;
                // 캠 반전때문에 방향을 반대로 값을 넣어줌
              } else if(obj.name === 'rightEarTragion') {
                leftEarTragionX = obj.x;
                leftEarTragionY = obj.y;
              } else if(obj.name === 'leftEarTragion') {
                rightEarTragionX = obj.x
                rightEarTragionY = obj.y;
              } else if(obj.name === 'rightEye') {
                leftEyeX = obj.x;
              } else if(obj.name === 'leftEye') {
                rightEyeX = obj.x;
              } else if(obj.name === 'mouthCenter') {
                mouthCenterY = obj.y;
              }
            })
            
            let sensitivity = Math.abs(noseY - mouthCenterY)*1.3; // 민감도
            // noseX: 269.99345779418945, centerX: 320, sensitivity: 32.98797607421875
            if(data.isGameStart) {
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

      if(readyHand && readyFace) {
        // console.log(`detect load 완료`)
        setIsLoadDetect(true)
      }
    };


    const runFaceDetection = () => {
      detect();
      requestAnimationFrame(runFaceDetection);
    };

    // 데이터 보내기 : 나의 데이터(객체)만 보낸다.
    const sendData = () => {
      const signalData = {
        type: 'custom',
        data: JSON.stringify(myGameData)
      };
  
      // 전송!
      mySession.signal(signalData)
        .then(() => {  })
        .catch((error) => { console.error('Error sending signal:', error); });
    }

    // 데이터 받기 : 다른사람의 데이터(객체) 수신
    const responseData = () => {
      mySession.on('signal:custom', (res) => {
        // console.log('Signal receive successfully')
        const newPlayerGameData = JSON.parse(res.data); // 수신한 다른사람의 객체 데이터

        let needPush = true; // push가 필요한지 check
        // 1. 수신한 데이터의 id가 내 id와 일치하면 필요없다.
        if(myGameData.playerId !== newPlayerGameData.playerId) {
          // 2. 수신한 데이터의 id가 내가 가지고 있는 데이터 리스트에 있다면 교체하고
          for (let i = 0; i < playerGameDataList.length; i++) {
            if(playerGameDataList[i].playerId === newPlayerGameData.playerId) {
              // 교체
              playerGameDataList[i] = newPlayerGameData;
              needPush = false;
              break;
            }
          }
          // 3. 없다면 새로 push 한다.
          if(needPush) playerGameDataList.push(newPlayerGameData); // 삽입
        }
      });
    }


    const sendDataStart = () => {
      // console.log(playerGameDataList);
      if(!mySession) {
        console.log(`error!!!!!!!!!!!!!!!!!!!`) 
        return;
      }

      if(isPlayingGame) sendData();

      // responseData();
      if(isPlayingGame) {
        setTimeout(() => {
          requestAnimationFrame(sendDataStart)
        }, 1000/100);
      }
    }
    
    const gameStart = () => {
      responseData(); // 1회 열기
      sendDataStart(); // 계속 실행
      runFaceDetection(); // 계속 실행
    }

    gameStart();

  }, [streamManager]);
  
  useEffect(() => {
    if(!!mySession) isPlayingGame = true;
    else isPlayingGame = false;
  }, [mySession])



  return <video autoPlay={true} ref={videoRef} style={{ transform: 'scaleX(-1)' }}/>;
};




export default MyOvVideo;
