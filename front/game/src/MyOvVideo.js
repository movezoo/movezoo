import { useRef, useEffect, useState } from "react";
import "./App.css";

import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs";
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
// Register WebGL backend.
import * as faceDetection from '@tensorflow-models/face-detection';

import { data } from "./data.js";

const MyOpenViduVideoComponent = (props) => {
  const { streamManager } = props;
  const videoRef = useRef(null);
  const motionRef = useRef(null);
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    if (!!videoRef.current) {
      // Add video element to StreamManager during initial rendering
      streamManager.addVideoElement(videoRef.current);
    }

    const initializeFaceDetector = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection'
        // or 'base/node_modules/@mediapipe/face_detection' in npm.
        // solutionPath:'./node_modules/@mediapipe/face_detection',
      };
      const faceDetector = await faceDetection.createDetector(model, detectorConfig);
      setDetector(faceDetector);
    };
    initializeFaceDetector();

    const detectFaces = async () => {
      if (detector && videoRef.current) {
        const estimationConfig = { flipHorizontal: false };

        try {
          const video = videoRef.current;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          video.width = videoWidth;
          video.height = videoHeight;

          const faces = await detector.estimateFaces(video, estimationConfig);
          // console.log("Detected faces:", faces);
          // 웹캠 비디오 및 크기 정보 가져오기


          // console.log(faces);
          // PoseNet을 사용하여 포즈 추정
        // console.log(pose)

        // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
        /**/
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

    const runFaceDetection = async () => {
      // Run face detection on each frame
      detectFaces();
      // Request animation frame for continuous detection
      requestAnimationFrame(runFaceDetection);
    };
    runFaceDetection();

  }, [streamManager, detector]);

  return (
    <div className="PoseNet">
      <header className="App-header">
        {/* 웹캠 및 캔버스 요소 추가 */}
        <video
          autoPlay={true}
          ref={videoRef}
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
