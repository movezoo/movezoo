import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/single/game/Back";
import Main from "../../../components/play/Main";
import "./Game.css";
import { data } from "../../../components/play/data.js";


import '@mediapipe/face_detection';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';



function Game(props) {

  const videoRef = useRef(null);
  const detector = useRef(null);

  useEffect(() => {

    const initializeFaceDetector = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
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
    
    
    const gameStart = () => {
      runFaceDetection(); // 계속 실행
    }

    gameStart();

  }, [videoRef]);




























  return (
    <div className="singlegame-container">
      {/* 뒤로가면 메인 화면*/}
      <div className="Back">
        <Back />
      </div>

      {/*왼쪽 화면, 게임 화면*/}
      <div className="singlegame-body">
        {/* <p style={{ textAlign: "center" }}>
          <strong>게임 화면</strong>
        </p> */}
        <div className="game">
          <Main width={1280} height={720} />
        </div>
        <div className="singlegame-cam">
          {/* <Cam /> */}
          <Webcam className="single-webCam" mirrored={true} ref={videoRef}/>
        </div>
      </div>

      {/*오른쪽 화면*/}
      <div className="singlegame-select">
        <div>
          <Link to="/Result">넘어가기</Link>
        </div>
      </div>

    </div>
  );
}
export default Game;
