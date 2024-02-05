import { useRef, useEffect } from "react";
// import "./Game.module.css";
// import * as tf from'@tensorflow/tfjs-core';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

import { data } from "./data.js";

const MyOpenViduVideoComponent = (props) => {
  const { streamManager, mySession } = props;
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

          // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
          const centerX = videoWidth / 2;
          let sensitivity = 50;
          const noseX = faces[0]?.keypoints[2]?.x;

          // 결과에 따라 콘솔에 출력
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

        } catch (error) {
          console.error('Error detecting faces:', error);
        }
      }
    };


    const runFaceDetection = () => {
      detectFaces();
      requestAnimationFrame(runFaceDetection)
    };
    runFaceDetection();

    const sendData = () => {
      // console.log(data)
      const signalData = {
        type: 'custom',
        data: JSON.stringify(data)
      };
  
      // 전송!
      mySession.signal(signalData)
        .then(() => { console.log('Signal sent successfully'); })
        .catch((error) => { console.error('Error sending signal:', error); });
    }
    const connectData = () => {
      sendData();
      requestAnimationFrame(connectData)
    }
    connectData();

  }, [streamManager]);
  




  return (
    <div className="PoseNet">
      <header className="App-header">
        <video autoPlay={true} ref={videoRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 8,
            width: 640,
            height: 480,
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




export default MyOpenViduVideoComponent;
