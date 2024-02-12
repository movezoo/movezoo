import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/single/game/Back";
import Main from "../../../components/play/Main";
import Cam from "../../../components/play/Cam";
import "./Game.css";

function Game() {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, [containerRef]);

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
          <Webcam className="single-webCam" mirrored={true} />
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
