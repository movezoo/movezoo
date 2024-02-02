import { useRef, useEffect } from "react";
import "./Game.module.css";

import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import { data } from "./data.js";

const MyOpenViduVideoComponent = (props) => {
  const { streamManager } = props;
  // useRef로 웹캠, 캔버스, 게임 참조 변수 생성
  const webcamRef = useRef(null);
  const motionRef = useRef(null);

  useEffect(() => {
    if (!!webcamRef.current) {
      // Add video element to StreamManager during initial rendering
      streamManager.addVideoElement(webcamRef.current);
    }

    // PosNet을 실행하는 함수
    const runPosenet = async () => {
      // PosNet 모델 로드
      const net = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.5,
      });

      // 일정 간격으로 detect 함수 실행
      setInterval( ()=> {
        detect(net);
      }, 1000);
      // detect(net);
      
    };

    // Pose를 감지하고 콘솔에 결과 출력하는 함수
    const detect = async (net) => {
      console.log(tf.memory());
      // 웹캠이 정상적으로 로드되었는지 확인
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null
        // && webcamRef.current.video.readyState === 4
      ) {
        // 웹캠 비디오 및 크기 정보 가져오기
        const video = webcamRef.current;
        // const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.videoWidth;
        const videoHeight = webcamRef.current.videoHeight;
        // const videoWidth = webcamRef.current.video.videoWidth;
        // const videoHeight = webcamRef.current.video.videoHeight;

        /// 비디오 크기 설정
        webcamRef.current.width = videoWidth;
        webcamRef.current.height = videoHeight;
        // webcamRef.current.video.width = videoWidth;
        // webcamRef.current.video.height = videoHeight;

        // PoseNet을 사용하여 포즈 추정
        const pose = await net.estimateSinglePose(video);
        // console.log(pose)

        // 화면 기준 - 화면의 중앙을 기준으로 코의 좌표의 위치에 따른 진행 방향 결정, 민감도 설정 가능
        /**/
        const centerX = videoWidth / 2;
        let sensitivity = 50;
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
        tf.tidy(() => {
          drawCanvas(
            pose,
            video,
            videoWidth,
            videoHeight,
            motionRef,
            sensitivity
          );
          // requestAnimationFrame(() => {
          //   detect(net);
          // });
        });
      }
    };

    // 캔버스에 Pose를 그리는 함수
    const drawCanvas = (
      pose,
      video,
      videoWidth,
      videoHeight,
      canvas,
      sensitivity = 0
    ) => {
      const ctx = canvas.current.getContext("2d");
      canvas.current.width = videoWidth;
      canvas.current.height = videoHeight;

      // 가운데 수직 선 및 기준 수직 선 그리기
      const centerX = videoWidth / 2;
      drawLine(ctx, centerX, videoHeight, "blue");
      if (sensitivity > 0) {
        drawLine(ctx, centerX + sensitivity, videoHeight, "pink");
        drawLine(ctx, centerX - sensitivity, videoHeight, "pink");
      }

      // Pose의 키포인트와 스켈레톤 그리기
      drawKeypointsFlipped(pose["keypoints"], 0.5, ctx, centerX);
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
      ctx.beginPath(); // 초기화
      ctx.moveTo(X, 0); // 시작점
      ctx.lineTo(X, Y); // 도착점
      ctx.lineWidth = 2; // 선 두께
      ctx.strokeStyle = color;
      ctx.stroke(); // 선 긋기
    };

    // Posenet 실행

    runPosenet();
  }, [streamManager]);

  return (
    <div className="PoseNet">
      <header className="App-header">
        {/* 웹캠 및 캔버스 요소 추가 */}
        <video
          autoPlay={true}
          ref={webcamRef}
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

        <canvas
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
        />
      </header>
    </div>
  );
};

export default MyOpenViduVideoComponent;
