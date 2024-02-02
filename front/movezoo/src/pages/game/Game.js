import { Link } from "react-router-dom";
import styles from "./Game.module.css";
import "./Game.module.css";
// import Webcam from "react-webcam";
import Back from "../../components/game/Back";

import Main from "../../components/play/Main";
import Cam from "../../components/play/Cam";

function Game() {
  return (
    <div>
      {/*일단 축소 화면*/}
      <div class={styles.container}>
        {/*왼쪽 화면, 게임 화면*/}
        <div className={styles.leftSection}>
          {/* <p style={{ textAlign: "center" }}>
            <strong>게임 화면</strong>
          </p> */}
          <Main width={1150} height={700}/>

          {/* 뒤로가면 메인 화면*/}
          <div className={styles.goBack}>
            <Back />
          </div>

          {/*웹캠*/}
          {/* <div className={styles.webCam}> */}
            <Cam />
          {/* </div> */}

          {/* <Webcam className={styles.webCam} mirrored={true} /> */}
        </div>

        {/*오른쪽 화면*/}
        <div className={styles.rightSection}>
          {/* 일단 결과창으로 넘어가는 버튼*/}
          <Link to="/Result">
            <button
              style={{
                textAlign: "center",
                width: 160,
                height: 80,
                backgroundColor: "skyblue",
              }}
            >
              넘어가기
              <br />
              (임시버튼)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Game;
