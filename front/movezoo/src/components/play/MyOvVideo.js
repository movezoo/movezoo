import { useRef, useEffect, useState } from "react";
// import "./Game.module.css";
// import * as tf from'@tensorflow/tfjs-core';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

import { data, myGameData, playerGameDataList } from "./data.js";

const MyOvVideo = (props) => {
  const { streamManager, mySession, isPlayingGame } = props;
  const videoRef = useRef(null);
  const detector = useRef(null);


  useEffect(() => {
    if (!!videoRef.current) {
      // Add video element to StreamManager during initial rendering
      streamManager.addVideoElement(videoRef.current);
    }


    const initializeFaceDetector = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
        // solutionPath: '/@mediapipe/face_detection'
        // or 'base/node_modules/@mediapipe/face_detection' in npm.
        // solutionPath:'./node_modules/@mediapipe/face_detection',
      };
      // const faceDetector = await faceDetection.createDetector(model, detectorConfig);
      detector.current = await faceDetection.createDetector(model, detectorConfig);
      // setDetector(faceDetector);
    };
    initializeFaceDetector();

    const detectFaces = async () => {
      if (detector.current && videoRef.current) {
        const estimationConfig = { 
          flipHorizontal: false
        };

        try {
          const video = videoRef.current;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          video.width = videoWidth;
          video.height = videoHeight;
          const faces = await detector.current.estimateFaces(video, estimationConfig);
          if( faces.length === 0 ) console.log(`no face`);
          // console.log(faces);
          // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
          const centerX = videoWidth / 2;
          let sensitivity = 50;
          // const noseX = faces[0]?.keypoints[2]?.x;
          // const noseY = faces[0]?.keypoints[2]?.y;
          // console.log(faces[0]);
          // console.log(faces[0]?.keypoints);
          let noseX, noseY, rightEarTragionX, rightEarTragionY, leftEarTragionX, leftEarTragionY, leftEyeX, rightEyeX;
          faces[0]?.keypoints.forEach((obj) => {
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
            }


            // noseTip
            // rightEarTragion
            // leftEarTragion
            // leftEye
            // rightEye
            // mouthCenter
          })
          // const rightEarTragionY = faces[0]?.keypoints[4]?.y;
          // const leftEarTragionY = faces[0]?.keypoints[5]?.y;

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
          if ( rightEarTragionY > noseY && leftEarTragionY > noseY) {
            data.isRun = false;
            data.isBreak = true;
            // console.log(`break!!!`)
          } else {
            data.isRun = true;
            data.isBreak = false;
          }

          // 고개 왼쪽으로 돌리기 detect(귀와 코를 기준으로)
          if (rightEarTragionX < noseX) console.log(`turn left: 왼쪽 아이템 사용`)
          // if (rightEarTragionX < leftEyeX) console.log(`turn left: 왼쪽 아이템 사용`)
          // 오른쪽으로 돌리기
          else if(leftEarTragionX > noseX) console.log(`turn right: 오른쪽 아이템 사용`)
          // else if(leftEarTragionX > rightEyeX) console.log(`turn right: 오른쪽 아이템 사용`)

        } catch (error) {
          console.error('Error detecting faces:', error);
        }
      }
    };


    const runFaceDetection = () => {
      detectFaces();
      requestAnimationFrame(runFaceDetection)
    };

    // runFaceDetection();
    




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
      sendData();

      // responseData();
      if(isPlayingGame) requestAnimationFrame(sendDataStart)
    }
    
    
    const gameStart = () => {
      responseData(); // 1회 열기
      sendDataStart(); // 계속 실행
      runFaceDetection(); // 계속 실행
    }

    gameStart();
  }, [streamManager]);
  




  return (
    <div className="PoseNet">
      <header className="App-header">
        <video autoPlay={true} ref={videoRef}
          style={{
            position: "relative",
            display: "flex",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 8,
            // width: 640,
            // height: 480,
            transform: "scale(-1,1)",
          }}
        />

        {/* <canvas
          ref={motionRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        /> */}
      </header>
    </div>
  );
};




export default MyOvVideo;
