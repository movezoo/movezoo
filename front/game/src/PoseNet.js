import { useRef } from 'react';
import "./App.css";
import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from './utilities';
import { data } from './data.js';

function PoseNet() {

  // 텐서플로우에서 사용중인 백엔드를 알 수 있는 코드
  // setTimeout( ()=> {
  //   console.log(tf.getBackend());
  // }, 1000)
  // useRef로 웹캠, 캔버스, 게임 참조 변수 생성
  const webcamRef = useRef(null);
  const motionRef = useRef(null);

  // PosNet을 실행하는 함수
  const runPosenet = async () => {
    // PosNet 모델 로드
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5
    });

    // 일정 간격으로 detect 함수 실행
    setInterval(() => {
      detect(net);
    }, 500);
  };

  // Pose를 감지하고 콘솔에 결과 출력하는 함수
  const detect = async (net) => {
    // 웹캠이 정상적으로 로드되었는지 확인
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // 웹캠 비디오 및 크기 정보 가져오기
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      
      /// 비디오 크기 설정
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // PoseNet을 사용하여 포즈 추정
      const pose = await net.estimateSinglePose(video);
      // console.log(pose)

      // 사람 기준 - 양 어깨 사이의 한 점을 기준으로 눈, 코, 귀 들의 좌표의 위치에 따른 진행 방향 결정
      /*
      // 어깨의 중앙 좌표 계산
      const center = (pose.keypoints[5].position.x + pose.keypoints[6].position.x) / 2;

      // 각 포인트의 x 좌표 가져오기
      const pose0 = pose.keypoints[0].position.x;
      const pose1 = pose.keypoints[1].position.x;
      const pose2 = pose.keypoints[2].position.x;
      const pose3 = pose.keypoints[3].position.x;
      const pose4 = pose.keypoints[4].position.x;

      // 중앙을 기준으로 왼쪽, 오른쪽 판별
      let count = 0;
      const lst = [pose0, pose1, pose2, pose3, pose4];

      for (let i = 0; i < lst.length; i++) {
        const num = lst[i]
        if (num > center) {
          count++;
        }
      }

      // 결과에 따라 콘솔에 출력
      if (count < 2) {
        console.log("Right");
      } else if (count > 3) {
        console.log("Left");
      } else {
        console.log("Forward");
      }

      // 캔버스에 Pose 그리기
      drawCanvas(pose, video, videoWidth, videoHeight, motionRef);
      */

      // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
      /**/
      const centerX = videoWidth / 2;
      let sensitivity = 50
      const poseNose = pose.keypoints[0].position.x;
      
      // 결과에 따라 콘솔에 출력
      if (poseNose < centerX - sensitivity) {
        data.isLeftKeyPressed = false;
        data.isRightKeyPressed = true;
        // console.log("Right");
      } else if (poseNose > centerX + sensitivity) {
        data.isRightKeyPressed = false;
        data.isLeftKeyPressed = true;
        // console.log("Left");
      } else {
        data.isRightKeyPressed = false;
        data.isLeftKeyPressed = false;
      }
      
      // 캔버스에 Pose 그리기
      drawCanvas(pose, video, videoWidth, videoHeight, motionRef, sensitivity);

    }
  };

  // 캔버스에 Pose를 그리는 함수
  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas, sensitivity=0) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    // 가운데 수직 선 및 기준 수직 선 그리기
    const centerX = videoWidth / 2;
    drawLine(ctx, centerX, videoHeight, "blue")
    if (sensitivity > 0) {
      drawLine(ctx, centerX + sensitivity, videoHeight, "pink")
      drawLine(ctx, centerX - sensitivity, videoHeight, "pink")
    }

    // Pose의 키포인트와 스켈레톤 그리기
    drawKeypointsFlipped(pose["keypoints"], 0.5, ctx, centerX);

    // Pose의 키포인트와 스켈레톤 그리기
    // drawKeypoints(pose["keypoints"], 0.5, ctx);
    // drawSkeleton(pose["keypoints"], 0.5, ctx);
  };

  // 좌우 반전된 키포인트 그리기
  const drawKeypointsFlipped = (keypoints, minConfidence, ctx, flipX) => {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];

      // 좌우 반전을 적용하여 x 좌표 계산
      const x = flipX - (keypoint.position.x - flipX);

      if (keypoint.score >= minConfidence) {
        ctx.beginPath();
        ctx.arc(x, keypoint.position.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    }
  };

  const drawLine = (ctx, X, Y, color) => {
    ctx.beginPath();    // 초기화
    ctx.moveTo(X, 0);   // 시작점
    ctx.lineTo(X, Y);   // 도착점
    ctx.lineWidth = 2;  // 선 두께
    ctx.strokeStyle = color;
    ctx.stroke();       // 선 긋기
  }

  // Posenet 실행
  runPosenet();

  return (
    <div className="PoseNet">
      <header className="App-header">
        {/* 웹캠 및 캔버스 요소 추가 */}
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 1000,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
          mirrored={true}
        />

        <canvas
          ref={motionRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 1000,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default PoseNet;
